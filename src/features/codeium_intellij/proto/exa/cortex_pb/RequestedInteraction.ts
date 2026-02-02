// Original file: exa/cortex_pb/cortex.proto

import type { CascadeDeployInteractionSpec as _exa_cortex_pb_CascadeDeployInteractionSpec, CascadeDeployInteractionSpec__Output as _exa_cortex_pb_CascadeDeployInteractionSpec__Output } from '../../exa/cortex_pb/CascadeDeployInteractionSpec';
import type { CascadeRunCommandInteractionSpec as _exa_cortex_pb_CascadeRunCommandInteractionSpec, CascadeRunCommandInteractionSpec__Output as _exa_cortex_pb_CascadeRunCommandInteractionSpec__Output } from '../../exa/cortex_pb/CascadeRunCommandInteractionSpec';
import type { CascadeRunExtensionCodeInteractionSpec as _exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec, CascadeRunExtensionCodeInteractionSpec__Output as _exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec__Output } from '../../exa/cortex_pb/CascadeRunExtensionCodeInteractionSpec';
import type { CascadeTaskResolutionInteractionSpec as _exa_cortex_pb_CascadeTaskResolutionInteractionSpec, CascadeTaskResolutionInteractionSpec__Output as _exa_cortex_pb_CascadeTaskResolutionInteractionSpec__Output } from '../../exa/cortex_pb/CascadeTaskResolutionInteractionSpec';
import type { CascadeUpsertCodemapInteractionSpec as _exa_cortex_pb_CascadeUpsertCodemapInteractionSpec, CascadeUpsertCodemapInteractionSpec__Output as _exa_cortex_pb_CascadeUpsertCodemapInteractionSpec__Output } from '../../exa/cortex_pb/CascadeUpsertCodemapInteractionSpec';
import type { CascadeReadUrlContentInteractionSpec as _exa_cortex_pb_CascadeReadUrlContentInteractionSpec, CascadeReadUrlContentInteractionSpec__Output as _exa_cortex_pb_CascadeReadUrlContentInteractionSpec__Output } from '../../exa/cortex_pb/CascadeReadUrlContentInteractionSpec';
import type { CascadeAskUserQuestionInteractionSpec as _exa_cortex_pb_CascadeAskUserQuestionInteractionSpec, CascadeAskUserQuestionInteractionSpec__Output as _exa_cortex_pb_CascadeAskUserQuestionInteractionSpec__Output } from '../../exa/cortex_pb/CascadeAskUserQuestionInteractionSpec';

export interface RequestedInteraction {
  'deploy'?: (_exa_cortex_pb_CascadeDeployInteractionSpec | null);
  'runCommand'?: (_exa_cortex_pb_CascadeRunCommandInteractionSpec | null);
  'runExtensionCode'?: (_exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec | null);
  'resolveTask'?: (_exa_cortex_pb_CascadeTaskResolutionInteractionSpec | null);
  'upsertCodemap'?: (_exa_cortex_pb_CascadeUpsertCodemapInteractionSpec | null);
  'readUrlContent'?: (_exa_cortex_pb_CascadeReadUrlContentInteractionSpec | null);
  'askUserQuestion'?: (_exa_cortex_pb_CascadeAskUserQuestionInteractionSpec | null);
  'interaction'?: "deploy"|"runCommand"|"runExtensionCode"|"resolveTask"|"upsertCodemap"|"readUrlContent"|"askUserQuestion";
}

export interface RequestedInteraction__Output {
  'deploy'?: (_exa_cortex_pb_CascadeDeployInteractionSpec__Output | null);
  'runCommand'?: (_exa_cortex_pb_CascadeRunCommandInteractionSpec__Output | null);
  'runExtensionCode'?: (_exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec__Output | null);
  'resolveTask'?: (_exa_cortex_pb_CascadeTaskResolutionInteractionSpec__Output | null);
  'upsertCodemap'?: (_exa_cortex_pb_CascadeUpsertCodemapInteractionSpec__Output | null);
  'readUrlContent'?: (_exa_cortex_pb_CascadeReadUrlContentInteractionSpec__Output | null);
  'askUserQuestion'?: (_exa_cortex_pb_CascadeAskUserQuestionInteractionSpec__Output | null);
  'interaction'?: "deploy"|"runCommand"|"runExtensionCode"|"resolveTask"|"upsertCodemap"|"readUrlContent"|"askUserQuestion";
}
