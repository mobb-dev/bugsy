// Original file: exa/language_server_pb/language_server.proto

import type { SuperCompleteFilterReason as _exa_codeium_common_pb_SuperCompleteFilterReason, SuperCompleteFilterReason__Output as _exa_codeium_common_pb_SuperCompleteFilterReason__Output } from '../../exa/codeium_common_pb/SuperCompleteFilterReason';
import type { StopReason as _exa_codeium_common_pb_StopReason, StopReason__Output as _exa_codeium_common_pb_StopReason__Output } from '../../exa/codeium_common_pb/StopReason';
import type { TabRequestInfo as _exa_language_server_pb_TabRequestInfo, TabRequestInfo__Output as _exa_language_server_pb_TabRequestInfo__Output } from '../../exa/language_server_pb/TabRequestInfo';
import type { CharacterDiff as _exa_diff_action_pb_CharacterDiff, CharacterDiff__Output as _exa_diff_action_pb_CharacterDiff__Output } from '../../exa/diff_action_pb/CharacterDiff';
import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from '../../exa/codeium_common_pb/DocumentPosition';
import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { Long } from '@grpc/proto-loader';

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff {
  'path'?: (string);
  'selectionStartLine'?: (number | string | Long);
  'selectionEndLine'?: (number | string | Long);
  'characterDiff'?: (_exa_diff_action_pb_CharacterDiff | null);
  'cursorPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'oldStr'?: (string);
  'unifiedDiff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'sideHintRender'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff_SideHintRender | null);
  'inlineHintRender'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff_InlineHintRender | null);
  'renderInfo'?: "sideHintRender"|"inlineHintRender";
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff__Output {
  'path': (string);
  'selectionStartLine': (string);
  'selectionEndLine': (string);
  'characterDiff': (_exa_diff_action_pb_CharacterDiff__Output | null);
  'cursorPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'oldStr': (string);
  'unifiedDiff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'sideHintRender'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff_SideHintRender__Output | null);
  'inlineHintRender'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff_InlineHintRender__Output | null);
  'renderInfo'?: "sideHintRender"|"inlineHintRender";
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff_InlineHintRender {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff_InlineHintRender__Output {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_NoOp {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_NoOp__Output {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff_SideHintRender {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_Diff_SideHintRender__Output {
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_TabJump {
  'path'?: (string);
  'jumpPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'isImport'?: (boolean);
}

export interface _exa_language_server_pb_HandleStreamingTabV2Response_TabJump__Output {
  'path': (string);
  'jumpPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'isImport': (boolean);
}

export interface HandleStreamingTabV2Response {
  'completionId'?: (string);
  'promptId'?: (string);
  'requestUid'?: (string);
  'filterReason'?: (_exa_codeium_common_pb_SuperCompleteFilterReason | null);
  'stopReason'?: (_exa_codeium_common_pb_StopReason);
  'requestInfo'?: (_exa_language_server_pb_TabRequestInfo | null);
  'diff'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff | null);
  'tabJump'?: (_exa_language_server_pb_HandleStreamingTabV2Response_TabJump | null);
  'noop'?: (_exa_language_server_pb_HandleStreamingTabV2Response_NoOp | null);
  'suggestion'?: "diff"|"tabJump"|"noop";
}

export interface HandleStreamingTabV2Response__Output {
  'completionId': (string);
  'promptId': (string);
  'requestUid': (string);
  'filterReason': (_exa_codeium_common_pb_SuperCompleteFilterReason__Output | null);
  'stopReason': (_exa_codeium_common_pb_StopReason__Output);
  'requestInfo': (_exa_language_server_pb_TabRequestInfo__Output | null);
  'diff'?: (_exa_language_server_pb_HandleStreamingTabV2Response_Diff__Output | null);
  'tabJump'?: (_exa_language_server_pb_HandleStreamingTabV2Response_TabJump__Output | null);
  'noop'?: (_exa_language_server_pb_HandleStreamingTabV2Response_NoOp__Output | null);
  'suggestion'?: "diff"|"tabJump"|"noop";
}
