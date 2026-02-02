// Original file: exa/chat_pb/chat.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ChatMessage as _exa_chat_pb_ChatMessage, ChatMessage__Output as _exa_chat_pb_ChatMessage__Output } from '../../exa/chat_pb/ChatMessage';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { ContextInclusionType as _exa_codeium_common_pb_ContextInclusionType, ContextInclusionType__Output as _exa_codeium_common_pb_ContextInclusionType__Output } from '../../exa/codeium_common_pb/ContextInclusionType';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface _exa_chat_pb_GetChatMessageRequest_EnterpriseExternalModelConfig {
  'maxOutputTokens'?: (number);
  'maxInputTokens'?: (number);
}

export interface _exa_chat_pb_GetChatMessageRequest_EnterpriseExternalModelConfig__Output {
  'maxOutputTokens': (number);
  'maxInputTokens': (number);
}

export interface GetChatMessageRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'chatMessages'?: (_exa_chat_pb_ChatMessage)[];
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'activeDocument'?: (_exa_codeium_common_pb_Document | null);
  'openDocumentPathsMigrateMeToUris'?: (string)[];
  'workspacePathsMigrateMeToUris'?: (string)[];
  'contextInclusionType'?: (_exa_codeium_common_pb_ContextInclusionType);
  'chatModel'?: (_exa_codeium_common_pb_Model);
  'systemPromptOverride'?: (string);
  'activeSelection'?: (string);
  'openDocumentUris'?: (string)[];
  'workspaceUris'?: (string)[];
  'chatModelName'?: (string);
  'enterpriseChatModelConfig'?: (_exa_chat_pb_GetChatMessageRequest_EnterpriseExternalModelConfig | null);
}

export interface GetChatMessageRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'chatMessages': (_exa_chat_pb_ChatMessage__Output)[];
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'activeDocument': (_exa_codeium_common_pb_Document__Output | null);
  'openDocumentPathsMigrateMeToUris': (string)[];
  'workspacePathsMigrateMeToUris': (string)[];
  'contextInclusionType': (_exa_codeium_common_pb_ContextInclusionType__Output);
  'chatModel': (_exa_codeium_common_pb_Model__Output);
  'systemPromptOverride': (string);
  'activeSelection': (string);
  'openDocumentUris': (string)[];
  'workspaceUris': (string)[];
  'chatModelName': (string);
  'enterpriseChatModelConfig': (_exa_chat_pb_GetChatMessageRequest_EnterpriseExternalModelConfig__Output | null);
}
