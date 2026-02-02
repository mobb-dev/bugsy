// Original file: exa/codeium_common_pb/codeium_common.proto

import type { StatusLevel as _exa_codeium_common_pb_StatusLevel, StatusLevel__Output as _exa_codeium_common_pb_StatusLevel__Output } from '../../exa/codeium_common_pb/StatusLevel';

export interface Status {
  'level'?: (_exa_codeium_common_pb_StatusLevel);
  'message'?: (string);
}

export interface Status__Output {
  'level': (_exa_codeium_common_pb_StatusLevel__Output);
  'message': (string);
}
