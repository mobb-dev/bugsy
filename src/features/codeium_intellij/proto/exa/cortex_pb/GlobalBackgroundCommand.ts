// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepStatus as _exa_cortex_pb_CortexStepStatus, CortexStepStatus__Output as _exa_cortex_pb_CortexStepStatus__Output } from '../../exa/cortex_pb/CortexStepStatus';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface GlobalBackgroundCommand {
  'commandId'?: (string);
  'trajectoryId'?: (string);
  'stepIndex'?: (number);
  'commandLine'?: (string);
  'status'?: (_exa_cortex_pb_CortexStepStatus);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'lastUpdatedAt'?: (_google_protobuf_Timestamp | null);
  'terminalId'?: (string);
}

export interface GlobalBackgroundCommand__Output {
  'commandId': (string);
  'trajectoryId': (string);
  'stepIndex': (number);
  'commandLine': (string);
  'status': (_exa_cortex_pb_CortexStepStatus__Output);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'lastUpdatedAt': (_google_protobuf_Timestamp__Output | null);
  'terminalId': (string);
}
