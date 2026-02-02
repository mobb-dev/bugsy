// Original file: exa/codeium_common_pb/codeium_common.proto

export const TerminalShellCommandSource = {
  TERMINAL_SHELL_COMMAND_SOURCE_UNSPECIFIED: 'TERMINAL_SHELL_COMMAND_SOURCE_UNSPECIFIED',
  TERMINAL_SHELL_COMMAND_SOURCE_USER: 'TERMINAL_SHELL_COMMAND_SOURCE_USER',
  TERMINAL_SHELL_COMMAND_SOURCE_CASCADE: 'TERMINAL_SHELL_COMMAND_SOURCE_CASCADE',
} as const;

export type TerminalShellCommandSource =
  | 'TERMINAL_SHELL_COMMAND_SOURCE_UNSPECIFIED'
  | 0
  | 'TERMINAL_SHELL_COMMAND_SOURCE_USER'
  | 1
  | 'TERMINAL_SHELL_COMMAND_SOURCE_CASCADE'
  | 2

export type TerminalShellCommandSource__Output = typeof TerminalShellCommandSource[keyof typeof TerminalShellCommandSource]
