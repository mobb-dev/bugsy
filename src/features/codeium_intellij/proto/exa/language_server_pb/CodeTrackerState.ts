// Original file: exa/language_server_pb/language_server.proto

import type { CodeRange as _exa_language_server_pb_CodeRange, CodeRange__Output as _exa_language_server_pb_CodeRange__Output } from '../../exa/language_server_pb/CodeRange';

export interface CodeTrackerState {
  'absolutePathMigrateMeToUri'?: (string);
  'text'?: (string);
  'ranges'?: (_exa_language_server_pb_CodeRange)[];
  'commit'?: (string);
  'repoRootMigrateMeToUri'?: (string);
  'absoluteUri'?: (string);
  'repoRootUri'?: (string);
}

export interface CodeTrackerState__Output {
  'absolutePathMigrateMeToUri': (string);
  'text': (string);
  'ranges': (_exa_language_server_pb_CodeRange__Output)[];
  'commit': (string);
  'repoRootMigrateMeToUri': (string);
  'absoluteUri': (string);
  'repoRootUri': (string);
}
