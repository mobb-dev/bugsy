// Original file: exa/cortex_pb/cortex.proto

export const PlanStatus = {
  PLAN_STATUS_UNSPECIFIED: 'PLAN_STATUS_UNSPECIFIED',
  PLAN_STATUS_INITIALIZED: 'PLAN_STATUS_INITIALIZED',
  PLAN_STATUS_PLANNING: 'PLAN_STATUS_PLANNING',
  PLAN_STATUS_PLANNED: 'PLAN_STATUS_PLANNED',
  PLAN_STATUS_ERROR: 'PLAN_STATUS_ERROR',
} as const;

export type PlanStatus =
  | 'PLAN_STATUS_UNSPECIFIED'
  | 0
  | 'PLAN_STATUS_INITIALIZED'
  | 1
  | 'PLAN_STATUS_PLANNING'
  | 2
  | 'PLAN_STATUS_PLANNED'
  | 3
  | 'PLAN_STATUS_ERROR'
  | 4

export type PlanStatus__Output = typeof PlanStatus[keyof typeof PlanStatus]
