// Original file: exa/language_server_pb/language_server.proto


export interface _exa_language_server_pb_GenerateCodeMapResponse_Success {
  'codeMapJson'?: (string);
}

export interface _exa_language_server_pb_GenerateCodeMapResponse_Success__Output {
  'codeMapJson': (string);
}

export interface GenerateCodeMapResponse {
  'updatesJson'?: (string);
  'success'?: (_exa_language_server_pb_GenerateCodeMapResponse_Success | null);
  'status'?: (string);
  'result'?: "updatesJson"|"success"|"status";
}

export interface GenerateCodeMapResponse__Output {
  'updatesJson'?: (string);
  'success'?: (_exa_language_server_pb_GenerateCodeMapResponse_Success__Output | null);
  'status'?: (string);
  'result'?: "updatesJson"|"success"|"status";
}
