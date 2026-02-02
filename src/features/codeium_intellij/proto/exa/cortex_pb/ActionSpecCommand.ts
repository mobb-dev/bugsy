// Original file: exa/cortex_pb/cortex.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { PathScopeItem as _exa_codeium_common_pb_PathScopeItem, PathScopeItem__Output as _exa_codeium_common_pb_PathScopeItem__Output } from '../../exa/codeium_common_pb/PathScopeItem';
import type { CciWithSubrange as _exa_codeium_common_pb_CciWithSubrange, CciWithSubrange__Output as _exa_codeium_common_pb_CciWithSubrange__Output } from '../../exa/codeium_common_pb/CciWithSubrange';
import type { LineRangeTarget as _exa_cortex_pb_LineRangeTarget, LineRangeTarget__Output as _exa_cortex_pb_LineRangeTarget__Output } from '../../exa/cortex_pb/LineRangeTarget';
import type { ReplacementChunk as _exa_cortex_pb_ReplacementChunk, ReplacementChunk__Output as _exa_cortex_pb_ReplacementChunk__Output } from '../../exa/cortex_pb/ReplacementChunk';
import type { CommandContentTarget as _exa_cortex_pb_CommandContentTarget, CommandContentTarget__Output as _exa_cortex_pb_CommandContentTarget__Output } from '../../exa/cortex_pb/CommandContentTarget';

export interface ActionSpecCommand {
  'instruction'?: (string);
  'isEdit'?: (boolean);
  'codeContext'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'file'?: (_exa_codeium_common_pb_PathScopeItem | null);
  'referenceCcis'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'cciWithSubrange'?: (_exa_codeium_common_pb_CciWithSubrange | null);
  'lineRange'?: (_exa_cortex_pb_LineRangeTarget | null);
  'useFastApply'?: (boolean);
  'replacementChunks'?: (_exa_cortex_pb_ReplacementChunk)[];
  'contentTarget'?: (_exa_cortex_pb_CommandContentTarget | null);
  'target'?: "codeContext"|"file"|"cciWithSubrange"|"lineRange"|"contentTarget";
}

export interface ActionSpecCommand__Output {
  'instruction': (string);
  'isEdit': (boolean);
  'codeContext'?: (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'file'?: (_exa_codeium_common_pb_PathScopeItem__Output | null);
  'referenceCcis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'cciWithSubrange'?: (_exa_codeium_common_pb_CciWithSubrange__Output | null);
  'lineRange'?: (_exa_cortex_pb_LineRangeTarget__Output | null);
  'useFastApply': (boolean);
  'replacementChunks': (_exa_cortex_pb_ReplacementChunk__Output)[];
  'contentTarget'?: (_exa_cortex_pb_CommandContentTarget__Output | null);
  'target'?: "codeContext"|"file"|"cciWithSubrange"|"lineRange"|"contentTarget";
}
