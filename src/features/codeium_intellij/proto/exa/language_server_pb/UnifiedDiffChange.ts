// Original file: exa/language_server_pb/language_server.proto

import type { UnifiedDiffChangeType as _exa_language_server_pb_UnifiedDiffChangeType, UnifiedDiffChangeType__Output as _exa_language_server_pb_UnifiedDiffChangeType__Output } from '../../exa/language_server_pb/UnifiedDiffChangeType';

export interface UnifiedDiffChange {
  'text'?: (string);
  'type'?: (_exa_language_server_pb_UnifiedDiffChangeType);
}

export interface UnifiedDiffChange__Output {
  'text': (string);
  'type': (_exa_language_server_pb_UnifiedDiffChangeType__Output);
}
