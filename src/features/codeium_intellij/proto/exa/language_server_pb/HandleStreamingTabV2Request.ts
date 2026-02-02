// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { EditorOptions as _exa_codeium_common_pb_EditorOptions, EditorOptions__Output as _exa_codeium_common_pb_EditorOptions__Output } from '../../exa/codeium_common_pb/EditorOptions';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { SupercompleteTriggerCondition as _exa_codeium_common_pb_SupercompleteTriggerCondition, SupercompleteTriggerCondition__Output as _exa_codeium_common_pb_SupercompleteTriggerCondition__Output } from '../../exa/codeium_common_pb/SupercompleteTriggerCondition';
import type { IntellisenseSuggestion as _exa_codeium_common_pb_IntellisenseSuggestion, IntellisenseSuggestion__Output as _exa_codeium_common_pb_IntellisenseSuggestion__Output } from '../../exa/codeium_common_pb/IntellisenseSuggestion';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';
import type { DeepWikiContext as _exa_chat_pb_DeepWikiContext, DeepWikiContext__Output as _exa_chat_pb_DeepWikiContext__Output } from '../../exa/chat_pb/DeepWikiContext';

export interface HandleStreamingTabV2Request {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'editorOptions'?: (_exa_codeium_common_pb_EditorOptions | null);
  'diagnostics'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'supercompleteTriggerCondition'?: (_exa_codeium_common_pb_SupercompleteTriggerCondition);
  'clipboardEntry'?: (string);
  'intellisenseSuggestions'?: (_exa_codeium_common_pb_IntellisenseSuggestion)[];
  'otherDocuments'?: (_exa_codeium_common_pb_Document)[];
  'predictiveTrajectorySteps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
  'deepWikiContextV2'?: (_exa_chat_pb_DeepWikiContext | null);
  'disableSupercomplete'?: (boolean);
  'disableTabJump'?: (boolean);
}

export interface HandleStreamingTabV2Request__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'editorOptions': (_exa_codeium_common_pb_EditorOptions__Output | null);
  'diagnostics': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'supercompleteTriggerCondition': (_exa_codeium_common_pb_SupercompleteTriggerCondition__Output);
  'clipboardEntry': (string);
  'intellisenseSuggestions': (_exa_codeium_common_pb_IntellisenseSuggestion__Output)[];
  'otherDocuments': (_exa_codeium_common_pb_Document__Output)[];
  'predictiveTrajectorySteps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
  'deepWikiContextV2': (_exa_chat_pb_DeepWikiContext__Output | null);
  'disableSupercomplete': (boolean);
  'disableTabJump': (boolean);
}
