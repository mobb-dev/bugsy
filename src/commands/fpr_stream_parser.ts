import fs from 'node:fs'

import sax, { QualifiedTag, SAXStream, Tag } from 'sax'

export type SourceLocation = {
  path: string
  line: string
  lineEnd: string
  colStart: string
  colEnd: string
}

export type NodeRef = {
  id: string
}

export type Vulnerability = {
  nodes: (NodeRef | SourceLocation)[]
  instanceID: string
  instanceSeverity: string
  confidence: string
  classID: string
  type: string
  subtype: string
  metaInfo: Record<string, string>
}

type ReportMetadata = {
  uuid: string
  createdTSDate: string
  createdTSTime: string
  rules: Record<string, Record<string, string>>
}

class BaseStreamParser {
  protected currentPath: string[] = []

  constructor(parser: SAXStream) {
    parser.on('opentag', (tag) => this.onOpenTag(tag))
    parser.on('closetag', () => this.onCloseTag())
    parser.on('text', (text) => this.onText(text))
  }

  protected getPathString() {
    return this.currentPath.join(' > ')
  }

  protected onOpenTag(tag: Tag | QualifiedTag) {
    this.currentPath.push(tag.name)
  }

  protected onCloseTag() {
    this.currentPath.pop()
  }

  protected onText(_text: string) {}
}

export class AuditMetadataParser extends BaseStreamParser {
  private suppressedMap: Record<string, string> = {}

  protected override onOpenTag(tag: Tag | QualifiedTag) {
    super.onOpenTag(tag)

    switch (this.getPathString()) {
      case 'Audit > IssueList > Issue':
        this.suppressedMap[String(tag.attributes['instanceId'] ?? '')] = String(
          tag.attributes['suppressed'] ?? ''
        )
        break
    }
  }

  public getAuditMetadata() {
    return this.suppressedMap
  }
}

export class ReportMetadataParser extends BaseStreamParser {
  private uuid: string = ''
  private createdTSDate: string = ''
  private createdTSTime: string = ''
  private rules: Record<string, Record<string, string>> = {}
  private ruleId: string = ''
  private groupName: string = ''

  protected override onOpenTag(tag: Tag | QualifiedTag) {
    super.onOpenTag(tag)

    switch (this.getPathString()) {
      case 'FVDL > EngineData > RuleInfo > Rule':
        this.ruleId = String(tag.attributes['id'] ?? '')
        break
      case 'FVDL > EngineData > RuleInfo > Rule > MetaInfo > Group':
        this.groupName = String(tag.attributes['name'] ?? '')
        break
      case 'FVDL > CreatedTS':
        this.createdTSDate = String(tag.attributes['date'] ?? '')
        this.createdTSTime = String(tag.attributes['time'] ?? '')
        break
    }
  }

  protected override onText(text: string) {
    super.onText(text)

    switch (this.getPathString()) {
      case 'FVDL > UUID':
        this.uuid = text
        break
      case 'FVDL > EngineData > RuleInfo > Rule > MetaInfo > Group': {
        const ruleMeta = this.rules[this.ruleId] ?? {}

        ruleMeta[this.groupName] = text
        this.rules[this.ruleId] = ruleMeta

        break
      }
    }
  }

  public getReportMetadata(): ReportMetadata {
    return {
      createdTSDate: this.createdTSDate,
      createdTSTime: this.createdTSTime,
      uuid: this.uuid,
      rules: this.rules,
    }
  }
}

export class UnifiedNodePoolParser extends BaseStreamParser {
  private codePoints: Record<string, SourceLocation> = {}
  private nodeId: string = ''

  protected override onOpenTag(tag: Tag | QualifiedTag) {
    super.onOpenTag(tag)

    switch (this.getPathString()) {
      case 'FVDL > UnifiedNodePool > Node':
        this.nodeId = String(tag.attributes['id'] ?? '')
        break
      case 'FVDL > UnifiedNodePool > Node > SourceLocation':
        this.codePoints[this.nodeId] = {
          path: String(tag.attributes['path'] ?? ''),
          colStart: String(tag.attributes['colStart'] ?? ''),
          colEnd: String(tag.attributes['colEnd'] ?? ''),
          line: String(tag.attributes['line'] ?? ''),
          lineEnd: String(tag.attributes['lineEnd'] ?? ''),
        }
        break
    }
  }

