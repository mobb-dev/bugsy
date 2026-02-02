// Original file: buf/validate/validate.proto


export interface UInt32Rules {
  'const'?: (number);
  'lt'?: (number);
  'lte'?: (number);
  'gt'?: (number);
  'gte'?: (number);
  'in'?: (number)[];
  'notIn'?: (number)[];
  'example'?: (number)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}

export interface UInt32Rules__Output {
  'const': (number);
  'lt'?: (number);
  'lte'?: (number);
  'gt'?: (number);
  'gte'?: (number);
  'in': (number)[];
  'notIn': (number)[];
  'example': (number)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}
