// Original file: exa/cortex_pb/cortex.proto

import type { CciWithSubrange as _exa_codeium_common_pb_CciWithSubrange, CciWithSubrange__Output as _exa_codeium_common_pb_CciWithSubrange__Output } from '../../exa/codeium_common_pb/CciWithSubrange';
import type { ResearchDebugInfo as _exa_cortex_pb_ResearchDebugInfo, ResearchDebugInfo__Output as _exa_cortex_pb_ResearchDebugInfo__Output } from '../../exa/cortex_pb/ResearchDebugInfo';

export interface CortexResearchState {
  'totalRetrievedCount'?: (number);
  'topRetrievedItems'?: (_exa_codeium_common_pb_CciWithSubrange)[];
  'debugInfo'?: (_exa_cortex_pb_ResearchDebugInfo | null);
  'fullCciList'?: (_exa_codeium_common_pb_CciWithSubrange)[];
}

export interface CortexResearchState__Output {
  'totalRetrievedCount': (number);
  'topRetrievedItems': (_exa_codeium_common_pb_CciWithSubrange__Output)[];
  'debugInfo': (_exa_cortex_pb_ResearchDebugInfo__Output | null);
  'fullCciList': (_exa_codeium_common_pb_CciWithSubrange__Output)[];
}
