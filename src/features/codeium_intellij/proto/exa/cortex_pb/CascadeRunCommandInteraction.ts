// Original file: exa/cortex_pb/cortex.proto

import type { RunCommandAction as _exa_cortex_pb_RunCommandAction, RunCommandAction__Output as _exa_cortex_pb_RunCommandAction__Output } from '../../exa/cortex_pb/RunCommandAction';

export interface CascadeRunCommandInteraction {
  'confirm'?: (boolean);
  'proposedCommandLine'?: (string);
  'submittedCommandLine'?: (string);
  'action'?: (_exa_cortex_pb_RunCommandAction);
}

export interface CascadeRunCommandInteraction__Output {
  'confirm': (boolean);
  'proposedCommandLine': (string);
  'submittedCommandLine': (string);
  'action': (_exa_cortex_pb_RunCommandAction__Output);
}
