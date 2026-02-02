// Original file: exa/diff_action_pb/diff_action.proto

export const UnifiedDiffLineType = {
  UNIFIED_DIFF_LINE_TYPE_UNSPECIFIED: 'UNIFIED_DIFF_LINE_TYPE_UNSPECIFIED',
  UNIFIED_DIFF_LINE_TYPE_INSERT: 'UNIFIED_DIFF_LINE_TYPE_INSERT',
  UNIFIED_DIFF_LINE_TYPE_DELETE: 'UNIFIED_DIFF_LINE_TYPE_DELETE',
  UNIFIED_DIFF_LINE_TYPE_UNCHANGED: 'UNIFIED_DIFF_LINE_TYPE_UNCHANGED',
} as const;

export type UnifiedDiffLineType =
  | 'UNIFIED_DIFF_LINE_TYPE_UNSPECIFIED'
  | 0
  | 'UNIFIED_DIFF_LINE_TYPE_INSERT'
  | 1
  | 'UNIFIED_DIFF_LINE_TYPE_DELETE'
  | 2
  | 'UNIFIED_DIFF_LINE_TYPE_UNCHANGED'
  | 3

export type UnifiedDiffLineType__Output = typeof UnifiedDiffLineType[keyof typeof UnifiedDiffLineType]
