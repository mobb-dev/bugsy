// Original file: exa/language_server_pb/language_server.proto

import type { UserStepSnapshot as _exa_cortex_pb_UserStepSnapshot, UserStepSnapshot__Output as _exa_cortex_pb_UserStepSnapshot__Output } from '../../exa/cortex_pb/UserStepSnapshot';

export interface RecordUserStepSnapshotRequest {
  'cascadeId'?: (string);
  'stepIndex'?: (number);
  'snapshot'?: (_exa_cortex_pb_UserStepSnapshot | null);
}

export interface RecordUserStepSnapshotRequest__Output {
  'cascadeId': (string);
  'stepIndex': (number);
  'snapshot': (_exa_cortex_pb_UserStepSnapshot__Output | null);
}
