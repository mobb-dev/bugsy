// Original file: exa/index_pb/index.proto

import type { Long } from '@grpc/proto-loader';

export interface IndexStats {
  'repositoryName'?: (string);
  'fileCount'?: (number | string | Long);
  'codeContextItemCount'?: (number | string | Long);
}

export interface IndexStats__Output {
  'repositoryName': (string);
  'fileCount': (string);
  'codeContextItemCount': (string);
}
