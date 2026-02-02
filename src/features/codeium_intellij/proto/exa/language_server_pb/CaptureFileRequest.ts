// Original file: exa/language_server_pb/language_server.proto

import type { CaptureFileRequestData as _exa_codeium_common_pb_CaptureFileRequestData, CaptureFileRequestData__Output as _exa_codeium_common_pb_CaptureFileRequestData__Output } from '../../exa/codeium_common_pb/CaptureFileRequestData';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';

export interface CaptureFileRequest {
  'data'?: (_exa_codeium_common_pb_CaptureFileRequestData | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
}

export interface CaptureFileRequest__Output {
  'data': (_exa_codeium_common_pb_CaptureFileRequestData__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
}
