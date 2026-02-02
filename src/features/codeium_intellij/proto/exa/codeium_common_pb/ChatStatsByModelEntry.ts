// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ChatStats as _exa_codeium_common_pb_ChatStats, ChatStats__Output as _exa_codeium_common_pb_ChatStats__Output } from '../../exa/codeium_common_pb/ChatStats';

export interface ChatStatsByModelEntry {
  'modelId'?: (_exa_codeium_common_pb_Model);
  'chatStats'?: (_exa_codeium_common_pb_ChatStats | null);
}

export interface ChatStatsByModelEntry__Output {
  'modelId': (_exa_codeium_common_pb_Model__Output);
  'chatStats': (_exa_codeium_common_pb_ChatStats__Output | null);
}
