// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface CheckBugsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'diff'?: (string);
  'repoName'?: (string);
  'commitHash'?: (string);
  'authorName'?: (string);
  'model'?: (string);
  'commitMessage'?: (string);
  'linesChanged'?: (number);
  'userRules'?: (string)[];
  'method'?: (string);
  'symbolContext'?: (string);
  'checkType'?: (string);
  'baseRef'?: (string);
  'gitRoot'?: (string);
}

export interface CheckBugsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'diff': (string);
  'repoName': (string);
  'commitHash': (string);
  'authorName': (string);
  'model': (string);
  'commitMessage': (string);
  'linesChanged': (number);
  'userRules': (string)[];
  'method': (string);
  'symbolContext': (string);
  'checkType': (string);
  'baseRef': (string);
  'gitRoot': (string);
}
