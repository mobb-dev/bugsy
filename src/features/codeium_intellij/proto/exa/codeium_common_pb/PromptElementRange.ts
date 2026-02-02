// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PromptElementKind as _exa_codeium_common_pb_PromptElementKind, PromptElementKind__Output as _exa_codeium_common_pb_PromptElementKind__Output } from '../../exa/codeium_common_pb/PromptElementKind';
import type { Long } from '@grpc/proto-loader';

export interface PromptElementRange {
  'kind'?: (_exa_codeium_common_pb_PromptElementKind);
  'byteOffsetStart'?: (number | string | Long);
  'byteOffsetEnd'?: (number | string | Long);
  'tokenOffsetStart'?: (number | string | Long);
  'tokenOffsetEnd'?: (number | string | Long);
}

export interface PromptElementRange__Output {
  'kind': (_exa_codeium_common_pb_PromptElementKind__Output);
  'byteOffsetStart': (string);
  'byteOffsetEnd': (string);
  'tokenOffsetStart': (string);
  'tokenOffsetEnd': (string);
}
