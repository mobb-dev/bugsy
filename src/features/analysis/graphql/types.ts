import { z } from 'zod'

import { ScmConfig } from '../scm'

export const UpdateScmTokenZ = z.object({
  updateScmToken: z.object({
    token: z.string(),
  }),
})
export type UpdateScmToken = z.infer<typeof UpdateScmTokenZ>

const UploadFieldsZ = z.object({
  bucket: z.string(),
  'X-Amz-Algorithm': z.string(),
  'X-Amz-Credential': z.string(),
  'X-Amz-Date': z.string(),
  Policy: z.string(),
  'X-Amz-Signature': z.string(),
})
type UploadFields = z.infer<typeof UploadFieldsZ>
const ReportUploadInfoZ = z
  .object({
    url: z.string(),
    fixReportId: z.string(),
    uploadFieldsJSON: z.string().transform((str, ctx): UploadFields => {
      try {
        return JSON.parse(str)
      } catch (e) {
        ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
        return z.NEVER
      }
    }),
    uploadKey: z.string(),
  })
  .transform(({ uploadFieldsJSON, ...input }) => ({
    ...input,
    uploadFields: uploadFieldsJSON,
  }))

export type ReportUploadInfo = z.infer<typeof ReportUploadInfoZ>
export const UploadS3BucketInfoZ = z.object({
  uploadS3BucketInfo: z.object({
    status: z.string(),
    error: z.string().nullish(),
    reportUploadInfo: ReportUploadInfoZ,
    repoUploadInfo: ReportUploadInfoZ,
  }),
})

export type UploadS3BucketInfo = z.infer<typeof UploadS3BucketInfoZ>

export type DigestVulnerabilityReportVariables = {
  fixReportId: string
  repoUrl: string
  reference: string
  sha: string
  vulnerabilityReportFileName: string
  projectId: string
}

export type InitializeVulnerabilityReportVariables = {
  fixReportId: string
}

export type SubmitVulnerabilityReportVariables = {
  fixReportId: string
  repoUrl: string
  reference: string
  sha: string
  experimentalEnabled?: boolean
  vulnerabilityReportFileName?: string
  projectId: string
  pullRequest?: number
}

export type MeQuery = {
  me: {
    id: string
    email: string
    scmConfigs: ScmConfig[]
  }
}

export const GetOrgAndProjectIdQueryZ = z.object({
  users: z
    .array(
      z.object({
        userOrganizationsAndUserOrganizationRoles: z
          .array(
            z.object({
              organization: z.object({
                id: z.string(),
                projects: z
                  .array(
                    z.object({
                      id: z.string(),
                      name: z.string(),
                    })
                  )
                  .nonempty(),
              }),
            })
          )
          .nonempty(),
      })
    )
    .nonempty(),
})

export type GetOrgAndProjectIdQuery = z.infer<typeof GetOrgAndProjectIdQueryZ>

export type DigestVulnerabilityReportArgs = {
  fixReportId: string
  projectId: string
}

export type CreateCliLoginArgs = {
  publicKey: string
}

export const CreateCliLoginZ = z.object({
  insert_cli_login_one: z.object({
    id: z.string(),
  }),
})

export type CreateCliLoginQuery = z.infer<typeof GetOrgAndProjectIdQueryZ>

export type GetEncryptedApiTokenArgs = {
  loginId: string
}

export const GetEncryptedApiTokenZ = z.object({
  cli_login_by_pk: z.object({
    encryptedApiToken: z.string().nullable(),
  }),
})

export type GetEncryptedApiTokenQuery = z.infer<typeof GetEncryptedApiTokenZ>

export const DigestVulnerabilityReportZ = z.object({
  digestVulnerabilityReport: z.object({
    vulnerabilityReportId: z.string(),
  }),
})

export type DigestVulnerabilityReportQuery = z.infer<
  typeof DigestVulnerabilityReportZ
>

