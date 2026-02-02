// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CortexStepSmartFriend {
  'question'?: (string);
  'advice'?: (string);
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'modelName'?: (string);
  'smartFriendRequestId'?: (string);
  'modelUid'?: (string);
}

export interface CortexStepSmartFriend__Output {
  'question': (string);
  'advice': (string);
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'modelName': (string);
  'smartFriendRequestId': (string);
  'modelUid': (string);
}
