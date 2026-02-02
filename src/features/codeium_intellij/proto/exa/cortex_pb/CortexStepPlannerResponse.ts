// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItemWithMetadata as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, KnowledgeBaseItemWithMetadata__Output as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItemWithMetadata';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';

export interface CortexStepPlannerResponse {
  'response'?: (string);
  'knowledgeBaseItems'?: (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata)[];
  'thinking'?: (string);
  'signature'?: (string);
  'thinkingRedacted'?: (boolean);
  'messageId'?: (string);
  'toolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'modifiedResponse'?: (string);
  'outputId'?: (string);
  'thinkingId'?: (string);
  'geminiThoughtSignature'?: (Buffer | Uint8Array | string);
  'signatureType'?: (string);
}

export interface CortexStepPlannerResponse__Output {
  'response': (string);
  'knowledgeBaseItems': (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output)[];
  'thinking': (string);
  'signature': (string);
  'thinkingRedacted': (boolean);
  'messageId': (string);
  'toolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'modifiedResponse': (string);
  'outputId': (string);
  'thinkingId': (string);
  'geminiThoughtSignature': (Buffer);
  'signatureType': (string);
}
