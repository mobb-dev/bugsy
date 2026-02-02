// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { UserStatus as _exa_codeium_common_pb_UserStatus, UserStatus__Output as _exa_codeium_common_pb_UserStatus__Output } from '../../exa/codeium_common_pb/UserStatus';

export interface UpdatePanelStateWithUserStatusRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'userStatus'?: (_exa_codeium_common_pb_UserStatus | null);
}

export interface UpdatePanelStateWithUserStatusRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'userStatus': (_exa_codeium_common_pb_UserStatus__Output | null);
}
