// Original file: exa/cortex_pb/cortex.proto

import type { PathScopeItem as _exa_codeium_common_pb_PathScopeItem, PathScopeItem__Output as _exa_codeium_common_pb_PathScopeItem__Output } from '../../exa/codeium_common_pb/PathScopeItem';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface ActionSpecCreateFile {
  'instruction'?: (string);
  'path'?: (_exa_codeium_common_pb_PathScopeItem | null);
  'referenceCcis'?: (_exa_codeium_common_pb_CodeContextItem)[];
}

export interface ActionSpecCreateFile__Output {
  'instruction': (string);
  'path': (_exa_codeium_common_pb_PathScopeItem__Output | null);
  'referenceCcis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
}
