// Original file: exa/codeium_common_pb/codeium_common.proto

export const ScmType = {
  SCM_TYPE_UNSPECIFIED: 'SCM_TYPE_UNSPECIFIED',
  SCM_TYPE_GIT: 'SCM_TYPE_GIT',
  SCM_TYPE_PERFORCE: 'SCM_TYPE_PERFORCE',
} as const;

export type ScmType =
  | 'SCM_TYPE_UNSPECIFIED'
  | 0
  | 'SCM_TYPE_GIT'
  | 1
  | 'SCM_TYPE_PERFORCE'
  | 2

export type ScmType__Output = typeof ScmType[keyof typeof ScmType]
