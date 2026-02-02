// Original file: exa/codeium_common_pb/codeium_common.proto


export interface ExperimentSentryPayload {
  'sampleRate'?: (number | string);
  'procedureToSampleRate'?: ({[key: string]: number | string});
  'errorMatchToSampleRate'?: ({[key: string]: number | string});
}

export interface ExperimentSentryPayload__Output {
  'sampleRate': (number);
  'procedureToSampleRate': ({[key: string]: number});
  'errorMatchToSampleRate': ({[key: string]: number});
}
