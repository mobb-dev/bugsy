// Original file: exa/codeium_common_pb/codeium_common.proto

import type { StreamingCompletionInfo as _exa_codeium_common_pb_StreamingCompletionInfo, StreamingCompletionInfo__Output as _exa_codeium_common_pb_StreamingCompletionInfo__Output } from '../../exa/codeium_common_pb/StreamingCompletionInfo';
import type { StreamingCompletionMap as _exa_codeium_common_pb_StreamingCompletionMap, StreamingCompletionMap__Output as _exa_codeium_common_pb_StreamingCompletionMap__Output } from '../../exa/codeium_common_pb/StreamingCompletionMap';
import type { PackedStreamingCompletionMaps as _exa_codeium_common_pb_PackedStreamingCompletionMaps, PackedStreamingCompletionMaps__Output as _exa_codeium_common_pb_PackedStreamingCompletionMaps__Output } from '../../exa/codeium_common_pb/PackedStreamingCompletionMaps';
import type { CompletionProfile as _exa_codeium_common_pb_CompletionProfile, CompletionProfile__Output as _exa_codeium_common_pb_CompletionProfile__Output } from '../../exa/codeium_common_pb/CompletionProfile';

export interface StreamingCompletionResponse {
  'completionInfo'?: (_exa_codeium_common_pb_StreamingCompletionInfo | null);
  'completionMap'?: (_exa_codeium_common_pb_StreamingCompletionMap | null);
  'packedCompletionMaps'?: (_exa_codeium_common_pb_PackedStreamingCompletionMaps | null);
  'completionProfile'?: (_exa_codeium_common_pb_CompletionProfile | null);
  'payload'?: "completionInfo"|"completionMap"|"packedCompletionMaps";
  '_completionProfile'?: "completionProfile";
}

export interface StreamingCompletionResponse__Output {
  'completionInfo'?: (_exa_codeium_common_pb_StreamingCompletionInfo__Output | null);
  'completionMap'?: (_exa_codeium_common_pb_StreamingCompletionMap__Output | null);
  'packedCompletionMaps'?: (_exa_codeium_common_pb_PackedStreamingCompletionMaps__Output | null);
  'completionProfile'?: (_exa_codeium_common_pb_CompletionProfile__Output | null);
  'payload'?: "completionInfo"|"completionMap"|"packedCompletionMaps";
  '_completionProfile'?: "completionProfile";
}
