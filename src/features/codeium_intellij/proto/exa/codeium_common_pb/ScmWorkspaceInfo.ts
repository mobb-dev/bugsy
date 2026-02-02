// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PerforceDepotInfo as _exa_codeium_common_pb_PerforceDepotInfo, PerforceDepotInfo__Output as _exa_codeium_common_pb_PerforceDepotInfo__Output } from '../../exa/codeium_common_pb/PerforceDepotInfo';
import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface ScmWorkspaceInfo {
  'perforceInfo'?: (_exa_codeium_common_pb_PerforceDepotInfo | null);
  'gitInfo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'info'?: "perforceInfo"|"gitInfo";
}

export interface ScmWorkspaceInfo__Output {
  'perforceInfo'?: (_exa_codeium_common_pb_PerforceDepotInfo__Output | null);
  'gitInfo'?: (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'info'?: "perforceInfo"|"gitInfo";
}
