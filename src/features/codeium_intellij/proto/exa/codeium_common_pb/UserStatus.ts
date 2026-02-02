// Original file: exa/codeium_common_pb/codeium_common.proto

import type { UserTeamStatus as _exa_codeium_common_pb_UserTeamStatus, UserTeamStatus__Output as _exa_codeium_common_pb_UserTeamStatus__Output } from '../../exa/codeium_common_pb/UserTeamStatus';
import type { TeamsFeatures as _exa_codeium_common_pb_TeamsFeatures, TeamsFeatures__Output as _exa_codeium_common_pb_TeamsFeatures__Output } from '../../exa/codeium_common_pb/TeamsFeatures';
import type { UserFeatures as _exa_codeium_common_pb_UserFeatures, UserFeatures__Output as _exa_codeium_common_pb_UserFeatures__Output } from '../../exa/codeium_common_pb/UserFeatures';
import type { TeamsTier as _exa_codeium_common_pb_TeamsTier, TeamsTier__Output as _exa_codeium_common_pb_TeamsTier__Output } from '../../exa/codeium_common_pb/TeamsTier';
import type { Permission as _exa_codeium_common_pb_Permission, Permission__Output as _exa_codeium_common_pb_Permission__Output } from '../../exa/codeium_common_pb/Permission';
import type { PlanStatus as _exa_codeium_common_pb_PlanStatus, PlanStatus__Output as _exa_codeium_common_pb_PlanStatus__Output } from '../../exa/codeium_common_pb/PlanStatus';
import type { TeamConfig as _exa_codeium_common_pb_TeamConfig, TeamConfig__Output as _exa_codeium_common_pb_TeamConfig__Output } from '../../exa/codeium_common_pb/TeamConfig';
import type { CascadeModelConfigData as _exa_codeium_common_pb_CascadeModelConfigData, CascadeModelConfigData__Output as _exa_codeium_common_pb_CascadeModelConfigData__Output } from '../../exa/codeium_common_pb/CascadeModelConfigData';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface UserStatus {
  'pro'?: (boolean);
  'disableTelemetry'?: (boolean);
  'name'?: (string);
  'ignoreChatTelemetrySetting'?: (boolean);
  'teamId'?: (string);
  'teamStatus'?: (_exa_codeium_common_pb_UserTeamStatus);
  'email'?: (string);
  'teamsFeatures'?: (_exa_codeium_common_pb_TeamsFeatures)[];
  'userFeatures'?: (_exa_codeium_common_pb_UserFeatures)[];
  'teamsTier'?: (_exa_codeium_common_pb_TeamsTier);
  'permissions'?: (_exa_codeium_common_pb_Permission)[];
  'planStatus'?: (_exa_codeium_common_pb_PlanStatus | null);
  'userUsedPromptCredits'?: (number | string | Long);
  'userUsedFlowCredits'?: (number | string | Long);
  'hasFingerprintSet'?: (boolean);
  'hasUsedWindsurf'?: (boolean);
  'teamConfig'?: (_exa_codeium_common_pb_TeamConfig | null);
  'cascadeModelConfigData'?: (_exa_codeium_common_pb_CascadeModelConfigData | null);
  'windsurfProTrialEndTime'?: (_google_protobuf_Timestamp | null);
  'maxNumPremiumChatMessages'?: (number | string | Long);
}

export interface UserStatus__Output {
  'pro': (boolean);
  'disableTelemetry': (boolean);
  'name': (string);
  'ignoreChatTelemetrySetting': (boolean);
  'teamId': (string);
  'teamStatus': (_exa_codeium_common_pb_UserTeamStatus__Output);
  'email': (string);
  'teamsFeatures': (_exa_codeium_common_pb_TeamsFeatures__Output)[];
  'userFeatures': (_exa_codeium_common_pb_UserFeatures__Output)[];
  'teamsTier': (_exa_codeium_common_pb_TeamsTier__Output);
  'permissions': (_exa_codeium_common_pb_Permission__Output)[];
  'planStatus': (_exa_codeium_common_pb_PlanStatus__Output | null);
  'userUsedPromptCredits': (string);
  'userUsedFlowCredits': (string);
  'hasFingerprintSet': (boolean);
  'hasUsedWindsurf': (boolean);
  'teamConfig': (_exa_codeium_common_pb_TeamConfig__Output | null);
  'cascadeModelConfigData': (_exa_codeium_common_pb_CascadeModelConfigData__Output | null);
  'windsurfProTrialEndTime': (_google_protobuf_Timestamp__Output | null);
  'maxNumPremiumChatMessages': (string);
}
