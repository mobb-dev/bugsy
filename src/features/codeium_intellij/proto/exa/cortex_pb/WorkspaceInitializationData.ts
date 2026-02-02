// Original file: exa/cortex_pb/cortex.proto

import type { CortexWorkspaceMetadata as _exa_cortex_pb_CortexWorkspaceMetadata, CortexWorkspaceMetadata__Output as _exa_cortex_pb_CortexWorkspaceMetadata__Output } from '../../exa/cortex_pb/CortexWorkspaceMetadata';
import type { WorkspaceStats as _exa_codeium_common_pb_WorkspaceStats, WorkspaceStats__Output as _exa_codeium_common_pb_WorkspaceStats__Output } from '../../exa/codeium_common_pb/WorkspaceStats';

export interface WorkspaceInitializationData {
  'metadata'?: (_exa_cortex_pb_CortexWorkspaceMetadata | null);
  'mergeBaseCommitHash'?: (string);
  'mergeBaseHeadPatchString'?: (string);
  'headWorkingPatchString'?: (string);
  'workspaceStats'?: (_exa_codeium_common_pb_WorkspaceStats | null);
  'repoIsPublic'?: (boolean);
  '_mergeBaseHeadPatchString'?: "mergeBaseHeadPatchString";
  '_headWorkingPatchString'?: "headWorkingPatchString";
}

export interface WorkspaceInitializationData__Output {
  'metadata': (_exa_cortex_pb_CortexWorkspaceMetadata__Output | null);
  'mergeBaseCommitHash': (string);
  'mergeBaseHeadPatchString'?: (string);
  'headWorkingPatchString'?: (string);
  'workspaceStats': (_exa_codeium_common_pb_WorkspaceStats__Output | null);
  'repoIsPublic': (boolean);
  '_mergeBaseHeadPatchString'?: "mergeBaseHeadPatchString";
  '_headWorkingPatchString'?: "headWorkingPatchString";
}
