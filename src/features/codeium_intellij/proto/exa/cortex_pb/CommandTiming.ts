// Original file: exa/cortex_pb/cortex.proto


export interface CommandTiming {
  'label'?: (string);
  'commandType'?: (string);
  'execDurationSecs'?: (number | string);
  'errored'?: (boolean);
}

export interface CommandTiming__Output {
  'label': (string);
  'commandType': (string);
  'execDurationSecs': (number);
  'errored': (boolean);
}
