// Original file: exa/cortex_pb/cortex.proto

import type { CodeChangeWithContext as _exa_code_edit_code_edit_pb_CodeChangeWithContext, CodeChangeWithContext__Output as _exa_code_edit_code_edit_pb_CodeChangeWithContext__Output } from '../../exa/code_edit/code_edit_pb/CodeChangeWithContext';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';

export interface CortexStepInformPlanner {
  'targetCodeChange'?: (_exa_code_edit_code_edit_pb_CodeChangeWithContext | null);
  'informCciList'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
}

export interface CortexStepInformPlanner__Output {
  'targetCodeChange': (_exa_code_edit_code_edit_pb_CodeChangeWithContext__Output | null);
  'informCciList': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
}
