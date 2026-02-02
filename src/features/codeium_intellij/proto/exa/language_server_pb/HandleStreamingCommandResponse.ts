// Original file: exa/language_server_pb/language_server.proto

import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { LatencyInfo as _exa_language_server_pb_LatencyInfo, LatencyInfo__Output as _exa_language_server_pb_LatencyInfo__Output } from '../../exa/language_server_pb/LatencyInfo';
import type { CharacterDiff as _exa_diff_action_pb_CharacterDiff, CharacterDiff__Output as _exa_diff_action_pb_CharacterDiff__Output } from '../../exa/diff_action_pb/CharacterDiff';
import type { ComboDiff as _exa_diff_action_pb_ComboDiff, ComboDiff__Output as _exa_diff_action_pb_ComboDiff__Output } from '../../exa/diff_action_pb/ComboDiff';
import type { SuperCompleteFilterReason as _exa_codeium_common_pb_SuperCompleteFilterReason, SuperCompleteFilterReason__Output as _exa_codeium_common_pb_SuperCompleteFilterReason__Output } from '../../exa/codeium_common_pb/SuperCompleteFilterReason';
import type { RequestInfo as _exa_language_server_pb_RequestInfo, RequestInfo__Output as _exa_language_server_pb_RequestInfo__Output } from '../../exa/language_server_pb/RequestInfo';
import type { StopReason as _exa_codeium_common_pb_StopReason, StopReason__Output as _exa_codeium_common_pb_StopReason__Output } from '../../exa/codeium_common_pb/StopReason';
import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from '../../exa/codeium_common_pb/DocumentPosition';
import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';
import type { Long } from '@grpc/proto-loader';

export interface HandleStreamingCommandResponse {
  'completionId'?: (string);
  'promptId'?: (string);
  'diff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'latencyInfo'?: (_exa_language_server_pb_LatencyInfo | null);
  'selectionStartLine'?: (number | string | Long);
  'selectionEndLine'?: (number | string | Long);
  'score'?: (number | string);
  'characterDiff'?: (_exa_diff_action_pb_CharacterDiff | null);
  'comboDiff'?: (_exa_diff_action_pb_ComboDiff | null);
  'filterReason'?: (_exa_codeium_common_pb_SuperCompleteFilterReason | null);
  'closestChangedLine'?: (number | string | Long);
  'requestInfo'?: (_exa_language_server_pb_RequestInfo | null);
  'stopReason'?: (_exa_codeium_common_pb_StopReason);
  'jumpPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'rawText'?: (string);
  'requestUid'?: (string);
  '_jumpPosition'?: "jumpPosition";
  '_closestChangedLine'?: "closestChangedLine";
}

export interface HandleStreamingCommandResponse__Output {
  'completionId': (string);
  'promptId': (string);
  'diff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'latencyInfo': (_exa_language_server_pb_LatencyInfo__Output | null);
  'selectionStartLine': (string);
  'selectionEndLine': (string);
  'score': (number);
  'characterDiff': (_exa_diff_action_pb_CharacterDiff__Output | null);
  'comboDiff': (_exa_diff_action_pb_ComboDiff__Output | null);
  'filterReason': (_exa_codeium_common_pb_SuperCompleteFilterReason__Output | null);
  'closestChangedLine'?: (string);
  'requestInfo': (_exa_language_server_pb_RequestInfo__Output | null);
  'stopReason': (_exa_codeium_common_pb_StopReason__Output);
  'jumpPosition'?: (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'trajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'rawText': (string);
  'requestUid': (string);
  '_jumpPosition'?: "jumpPosition";
  '_closestChangedLine'?: "closestChangedLine";
}
