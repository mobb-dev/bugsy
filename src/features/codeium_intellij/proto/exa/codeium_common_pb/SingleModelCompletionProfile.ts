// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface SingleModelCompletionProfile {
  'totalPrefillPassTime'?: (number | string);
  'avgPrefillPassTime'?: (number | string);
  'numPrefillPasses'?: (number | string | Long);
  'totalGenerationPassTime'?: (number | string);
  'avgGenerationPassTime'?: (number | string);
  'numGenerationPasses'?: (number | string | Long);
  'totalSpecCopyPassTime'?: (number | string);
  'avgSpecCopyPassTime'?: (number | string);
  'numSpecCopyPasses'?: (number | string | Long);
  'totalModelTime'?: (number | string);
}

export interface SingleModelCompletionProfile__Output {
  'totalPrefillPassTime': (number);
  'avgPrefillPassTime': (number);
  'numPrefillPasses': (string);
  'totalGenerationPassTime': (number);
  'avgGenerationPassTime': (number);
  'numGenerationPasses': (string);
  'totalSpecCopyPassTime': (number);
  'avgSpecCopyPassTime': (number);
  'numSpecCopyPasses': (string);
  'totalModelTime': (number);
}
