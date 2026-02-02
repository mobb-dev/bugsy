// Original file: exa/cascade_plugins_pb/cascade_plugins.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface InstallCascadePluginRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'pluginId'?: (string);
}

export interface InstallCascadePluginRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'pluginId': (string);
}
