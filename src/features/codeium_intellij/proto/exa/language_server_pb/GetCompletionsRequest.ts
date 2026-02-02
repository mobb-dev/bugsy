// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { EditorOptions as _exa_codeium_common_pb_EditorOptions, EditorOptions__Output as _exa_codeium_common_pb_EditorOptions__Output } from '../../exa/codeium_common_pb/EditorOptions';
import type { MockResponseData as _exa_codeium_common_pb_MockResponseData, MockResponseData__Output as _exa_codeium_common_pb_MockResponseData__Output } from '../../exa/codeium_common_pb/MockResponseData';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { MultilineConfig as _exa_language_server_pb_MultilineConfig, MultilineConfig__Output as _exa_language_server_pb_MultilineConfig__Output } from '../../exa/language_server_pb/MultilineConfig';

export interface GetCompletionsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'editorOptions'?: (_exa_codeium_common_pb_EditorOptions | null);
  'otherDocuments'?: (_exa_codeium_common_pb_Document)[];
  'mockResponseData'?: (_exa_codeium_common_pb_MockResponseData | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'disableCache'?: (boolean);
  'oracleItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'modelName'?: (string);
  'requestedModelId'?: (_exa_codeium_common_pb_Model);
  'multilineConfig'?: (_exa_language_server_pb_MultilineConfig | null);
}

export interface GetCompletionsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'editorOptions': (_exa_codeium_common_pb_EditorOptions__Output | null);
  'otherDocuments': (_exa_codeium_common_pb_Document__Output)[];
  'mockResponseData': (_exa_codeium_common_pb_MockResponseData__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'disableCache': (boolean);
  'oracleItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'modelName': (string);
  'requestedModelId': (_exa_codeium_common_pb_Model__Output);
  'multilineConfig': (_exa_language_server_pb_MultilineConfig__Output | null);
}
