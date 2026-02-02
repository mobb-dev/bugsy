// Original file: exa/language_server_pb/language_server.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { IdeAction as _exa_language_server_pb_IdeAction, IdeAction__Output as _exa_language_server_pb_IdeAction__Output } from '../../exa/language_server_pb/IdeAction';

export interface RefreshContextForIdeActionRequest {
  'activeDocument'?: (_exa_codeium_common_pb_Document | null);
  'openDocumentFilepathsMigrateMeToUri'?: (string)[];
  'workspacePathsMigrateMeToUri'?: (string)[];
  'blocking'?: (boolean);
  'otherDocuments'?: (_exa_codeium_common_pb_Document)[];
  'openDocumentUris'?: (string)[];
  'workspaceUris'?: (string)[];
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'ideAction'?: (_exa_language_server_pb_IdeAction);
}

export interface RefreshContextForIdeActionRequest__Output {
  'activeDocument': (_exa_codeium_common_pb_Document__Output | null);
  'openDocumentFilepathsMigrateMeToUri': (string)[];
  'workspacePathsMigrateMeToUri': (string)[];
  'blocking': (boolean);
  'otherDocuments': (_exa_codeium_common_pb_Document__Output)[];
  'openDocumentUris': (string)[];
  'workspaceUris': (string)[];
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'ideAction': (_exa_language_server_pb_IdeAction__Output);
}
