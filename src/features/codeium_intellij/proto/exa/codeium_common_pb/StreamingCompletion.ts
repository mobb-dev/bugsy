// Original file: exa/codeium_common_pb/codeium_common.proto

import type { StopReason as _exa_codeium_common_pb_StopReason, StopReason__Output as _exa_codeium_common_pb_StopReason__Output } from '../../exa/codeium_common_pb/StopReason';
import type { AttributionStatus as _exa_codeium_common_pb_AttributionStatus, AttributionStatus__Output as _exa_codeium_common_pb_AttributionStatus__Output } from '../../exa/codeium_common_pb/AttributionStatus';
import type { Long } from '@grpc/proto-loader';

export interface StreamingCompletion {
  'decodedToken'?: (Buffer | Uint8Array | string);
  'token'?: (number | string | Long);
  'probability'?: (number | string);
  'adjustedProbability'?: (number | string);
  'completionFinished'?: (boolean);
  'stop'?: (string);
  'stopReason'?: (_exa_codeium_common_pb_StopReason);
  'attributionStatuses'?: ({[key: number]: _exa_codeium_common_pb_AttributionStatus});
  'logprob'?: (number | string);
}

export interface StreamingCompletion__Output {
  'decodedToken': (Buffer);
  'token': (string);
  'probability': (number);
  'adjustedProbability': (number);
  'completionFinished': (boolean);
  'stop': (string);
  'stopReason': (_exa_codeium_common_pb_StopReason__Output);
  'attributionStatuses': ({[key: number]: _exa_codeium_common_pb_AttributionStatus__Output});
  'logprob': (number);
}
