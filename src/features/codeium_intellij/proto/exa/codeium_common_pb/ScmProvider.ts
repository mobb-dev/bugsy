// Original file: exa/codeium_common_pb/codeium_common.proto

export const ScmProvider = {
  SCM_PROVIDER_UNSPECIFIED: 'SCM_PROVIDER_UNSPECIFIED',
  SCM_PROVIDER_GITHUB: 'SCM_PROVIDER_GITHUB',
  SCM_PROVIDER_GITLAB: 'SCM_PROVIDER_GITLAB',
  SCM_PROVIDER_BITBUCKET: 'SCM_PROVIDER_BITBUCKET',
  SCM_PROVIDER_AZURE_DEVOPS: 'SCM_PROVIDER_AZURE_DEVOPS',
} as const;

export type ScmProvider =
  | 'SCM_PROVIDER_UNSPECIFIED'
  | 0
  | 'SCM_PROVIDER_GITHUB'
  | 1
  | 'SCM_PROVIDER_GITLAB'
  | 2
  | 'SCM_PROVIDER_BITBUCKET'
  | 3
  | 'SCM_PROVIDER_AZURE_DEVOPS'
  | 4

export type ScmProvider__Output = typeof ScmProvider[keyof typeof ScmProvider]
