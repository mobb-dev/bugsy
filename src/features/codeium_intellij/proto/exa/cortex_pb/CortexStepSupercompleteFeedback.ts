// Original file: exa/cortex_pb/cortex.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { ProviderSource as _exa_codeium_common_pb_ProviderSource, ProviderSource__Output as _exa_codeium_common_pb_ProviderSource__Output } from '../../exa/codeium_common_pb/ProviderSource';
import type { Long } from '@grpc/proto-loader';

export interface CortexStepSupercompleteFeedback {
  'completionId'?: (string);
  'completionText'?: (string);
  'feedbackType'?: (string);
  'feedbackReason'?: (string);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'feedbackDelayMs'?: (number | string | Long);
  'providerSource'?: (_exa_codeium_common_pb_ProviderSource);
}

export interface CortexStepSupercompleteFeedback__Output {
  'completionId': (string);
  'completionText': (string);
  'feedbackType': (string);
  'feedbackReason': (string);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'feedbackDelayMs': (string);
  'providerSource': (_exa_codeium_common_pb_ProviderSource__Output);
}
