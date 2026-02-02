// Original file: exa/codeium_common_pb/codeium_common.proto

export const CommandPopupAutocomplete = {
  COMMAND_POPUP_AUTOCOMPLETE_UNSPECIFIED: 'COMMAND_POPUP_AUTOCOMPLETE_UNSPECIFIED',
  COMMAND_POPUP_AUTOCOMPLETE_ENABLED: 'COMMAND_POPUP_AUTOCOMPLETE_ENABLED',
  COMMAND_POPUP_AUTOCOMPLETE_DISABLED: 'COMMAND_POPUP_AUTOCOMPLETE_DISABLED',
} as const;

export type CommandPopupAutocomplete =
  | 'COMMAND_POPUP_AUTOCOMPLETE_UNSPECIFIED'
  | 0
  | 'COMMAND_POPUP_AUTOCOMPLETE_ENABLED'
  | 1
  | 'COMMAND_POPUP_AUTOCOMPLETE_DISABLED'
  | 2

export type CommandPopupAutocomplete__Output = typeof CommandPopupAutocomplete[keyof typeof CommandPopupAutocomplete]
