// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { EditorOptions as _exa_codeium_common_pb_EditorOptions, EditorOptions__Output as _exa_codeium_common_pb_EditorOptions__Output } from '../../exa/codeium_common_pb/EditorOptions';
import type { TabRequestSource as _exa_language_server_pb_TabRequestSource, TabRequestSource__Output as _exa_language_server_pb_TabRequestSource__Output } from '../../exa/language_server_pb/TabRequestSource';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { SupercompleteTriggerCondition as _exa_codeium_common_pb_SupercompleteTriggerCondition, SupercompleteTriggerCondition__Output as _exa_codeium_common_pb_SupercompleteTriggerCondition__Output } from '../../exa/codeium_common_pb/SupercompleteTriggerCondition';
import type { IntellisenseSuggestion as _exa_codeium_common_pb_IntellisenseSuggestion, IntellisenseSuggestion__Output as _exa_codeium_common_pb_IntellisenseSuggestion__Output } from '../../exa/codeium_common_pb/IntellisenseSuggestion';

export interface HandleStreamingTabRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'editorOptions'?: (_exa_codeium_common_pb_EditorOptions | null);
  'requestSource'?: (_exa_language_server_pb_TabRequestSource);
  'diagnostics'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'supercompleteTriggerCondition'?: (_exa_codeium_common_pb_SupercompleteTriggerCondition);
  'clipboardEntry'?: (string);
  'intellisenseSuggestions'?: (_exa_codeium_common_pb_IntellisenseSuggestion)[];
  'otherDocuments'?: (_exa_codeium_common_pb_Document)[];
}

export interface HandleStreamingTabRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'editorOptions': (_exa_codeium_common_pb_EditorOptions__Output | null);
  'requestSource': (_exa_language_server_pb_TabRequestSource__Output);
  'diagnostics': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'supercompleteTriggerCondition': (_exa_codeium_common_pb_SupercompleteTriggerCondition__Output);
  'clipboardEntry': (string);
  'intellisenseSuggestions': (_exa_codeium_common_pb_IntellisenseSuggestion__Output)[];
  'otherDocuments': (_exa_codeium_common_pb_Document__Output)[];
}
