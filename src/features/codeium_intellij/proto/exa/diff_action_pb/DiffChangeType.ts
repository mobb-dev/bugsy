// Original file: exa/diff_action_pb/diff_action.proto

export const DiffChangeType = {
  DIFF_CHANGE_TYPE_UNSPECIFIED: 'DIFF_CHANGE_TYPE_UNSPECIFIED',
  DIFF_CHANGE_TYPE_INSERT: 'DIFF_CHANGE_TYPE_INSERT',
  DIFF_CHANGE_TYPE_DELETE: 'DIFF_CHANGE_TYPE_DELETE',
  DIFF_CHANGE_TYPE_UNCHANGED: 'DIFF_CHANGE_TYPE_UNCHANGED',
} as const;

export type DiffChangeType =
  | 'DIFF_CHANGE_TYPE_UNSPECIFIED'
  | 0
  | 'DIFF_CHANGE_TYPE_INSERT'
  | 1
  | 'DIFF_CHANGE_TYPE_DELETE'
  | 2
  | 'DIFF_CHANGE_TYPE_UNCHANGED'
  | 3

export type DiffChangeType__Output = typeof DiffChangeType[keyof typeof DiffChangeType]
