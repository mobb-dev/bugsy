// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface ChatNodeConfig {
  'model'?: (_exa_codeium_common_pb_Model);
  'maxInputTokens'?: (number);
  'temperature'?: (number | string);
  'maxOutputTokens'?: (number);
  'orderSnippetsByFile'?: (boolean);
}

export interface ChatNodeConfig__Output {
  'model': (_exa_codeium_common_pb_Model__Output);
  'maxInputTokens': (number);
  'temperature': (number);
  'maxOutputTokens': (number);
  'orderSnippetsByFile': (boolean);
}
