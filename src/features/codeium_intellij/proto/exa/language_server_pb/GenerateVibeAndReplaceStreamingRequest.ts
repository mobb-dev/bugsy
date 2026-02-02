// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { PlanInfo as _exa_codeium_common_pb_PlanInfo, PlanInfo__Output as _exa_codeium_common_pb_PlanInfo__Output } from '../../exa/codeium_common_pb/PlanInfo';
import type { VibeAndReplaceFile as _exa_language_server_pb_VibeAndReplaceFile, VibeAndReplaceFile__Output as _exa_language_server_pb_VibeAndReplaceFile__Output } from '../../exa/language_server_pb/VibeAndReplaceFile';

export interface GenerateVibeAndReplaceStreamingRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'planInfo'?: (_exa_codeium_common_pb_PlanInfo | null);
  'prompt'?: (string);
  'searchQuery'?: (string);
  'searchOptionsText'?: (string);
  'files'?: (_exa_language_server_pb_VibeAndReplaceFile)[];
  'cascadeId'?: (string);
  'modelUidForGeneration'?: (string);
  '_modelUidForGeneration'?: "modelUidForGeneration";
}

export interface GenerateVibeAndReplaceStreamingRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'planInfo': (_exa_codeium_common_pb_PlanInfo__Output | null);
  'prompt': (string);
  'searchQuery': (string);
  'searchOptionsText': (string);
  'files': (_exa_language_server_pb_VibeAndReplaceFile__Output)[];
  'cascadeId': (string);
  'modelUidForGeneration'?: (string);
  '_modelUidForGeneration'?: "modelUidForGeneration";
}
