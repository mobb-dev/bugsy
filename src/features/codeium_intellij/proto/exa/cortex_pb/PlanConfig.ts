// Original file: exa/cortex_pb/cortex.proto

import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { MQueryConfig as _exa_codeium_common_pb_MQueryConfig, MQueryConfig__Output as _exa_codeium_common_pb_MQueryConfig__Output } from '../../exa/codeium_common_pb/MQueryConfig';
import type { Long } from '@grpc/proto-loader';

export interface PlanConfig {
  'planModelName'?: (string);
  'maxTokensPerPlan'?: (number);
  'maxTokenFraction'?: (number | string);
  'chatTemperature'?: (number | string);
  'chatCompletionMaxTokens'?: (number | string | Long);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'mQueryConfig'?: (_exa_codeium_common_pb_MQueryConfig | null);
  'augmentCommand'?: (boolean);
}

export interface PlanConfig__Output {
  'planModelName': (string);
  'maxTokensPerPlan': (number);
  'maxTokenFraction': (number);
  'chatTemperature': (number);
  'chatCompletionMaxTokens': (string);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'mQueryConfig': (_exa_codeium_common_pb_MQueryConfig__Output | null);
  'augmentCommand': (boolean);
}
