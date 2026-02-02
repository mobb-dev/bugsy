// Original file: exa/index_pb/index.proto

import type { IndexDbVersion as _exa_index_pb_IndexDbVersion, IndexDbVersion__Output as _exa_index_pb_IndexDbVersion__Output } from '../../exa/index_pb/IndexDbVersion';
import type { IndexMode as _exa_index_pb_IndexMode, IndexMode__Output as _exa_index_pb_IndexMode__Output } from '../../exa/index_pb/IndexMode';

export interface IndexBuildConfig {
  'dbVersion'?: (_exa_index_pb_IndexDbVersion | null);
  'cciTimeoutSecs'?: (number);
  'indexMode'?: (_exa_index_pb_IndexMode);
}

export interface IndexBuildConfig__Output {
  'dbVersion': (_exa_index_pb_IndexDbVersion__Output | null);
  'cciTimeoutSecs': (number);
  'indexMode': (_exa_index_pb_IndexMode__Output);
}
