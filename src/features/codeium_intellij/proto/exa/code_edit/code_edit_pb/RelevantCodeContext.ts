// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../../exa/codeium_common_pb/CodeContextItem';
import type { RelevanceReason as _exa_code_edit_code_edit_pb_RelevanceReason, RelevanceReason__Output as _exa_code_edit_code_edit_pb_RelevanceReason__Output } from '../../../exa/code_edit/code_edit_pb/RelevanceReason';

export interface RelevantCodeContext {
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'relevanceReason'?: (_exa_code_edit_code_edit_pb_RelevanceReason);
}

export interface RelevantCodeContext__Output {
  'codeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'relevanceReason': (_exa_code_edit_code_edit_pb_RelevanceReason__Output);
}
