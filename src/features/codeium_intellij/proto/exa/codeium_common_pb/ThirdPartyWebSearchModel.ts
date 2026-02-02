// Original file: exa/codeium_common_pb/codeium_common.proto

export const ThirdPartyWebSearchModel = {
  THIRD_PARTY_WEB_SEARCH_MODEL_UNSPECIFIED: 'THIRD_PARTY_WEB_SEARCH_MODEL_UNSPECIFIED',
  THIRD_PARTY_WEB_SEARCH_MODEL_O3: 'THIRD_PARTY_WEB_SEARCH_MODEL_O3',
  THIRD_PARTY_WEB_SEARCH_MODEL_GPT_4_1: 'THIRD_PARTY_WEB_SEARCH_MODEL_GPT_4_1',
  THIRD_PARTY_WEB_SEARCH_MODEL_O4_MINI: 'THIRD_PARTY_WEB_SEARCH_MODEL_O4_MINI',
} as const;

export type ThirdPartyWebSearchModel =
  | 'THIRD_PARTY_WEB_SEARCH_MODEL_UNSPECIFIED'
  | 0
  | 'THIRD_PARTY_WEB_SEARCH_MODEL_O3'
  | 1
  | 'THIRD_PARTY_WEB_SEARCH_MODEL_GPT_4_1'
  | 2
  | 'THIRD_PARTY_WEB_SEARCH_MODEL_O4_MINI'
  | 3

export type ThirdPartyWebSearchModel__Output = typeof ThirdPartyWebSearchModel[keyof typeof ThirdPartyWebSearchModel]
