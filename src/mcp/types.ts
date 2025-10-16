import { z } from 'zod'

import {
  IssueType_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
  Vulnerability_Severity_Enum,
} from '../features/analysis/scm/generates/client_generates'

export const ScanAndFixVulnerabilitiesToolSchema = z.object({
  path: z.string(),
})

export type ScanAndFixVulnerabilitiesToolSchema = z.infer<
  typeof ScanAndFixVulnerabilitiesToolSchema
>

// Schema for vulnerability report issue tags
const VulnerabilityReportIssueTagSchema = z.object({
  vulnerability_report_issue_tag_value: z.nativeEnum(
    Vulnerability_Report_Issue_Tag_Enum
  ),
})

// Schema for vulnerability report issues
const VulnerabilityReportIssueSchema = z.object({
  category: z.any().optional().nullable(),
  parsedIssueType: z.nativeEnum(IssueType_Enum).nullable().optional(),
  parsedSeverity: z
    .nativeEnum(Vulnerability_Severity_Enum)
    .nullable()
    .optional(),
  vulnerabilityReportIssueTags: z.array(VulnerabilityReportIssueTagSchema),
})

// Schema for shared state
const SharedStateSchema = z.object({
  __typename: z.literal('fix_shared_state').optional(),
  id: z.any(), // GraphQL uses `any` type for UUID
  downloadedBy: z.array(z.any().nullable()).optional().nullable(),
})

// Schema for unstructured extra context (matches GraphQL UnstructuredFixExtraContext)
const UnstructuredFixExtraContextSchema = z.object({
  __typename: z.literal('UnstructuredFixExtraContext').optional(),
  key: z.string(),
  value: z.any(), // GraphQL JSON type
})

// Schema for fix extra context response (matches GraphQL FixExtraContextResponse)
const FixExtraContextResponseSchema = z.object({
  __typename: z.literal('FixExtraContextResponse').optional(),
  extraContext: z.array(UnstructuredFixExtraContextSchema),
  fixDescription: z.string(),
})

// Schema for FixData variant of patchAndQuestions
const FixDataSchema = z.object({
  __typename: z.literal('FixData'),
  patch: z.string(),
  patchOriginalEncodingBase64: z.string(),
  extraContext: FixExtraContextResponseSchema,
})

// Schema for GetFixNoFixError variant of patchAndQuestions
const GetFixNoFixErrorSchema = z.object({
  __typename: z.literal('GetFixNoFixError'),
})

// Union schema for patchAndQuestions
const PatchAndQuestionsSchema = z.union([FixDataSchema, GetFixNoFixErrorSchema])

// Schema for McpFix based on FixDetails fragment
export const McpFixSchema = z.object({
  __typename: z.literal('fix').optional(),
  id: z.any(), // GraphQL uses `any` type for UUID
  confidence: z.number(),
  safeIssueType: z.string().nullable(),
  severityText: z.string().nullable(),
  gitBlameLogin: z.string().nullable().optional(), // Optional in GraphQL
  severityValue: z.number().nullable(),
  vulnerabilityReportIssues: z.array(VulnerabilityReportIssueSchema),
  sharedState: SharedStateSchema.nullable().optional(), // Optional in GraphQL
  patchAndQuestions: PatchAndQuestionsSchema,
  // Additional field added by the client
  fixUrl: z.string().optional(),
})

// Schema for fix aggregate counts
const FixAggregateSchema = z.object({
  __typename: z.literal('fix_aggregate').optional(),
  aggregate: z
    .object({
      __typename: z.literal('fix_aggregate_fields').optional(),
      count: z.number(),
    })
    .nullable(),
})

// Schema for vulnerability report issue aggregate counts
const VulnerabilityReportIssueAggregateSchema = z.object({
  __typename: z.literal('vulnerability_report_issue_aggregate').optional(),
  aggregate: z
    .object({
      __typename: z
        .literal('vulnerability_report_issue_aggregate_fields')
        .optional(),
      count: z.number(),
    })
    .nullable(),
})

// Schema for repository information
const RepoSchema = z.object({
  __typename: z.literal('repo').optional(),
  originalUrl: z.string(),
})

// Schema for project information
const ProjectSchema = z.object({
  id: z.any(), // GraphQL uses `any` type for UUID
  organizationId: z.any(), // GraphQL uses `any` type for UUID
})

// Schema for vulnerability report
const VulnerabilityReportSchema = z.object({
  scanDate: z.any().nullable(), // GraphQL uses `any` type for timestamp
  vendor: z.string(), // GraphQL generates as string, not enum
  projectId: z.any().optional(), // GraphQL uses `any` type for UUID
  project: ProjectSchema,
  totalVulnerabilityReportIssuesCount: VulnerabilityReportIssueAggregateSchema,
  notFixableVulnerabilityReportIssuesCount:
    VulnerabilityReportIssueAggregateSchema,
})

// Schema for fix report summary (based on FixReportSummaryFields fragment)
export const FixReportSummarySchema = z.object({
  __typename: z.literal('fixReport').optional(),
  id: z.any(), // GraphQL uses `any` type for UUID
  createdOn: z.any(), // GraphQL uses `any` type for timestamp
  repo: RepoSchema.nullable(),
  issueTypes: z.any().nullable(), // GraphQL uses `any` type for JSON
  CRITICAL: FixAggregateSchema,
  HIGH: FixAggregateSchema,
  MEDIUM: FixAggregateSchema,
  LOW: FixAggregateSchema,
  fixes: z.array(McpFixSchema),
  userFixes: z.array(McpFixSchema).optional(), // Present in some responses but can be omitted
  filteredFixesCount: FixAggregateSchema,
  totalFixesCount: FixAggregateSchema,
  vulnerabilityReport: VulnerabilityReportSchema,
})

// Schema for expired report
export const ExpiredReportSchema = z.object({
  __typename: z.literal('fixReport').optional(),
  id: z.any(), // GraphQL uses `any` type for UUID
  expirationOn: z.any().nullable(), // GraphQL uses `any` type for timestamp
})

// Main schema for GetLatestReportByRepoUrl response
export const GetLatestReportByRepoUrlResponseSchema = z.object({
  __typename: z.literal('query_root').optional(),
  fixReport: z.array(FixReportSummarySchema),
  expiredReport: z.array(ExpiredReportSchema),
})

// Type inference for TypeScript
export type McpFix = z.infer<typeof McpFixSchema>
export type FixReportSummary = z.infer<typeof FixReportSummarySchema>
export type ExpiredReport = z.infer<typeof ExpiredReportSchema>
export type GetLatestReportByRepoUrlResponse = z.infer<
  typeof GetLatestReportByRepoUrlResponseSchema
>
