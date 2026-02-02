// Original file: exa/cortex_pb/cortex.proto

import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from '../../exa/cortex_pb/EnterpriseToolConfig';

export interface ViewFileToolConfig {
  'maxTokensPerOutline'?: (number);
  'maxDocLinesFraction'?: (number | string);
  'allowDocOutline'?: (boolean);
  'useLineNumbersForRaw'?: (boolean);
  'usePromptPrefix'?: (boolean);
  'allowViewGitignore'?: (boolean);
  'splitOutlineTool'?: (boolean);
  'maxTotalOutlineBytes'?: (number);
  'showFullFileBytes'?: (number);
  'maxBytesPerOutlineItem'?: (number);
  'enterpriseConfig'?: (_exa_cortex_pb_EnterpriseToolConfig | null);
  'showTriggeredMemories'?: (boolean);
  'maxLinesPerView'?: (number);
  'useViewFileV2'?: (boolean);
  '_allowDocOutline'?: "allowDocOutline";
  '_useLineNumbersForRaw'?: "useLineNumbersForRaw";
  '_usePromptPrefix'?: "usePromptPrefix";
  '_allowViewGitignore'?: "allowViewGitignore";
  '_splitOutlineTool'?: "splitOutlineTool";
  '_showFullFileBytes'?: "showFullFileBytes";
  '_showTriggeredMemories'?: "showTriggeredMemories";
  '_maxLinesPerView'?: "maxLinesPerView";
  '_useViewFileV2'?: "useViewFileV2";
}

export interface ViewFileToolConfig__Output {
  'maxTokensPerOutline': (number);
  'maxDocLinesFraction': (number);
  'allowDocOutline'?: (boolean);
  'useLineNumbersForRaw'?: (boolean);
  'usePromptPrefix'?: (boolean);
  'allowViewGitignore'?: (boolean);
  'splitOutlineTool'?: (boolean);
  'maxTotalOutlineBytes': (number);
  'showFullFileBytes'?: (number);
  'maxBytesPerOutlineItem': (number);
  'enterpriseConfig': (_exa_cortex_pb_EnterpriseToolConfig__Output | null);
  'showTriggeredMemories'?: (boolean);
  'maxLinesPerView'?: (number);
  'useViewFileV2'?: (boolean);
  '_allowDocOutline'?: "allowDocOutline";
  '_useLineNumbersForRaw'?: "useLineNumbersForRaw";
  '_usePromptPrefix'?: "usePromptPrefix";
  '_allowViewGitignore'?: "allowViewGitignore";
  '_splitOutlineTool'?: "splitOutlineTool";
  '_showFullFileBytes'?: "showFullFileBytes";
  '_showTriggeredMemories'?: "showTriggeredMemories";
  '_maxLinesPerView'?: "maxLinesPerView";
  '_useViewFileV2'?: "useViewFileV2";
}
