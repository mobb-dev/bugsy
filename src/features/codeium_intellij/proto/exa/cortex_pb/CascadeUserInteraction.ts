// Original file: exa/cortex_pb/cortex.proto

import type { CascadeDeployInteraction as _exa_cortex_pb_CascadeDeployInteraction, CascadeDeployInteraction__Output as _exa_cortex_pb_CascadeDeployInteraction__Output } from '../../exa/cortex_pb/CascadeDeployInteraction';
import type { CascadeRunCommandInteraction as _exa_cortex_pb_CascadeRunCommandInteraction, CascadeRunCommandInteraction__Output as _exa_cortex_pb_CascadeRunCommandInteraction__Output } from '../../exa/cortex_pb/CascadeRunCommandInteraction';
import type { CascadeRunExtensionCodeInteraction as _exa_cortex_pb_CascadeRunExtensionCodeInteraction, CascadeRunExtensionCodeInteraction__Output as _exa_cortex_pb_CascadeRunExtensionCodeInteraction__Output } from '../../exa/cortex_pb/CascadeRunExtensionCodeInteraction';
import type { CascadeTaskResolutionInteraction as _exa_cortex_pb_CascadeTaskResolutionInteraction, CascadeTaskResolutionInteraction__Output as _exa_cortex_pb_CascadeTaskResolutionInteraction__Output } from '../../exa/cortex_pb/CascadeTaskResolutionInteraction';
import type { CascadeUpsertCodemapInteraction as _exa_cortex_pb_CascadeUpsertCodemapInteraction, CascadeUpsertCodemapInteraction__Output as _exa_cortex_pb_CascadeUpsertCodemapInteraction__Output } from '../../exa/cortex_pb/CascadeUpsertCodemapInteraction';
import type { CascadeReadUrlContentInteraction as _exa_cortex_pb_CascadeReadUrlContentInteraction, CascadeReadUrlContentInteraction__Output as _exa_cortex_pb_CascadeReadUrlContentInteraction__Output } from '../../exa/cortex_pb/CascadeReadUrlContentInteraction';
import type { CascadeAskUserQuestionInteraction as _exa_cortex_pb_CascadeAskUserQuestionInteraction, CascadeAskUserQuestionInteraction__Output as _exa_cortex_pb_CascadeAskUserQuestionInteraction__Output } from '../../exa/cortex_pb/CascadeAskUserQuestionInteraction';

export interface CascadeUserInteraction {
  'trajectoryId'?: (string);
  'stepIndex'?: (number);
  'deploy'?: (_exa_cortex_pb_CascadeDeployInteraction | null);
  'runCommand'?: (_exa_cortex_pb_CascadeRunCommandInteraction | null);
  'runExtensionCode'?: (_exa_cortex_pb_CascadeRunExtensionCodeInteraction | null);
  'resolveTask'?: (_exa_cortex_pb_CascadeTaskResolutionInteraction | null);
  'upsertCodemap'?: (_exa_cortex_pb_CascadeUpsertCodemapInteraction | null);
  'readUrlContent'?: (_exa_cortex_pb_CascadeReadUrlContentInteraction | null);
  'askUserQuestion'?: (_exa_cortex_pb_CascadeAskUserQuestionInteraction | null);
  'interaction'?: "deploy"|"runCommand"|"runExtensionCode"|"resolveTask"|"upsertCodemap"|"readUrlContent"|"askUserQuestion";
}

export interface CascadeUserInteraction__Output {
  'trajectoryId': (string);
  'stepIndex': (number);
  'deploy'?: (_exa_cortex_pb_CascadeDeployInteraction__Output | null);
  'runCommand'?: (_exa_cortex_pb_CascadeRunCommandInteraction__Output | null);
  'runExtensionCode'?: (_exa_cortex_pb_CascadeRunExtensionCodeInteraction__Output | null);
  'resolveTask'?: (_exa_cortex_pb_CascadeTaskResolutionInteraction__Output | null);
  'upsertCodemap'?: (_exa_cortex_pb_CascadeUpsertCodemapInteraction__Output | null);
  'readUrlContent'?: (_exa_cortex_pb_CascadeReadUrlContentInteraction__Output | null);
  'askUserQuestion'?: (_exa_cortex_pb_CascadeAskUserQuestionInteraction__Output | null);
  'interaction'?: "deploy"|"runCommand"|"runExtensionCode"|"resolveTask"|"upsertCodemap"|"readUrlContent"|"askUserQuestion";
}
