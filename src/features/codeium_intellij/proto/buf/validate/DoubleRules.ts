// Original file: buf/validate/validate.proto


export interface DoubleRules {
  'const'?: (number | string);
  'lt'?: (number | string);
  'lte'?: (number | string);
  'gt'?: (number | string);
  'gte'?: (number | string);
  'in'?: (number | string)[];
  'notIn'?: (number | string)[];
  'finite'?: (boolean);
  'example'?: (number | string)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}

export interface DoubleRules__Output {
  'const': (number);
  'lt'?: (number);
  'lte'?: (number);
  'gt'?: (number);
  'gte'?: (number);
  'in': (number)[];
  'notIn': (number)[];
  'finite': (boolean);
  'example': (number)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}
