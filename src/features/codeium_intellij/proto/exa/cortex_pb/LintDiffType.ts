// Original file: exa/cortex_pb/cortex.proto

export const LintDiffType = {
  LINT_DIFF_TYPE_UNSPECIFIED: 'LINT_DIFF_TYPE_UNSPECIFIED',
  LINT_DIFF_TYPE_DELETE: 'LINT_DIFF_TYPE_DELETE',
  LINT_DIFF_TYPE_INSERT: 'LINT_DIFF_TYPE_INSERT',
  LINT_DIFF_TYPE_UNCHANGED: 'LINT_DIFF_TYPE_UNCHANGED',
} as const;

export type LintDiffType =
  | 'LINT_DIFF_TYPE_UNSPECIFIED'
  | 0
  | 'LINT_DIFF_TYPE_DELETE'
  | 1
  | 'LINT_DIFF_TYPE_INSERT'
  | 2
  | 'LINT_DIFF_TYPE_UNCHANGED'
  | 3

export type LintDiffType__Output = typeof LintDiffType[keyof typeof LintDiffType]
