// Original file: exa/language_server_pb/language_server.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { EditSource as _exa_language_server_pb_EditSource, EditSource__Output as _exa_language_server_pb_EditSource__Output } from '../../exa/language_server_pb/EditSource';

export interface OnEditRequest {
  'initialDocument'?: (_exa_codeium_common_pb_Document | null);
  'finalDocument'?: (_exa_codeium_common_pb_Document | null);
  'source'?: (_exa_language_server_pb_EditSource);
}

export interface OnEditRequest__Output {
  'initialDocument': (_exa_codeium_common_pb_Document__Output | null);
  'finalDocument': (_exa_codeium_common_pb_Document__Output | null);
  'source': (_exa_language_server_pb_EditSource__Output);
}
