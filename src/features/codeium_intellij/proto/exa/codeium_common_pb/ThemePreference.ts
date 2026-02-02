// Original file: exa/codeium_common_pb/codeium_common.proto

export const ThemePreference = {
  THEME_PREFERENCE_UNSPECIFIED: 'THEME_PREFERENCE_UNSPECIFIED',
  THEME_PREFERENCE_AUTO: 'THEME_PREFERENCE_AUTO',
  THEME_PREFERENCE_LIGHT: 'THEME_PREFERENCE_LIGHT',
  THEME_PREFERENCE_DARK: 'THEME_PREFERENCE_DARK',
} as const;

export type ThemePreference =
  | 'THEME_PREFERENCE_UNSPECIFIED'
  | 0
  | 'THEME_PREFERENCE_AUTO'
  | 1
  | 'THEME_PREFERENCE_LIGHT'
  | 2
  | 'THEME_PREFERENCE_DARK'
  | 3

export type ThemePreference__Output = typeof ThemePreference[keyof typeof ThemePreference]
