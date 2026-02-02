// Original file: exa/codeium_common_pb/codeium_common.proto


export interface ModelFeatures {
  'supportsContextTokens'?: (boolean);
  'requiresInstructTags'?: (boolean);
  'requiresFimContext'?: (boolean);
  'requiresContextSnippetPrefix'?: (boolean);
  'requiresContextRelevanceTags'?: (boolean);
  'requiresLlama3Tokens'?: (boolean);
  'zeroShotCapable'?: (boolean);
  'requiresAutocompleteAsCommand'?: (boolean);
  'supportsCursorAwareSupercomplete'?: (boolean);
  'supportsImages'?: (boolean);
  'supportsToolCalls'?: (boolean);
  'supportsCumulativeContext'?: (boolean);
  'tabJumpPrintLineRange'?: (boolean);
  'supportsThinking'?: (boolean);
  'supportsEstimateTokenCounter'?: (boolean);
  'addCursorToFindReplaceTarget'?: (boolean);
  'supportsTabJumpUseWholeDocument'?: (boolean);
  'supportsImageCaptions'?: (boolean);
  'supportsParallelToolCalls'?: (boolean);
  'requiresSupercompleteClean'?: (boolean);
  'tabRouteToModal'?: (boolean);
  'interleaveThinking'?: (boolean);
  'preserveThinking'?: (boolean);
  'supportsRejectionContext'?: (boolean);
}

export interface ModelFeatures__Output {
  'supportsContextTokens': (boolean);
  'requiresInstructTags': (boolean);
  'requiresFimContext': (boolean);
  'requiresContextSnippetPrefix': (boolean);
  'requiresContextRelevanceTags': (boolean);
  'requiresLlama3Tokens': (boolean);
  'zeroShotCapable': (boolean);
  'requiresAutocompleteAsCommand': (boolean);
  'supportsCursorAwareSupercomplete': (boolean);
  'supportsImages': (boolean);
  'supportsToolCalls': (boolean);
  'supportsCumulativeContext': (boolean);
  'tabJumpPrintLineRange': (boolean);
  'supportsThinking': (boolean);
  'supportsEstimateTokenCounter': (boolean);
  'addCursorToFindReplaceTarget': (boolean);
  'supportsTabJumpUseWholeDocument': (boolean);
  'supportsImageCaptions': (boolean);
  'supportsParallelToolCalls': (boolean);
  'requiresSupercompleteClean': (boolean);
  'tabRouteToModal': (boolean);
  'interleaveThinking': (boolean);
  'preserveThinking': (boolean);
  'supportsRejectionContext': (boolean);
}
