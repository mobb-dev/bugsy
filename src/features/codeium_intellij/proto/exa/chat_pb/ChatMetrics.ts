// Original file: exa/chat_pb/chat.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { Long } from '@grpc/proto-loader';

export interface ChatMetrics {
  'responseStreamLatencyMs'?: (number | string | Long);
  'refreshContextLatencyMs'?: (number | string | Long);
  'shouldGetLocalContextForChatLatencyMs'?: (number | string | Long);
  'shouldGetLocalContextForChat'?: (boolean);
  'computeChangeEventsLatencyMs'?: (number | string | Long);
  'contextToChatPromptLatencyMs'?: (number | string | Long);
  'numPromptTokens'?: (number);
  'numSystemPromptTokens'?: (number);
  'startTimestamp'?: (_google_protobuf_Timestamp | null);
  'endTimestamp'?: (_google_protobuf_Timestamp | null);
  'activeDocumentAbsolutePath'?: (string);
  'lastActiveCodeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'numIndexedFiles'?: (number | string | Long);
  'numIndexedCodeContextItems'?: (number | string | Long);
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'numInputTokens'?: (number | string | Long);
  'modelUid'?: (string);
}

export interface ChatMetrics__Output {
  'responseStreamLatencyMs': (string);
  'refreshContextLatencyMs': (string);
  'shouldGetLocalContextForChatLatencyMs': (string);
  'shouldGetLocalContextForChat': (boolean);
  'computeChangeEventsLatencyMs': (string);
  'contextToChatPromptLatencyMs': (string);
  'numPromptTokens': (number);
  'numSystemPromptTokens': (number);
  'startTimestamp': (_google_protobuf_Timestamp__Output | null);
  'endTimestamp': (_google_protobuf_Timestamp__Output | null);
  'activeDocumentAbsolutePath': (string);
  'lastActiveCodeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'numIndexedFiles': (string);
  'numIndexedCodeContextItems': (string);
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'numInputTokens': (string);
  'modelUid': (string);
}
