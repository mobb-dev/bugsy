// Original file: exa/language_server_pb/language_server.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface RecordLintsRequest {
  'currentLanguage'?: (_exa_codeium_common_pb_Language);
  'lints'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface RecordLintsRequest__Output {
  'currentLanguage': (_exa_codeium_common_pb_Language__Output);
  'lints': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
