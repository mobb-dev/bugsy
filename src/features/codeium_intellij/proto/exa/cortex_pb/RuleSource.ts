// Original file: exa/cortex_pb/cortex.proto

export const RuleSource = {
  RULE_SOURCE_UNSPECIFIED: 'RULE_SOURCE_UNSPECIFIED',
  RULE_SOURCE_WORKSPACE: 'RULE_SOURCE_WORKSPACE',
  RULE_SOURCE_SYSTEM: 'RULE_SOURCE_SYSTEM',
} as const;

export type RuleSource =
  | 'RULE_SOURCE_UNSPECIFIED'
  | 0
  | 'RULE_SOURCE_WORKSPACE'
  | 1
  | 'RULE_SOURCE_SYSTEM'
  | 2

export type RuleSource__Output = typeof RuleSource[keyof typeof RuleSource]
