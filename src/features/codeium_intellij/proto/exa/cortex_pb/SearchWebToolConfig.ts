// Original file: exa/cortex_pb/cortex.proto

import type { ThirdPartyWebSearchConfig as _exa_codeium_common_pb_ThirdPartyWebSearchConfig, ThirdPartyWebSearchConfig__Output as _exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output } from '../../exa/codeium_common_pb/ThirdPartyWebSearchConfig';

export interface SearchWebToolConfig {
  'forceDisable'?: (boolean);
  'thirdPartyConfig'?: (_exa_codeium_common_pb_ThirdPartyWebSearchConfig | null);
  '_forceDisable'?: "forceDisable";
  '_thirdPartyConfig'?: "thirdPartyConfig";
}

export interface SearchWebToolConfig__Output {
  'forceDisable'?: (boolean);
  'thirdPartyConfig'?: (_exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output | null);
  '_forceDisable'?: "forceDisable";
  '_thirdPartyConfig'?: "thirdPartyConfig";
}
