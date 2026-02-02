// Original file: exa/cortex_pb/cortex.proto

import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';

// Original file: exa/cortex_pb/cortex.proto

export const _exa_cortex_pb_CortexStepViewFile_FileType = {
  FILE_TYPE_UNSPECIFIED: 'FILE_TYPE_UNSPECIFIED',
  FILE_TYPE_DIRECTORY: 'FILE_TYPE_DIRECTORY',
  FILE_TYPE_IMAGE: 'FILE_TYPE_IMAGE',
} as const;

export type _exa_cortex_pb_CortexStepViewFile_FileType =
  | 'FILE_TYPE_UNSPECIFIED'
  | 0
  | 'FILE_TYPE_DIRECTORY'
  | 1
  | 'FILE_TYPE_IMAGE'
  | 2

export type _exa_cortex_pb_CortexStepViewFile_FileType__Output = typeof _exa_cortex_pb_CortexStepViewFile_FileType[keyof typeof _exa_cortex_pb_CortexStepViewFile_FileType]

// Original file: exa/cortex_pb/cortex.proto

export const _exa_cortex_pb_CortexStepViewFile_TriggerSource = {
  TRIGGER_SOURCE_UNSPECIFIED: 'TRIGGER_SOURCE_UNSPECIFIED',
  TRIGGER_SOURCE_VIEWPORT: 'TRIGGER_SOURCE_VIEWPORT',
} as const;

export type _exa_cortex_pb_CortexStepViewFile_TriggerSource =
  | 'TRIGGER_SOURCE_UNSPECIFIED'
  | 0
  | 'TRIGGER_SOURCE_VIEWPORT'
  | 1

export type _exa_cortex_pb_CortexStepViewFile_TriggerSource__Output = typeof _exa_cortex_pb_CortexStepViewFile_TriggerSource[keyof typeof _exa_cortex_pb_CortexStepViewFile_TriggerSource]

export interface CortexStepViewFile {
  'absolutePathUri'?: (string);
  'startLine'?: (number);
  'endLine'?: (number);
  'content'?: (string);
  'maxTokens'?: (number);
  'async'?: (boolean);
  'includeSummaryOfOtherLines'?: (boolean);
  'hasLineNumbers'?: (boolean);
  'rawContent'?: (string);
  'triggeredMemories'?: (string);
  'offset'?: (number);
  'limit'?: (number);
  'isDir'?: (boolean);
  'hasReadWholeFile'?: (boolean);
  'fileType'?: (_exa_cortex_pb_CortexStepViewFile_FileType);
  'imageContent'?: (_exa_codeium_common_pb_ImageData | null);
  'triggerSource'?: (_exa_cortex_pb_CortexStepViewFile_TriggerSource);
}

export interface CortexStepViewFile__Output {
  'absolutePathUri': (string);
  'startLine': (number);
  'endLine': (number);
  'content': (string);
  'maxTokens': (number);
  'async': (boolean);
  'includeSummaryOfOtherLines': (boolean);
  'hasLineNumbers': (boolean);
  'rawContent': (string);
  'triggeredMemories': (string);
  'offset': (number);
  'limit': (number);
  'isDir': (boolean);
  'hasReadWholeFile': (boolean);
  'fileType': (_exa_cortex_pb_CortexStepViewFile_FileType__Output);
  'imageContent': (_exa_codeium_common_pb_ImageData__Output | null);
  'triggerSource': (_exa_cortex_pb_CortexStepViewFile_TriggerSource__Output);
}
