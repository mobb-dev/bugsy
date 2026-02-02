// Original file: exa/cortex_pb/cortex.proto

import type { FileRangeContent as _exa_codeium_common_pb_FileRangeContent, FileRangeContent__Output as _exa_codeium_common_pb_FileRangeContent__Output } from '../../exa/codeium_common_pb/FileRangeContent';

export interface CortexStepSupercompleteActiveDoc {
  'instruction'?: (string);
  'selectionWithCursor'?: (_exa_codeium_common_pb_FileRangeContent | null);
}

export interface CortexStepSupercompleteActiveDoc__Output {
  'instruction': (string);
  'selectionWithCursor': (_exa_codeium_common_pb_FileRangeContent__Output | null);
}
