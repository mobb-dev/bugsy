// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { CompletionStatistics as _exa_codeium_common_pb_CompletionStatistics, CompletionStatistics__Output as _exa_codeium_common_pb_CompletionStatistics__Output } from '../../exa/codeium_common_pb/CompletionStatistics';

export interface CompletionByLanguageEntry {
  'language'?: (_exa_codeium_common_pb_Language);
  'completionStatistics'?: (_exa_codeium_common_pb_CompletionStatistics | null);
}

export interface CompletionByLanguageEntry__Output {
  'language': (_exa_codeium_common_pb_Language__Output);
  'completionStatistics': (_exa_codeium_common_pb_CompletionStatistics__Output | null);
}
