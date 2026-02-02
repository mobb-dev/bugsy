// Original file: exa/language_server_pb/language_server.proto

import type { LocalIndexStatus as _exa_language_server_pb_LocalIndexStatus, LocalIndexStatus__Output as _exa_language_server_pb_LocalIndexStatus__Output } from '../../exa/language_server_pb/LocalIndexStatus';

export interface IndexStatus {
  'localIndexes'?: (_exa_language_server_pb_LocalIndexStatus)[];
  'ignoredLocalWorkspaces'?: (string)[];
  'localFilesIndexCapacity'?: (number);
}

export interface IndexStatus__Output {
  'localIndexes': (_exa_language_server_pb_LocalIndexStatus__Output)[];
  'ignoredLocalWorkspaces': (string)[];
  'localFilesIndexCapacity': (number);
}
