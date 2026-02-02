// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface PathScopeItem {
  'absolutePathMigrateMeToUri'?: (string);
  'workspaceRelativePathsMigrateMeToWorkspaceUris'?: ({[key: string]: string});
  'numFiles'?: (number);
  'numBytes'?: (number | string | Long);
  'absoluteUri'?: (string);
  'workspaceUrisToRelativePaths'?: ({[key: string]: string});
}

export interface PathScopeItem__Output {
  'absolutePathMigrateMeToUri': (string);
  'workspaceRelativePathsMigrateMeToWorkspaceUris': ({[key: string]: string});
  'numFiles': (number);
  'numBytes': (string);
  'absoluteUri': (string);
  'workspaceUrisToRelativePaths': ({[key: string]: string});
}
