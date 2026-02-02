// Original file: exa/language_server_pb/language_server.proto

import type { CustomizationFileType as _exa_language_server_pb_CustomizationFileType, CustomizationFileType__Output as _exa_language_server_pb_CustomizationFileType__Output } from '../../exa/language_server_pb/CustomizationFileType';

export interface CreateCustomizationFileRequest {
  'fileType'?: (_exa_language_server_pb_CustomizationFileType);
  'fileName'?: (string);
}

export interface CreateCustomizationFileRequest__Output {
  'fileType': (_exa_language_server_pb_CustomizationFileType__Output);
  'fileName': (string);
}
