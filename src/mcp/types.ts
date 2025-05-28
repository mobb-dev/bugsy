import { z } from 'zod'

export const FixVulnerabilitiesToolSchema = z.object({
  path: z.string(),
})

export type FixVulnerabilitiesToolSchema = z.infer<
  typeof FixVulnerabilitiesToolSchema
>
