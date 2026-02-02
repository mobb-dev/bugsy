// Original file: buf/validate/validate.proto

export const KnownRegex = {
  KNOWN_REGEX_UNSPECIFIED: 'KNOWN_REGEX_UNSPECIFIED',
  KNOWN_REGEX_HTTP_HEADER_NAME: 'KNOWN_REGEX_HTTP_HEADER_NAME',
  KNOWN_REGEX_HTTP_HEADER_VALUE: 'KNOWN_REGEX_HTTP_HEADER_VALUE',
} as const;

export type KnownRegex =
  | 'KNOWN_REGEX_UNSPECIFIED'
  | 0
  | 'KNOWN_REGEX_HTTP_HEADER_NAME'
  | 1
  | 'KNOWN_REGEX_HTTP_HEADER_VALUE'
  | 2

export type KnownRegex__Output = typeof KnownRegex[keyof typeof KnownRegex]
