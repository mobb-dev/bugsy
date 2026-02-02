// Original file: exa/codeium_common_pb/codeium_common.proto

export const TabToJump = {
  TAB_TO_JUMP_UNSPECIFIED: 'TAB_TO_JUMP_UNSPECIFIED',
  TAB_TO_JUMP_ENABLED: 'TAB_TO_JUMP_ENABLED',
  TAB_TO_JUMP_DISABLED: 'TAB_TO_JUMP_DISABLED',
} as const;

export type TabToJump =
  | 'TAB_TO_JUMP_UNSPECIFIED'
  | 0
  | 'TAB_TO_JUMP_ENABLED'
  | 1
  | 'TAB_TO_JUMP_DISABLED'
  | 2

export type TabToJump__Output = typeof TabToJump[keyof typeof TabToJump]
