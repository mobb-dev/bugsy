import { z } from 'zod'

import { Vulnerability_Report_Vendor_Enum } from '../../../generates/client_generates'
import { Fix_Report_State_Enum } from '../../../generates/client_generates'

export const FixPageFixReportZ = z.object({
  id: z.guid(),
  analysisUrl: z.string(),
  createdOn: z.string(),
  state: z.enum(Fix_Report_State_Enum),
  isFixEnabled: z.boolean().nullish(),
  // When this report's fixes expire(d). Nullish because the column is, and
  // because the issue screen reads it only to date the "fixes expired"
  // messaging — a missing date degrades to the undated wording rather than
  // failing the parse (MOBB-3769).
  expirationOn: z.string().nullish(),
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
