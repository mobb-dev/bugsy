// Original file: exa/codeium_common_pb/codeium_common.proto

import type { TeamsTier as _exa_codeium_common_pb_TeamsTier, TeamsTier__Output as _exa_codeium_common_pb_TeamsTier__Output } from '../../exa/codeium_common_pb/TeamsTier';
import type { AllowedModelConfig as _exa_codeium_common_pb_AllowedModelConfig, AllowedModelConfig__Output as _exa_codeium_common_pb_AllowedModelConfig__Output } from '../../exa/codeium_common_pb/AllowedModelConfig';
import type { TeamConfig as _exa_codeium_common_pb_TeamConfig, TeamConfig__Output as _exa_codeium_common_pb_TeamConfig__Output } from '../../exa/codeium_common_pb/TeamConfig';
import type { TeamsFeaturesMetadata as _exa_codeium_common_pb_TeamsFeaturesMetadata, TeamsFeaturesMetadata__Output as _exa_codeium_common_pb_TeamsFeaturesMetadata__Output } from '../../exa/codeium_common_pb/TeamsFeaturesMetadata';
import type { Long } from '@grpc/proto-loader';

export interface PlanInfo {
  'teamsTier'?: (_exa_codeium_common_pb_TeamsTier);
  'planName'?: (string);
  'hasAutocompleteFastMode'?: (boolean);
  'allowStickyPremiumModels'?: (boolean);
  'hasForgeAccess'?: (boolean);
  'maxNumPremiumChatMessages'?: (number | string | Long);
  'maxNumChatInputTokens'?: (number | string | Long);
  'maxCustomChatInstructionCharacters'?: (number | string | Long);
  'maxNumPinnedContextItems'?: (number | string | Long);
  'maxLocalIndexSize'?: (number | string | Long);
  'disableCodeSnippetTelemetry'?: (boolean);
  'monthlyPromptCredits'?: (number);
  'monthlyFlowCredits'?: (number);
  'monthlyFlexCreditPurchaseAmount'?: (number);
  'allowPremiumCommandModels'?: (boolean);
  'isEnterprise'?: (boolean);
  'isTeams'?: (boolean);
  'canBuyMoreCredits'?: (boolean);
  'cascadeWebSearchEnabled'?: (boolean);
  'canCustomizeAppIcon'?: (boolean);
  'cascadeAllowedModelsConfig'?: (_exa_codeium_common_pb_AllowedModelConfig)[];
  'cascadeCanAutoRunCommands'?: (boolean);
  'hasTabToJump'?: (boolean);
  'defaultTeamConfig'?: (_exa_codeium_common_pb_TeamConfig | null);
  'canGenerateCommitMessages'?: (boolean);
  'maxUnclaimedSites'?: (number);
  'knowledgeBaseEnabled'?: (boolean);
  'canShareConversations'?: (boolean);
  'canAllowCascadeInBackground'?: (boolean);
  'defaultTeamFeatures'?: ({[key: number]: _exa_codeium_common_pb_TeamsFeaturesMetadata});
  'browserEnabled'?: (boolean);
  'hasPaidFeatures'?: (boolean);
}

export interface PlanInfo__Output {
  'teamsTier': (_exa_codeium_common_pb_TeamsTier__Output);
  'planName': (string);
  'hasAutocompleteFastMode': (boolean);
  'allowStickyPremiumModels': (boolean);
  'hasForgeAccess': (boolean);
  'maxNumPremiumChatMessages': (string);
  'maxNumChatInputTokens': (string);
  'maxCustomChatInstructionCharacters': (string);
  'maxNumPinnedContextItems': (string);
  'maxLocalIndexSize': (string);
  'disableCodeSnippetTelemetry': (boolean);
  'monthlyPromptCredits': (number);
  'monthlyFlowCredits': (number);
  'monthlyFlexCreditPurchaseAmount': (number);
  'allowPremiumCommandModels': (boolean);
  'isEnterprise': (boolean);
  'isTeams': (boolean);
  'canBuyMoreCredits': (boolean);
  'cascadeWebSearchEnabled': (boolean);
  'canCustomizeAppIcon': (boolean);
  'cascadeAllowedModelsConfig': (_exa_codeium_common_pb_AllowedModelConfig__Output)[];
  'cascadeCanAutoRunCommands': (boolean);
  'hasTabToJump': (boolean);
  'defaultTeamConfig': (_exa_codeium_common_pb_TeamConfig__Output | null);
  'canGenerateCommitMessages': (boolean);
  'maxUnclaimedSites': (number);
  'knowledgeBaseEnabled': (boolean);
  'canShareConversations': (boolean);
  'canAllowCascadeInBackground': (boolean);
  'defaultTeamFeatures': ({[key: number]: _exa_codeium_common_pb_TeamsFeaturesMetadata__Output});
  'browserEnabled': (boolean);
  'hasPaidFeatures': (boolean);
}
