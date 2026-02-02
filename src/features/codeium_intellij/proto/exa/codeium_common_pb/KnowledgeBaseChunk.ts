// Original file: exa/codeium_common_pb/codeium_common.proto

import type { MarkdownChunk as _exa_codeium_common_pb_MarkdownChunk, MarkdownChunk__Output as _exa_codeium_common_pb_MarkdownChunk__Output } from '../../exa/codeium_common_pb/MarkdownChunk';

export interface KnowledgeBaseChunk {
  'text'?: (string);
  'position'?: (number);
  'markdownChunk'?: (_exa_codeium_common_pb_MarkdownChunk | null);
  'chunkType'?: "text"|"markdownChunk";
}

export interface KnowledgeBaseChunk__Output {
  'text'?: (string);
  'position': (number);
  'markdownChunk'?: (_exa_codeium_common_pb_MarkdownChunk__Output | null);
  'chunkType'?: "text"|"markdownChunk";
}
