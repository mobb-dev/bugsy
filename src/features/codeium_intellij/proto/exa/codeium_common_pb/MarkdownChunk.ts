// Original file: exa/codeium_common_pb/codeium_common.proto

import type { MarkdownNodeType as _exa_codeium_common_pb_MarkdownNodeType, MarkdownNodeType__Output as _exa_codeium_common_pb_MarkdownNodeType__Output } from '../../exa/codeium_common_pb/MarkdownNodeType';

export interface _exa_codeium_common_pb_MarkdownChunk_MarkdownHeader {
  'type'?: (_exa_codeium_common_pb_MarkdownNodeType);
  'text'?: (string);
}

export interface _exa_codeium_common_pb_MarkdownChunk_MarkdownHeader__Output {
  'type': (_exa_codeium_common_pb_MarkdownNodeType__Output);
  'text': (string);
}

export interface MarkdownChunk {
  'headers'?: (_exa_codeium_common_pb_MarkdownChunk_MarkdownHeader)[];
  'text'?: (string);
}

export interface MarkdownChunk__Output {
  'headers': (_exa_codeium_common_pb_MarkdownChunk_MarkdownHeader__Output)[];
  'text': (string);
}
