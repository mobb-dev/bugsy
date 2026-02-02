// Original file: buf/validate/validate.proto

import type { FieldPath as _buf_validate_FieldPath, FieldPath__Output as _buf_validate_FieldPath__Output } from '../../buf/validate/FieldPath';

export interface Violation {
  'ruleId'?: (string);
  'message'?: (string);
  'forKey'?: (boolean);
  'field'?: (_buf_validate_FieldPath | null);
  'rule'?: (_buf_validate_FieldPath | null);
}

export interface Violation__Output {
  'ruleId': (string);
  'message': (string);
  'forKey': (boolean);
  'field': (_buf_validate_FieldPath__Output | null);
  'rule': (_buf_validate_FieldPath__Output | null);
}
