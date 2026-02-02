// Original file: exa/cortex_pb/cortex.proto

import type { DiffList as _exa_diff_action_pb_DiffList, DiffList__Output as _exa_diff_action_pb_DiffList__Output } from '../../exa/diff_action_pb/DiffList';

export interface CortexStepCheckpoint {
  'checkpointIndex'?: (number);
  'includedStepIndices'?: (number)[];
  'userIntent'?: (string);
  'sessionSummary'?: (string);
  'codeChangeSummary'?: (string);
  'editedFileMap'?: ({[key: string]: _exa_diff_action_pb_DiffList});
  'memorySummary'?: (string);
  'intentOnly'?: (boolean);
  'conversationTitle'?: (string);
  'includedStepIndexStart'?: (number);
  'includedStepIndexEnd'?: (number);
  'planSnapshot'?: (string);
  'userIntentRequestId'?: (string);
  'sessionSummaryRequestId'?: (string);
  'codeChangeSummaryRequestId'?: (string);
}

export interface CortexStepCheckpoint__Output {
  'checkpointIndex': (number);
  'includedStepIndices': (number)[];
  'userIntent': (string);
  'sessionSummary': (string);
  'codeChangeSummary': (string);
  'editedFileMap': ({[key: string]: _exa_diff_action_pb_DiffList__Output});
  'memorySummary': (string);
  'intentOnly': (boolean);
  'conversationTitle': (string);
  'includedStepIndexStart': (number);
  'includedStepIndexEnd': (number);
  'planSnapshot': (string);
  'userIntentRequestId': (string);
  'sessionSummaryRequestId': (string);
  'codeChangeSummaryRequestId': (string);
}
