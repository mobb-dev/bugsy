import { z } from 'zod'

import {
  GetLatestReportByRepoUrlQuery,
  GetReportFixesQuery,
} from '../features/analysis/scm/generates/client_generates'

export const ScanAndFixVulnerabilitiesToolSchema = z.object({
  path: z.string(),
})

export type ScanAndFixVulnerabilitiesToolSchema = z.infer<
  typeof ScanAndFixVulnerabilitiesToolSchema
>

export type McpFix = GetReportFixesQuery['fixReport'][number]['fixes'][number]

export type FixReportSummary = NonNullable<
  GetLatestReportByRepoUrlQuery['fixReport']
>[number]
