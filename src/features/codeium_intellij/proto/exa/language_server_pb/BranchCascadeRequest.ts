// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';

export interface BranchCascadeRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'baseCascadeId'?: (string);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
  'images'?: (_exa_codeium_common_pb_ImageData)[];
  'cascadeConfig'?: (_exa_cortex_pb_CascadeConfig | null);
  'recipeIds'?: (string)[];
  'blocking'?: (boolean);
  'additionalSteps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
  'branchFromStepIndex'?: (number);
  '_branchFromStepIndex'?: "branchFromStepIndex";
}

export interface BranchCascadeRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'baseCascadeId': (string);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
  'images': (_exa_codeium_common_pb_ImageData__Output)[];
  'cascadeConfig': (_exa_cortex_pb_CascadeConfig__Output | null);
  'recipeIds': (string)[];
  'blocking': (boolean);
  'additionalSteps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
  'branchFromStepIndex'?: (number);
  '_branchFromStepIndex'?: "branchFromStepIndex";
}
