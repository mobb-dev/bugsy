// Original file: exa/cortex_pb/cortex.proto

import type { TrajectorySearchIdType as _exa_cortex_pb_TrajectorySearchIdType, TrajectorySearchIdType__Output as _exa_cortex_pb_TrajectorySearchIdType__Output } from '../../exa/cortex_pb/TrajectorySearchIdType';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';
import type { TrajectoryDescription as _exa_cortex_pb_TrajectoryDescription, TrajectoryDescription__Output as _exa_cortex_pb_TrajectoryDescription__Output } from '../../exa/cortex_pb/TrajectoryDescription';

export interface CortexStepTrajectorySearch {
  'id'?: (string);
  'query'?: (string);
  'idType'?: (_exa_cortex_pb_TrajectorySearchIdType);
  'chunks'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
  'trajectoryDescription'?: (_exa_cortex_pb_TrajectoryDescription | null);
  'totalChunks'?: (number);
}

export interface CortexStepTrajectorySearch__Output {
  'id': (string);
  'query': (string);
  'idType': (_exa_cortex_pb_TrajectorySearchIdType__Output);
  'chunks': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
  'trajectoryDescription': (_exa_cortex_pb_TrajectoryDescription__Output | null);
  'totalChunks': (number);
}
