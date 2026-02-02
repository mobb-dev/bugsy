// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';
import type { CortexStepGeneratorMetadata as _exa_cortex_pb_CortexStepGeneratorMetadata, CortexStepGeneratorMetadata__Output as _exa_cortex_pb_CortexStepGeneratorMetadata__Output } from '../../exa/cortex_pb/CortexStepGeneratorMetadata';
import type { CortexTrajectoryType as _exa_cortex_pb_CortexTrajectoryType, CortexTrajectoryType__Output as _exa_cortex_pb_CortexTrajectoryType__Output } from '../../exa/cortex_pb/CortexTrajectoryType';
import type { CortexTrajectoryReference as _exa_cortex_pb_CortexTrajectoryReference, CortexTrajectoryReference__Output as _exa_cortex_pb_CortexTrajectoryReference__Output } from '../../exa/cortex_pb/CortexTrajectoryReference';
import type { CortexTrajectoryMetadata as _exa_cortex_pb_CortexTrajectoryMetadata, CortexTrajectoryMetadata__Output as _exa_cortex_pb_CortexTrajectoryMetadata__Output } from '../../exa/cortex_pb/CortexTrajectoryMetadata';
import type { CortexTrajectorySource as _exa_cortex_pb_CortexTrajectorySource, CortexTrajectorySource__Output as _exa_cortex_pb_CortexTrajectorySource__Output } from '../../exa/cortex_pb/CortexTrajectorySource';
import type { ExecutorMetadata as _exa_cortex_pb_ExecutorMetadata, ExecutorMetadata__Output as _exa_cortex_pb_ExecutorMetadata__Output } from '../../exa/cortex_pb/ExecutorMetadata';
import type { QueuedMessage as _exa_cortex_pb_QueuedMessage, QueuedMessage__Output as _exa_cortex_pb_QueuedMessage__Output } from '../../exa/cortex_pb/QueuedMessage';
import type { ArenaModeInfo as _exa_cortex_pb_ArenaModeInfo, ArenaModeInfo__Output as _exa_cortex_pb_ArenaModeInfo__Output } from '../../exa/cortex_pb/ArenaModeInfo';
import type { ConversationalPlannerMode as _exa_codeium_common_pb_ConversationalPlannerMode, ConversationalPlannerMode__Output as _exa_codeium_common_pb_ConversationalPlannerMode__Output } from '../../exa/codeium_common_pb/ConversationalPlannerMode';

export interface CortexTrajectory {
  'trajectoryId'?: (string);
  'steps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
  'generatorMetadata'?: (_exa_cortex_pb_CortexStepGeneratorMetadata)[];
  'trajectoryType'?: (_exa_cortex_pb_CortexTrajectoryType);
  'parentReferences'?: (_exa_cortex_pb_CortexTrajectoryReference)[];
  'cascadeId'?: (string);
  'metadata'?: (_exa_cortex_pb_CortexTrajectoryMetadata | null);
  'source'?: (_exa_cortex_pb_CortexTrajectorySource);
  'executorMetadatas'?: (_exa_cortex_pb_ExecutorMetadata)[];
  'renamedTitle'?: (string);
  'virtualFsSerializedOverlay'?: (Buffer | Uint8Array | string);
  'diffLinesAdded'?: (number);
  'diffLinesRemoved'?: (number);
  'arenaId'?: (string);
  'messageQueue'?: (_exa_cortex_pb_QueuedMessage)[];
  'gitWorktreePath'?: (string);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo | null);
  'conversationalMode'?: (_exa_codeium_common_pb_ConversationalPlannerMode);
  '_renamedTitle'?: "renamedTitle";
  '_virtualFsSerializedOverlay'?: "virtualFsSerializedOverlay";
  '_arenaId'?: "arenaId";
  '_gitWorktreePath'?: "gitWorktreePath";
  '_arenaModeInfo'?: "arenaModeInfo";
  '_conversationalMode'?: "conversationalMode";
}

export interface CortexTrajectory__Output {
  'trajectoryId': (string);
  'steps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
  'generatorMetadata': (_exa_cortex_pb_CortexStepGeneratorMetadata__Output)[];
  'trajectoryType': (_exa_cortex_pb_CortexTrajectoryType__Output);
  'parentReferences': (_exa_cortex_pb_CortexTrajectoryReference__Output)[];
  'cascadeId': (string);
  'metadata': (_exa_cortex_pb_CortexTrajectoryMetadata__Output | null);
  'source': (_exa_cortex_pb_CortexTrajectorySource__Output);
  'executorMetadatas': (_exa_cortex_pb_ExecutorMetadata__Output)[];
  'renamedTitle'?: (string);
  'virtualFsSerializedOverlay'?: (Buffer);
  'diffLinesAdded': (number);
  'diffLinesRemoved': (number);
  'arenaId'?: (string);
  'messageQueue': (_exa_cortex_pb_QueuedMessage__Output)[];
  'gitWorktreePath'?: (string);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo__Output | null);
  'conversationalMode'?: (_exa_codeium_common_pb_ConversationalPlannerMode__Output);
  '_renamedTitle'?: "renamedTitle";
  '_virtualFsSerializedOverlay'?: "virtualFsSerializedOverlay";
  '_arenaId'?: "arenaId";
  '_gitWorktreePath'?: "gitWorktreePath";
  '_arenaModeInfo'?: "arenaModeInfo";
  '_conversationalMode'?: "conversationalMode";
}
