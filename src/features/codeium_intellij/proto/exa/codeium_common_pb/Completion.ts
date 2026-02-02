// Original file: exa/codeium_common_pb/codeium_common.proto

import type { StopReason as _exa_codeium_common_pb_StopReason, StopReason__Output as _exa_codeium_common_pb_StopReason__Output } from '../../exa/codeium_common_pb/StopReason';
import type { FilterReason as _exa_codeium_common_pb_FilterReason, FilterReason__Output as _exa_codeium_common_pb_FilterReason__Output } from '../../exa/codeium_common_pb/FilterReason';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';
import type { Long } from '@grpc/proto-loader';

export interface Completion {
  'completionId'?: (string);
  'text'?: (string);
  'stop'?: (string);
  'score'?: (number | string);
  'tokens'?: (number | string | Long)[];
  'decodedTokens'?: (string)[];
  'probabilities'?: (number | string)[];
  'adjustedProbabilities'?: (number | string)[];
  'generatedLength'?: (number | string | Long);
  'stopReason'?: (_exa_codeium_common_pb_StopReason);
  'filterReasons'?: (_exa_codeium_common_pb_FilterReason)[];
  'originalText'?: (string);
  'toolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'logprobs'?: (number | string)[];
  'requestUid'?: (string);
}

export interface Completion__Output {
  'completionId': (string);
  'text': (string);
  'stop': (string);
  'score': (number);
  'tokens': (string)[];
  'decodedTokens': (string)[];
  'probabilities': (number)[];
  'adjustedProbabilities': (number)[];
  'generatedLength': (string);
  'stopReason': (_exa_codeium_common_pb_StopReason__Output);
  'filterReasons': (_exa_codeium_common_pb_FilterReason__Output)[];
  'originalText': (string);
  'toolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'logprobs': (number)[];
  'requestUid': (string);
}
