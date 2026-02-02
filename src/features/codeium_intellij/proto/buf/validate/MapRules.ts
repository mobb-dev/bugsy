// Original file: buf/validate/validate.proto

import type { FieldRules as _buf_validate_FieldRules, FieldRules__Output as _buf_validate_FieldRules__Output } from '../../buf/validate/FieldRules';
import type { Long } from '@grpc/proto-loader';

export interface MapRules {
  'minPairs'?: (number | string | Long);
  'maxPairs'?: (number | string | Long);
  'keys'?: (_buf_validate_FieldRules | null);
  'values'?: (_buf_validate_FieldRules | null);
}

export interface MapRules__Output {
  'minPairs': (string);
  'maxPairs': (string);
  'keys': (_buf_validate_FieldRules__Output | null);
  'values': (_buf_validate_FieldRules__Output | null);
}
