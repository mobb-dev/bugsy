// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { LatencyInfo as _exa_language_server_pb_LatencyInfo, LatencyInfo__Output as _exa_language_server_pb_LatencyInfo__Output } from '../../exa/language_server_pb/LatencyInfo';
import type { ProviderSource as _exa_codeium_common_pb_ProviderSource, ProviderSource__Output as _exa_codeium_common_pb_ProviderSource__Output } from '../../exa/codeium_common_pb/ProviderSource';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { Long } from '@grpc/proto-loader';

export interface ProvideCompletionFeedbackRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'isAccepted'?: (boolean);
  'feedbackDelayMs'?: (number | string | Long);
  'completionId'?: (string);
  'promptId'?: (string);
  'latencyInfo'?: (_exa_language_server_pb_LatencyInfo | null);
  'source'?: (_exa_codeium_common_pb_ProviderSource);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'viewColumnsOpen'?: (number | string | Long);
  'isIntentionalReject'?: (boolean);
  'isPartial'?: (boolean);
  'midstreamAutocompleteText'?: (string);
  'hasActiveVimExtension'?: (boolean);
  'completionText'?: (string);
  'isClientFilterReject'?: (boolean);
}

export interface ProvideCompletionFeedbackRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'isAccepted': (boolean);
  'feedbackDelayMs': (string);
  'completionId': (string);
  'promptId': (string);
  'latencyInfo': (_exa_language_server_pb_LatencyInfo__Output | null);
  'source': (_exa_codeium_common_pb_ProviderSource__Output);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'viewColumnsOpen': (string);
  'isIntentionalReject': (boolean);
  'isPartial': (boolean);
  'midstreamAutocompleteText': (string);
  'hasActiveVimExtension': (boolean);
  'completionText': (string);
  'isClientFilterReject': (boolean);
}
