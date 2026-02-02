// Original file: exa/codeium_common_pb/codeium_common.proto

export const ContextInclusionType = {
  CONTEXT_INCLUSION_TYPE_UNSPECIFIED: 'CONTEXT_INCLUSION_TYPE_UNSPECIFIED',
  CONTEXT_INCLUSION_TYPE_INCLUDE: 'CONTEXT_INCLUSION_TYPE_INCLUDE',
  CONTEXT_INCLUSION_TYPE_EXCLUDE: 'CONTEXT_INCLUSION_TYPE_EXCLUDE',
} as const;

export type ContextInclusionType =
  | 'CONTEXT_INCLUSION_TYPE_UNSPECIFIED'
  | 0
  | 'CONTEXT_INCLUSION_TYPE_INCLUDE'
  | 1
  | 'CONTEXT_INCLUSION_TYPE_EXCLUDE'
  | 2

export type ContextInclusionType__Output = typeof ContextInclusionType[keyof typeof ContextInclusionType]
