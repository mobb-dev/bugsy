// Original file: exa/codeium_common_pb/codeium_common.proto

import type { WorkspacePath as _exa_codeium_common_pb_WorkspacePath, WorkspacePath__Output as _exa_codeium_common_pb_WorkspacePath__Output } from '../../exa/codeium_common_pb/WorkspacePath';
import type { EmbeddingMetadata as _exa_codeium_common_pb_EmbeddingMetadata, EmbeddingMetadata__Output as _exa_codeium_common_pb_EmbeddingMetadata__Output } from '../../exa/codeium_common_pb/EmbeddingMetadata';
import type { SearchResultType as _exa_codeium_common_pb_SearchResultType, SearchResultType__Output as _exa_codeium_common_pb_SearchResultType__Output } from '../../exa/codeium_common_pb/SearchResultType';
import type { Long } from '@grpc/proto-loader';

export interface SearchResultRecord {
  'searchId'?: (string);
  'resultId'?: (string);
  'absolutePath'?: (string);
  'workspacePaths'?: (_exa_codeium_common_pb_WorkspacePath)[];
  'text'?: (string);
  'embeddingMetadata'?: (_exa_codeium_common_pb_EmbeddingMetadata | null);
  'similarityScore'?: (number | string);
  'numResultsInCluster'?: (number | string | Long);
  'representativePath'?: (string);
  'meanSimilarityScore'?: (number | string);
  'searchResultType'?: (_exa_codeium_common_pb_SearchResultType);
}

export interface SearchResultRecord__Output {
  'searchId': (string);
  'resultId': (string);
  'absolutePath': (string);
  'workspacePaths': (_exa_codeium_common_pb_WorkspacePath__Output)[];
  'text': (string);
  'embeddingMetadata': (_exa_codeium_common_pb_EmbeddingMetadata__Output | null);
  'similarityScore': (number);
  'numResultsInCluster': (string);
  'representativePath': (string);
  'meanSimilarityScore': (number);
  'searchResultType': (_exa_codeium_common_pb_SearchResultType__Output);
}
