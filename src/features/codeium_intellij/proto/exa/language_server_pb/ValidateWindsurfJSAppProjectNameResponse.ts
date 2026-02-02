// Original file: exa/language_server_pb/language_server.proto

import type { ValidationStatus as _exa_codeium_common_pb_ValidationStatus, ValidationStatus__Output as _exa_codeium_common_pb_ValidationStatus__Output } from '../../exa/codeium_common_pb/ValidationStatus';

export interface ValidateWindsurfJSAppProjectNameResponse {
  'status'?: (_exa_codeium_common_pb_ValidationStatus);
  'alternativeNames'?: (string)[];
  'invalidReason'?: (string);
}

export interface ValidateWindsurfJSAppProjectNameResponse__Output {
  'status': (_exa_codeium_common_pb_ValidationStatus__Output);
  'alternativeNames': (string)[];
  'invalidReason': (string);
}
