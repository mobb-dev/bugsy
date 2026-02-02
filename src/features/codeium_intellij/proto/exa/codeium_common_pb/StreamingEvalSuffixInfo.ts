// Original file: exa/codeium_common_pb/codeium_common.proto


export interface StreamingEvalSuffixInfo {
  'perTokenLogLikelihoods'?: (number | string)[];
  'isGreedy'?: (boolean);
}

export interface StreamingEvalSuffixInfo__Output {
  'perTokenLogLikelihoods': (number)[];
  'isGreedy': (boolean);
}
