// Original file: exa/codeium_common_pb/codeium_common.proto


export interface MetricsRecord {
  'name'?: (string);
  'value'?: (number | string);
  'details'?: ({[key: string]: string});
  'lowerBetter'?: (boolean);
  'isBool'?: (boolean);
  'error'?: (string);
  'trajectoryId'?: (string);
}

export interface MetricsRecord__Output {
  'name': (string);
  'value': (number);
  'details': ({[key: string]: string});
  'lowerBetter': (boolean);
  'isBool': (boolean);
  'error': (string);
  'trajectoryId': (string);
}
