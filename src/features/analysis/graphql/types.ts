import { z } from 'zod'

export type GetVulByNodesMetadataFilter = {
  path: {
    _eq: string
  }
  _or: {
    startLine: {
      _gte: number
      _lte: number
    }
    endLine: {
      _gte: number
      _lte: number
    }
  }[]
}

export type GetVulByNodeHunk = {
  path: string
  ranges: {
    startLine: number
    endLine: number
  }[]
}

export type GetVulByNodesMetadataParams = {
  vulnerabilityReportId: string
  hunks: GetVulByNodeHunk[]
}

export type GetVulByNodesMetadataQueryParams = {
  filters: { _or: GetVulByNodesMetadataFilter[] }
  vulnerabilityReportId: string
}

const VulnerabilityReportIssueCodeNodeZ = z.object({
  vulnerabilityReportIssueId: z.string(),
  path: z.string(),
  startLine: z.number(),
  vulnerabilityReportIssue: z.object({
    fixId: z.string(),
  }),
})

export const GetVulByNodesMetadataZ = z.object({
  vulnerabilityReportIssueCodeNodes: z.array(VulnerabilityReportIssueCodeNodeZ),
  nonFixablePrVuls: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  fixablePrVuls: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  totalScanVulnerabilities: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
})

export type VulnerabilityReportIssueCodeNode = z.infer<
  typeof VulnerabilityReportIssueCodeNodeZ
>
