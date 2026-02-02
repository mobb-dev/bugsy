// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface BrowserCodeBlockScopeItem {
  'url'?: (string);
  'title'?: (string);
  'codeContent'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'contextText'?: (string);
  'pageId'?: (string);
  '_contextText'?: "contextText";
}

export interface BrowserCodeBlockScopeItem__Output {
  'url': (string);
  'title': (string);
  'codeContent': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'contextText'?: (string);
  'pageId': (string);
  '_contextText'?: "contextText";
}
