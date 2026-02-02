// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface MemoryConfig {
  'memoryModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'enabled'?: (boolean);
  'numMemoriesToConsider'?: (number);
  'maxGlobalCascadeMemories'?: (number);
  'numCheckpointsForContext'?: (number);
  'condenseInputTrajectory'?: (boolean);
  'addUserMemoriesToSystemPrompt'?: (boolean);
  'memoryModelUid'?: (string);
  '_condenseInputTrajectory'?: "condenseInputTrajectory";
  '_addUserMemoriesToSystemPrompt'?: "addUserMemoriesToSystemPrompt";
  '_enabled'?: "enabled";
}

export interface MemoryConfig__Output {
  'memoryModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'enabled'?: (boolean);
  'numMemoriesToConsider': (number);
  'maxGlobalCascadeMemories': (number);
  'numCheckpointsForContext': (number);
  'condenseInputTrajectory'?: (boolean);
  'addUserMemoriesToSystemPrompt'?: (boolean);
  'memoryModelUid': (string);
  '_condenseInputTrajectory'?: "condenseInputTrajectory";
  '_addUserMemoriesToSystemPrompt'?: "addUserMemoriesToSystemPrompt";
  '_enabled'?: "enabled";
}
