// Original file: exa/cortex_pb/cortex.proto

import type { CodebaseCluster as _exa_codeium_common_pb_CodebaseCluster, CodebaseCluster__Output as _exa_codeium_common_pb_CodebaseCluster__Output } from '../../exa/codeium_common_pb/CodebaseCluster';

export interface CortexStepListClusters {
  'clusters'?: (_exa_codeium_common_pb_CodebaseCluster)[];
  'repoName'?: (string);
}

export interface CortexStepListClusters__Output {
  'clusters': (_exa_codeium_common_pb_CodebaseCluster__Output)[];
  'repoName': (string);
}
