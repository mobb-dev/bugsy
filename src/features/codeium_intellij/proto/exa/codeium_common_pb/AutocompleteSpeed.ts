// Original file: exa/codeium_common_pb/codeium_common.proto

export const AutocompleteSpeed = {
  AUTOCOMPLETE_SPEED_UNSPECIFIED: 'AUTOCOMPLETE_SPEED_UNSPECIFIED',
  AUTOCOMPLETE_SPEED_SLOW: 'AUTOCOMPLETE_SPEED_SLOW',
  AUTOCOMPLETE_SPEED_DEFAULT: 'AUTOCOMPLETE_SPEED_DEFAULT',
  AUTOCOMPLETE_SPEED_FAST: 'AUTOCOMPLETE_SPEED_FAST',
} as const;

export type AutocompleteSpeed =
  | 'AUTOCOMPLETE_SPEED_UNSPECIFIED'
  | 0
  | 'AUTOCOMPLETE_SPEED_SLOW'
  | 1
  | 'AUTOCOMPLETE_SPEED_DEFAULT'
  | 2
  | 'AUTOCOMPLETE_SPEED_FAST'
  | 3

export type AutocompleteSpeed__Output = typeof AutocompleteSpeed[keyof typeof AutocompleteSpeed]
