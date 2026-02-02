// Original file: exa/cortex_pb/cortex.proto

import type { DeployTarget as _exa_codeium_common_pb_DeployTarget, DeployTarget__Output as _exa_codeium_common_pb_DeployTarget__Output } from '../../exa/codeium_common_pb/DeployTarget';

export interface CascadeDeployInteraction {
  'cancel'?: (boolean);
  'deployTarget'?: (_exa_codeium_common_pb_DeployTarget | null);
  'subdomain'?: (string);
}

export interface CascadeDeployInteraction__Output {
  'cancel': (boolean);
  'deployTarget': (_exa_codeium_common_pb_DeployTarget__Output | null);
  'subdomain': (string);
}
