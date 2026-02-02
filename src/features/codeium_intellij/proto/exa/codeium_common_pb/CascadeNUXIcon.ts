// Original file: exa/codeium_common_pb/codeium_common.proto

export const CascadeNUXIcon = {
  CASCADE_NUX_ICON_UNSPECIFIED: 'CASCADE_NUX_ICON_UNSPECIFIED',
  CASCADE_NUX_ICON_WEB_SEARCH: 'CASCADE_NUX_ICON_WEB_SEARCH',
  CASCADE_NUX_ICON_WINDSURF_BROWSER: 'CASCADE_NUX_ICON_WINDSURF_BROWSER',
} as const;

export type CascadeNUXIcon =
  | 'CASCADE_NUX_ICON_UNSPECIFIED'
  | 0
  | 'CASCADE_NUX_ICON_WEB_SEARCH'
  | 1
  | 'CASCADE_NUX_ICON_WINDSURF_BROWSER'
  | 2

export type CascadeNUXIcon__Output = typeof CascadeNUXIcon[keyof typeof CascadeNUXIcon]
