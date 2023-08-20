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
    githubToken: string
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

export type SubmitVulnerabilityReportArgs = {
  fixReportId: string
  repoUrl: string
  reference: string
  projectId: string
  sha?: string
}
