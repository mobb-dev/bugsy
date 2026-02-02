// Original file: exa/language_server_pb/language_server.proto


export interface _exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse_Success {
  'codeMapJson'?: (string);
  'newCascadeId'?: (string);
}

export interface _exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse_Success__Output {
  'codeMapJson': (string);
  'newCascadeId': (string);
}

export interface BranchCascadeAndGenerateCodeMapResponse {
  'updatesJson'?: (string);
  'success'?: (_exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse_Success | null);
  'status'?: (string);
  'result'?: "updatesJson"|"success"|"status";
}

export interface BranchCascadeAndGenerateCodeMapResponse__Output {
  'updatesJson'?: (string);
  'success'?: (_exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse_Success__Output | null);
  'status'?: (string);
  'result'?: "updatesJson"|"success"|"status";
}
