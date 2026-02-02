// Original file: exa/cortex_pb/cortex.proto

import type { ListDirectoryResult as _exa_cortex_pb_ListDirectoryResult, ListDirectoryResult__Output as _exa_cortex_pb_ListDirectoryResult__Output } from '../../exa/cortex_pb/ListDirectoryResult';

export interface CortexStepListDirectory {
  'directoryPathUri'?: (string);
  'children'?: (string)[];
  'results'?: (_exa_cortex_pb_ListDirectoryResult)[];
  'dirNotFound'?: (boolean);
}

export interface CortexStepListDirectory__Output {
  'directoryPathUri': (string);
  'children': (string)[];
  'results': (_exa_cortex_pb_ListDirectoryResult__Output)[];
  'dirNotFound': (boolean);
}
