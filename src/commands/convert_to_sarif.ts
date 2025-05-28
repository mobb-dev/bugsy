import fs from 'node:fs'
import path from 'node:path'

import { ConvertToSarifOptions } from '@mobb/bugsy/args'
import {
  AuditMetadataParser,
  initSaxParser,
  NodeRef,
  ReportMetadataParser,
  SourceLocation,
  UnifiedNodePoolParser,
  Vulnerability,
  VulnerabilityParser,
} from '@mobb/bugsy/commands/fpr_stream_parser'
import { ConvertToSarifInputFileFormat } from '@mobb/bugsy/features/analysis/scm'
import { CliError } from '@mobb/bugsy/utils'
import AdmZip from 'adm-zip'
import multimatch from 'multimatch'
import tmp from 'tmp'

type Message = {
  text: string
}

type Region = {
  startLine: number
  endLine?: number
  startColumn: number
  endColumn?: number
}

type ArtifactLocation = {
  uri: string
}

type PhysicalLocation = {
  artifactLocation: ArtifactLocation
  region: Region
}

type Location = {
  physicalLocation: PhysicalLocation
}

type SarifResult = {
  properties: Record<string, string>
  ruleId: string
  message: Message
  locations: Location[]
}

export async function convertToSarif(options: ConvertToSarifOptions) {
  switch (options.inputFileFormat) {
    case ConvertToSarifInputFileFormat.FortifyFPR:
      await convertFprToSarif(
        options.inputFilePath,
        options.outputFilePath,
        options.codePathPatterns ?? ['**', '*']
      )
      break
  }
}

async function convertFprToSarif(
  inputFilePath: string,
  outputFilePath: string,
  codePathPatterns: string[]
) {
  const zipIn = new AdmZip(inputFilePath)

  if (!zipIn.getEntry('audit.fvdl')) {
    throw new CliError(
      '\nError: the input file should be in a valid Fortify FPR format.'
    )
  }

  const tmpObj = tmp.dirSync({
    unsafeCleanup: true,
  })

  try {
    zipIn.extractEntryTo('audit.fvdl', tmpObj.name)

    const auditFvdlSaxParser = initSaxParser(
      path.join(tmpObj.name, 'audit.fvdl')
    )
    const vulnerabilityParser = new VulnerabilityParser(
      auditFvdlSaxParser.parser
    )
    const unifiedNodePoolParser = new UnifiedNodePoolParser(
      auditFvdlSaxParser.parser
    )
    const reportMetadataParser = new ReportMetadataParser(
      auditFvdlSaxParser.parser
    )
    let auditMetadataParser: AuditMetadataParser | null = null

    await auditFvdlSaxParser.parse()

    if (zipIn.getEntry('audit.xml')) {
      zipIn.extractEntryTo('audit.xml', tmpObj.name)

      const auditXmlSaxParser = initSaxParser(
        path.join(tmpObj.name, 'audit.xml')
      )

      auditMetadataParser = new AuditMetadataParser(auditXmlSaxParser.parser)

      await auditXmlSaxParser.parse()
    }

    // We have to write JSON in manually as JSON.serialize fails for large data.
    fs.writeFileSync(
      outputFilePath,
      `{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [
  {
    "tool": {
      "driver": {
        "name": "Fortify Mobb Converter"
      }
    },
    "results": [\n`
    )

    const filteredVulns = vulnerabilityParser
      .getVulnerabilities()
      .map((vulnerability) =>
        fortifyVulnerabilityToSarifResult(
          vulnerability,
          auditMetadataParser,
          reportMetadataParser,
          unifiedNodePoolParser
        )
      )
      .filter((sarifResult) => filterSarifResult(sarifResult, codePathPatterns))

    filteredVulns.forEach((sarifResult, index) => {
      fs.appendFileSync(outputFilePath, JSON.stringify(sarifResult, null, 2))

      if (index !== filteredVulns.length - 1) {
        fs.appendFileSync(outputFilePath, ',\n')
      }
    })

    fs.appendFileSync(outputFilePath, '\n]}]}')
  } finally {
    tmpObj.removeCallback()
  }
}

function filterSarifResult(
  sarifResult: SarifResult,
  codePathPatterns: string[]
): boolean {
  const paths = sarifResult.locations.map(
    (l) => l.physicalLocation.artifactLocation.uri
  )
  const uniquePaths: string[] = [...new Set(paths)]
  const matchPaths = multimatch(uniquePaths, codePathPatterns, {
    dot: true,
  })

  return matchPaths.length === uniquePaths.length
}

function fortifyVulnerabilityToSarifResult(
  vulnerability: Vulnerability,
  auditMetadataParser: AuditMetadataParser | null,
  reportMetadataParser: ReportMetadataParser,
  unifiedNodePoolParser: UnifiedNodePoolParser
): SarifResult {
  const suppressed =
    auditMetadataParser?.getAuditMetadata()[vulnerability.instanceID] || 'false'
  const ruleMeta =
    reportMetadataParser.getReportMetadata().rules[vulnerability.classID] ?? {}

  return {
    ruleId:
      vulnerability.type +
      (vulnerability.subtype ? `: ${vulnerability.subtype}` : ''),
    properties: {
      package: ruleMeta['package'] ?? '',
      probability:
        vulnerability.metaInfo['Probability'] ?? ruleMeta['Probability'] ?? '',
      impact: vulnerability.metaInfo['Impact'] ?? ruleMeta['Impact'] ?? '',
      accuracy:
        vulnerability.metaInfo['Accuracy'] ?? ruleMeta['Accuracy'] ?? '',
      confidence: vulnerability.confidence,
      instanceID: vulnerability.instanceID,
      instanceSeverity: vulnerability.instanceSeverity,
      suppressed: suppressed,
    },
    locations: fortifyNodesToSarifLocations(
      vulnerability.nodes,
      unifiedNodePoolParser
    ),
    message: {
      text: 'no message',
    },
  }
}

function fortifyNodesToSarifLocations(
  nodes: (SourceLocation | NodeRef)[],
  unifiedNodePoolParser: UnifiedNodePoolParser
): Location[] {
  return nodes.map((node) => {
    let sourceLocation: SourceLocation

    if ('id' in node) {
      const poolNode = unifiedNodePoolParser.getNodesPull()[node.id]

      if (poolNode) {
        sourceLocation = poolNode
      } else {
        throw new CliError(
          '\nError: the input file should be in a valid Fortify FPR format (broken unified node pool).'
        )
      }
    } else {
      sourceLocation = node
    }

    return {
      physicalLocation: {
        artifactLocation: {
          uri: sourceLocation.path,
        },
        region: {
          startLine: parseInt(sourceLocation.line || '0', 10),
          endLine: sourceLocation.lineEnd
            ? parseInt(sourceLocation.lineEnd, 10)
            : undefined,
          startColumn: parseInt(sourceLocation.colStart || '0', 10),
          endColumn: sourceLocation.colEnd
            ? parseInt(sourceLocation.colEnd, 10)
            : undefined,
        },
      },
    }
  })
}
