// Original file: exa/cortex_pb/cortex.proto

import type { WindsurfSetting as _exa_cortex_pb_WindsurfSetting, WindsurfSetting__Output as _exa_cortex_pb_WindsurfSetting__Output } from '../../exa/cortex_pb/WindsurfSetting';

export interface StructuredErrorPart {
  'text'?: (string);
  'fileUri'?: (string);
  'directoryUri'?: (string);
  'url'?: (string);
  'codeText'?: (string);
  'windsurfSetting'?: (_exa_cortex_pb_WindsurfSetting | null);
  'part'?: "text"|"fileUri"|"directoryUri"|"url"|"codeText"|"windsurfSetting";
}

export interface StructuredErrorPart__Output {
  'text'?: (string);
  'fileUri'?: (string);
  'directoryUri'?: (string);
  'url'?: (string);
  'codeText'?: (string);
  'windsurfSetting'?: (_exa_cortex_pb_WindsurfSetting__Output | null);
  'part'?: "text"|"fileUri"|"directoryUri"|"url"|"codeText"|"windsurfSetting";
}
