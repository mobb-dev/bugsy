// Original file: exa/context_module_pb/context_module.proto

import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { LocalNodeState as _exa_context_module_pb_LocalNodeState, LocalNodeState__Output as _exa_context_module_pb_LocalNodeState__Output } from '../../exa/context_module_pb/LocalNodeState';
import type { Guideline as _exa_codeium_common_pb_Guideline, Guideline__Output as _exa_codeium_common_pb_Guideline__Output } from '../../exa/codeium_common_pb/Guideline';
import type { DocumentOutline as _exa_codeium_common_pb_DocumentOutline, DocumentOutline__Output as _exa_codeium_common_pb_DocumentOutline__Output } from '../../exa/codeium_common_pb/DocumentOutline';

export interface ContextModuleResult {
  'retrievedCciWithSubranges'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
  'activeDocument'?: (_exa_codeium_common_pb_Document | null);
  'localNodeState'?: (_exa_context_module_pb_LocalNodeState | null);
  'guideline'?: (_exa_codeium_common_pb_Guideline | null);
  'activeDocumentOutline'?: (_exa_codeium_common_pb_DocumentOutline | null);
  'openDocuments'?: (_exa_codeium_common_pb_Document)[];
}

export interface ContextModuleResult__Output {
  'retrievedCciWithSubranges': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
  'activeDocument': (_exa_codeium_common_pb_Document__Output | null);
  'localNodeState': (_exa_context_module_pb_LocalNodeState__Output | null);
  'guideline': (_exa_codeium_common_pb_Guideline__Output | null);
  'activeDocumentOutline': (_exa_codeium_common_pb_DocumentOutline__Output | null);
  'openDocuments': (_exa_codeium_common_pb_Document__Output)[];
}
