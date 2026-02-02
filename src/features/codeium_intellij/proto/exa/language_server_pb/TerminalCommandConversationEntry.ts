// Original file: exa/language_server_pb/language_server.proto


export interface TerminalCommandConversationEntry {
  'userPrompt'?: (string);
  'generatedCommand'?: (string);
  'explanation'?: (string);
  '_explanation'?: "explanation";
}

export interface TerminalCommandConversationEntry__Output {
  'userPrompt': (string);
  'generatedCommand': (string);
  'explanation'?: (string);
  '_explanation'?: "explanation";
}
