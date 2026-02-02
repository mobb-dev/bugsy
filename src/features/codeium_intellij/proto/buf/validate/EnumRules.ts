// Original file: buf/validate/validate.proto


export interface EnumRules {
  'const'?: (number);
  'definedOnly'?: (boolean);
  'in'?: (number)[];
  'notIn'?: (number)[];
  'example'?: (number)[];
}

export interface EnumRules__Output {
  'const': (number);
  'definedOnly': (boolean);
  'in': (number)[];
  'notIn': (number)[];
  'example': (number)[];
}
