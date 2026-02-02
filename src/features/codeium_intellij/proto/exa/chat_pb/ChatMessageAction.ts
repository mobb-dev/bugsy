// Original file: exa/chat_pb/chat.proto

import type { ChatMessageActionGeneric as _exa_chat_pb_ChatMessageActionGeneric, ChatMessageActionGeneric__Output as _exa_chat_pb_ChatMessageActionGeneric__Output } from '../../exa/chat_pb/ChatMessageActionGeneric';
import type { ChatMessageActionEdit as _exa_chat_pb_ChatMessageActionEdit, ChatMessageActionEdit__Output as _exa_chat_pb_ChatMessageActionEdit__Output } from '../../exa/chat_pb/ChatMessageActionEdit';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { ChatMessageActionSearch as _exa_chat_pb_ChatMessageActionSearch, ChatMessageActionSearch__Output as _exa_chat_pb_ChatMessageActionSearch__Output } from '../../exa/chat_pb/ChatMessageActionSearch';
import type { ChatIntentType as _exa_chat_pb_ChatIntentType, ChatIntentType__Output as _exa_chat_pb_ChatIntentType__Output } from '../../exa/chat_pb/ChatIntentType';
import type { ChatMetrics as _exa_chat_pb_ChatMetrics, ChatMetrics__Output as _exa_chat_pb_ChatMetrics__Output } from '../../exa/chat_pb/ChatMetrics';
import type { KnowledgeBaseItemWithMetadata as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, KnowledgeBaseItemWithMetadata__Output as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItemWithMetadata';

export interface ChatMessageAction {
  'generic'?: (_exa_chat_pb_ChatMessageActionGeneric | null);
  'numTokens'?: (number);
  'edit'?: (_exa_chat_pb_ChatMessageActionEdit | null);
  'contextItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'search'?: (_exa_chat_pb_ChatMessageActionSearch | null);
  'latestIntent'?: (_exa_chat_pb_ChatIntentType);
  'generationStats'?: (_exa_chat_pb_ChatMetrics | null);
  'knowledgeBaseItems'?: (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata)[];
  'action'?: "generic"|"edit"|"search";
}

export interface ChatMessageAction__Output {
  'generic'?: (_exa_chat_pb_ChatMessageActionGeneric__Output | null);
  'numTokens': (number);
  'edit'?: (_exa_chat_pb_ChatMessageActionEdit__Output | null);
  'contextItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'search'?: (_exa_chat_pb_ChatMessageActionSearch__Output | null);
  'latestIntent': (_exa_chat_pb_ChatIntentType__Output);
  'generationStats': (_exa_chat_pb_ChatMetrics__Output | null);
  'knowledgeBaseItems': (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output)[];
  'action'?: "generic"|"edit"|"search";
}
