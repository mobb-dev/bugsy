// Original file: exa/chat_pb/chat.proto

import type { ChatMessageSource as _exa_codeium_common_pb_ChatMessageSource, ChatMessageSource__Output as _exa_codeium_common_pb_ChatMessageSource__Output } from '../../exa/codeium_common_pb/ChatMessageSource';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';
import type { PromptCacheOptions as _exa_chat_pb_PromptCacheOptions, PromptCacheOptions__Output as _exa_chat_pb_PromptCacheOptions__Output } from '../../exa/chat_pb/PromptCacheOptions';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';
import type { PromptAnnotationRange as _exa_codeium_common_pb_PromptAnnotationRange, PromptAnnotationRange__Output as _exa_codeium_common_pb_PromptAnnotationRange__Output } from '../../exa/codeium_common_pb/PromptAnnotationRange';

export interface ChatMessagePrompt {
  'messageId'?: (string);
  'source'?: (_exa_codeium_common_pb_ChatMessageSource);
  'prompt'?: (string);
  'numTokens'?: (number);
  'safeForCodeTelemetry'?: (boolean);
  'toolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'toolCallId'?: (string);
  'promptCacheOptions'?: (_exa_chat_pb_PromptCacheOptions | null);
  'toolResultIsError'?: (boolean);
  'images'?: (_exa_codeium_common_pb_ImageData)[];
  'thinking'?: (string);
  'signature'?: (string);
  'thinkingRedacted'?: (boolean);
  'promptAnnotationRanges'?: (_exa_codeium_common_pb_PromptAnnotationRange)[];
  'outputId'?: (string);
  'thinkingId'?: (string);
  'geminiThoughtSignature'?: (Buffer | Uint8Array | string);
  'signatureType'?: (string);
}

export interface ChatMessagePrompt__Output {
  'messageId': (string);
  'source': (_exa_codeium_common_pb_ChatMessageSource__Output);
  'prompt': (string);
  'numTokens': (number);
  'safeForCodeTelemetry': (boolean);
  'toolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'toolCallId': (string);
  'promptCacheOptions': (_exa_chat_pb_PromptCacheOptions__Output | null);
  'toolResultIsError': (boolean);
  'images': (_exa_codeium_common_pb_ImageData__Output)[];
  'thinking': (string);
  'signature': (string);
  'thinkingRedacted': (boolean);
  'promptAnnotationRanges': (_exa_codeium_common_pb_PromptAnnotationRange__Output)[];
  'outputId': (string);
  'thinkingId': (string);
  'geminiThoughtSignature': (Buffer);
  'signatureType': (string);
}
