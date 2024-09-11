import { z } from 'zod'

const BaseSubmitToScmMessageZ = z.object({
  submitFixRequestId: z.string().uuid(),
  fixes: z.array(
    z.object({
      fixId: z.string().uuid(),
      patches: z.array(z.string()),
    })
  ),
  commitHash: z.string(),
  repoUrl: z.string(),
  mobbUserEmail: z.string(),
  extraHeaders: z.record(z.string(), z.string()).default({}),
})

export const submitToScmMessageType = {
  commitToSameBranch: 'commitToSameBranch',
  submitFixesForDifferentBranch: 'submitFixesForDifferentBranch',
} as const

export const CommitToSameBranchParamsZ = BaseSubmitToScmMessageZ.merge(
  z.object({
    type: z.literal(submitToScmMessageType.commitToSameBranch),
    branch: z.string(),
    commitMessage: z.string(),
    commitDescription: z.string().nullish(),
    githubCommentId: z.number().nullish(),
  })
)

export const SubmitFixesToDifferentBranchParamsZ = z
  .object({
    type: z.literal(submitToScmMessageType.submitFixesForDifferentBranch),
    submitBranch: z.string(),
    baseBranch: z.string(),
  })
  .merge(BaseSubmitToScmMessageZ)
export const SubmitFixesMessageZ = z.union([
  CommitToSameBranchParamsZ,
  SubmitFixesToDifferentBranchParamsZ,
])
export type SubmitFixesMessage = z.infer<typeof SubmitFixesMessageZ>
export type CommitToSameBranchParams = z.infer<typeof CommitToSameBranchParamsZ>
export type SubmitFixesToDifferentBranchParams = z.infer<
  typeof SubmitFixesToDifferentBranchParamsZ
>

const FixResponseArrayZ = z.array(
  z.object({
    fixId: z.string().uuid(),
  })
)
export type FixResponseArray = z.infer<typeof FixResponseArrayZ>

export const SubmitFixesBaseResponseMessageZ = z.object({
  mobbUserEmail: z.string(),
  submitFixRequestId: z.string().uuid(),
  submitBranches: z.array(
    z.object({
      branchName: z.string(),
      fixes: FixResponseArrayZ,
    })
  ),
  error: z
    .object({
      type: z.enum([
        'InitialRepoAccessError',
        'PushBranchError',
        'UnknownError',
      ]),
      info: z.object({
        message: z.string(),
        pushBranchName: z.string().optional(),
      }),
    })
    .optional(),
})

export const SubmitFixesToSameBranchResponseMessageZ = z
  .object({
    type: z.literal(submitToScmMessageType.commitToSameBranch),
    githubCommentId: z.number().nullish(),
  })
  .merge(SubmitFixesBaseResponseMessageZ)

export type SubmitFixesToSameBranchResponseMessage = z.infer<
  typeof SubmitFixesToSameBranchResponseMessageZ
>
export const SubmitFixesToDifferentBranchResponseMessageZ = z
  .object({
    type: z.literal(submitToScmMessageType.submitFixesForDifferentBranch),
    githubCommentId: z.number().optional(),
  })
  .merge(SubmitFixesBaseResponseMessageZ)

export type SubmitFixesToDifferentBranchResponseMessage = z.infer<
  typeof SubmitFixesToDifferentBranchResponseMessageZ
>

export const SubmitFixesResponseMessageZ = z.discriminatedUnion('type', [
  SubmitFixesToSameBranchResponseMessageZ,
  SubmitFixesToDifferentBranchResponseMessageZ,
])

export type SubmitFixesResponseMessage = z.infer<
  typeof SubmitFixesResponseMessageZ
>

type BaseGitInitParams = {
  dirName: string
  repoUrl: string
  extraHeaders?: Record<string, string>
}

export type InitGitParams = BaseGitInitParams & {
  changedFiles: Set<string>
}

export type InitGitAndFilesParams = BaseGitInitParams & {
  fixes: {
    fixId: string
    patches: string[]
  }[]
}
