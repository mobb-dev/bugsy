// Original file: exa/cortex_pb/cortex.proto

import type { CodebaseCluster as _exa_codeium_common_pb_CodebaseCluster, CodebaseCluster__Output as _exa_codeium_common_pb_CodebaseCluster__Output } from '../../exa/codeium_common_pb/CodebaseCluster';

export interface CortexStepClusterQuery {
  'query'?: (string);
  'inputClusters'?: (_exa_codeium_common_pb_CodebaseCluster)[];
  'scores'?: (number | string)[];
  'repoName'?: (string);
  'outputClusters'?: (_exa_codeium_common_pb_CodebaseCluster)[];
}

export interface CortexStepClusterQuery__Output {
  'query': (string);
  'inputClusters': (_exa_codeium_common_pb_CodebaseCluster__Output)[];
  'scores': (number)[];
  'repoName': (string);
  'outputClusters': (_exa_codeium_common_pb_CodebaseCluster__Output)[];
}
