// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../../exa/codeium_common_pb/CodeContextItem';
import type { RelevantCodeContext as _exa_code_edit_code_edit_pb_RelevantCodeContext, RelevantCodeContext__Output as _exa_code_edit_code_edit_pb_RelevantCodeContext__Output } from '../../../exa/code_edit/code_edit_pb/RelevantCodeContext';
import type { IntentRelevance as _exa_code_edit_code_edit_pb_IntentRelevance, IntentRelevance__Output as _exa_code_edit_code_edit_pb_IntentRelevance__Output } from '../../../exa/code_edit/code_edit_pb/IntentRelevance';

export interface CodeContextItemChange {
  'startCci'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'endCci'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'relevantCodeContexts'?: (_exa_code_edit_code_edit_pb_RelevantCodeContext)[];
  'descriptionByType'?: ({[key: string]: string});
  'intentRelevance'?: (_exa_code_edit_code_edit_pb_IntentRelevance)[];
}

export interface CodeContextItemChange__Output {
  'startCci': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'endCci': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'relevantCodeContexts': (_exa_code_edit_code_edit_pb_RelevantCodeContext__Output)[];
  'descriptionByType': ({[key: string]: string});
  'intentRelevance': (_exa_code_edit_code_edit_pb_IntentRelevance__Output)[];
}
