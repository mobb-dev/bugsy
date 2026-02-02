// Original file: exa/cortex_pb/cortex.proto

import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from '../../exa/cortex_pb/EnterpriseToolConfig';

export interface GrepToolConfig {
  'maxGrepResults'?: (number);
  'includeCciInResult'?: (boolean);
  'numFullSourceCcis'?: (number);
  'maxBytesPerCci'?: (number);
  'enterpriseConfig'?: (_exa_cortex_pb_EnterpriseToolConfig | null);
  'allowAccessGitignore'?: (boolean);
  '_includeCciInResult'?: "includeCciInResult";
  '_allowAccessGitignore'?: "allowAccessGitignore";
}

export interface GrepToolConfig__Output {
  'maxGrepResults': (number);
  'includeCciInResult'?: (boolean);
  'numFullSourceCcis': (number);
  'maxBytesPerCci': (number);
  'enterpriseConfig': (_exa_cortex_pb_EnterpriseToolConfig__Output | null);
  'allowAccessGitignore'?: (boolean);
  '_includeCciInResult'?: "includeCciInResult";
  '_allowAccessGitignore'?: "allowAccessGitignore";
}
