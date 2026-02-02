// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';
import type { SemanticCodebaseSearchType as _exa_cortex_pb_SemanticCodebaseSearchType, SemanticCodebaseSearchType__Output as _exa_cortex_pb_SemanticCodebaseSearchType__Output } from '../../exa/cortex_pb/SemanticCodebaseSearchType';

export interface CortexStepMquery {
  'input'?: (_exa_cortex_pb_PlanInput | null);
  'ccis'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
  'numTokensProcessed'?: (number);
  'numItemsScored'?: (number);
  'searchType'?: (_exa_cortex_pb_SemanticCodebaseSearchType);
}

export interface CortexStepMquery__Output {
  'input': (_exa_cortex_pb_PlanInput__Output | null);
  'ccis': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
  'numTokensProcessed': (number);
  'numItemsScored': (number);
  'searchType': (_exa_cortex_pb_SemanticCodebaseSearchType__Output);
}