const AnalysisStateZ = z.enum([
  'Created',
  'Deleted',
  'Digested',
  'Expired',
  'Failed',
  'Finished',
  'Initialized',
  'Requested',
])

export const GetFixReportZ = z.object({
  fixReport_by_pk: z.object({
    state: AnalysisStateZ,
  }),
})

export const GetFixReportSubscriptionZ = z.object({
  analysis: z.object({
    id: z.string(),
    state: AnalysisStateZ,
  }),
})

export type GetFixReportSubscription = z.infer<typeof GetFixReportSubscriptionZ>

export type GetFixReportQuery = z.infer<typeof GetFixReportZ>

export const GetVulnerabilityReportPathsZ = z.object({
  vulnerability_report_path: z.array(
    z.object({
      path: z.string(),
    })
  ),
})

export type GetVulnerabilityReportPathsQuery = z.infer<
  typeof GetVulnerabilityReportPathsZ
>

export const CreateUpdateFixReportMutationZ = z.object({
  submitVulnerabilityReport: z.object({
    __typename: z.literal('VulnerabilityReport'),
    vulnerabilityReportId: z.string(),
    fixReportId: z.string(),
  }),
})

export type CreateUpdateFixReportMutation = z.infer<
  typeof CreateUpdateFixReportMutationZ
>

export const GetAnalysisQueryZ = z.object({
  analysis: z.object({
    id: z.string(),
    state: z.string(),
    repo: z.object({
      commitSha: z.string(),
      pullRequest: z.number(),
    }),
    vulnerabilityReportId: z.string(),
    vulnerabilityReport: z.object({
      projectId: z.string(),
      project: z.object({
        organizationId: z.string(),
      }),
      file: z.object({
        signedFile: z.object({
          url: z.string(),
        }),
      }),
    }),
  }),
})

export type GetAnalysisQuery = z.infer<typeof GetAnalysisQueryZ>

const FixDataZ = z.object({
  issueType: z.string(),
  id: z.string(),
  patchAndQuestions: z.object({
    patch: z.string(),
  }),
})

export const GetFixQueryZ = z.object({
  fix_by_pk: FixDataZ,
})

export const GetFixesQueryZ = z.object({ fixes: z.array(FixDataZ) })

export type GetFixQuery = z.infer<typeof GetFixQueryZ>
export type GetFixesQuery = z.infer<typeof GetFixesQueryZ>
export type GetFixesParams = {
  filters: {
    id: { _in: string[] }
  }
}

const VulnerabilityReportIssueCodeNodeZ = z.object({
  vulnerabilityReportIssueId: z.string(),
  path: z.string(),
  startLine: z.number(),
  vulnerabilityReportIssue: z.object({
    fixId: z.string(),
  }),
})
export type VulnerabilityReportIssueCodeNode = z.infer<
  typeof VulnerabilityReportIssueCodeNodeZ
>

export const GetVulByNodesMetadataZ = z.object({
  vulnerabilityReportIssueCodeNodes: z.array(VulnerabilityReportIssueCodeNodeZ),
  nonFixablePrVuls: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  fixablePrVuls: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  totalScanVulnerabilities: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
})

export type GetVulByNodesMetadata = z.infer<typeof GetVulByNodesMetadataZ>

export type GetVulByNodesMetadataFilter = {
  path: {
    _eq: string
  }
  _or: {
    startLine: {
      _gte: number
      _lte: number
    }
    endLine: {
      _gte: number
      _lte: number
    }
  }[]
}

export type GetVulByNodeHunk = {
  path: string
  ranges: {
    startLine: number
    endLine: number
  }[]
}
export type GetVulByNodesMetadataParams = {
  vulnerabilityReportId: string
  hunks: GetVulByNodeHunk[]
}

export type GetVulByNodesMetadataQueryParams = {
  filters: { _or: GetVulByNodesMetadataFilter[] }
  vulnerabilityReportId: string
}
