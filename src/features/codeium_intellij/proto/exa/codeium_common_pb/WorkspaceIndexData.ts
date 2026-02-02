// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';
import type { Long } from '@grpc/proto-loader';

export interface WorkspaceIndexData {
  'workspaceUriForTelemetry'?: (string);
  'indexingStart'?: (_google_protobuf_Timestamp | null);
  'indexingEnd'?: (_google_protobuf_Timestamp | null);
  'embeddingDuration'?: (_google_protobuf_Duration | null);
  'numFilesTotal'?: (number | string | Long);
  'numFilesToEmbed'?: (number | string | Long);
  'numNodesTotal'?: (number | string | Long);
  'numNodesToEmbed'?: (number | string | Long);
  'numTokens'?: (number | string | Long);
  'numHighPriorityNodesToEmbed'?: (number | string | Long);
  'error'?: (string);
}

export interface WorkspaceIndexData__Output {
  'workspaceUriForTelemetry': (string);
  'indexingStart': (_google_protobuf_Timestamp__Output | null);
  'indexingEnd': (_google_protobuf_Timestamp__Output | null);
  'embeddingDuration': (_google_protobuf_Duration__Output | null);
  'numFilesTotal': (string);
  'numFilesToEmbed': (string);
  'numNodesTotal': (string);
  'numNodesToEmbed': (string);
  'numTokens': (string);
  'numHighPriorityNodesToEmbed': (string);
  'error': (string);
}
