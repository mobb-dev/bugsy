import { z } from 'zod'

import { Vulnerability_Report_Vendor_Enum } from '../../../generates/client_generates'
import { Fix_Report_State_Enum } from '../../../generates/client_generates'

export const FixPageFixReportZ = z.object({
  id: z.string().uuid(),
  analysisUrl: z.string(),
  createdOn: z.string(),
  state: z.nativeEnum(Fix_Report_State_Enum),
  repo: z.object({
    name: z.string().nullable(),
    originalUrl: z.string(),
    reference: z.string(),
    commitSha: z.string(),
    isKnownBranch: z.boolean().nullable(),
  }),
  vulnerabilityReport: z.object({
    id: z.string().uuid(),
    vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum),
    projectId: z.string().uuid(),
    project: z.object({
      organizationId: z.string().uuid(),
    }),
  }),
})
