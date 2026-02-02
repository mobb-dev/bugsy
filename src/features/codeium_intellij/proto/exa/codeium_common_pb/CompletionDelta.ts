// Original file: exa/codeium_common_pb/codeium_common.proto

import type { StopReason as _exa_codeium_common_pb_StopReason, StopReason__Output as _exa_codeium_common_pb_StopReason__Output } from '../../exa/codeium_common_pb/StopReason';
import type { ModelUsageStats as _exa_codeium_common_pb_ModelUsageStats, ModelUsageStats__Output as _exa_codeium_common_pb_ModelUsageStats__Output } from '../../exa/codeium_common_pb/ModelUsageStats';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';

export interface CompletionDelta {
  'deltaText'?: (string);
  'deltaTokens'?: (number);
  'stopReason'?: (_exa_codeium_common_pb_StopReason);
  'usage'?: (_exa_codeium_common_pb_ModelUsageStats | null);
  'deltaToolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'deltaThinking'?: (string);
  'deltaSignature'?: (string);
  'thinkingRedacted'?: (boolean);
  'outputId'?: (string);
  'thinkingId'?: (string);
  'geminiThoughtSignature'?: (Buffer | Uint8Array | string);
  'deltaSignatureType'?: (string);
}

export interface CompletionDelta__Output {
  'deltaText': (string);
  'deltaTokens': (number);
  'stopReason': (_exa_codeium_common_pb_StopReason__Output);
  'usage': (_exa_codeium_common_pb_ModelUsageStats__Output | null);
  'deltaToolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'deltaThinking': (string);
  'deltaSignature': (string);
  'thinkingRedacted': (boolean);
  'outputId': (string);
  'thinkingId': (string);
  'geminiThoughtSignature': (Buffer);
  'deltaSignatureType': (string);
}
