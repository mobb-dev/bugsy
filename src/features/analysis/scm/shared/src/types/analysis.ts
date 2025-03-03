import { z } from 'zod'

import { Vulnerability_Report_Vendor_Enum } from '../../../generates/client_generates'
import { Fix_Report_State_Enum } from '../../../generates/client_generates'

export const FixPageFixReportZ = z.object({
  id: z.string().uuid(),
  analysisUrl: z.string(),
  expirationOn: z.string(),
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
    vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum),
    vendorReportId: z.string().uuid().nullable(),
    projectId: z.string().uuid(),
    project: z.object({
      organizationId: z.string().uuid(),
    }),
    file: z.object({
      id: z.string().uuid(),
      path: z.string(),
    }),
    pending: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    supported: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),

    all: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    fixable: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    errors: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    vulnerabilityReportIssues: z
      .object({
        extraData: z.object({
          missing_files: z.string().array().nullish(),
          large_files: z.string().array().nullish(),
          error_files: z.string().array().nullish(),
        }),
      })
      .array(),
  }),
})
