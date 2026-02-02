// Original file: exa/codeium_common_pb/codeium_common.proto

export const PlanMode = {
  PLAN_MODE_UNSPECIFIED: 'PLAN_MODE_UNSPECIFIED',
  PLAN_MODE_ON: 'PLAN_MODE_ON',
  PLAN_MODE_OFF: 'PLAN_MODE_OFF',
} as const;

export type PlanMode =
  | 'PLAN_MODE_UNSPECIFIED'
  | 0
  | 'PLAN_MODE_ON'
  | 1
  | 'PLAN_MODE_OFF'
  | 2

export type PlanMode__Output = typeof PlanMode[keyof typeof PlanMode]
