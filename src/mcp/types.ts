import { z } from 'zod'

import { GetReportFixesQuery } from '../features/analysis/scm/generates/client_generates'

export const FixVulnerabilitiesToolSchema = z.object({
  path: z.string(),
})

export type FixVulnerabilitiesToolSchema = z.infer<
  typeof FixVulnerabilitiesToolSchema
>

export type McpFix = GetReportFixesQuery['fixReport'][number]['fixes'][number]
