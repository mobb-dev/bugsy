// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { CascadeConversationalPlannerConfig as _exa_cortex_pb_CascadeConversationalPlannerConfig, CascadeConversationalPlannerConfig__Output as _exa_cortex_pb_CascadeConversationalPlannerConfig__Output } from '../../exa/cortex_pb/CascadeConversationalPlannerConfig';
import type { CascadeAgenticPlannerConfig as _exa_cortex_pb_CascadeAgenticPlannerConfig, CascadeAgenticPlannerConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerConfig__Output } from '../../exa/cortex_pb/CascadeAgenticPlannerConfig';
import type { CascadeResearchPlannerConfig as _exa_cortex_pb_CascadeResearchPlannerConfig, CascadeResearchPlannerConfig__Output as _exa_cortex_pb_CascadeResearchPlannerConfig__Output } from '../../exa/cortex_pb/CascadeResearchPlannerConfig';
import type { CascadeToolConfig as _exa_cortex_pb_CascadeToolConfig, CascadeToolConfig__Output as _exa_cortex_pb_CascadeToolConfig__Output } from '../../exa/cortex_pb/CascadeToolConfig';
import type { ModelOrAlias as _exa_codeium_common_pb_ModelOrAlias, ModelOrAlias__Output as _exa_codeium_common_pb_ModelOrAlias__Output } from '../../exa/codeium_common_pb/ModelOrAlias';
import type { EphemeralMessagesConfig as _exa_cortex_pb_EphemeralMessagesConfig, EphemeralMessagesConfig__Output as _exa_cortex_pb_EphemeralMessagesConfig__Output } from '../../exa/cortex_pb/EphemeralMessagesConfig';
import type { CascadePassivePlannerConfig as _exa_cortex_pb_CascadePassivePlannerConfig, CascadePassivePlannerConfig__Output as _exa_cortex_pb_CascadePassivePlannerConfig__Output } from '../../exa/cortex_pb/CascadePassivePlannerConfig';
import type { CascadeAgentV2PlannerConfig as _exa_cortex_pb_CascadeAgentV2PlannerConfig, CascadeAgentV2PlannerConfig__Output as _exa_cortex_pb_CascadeAgentV2PlannerConfig__Output } from '../../exa/cortex_pb/CascadeAgentV2PlannerConfig';
import type { CascadeConversationalV2PlannerConfig as _exa_cortex_pb_CascadeConversationalV2PlannerConfig, CascadeConversationalV2PlannerConfig__Output as _exa_cortex_pb_CascadeConversationalV2PlannerConfig__Output } from '../../exa/cortex_pb/CascadeConversationalV2PlannerConfig';
import type { CascadeCodemapPlannerConfig as _exa_cortex_pb_CascadeCodemapPlannerConfig, CascadeCodemapPlannerConfig__Output as _exa_cortex_pb_CascadeCodemapPlannerConfig__Output } from '../../exa/cortex_pb/CascadeCodemapPlannerConfig';
import type { PromptOverrideConfig as _exa_cortex_pb_PromptOverrideConfig, PromptOverrideConfig__Output as _exa_cortex_pb_PromptOverrideConfig__Output } from '../../exa/cortex_pb/PromptOverrideConfig';
import type { CascadeLifeguardPlannerConfig as _exa_cortex_pb_CascadeLifeguardPlannerConfig, CascadeLifeguardPlannerConfig__Output as _exa_cortex_pb_CascadeLifeguardPlannerConfig__Output } from '../../exa/cortex_pb/CascadeLifeguardPlannerConfig';

