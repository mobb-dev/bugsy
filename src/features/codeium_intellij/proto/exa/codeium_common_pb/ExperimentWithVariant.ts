// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ExperimentKey as _exa_codeium_common_pb_ExperimentKey, ExperimentKey__Output as _exa_codeium_common_pb_ExperimentKey__Output } from '../../exa/codeium_common_pb/ExperimentKey';
import type { ExperimentSource as _exa_codeium_common_pb_ExperimentSource, ExperimentSource__Output as _exa_codeium_common_pb_ExperimentSource__Output } from '../../exa/codeium_common_pb/ExperimentSource';

export interface ExperimentWithVariant {
  'key'?: (_exa_codeium_common_pb_ExperimentKey);
  'string'?: (string);
  'json'?: (string);
  'csv'?: (string);
  'keyString'?: (string);
  'disabled'?: (boolean);
  'source'?: (_exa_codeium_common_pb_ExperimentSource);
  'payload'?: "string"|"json"|"csv";
}

export interface ExperimentWithVariant__Output {
  'key': (_exa_codeium_common_pb_ExperimentKey__Output);
  'string'?: (string);
  'json'?: (string);
  'csv'?: (string);
  'keyString': (string);
  'disabled': (boolean);
  'source': (_exa_codeium_common_pb_ExperimentSource__Output);
  'payload'?: "string"|"json"|"csv";
}
