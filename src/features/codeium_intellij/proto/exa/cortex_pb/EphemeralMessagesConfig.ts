// Original file: exa/cortex_pb/cortex.proto

import type { HeuristicPrompt as _exa_cortex_pb_HeuristicPrompt, HeuristicPrompt__Output as _exa_cortex_pb_HeuristicPrompt__Output } from '../../exa/cortex_pb/HeuristicPrompt';

export interface EphemeralMessagesConfig {
  'enabled'?: (boolean);
  'numSteps'?: (number);
  'heuristicPrompts'?: (_exa_cortex_pb_HeuristicPrompt)[];
  '_enabled'?: "enabled";
}

export interface EphemeralMessagesConfig__Output {
  'enabled'?: (boolean);
  'numSteps': (number);
  'heuristicPrompts': (_exa_cortex_pb_HeuristicPrompt__Output)[];
  '_enabled'?: "enabled";
}
