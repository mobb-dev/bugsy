// Original file: exa/language_server_pb/language_server.proto


export interface ValidationState {
  'uri'?: (string);
  'lastAcknowledgedState'?: (string);
  'currentState'?: (string);
  'lastStateFileNonexistent'?: (boolean);
  'currentStateFileNonexistent'?: (boolean);
  'isNotebook'?: (boolean);
  'cellIndex'?: (number);
}

export interface ValidationState__Output {
  'uri': (string);
  'lastAcknowledgedState': (string);
  'currentState': (string);
  'lastStateFileNonexistent': (boolean);
  'currentStateFileNonexistent': (boolean);
  'isNotebook': (boolean);
  'cellIndex': (number);
}
