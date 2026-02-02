// Original file: exa/diff_action_pb/diff_action.proto

export const DiffType = {
  DIFF_TYPE_UNSPECIFIED: 'DIFF_TYPE_UNSPECIFIED',
  DIFF_TYPE_UNIFIED: 'DIFF_TYPE_UNIFIED',
  DIFF_TYPE_CHARACTER: 'DIFF_TYPE_CHARACTER',
  DIFF_TYPE_COMBO: 'DIFF_TYPE_COMBO',
} as const;

export type DiffType =
  | 'DIFF_TYPE_UNSPECIFIED'
  | 0
  | 'DIFF_TYPE_UNIFIED'
  | 1
  | 'DIFF_TYPE_CHARACTER'
  | 2
  | 'DIFF_TYPE_COMBO'
  | 3

export type DiffType__Output = typeof DiffType[keyof typeof DiffType]
