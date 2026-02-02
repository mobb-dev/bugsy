// Original file: exa/cortex_pb/cortex.proto

import type { StructuredErrorPart as _exa_cortex_pb_StructuredErrorPart, StructuredErrorPart__Output as _exa_cortex_pb_StructuredErrorPart__Output } from '../../exa/cortex_pb/StructuredErrorPart';

export interface CortexErrorDetails {
  'userErrorMessage'?: (string);
  'shortError'?: (string);
  'fullError'?: (string);
  'isBenign'?: (boolean);
  'details'?: (string);
  'errorId'?: (string);
  'errorCode'?: (number);
  'structuredErrorParts'?: (_exa_cortex_pb_StructuredErrorPart)[];
}

export interface CortexErrorDetails__Output {
  'userErrorMessage': (string);
  'shortError': (string);
  'fullError': (string);
  'isBenign': (boolean);
  'details': (string);
  'errorId': (string);
  'errorCode': (number);
  'structuredErrorParts': (_exa_cortex_pb_StructuredErrorPart__Output)[];
}
