// Original file: exa/language_server_pb/language_server.proto

import type { UserSettings as _exa_codeium_common_pb_UserSettings, UserSettings__Output as _exa_codeium_common_pb_UserSettings__Output } from '../../exa/codeium_common_pb/UserSettings';

export interface SetUserSettingsRequest {
  'userSettings'?: (_exa_codeium_common_pb_UserSettings | null);
}

export interface SetUserSettingsRequest__Output {
  'userSettings': (_exa_codeium_common_pb_UserSettings__Output | null);
}
