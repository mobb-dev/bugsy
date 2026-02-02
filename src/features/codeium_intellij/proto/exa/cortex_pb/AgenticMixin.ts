// Original file: exa/cortex_pb/cortex.proto

export const AgenticMixin = {
  AGENTIC_MIXIN_UNSPECIFIED: 'AGENTIC_MIXIN_UNSPECIFIED',
  AGENTIC_MIXIN_SMARTLINT: 'AGENTIC_MIXIN_SMARTLINT',
  AGENTIC_MIXIN_PR_REVIEW: 'AGENTIC_MIXIN_PR_REVIEW',
} as const;

export type AgenticMixin =
  | 'AGENTIC_MIXIN_UNSPECIFIED'
  | 0
  | 'AGENTIC_MIXIN_SMARTLINT'
  | 1
  | 'AGENTIC_MIXIN_PR_REVIEW'
  | 2

export type AgenticMixin__Output = typeof AgenticMixin[keyof typeof AgenticMixin]
