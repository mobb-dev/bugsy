// Original file: exa/chat_pb/chat.proto

export const DeepWikiRequestType = {
  DEEP_WIKI_REQUEST_TYPE_UNSPECIFIED: 'DEEP_WIKI_REQUEST_TYPE_UNSPECIFIED',
  DEEP_WIKI_REQUEST_TYPE_SUMMARY: 'DEEP_WIKI_REQUEST_TYPE_SUMMARY',
  DEEP_WIKI_REQUEST_TYPE_ARTICLE: 'DEEP_WIKI_REQUEST_TYPE_ARTICLE',
} as const;

export type DeepWikiRequestType =
  | 'DEEP_WIKI_REQUEST_TYPE_UNSPECIFIED'
  | 0
  | 'DEEP_WIKI_REQUEST_TYPE_SUMMARY'
  | 1
  | 'DEEP_WIKI_REQUEST_TYPE_ARTICLE'
  | 2

export type DeepWikiRequestType__Output = typeof DeepWikiRequestType[keyof typeof DeepWikiRequestType]
