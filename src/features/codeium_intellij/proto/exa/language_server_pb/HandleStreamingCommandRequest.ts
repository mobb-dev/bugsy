// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { EditorOptions as _exa_codeium_common_pb_EditorOptions, EditorOptions__Output as _exa_codeium_common_pb_EditorOptions__Output } from '../../exa/codeium_common_pb/EditorOptions';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { CommandRequestSource as _exa_codeium_common_pb_CommandRequestSource, CommandRequestSource__Output as _exa_codeium_common_pb_CommandRequestSource__Output } from '../../exa/codeium_common_pb/CommandRequestSource';
import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from '../../exa/codeium_common_pb/ContextScope';
import type { ActionPointer as _exa_codeium_common_pb_ActionPointer, ActionPointer__Output as _exa_codeium_common_pb_ActionPointer__Output } from '../../exa/codeium_common_pb/ActionPointer';
import type { DiffType as _exa_diff_action_pb_DiffType, DiffType__Output as _exa_diff_action_pb_DiffType__Output } from '../../exa/diff_action_pb/DiffType';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { SupercompleteTriggerCondition as _exa_codeium_common_pb_SupercompleteTriggerCondition, SupercompleteTriggerCondition__Output as _exa_codeium_common_pb_SupercompleteTriggerCondition__Output } from '../../exa/codeium_common_pb/SupercompleteTriggerCondition';
import type { TerminalCommandData as _exa_codeium_common_pb_TerminalCommandData, TerminalCommandData__Output as _exa_codeium_common_pb_TerminalCommandData__Output } from '../../exa/codeium_common_pb/TerminalCommandData';
import type { IntellisenseSuggestion as _exa_codeium_common_pb_IntellisenseSuggestion, IntellisenseSuggestion__Output as _exa_codeium_common_pb_IntellisenseSuggestion__Output } from '../../exa/codeium_common_pb/IntellisenseSuggestion';
import type { Long } from '@grpc/proto-loader';

export interface HandleStreamingCommandRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'editorOptions'?: (_exa_codeium_common_pb_EditorOptions | null);
  'requestedModelId'?: (_exa_codeium_common_pb_Model);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'selectionStartLine'?: (number | string | Long);
  'selectionEndLine'?: (number | string | Long);
  'commandText'?: (string);
  'requestSource'?: (_exa_codeium_common_pb_CommandRequestSource);
  'mentionedScope'?: (_exa_codeium_common_pb_ContextScope | null);
  'actionPointer'?: (_exa_codeium_common_pb_ActionPointer | null);
  'parentCompletionId'?: (string);
  'diffType'?: (_exa_diff_action_pb_DiffType);
  'diagnostics'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'supercompleteTriggerCondition'?: (_exa_codeium_common_pb_SupercompleteTriggerCondition);
  'terminalCommandData'?: (_exa_codeium_common_pb_TerminalCommandData | null);
  'ignoreSupercompleteDebounce'?: (boolean);
  'clipboardEntry'?: (string);
  'intellisenseSuggestions'?: (_exa_codeium_common_pb_IntellisenseSuggestion)[];
}

export interface HandleStreamingCommandRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'editorOptions': (_exa_codeium_common_pb_EditorOptions__Output | null);
  'requestedModelId': (_exa_codeium_common_pb_Model__Output);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'selectionStartLine': (string);
  'selectionEndLine': (string);
  'commandText': (string);
  'requestSource': (_exa_codeium_common_pb_CommandRequestSource__Output);
  'mentionedScope': (_exa_codeium_common_pb_ContextScope__Output | null);
  'actionPointer': (_exa_codeium_common_pb_ActionPointer__Output | null);
  'parentCompletionId': (string);
  'diffType': (_exa_diff_action_pb_DiffType__Output);
  'diagnostics': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'supercompleteTriggerCondition': (_exa_codeium_common_pb_SupercompleteTriggerCondition__Output);
  'terminalCommandData': (_exa_codeium_common_pb_TerminalCommandData__Output | null);
  'ignoreSupercompleteDebounce': (boolean);
  'clipboardEntry': (string);
  'intellisenseSuggestions': (_exa_codeium_common_pb_IntellisenseSuggestion__Output)[];
}
