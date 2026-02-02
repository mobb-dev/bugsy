// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { KnowledgeBaseChunk as _exa_codeium_common_pb_KnowledgeBaseChunk, KnowledgeBaseChunk__Output as _exa_codeium_common_pb_KnowledgeBaseChunk__Output } from '../../exa/codeium_common_pb/KnowledgeBaseChunk';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';
import type { DOMTree as _exa_codeium_common_pb_DOMTree, DOMTree__Output as _exa_codeium_common_pb_DOMTree__Output } from '../../exa/codeium_common_pb/DOMTree';

export interface KnowledgeBaseItem {
  'documentId'?: (string);
  'text'?: (string);
  'url'?: (string);
  'title'?: (string);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'chunks'?: (_exa_codeium_common_pb_KnowledgeBaseChunk)[];
  'summary'?: (string);
  'image'?: (_exa_codeium_common_pb_ImageData | null);
  'domTree'?: (_exa_codeium_common_pb_DOMTree | null);
}

export interface KnowledgeBaseItem__Output {
  'documentId': (string);
  'text': (string);
  'url': (string);
  'title': (string);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'chunks': (_exa_codeium_common_pb_KnowledgeBaseChunk__Output)[];
  'summary': (string);
  'image': (_exa_codeium_common_pb_ImageData__Output | null);
  'domTree': (_exa_codeium_common_pb_DOMTree__Output | null);
}
