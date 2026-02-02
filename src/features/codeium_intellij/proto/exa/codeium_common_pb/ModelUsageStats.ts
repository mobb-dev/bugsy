// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { APIProvider as _exa_codeium_common_pb_APIProvider, APIProvider__Output as _exa_codeium_common_pb_APIProvider__Output } from '../../exa/codeium_common_pb/APIProvider';
import type { Long } from '@grpc/proto-loader';

export interface ModelUsageStats {
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'inputTokens'?: (number | string | Long);
  'outputTokens'?: (number | string | Long);
  'cacheWriteTokens'?: (number | string | Long);
  'cacheReadTokens'?: (number | string | Long);
  'apiProvider'?: (_exa_codeium_common_pb_APIProvider);
  'messageId'?: (string);
  'responseHeader'?: ({[key: string]: string});
  'modelUid'?: (string);
}

export interface ModelUsageStats__Output {
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'inputTokens': (string);
  'outputTokens': (string);
  'cacheWriteTokens': (string);
  'cacheReadTokens': (string);
  'apiProvider': (_exa_codeium_common_pb_APIProvider__Output);
  'messageId': (string);
  'responseHeader': ({[key: string]: string});
  'modelUid': (string);
}
