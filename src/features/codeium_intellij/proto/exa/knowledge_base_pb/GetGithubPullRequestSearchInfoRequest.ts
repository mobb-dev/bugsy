// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface GetGithubPullRequestSearchInfoRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'query'?: (string);
  'limit'?: (number);
}

export interface GetGithubPullRequestSearchInfoRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'query': (string);
  'limit': (number);
}
