// Original file: exa/cortex_pb/cortex.proto

import type { CustomToolSpec as _exa_cortex_pb_CustomToolSpec, CustomToolSpec__Output as _exa_cortex_pb_CustomToolSpec__Output } from '../../exa/cortex_pb/CustomToolSpec';

export interface CortexStepCreateRecipe {
  'recipe'?: (_exa_cortex_pb_CustomToolSpec | null);
  'referenceTrajectoryId'?: (string);
  'referenceStepIndices'?: (number)[];
}

export interface CortexStepCreateRecipe__Output {
  'recipe': (_exa_cortex_pb_CustomToolSpec__Output | null);
  'referenceTrajectoryId': (string);
  'referenceStepIndices': (number)[];
}
