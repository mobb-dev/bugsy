// Original file: exa/language_server_pb/language_server.proto

import type { UserStatus as _exa_codeium_common_pb_UserStatus, UserStatus__Output as _exa_codeium_common_pb_UserStatus__Output } from '../../exa/codeium_common_pb/UserStatus';
import type { PlanInfo as _exa_codeium_common_pb_PlanInfo, PlanInfo__Output as _exa_codeium_common_pb_PlanInfo__Output } from '../../exa/codeium_common_pb/PlanInfo';

export interface GetUserStatusResponse {
  'userStatus'?: (_exa_codeium_common_pb_UserStatus | null);
  'planInfo'?: (_exa_codeium_common_pb_PlanInfo | null);
}

export interface GetUserStatusResponse__Output {
  'userStatus': (_exa_codeium_common_pb_UserStatus__Output | null);
  'planInfo': (_exa_codeium_common_pb_PlanInfo__Output | null);
}
