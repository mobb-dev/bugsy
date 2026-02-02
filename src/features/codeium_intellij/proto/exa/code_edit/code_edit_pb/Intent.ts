// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { IntentType as _exa_code_edit_code_edit_pb_IntentType, IntentType__Output as _exa_code_edit_code_edit_pb_IntentType__Output } from '../../../exa/code_edit/code_edit_pb/IntentType';

export interface Intent {
  'intent'?: (string);
  'intentType'?: (_exa_code_edit_code_edit_pb_IntentType);
  'includeTestFiles'?: (boolean);
}

export interface Intent__Output {
  'intent': (string);
  'intentType': (_exa_code_edit_code_edit_pb_IntentType__Output);
  'includeTestFiles': (boolean);
}
