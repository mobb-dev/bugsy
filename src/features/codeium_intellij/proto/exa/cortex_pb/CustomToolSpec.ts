// Original file: exa/cortex_pb/cortex.proto

import type { ChatToolDefinition as _exa_chat_pb_ChatToolDefinition, ChatToolDefinition__Output as _exa_chat_pb_ChatToolDefinition__Output } from '../../exa/chat_pb/ChatToolDefinition';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';
import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';

export interface CustomToolSpec {
  'recipeId'?: (string);
  'toolDefinition'?: (_exa_chat_pb_ChatToolDefinition | null);
  'systemPrompt'?: (string);
  'configOverride'?: (_exa_cortex_pb_CascadeConfig | null);
  'referenceTrajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'requiresWriteMode'?: (boolean);
  'isBuiltin'?: (boolean);
}

export interface CustomToolSpec__Output {
  'recipeId': (string);
  'toolDefinition': (_exa_chat_pb_ChatToolDefinition__Output | null);
  'systemPrompt': (string);
  'configOverride': (_exa_cortex_pb_CascadeConfig__Output | null);
  'referenceTrajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'requiresWriteMode': (boolean);
  'isBuiltin': (boolean);
}
