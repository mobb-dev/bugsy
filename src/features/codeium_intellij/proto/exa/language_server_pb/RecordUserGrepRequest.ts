// Original file: exa/language_server_pb/language_server.proto

import type { GrepSearchResult as _exa_cortex_pb_GrepSearchResult, GrepSearchResult__Output as _exa_cortex_pb_GrepSearchResult__Output } from '../../exa/cortex_pb/GrepSearchResult';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface RecordUserGrepRequest {
  'query'?: (string);
  'results'?: (_exa_cortex_pb_GrepSearchResult)[];
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface RecordUserGrepRequest__Output {
  'query': (string);
  'results': (_exa_cortex_pb_GrepSearchResult__Output)[];
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
