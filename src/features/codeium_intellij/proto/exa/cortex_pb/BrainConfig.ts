// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { BrainFilterStrategy as _exa_cortex_pb_BrainFilterStrategy, BrainFilterStrategy__Output as _exa_cortex_pb_BrainFilterStrategy__Output } from '../../exa/cortex_pb/BrainFilterStrategy';
import type { BrainUpdateStrategy as _exa_cortex_pb_BrainUpdateStrategy, BrainUpdateStrategy__Output as _exa_cortex_pb_BrainUpdateStrategy__Output } from '../../exa/cortex_pb/BrainUpdateStrategy';

export interface BrainConfig {
  'enabled'?: (boolean);
  'brainModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'forceNoExplanation'?: (boolean);
  'filterStrategy'?: (_exa_cortex_pb_BrainFilterStrategy);
  'updateStrategy'?: (_exa_cortex_pb_BrainUpdateStrategy | null);
  'useReplaceContentForUpdates'?: (boolean);
  'condenseTrajectoryMessages'?: (boolean);
  'recentUpdateToolThreshold'?: (number);
  'staleUpdateToolThreshold'?: (number);
  'additionalEphemeralPrompt'?: (string);
  'useRulesInSubagent'?: (boolean);
  'useMainModelAsBrainModel'?: (boolean);
  'brainModelUid'?: (string);
  '_enabled'?: "enabled";
  '_useMainModelAsBrainModel'?: "useMainModelAsBrainModel";
  '_forceNoExplanation'?: "forceNoExplanation";
  '_useReplaceContentForUpdates'?: "useReplaceContentForUpdates";
  '_condenseTrajectoryMessages'?: "condenseTrajectoryMessages";
  '_recentUpdateToolThreshold'?: "recentUpdateToolThreshold";
  '_staleUpdateToolThreshold'?: "staleUpdateToolThreshold";
  '_useRulesInSubagent'?: "useRulesInSubagent";
}

export interface BrainConfig__Output {
  'enabled'?: (boolean);
  'brainModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'forceNoExplanation'?: (boolean);
  'filterStrategy': (_exa_cortex_pb_BrainFilterStrategy__Output);
  'updateStrategy': (_exa_cortex_pb_BrainUpdateStrategy__Output | null);
  'useReplaceContentForUpdates'?: (boolean);
  'condenseTrajectoryMessages'?: (boolean);
  'recentUpdateToolThreshold'?: (number);
  'staleUpdateToolThreshold'?: (number);
  'additionalEphemeralPrompt': (string);
  'useRulesInSubagent'?: (boolean);
  'useMainModelAsBrainModel'?: (boolean);
  'brainModelUid': (string);
  '_enabled'?: "enabled";
  '_useMainModelAsBrainModel'?: "useMainModelAsBrainModel";
  '_forceNoExplanation'?: "forceNoExplanation";
  '_useReplaceContentForUpdates'?: "useReplaceContentForUpdates";
  '_condenseTrajectoryMessages'?: "condenseTrajectoryMessages";
  '_recentUpdateToolThreshold'?: "recentUpdateToolThreshold";
  '_staleUpdateToolThreshold'?: "staleUpdateToolThreshold";
  '_useRulesInSubagent'?: "useRulesInSubagent";
}
