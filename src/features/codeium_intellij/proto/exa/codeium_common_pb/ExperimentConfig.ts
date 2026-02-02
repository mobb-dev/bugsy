// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ExperimentKey as _exa_codeium_common_pb_ExperimentKey, ExperimentKey__Output as _exa_codeium_common_pb_ExperimentKey__Output } from '../../exa/codeium_common_pb/ExperimentKey';
import type { ExperimentWithVariant as _exa_codeium_common_pb_ExperimentWithVariant, ExperimentWithVariant__Output as _exa_codeium_common_pb_ExperimentWithVariant__Output } from '../../exa/codeium_common_pb/ExperimentWithVariant';

export interface ExperimentConfig {
  'forceEnableExperiments'?: (_exa_codeium_common_pb_ExperimentKey)[];
  'forceDisableExperiments'?: (_exa_codeium_common_pb_ExperimentKey)[];
  'forceEnableExperimentsWithVariants'?: (_exa_codeium_common_pb_ExperimentWithVariant)[];
  'forceEnableExperimentStrings'?: (string)[];
  'forceDisableExperimentStrings'?: (string)[];
  'experiments'?: (_exa_codeium_common_pb_ExperimentWithVariant)[];
  'devMode'?: (boolean);
}

export interface ExperimentConfig__Output {
  'forceEnableExperiments': (_exa_codeium_common_pb_ExperimentKey__Output)[];
  'forceDisableExperiments': (_exa_codeium_common_pb_ExperimentKey__Output)[];
  'forceEnableExperimentsWithVariants': (_exa_codeium_common_pb_ExperimentWithVariant__Output)[];
  'forceEnableExperimentStrings': (string)[];
  'forceDisableExperimentStrings': (string)[];
  'experiments': (_exa_codeium_common_pb_ExperimentWithVariant__Output)[];
  'devMode': (boolean);
}
