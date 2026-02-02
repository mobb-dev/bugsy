// Original file: exa/index_pb/index.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { IndexingStatus as _exa_index_pb_IndexingStatus, IndexingStatus__Output as _exa_index_pb_IndexingStatus__Output } from '../../exa/index_pb/IndexingStatus';
import type { ProgressBar as _exa_index_pb_ProgressBar, ProgressBar__Output as _exa_index_pb_ProgressBar__Output } from '../../exa/index_pb/ProgressBar';
import type { VectorIndexStats as _exa_index_pb_VectorIndexStats, VectorIndexStats__Output as _exa_index_pb_VectorIndexStats__Output } from '../../exa/index_pb/VectorIndexStats';
import type { Long } from '@grpc/proto-loader';

export interface _exa_index_pb_Index_RepoStats {
  'size'?: (number | string | Long);
  'fileCount'?: (number | string | Long);
  'sizeNoIgnore'?: (number | string | Long);
  'fileCountNoIgnore'?: (number | string | Long);
}

export interface _exa_index_pb_Index_RepoStats__Output {
  'size': (string);
  'fileCount': (string);
  'sizeNoIgnore': (string);
  'fileCountNoIgnore': (string);
}

export interface Index {
  'id'?: (string);
  'repoName'?: (string);
  'workspace'?: (string);
  'repoInfo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'status'?: (_exa_index_pb_IndexingStatus);
  'statusDetail'?: (string);
  'autoIndexed'?: (boolean);
  'indexingProgress'?: ({[key: string]: _exa_index_pb_ProgressBar});
  'indexStats'?: (_exa_index_pb_VectorIndexStats | null);
  'hasSnippets'?: (boolean);
  'scheduledAt'?: (_google_protobuf_Timestamp | null);
  'repoStats'?: (_exa_index_pb_Index_RepoStats | null);
  'authUid'?: (string);
  'email'?: (string);
}

export interface Index__Output {
  'id': (string);
  'repoName': (string);
  'workspace': (string);
  'repoInfo': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'status': (_exa_index_pb_IndexingStatus__Output);
  'statusDetail': (string);
  'autoIndexed': (boolean);
  'indexingProgress': ({[key: string]: _exa_index_pb_ProgressBar__Output});
  'indexStats': (_exa_index_pb_VectorIndexStats__Output | null);
  'hasSnippets': (boolean);
  'scheduledAt': (_google_protobuf_Timestamp__Output | null);
  'repoStats': (_exa_index_pb_Index_RepoStats__Output | null);
  'authUid': (string);
  'email': (string);
}
