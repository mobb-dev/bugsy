// Original file: exa/cortex_pb/cortex.proto

import type { AutoCommandConfig as _exa_cortex_pb_AutoCommandConfig, AutoCommandConfig__Output as _exa_cortex_pb_AutoCommandConfig__Output } from '../../exa/cortex_pb/AutoCommandConfig';
import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from '../../exa/cortex_pb/EnterpriseToolConfig';

export interface RunCommandToolConfig {
  'maxCharsCommandStdout'?: (number);
  'forceDisable'?: (boolean);
  'autoCommandConfig'?: (_exa_cortex_pb_AutoCommandConfig | null);
  'enableIdeTerminalExecution'?: (boolean);
  'shellName'?: (string);
  'shellPath'?: (string);
  'maxTimeoutMs'?: (number);
  'enableMidtermOutputProcessor'?: (boolean);
  'enterpriseConfig'?: (_exa_cortex_pb_EnterpriseToolConfig | null);
  'useBashV2'?: (boolean);
  'shellIntegrationFailureReason'?: (string);
  '_forceDisable'?: "forceDisable";
  '_enableIdeTerminalExecution'?: "enableIdeTerminalExecution";
  '_enableMidtermOutputProcessor'?: "enableMidtermOutputProcessor";
  '_useBashV2'?: "useBashV2";
}

export interface RunCommandToolConfig__Output {
  'maxCharsCommandStdout': (number);
  'forceDisable'?: (boolean);
  'autoCommandConfig': (_exa_cortex_pb_AutoCommandConfig__Output | null);
  'enableIdeTerminalExecution'?: (boolean);
  'shellName': (string);
  'shellPath': (string);
  'maxTimeoutMs': (number);
  'enableMidtermOutputProcessor'?: (boolean);
  'enterpriseConfig': (_exa_cortex_pb_EnterpriseToolConfig__Output | null);
  'useBashV2'?: (boolean);
  'shellIntegrationFailureReason': (string);
  '_forceDisable'?: "forceDisable";
  '_enableIdeTerminalExecution'?: "enableIdeTerminalExecution";
  '_enableMidtermOutputProcessor'?: "enableMidtermOutputProcessor";
  '_useBashV2'?: "useBashV2";
}
