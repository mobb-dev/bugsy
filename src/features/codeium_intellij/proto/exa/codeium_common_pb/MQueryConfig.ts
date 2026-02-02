// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface MQueryConfig {
  'shouldBatchCcis'?: (boolean);
  'maxTokensPerSubrange'?: (number | string | Long);
  'numParserWorkers'?: (number | string | Long);
  'numWorkersPerDistributedScorer'?: (number | string | Long);
  'verbose'?: (boolean);
  'ignoreExtensions'?: (string)[];
  'ignoreDirectoryStubs'?: (string)[];
  'minTokenSpaceForContext'?: (number);
  'maxTargetFiles'?: (number);
  'topCciCount'?: (number);
}

export interface MQueryConfig__Output {
  'shouldBatchCcis': (boolean);
  'maxTokensPerSubrange': (string);
  'numParserWorkers': (string);
  'numWorkersPerDistributedScorer': (string);
  'verbose': (boolean);
  'ignoreExtensions': (string)[];
  'ignoreDirectoryStubs': (string)[];
  'minTokenSpaceForContext': (number);
  'maxTargetFiles': (number);
  'topCciCount': (number);
}
