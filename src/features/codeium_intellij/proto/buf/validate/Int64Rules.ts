// Original file: buf/validate/validate.proto

import type { Long } from '@grpc/proto-loader';

export interface Int64Rules {
  'const'?: (number | string | Long);
  'lt'?: (number | string | Long);
  'lte'?: (number | string | Long);
  'gt'?: (number | string | Long);
  'gte'?: (number | string | Long);
  'in'?: (number | string | Long)[];
  'notIn'?: (number | string | Long)[];
  'example'?: (number | string | Long)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}

export interface Int64Rules__Output {
  'const': (string);
  'lt'?: (string);
  'lte'?: (string);
  'gt'?: (string);
  'gte'?: (string);
  'in': (string)[];
  'notIn': (string)[];
  'example': (string)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}
