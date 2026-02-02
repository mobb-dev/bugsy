// Original file: exa/language_server_pb/language_server.proto


export interface SendActionToChatPanelRequest {
  'actionType'?: (string);
  'payload'?: (Buffer | Uint8Array | string)[];
}

export interface SendActionToChatPanelRequest__Output {
  'actionType': (string);
  'payload': (Buffer)[];
}
