// Original file: exa/cortex_pb/cortex.proto

export const CortexStepCompileTool = {
  CORTEX_STEP_COMPILE_TOOL_UNSPECIFIED: 'CORTEX_STEP_COMPILE_TOOL_UNSPECIFIED',
  CORTEX_STEP_COMPILE_TOOL_PYLINT: 'CORTEX_STEP_COMPILE_TOOL_PYLINT',
} as const;

export type CortexStepCompileTool =
  | 'CORTEX_STEP_COMPILE_TOOL_UNSPECIFIED'
  | 0
  | 'CORTEX_STEP_COMPILE_TOOL_PYLINT'
  | 1

export type CortexStepCompileTool__Output = typeof CortexStepCompileTool[keyof typeof CortexStepCompileTool]
