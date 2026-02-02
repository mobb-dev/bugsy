// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface WorkspaceStats {
  'numFiles'?: ({[key: number]: number | string | Long});
  'numBytes'?: ({[key: number]: number | string | Long});
  'workspace'?: (string);
  'initialScanCompleted'?: (boolean);
}

export interface WorkspaceStats__Output {
  'numFiles': ({[key: number]: string});
  'numBytes': ({[key: number]: string});
  'workspace': (string);
  'initialScanCompleted': (boolean);
}