export interface CascadePlannerConfig {
  'planModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'conversational'?: (_exa_cortex_pb_CascadeConversationalPlannerConfig | null);
  'agentic'?: (_exa_cortex_pb_CascadeAgenticPlannerConfig | null);
  'maxIterations'?: (number);
  'maxStepParseRetries'?: (number);
  'maxOutputTokens'?: (number);
  'noToolExplanation'?: (boolean);
  'research'?: (_exa_cortex_pb_CascadeResearchPlannerConfig | null);
  'allowPendingSteps'?: (boolean);
  'forbidToolUseOnLastRetry'?: (boolean);
  'toolConfig'?: (_exa_cortex_pb_CascadeToolConfig | null);
  'truncationThresholdTokens'?: (number);
  'requestedModelDeprecated'?: (_exa_codeium_common_pb_ModelOrAlias | null);
  'includeEphemeralMessage'?: (boolean);
  'ephemeralMessagesConfig'?: (_exa_cortex_pb_EphemeralMessagesConfig | null);
  'passive'?: (_exa_cortex_pb_CascadePassivePlannerConfig | null);
  'runAsProposer'?: (boolean);
  'agentV2'?: (_exa_cortex_pb_CascadeAgentV2PlannerConfig | null);
  'showAllErrors'?: (boolean);
  'conversationalV2'?: (_exa_cortex_pb_CascadeConversationalV2PlannerConfig | null);
  'isVibeAndReplace'?: (boolean);
  'codemap'?: (_exa_cortex_pb_CascadeCodemapPlannerConfig | null);
  'promptOverride'?: (_exa_cortex_pb_PromptOverrideConfig | null);
  'retryOnResponseContent'?: (string)[];
  'lifeguard'?: (_exa_cortex_pb_CascadeLifeguardPlannerConfig | null);
  'planModelUid'?: (string);
  'requestedModelUid'?: (string);
  'plannerTypeConfig'?: "conversational"|"conversationalV2"|"agentic"|"research"|"passive"|"agentV2"|"codemap"|"lifeguard";
  '_noToolExplanation'?: "noToolExplanation";
  '_allowPendingSteps'?: "allowPendingSteps";
  '_forbidToolUseOnLastRetry'?: "forbidToolUseOnLastRetry";
  '_includeEphemeralMessage'?: "includeEphemeralMessage";
}

export interface CascadePlannerConfig__Output {
  'planModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'conversational'?: (_exa_cortex_pb_CascadeConversationalPlannerConfig__Output | null);
  'agentic'?: (_exa_cortex_pb_CascadeAgenticPlannerConfig__Output | null);
  'maxIterations': (number);
  'maxStepParseRetries': (number);
  'maxOutputTokens': (number);
  'noToolExplanation'?: (boolean);
  'research'?: (_exa_cortex_pb_CascadeResearchPlannerConfig__Output | null);
  'allowPendingSteps'?: (boolean);
  'forbidToolUseOnLastRetry'?: (boolean);
  'toolConfig': (_exa_cortex_pb_CascadeToolConfig__Output | null);
  'truncationThresholdTokens': (number);
  'requestedModelDeprecated': (_exa_codeium_common_pb_ModelOrAlias__Output | null);
  'includeEphemeralMessage'?: (boolean);
  'ephemeralMessagesConfig': (_exa_cortex_pb_EphemeralMessagesConfig__Output | null);
  'passive'?: (_exa_cortex_pb_CascadePassivePlannerConfig__Output | null);
  'runAsProposer': (boolean);
  'agentV2'?: (_exa_cortex_pb_CascadeAgentV2PlannerConfig__Output | null);
  'showAllErrors': (boolean);
  'conversationalV2'?: (_exa_cortex_pb_CascadeConversationalV2PlannerConfig__Output | null);
  'isVibeAndReplace': (boolean);
  'codemap'?: (_exa_cortex_pb_CascadeCodemapPlannerConfig__Output | null);
  'promptOverride': (_exa_cortex_pb_PromptOverrideConfig__Output | null);
  'retryOnResponseContent': (string)[];
  'lifeguard'?: (_exa_cortex_pb_CascadeLifeguardPlannerConfig__Output | null);
  'planModelUid': (string);
  'requestedModelUid': (string);
  'plannerTypeConfig'?: "conversational"|"conversationalV2"|"agentic"|"research"|"passive"|"agentV2"|"codemap"|"lifeguard";
  '_noToolExplanation'?: "noToolExplanation";
  '_allowPendingSteps'?: "allowPendingSteps";
  '_forbidToolUseOnLastRetry'?: "forbidToolUseOnLastRetry";
  '_includeEphemeralMessage'?: "includeEphemeralMessage";
}
