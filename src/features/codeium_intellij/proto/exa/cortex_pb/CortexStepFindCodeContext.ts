// Original file: exa/cortex_pb/cortex.proto

import type { InstantContextStep as _exa_cortex_pb_InstantContextStep, InstantContextStep__Output as _exa_cortex_pb_InstantContextStep__Output } from '../../exa/cortex_pb/InstantContextStep';
import type { InstantContextResponse as _exa_cortex_pb_InstantContextResponse, InstantContextResponse__Output as _exa_cortex_pb_InstantContextResponse__Output } from '../../exa/cortex_pb/InstantContextResponse';

export interface CortexStepFindCodeContext {
  'searchTerm'?: (string);
  'steps'?: (_exa_cortex_pb_InstantContextStep)[];
  'response'?: (_exa_cortex_pb_InstantContextResponse | null);
  'workspaceDirectoryPath'?: (string);
  'error'?: (string);
}

export interface CortexStepFindCodeContext__Output {
  'searchTerm': (string);
  'steps': (_exa_cortex_pb_InstantContextStep__Output)[];
  'response': (_exa_cortex_pb_InstantContextResponse__Output | null);
  'workspaceDirectoryPath': (string);
  'error': (string);
}
