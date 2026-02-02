// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { TerminalShellCommandSource as _exa_codeium_common_pb_TerminalShellCommandSource, TerminalShellCommandSource__Output as _exa_codeium_common_pb_TerminalShellCommandSource__Output } from '../../exa/codeium_common_pb/TerminalShellCommandSource';
import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface TerminalShellCommandHeader {
  'terminalId'?: (string);
  'commandLine'?: (string);
  'cwd'?: (string);
  'startTime'?: (_google_protobuf_Timestamp | null);
  'source'?: (_exa_codeium_common_pb_TerminalShellCommandSource);
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
}

export interface TerminalShellCommandHeader__Output {
  'terminalId': (string);
  'commandLine': (string);
  'cwd': (string);
  'startTime': (_google_protobuf_Timestamp__Output | null);
  'source': (_exa_codeium_common_pb_TerminalShellCommandSource__Output);
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
}
