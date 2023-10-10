import { z } from 'zod'

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
  vulnerabilityReportFileName: string
  projectId: string
}

export type MeQuery = {
  me: {
    id: string
    email: string
    githubToken: string | undefined
    gitlabToken: string | undefined
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
  repoUrl: string
  reference: string
  sha?: string
}

export type InitializeVulnerabilityReportArgs = {
  fixReportId: string
}

export type SubmitVulnerabilityReportArgs = {
  fixReportId: string
  repoUrl: string
  reference: string
  projectId: string
  sha?: string
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

export const GetFixReportZ = z.object({
  fixReport_by_pk: z.object({
    state: z.string(),
  }),
})

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
