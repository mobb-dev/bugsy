// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { ContextSubrange as _exa_codeium_common_pb_ContextSubrange, ContextSubrange__Output as _exa_codeium_common_pb_ContextSubrange__Output } from '../../exa/codeium_common_pb/ContextSubrange';

export interface CciWithSubrange {
  'cci'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'subrange'?: (_exa_codeium_common_pb_ContextSubrange | null);
}

export interface CciWithSubrange__Output {
  'cci': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'subrange': (_exa_codeium_common_pb_ContextSubrange__Output | null);
}
