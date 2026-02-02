// Original file: exa/cortex_pb/cortex.proto

import type { AutoWebRequestConfig as _exa_cortex_pb_AutoWebRequestConfig, AutoWebRequestConfig__Output as _exa_cortex_pb_AutoWebRequestConfig__Output } from '../../exa/cortex_pb/AutoWebRequestConfig';

export interface ReadUrlContentToolConfig {
  'forceDisable'?: (boolean);
  'autoWebRequestConfig'?: (_exa_cortex_pb_AutoWebRequestConfig | null);
  '_forceDisable'?: "forceDisable";
}

export interface ReadUrlContentToolConfig__Output {
  'forceDisable'?: (boolean);
  'autoWebRequestConfig': (_exa_cortex_pb_AutoWebRequestConfig__Output | null);
  '_forceDisable'?: "forceDisable";
}
