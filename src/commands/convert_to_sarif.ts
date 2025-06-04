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
import multimatch from 'multimatch'
import StreamZip from 'node-stream-zip'
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
  const zipIn = new StreamZip.async({ file: inputFilePath })
  const zipInEntries = await zipIn.entries()

  if (!('audit.fvdl' in zipInEntries)) {
    throw new CliError(
      '\nError: the input file should be in a valid Fortify FPR format.'
    )
  }

  const tmpObj = tmp.dirSync({
    unsafeCleanup: true,
  })

  try {
    const auditFvdlPath = path.join(tmpObj.name, 'audit.fvdl')

    await zipIn.extract('audit.fvdl', auditFvdlPath)

    const auditFvdlSaxParser = initSaxParser(auditFvdlPath)
    const vulnerabilityParser = new VulnerabilityParser(
      auditFvdlSaxParser.parser,
      path.join(tmpObj.name, 'vulns.json')
    )
    const unifiedNodePoolParser = new UnifiedNodePoolParser(
      auditFvdlSaxParser.parser
    )
    const reportMetadataParser = new ReportMetadataParser(
      auditFvdlSaxParser.parser
    )
    let auditMetadataParser: AuditMetadataParser | null = null

    await auditFvdlSaxParser.parse()

    if ('audit.xml' in zipInEntries) {
      const auditXmlPath = path.join(tmpObj.name, 'audit.xml')

      await zipIn.extract('audit.xml', auditXmlPath)

      const auditXmlSaxParser = initSaxParser(auditXmlPath)

      auditMetadataParser = new AuditMetadataParser(auditXmlSaxParser.parser)

      await auditXmlSaxParser.parse()
    }

    await zipIn.close()

    // We must write JSON manually as JSON.serialize fails for large data.
    const writer = fs.createWriteStream(outputFilePath)

    writer.write(`{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [
  {
    "tool": {
      "driver": {
        "name": "Fortify Mobb Converter"
      }
    },
    "results": [\n`)

    let isFirstVuln = true

    for await (const vulnerability of vulnerabilityParser.getVulnerabilities()) {
      const sarifResult = fortifyVulnerabilityToSarifResult(
        vulnerability,
        auditMetadataParser,
        reportMetadataParser,
        unifiedNodePoolParser
      )

      if (filterSarifResult(sarifResult, codePathPatterns)) {
        if (isFirstVuln) {
          isFirstVuln = false
        } else {
          writer.write(',\n')
        }

        writer.write(JSON.stringify(sarifResult, null, 2))
      }
    }

    writer.write('\n]}]}')

    await new Promise((r) => writer.end(r))
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
