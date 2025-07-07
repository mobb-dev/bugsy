import { z } from 'zod'

import { Vulnerability_Report_Issue_Tag_Enum } from '../../../generates/client_generates'
import { FixPageFixReportZ } from './analysis'
import { FixPartsForFixScreenZ } from './fix'
import { ParsedSeverityZ } from './shared'

export const MAX_SOURCE_CODE_FILE_SIZE_IN_BYTES = 100_000 // 100kB

export const CATEGORY = {
  NoFix: 'NoFix',
  Unsupported: 'Unsupported',
  Irrelevant: 'Irrelevant',
  FalsePositive: 'FalsePositive',
  Fixable: 'Fixable',
  Filtered: 'Filtered',
} as const
export const ValidCategoriesZ = z.union([
  z.literal(CATEGORY.NoFix),
  z.literal(CATEGORY.Unsupported),
  z.literal(CATEGORY.Irrelevant),
  z.literal(CATEGORY.FalsePositive),
  z.literal(CATEGORY.Fixable),
  z.literal(CATEGORY.Filtered),
])

export const VulnerabilityReportIssueSharedStateZ = z
  .object({
    id: z.string().uuid(),
    isArchived: z.boolean(),
    ticketIntegrationId: z.string().uuid().nullable(),
    ticketIntegrations: z.array(
      z.object({
        url: z.string(),
      })
    ),
  })
  .nullish()
export const BaseIssuePartsZ = z.object({
  id: z.string().uuid(),
  safeIssueType: z.string(),
  safeIssueLanguage: z.string(),
  createdAt: z.string(),
  parsedSeverity: ParsedSeverityZ,
  category: ValidCategoriesZ,
  extraData: z.object({
    missing_files: z.string().array().nullish(),
    error_files: z.string().array().nullish(),
  }),
  vulnerabilityReportIssueTags: z.array(
    z.object({
      tag: z.nativeEnum(Vulnerability_Report_Issue_Tag_Enum),
    })
  ),
  codeNodes: z
    .array(
      z.object({
        path: z.string(),
        line: z.number(),
        index: z.number(),
      })
    )

    // we couldn't sort throught hasura since we used the disctict method there
    // feel free to try to give a try
    .transform((nodes) => nodes.sort((a, b) => b.index - a.index)),
  sourceCodeNodes: z
    .array(
      z
        .object({
          sourceCodeFile: z.object({
            path: z.string(),
            signedFile: z.object({
              url: z.string(),
            }),
          }),
        })
        .transform(async ({ sourceCodeFile }) => {
          const { url } = sourceCodeFile.signedFile
          const sourceCodeRes = await fetch(url)
          if (
            Number(sourceCodeRes.headers.get('Content-Length')) >
            MAX_SOURCE_CODE_FILE_SIZE_IN_BYTES
          ) {
            return null
          }
          return {
            path: sourceCodeFile.path,
            fileContent: await sourceCodeRes.text(),
          }
        })
    )
    .transform((nodes) => nodes.filter((node) => node !== null)),

  fix: FixPartsForFixScreenZ.nullish(),
  vulnerabilityReportIssueNodeDiffFile: z
    .object({
      signedFile: z
        .object({
          url: z.string(),
        })
        .transform(async ({ url }) => {
          const codeDiff = await fetch(url).then((res) => res.text())
          return { codeDiff }
        }),
    })
    .nullish(),
  sharedState: VulnerabilityReportIssueSharedStateZ,
})

export const FalsePositivePartsZ = z.object({
  extraContext: z.array(z.object({ key: z.string(), value: z.string() })),
  fixDescription: z.string(),
})
export type FalsePositiveParts = z.infer<typeof FalsePositivePartsZ>

const IssuePartsWithFixZ = BaseIssuePartsZ.merge(
  z.object({
    category: z.literal(CATEGORY.Irrelevant),
    fix: FixPartsForFixScreenZ.nullish(),
  })
)

export const IssuePartsFpZ = BaseIssuePartsZ.merge(
  z.object({
    category: z.literal(CATEGORY.FalsePositive),
    fpId: z.string().uuid(),
    getFalsePositive: FalsePositivePartsZ,
  })
)

const GeneralIssueZ = BaseIssuePartsZ.merge(
  z.object({
    category: z.union([
      z.literal(CATEGORY.NoFix),
      z.literal(CATEGORY.Unsupported),
      z.literal(CATEGORY.Fixable),
      z.literal(CATEGORY.Filtered),
    ]),
  })
)

export const IssuePartsZ = z.union([
  IssuePartsFpZ,
  IssuePartsWithFixZ,
  GeneralIssueZ,
])

export type IssuePartsFp = z.infer<typeof IssuePartsFpZ>
export type IssuePartsWithFix = z.infer<typeof IssuePartsWithFixZ>
export type GeneralIssue = z.infer<typeof GeneralIssueZ>
export const GetIssueIndexesZ = z.object({
  currentIndex: z.number(),
  totalIssues: z.number(),
  nextIssue: z
    .object({
      id: z.string().uuid(),
    })
    .nullish(),
  prevIssue: z
    .object({
      id: z.string().uuid(),
    })
    .nullish(),
})
export const GetIssueScreenDataZ = z.object({
  fixReport_by_pk: FixPageFixReportZ,
  vulnerability_report_issue_by_pk: IssuePartsZ,
  issueIndexes: GetIssueIndexesZ,
})

export const IssueBucketZ = z.enum(['fixable', 'irrelevant', 'remaining'])
export type IssueBucket = z.infer<typeof IssueBucketZ>

export type GetIssueScreenData = z.infer<typeof GetIssueScreenDataZ>
export type IssueCategory =
  GetIssueScreenData['vulnerability_report_issue_by_pk']['category']

export const mapCategoryToBucket: Record<IssueCategory, IssueBucket> = {
  FalsePositive: 'irrelevant',
  Irrelevant: 'irrelevant',
  NoFix: 'remaining',
  Unsupported: 'remaining',
  Fixable: 'fixable',
  Filtered: 'remaining',
}

export const mapBucketTypeToCategory: Record<IssueBucket, IssueCategory[]> = {
  irrelevant: ['FalsePositive', 'Irrelevant'],
  remaining: ['NoFix', 'Unsupported'],
  fixable: ['Fixable'],
}
