// Original file: buf/validate/validate.proto

export const Ignore = {
  IGNORE_UNSPECIFIED: 'IGNORE_UNSPECIFIED',
  IGNORE_IF_UNPOPULATED: 'IGNORE_IF_UNPOPULATED',
  IGNORE_IF_DEFAULT_VALUE: 'IGNORE_IF_DEFAULT_VALUE',
  IGNORE_ALWAYS: 'IGNORE_ALWAYS',
} as const;

export type Ignore =
  | 'IGNORE_UNSPECIFIED'
  | 0
  | 'IGNORE_IF_UNPOPULATED'
  | 1
  | 'IGNORE_IF_DEFAULT_VALUE'
  | 2
  | 'IGNORE_ALWAYS'
  | 3

export type Ignore__Output = typeof Ignore[keyof typeof Ignore]
