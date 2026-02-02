// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { BaseTrajectoryIdentifier as _exa_cortex_pb_BaseTrajectoryIdentifier, BaseTrajectoryIdentifier__Output as _exa_cortex_pb_BaseTrajectoryIdentifier__Output } from '../../exa/cortex_pb/BaseTrajectoryIdentifier';
import type { CortexTrajectorySource as _exa_cortex_pb_CortexTrajectorySource, CortexTrajectorySource__Output as _exa_cortex_pb_CortexTrajectorySource__Output } from '../../exa/cortex_pb/CortexTrajectorySource';
import type { CortexTrajectoryType as _exa_cortex_pb_CortexTrajectoryType, CortexTrajectoryType__Output as _exa_cortex_pb_CortexTrajectoryType__Output } from '../../exa/cortex_pb/CortexTrajectoryType';
import type { ArenaModeInfo as _exa_cortex_pb_ArenaModeInfo, ArenaModeInfo__Output as _exa_cortex_pb_ArenaModeInfo__Output } from '../../exa/cortex_pb/ArenaModeInfo';

export interface StartCascadeRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'baseTrajectoryIdentifier'?: (_exa_cortex_pb_BaseTrajectoryIdentifier | null);
  'source'?: (_exa_cortex_pb_CortexTrajectorySource);
  'trajectoryType'?: (_exa_cortex_pb_CortexTrajectoryType);
  'startArena'?: (number);
  'gitWorktree'?: (boolean);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo | null);
  '_startArena'?: "startArena";
  '_gitWorktree'?: "gitWorktree";
  '_arenaModeInfo'?: "arenaModeInfo";
}

export interface StartCascadeRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'baseTrajectoryIdentifier': (_exa_cortex_pb_BaseTrajectoryIdentifier__Output | null);
  'source': (_exa_cortex_pb_CortexTrajectorySource__Output);
  'trajectoryType': (_exa_cortex_pb_CortexTrajectoryType__Output);
  'startArena'?: (number);
  'gitWorktree'?: (boolean);
  'arenaModeInfo'?: (_exa_cortex_pb_ArenaModeInfo__Output | null);
  '_startArena'?: "startArena";
  '_gitWorktree'?: "gitWorktree";
  '_arenaModeInfo'?: "arenaModeInfo";
}
