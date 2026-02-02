// Original file: exa/cortex_pb/cortex.proto

import type { ChatMessagePrompt as _exa_chat_pb_ChatMessagePrompt, ChatMessagePrompt__Output as _exa_chat_pb_ChatMessagePrompt__Output } from '../../exa/chat_pb/ChatMessagePrompt';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ModelUsageStats as _exa_codeium_common_pb_ModelUsageStats, ModelUsageStats__Output as _exa_codeium_common_pb_ModelUsageStats__Output } from '../../exa/codeium_common_pb/ModelUsageStats';
import type { ChatToolChoice as _exa_chat_pb_ChatToolChoice, ChatToolChoice__Output as _exa_chat_pb_ChatToolChoice__Output } from '../../exa/chat_pb/ChatToolChoice';
import type { ChatToolDefinition as _exa_chat_pb_ChatToolDefinition, ChatToolDefinition__Output as _exa_chat_pb_ChatToolDefinition__Output } from '../../exa/chat_pb/ChatToolDefinition';
import type { ChatStartMetadata as _exa_cortex_pb_ChatStartMetadata, ChatStartMetadata__Output as _exa_cortex_pb_ChatStartMetadata__Output } from '../../exa/cortex_pb/ChatStartMetadata';
import type { MessagePromptMetadata as _exa_cortex_pb_MessagePromptMetadata, MessagePromptMetadata__Output as _exa_cortex_pb_MessagePromptMetadata__Output } from '../../exa/cortex_pb/MessagePromptMetadata';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface ChatModelMetadata {
  'systemPrompt'?: (string);
  'messagePrompts'?: (_exa_chat_pb_ChatMessagePrompt)[];
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'usage'?: (_exa_codeium_common_pb_ModelUsageStats | null);
  'modelCost'?: (number | string);
  'lastCacheIndex'?: (number);
  'toolChoice'?: (_exa_chat_pb_ChatToolChoice | null);
  'tools'?: (_exa_chat_pb_ChatToolDefinition)[];
  'chatStartMetadata'?: (_exa_cortex_pb_ChatStartMetadata | null);
  'messageMetadata'?: (_exa_cortex_pb_MessagePromptMetadata)[];
  'timeToFirstToken'?: (_google_protobuf_Duration | null);
  'streamingDuration'?: (_google_protobuf_Duration | null);
  'creditCost'?: (number);
  'retries'?: (number);
  'modelUid'?: (string);
  'acuCost'?: (number | string);
}

export interface ChatModelMetadata__Output {
  'systemPrompt': (string);
  'messagePrompts': (_exa_chat_pb_ChatMessagePrompt__Output)[];
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'usage': (_exa_codeium_common_pb_ModelUsageStats__Output | null);
  'modelCost': (number);
  'lastCacheIndex': (number);
  'toolChoice': (_exa_chat_pb_ChatToolChoice__Output | null);
  'tools': (_exa_chat_pb_ChatToolDefinition__Output)[];
  'chatStartMetadata': (_exa_cortex_pb_ChatStartMetadata__Output | null);
  'messageMetadata': (_exa_cortex_pb_MessagePromptMetadata__Output)[];
  'timeToFirstToken': (_google_protobuf_Duration__Output | null);
  'streamingDuration': (_google_protobuf_Duration__Output | null);
  'creditCost': (number);
  'retries': (number);
  'modelUid': (string);
  'acuCost': (number);
}
