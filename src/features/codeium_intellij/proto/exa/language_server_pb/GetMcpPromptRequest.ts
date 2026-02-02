// Original file: exa/language_server_pb/language_server.proto


export interface GetMcpPromptRequest {
  'serverName'?: (string);
  'promptName'?: (string);
  'arguments'?: ({[key: string]: string});
}

export interface GetMcpPromptRequest__Output {
  'serverName': (string);
  'promptName': (string);
  'arguments': ({[key: string]: string});
}
