// Original file: exa/language_server_pb/language_server.proto

import type { ContextStatus as _exa_language_server_pb_ContextStatus, ContextStatus__Output as _exa_language_server_pb_ContextStatus__Output } from '../../exa/language_server_pb/ContextStatus';
import type { IndexStatus as _exa_language_server_pb_IndexStatus, IndexStatus__Output as _exa_language_server_pb_IndexStatus__Output } from '../../exa/language_server_pb/IndexStatus';

export interface BrainStatus {
  'contextStatus'?: (_exa_language_server_pb_ContextStatus | null);
  'indexStatus'?: (_exa_language_server_pb_IndexStatus | null);
}

export interface BrainStatus__Output {
  'contextStatus': (_exa_language_server_pb_ContextStatus__Output | null);
  'indexStatus': (_exa_language_server_pb_IndexStatus__Output | null);
}
