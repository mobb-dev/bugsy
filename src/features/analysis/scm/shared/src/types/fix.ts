import { z } from 'zod'

import {
  Effort_To_Apply_Fix_Enum,
  Fix_Rating_Tag_Enum,
  Fix_State_Enum,
  FixQuestionInputType,
  Language,
  ManifestAction,
  Vulnerability_Severity_Enum,
} from '../../../generates/client_generates'
import { ParsedSeverityZ, ScmSubmitFixRequestsZ } from './shared'

const PackageInfoZ = z.object({
  name: z.string(),
  version: z.string(),
  envName: z.string().nullable(),
})

const ManifestActionRequiredZ = z.object({
  action: z.nativeEnum(ManifestAction),
  language: z.nativeEnum(Language),
  lib: PackageInfoZ,
  typesLib: PackageInfoZ.nullable(),
})

const ExtraContextInternalZ = z.object({
  key: z.string(),
  value: z
    .string()
    .or(z.boolean())
    .or(
      z.object({
        int: z.boolean(),
        integer: z.boolean(),
        string: z.boolean(),
        date: z.boolean(),
      })
    ),
})

const FixExtraContextZ = z.object({
  fixDescription: z.string(),
  manifestActionsRequired: z.array(ManifestActionRequiredZ),
  extraContext: z.array(ExtraContextInternalZ),
})

export const PatchAndQuestionsZ = z.object({
  __typename: z.literal('FixData'),
  patch: z.string(),
  patchOriginalEncodingBase64: z.string(),
  questions: z.array(
    z.object({
      name: z.string(),
      key: z.string(),
      index: z.number(),
      defaultValue: z.string(),
      value: z.string().nullable(),
      extraContext: z.array(ExtraContextInternalZ),
      inputType: z.nativeEnum(FixQuestionInputType),
      options: z.array(z.string()),
    })
  ),
  extraContext: FixExtraContextZ,
})

export const FixRatingZ = z.object({
  voteScore: z.number(),
  fixRatingTag: z.nativeEnum(Fix_Rating_Tag_Enum).nullable().default(null),
  comment: z.string().nullable().default(null),
  updatedDate: z.string().nullable(),
  user: z.object({
    email: z.string(),
    name: z.string(),
  }),
})

const IssueSharedStateZ = z
  .object({
    id: z.string(),
    isArchived: z.boolean(),
    ticketIntegrationId: z.string().nullable(),
    ticketIntegrations: z.array(
      z.object({
        url: z.string(),
      })
    ),
  })
  .nullable()

export const FixSharedStateZ = z
  .object({
    state: z.nativeEnum(Fix_State_Enum),
    isArchived: z.boolean(),
    scmSubmitFixRequests: ScmSubmitFixRequestsZ,
    fixRatings: z.array(FixRatingZ).default([]),
  })
  .nullish()
  .transform((data) =>
    data
      ? data
      : {
          state: Fix_State_Enum.Ready,
          isArchived: false,
          scmSubmitFixRequests: [],
          fixRatings: [],
        }
  )

export const FixQueryZ = z.object({
  __typename: z.literal('fix').optional(),
  id: z.string().uuid(),
  sharedState: FixSharedStateZ,
  modifiedBy: z.string().nullable(),
  gitBlameLogin: z.string().nullable(),
  safeIssueLanguage: z.string(),
  safeIssueType: z.string(),
  confidence: z.number(),
  fixReportId: z.string().uuid(),
  isExpired: z.boolean().default(false),
  fixFiles: z.array(
    z.object({
      fileRepoRelativePath: z.string(),
    })
  ),
  numberOfVulnerabilityIssues: z.number(),
  severityText: z.nativeEnum(Vulnerability_Severity_Enum),
  vulnerabilityReportIssues: z.array(
    z.object({
      vendorIssueId: z.string(),
      issueLanguage: z.string(),
      parsedSeverity: ParsedSeverityZ,
      sharedState: z
        .object({
          id: z.string().uuid(),
          isArchived: z.boolean(),
          ticketIntegrationId: z.string().uuid().nullable(),
        })
        .nullable(),
    })
  ),
  patchAndQuestions: PatchAndQuestionsZ,

  effortToApplyFix: z.nativeEnum(Effort_To_Apply_Fix_Enum).nullable(),
})

export const FixPartsForFixScreenZ = FixQueryZ.merge(
  z.object({
    vulnerabilityReportIssues: z.array(
      z.object({
        vendorIssueId: z.string(),
        issueType: z.string(),
        issueLanguage: z.string(),
        sharedState: IssueSharedStateZ,
      })
    ),
  })
)

export type VulnerabilityReportIssues = z.infer<
  typeof FixPartsForFixScreenZ
>['vulnerabilityReportIssues']

export type FixQuery = z.infer<typeof FixQueryZ>
export type ManifestActionRequired = z.infer<typeof ManifestActionRequiredZ>
