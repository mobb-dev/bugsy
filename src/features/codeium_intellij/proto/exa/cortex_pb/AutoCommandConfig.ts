// Original file: exa/cortex_pb/cortex.proto

import type { CascadeCommandsAutoExecution as _exa_codeium_common_pb_CascadeCommandsAutoExecution, CascadeCommandsAutoExecution__Output as _exa_codeium_common_pb_CascadeCommandsAutoExecution__Output } from '../../exa/codeium_common_pb/CascadeCommandsAutoExecution';

export interface AutoCommandConfig {
  'enableModelAutoRun'?: (boolean);
  'userAllowlist'?: (string)[];
  'userDenylist'?: (string)[];
  'systemAllowlist'?: (string)[];
  'systemDenylist'?: (string)[];
  'autoExecutionPolicy'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution);
  'systemNooplist'?: (string)[];
  'maxAutoExecutionLevel'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution);
  'workflowAutoExecutionPolicy'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution);
  '_enableModelAutoRun'?: "enableModelAutoRun";
}

export interface AutoCommandConfig__Output {
  'enableModelAutoRun'?: (boolean);
  'userAllowlist': (string)[];
  'userDenylist': (string)[];
  'systemAllowlist': (string)[];
  'systemDenylist': (string)[];
  'autoExecutionPolicy': (_exa_codeium_common_pb_CascadeCommandsAutoExecution__Output);
  'systemNooplist': (string)[];
  'maxAutoExecutionLevel': (_exa_codeium_common_pb_CascadeCommandsAutoExecution__Output);
  'workflowAutoExecutionPolicy': (_exa_codeium_common_pb_CascadeCommandsAutoExecution__Output);
  '_enableModelAutoRun'?: "enableModelAutoRun";
}
