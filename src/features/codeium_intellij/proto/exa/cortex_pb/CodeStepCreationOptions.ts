// Original file: exa/cortex_pb/cortex.proto

import type { Long } from '@grpc/proto-loader';

export interface CodeStepCreationOptions {
  'diffBlockSeparationThreshold'?: (number | string | Long);
  'handleDeletions'?: (boolean);
  'handleCreations'?: (boolean);
  'includeOriginalContent'?: (boolean);
  '_includeOriginalContent'?: "includeOriginalContent";
}

export interface CodeStepCreationOptions__Output {
  'diffBlockSeparationThreshold': (string);
  'handleDeletions': (boolean);
  'handleCreations': (boolean);
  'includeOriginalContent'?: (boolean);
  '_includeOriginalContent'?: "includeOriginalContent";
}
