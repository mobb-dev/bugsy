// Original file: exa/cortex_pb/cortex.proto

import type { UpsertCodemapOutput as _exa_cortex_pb_UpsertCodemapOutput, UpsertCodemapOutput__Output as _exa_cortex_pb_UpsertCodemapOutput__Output } from '../../exa/cortex_pb/UpsertCodemapOutput';
import type { UpsertCodemapRunningStatus as _exa_cortex_pb_UpsertCodemapRunningStatus, UpsertCodemapRunningStatus__Output as _exa_cortex_pb_UpsertCodemapRunningStatus__Output } from '../../exa/cortex_pb/UpsertCodemapRunningStatus';

export interface CortexStepUpsertCodemap {
  'prompt'?: (string);
  'startingPoints'?: (string)[];
  'blocking'?: (boolean);
  'editingCodemapId'?: (string);
  'editingCodemapTitle'?: (string);
  'userRejected'?: (boolean);
  'output'?: (_exa_cortex_pb_UpsertCodemapOutput | null);
  'runningStatus'?: (_exa_cortex_pb_UpsertCodemapRunningStatus | null);
  '_editingCodemapId'?: "editingCodemapId";
  '_editingCodemapTitle'?: "editingCodemapTitle";
  '_output'?: "output";
  '_runningStatus'?: "runningStatus";
}

export interface CortexStepUpsertCodemap__Output {
  'prompt': (string);
  'startingPoints': (string)[];
  'blocking': (boolean);
  'editingCodemapId'?: (string);
  'editingCodemapTitle'?: (string);
  'userRejected': (boolean);
  'output'?: (_exa_cortex_pb_UpsertCodemapOutput__Output | null);
  'runningStatus'?: (_exa_cortex_pb_UpsertCodemapRunningStatus__Output | null);
  '_editingCodemapId'?: "editingCodemapId";
  '_editingCodemapTitle'?: "editingCodemapTitle";
  '_output'?: "output";
  '_runningStatus'?: "runningStatus";
}
