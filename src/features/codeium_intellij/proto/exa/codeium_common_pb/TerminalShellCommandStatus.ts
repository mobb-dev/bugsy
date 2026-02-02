// Original file: exa/codeium_common_pb/codeium_common.proto

export const TerminalShellCommandStatus = {
  TERMINAL_SHELL_COMMAND_STATUS_UNSPECIFIED: 'TERMINAL_SHELL_COMMAND_STATUS_UNSPECIFIED',
  TERMINAL_SHELL_COMMAND_STATUS_RUNNING: 'TERMINAL_SHELL_COMMAND_STATUS_RUNNING',
  TERMINAL_SHELL_COMMAND_STATUS_COMPLETED: 'TERMINAL_SHELL_COMMAND_STATUS_COMPLETED',
} as const;

export type TerminalShellCommandStatus =
  | 'TERMINAL_SHELL_COMMAND_STATUS_UNSPECIFIED'
  | 0
  | 'TERMINAL_SHELL_COMMAND_STATUS_RUNNING'
  | 1
  | 'TERMINAL_SHELL_COMMAND_STATUS_COMPLETED'
  | 2

export type TerminalShellCommandStatus__Output = typeof TerminalShellCommandStatus[keyof typeof TerminalShellCommandStatus]
