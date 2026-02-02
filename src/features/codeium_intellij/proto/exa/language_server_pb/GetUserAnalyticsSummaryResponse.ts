// Original file: exa/language_server_pb/language_server.proto

import type { CompletionStatistics as _exa_codeium_common_pb_CompletionStatistics, CompletionStatistics__Output as _exa_codeium_common_pb_CompletionStatistics__Output } from '../../exa/codeium_common_pb/CompletionStatistics';
import type { CompletionByDateEntry as _exa_codeium_common_pb_CompletionByDateEntry, CompletionByDateEntry__Output as _exa_codeium_common_pb_CompletionByDateEntry__Output } from '../../exa/codeium_common_pb/CompletionByDateEntry';
import type { CompletionByLanguageEntry as _exa_codeium_common_pb_CompletionByLanguageEntry, CompletionByLanguageEntry__Output as _exa_codeium_common_pb_CompletionByLanguageEntry__Output } from '../../exa/codeium_common_pb/CompletionByLanguageEntry';
import type { ChatStatsByModelEntry as _exa_codeium_common_pb_ChatStatsByModelEntry, ChatStatsByModelEntry__Output as _exa_codeium_common_pb_ChatStatsByModelEntry__Output } from '../../exa/codeium_common_pb/ChatStatsByModelEntry';

export interface GetUserAnalyticsSummaryResponse {
  'completionStatistics'?: (_exa_codeium_common_pb_CompletionStatistics | null);
  'completionsByDay'?: (_exa_codeium_common_pb_CompletionByDateEntry)[];
  'completionsByLanguage'?: (_exa_codeium_common_pb_CompletionByLanguageEntry)[];
  'chatsByModel'?: (_exa_codeium_common_pb_ChatStatsByModelEntry)[];
}

export interface GetUserAnalyticsSummaryResponse__Output {
  'completionStatistics': (_exa_codeium_common_pb_CompletionStatistics__Output | null);
  'completionsByDay': (_exa_codeium_common_pb_CompletionByDateEntry__Output)[];
  'completionsByLanguage': (_exa_codeium_common_pb_CompletionByLanguageEntry__Output)[];
  'chatsByModel': (_exa_codeium_common_pb_ChatStatsByModelEntry__Output)[];
}
