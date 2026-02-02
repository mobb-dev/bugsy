// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CompletionExample as _exa_codeium_common_pb_CompletionExample, CompletionExample__Output as _exa_codeium_common_pb_CompletionExample__Output } from '../../exa/codeium_common_pb/CompletionExample';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CompletionExampleWithMetadata {
  'example'?: (_exa_codeium_common_pb_CompletionExample | null);
  'name'?: (string);
  'time'?: (_google_protobuf_Timestamp | null);
}

export interface CompletionExampleWithMetadata__Output {
  'example': (_exa_codeium_common_pb_CompletionExample__Output | null);
  'name': (string);
  'time': (_google_protobuf_Timestamp__Output | null);
}
