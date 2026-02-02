// Original file: exa/cortex_pb/cortex.proto

import type { TextData as _exa_codeium_common_pb_TextData, TextData__Output as _exa_codeium_common_pb_TextData__Output } from '../../exa/codeium_common_pb/TextData';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';

export interface McpResourceContent {
  'uri'?: (string);
  'text'?: (_exa_codeium_common_pb_TextData | null);
  'image'?: (_exa_codeium_common_pb_ImageData | null);
  'data'?: "text"|"image";
}

export interface McpResourceContent__Output {
  'uri': (string);
  'text'?: (_exa_codeium_common_pb_TextData__Output | null);
  'image'?: (_exa_codeium_common_pb_ImageData__Output | null);
  'data'?: "text"|"image";
}
