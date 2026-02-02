// Original file: exa/language_server_pb/language_server.proto


export interface CommitMessageData {
  'repoRoot'?: (string);
  'commitMessageSummary'?: (string);
  'commitMessageDescription'?: (string);
  'changedFilesMigrateMeToUri'?: (string)[];
  'changedFileUris'?: (string)[];
}

export interface CommitMessageData__Output {
  'repoRoot': (string);
  'commitMessageSummary': (string);
  'commitMessageDescription': (string);
  'changedFilesMigrateMeToUri': (string)[];
  'changedFileUris': (string)[];
}
