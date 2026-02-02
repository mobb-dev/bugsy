// Original file: exa/cortex_pb/cortex.proto

import type { FastApplyFallbackConfig as _exa_cortex_pb_FastApplyFallbackConfig, FastApplyFallbackConfig__Output as _exa_cortex_pb_FastApplyFallbackConfig__Output } from '../../exa/cortex_pb/FastApplyFallbackConfig';
import type { ReplaceToolVariant as _exa_cortex_pb_ReplaceToolVariant, ReplaceToolVariant__Output as _exa_cortex_pb_ReplaceToolVariant__Output } from '../../exa/cortex_pb/ReplaceToolVariant';
import type { SectionOverrideConfig as _exa_cortex_pb_SectionOverrideConfig, SectionOverrideConfig__Output as _exa_cortex_pb_SectionOverrideConfig__Output } from '../../exa/cortex_pb/SectionOverrideConfig';

export interface ReplaceContentToolConfig {
  'maxFuzzyEditDistanceFraction'?: (number | string);
  'allowPartialReplacementSuccess'?: (boolean);
  'viewFileRecencyMaxDistance'?: (number);
  'enableFuzzySandwichMatch'?: (boolean);
  'fastApplyFallbackConfig'?: (_exa_cortex_pb_FastApplyFallbackConfig | null);
  'toolVariant'?: (_exa_cortex_pb_ReplaceToolVariant);
  'overrideDescription'?: (_exa_cortex_pb_SectionOverrideConfig | null);
  'showTriggeredMemories'?: (boolean);
  'disableAllowMultiple'?: (boolean);
  '_showTriggeredMemories'?: "showTriggeredMemories";
  '_disableAllowMultiple'?: "disableAllowMultiple";
}

export interface ReplaceContentToolConfig__Output {
  'maxFuzzyEditDistanceFraction': (number);
  'allowPartialReplacementSuccess': (boolean);
  'viewFileRecencyMaxDistance': (number);
  'enableFuzzySandwichMatch': (boolean);
  'fastApplyFallbackConfig': (_exa_cortex_pb_FastApplyFallbackConfig__Output | null);
  'toolVariant': (_exa_cortex_pb_ReplaceToolVariant__Output);
  'overrideDescription': (_exa_cortex_pb_SectionOverrideConfig__Output | null);
  'showTriggeredMemories'?: (boolean);
  'disableAllowMultiple'?: (boolean);
  '_showTriggeredMemories'?: "showTriggeredMemories";
  '_disableAllowMultiple'?: "disableAllowMultiple";
}
