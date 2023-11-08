import { z } from 'zod'

export declare const isValidBranchName: (branchName: string) => Promise<boolean>
export declare const SubmitFixesMessageZ: z.ZodObject<
  {
    submitFixRequestId: z.ZodString
    fixes: z.ZodArray<
      z.ZodObject<
        {
          fixId: z.ZodString
          diff: z.ZodString
        },
        'strip',
        z.ZodTypeAny,
        {
          fixId: string
          diff: string
        },
        {
          fixId: string
          diff: string
        }
      >,
      'many'
    >
    branchName: z.ZodString
    commitHash: z.ZodString
    targetBranch: z.ZodString
    repoUrl: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    repoUrl: string
    submitFixRequestId: string
    fixes: {
      fixId: string
      diff: string
    }[]
    branchName: string
    commitHash: string
    targetBranch: string
  },
  {
    repoUrl: string
    submitFixRequestId: string
    fixes: {
      fixId: string
      diff: string
    }[]
    branchName: string
    commitHash: string
    targetBranch: string
  }
>
export declare type SubmitFixesMessage = z.infer<typeof SubmitFixesMessageZ>
export declare const SubmitFixesResponseMessageZ: z.ZodObject<
  {
    submitFixRequestId: z.ZodString
    submitBranches: z.ZodArray<
      z.ZodObject<
        {
          branchName: z.ZodString
          fixes: z.ZodArray<
            z.ZodObject<
              {
                fixId: z.ZodString
              },
              'strip',
              z.ZodTypeAny,
              {
                fixId: string
              },
              {
                fixId: string
              }
            >,
            'many'
          >
        },
        'strip',
        z.ZodTypeAny,
        {
          fixes: {
            fixId: string
          }[]
          branchName: string
        },
        {
          fixes: {
            fixId: string
          }[]
          branchName: string
        }
      >,
      'many'
    >
    error: z.ZodOptional<
      z.ZodObject<
        {
          type: z.ZodEnum<
            ['InitialRepoAccessError', 'PushBranchError', 'UnknownError']
          >
          info: z.ZodObject<
            {
              message: z.ZodString
              pushBranchName: z.ZodOptional<z.ZodString>
            },
            'strip',
            z.ZodTypeAny,
            {
              message: string
              pushBranchName?: string | undefined
            },
            {
              message: string
              pushBranchName?: string | undefined
            }
          >
        },
        'strip',
        z.ZodTypeAny,
        {
          type: 'InitialRepoAccessError' | 'PushBranchError' | 'UnknownError'
          info: {
            message: string
            pushBranchName?: string | undefined
          }
        },
        {
          type: 'InitialRepoAccessError' | 'PushBranchError' | 'UnknownError'
          info: {
            message: string
            pushBranchName?: string | undefined
          }
        }
      >
    >
  },
  'strip',
  z.ZodTypeAny,
  {
    submitFixRequestId: string
    submitBranches: {
      fixes: {
        fixId: string
      }[]
      branchName: string
    }[]
    error?:
      | {
          type: 'InitialRepoAccessError' | 'PushBranchError' | 'UnknownError'
          info: {
            message: string
            pushBranchName?: string | undefined
          }
        }
      | undefined
  },
  {
    submitFixRequestId: string
    submitBranches: {
      fixes: {
        fixId: string
      }[]
      branchName: string
    }[]
    error?:
      | {
          type: 'InitialRepoAccessError' | 'PushBranchError' | 'UnknownError'
          info: {
            message: string
            pushBranchName?: string | undefined
          }
        }
      | undefined
  }
>
export declare type SubmitFixesResponseMessage = z.infer<
  typeof SubmitFixesResponseMessageZ
>
export declare const submitFixes: (msg: SubmitFixesMessage) => Promise<{
  submitFixRequestId: string
  submitBranches: {
    fixes: {
      fixId: string
    }[]
    branchName: string
  }[]
  error?:
    | {
        type: 'InitialRepoAccessError' | 'PushBranchError' | 'UnknownError'
        info: {
          message: string
          pushBranchName?: string | undefined
        }
      }
    | undefined
}>
//# sourceMappingURL=scmSubmit.d.ts.map
