// Original file: exa/cortex_pb/cortex.proto

export const CortexStepCreditReason = {
  CORTEX_STEP_CREDIT_REASON_UNSPECIFIED: 'CORTEX_STEP_CREDIT_REASON_UNSPECIFIED',
  CORTEX_STEP_CREDIT_REASON_LINT_FIXING_DISCOUNT: 'CORTEX_STEP_CREDIT_REASON_LINT_FIXING_DISCOUNT',
} as const;

export type CortexStepCreditReason =
  | 'CORTEX_STEP_CREDIT_REASON_UNSPECIFIED'
  | 0
  | 'CORTEX_STEP_CREDIT_REASON_LINT_FIXING_DISCOUNT'
  | 1

export type CortexStepCreditReason__Output = typeof CortexStepCreditReason[keyof typeof CortexStepCreditReason]
