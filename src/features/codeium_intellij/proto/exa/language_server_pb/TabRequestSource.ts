// Original file: exa/language_server_pb/language_server.proto

export const TabRequestSource = {
  TAB_REQUEST_SOURCE_UNSPECIFIED: 'TAB_REQUEST_SOURCE_UNSPECIFIED',
  TAB_REQUEST_SOURCE_SUPERCOMPLETE: 'TAB_REQUEST_SOURCE_SUPERCOMPLETE',
  TAB_REQUEST_SOURCE_TAB_JUMP: 'TAB_REQUEST_SOURCE_TAB_JUMP',
} as const;

export type TabRequestSource =
  | 'TAB_REQUEST_SOURCE_UNSPECIFIED'
  | 0
  | 'TAB_REQUEST_SOURCE_SUPERCOMPLETE'
  | 1
  | 'TAB_REQUEST_SOURCE_TAB_JUMP'
  | 2

export type TabRequestSource__Output = typeof TabRequestSource[keyof typeof TabRequestSource]
