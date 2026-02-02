// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CascadeCommandsAutoExecution as _exa_codeium_common_pb_CascadeCommandsAutoExecution, CascadeCommandsAutoExecution__Output as _exa_codeium_common_pb_CascadeCommandsAutoExecution__Output } from '../../exa/codeium_common_pb/CascadeCommandsAutoExecution';

export interface RecipeScopeItem {
  'recipeId'?: (string);
  'title'?: (string);
  'description'?: (string);
  'systemPrompt'?: (string);
  'uri'?: (string);
  'executionMode'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution);
  '_uri'?: "uri";
  '_executionMode'?: "executionMode";
}

export interface RecipeScopeItem__Output {
  'recipeId': (string);
  'title': (string);
  'description': (string);
  'systemPrompt': (string);
  'uri'?: (string);
  'executionMode'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution__Output);
  '_uri'?: "uri";
  '_executionMode'?: "executionMode";
}
