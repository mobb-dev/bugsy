// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Event as _exa_codeium_common_pb_Event, Event__Output as _exa_codeium_common_pb_Event__Output } from '../../exa/codeium_common_pb/Event';

export interface RecordEventRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'event'?: (_exa_codeium_common_pb_Event | null);
}

export interface RecordEventRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'event': (_exa_codeium_common_pb_Event__Output | null);
}
