// Original file: exa/codeium_common_pb/codeium_common.proto

export const ThirdPartyWebSearchProvider = {
  THIRD_PARTY_WEB_SEARCH_PROVIDER_UNSPECIFIED: 'THIRD_PARTY_WEB_SEARCH_PROVIDER_UNSPECIFIED',
  THIRD_PARTY_WEB_SEARCH_PROVIDER_OPENAI: 'THIRD_PARTY_WEB_SEARCH_PROVIDER_OPENAI',
} as const;

export type ThirdPartyWebSearchProvider =
  | 'THIRD_PARTY_WEB_SEARCH_PROVIDER_UNSPECIFIED'
  | 0
  | 'THIRD_PARTY_WEB_SEARCH_PROVIDER_OPENAI'
  | 1

export type ThirdPartyWebSearchProvider__Output = typeof ThirdPartyWebSearchProvider[keyof typeof ThirdPartyWebSearchProvider]
