// Original file: exa/context_module_pb/context_module.proto

import type { ContextChangeActiveDocument as _exa_context_module_pb_ContextChangeActiveDocument, ContextChangeActiveDocument__Output as _exa_context_module_pb_ContextChangeActiveDocument__Output } from '../../exa/context_module_pb/ContextChangeActiveDocument';
import type { ContextChangeCursorPosition as _exa_context_module_pb_ContextChangeCursorPosition, ContextChangeCursorPosition__Output as _exa_context_module_pb_ContextChangeCursorPosition__Output } from '../../exa/context_module_pb/ContextChangeCursorPosition';
import type { ContextChangeChatMessageReceived as _exa_context_module_pb_ContextChangeChatMessageReceived, ContextChangeChatMessageReceived__Output as _exa_context_module_pb_ContextChangeChatMessageReceived__Output } from '../../exa/context_module_pb/ContextChangeChatMessageReceived';
import type { ContextChangeOpenDocuments as _exa_context_module_pb_ContextChangeOpenDocuments, ContextChangeOpenDocuments__Output as _exa_context_module_pb_ContextChangeOpenDocuments__Output } from '../../exa/context_module_pb/ContextChangeOpenDocuments';
import type { ContextChangeOracleItems as _exa_context_module_pb_ContextChangeOracleItems, ContextChangeOracleItems__Output as _exa_context_module_pb_ContextChangeOracleItems__Output } from '../../exa/context_module_pb/ContextChangeOracleItems';
import type { ContextRefreshReason as _exa_context_module_pb_ContextRefreshReason, ContextRefreshReason__Output as _exa_context_module_pb_ContextRefreshReason__Output } from '../../exa/context_module_pb/ContextRefreshReason';
import type { ContextChangePinnedContext as _exa_context_module_pb_ContextChangePinnedContext, ContextChangePinnedContext__Output as _exa_context_module_pb_ContextChangePinnedContext__Output } from '../../exa/context_module_pb/ContextChangePinnedContext';
import type { ContextChangePinnedGuideline as _exa_context_module_pb_ContextChangePinnedGuideline, ContextChangePinnedGuideline__Output as _exa_context_module_pb_ContextChangePinnedGuideline__Output } from '../../exa/context_module_pb/ContextChangePinnedGuideline';
import type { ContextChangeActiveNode as _exa_context_module_pb_ContextChangeActiveNode, ContextChangeActiveNode__Output as _exa_context_module_pb_ContextChangeActiveNode__Output } from '../../exa/context_module_pb/ContextChangeActiveNode';

export interface ContextChangeEvent {
  'contextChangeActiveDocument'?: (_exa_context_module_pb_ContextChangeActiveDocument | null);
  'contextChangeCursorPosition'?: (_exa_context_module_pb_ContextChangeCursorPosition | null);
  'contextChangeChatMessageReceived'?: (_exa_context_module_pb_ContextChangeChatMessageReceived | null);
  'contextChangeOpenDocuments'?: (_exa_context_module_pb_ContextChangeOpenDocuments | null);
  'contextChangeOracleItems'?: (_exa_context_module_pb_ContextChangeOracleItems | null);
  'contextRefreshReason'?: (_exa_context_module_pb_ContextRefreshReason);
  'contextChangePinnedContext'?: (_exa_context_module_pb_ContextChangePinnedContext | null);
  'contextChangePinnedGuideline'?: (_exa_context_module_pb_ContextChangePinnedGuideline | null);
  'contextChangeActiveNode'?: (_exa_context_module_pb_ContextChangeActiveNode | null);
  'contextChangeEvent'?: "contextChangeActiveDocument"|"contextChangeCursorPosition"|"contextChangeChatMessageReceived"|"contextChangeOpenDocuments"|"contextChangeOracleItems"|"contextChangePinnedContext"|"contextChangePinnedGuideline"|"contextChangeActiveNode";
}

export interface ContextChangeEvent__Output {
  'contextChangeActiveDocument'?: (_exa_context_module_pb_ContextChangeActiveDocument__Output | null);
  'contextChangeCursorPosition'?: (_exa_context_module_pb_ContextChangeCursorPosition__Output | null);
  'contextChangeChatMessageReceived'?: (_exa_context_module_pb_ContextChangeChatMessageReceived__Output | null);
  'contextChangeOpenDocuments'?: (_exa_context_module_pb_ContextChangeOpenDocuments__Output | null);
  'contextChangeOracleItems'?: (_exa_context_module_pb_ContextChangeOracleItems__Output | null);
  'contextRefreshReason': (_exa_context_module_pb_ContextRefreshReason__Output);
  'contextChangePinnedContext'?: (_exa_context_module_pb_ContextChangePinnedContext__Output | null);
  'contextChangePinnedGuideline'?: (_exa_context_module_pb_ContextChangePinnedGuideline__Output | null);
  'contextChangeActiveNode'?: (_exa_context_module_pb_ContextChangeActiveNode__Output | null);
  'contextChangeEvent'?: "contextChangeActiveDocument"|"contextChangeCursorPosition"|"contextChangeChatMessageReceived"|"contextChangeOpenDocuments"|"contextChangeOracleItems"|"contextChangePinnedContext"|"contextChangePinnedGuideline"|"contextChangeActiveNode";
}
