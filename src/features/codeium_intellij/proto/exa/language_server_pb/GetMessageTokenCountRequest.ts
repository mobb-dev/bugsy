// Original file: exa/language_server_pb/language_server.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface GetMessageTokenCountRequest {
  'chatMessage'?: (string);
  'requestedModelId'?: (_exa_codeium_common_pb_Model);
}

export interface GetMessageTokenCountRequest__Output {
  'chatMessage': (string);
  'requestedModelId': (_exa_codeium_common_pb_Model__Output);
}
