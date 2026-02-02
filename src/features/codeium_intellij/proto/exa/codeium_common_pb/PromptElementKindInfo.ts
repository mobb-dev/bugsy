// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PromptElementKind as _exa_codeium_common_pb_PromptElementKind, PromptElementKind__Output as _exa_codeium_common_pb_PromptElementKind__Output } from '../../exa/codeium_common_pb/PromptElementKind';
import type { ExperimentKey as _exa_codeium_common_pb_ExperimentKey, ExperimentKey__Output as _exa_codeium_common_pb_ExperimentKey__Output } from '../../exa/codeium_common_pb/ExperimentKey';
import type { Long } from '@grpc/proto-loader';

export interface PromptElementKindInfo {
  'kind'?: (_exa_codeium_common_pb_PromptElementKind);
  'experimentKey'?: (_exa_codeium_common_pb_ExperimentKey);
  'enabled'?: (boolean);
  'numConsidered'?: (number | string | Long);
  'numIncluded'?: (number | string | Long);
}

export interface PromptElementKindInfo__Output {
  'kind': (_exa_codeium_common_pb_PromptElementKind__Output);
  'experimentKey': (_exa_codeium_common_pb_ExperimentKey__Output);
  'enabled': (boolean);
  'numConsidered': (string);
  'numIncluded': (string);
}
