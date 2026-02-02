// Original file: buf/validate/validate.proto

import type { FieldRules as _buf_validate_FieldRules, FieldRules__Output as _buf_validate_FieldRules__Output } from '../../buf/validate/FieldRules';
import type { Long } from '@grpc/proto-loader';

export interface RepeatedRules {
  'minItems'?: (number | string | Long);
  'maxItems'?: (number | string | Long);
  'unique'?: (boolean);
  'items'?: (_buf_validate_FieldRules | null);
}

export interface RepeatedRules__Output {
  'minItems': (string);
  'maxItems': (string);
  'unique': (boolean);
  'items': (_buf_validate_FieldRules__Output | null);
}
