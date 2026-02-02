// Original file: exa/bug_checker_pb/bug_checker.proto

import type { Fix as _exa_bug_checker_pb_Fix, Fix__Output as _exa_bug_checker_pb_Fix__Output } from '../../exa/bug_checker_pb/Fix';

export interface Bug {
  'id'?: (string);
  'file'?: (string);
  'start'?: (number);
  'end'?: (number);
  'title'?: (string);
  'description'?: (string);
  'severity'?: (string);
  'resolution'?: (string);
  'confidence'?: (number | string);
  'categories'?: (string)[];
  'fix'?: (_exa_bug_checker_pb_Fix | null);
}

export interface Bug__Output {
  'id': (string);
  'file': (string);
  'start': (number);
  'end': (number);
  'title': (string);
  'description': (string);
  'severity': (string);
  'resolution': (string);
  'confidence': (number);
  'categories': (string)[];
  'fix': (_exa_bug_checker_pb_Fix__Output | null);
}
