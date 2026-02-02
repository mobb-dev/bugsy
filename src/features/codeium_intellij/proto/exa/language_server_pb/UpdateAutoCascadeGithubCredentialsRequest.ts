// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface UpdateAutoCascadeGithubCredentialsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'githubToken'?: (string);
}

export interface UpdateAutoCascadeGithubCredentialsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'githubToken': (string);
}
