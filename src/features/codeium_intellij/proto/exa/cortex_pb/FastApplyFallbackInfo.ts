// Original file: exa/cortex_pb/cortex.proto

import type { ActionResult as _exa_cortex_pb_ActionResult, ActionResult__Output as _exa_cortex_pb_ActionResult__Output } from '../../exa/cortex_pb/ActionResult';
import type { CodeHeuristicFailure as _exa_cortex_pb_CodeHeuristicFailure, CodeHeuristicFailure__Output as _exa_cortex_pb_CodeHeuristicFailure__Output } from '../../exa/cortex_pb/CodeHeuristicFailure';

export interface FastApplyFallbackInfo {
  'fallbackAttempted'?: (boolean);
  'fallbackError'?: (string);
  'fastApplyResult'?: (_exa_cortex_pb_ActionResult | null);
  'heuristicFailure'?: (_exa_cortex_pb_CodeHeuristicFailure);
  'fastApplyPrompt'?: (string);
  'numFastApplyEditsMasked'?: (number);
  'fallbackMatchHadNoDiff'?: (boolean);
}

export interface FastApplyFallbackInfo__Output {
  'fallbackAttempted': (boolean);
  'fallbackError': (string);
  'fastApplyResult': (_exa_cortex_pb_ActionResult__Output | null);
  'heuristicFailure': (_exa_cortex_pb_CodeHeuristicFailure__Output);
  'fastApplyPrompt': (string);
  'numFastApplyEditsMasked': (number);
  'fallbackMatchHadNoDiff': (boolean);
}
