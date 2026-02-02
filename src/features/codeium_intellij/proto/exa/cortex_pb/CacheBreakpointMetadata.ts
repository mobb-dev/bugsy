// Original file: exa/cortex_pb/cortex.proto

import type { PromptCacheOptions as _exa_chat_pb_PromptCacheOptions, PromptCacheOptions__Output as _exa_chat_pb_PromptCacheOptions__Output } from '../../exa/chat_pb/PromptCacheOptions';

export interface CacheBreakpointMetadata {
  'index'?: (number);
  'options'?: (_exa_chat_pb_PromptCacheOptions | null);
  'contentChecksum'?: (string);
}

export interface CacheBreakpointMetadata__Output {
  'index': (number);
  'options': (_exa_chat_pb_PromptCacheOptions__Output | null);
  'contentChecksum': (string);
}
