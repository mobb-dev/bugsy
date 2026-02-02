// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ThirdPartyWebSearchProvider as _exa_codeium_common_pb_ThirdPartyWebSearchProvider, ThirdPartyWebSearchProvider__Output as _exa_codeium_common_pb_ThirdPartyWebSearchProvider__Output } from '../../exa/codeium_common_pb/ThirdPartyWebSearchProvider';
import type { ThirdPartyWebSearchModel as _exa_codeium_common_pb_ThirdPartyWebSearchModel, ThirdPartyWebSearchModel__Output as _exa_codeium_common_pb_ThirdPartyWebSearchModel__Output } from '../../exa/codeium_common_pb/ThirdPartyWebSearchModel';

export interface ThirdPartyWebSearchConfig {
  'provider'?: (_exa_codeium_common_pb_ThirdPartyWebSearchProvider);
  'model'?: (_exa_codeium_common_pb_ThirdPartyWebSearchModel);
}

export interface ThirdPartyWebSearchConfig__Output {
  'provider': (_exa_codeium_common_pb_ThirdPartyWebSearchProvider__Output);
  'model': (_exa_codeium_common_pb_ThirdPartyWebSearchModel__Output);
}
