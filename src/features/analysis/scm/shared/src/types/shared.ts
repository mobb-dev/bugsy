import { z } from 'zod'

import {
  Pr_Status_Enum,
  Vulnerability_Severity_Enum,
} from '../../../generates/client_generates'

// note: we can't use default since it will fail when the value is null
export const ParsedSeverityZ = z
  .nativeEnum(Vulnerability_Severity_Enum)
  .nullish()
  .transform((i) => i ?? Vulnerability_Severity_Enum.Low)

export const ScmSubmitFixRequestsZ = z.array(
  z.object({
    scmSubmitFixRequest: z.object({
      submitFixRequest: z.object({
        createdByUser: z.object({
          email: z.string(),
        }),
        targetBranchName: z.string().default(''),
      }),
      prUrl: z.string().nullable(),
      prStatus: z.nativeEnum(Pr_Status_Enum).nullable(),
      commitUrl: z.string().nullable(),
      scmId: z.string(),
    }),
  })
)

export type ScmSubmitFixRequests = z.infer<typeof ScmSubmitFixRequestsZ>
