// Original file: exa/index_pb/index.proto

import type { ScmProvider as _exa_codeium_common_pb_ScmProvider, ScmProvider__Output as _exa_codeium_common_pb_ScmProvider__Output } from '../../exa/codeium_common_pb/ScmProvider';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface _exa_index_pb_RepositoryConfig_AutoIndexConfig {
  'branchName'?: (string);
  'interval'?: (_google_protobuf_Duration | null);
  'maxNumAutoIndexes'?: (number);
}

export interface _exa_index_pb_RepositoryConfig_AutoIndexConfig__Output {
  'branchName': (string);
  'interval': (_google_protobuf_Duration__Output | null);
  'maxNumAutoIndexes': (number);
}

export interface RepositoryConfig {
  'gitUrl'?: (string);
  'scmProvider'?: (_exa_codeium_common_pb_ScmProvider);
  'autoIndexConfig'?: (_exa_index_pb_RepositoryConfig_AutoIndexConfig | null);
  'storeSnippets'?: (boolean);
  'whitelistedGroups'?: (string)[];
  'useGithubApp'?: (boolean);
  'authUid'?: (string);
  'serviceKeyId'?: (string);
  'email'?: (string);
}

export interface RepositoryConfig__Output {
  'gitUrl': (string);
  'scmProvider': (_exa_codeium_common_pb_ScmProvider__Output);
  'autoIndexConfig': (_exa_index_pb_RepositoryConfig_AutoIndexConfig__Output | null);
  'storeSnippets': (boolean);
  'whitelistedGroups': (string)[];
  'useGithubApp': (boolean);
  'authUid': (string);
  'serviceKeyId': (string);
  'email': (string);
}
