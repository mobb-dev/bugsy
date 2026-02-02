// Original file: exa/chat_pb/chat.proto

import type { ParameterInfo as _exa_chat_pb_ParameterInfo, ParameterInfo__Output as _exa_chat_pb_ParameterInfo__Output } from '../../exa/chat_pb/ParameterInfo';

export interface FunctionCallInfo {
  'signatureLabel'?: (string);
  'activeParameter'?: (number);
  'parameterCount'?: (number);
  'parameters'?: (_exa_chat_pb_ParameterInfo)[];
}

export interface FunctionCallInfo__Output {
  'signatureLabel': (string);
  'activeParameter': (number);
  'parameterCount': (number);
  'parameters': (_exa_chat_pb_ParameterInfo__Output)[];
}
