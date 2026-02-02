// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface SubmitBugReportRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'description'?: (string);
  'bugType'?: (string);
  'diagnosticsJson'?: (string);
  'screenshot'?: (Buffer | Uint8Array | string);
  'tabInfo'?: (string);
  'other'?: (string);
}

export interface SubmitBugReportRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'description': (string);
  'bugType': (string);
  'diagnosticsJson': (string);
  'screenshot': (Buffer);
  'tabInfo': (string);
  'other': (string);
}
