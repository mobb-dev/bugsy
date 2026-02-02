// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface TerminalShellCommandTrailer {
  'exitCode'?: (number);
  'endTime'?: (_google_protobuf_Timestamp | null);
  'fullOutput'?: (string);
  'ansiOutput'?: (string);
  '_exitCode'?: "exitCode";
  '_fullOutput'?: "fullOutput";
  '_ansiOutput'?: "ansiOutput";
}

export interface TerminalShellCommandTrailer__Output {
  'exitCode'?: (number);
  'endTime': (_google_protobuf_Timestamp__Output | null);
  'fullOutput'?: (string);
  'ansiOutput'?: (string);
  '_exitCode'?: "exitCode";
  '_fullOutput'?: "fullOutput";
  '_ansiOutput'?: "ansiOutput";
}
