// Original file: exa/cortex_pb/cortex.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CortexStepSource as _exa_cortex_pb_CortexStepSource, CortexStepSource__Output as _exa_cortex_pb_CortexStepSource__Output } from '../../exa/cortex_pb/CortexStepSource';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';
import type { ModelUsageStats as _exa_codeium_common_pb_ModelUsageStats, ModelUsageStats__Output as _exa_codeium_common_pb_ModelUsageStats__Output } from '../../exa/codeium_common_pb/ModelUsageStats';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ModelOrAlias as _exa_codeium_common_pb_ModelOrAlias, ModelOrAlias__Output as _exa_codeium_common_pb_ModelOrAlias__Output } from '../../exa/codeium_common_pb/ModelOrAlias';
import type { CortexStepCreditReason as _exa_cortex_pb_CortexStepCreditReason, CortexStepCreditReason__Output as _exa_cortex_pb_CortexStepCreditReason__Output } from '../../exa/cortex_pb/CortexStepCreditReason';
import type { CortexRequestSource as _exa_cortex_pb_CortexRequestSource, CortexRequestSource__Output as _exa_cortex_pb_CortexRequestSource__Output } from '../../exa/cortex_pb/CortexRequestSource';
import type { SourceTrajectoryStepInfo as _exa_cortex_pb_SourceTrajectoryStepInfo, SourceTrajectoryStepInfo__Output as _exa_cortex_pb_SourceTrajectoryStepInfo__Output } from '../../exa/cortex_pb/SourceTrajectoryStepInfo';
import type { ConversationalPlannerMode as _exa_codeium_common_pb_ConversationalPlannerMode, ConversationalPlannerMode__Output as _exa_codeium_common_pb_ConversationalPlannerMode__Output } from '../../exa/codeium_common_pb/ConversationalPlannerMode';
import type { Long } from '@grpc/proto-loader';

export interface CortexStepMetadata {
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'source'?: (_exa_cortex_pb_CortexStepSource);
  'toolCall'?: (_exa_codeium_common_pb_ChatToolCall | null);
  'argumentsOrder'?: (string)[];
  'viewableAt'?: (_google_protobuf_Timestamp | null);
  'finishedGeneratingAt'?: (_google_protobuf_Timestamp | null);
  'completedAt'?: (_google_protobuf_Timestamp | null);
  'modelUsage'?: (_exa_codeium_common_pb_ModelUsageStats | null);
  'modelCost'?: (number | string);
  'generatorModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'executionId'?: (string);
  'requestedModelDeprecated'?: (_exa_codeium_common_pb_ModelOrAlias | null);
  'flowCreditsUsed'?: (number);
  'promptCreditsUsed'?: (number);
  'toolCallChoices'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'toolCallChoiceReason'?: (string);
  'nonStandardCreditReasons'?: (_exa_cortex_pb_CortexStepCreditReason)[];
  'cortexRequestSource'?: (_exa_cortex_pb_CortexRequestSource);
  'sourceTrajectoryStepInfo'?: (_exa_cortex_pb_SourceTrajectoryStepInfo | null);
  'stepGenerationVersion'?: (number);
  'lastCompletedChunkAt'?: (_google_protobuf_Timestamp | null);
  'toolCallOutputTokens'?: (number);
  'requestId'?: (string);
  'cumulativeTokensAtStep'?: (number | string | Long);
  'plannerMode'?: (_exa_codeium_common_pb_ConversationalPlannerMode);
  'generatorModelUid'?: (string);
  'requestedModelUid'?: (string);
  'acuCost'?: (number | string);
}

export interface CortexStepMetadata__Output {
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'source': (_exa_cortex_pb_CortexStepSource__Output);
  'toolCall': (_exa_codeium_common_pb_ChatToolCall__Output | null);
  'argumentsOrder': (string)[];
  'viewableAt': (_google_protobuf_Timestamp__Output | null);
  'finishedGeneratingAt': (_google_protobuf_Timestamp__Output | null);
  'completedAt': (_google_protobuf_Timestamp__Output | null);
  'modelUsage': (_exa_codeium_common_pb_ModelUsageStats__Output | null);
  'modelCost': (number);
  'generatorModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'executionId': (string);
  'requestedModelDeprecated': (_exa_codeium_common_pb_ModelOrAlias__Output | null);
  'flowCreditsUsed': (number);
  'promptCreditsUsed': (number);
  'toolCallChoices': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'toolCallChoiceReason': (string);
  'nonStandardCreditReasons': (_exa_cortex_pb_CortexStepCreditReason__Output)[];
  'cortexRequestSource': (_exa_cortex_pb_CortexRequestSource__Output);
  'sourceTrajectoryStepInfo': (_exa_cortex_pb_SourceTrajectoryStepInfo__Output | null);
  'stepGenerationVersion': (number);
  'lastCompletedChunkAt': (_google_protobuf_Timestamp__Output | null);
  'toolCallOutputTokens': (number);
  'requestId': (string);
  'cumulativeTokensAtStep': (string);
  'plannerMode': (_exa_codeium_common_pb_ConversationalPlannerMode__Output);
  'generatorModelUid': (string);
  'requestedModelUid': (string);
  'acuCost': (number);
}
