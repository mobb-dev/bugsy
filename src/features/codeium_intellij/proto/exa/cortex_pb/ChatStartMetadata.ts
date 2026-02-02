// Original file: exa/cortex_pb/cortex.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CacheBreakpointMetadata as _exa_cortex_pb_CacheBreakpointMetadata, CacheBreakpointMetadata__Output as _exa_cortex_pb_CacheBreakpointMetadata__Output } from '../../exa/cortex_pb/CacheBreakpointMetadata';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';
import type { CacheRequestOptions as _exa_cortex_pb_CacheRequestOptions, CacheRequestOptions__Output as _exa_cortex_pb_CacheRequestOptions__Output } from '../../exa/cortex_pb/CacheRequestOptions';

export interface ChatStartMetadata {
  'startStepIndex'?: (number);
  'checkpointIndex'?: (number);
  'stepsCoveredByCheckpoint'?: (number)[];
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'latestStableMessageIndex'?: (number);
  'cacheBreakpoints'?: (_exa_cortex_pb_CacheBreakpointMetadata)[];
  'systemPromptCache'?: (_exa_cortex_pb_CacheBreakpointMetadata | null);
  'timeSinceLastInvocation'?: (_google_protobuf_Duration | null);
  'cacheRequest'?: (_exa_cortex_pb_CacheRequestOptions | null);
}

export interface ChatStartMetadata__Output {
  'startStepIndex': (number);
  'checkpointIndex': (number);
  'stepsCoveredByCheckpoint': (number)[];
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'latestStableMessageIndex': (number);
  'cacheBreakpoints': (_exa_cortex_pb_CacheBreakpointMetadata__Output)[];
  'systemPromptCache': (_exa_cortex_pb_CacheBreakpointMetadata__Output | null);
  'timeSinceLastInvocation': (_google_protobuf_Duration__Output | null);
  'cacheRequest': (_exa_cortex_pb_CacheRequestOptions__Output | null);
}
