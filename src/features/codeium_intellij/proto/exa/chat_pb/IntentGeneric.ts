// Original file: exa/chat_pb/chat.proto

import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';

export interface IntentGeneric {
  'text'?: (string);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
}

export interface IntentGeneric__Output {
  'text': (string);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
}
