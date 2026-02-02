// Original file: exa/language_server_pb/language_server.proto

import type { Completion as _exa_codeium_common_pb_Completion, Completion__Output as _exa_codeium_common_pb_Completion__Output } from '../../exa/codeium_common_pb/Completion';
import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';
import type { CompletionSource as _exa_codeium_common_pb_CompletionSource, CompletionSource__Output as _exa_codeium_common_pb_CompletionSource__Output } from '../../exa/codeium_common_pb/CompletionSource';
import type { Suffix as _exa_language_server_pb_Suffix, Suffix__Output as _exa_language_server_pb_Suffix__Output } from '../../exa/language_server_pb/Suffix';
import type { CompletionPart as _exa_language_server_pb_CompletionPart, CompletionPart__Output as _exa_language_server_pb_CompletionPart__Output } from '../../exa/language_server_pb/CompletionPart';

export interface CompletionItem {
  'completion'?: (_exa_codeium_common_pb_Completion | null);
  'range'?: (_exa_codeium_common_pb_Range | null);
  'source'?: (_exa_codeium_common_pb_CompletionSource);
  'suffix'?: (_exa_language_server_pb_Suffix | null);
  'completionParts'?: (_exa_language_server_pb_CompletionPart)[];
}

export interface CompletionItem__Output {
  'completion': (_exa_codeium_common_pb_Completion__Output | null);
  'range': (_exa_codeium_common_pb_Range__Output | null);
  'source': (_exa_codeium_common_pb_CompletionSource__Output);
  'suffix': (_exa_language_server_pb_Suffix__Output | null);
  'completionParts': (_exa_language_server_pb_CompletionPart__Output)[];
}
