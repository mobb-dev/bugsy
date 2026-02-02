// Original file: exa/code_edit/code_edit_pb/code_edit.proto

export const DescriptionType = {
  DESCRIPTION_TYPE_UNSPECIFIED: 'DESCRIPTION_TYPE_UNSPECIFIED',
  DESCRIPTION_TYPE_EDIT_COMMAND: 'DESCRIPTION_TYPE_EDIT_COMMAND',
  DESCRIPTION_TYPE_INSERTION_COMMAND: 'DESCRIPTION_TYPE_INSERTION_COMMAND',
} as const;

export type DescriptionType =
  | 'DESCRIPTION_TYPE_UNSPECIFIED'
  | 0
  | 'DESCRIPTION_TYPE_EDIT_COMMAND'
  | 1
  | 'DESCRIPTION_TYPE_INSERTION_COMMAND'
  | 2

export type DescriptionType__Output = typeof DescriptionType[keyof typeof DescriptionType]
