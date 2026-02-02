// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DeploymentProvider as _exa_codeium_common_pb_DeploymentProvider, DeploymentProvider__Output as _exa_codeium_common_pb_DeploymentProvider__Output } from '../../exa/codeium_common_pb/DeploymentProvider';

export interface DeployTarget {
  'deploymentProvider'?: (_exa_codeium_common_pb_DeploymentProvider);
  'isSandbox'?: (boolean);
  'providerTeamId'?: (string);
  'providerTeamSlug'?: (string);
  'domain'?: (string);
}

export interface DeployTarget__Output {
  'deploymentProvider': (_exa_codeium_common_pb_DeploymentProvider__Output);
  'isSandbox': (boolean);
  'providerTeamId': (string);
  'providerTeamSlug': (string);
  'domain': (string);
}
