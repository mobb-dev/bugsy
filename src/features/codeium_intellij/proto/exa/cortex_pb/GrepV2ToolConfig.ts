// Original file: exa/cortex_pb/cortex.proto

import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from '../../exa/cortex_pb/EnterpriseToolConfig';

export interface GrepV2ToolConfig {
  'enterpriseConfig'?: (_exa_cortex_pb_EnterpriseToolConfig | null);
  'allowAccessGitignore'?: (boolean);
  '_allowAccessGitignore'?: "allowAccessGitignore";
}

export interface GrepV2ToolConfig__Output {
  'enterpriseConfig': (_exa_cortex_pb_EnterpriseToolConfig__Output | null);
  'allowAccessGitignore'?: (boolean);
  '_allowAccessGitignore'?: "allowAccessGitignore";
}
