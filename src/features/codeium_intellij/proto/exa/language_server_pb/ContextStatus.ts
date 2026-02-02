// Original file: exa/language_server_pb/language_server.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from '../../exa/codeium_common_pb/ContextScope';
import type { Guideline as _exa_codeium_common_pb_Guideline, Guideline__Output as _exa_codeium_common_pb_Guideline__Output } from '../../exa/codeium_common_pb/Guideline';

export interface ContextStatus {
  'activeDocument'?: (_exa_codeium_common_pb_Document | null);
  'lastActiveCodeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'pinnedScope'?: (_exa_codeium_common_pb_ContextScope | null);
  'pinnedGuideline'?: (_exa_codeium_common_pb_Guideline | null);
  'defaultPinnedScope'?: (_exa_codeium_common_pb_ContextScope | null);
}

export interface ContextStatus__Output {
  'activeDocument': (_exa_codeium_common_pb_Document__Output | null);
  'lastActiveCodeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'pinnedScope': (_exa_codeium_common_pb_ContextScope__Output | null);
  'pinnedGuideline': (_exa_codeium_common_pb_Guideline__Output | null);
  'defaultPinnedScope': (_exa_codeium_common_pb_ContextScope__Output | null);
}
