// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface RecordCommitMessageSaveRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'repoRoot'?: (string);
  'branchName'?: (string);
  'commitHash'?: (string);
  'commitMessage'?: (string);
  'commitTimestamp'?: (_google_protobuf_Timestamp | null);
  'parentCommitHash'?: (string);
  'authorName'?: (string);
  'authorEmail'?: (string);
}

export interface RecordCommitMessageSaveRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'repoRoot': (string);
  'branchName': (string);
  'commitHash': (string);
  'commitMessage': (string);
  'commitTimestamp': (_google_protobuf_Timestamp__Output | null);
  'parentCommitHash': (string);
  'authorName': (string);
  'authorEmail': (string);
}
