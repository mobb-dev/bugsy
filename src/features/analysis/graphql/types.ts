import { z } from 'zod'

import {
  Vulnerability_Report_Issue_Category_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
} from '../scm/generates/client_generates'

/**
 * Server-side pre-filter for getVulByNodesMetadata: jsonb array containment is
 * true when SOME element of `nodes` contains `{path}` — exactly "the issue has
 * a code node in this file". Line windows can't be expressed with `_contains`,
 * so they are matched client-side (matchVulByNodesMetadata).
 */
export type CodeNodesJsonPathFilter = {
  codeNodesJson: { nodes: { _contains: [{ path: string }] } }
}

export function codeNodesJsonPathFilter(path: string): CodeNodesJsonPathFilter {
  return { codeNodesJson: { nodes: { _contains: [{ path }] } } }
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

// One JSONB code node, validating only the fields the PR-review matcher
// dereferences (the stored rows carry more); malformed entries are dropped
// per-node via safeParse rather than failing the whole review.
export const VulByNodesMetadataCodeNodeZ = z
  .object({
    index: z.number().int(),
    path: z.string(),
    startLine: z.number().int(),
    endLine: z.number().int(),
  })
  .loose()

export type VulByNodesMetadataCodeNode = z.infer<
  typeof VulByNodesMetadataCodeNodeZ
>

const VulnerabilityReportIssueWithNodesZ = z.object({
  id: z.string(),
  fixId: z.string().nullable(),
  category: z.enum(Vulnerability_Report_Issue_Category_Enum),
  safeIssueType: z.string(),
  fpId: z.guid().nullable(),
  vulnerabilityReportIssueTags: z.array(
    z.object({
      tag: z.enum(Vulnerability_Report_Issue_Tag_Enum),
    })
  ),
  codeNodesJson: z.object({ nodes: z.unknown() }).nullable(),
})

export type VulnerabilityReportIssueWithNodes = z.infer<
  typeof VulnerabilityReportIssueWithNodesZ
>

export const GetVulByNodesMetadataZ = z.object({
  vulnerabilityReportIssues: z.array(VulnerabilityReportIssueWithNodesZ),
  totalScanVulnerabilities: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
})

// The consumer-facing row shape, unchanged from the legacy relational query so
// add_fix_comments_for_pr and its types (derived via ReturnType) never see the
// storage move.
export type VulnerabilityReportIssueCodeNode = {
  vulnerabilityReportIssueId: string
  path: string
  startLine: number
  vulnerabilityReportIssue: {
    fixId: string
    category: Vulnerability_Report_Issue_Category_Enum
    safeIssueType: string
    vulnerabilityReportIssueTags: {
      tag: Vulnerability_Report_Issue_Tag_Enum
    }[]
  }
}
