// Original file: exa/codeium_common_pb/codeium_common.proto

export const ArenaTier = {
  ARENA_TIER_UNSPECIFIED: 'ARENA_TIER_UNSPECIFIED',
  ARENA_TIER_FAST: 'ARENA_TIER_FAST',
  ARENA_TIER_SMART: 'ARENA_TIER_SMART',
} as const;

export type ArenaTier =
  | 'ARENA_TIER_UNSPECIFIED'
  | 0
  | 'ARENA_TIER_FAST'
  | 1
  | 'ARENA_TIER_SMART'
  | 2

export type ArenaTier__Output = typeof ArenaTier[keyof typeof ArenaTier]
