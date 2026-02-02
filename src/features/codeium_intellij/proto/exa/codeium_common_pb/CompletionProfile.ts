// Original file: exa/codeium_common_pb/codeium_common.proto

import type { SingleModelCompletionProfile as _exa_codeium_common_pb_SingleModelCompletionProfile, SingleModelCompletionProfile__Output as _exa_codeium_common_pb_SingleModelCompletionProfile__Output } from '../../exa/codeium_common_pb/SingleModelCompletionProfile';
import type { ModelUsageStats as _exa_codeium_common_pb_ModelUsageStats, ModelUsageStats__Output as _exa_codeium_common_pb_ModelUsageStats__Output } from '../../exa/codeium_common_pb/ModelUsageStats';

export interface CompletionProfile {
  'modelProfile'?: (_exa_codeium_common_pb_SingleModelCompletionProfile | null);
  'draftModelProfile'?: (_exa_codeium_common_pb_SingleModelCompletionProfile | null);
  'timeToFirstPrefillPass'?: (number | string);
  'timeToFirstToken'?: (number | string);
  'totalCompletionTime'?: (number | string);
  'modelUsage'?: (_exa_codeium_common_pb_ModelUsageStats | null);
  '_draftModelProfile'?: "draftModelProfile";
  '_modelUsage'?: "modelUsage";
}

export interface CompletionProfile__Output {
  'modelProfile': (_exa_codeium_common_pb_SingleModelCompletionProfile__Output | null);
  'draftModelProfile'?: (_exa_codeium_common_pb_SingleModelCompletionProfile__Output | null);
  'timeToFirstPrefillPass': (number);
  'timeToFirstToken': (number);
  'totalCompletionTime': (number);
  'modelUsage'?: (_exa_codeium_common_pb_ModelUsageStats__Output | null);
  '_draftModelProfile'?: "draftModelProfile";
  '_modelUsage'?: "modelUsage";
}
