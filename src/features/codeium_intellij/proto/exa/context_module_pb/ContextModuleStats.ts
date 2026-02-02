// Original file: exa/context_module_pb/context_module.proto

import type { ContextModuleStateStats as _exa_context_module_pb_ContextModuleStateStats, ContextModuleStateStats__Output as _exa_context_module_pb_ContextModuleStateStats__Output } from '../../exa/context_module_pb/ContextModuleStateStats';
import type { CodeContextItemIndexStats as _exa_context_module_pb_CodeContextItemIndexStats, CodeContextItemIndexStats__Output as _exa_context_module_pb_CodeContextItemIndexStats__Output } from '../../exa/context_module_pb/CodeContextItemIndexStats';
import type { Long } from '@grpc/proto-loader';

export interface ContextModuleStats {
  'contextModuleStateStats'?: (_exa_context_module_pb_ContextModuleStateStats | null);
  'codeContextItemIndexStats'?: (_exa_context_module_pb_CodeContextItemIndexStats | null);
  'getStatsLatencyMs'?: (number | string | Long);
  'contextModuleAgeS'?: (number | string | Long);
}

export interface ContextModuleStats__Output {
  'contextModuleStateStats': (_exa_context_module_pb_ContextModuleStateStats__Output | null);
  'codeContextItemIndexStats': (_exa_context_module_pb_CodeContextItemIndexStats__Output | null);
  'getStatsLatencyMs': (string);
  'contextModuleAgeS': (string);
}
