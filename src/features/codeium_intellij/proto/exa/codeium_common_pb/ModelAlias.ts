// Original file: exa/codeium_common_pb/codeium_common.proto

export const ModelAlias = {
  MODEL_ALIAS_UNSPECIFIED: 'MODEL_ALIAS_UNSPECIFIED',
  MODEL_ALIAS_CASCADE_BASE: 'MODEL_ALIAS_CASCADE_BASE',
  MODEL_ALIAS_VISTA: 'MODEL_ALIAS_VISTA',
  MODEL_ALIAS_SHAMU: 'MODEL_ALIAS_SHAMU',
  MODEL_ALIAS_SWE_1: 'MODEL_ALIAS_SWE_1',
  MODEL_ALIAS_SWE_1_LITE: 'MODEL_ALIAS_SWE_1_LITE',
  MODEL_ALIAS_AUTO: 'MODEL_ALIAS_AUTO',
} as const;

export type ModelAlias =
  | 'MODEL_ALIAS_UNSPECIFIED'
  | 0
  | 'MODEL_ALIAS_CASCADE_BASE'
  | 1
  | 'MODEL_ALIAS_VISTA'
  | 3
  | 'MODEL_ALIAS_SHAMU'
  | 4
  | 'MODEL_ALIAS_SWE_1'
  | 5
  | 'MODEL_ALIAS_SWE_1_LITE'
  | 6
  | 'MODEL_ALIAS_AUTO'
  | 7

export type ModelAlias__Output = typeof ModelAlias[keyof typeof ModelAlias]
