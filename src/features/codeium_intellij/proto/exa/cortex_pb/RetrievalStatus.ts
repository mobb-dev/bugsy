// Original file: exa/cortex_pb/cortex.proto

import type { CciWithSubrange as _exa_codeium_common_pb_CciWithSubrange, CciWithSubrange__Output as _exa_codeium_common_pb_CciWithSubrange__Output } from '../../exa/codeium_common_pb/CciWithSubrange';

export interface RetrievalStatus {
  'totalRetrievedCount'?: (number);
  'topRetrievedItems'?: (_exa_codeium_common_pb_CciWithSubrange)[];
}

export interface RetrievalStatus__Output {
  'totalRetrievedCount': (number);
  'topRetrievedItems': (_exa_codeium_common_pb_CciWithSubrange__Output)[];
}
