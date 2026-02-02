// Original file: exa/codeium_common_pb/codeium_common.proto

export const AnnotationsConfig = {
  ANNOTATIONS_CONFIG_UNSPECIFIED: 'ANNOTATIONS_CONFIG_UNSPECIFIED',
  ANNOTATIONS_CONFIG_ENABLED: 'ANNOTATIONS_CONFIG_ENABLED',
  ANNOTATIONS_CONFIG_DISABLED: 'ANNOTATIONS_CONFIG_DISABLED',
} as const;

export type AnnotationsConfig =
  | 'ANNOTATIONS_CONFIG_UNSPECIFIED'
  | 0
  | 'ANNOTATIONS_CONFIG_ENABLED'
  | 1
  | 'ANNOTATIONS_CONFIG_DISABLED'
  | 2

export type AnnotationsConfig__Output = typeof AnnotationsConfig[keyof typeof AnnotationsConfig]
