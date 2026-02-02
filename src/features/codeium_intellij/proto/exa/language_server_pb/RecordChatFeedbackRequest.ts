// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ChatFeedbackType as _exa_chat_pb_ChatFeedbackType, ChatFeedbackType__Output as _exa_chat_pb_ChatFeedbackType__Output } from '../../exa/chat_pb/ChatFeedbackType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface RecordChatFeedbackRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'messageId'?: (string);
  'feedback'?: (_exa_chat_pb_ChatFeedbackType);
  'reason'?: (string);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface RecordChatFeedbackRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'messageId': (string);
  'feedback': (_exa_chat_pb_ChatFeedbackType__Output);
  'reason': (string);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
