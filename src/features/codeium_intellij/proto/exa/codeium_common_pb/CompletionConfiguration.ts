// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface CompletionConfiguration {
  'numCompletions'?: (number | string | Long);
  'maxTokens'?: (number | string | Long);
  'maxNewlines'?: (number | string | Long);
  'minLogProbability'?: (number | string);
  'temperature'?: (number | string);
  'firstTemperature'?: (number | string);
  'topK'?: (number | string | Long);
  'topP'?: (number | string);
  'stopPatterns'?: (string)[];
  'seed'?: (number | string | Long);
  'fimEotProbThreshold'?: (number | string);
  'useFimEotThreshold'?: (boolean);
  'doNotScoreStopTokens'?: (boolean);
  'sqrtLenNormalizedLogProbScore'?: (boolean);
  'lastMessageIsPartial'?: (boolean);
  'returnLogprob'?: (boolean);
  'serviceTier'?: (string);
}

export interface CompletionConfiguration__Output {
  'numCompletions': (string);
  'maxTokens': (string);
  'maxNewlines': (string);
  'minLogProbability': (number);
  'temperature': (number);
  'firstTemperature': (number);
  'topK': (string);
  'topP': (number);
  'stopPatterns': (string)[];
  'seed': (string);
  'fimEotProbThreshold': (number);
  'useFimEotThreshold': (boolean);
  'doNotScoreStopTokens': (boolean);
  'sqrtLenNormalizedLogProbScore': (boolean);
  'lastMessageIsPartial': (boolean);
  'returnLogprob': (boolean);
  'serviceTier': (string);
}
