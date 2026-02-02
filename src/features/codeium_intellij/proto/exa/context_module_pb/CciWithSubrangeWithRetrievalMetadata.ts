// Original file: exa/context_module_pb/context_module.proto

import type { CciWithSubrange as _exa_codeium_common_pb_CciWithSubrange, CciWithSubrange__Output as _exa_codeium_common_pb_CciWithSubrange__Output } from '../../exa/codeium_common_pb/CciWithSubrange';
import type { RetrievedCodeContextItemMetadata as _exa_context_module_pb_RetrievedCodeContextItemMetadata, RetrievedCodeContextItemMetadata__Output as _exa_context_module_pb_RetrievedCodeContextItemMetadata__Output } from '../../exa/context_module_pb/RetrievedCodeContextItemMetadata';

export interface CciWithSubrangeWithRetrievalMetadata {
  'cciWithSubrange'?: (_exa_codeium_common_pb_CciWithSubrange | null);
  'metadata'?: (_exa_context_module_pb_RetrievedCodeContextItemMetadata | null);
}

export interface CciWithSubrangeWithRetrievalMetadata__Output {
  'cciWithSubrange': (_exa_codeium_common_pb_CciWithSubrange__Output | null);
  'metadata': (_exa_context_module_pb_RetrievedCodeContextItemMetadata__Output | null);
}
