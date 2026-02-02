// Original file: exa/cortex_pb/cortex.proto

import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from '../../exa/codeium_common_pb/DocumentPosition';

export interface SupercompleteTabJumpInfo {
  'path'?: (string);
  'jumpPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'isImport'?: (boolean);
}

export interface SupercompleteTabJumpInfo__Output {
  'path': (string);
  'jumpPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'isImport': (boolean);
}
