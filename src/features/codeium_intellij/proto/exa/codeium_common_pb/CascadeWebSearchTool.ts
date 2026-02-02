// Original file: exa/codeium_common_pb/codeium_common.proto

export const CascadeWebSearchTool = {
  CASCADE_WEB_SEARCH_TOOL_UNSPECIFIED: 'CASCADE_WEB_SEARCH_TOOL_UNSPECIFIED',
  CASCADE_WEB_SEARCH_TOOL_ENABLED: 'CASCADE_WEB_SEARCH_TOOL_ENABLED',
  CASCADE_WEB_SEARCH_TOOL_DISABLED: 'CASCADE_WEB_SEARCH_TOOL_DISABLED',
} as const;

export type CascadeWebSearchTool =
  | 'CASCADE_WEB_SEARCH_TOOL_UNSPECIFIED'
  | 0
  | 'CASCADE_WEB_SEARCH_TOOL_ENABLED'
  | 1
  | 'CASCADE_WEB_SEARCH_TOOL_DISABLED'
  | 2

export type CascadeWebSearchTool__Output = typeof CascadeWebSearchTool[keyof typeof CascadeWebSearchTool]
