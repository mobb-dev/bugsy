// Original file: exa/language_server_pb/language_server.proto

export const ContextSuggestionSource = {
  CONTEXT_SUGGESTION_SOURCE_UNSPECIFIED: 'CONTEXT_SUGGESTION_SOURCE_UNSPECIFIED',
  CONTEXT_SUGGESTION_SOURCE_COMMIT_HISTORY: 'CONTEXT_SUGGESTION_SOURCE_COMMIT_HISTORY',
  CONTEXT_SUGGESTION_SOURCE_CURRENT_PLAN: 'CONTEXT_SUGGESTION_SOURCE_CURRENT_PLAN',
} as const;

export type ContextSuggestionSource =
  | 'CONTEXT_SUGGESTION_SOURCE_UNSPECIFIED'
  | 0
  | 'CONTEXT_SUGGESTION_SOURCE_COMMIT_HISTORY'
  | 1
  | 'CONTEXT_SUGGESTION_SOURCE_CURRENT_PLAN'
  | 2

export type ContextSuggestionSource__Output = typeof ContextSuggestionSource[keyof typeof ContextSuggestionSource]
