// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PinnedContext as _exa_codeium_common_pb_PinnedContext, PinnedContext__Output as _exa_codeium_common_pb_PinnedContext__Output } from '../../exa/codeium_common_pb/PinnedContext';

export interface PinnedContextConfig {
  'matchRepoName'?: (string);
  'matchPath'?: (string);
  'pinnedContexts'?: (_exa_codeium_common_pb_PinnedContext)[];
}

export interface PinnedContextConfig__Output {
  'matchRepoName': (string);
  'matchPath': (string);
  'pinnedContexts': (_exa_codeium_common_pb_PinnedContext__Output)[];
}
