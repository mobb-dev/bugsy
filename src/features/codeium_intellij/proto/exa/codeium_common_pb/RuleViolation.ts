// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Rule as _exa_codeium_common_pb_Rule, Rule__Output as _exa_codeium_common_pb_Rule__Output } from '../../exa/codeium_common_pb/Rule';

export interface RuleViolation {
  'id'?: (string);
  'rule'?: (_exa_codeium_common_pb_Rule | null);
  'startLine'?: (number);
  'endLine'?: (number);
}

export interface RuleViolation__Output {
  'id': (string);
  'rule': (_exa_codeium_common_pb_Rule__Output | null);
  'startLine': (number);
  'endLine': (number);
}
