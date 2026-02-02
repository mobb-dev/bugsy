// Original file: exa/language_server_pb/language_server.proto

import type { CodeChangeWithContext as _exa_code_edit_code_edit_pb_CodeChangeWithContext, CodeChangeWithContext__Output as _exa_code_edit_code_edit_pb_CodeChangeWithContext__Output } from '../../exa/code_edit/code_edit_pb/CodeChangeWithContext';

export interface GetPatchAndCodeChangeResponse {
  'patchString'?: (string);
  'codeChangeWithContext'?: (_exa_code_edit_code_edit_pb_CodeChangeWithContext | null);
}

export interface GetPatchAndCodeChangeResponse__Output {
  'patchString': (string);
  'codeChangeWithContext': (_exa_code_edit_code_edit_pb_CodeChangeWithContext__Output | null);
}