  public getNodesPull() {
    return this.codePoints
  }
}

export class VulnerabilityParser extends BaseStreamParser {
  private vulnerabilities: Vulnerability[] = []
  private isInVulnerability: boolean = false
  private codePoints: (NodeRef | SourceLocation)[] = []
  private metadata: Record<string, string> = {}
  private metaInfo: Record<string, string> = {}
  private groupName: string = ''

  protected override onOpenTag(tag: Tag | QualifiedTag) {
    super.onOpenTag(tag)

    switch (this.getPathString()) {
      case 'FVDL > Vulnerabilities > Vulnerability':
        this.isInVulnerability = true
        this.metadata = {}
        this.metaInfo = {}
        this.codePoints = []
        break
      case 'FVDL > Vulnerabilities > Vulnerability > InstanceInfo > MetaInfo > Group':
        this.groupName = String(tag.attributes['name'] ?? '')
        break
    }

    if (this.isInVulnerability) {
      if (this.getPathString().endsWith(' > Entry > Node > SourceLocation')) {
        this.codePoints.push({
          path: String(tag.attributes['path'] ?? ''),
          colStart: String(tag.attributes['colStart'] ?? ''),
          colEnd: String(tag.attributes['colEnd'] ?? ''),
          line: String(tag.attributes['line'] ?? ''),
          lineEnd: String(tag.attributes['lineEnd'] ?? ''),
        })
      } else if (this.getPathString().endsWith(' > Entry > NodeRef')) {
        this.codePoints.push({
          id: String(tag.attributes['id'] ?? ''),
        })
      }
    }
  }

  protected override onText(text: string) {
    super.onText(text)
    const lastPathSegment = this.currentPath.at(-1)

    if (!this.isInVulnerability || !lastPathSegment) {
      return
    }

    switch (this.getPathString()) {
      case 'FVDL > Vulnerabilities > Vulnerability > InstanceInfo > InstanceID':
      case 'FVDL > Vulnerabilities > Vulnerability > InstanceInfo > InstanceSeverity':
      case 'FVDL > Vulnerabilities > Vulnerability > InstanceInfo > Confidence':
      case 'FVDL > Vulnerabilities > Vulnerability > ClassInfo > ClassID':
      case 'FVDL > Vulnerabilities > Vulnerability > ClassInfo > Type':
      case 'FVDL > Vulnerabilities > Vulnerability > ClassInfo > Subtype':
        this.metadata[lastPathSegment] = text
        break
      case 'FVDL > Vulnerabilities > Vulnerability > InstanceInfo > MetaInfo > Group':
        this.metaInfo[this.groupName] = text
        break
    }
  }

  protected override onCloseTag() {
    if (this.getPathString() === 'FVDL > Vulnerabilities > Vulnerability') {
      this.isInVulnerability = false

      this.vulnerabilities.push({
        nodes: this.codePoints,
        instanceID: this.metadata['InstanceID'] ?? '',
        instanceSeverity: this.metadata['InstanceSeverity'] ?? '',
        confidence: this.metadata['Confidence'] ?? '',
        classID: this.metadata['ClassID'] ?? '',
        type: this.metadata['Type'] ?? '',
        subtype: this.metadata['Subtype'] ?? '',
        metaInfo: this.metaInfo,
      })
    }

    super.onCloseTag()
  }

  public getVulnerabilities() {
    return this.vulnerabilities
  }
}

export function initSaxParser(filepath: string) {
  const parser = sax.createStream(true)
  const awaiter = new Promise((resolve, reject) => {
    parser.on('end', () => resolve(true))
    parser.on('error', (e) => reject(e))
  })

  return {
    parser,
    parse: async () => {
      fs.createReadStream(filepath).pipe(parser)
      await awaiter
    },
  }
}
