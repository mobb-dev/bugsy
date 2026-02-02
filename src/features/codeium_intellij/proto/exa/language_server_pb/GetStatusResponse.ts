// Original file: exa/language_server_pb/language_server.proto

import type { Status as _exa_codeium_common_pb_Status, Status__Output as _exa_codeium_common_pb_Status__Output } from '../../exa/codeium_common_pb/Status';

export interface GetStatusResponse {
  'status'?: (_exa_codeium_common_pb_Status | null);
  'showReviewPrompt'?: (boolean);
}

export interface GetStatusResponse__Output {
  'status': (_exa_codeium_common_pb_Status__Output | null);
  'showReviewPrompt': (boolean);
}
