// Original file: exa/cortex_pb/cortex.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CascadeRunStatus as _exa_cortex_pb_CascadeRunStatus, CascadeRunStatus__Output as _exa_cortex_pb_CascadeRunStatus__Output } from '../../exa/cortex_pb/CascadeRunStatus';
import type { CortexTrajectoryStepWithIndex as _exa_cortex_pb_CortexTrajectoryStepWithIndex, CortexTrajectoryStepWithIndex__Output as _exa_cortex_pb_CortexTrajectoryStepWithIndex__Output } from '../../exa/cortex_pb/CortexTrajectoryStepWithIndex';
import type { CortexWorkspaceMetadata as _exa_cortex_pb_CortexWorkspaceMetadata, CortexWorkspaceMetadata__Output as _exa_cortex_pb_CortexWorkspaceMetadata__Output } from '../../exa/cortex_pb/CortexWorkspaceMetadata';
import type { GlobalBackgroundCommand as _exa_cortex_pb_GlobalBackgroundCommand, GlobalBackgroundCommand__Output as _exa_cortex_pb_GlobalBackgroundCommand__Output } from '../../exa/cortex_pb/GlobalBackgroundCommand';
import type { LastTodoListStepInfo as _exa_cortex_pb_LastTodoListStepInfo, LastTodoListStepInfo__Output as _exa_cortex_pb_LastTodoListStepInfo__Output } from '../../exa/cortex_pb/LastTodoListStepInfo';
import type { CortexTrajectoryType as _exa_cortex_pb_CortexTrajectoryType, CortexTrajectoryType__Output as _exa_cortex_pb_CortexTrajectoryType__Output } from '../../exa/cortex_pb/CortexTrajectoryType';
import type { CortexTrajectorySource as _exa_cortex_pb_CortexTrajectorySource, CortexTrajectorySource__Output as _exa_cortex_pb_CortexTrajectorySource__Output } from '../../exa/cortex_pb/CortexTrajectorySource';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ArenaModeInfo as _exa_cortex_pb_ArenaModeInfo, ArenaModeInfo__Output as _exa_cortex_pb_ArenaModeInfo__Output } from '../../exa/cortex_pb/ArenaModeInfo';
import type { ContextScopeItem as _exa_codeium_common_pb_ContextScopeItem, ContextScopeItem__Output as _exa_codeium_common_pb_ContextScopeItem__Output } from '../../exa/codeium_common_pb/ContextScopeItem';

export interface CascadeTrajectorySummary {
  'summary'?: (string);
  'stepCount'?: (number);
  'lastModifiedTime'?: (_google_protobuf_Timestamp | null);
  'trajectoryId'?: (string);
  'status'?: (_exa_cortex_pb_CascadeRunStatus);
  'createdTime'?: (_google_protobuf_Timestamp | null);
  'waitingSteps'?: (_exa_cortex_pb_CortexTrajectoryStepWithIndex)[];
  'workspaces'?: (_exa_cortex_pb_CortexWorkspaceMetadata)[];
  'lastUserInputTime'?: (_google_protobuf_Timestamp | null);
  'renamedTitle'?: (string);
  'backgroundCommands'?: (_exa_cortex_pb_GlobalBackgroundCommand)[];
  'lastTodoListStep'?: (_exa_cortex_pb_LastTodoListStepInfo | null);
  'errored'?: (boolean);
  'diffLinesAdded'?: (number);
  'diffLinesRemoved'?: (number);
  'arenaId'?: (string);
  'hidden'?: (boolean);
  'queueSize'?: (number);
  'gitWorktreePath'?: (string);
  'trajectoryType'?: (_exa_cortex_pb_CortexTrajectoryType);
  'trajectorySource'?: (_exa_cortex_pb_CortexTrajectorySource);
  'lastGeneratorModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo | null);
  'lastGeneratorModelUid'?: (string);
  'referencedContextItems'?: (_exa_codeium_common_pb_ContextScopeItem)[];
  '_renamedTitle'?: "renamedTitle";
  '_lastTodoListStep'?: "lastTodoListStep";
  '_arenaId'?: "arenaId";
  '_gitWorktreePath'?: "gitWorktreePath";
  '_lastGeneratorModelDeprecated'?: "lastGeneratorModelDeprecated";
  '_arenaModeInfo'?: "arenaModeInfo";
  '_lastGeneratorModelUid'?: "lastGeneratorModelUid";
}

export interface CascadeTrajectorySummary__Output {
  'summary': (string);
  'stepCount': (number);
  'lastModifiedTime': (_google_protobuf_Timestamp__Output | null);
  'trajectoryId': (string);
  'status': (_exa_cortex_pb_CascadeRunStatus__Output);
  'createdTime': (_google_protobuf_Timestamp__Output | null);
  'waitingSteps': (_exa_cortex_pb_CortexTrajectoryStepWithIndex__Output)[];
  'workspaces': (_exa_cortex_pb_CortexWorkspaceMetadata__Output)[];
  'lastUserInputTime': (_google_protobuf_Timestamp__Output | null);
  'renamedTitle'?: (string);
  'backgroundCommands': (_exa_cortex_pb_GlobalBackgroundCommand__Output)[];
  'lastTodoListStep'?: (_exa_cortex_pb_LastTodoListStepInfo__Output | null);
  'errored': (boolean);
  'diffLinesAdded': (number);
  'diffLinesRemoved': (number);
  'arenaId'?: (string);
  'hidden': (boolean);
  'queueSize': (number);
  'gitWorktreePath'?: (string);
  'trajectoryType': (_exa_cortex_pb_CortexTrajectoryType__Output);
  'trajectorySource': (_exa_cortex_pb_CortexTrajectorySource__Output);
  'lastGeneratorModelDeprecated'?: (_exa_codeium_common_pb_Model__Output);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo__Output | null);
  'lastGeneratorModelUid'?: (string);
  'referencedContextItems': (_exa_codeium_common_pb_ContextScopeItem__Output)[];
  '_renamedTitle'?: "renamedTitle";
  '_lastTodoListStep'?: "lastTodoListStep";
  '_arenaId'?: "arenaId";
  '_gitWorktreePath'?: "gitWorktreePath";
  '_lastGeneratorModelDeprecated'?: "lastGeneratorModelDeprecated";
  '_arenaModeInfo'?: "arenaModeInfo";
  '_lastGeneratorModelUid'?: "lastGeneratorModelUid";
}
