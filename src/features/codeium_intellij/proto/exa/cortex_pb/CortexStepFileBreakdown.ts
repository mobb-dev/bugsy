// Original file: exa/cortex_pb/cortex.proto

import type { DocumentOutline as _exa_codeium_common_pb_DocumentOutline, DocumentOutline__Output as _exa_codeium_common_pb_DocumentOutline__Output } from '../../exa/codeium_common_pb/DocumentOutline';

export interface CortexStepFileBreakdown {
  'absolutePath'?: (string);
  'documentOutline'?: (_exa_codeium_common_pb_DocumentOutline | null);
}

export interface CortexStepFileBreakdown__Output {
  'absolutePath': (string);
  'documentOutline': (_exa_codeium_common_pb_DocumentOutline__Output | null);
}
