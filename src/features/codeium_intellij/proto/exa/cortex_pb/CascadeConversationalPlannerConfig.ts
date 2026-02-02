// Original file: exa/cortex_pb/cortex.proto

import type { ConversationalPlannerMode as _exa_codeium_common_pb_ConversationalPlannerMode, ConversationalPlannerMode__Output as _exa_codeium_common_pb_ConversationalPlannerMode__Output } from '../../exa/codeium_common_pb/ConversationalPlannerMode';
import type { SectionOverrideConfig as _exa_cortex_pb_SectionOverrideConfig, SectionOverrideConfig__Output as _exa_cortex_pb_SectionOverrideConfig__Output } from '../../exa/cortex_pb/SectionOverrideConfig';

export interface CascadeConversationalPlannerConfig {
  'useClusters'?: (boolean);
  'clusterPath'?: (string);
  'plannerMode'?: (_exa_codeium_common_pb_ConversationalPlannerMode);
  'evalMode'?: (boolean);
  'codeResearchSectionContent'?: (string);
  'testSectionContent'?: (string);
  'testSection'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  'toolCallingSection'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  'codeChangesSection'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  'additionalInstructionsSection'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  'communicationSection'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  '_useClusters'?: "useClusters";
  '_evalMode'?: "evalMode";
  '_codeResearchSectionContent'?: "codeResearchSectionContent";
  '_testSectionContent'?: "testSectionContent";
  '_testSection'?: "testSection";
  '_toolCallingSection'?: "toolCallingSection";
  '_codeChangesSection'?: "codeChangesSection";
  '_additionalInstructionsSection'?: "additionalInstructionsSection";
  '_communicationSection'?: "communicationSection";
}

export interface CascadeConversationalPlannerConfig__Output {
  'useClusters'?: (boolean);
  'clusterPath': (string);
  'plannerMode': (_exa_codeium_common_pb_ConversationalPlannerMode__Output);
  'evalMode'?: (boolean);
  'codeResearchSectionContent'?: (string);
  'testSectionContent'?: (string);
  'testSection'?: (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  'toolCallingSection'?: (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  'codeChangesSection'?: (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  'additionalInstructionsSection'?: (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  'communicationSection'?: (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  '_useClusters'?: "useClusters";
  '_evalMode'?: "evalMode";
  '_codeResearchSectionContent'?: "codeResearchSectionContent";
  '_testSectionContent'?: "testSectionContent";
  '_testSection'?: "testSection";
  '_toolCallingSection'?: "toolCallingSection";
  '_codeChangesSection'?: "codeChangesSection";
  '_additionalInstructionsSection'?: "additionalInstructionsSection";
  '_communicationSection'?: "communicationSection";
}
