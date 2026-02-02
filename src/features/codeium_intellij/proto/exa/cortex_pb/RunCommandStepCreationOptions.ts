// Original file: exa/cortex_pb/cortex.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface RunCommandStepCreationOptions {
  'maxCommands'?: (number);
  'maxCommandAge'?: (_google_protobuf_Duration | null);
  'perCommandMaxBytesOutput'?: (number);
  'totalMaxBytesOutput'?: (number);
  'includeRunning'?: (boolean);
  '_includeRunning'?: "includeRunning";
}

export interface RunCommandStepCreationOptions__Output {
  'maxCommands': (number);
  'maxCommandAge': (_google_protobuf_Duration__Output | null);
  'perCommandMaxBytesOutput': (number);
  'totalMaxBytesOutput': (number);
  'includeRunning'?: (boolean);
  '_includeRunning'?: "includeRunning";
}
