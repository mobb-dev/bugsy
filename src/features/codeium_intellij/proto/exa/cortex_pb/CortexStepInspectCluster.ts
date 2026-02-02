// Original file: exa/cortex_pb/cortex.proto

import type { CodebaseCluster as _exa_codeium_common_pb_CodebaseCluster, CodebaseCluster__Output as _exa_codeium_common_pb_CodebaseCluster__Output } from '../../exa/codeium_common_pb/CodebaseCluster';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';

export interface CortexStepInspectCluster {
  'clusterId'?: (string);
  'query'?: (string);
  'matchedCluster'?: (_exa_codeium_common_pb_CodebaseCluster | null);
  'ccis'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
}

export interface CortexStepInspectCluster__Output {
  'clusterId': (string);
  'query': (string);
  'matchedCluster': (_exa_codeium_common_pb_CodebaseCluster__Output | null);
  'ccis': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
}
