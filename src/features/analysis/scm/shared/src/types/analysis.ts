import { z } from 'zod'

import { Vulnerability_Report_Vendor_Enum } from '../../../generates/client_generates'
import { Fix_Report_State_Enum } from '../../../generates/client_generates'

export const FixPageFixReportZ = z.object({
  id: z.guid(),
  analysisUrl: z.string(),
  createdOn: z.string(),
  state: z.enum(Fix_Report_State_Enum),
  repo: z
    .object({
      name: z.string().nullable(),
      originalUrl: z.string(),
      reference: z.string(),
      commitSha: z.string(),
      isKnownBranch: z.boolean().nullish().default(true),
    })
    .nullable()
    .transform(
      (repo) =>
        repo ?? {
          name: null,
          originalUrl: '',
          reference: '',
          commitSha: '',
          isKnownBranch: true as const,
        }
    ),
  vulnerabilityReport: z.object({
    id: z.guid(),
    vendor: z.enum(Vulnerability_Report_Vendor_Enum),
    computedVendor: z.enum(Vulnerability_Report_Vendor_Enum),
    projectId: z.guid(),
    project: z.object({
      organizationId: z.guid(),
    }),
  }),
})
