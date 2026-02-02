// Original file: exa/language_server_pb/language_server.proto

import type { ResolveWorktreeChangesMode as _exa_language_server_pb_ResolveWorktreeChangesMode, ResolveWorktreeChangesMode__Output as _exa_language_server_pb_ResolveWorktreeChangesMode__Output } from '../../exa/language_server_pb/ResolveWorktreeChangesMode';

export interface ResolveWorktreeChangesRequest {
  'cascadeId'?: (string);
  'uris'?: (string)[];
  'mode'?: (_exa_language_server_pb_ResolveWorktreeChangesMode);
  'failOnConflicts'?: (boolean);
}

export interface ResolveWorktreeChangesRequest__Output {
  'cascadeId': (string);
  'uris': (string)[];
  'mode': (_exa_language_server_pb_ResolveWorktreeChangesMode__Output);
  'failOnConflicts': (boolean);
}
