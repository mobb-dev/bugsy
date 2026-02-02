// Original file: exa/language_server_pb/language_server.proto

import type { WorkspacePath as _exa_codeium_common_pb_WorkspacePath, WorkspacePath__Output as _exa_codeium_common_pb_WorkspacePath__Output } from '../../exa/codeium_common_pb/WorkspacePath';
import type { EmbeddingMetadata as _exa_codeium_common_pb_EmbeddingMetadata, EmbeddingMetadata__Output as _exa_codeium_common_pb_EmbeddingMetadata__Output } from '../../exa/codeium_common_pb/EmbeddingMetadata';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { Long } from '@grpc/proto-loader';

export interface SearchResult {
  'embeddingId'?: (number | string | Long);
  'absolutePathMigrateMeToUri'?: (string);
  'workspacePaths'?: (_exa_codeium_common_pb_WorkspacePath)[];
  'embeddingMetadata'?: (_exa_codeium_common_pb_EmbeddingMetadata | null);
  'similarityScore'?: (number | string);
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'absoluteUri'?: (string);
}

export interface SearchResult__Output {
  'embeddingId': (string);
  'absolutePathMigrateMeToUri': (string);
  'workspacePaths': (_exa_codeium_common_pb_WorkspacePath__Output)[];
  'embeddingMetadata': (_exa_codeium_common_pb_EmbeddingMetadata__Output | null);
  'similarityScore': (number);
  'codeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'absoluteUri': (string);
}
