// Original file: exa/codeium_common_pb/codeium_common.proto

export const ModelCostTier = {
  MODEL_COST_TIER_UNSPECIFIED: 'MODEL_COST_TIER_UNSPECIFIED',
  MODEL_COST_TIER_LOW: 'MODEL_COST_TIER_LOW',
  MODEL_COST_TIER_MEDIUM: 'MODEL_COST_TIER_MEDIUM',
  MODEL_COST_TIER_HIGH: 'MODEL_COST_TIER_HIGH',
} as const;

export type ModelCostTier =
  | 'MODEL_COST_TIER_UNSPECIFIED'
  | 0
  | 'MODEL_COST_TIER_LOW'
  | 1
  | 'MODEL_COST_TIER_MEDIUM'
  | 2
  | 'MODEL_COST_TIER_HIGH'
  | 3

export type ModelCostTier__Output = typeof ModelCostTier[keyof typeof ModelCostTier]
