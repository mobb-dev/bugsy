import {
  Vulnerability_Report_Issue_Category_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
} from '@mobb/bugsy/features/analysis/scm/generates/client_generates'
import { z } from 'zod'

type LineFilter =
  | {
      startLine: {
        _gte: number
        _lte: number
      }
    }
  | {
      endLine: {
        _gte: number
        _lte: number
      }
    }

export type GetVulByNodesMetadataFilter = {
  path: {
    _eq: string
  }
  _or: LineFilter[]
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
    category: z.nativeEnum(Vulnerability_Report_Issue_Category_Enum),
    safeIssueType: z.string(),
    vulnerabilityReportIssueTags: z.array(
      z.object({
        tag: z.nativeEnum(Vulnerability_Report_Issue_Tag_Enum),
      })
    ),
  }),
})

const VulnerabilityReportIssueNoFixCodeNodeZ = z.object({
  vulnerabilityReportIssues: z.array(
    z.object({
      id: z.string(),
      fixId: z.string().nullable(),
      category: z.nativeEnum(Vulnerability_Report_Issue_Category_Enum),
      safeIssueType: z.string(),
      fpId: z.string().uuid().nullable(),
      codeNodes: z.array(
        z.object({
          path: z.string(),
          startLine: z.number(),
        })
      ),
      vulnerabilityReportIssueTags: z.array(
        z.object({
          tag: z.nativeEnum(Vulnerability_Report_Issue_Tag_Enum),
        })
      ),
    })
  ),
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
  irrelevantVulnerabilityReportIssue: z.array(
    VulnerabilityReportIssueNoFixCodeNodeZ
  ),
})

export type VulnerabilityReportIssueCodeNode = z.infer<
  typeof VulnerabilityReportIssueCodeNodeZ
>
