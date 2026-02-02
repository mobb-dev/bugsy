// Original file: exa/cortex_pb/cortex.proto

export const CodeHeuristicFailure = {
  CODE_HEURISTIC_FAILURE_UNSPECIFIED: 'CODE_HEURISTIC_FAILURE_UNSPECIFIED',
  CODE_HEURISTIC_FAILURE_LAZY_COMMENT: 'CODE_HEURISTIC_FAILURE_LAZY_COMMENT',
  CODE_HEURISTIC_FAILURE_DELETED_LINES: 'CODE_HEURISTIC_FAILURE_DELETED_LINES',
} as const;

export type CodeHeuristicFailure =
  | 'CODE_HEURISTIC_FAILURE_UNSPECIFIED'
  | 0
  | 'CODE_HEURISTIC_FAILURE_LAZY_COMMENT'
  | 1
  | 'CODE_HEURISTIC_FAILURE_DELETED_LINES'
  | 2

export type CodeHeuristicFailure__Output = typeof CodeHeuristicFailure[keyof typeof CodeHeuristicFailure]
