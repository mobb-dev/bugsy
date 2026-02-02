// Original file: exa/cortex_pb/cortex.proto

import type { ReplaceContentToolConfig as _exa_cortex_pb_ReplaceContentToolConfig, ReplaceContentToolConfig__Output as _exa_cortex_pb_ReplaceContentToolConfig__Output } from '../../exa/cortex_pb/ReplaceContentToolConfig';
import type { AutoFixLintsConfig as _exa_cortex_pb_AutoFixLintsConfig, AutoFixLintsConfig__Output as _exa_cortex_pb_AutoFixLintsConfig__Output } from '../../exa/cortex_pb/AutoFixLintsConfig';
import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from '../../exa/cortex_pb/EnterpriseToolConfig';

export interface CodeToolConfig {
  'disableExtensions'?: (string)[];
  'applyEdits'?: (boolean);
  'useReplaceContentEditTool'?: (boolean);
  'replaceContentToolConfig'?: (_exa_cortex_pb_ReplaceContentToolConfig | null);
  'autoFixLintsConfig'?: (_exa_cortex_pb_AutoFixLintsConfig | null);
  'allowEditGitignore'?: (boolean);
  'enterpriseConfig'?: (_exa_cortex_pb_EnterpriseToolConfig | null);
  'overrideAllowActionOnUnsavedFile'?: (boolean);
  'skipReplaceContentValidation'?: (boolean);
  'useReplaceContentProposeCode'?: (boolean);
  'onlyShowIncrementalDiffZone'?: (boolean);
  'fileAllowlist'?: (string)[];
  'runProposalExtensionVerifier'?: (boolean);
  'skipAwaitLintErrors'?: (boolean);
  'dirAllowlist'?: (string)[];
  'allowEditRulesFiles'?: (boolean);
  'planDirs'?: (string)[];
  '_applyEdits'?: "applyEdits";
  '_useReplaceContentEditTool'?: "useReplaceContentEditTool";
  '_allowEditGitignore'?: "allowEditGitignore";
  '_overrideAllowActionOnUnsavedFile'?: "overrideAllowActionOnUnsavedFile";
  '_skipReplaceContentValidation'?: "skipReplaceContentValidation";
  '_useReplaceContentProposeCode'?: "useReplaceContentProposeCode";
  '_onlyShowIncrementalDiffZone'?: "onlyShowIncrementalDiffZone";
  '_runProposalExtensionVerifier'?: "runProposalExtensionVerifier";
  '_skipAwaitLintErrors'?: "skipAwaitLintErrors";
  '_allowEditRulesFiles'?: "allowEditRulesFiles";
}

export interface CodeToolConfig__Output {
  'disableExtensions': (string)[];
  'applyEdits'?: (boolean);
  'useReplaceContentEditTool'?: (boolean);
  'replaceContentToolConfig': (_exa_cortex_pb_ReplaceContentToolConfig__Output | null);
  'autoFixLintsConfig': (_exa_cortex_pb_AutoFixLintsConfig__Output | null);
  'allowEditGitignore'?: (boolean);
  'enterpriseConfig': (_exa_cortex_pb_EnterpriseToolConfig__Output | null);
  'overrideAllowActionOnUnsavedFile'?: (boolean);
  'skipReplaceContentValidation'?: (boolean);
  'useReplaceContentProposeCode'?: (boolean);
  'onlyShowIncrementalDiffZone'?: (boolean);
  'fileAllowlist': (string)[];
  'runProposalExtensionVerifier'?: (boolean);
  'skipAwaitLintErrors'?: (boolean);
  'dirAllowlist': (string)[];
  'allowEditRulesFiles'?: (boolean);
  'planDirs': (string)[];
  '_applyEdits'?: "applyEdits";
  '_useReplaceContentEditTool'?: "useReplaceContentEditTool";
  '_allowEditGitignore'?: "allowEditGitignore";
  '_overrideAllowActionOnUnsavedFile'?: "overrideAllowActionOnUnsavedFile";
  '_skipReplaceContentValidation'?: "skipReplaceContentValidation";
  '_useReplaceContentProposeCode'?: "useReplaceContentProposeCode";
  '_onlyShowIncrementalDiffZone'?: "onlyShowIncrementalDiffZone";
  '_runProposalExtensionVerifier'?: "runProposalExtensionVerifier";
  '_skipAwaitLintErrors'?: "skipAwaitLintErrors";
  '_allowEditRulesFiles'?: "allowEditRulesFiles";
}
