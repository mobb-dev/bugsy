// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';
import type { ThirdPartyWebSearchConfig as _exa_codeium_common_pb_ThirdPartyWebSearchConfig, ThirdPartyWebSearchConfig__Output as _exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output } from '../../exa/codeium_common_pb/ThirdPartyWebSearchConfig';

export interface CortexStepSearchWeb {
  'query'?: (string);
  'webDocuments'?: (_exa_codeium_common_pb_KnowledgeBaseItem)[];
  'domain'?: (string);
  'webSearchUrl'?: (string);
  'summary'?: (string);
  'thirdPartyConfig'?: (_exa_codeium_common_pb_ThirdPartyWebSearchConfig | null);
}

export interface CortexStepSearchWeb__Output {
  'query': (string);
  'webDocuments': (_exa_codeium_common_pb_KnowledgeBaseItem__Output)[];
  'domain': (string);
  'webSearchUrl': (string);
  'summary': (string);
  'thirdPartyConfig': (_exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output | null);
}
