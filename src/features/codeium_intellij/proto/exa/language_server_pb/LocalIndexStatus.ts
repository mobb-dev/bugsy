// Original file: exa/language_server_pb/language_server.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';
import type { IndexStats as _exa_index_pb_IndexStats, IndexStats__Output as _exa_index_pb_IndexStats__Output } from '../../exa/index_pb/IndexStats';
import type { ProgressBar as _exa_language_server_pb_ProgressBar, ProgressBar__Output as _exa_language_server_pb_ProgressBar__Output } from '../../exa/language_server_pb/ProgressBar';
import type { WorkspaceStats as _exa_codeium_common_pb_WorkspaceStats, WorkspaceStats__Output as _exa_codeium_common_pb_WorkspaceStats__Output } from '../../exa/codeium_common_pb/WorkspaceStats';
import type { PartialIndexMetadata as _exa_codeium_common_pb_PartialIndexMetadata, PartialIndexMetadata__Output as _exa_codeium_common_pb_PartialIndexMetadata__Output } from '../../exa/codeium_common_pb/PartialIndexMetadata';

export interface LocalIndexStatus {
  'workspaceFolder'?: (string);
  'gitRoot'?: (string);
  'repoName'?: (string);
  'remoteRepo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'indexStats'?: (_exa_index_pb_IndexStats | null);
  'indexProgress'?: ({[key: string]: _exa_language_server_pb_ProgressBar});
  'workspaceStats'?: (_exa_codeium_common_pb_WorkspaceStats | null);
  'partialIndexMetadata'?: (_exa_codeium_common_pb_PartialIndexMetadata | null);
}

export interface LocalIndexStatus__Output {
  'workspaceFolder': (string);
  'gitRoot': (string);
  'repoName': (string);
  'remoteRepo': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'indexStats': (_exa_index_pb_IndexStats__Output | null);
  'indexProgress': ({[key: string]: _exa_language_server_pb_ProgressBar__Output});
  'workspaceStats': (_exa_codeium_common_pb_WorkspaceStats__Output | null);
  'partialIndexMetadata': (_exa_codeium_common_pb_PartialIndexMetadata__Output | null);
}
