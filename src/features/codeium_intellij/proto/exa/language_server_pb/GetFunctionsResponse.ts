// Original file: exa/language_server_pb/language_server.proto

import type { FunctionInfo as _exa_codeium_common_pb_FunctionInfo, FunctionInfo__Output as _exa_codeium_common_pb_FunctionInfo__Output } from '../../exa/codeium_common_pb/FunctionInfo';

export interface GetFunctionsResponse {
  'functionCaptures'?: (_exa_codeium_common_pb_FunctionInfo)[];
}

export interface GetFunctionsResponse__Output {
  'functionCaptures': (_exa_codeium_common_pb_FunctionInfo__Output)[];
}
