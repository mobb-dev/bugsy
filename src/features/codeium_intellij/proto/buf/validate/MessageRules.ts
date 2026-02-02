// Original file: buf/validate/validate.proto

import type { Rule as _buf_validate_Rule, Rule__Output as _buf_validate_Rule__Output } from '../../buf/validate/Rule';

export interface MessageRules {
  'disabled'?: (boolean);
  'cel'?: (_buf_validate_Rule)[];
}

export interface MessageRules__Output {
  'disabled': (boolean);
  'cel': (_buf_validate_Rule__Output)[];
}
