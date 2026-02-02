// Original file: exa/codeium_common_pb/codeium_common.proto

export const UserNUXEvent = {
  USER_NUX_EVENT_UNSPECIFIED: 'USER_NUX_EVENT_UNSPECIFIED',
  USER_NUX_EVENT_DISMISS_WINDSURF_CROSS_SELL: 'USER_NUX_EVENT_DISMISS_WINDSURF_CROSS_SELL',
} as const;

export type UserNUXEvent =
  | 'USER_NUX_EVENT_UNSPECIFIED'
  | 0
  | 'USER_NUX_EVENT_DISMISS_WINDSURF_CROSS_SELL'
  | 1

export type UserNUXEvent__Output = typeof UserNUXEvent[keyof typeof UserNUXEvent]
