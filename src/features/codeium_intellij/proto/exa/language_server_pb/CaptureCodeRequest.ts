// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ProviderSource as _exa_codeium_common_pb_ProviderSource, ProviderSource__Output as _exa_codeium_common_pb_ProviderSource__Output } from '../../exa/codeium_common_pb/ProviderSource';
import type { Long } from '@grpc/proto-loader';

export interface CaptureCodeRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'promptId'?: (string);
  'code'?: (string);
  'timeoutSec'?: (number | string | Long);
  'completionText'?: (string);
  'providerSource'?: (_exa_codeium_common_pb_ProviderSource);
  'completionId'?: (string);
  'diagnosticSeverity'?: (string);
}

export interface CaptureCodeRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'promptId': (string);
  'code': (string);
  'timeoutSec': (string);
  'completionText': (string);
  'providerSource': (_exa_codeium_common_pb_ProviderSource__Output);
  'completionId': (string);
  'diagnosticSeverity': (string);
}
