// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CompletionDelta as _exa_codeium_common_pb_CompletionDelta, CompletionDelta__Output as _exa_codeium_common_pb_CompletionDelta__Output } from '../../exa/codeium_common_pb/CompletionDelta';
import type { CompletionProfile as _exa_codeium_common_pb_CompletionProfile, CompletionProfile__Output as _exa_codeium_common_pb_CompletionProfile__Output } from '../../exa/codeium_common_pb/CompletionProfile';

export interface CompletionDeltaMap {
  'deltas'?: ({[key: number]: _exa_codeium_common_pb_CompletionDelta});
  'prompt'?: (string);
  'completionProfile'?: (_exa_codeium_common_pb_CompletionProfile | null);
}

export interface CompletionDeltaMap__Output {
  'deltas': ({[key: number]: _exa_codeium_common_pb_CompletionDelta__Output});
  'prompt': (string);
  'completionProfile': (_exa_codeium_common_pb_CompletionProfile__Output | null);
}
