// Original file: exa/cortex_pb/cortex.proto

import type { MQueryConfig as _exa_codeium_common_pb_MQueryConfig, MQueryConfig__Output as _exa_codeium_common_pb_MQueryConfig__Output } from '../../exa/codeium_common_pb/MQueryConfig';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface MqueryToolConfig {
  'mQueryConfig'?: (_exa_codeium_common_pb_MQueryConfig | null);
  'mQueryModel'?: (_exa_codeium_common_pb_Model);
  'maxTokensPerMQuery'?: (number);
  'numItemsFullSource'?: (number);
  'maxLinesPerSnippet'?: (number);
  'enableSearchInFileTool'?: (boolean);
  'allowAccessGitignore'?: (boolean);
  'disableSemanticCodebaseSearch'?: (boolean);
  '_numItemsFullSource'?: "numItemsFullSource";
  '_enableSearchInFileTool'?: "enableSearchInFileTool";
  '_allowAccessGitignore'?: "allowAccessGitignore";
  '_disableSemanticCodebaseSearch'?: "disableSemanticCodebaseSearch";
}

export interface MqueryToolConfig__Output {
  'mQueryConfig': (_exa_codeium_common_pb_MQueryConfig__Output | null);
  'mQueryModel': (_exa_codeium_common_pb_Model__Output);
  'maxTokensPerMQuery': (number);
  'numItemsFullSource'?: (number);
  'maxLinesPerSnippet': (number);
  'enableSearchInFileTool'?: (boolean);
  'allowAccessGitignore'?: (boolean);
  'disableSemanticCodebaseSearch'?: (boolean);
  '_numItemsFullSource'?: "numItemsFullSource";
  '_enableSearchInFileTool'?: "enableSearchInFileTool";
  '_allowAccessGitignore'?: "allowAccessGitignore";
  '_disableSemanticCodebaseSearch'?: "disableSemanticCodebaseSearch";
}
