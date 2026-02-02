// Original file: exa/cortex_pb/cortex.proto

export const RunCommandAction = {
  RUN_COMMAND_ACTION_UNSPECIFIED: 'RUN_COMMAND_ACTION_UNSPECIFIED',
  RUN_COMMAND_ACTION_CONFIRM: 'RUN_COMMAND_ACTION_CONFIRM',
  RUN_COMMAND_ACTION_REJECT: 'RUN_COMMAND_ACTION_REJECT',
  RUN_COMMAND_ACTION_SKIP: 'RUN_COMMAND_ACTION_SKIP',
} as const;

export type RunCommandAction =
  | 'RUN_COMMAND_ACTION_UNSPECIFIED'
  | 0
  | 'RUN_COMMAND_ACTION_CONFIRM'
  | 1
  | 'RUN_COMMAND_ACTION_REJECT'
  | 2
  | 'RUN_COMMAND_ACTION_SKIP'
  | 3

export type RunCommandAction__Output = typeof RunCommandAction[keyof typeof RunCommandAction]
