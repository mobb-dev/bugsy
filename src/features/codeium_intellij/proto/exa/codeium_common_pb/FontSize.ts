// Original file: exa/codeium_common_pb/codeium_common.proto

export const FontSize = {
  FONT_SIZE_UNSPECIFIED: 'FONT_SIZE_UNSPECIFIED',
  FONT_SIZE_SMALL: 'FONT_SIZE_SMALL',
  FONT_SIZE_DEFAULT: 'FONT_SIZE_DEFAULT',
  FONT_SIZE_LARGE: 'FONT_SIZE_LARGE',
} as const;

export type FontSize =
  | 'FONT_SIZE_UNSPECIFIED'
  | 0
  | 'FONT_SIZE_SMALL'
  | 1
  | 'FONT_SIZE_DEFAULT'
  | 2
  | 'FONT_SIZE_LARGE'
  | 3

export type FontSize__Output = typeof FontSize[keyof typeof FontSize]
