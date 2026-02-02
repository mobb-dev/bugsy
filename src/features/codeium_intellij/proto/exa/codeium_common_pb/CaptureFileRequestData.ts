// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Long } from '@grpc/proto-loader';

export interface CaptureFileRequestData {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'promptId'?: (string);
  'filePath'?: (string);
  'originalFileContent'?: (string);
  'completionText'?: (string);
  'startOffset'?: (number | string | Long);
  'endOffset'?: (number | string | Long);
  'cursorLine'?: (number | string | Long);
  'cursorColumn'?: (number | string | Long);
}

export interface CaptureFileRequestData__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'promptId': (string);
  'filePath': (string);
  'originalFileContent': (string);
  'completionText': (string);
  'startOffset': (string);
  'endOffset': (string);
  'cursorLine': (string);
  'cursorColumn': (string);
}
