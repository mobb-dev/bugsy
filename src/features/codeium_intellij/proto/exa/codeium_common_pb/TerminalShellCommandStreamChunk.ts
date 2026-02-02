// Original file: exa/codeium_common_pb/codeium_common.proto

import type { TerminalShellCommandHeader as _exa_codeium_common_pb_TerminalShellCommandHeader, TerminalShellCommandHeader__Output as _exa_codeium_common_pb_TerminalShellCommandHeader__Output } from '../../exa/codeium_common_pb/TerminalShellCommandHeader';
import type { TerminalShellCommandData as _exa_codeium_common_pb_TerminalShellCommandData, TerminalShellCommandData__Output as _exa_codeium_common_pb_TerminalShellCommandData__Output } from '../../exa/codeium_common_pb/TerminalShellCommandData';
import type { TerminalShellCommandTrailer as _exa_codeium_common_pb_TerminalShellCommandTrailer, TerminalShellCommandTrailer__Output as _exa_codeium_common_pb_TerminalShellCommandTrailer__Output } from '../../exa/codeium_common_pb/TerminalShellCommandTrailer';

export interface TerminalShellCommandStreamChunk {
  'header'?: (_exa_codeium_common_pb_TerminalShellCommandHeader | null);
  'data'?: (_exa_codeium_common_pb_TerminalShellCommandData | null);
  'trailer'?: (_exa_codeium_common_pb_TerminalShellCommandTrailer | null);
  'value'?: "header"|"data"|"trailer";
}

export interface TerminalShellCommandStreamChunk__Output {
  'header'?: (_exa_codeium_common_pb_TerminalShellCommandHeader__Output | null);
  'data'?: (_exa_codeium_common_pb_TerminalShellCommandData__Output | null);
  'trailer'?: (_exa_codeium_common_pb_TerminalShellCommandTrailer__Output | null);
  'value'?: "header"|"data"|"trailer";
}
