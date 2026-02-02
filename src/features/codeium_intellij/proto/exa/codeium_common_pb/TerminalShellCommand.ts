// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { TerminalShellCommandStatus as _exa_codeium_common_pb_TerminalShellCommandStatus, TerminalShellCommandStatus__Output as _exa_codeium_common_pb_TerminalShellCommandStatus__Output } from '../../exa/codeium_common_pb/TerminalShellCommandStatus';
import type { TerminalShellCommandSource as _exa_codeium_common_pb_TerminalShellCommandSource, TerminalShellCommandSource__Output as _exa_codeium_common_pb_TerminalShellCommandSource__Output } from '../../exa/codeium_common_pb/TerminalShellCommandSource';

export interface TerminalShellCommand {
  'commandLine'?: (string);
  'cwd'?: (string);
  'output'?: (Buffer | Uint8Array | string);
  'exitCode'?: (number);
  'startTime'?: (_google_protobuf_Timestamp | null);
  'endTime'?: (_google_protobuf_Timestamp | null);
  'status'?: (_exa_codeium_common_pb_TerminalShellCommandStatus);
  'source'?: (_exa_codeium_common_pb_TerminalShellCommandSource);
  'id'?: (string);
  'lastUpdatedTime'?: (_google_protobuf_Timestamp | null);
  '_exitCode'?: "exitCode";
}

export interface TerminalShellCommand__Output {
  'commandLine': (string);
  'cwd': (string);
  'output': (Buffer);
  'exitCode'?: (number);
  'startTime': (_google_protobuf_Timestamp__Output | null);
  'endTime': (_google_protobuf_Timestamp__Output | null);
  'status': (_exa_codeium_common_pb_TerminalShellCommandStatus__Output);
  'source': (_exa_codeium_common_pb_TerminalShellCommandSource__Output);
  'id': (string);
  'lastUpdatedTime': (_google_protobuf_Timestamp__Output | null);
  '_exitCode'?: "exitCode";
}
