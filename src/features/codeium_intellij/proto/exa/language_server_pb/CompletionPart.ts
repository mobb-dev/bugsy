// Original file: exa/language_server_pb/language_server.proto

import type { CompletionPartType as _exa_language_server_pb_CompletionPartType, CompletionPartType__Output as _exa_language_server_pb_CompletionPartType__Output } from '../../exa/language_server_pb/CompletionPartType';
import type { Long } from '@grpc/proto-loader';

export interface CompletionPart {
  'text'?: (string);
  'offset'?: (number | string | Long);
  'type'?: (_exa_language_server_pb_CompletionPartType);
  'prefix'?: (string);
  'line'?: (number | string | Long);
}

export interface CompletionPart__Output {
  'text': (string);
  'offset': (string);
  'type': (_exa_language_server_pb_CompletionPartType__Output);
  'prefix': (string);
  'line': (string);
}
