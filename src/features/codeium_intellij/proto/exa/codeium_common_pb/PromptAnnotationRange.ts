// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PromptAnnotationKind as _exa_codeium_common_pb_PromptAnnotationKind, PromptAnnotationKind__Output as _exa_codeium_common_pb_PromptAnnotationKind__Output } from '../../exa/codeium_common_pb/PromptAnnotationKind';
import type { Long } from '@grpc/proto-loader';

export interface PromptAnnotationRange {
  'kind'?: (_exa_codeium_common_pb_PromptAnnotationKind);
  'byteOffsetStart'?: (number | string | Long);
  'byteOffsetEnd'?: (number | string | Long);
  'suffix'?: (string);
}

export interface PromptAnnotationRange__Output {
  'kind': (_exa_codeium_common_pb_PromptAnnotationKind__Output);
  'byteOffsetStart': (string);
  'byteOffsetEnd': (string);
  'suffix': (string);
}
