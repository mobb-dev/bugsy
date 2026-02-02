// Original file: exa/language_server_pb/language_server.proto

export const CodeRevertActionType = {
  CODE_REVERT_ACTION_TYPE_UNSPECIFIED: 'CODE_REVERT_ACTION_TYPE_UNSPECIFIED',
  CODE_REVERT_ACTION_TYPE_MODIFY: 'CODE_REVERT_ACTION_TYPE_MODIFY',
  CODE_REVERT_ACTION_TYPE_CREATE: 'CODE_REVERT_ACTION_TYPE_CREATE',
  CODE_REVERT_ACTION_TYPE_DELETE: 'CODE_REVERT_ACTION_TYPE_DELETE',
} as const;

export type CodeRevertActionType =
  | 'CODE_REVERT_ACTION_TYPE_UNSPECIFIED'
  | 0
  | 'CODE_REVERT_ACTION_TYPE_MODIFY'
  | 1
  | 'CODE_REVERT_ACTION_TYPE_CREATE'
  | 2
  | 'CODE_REVERT_ACTION_TYPE_DELETE'
  | 3

export type CodeRevertActionType__Output = typeof CodeRevertActionType[keyof typeof CodeRevertActionType]
