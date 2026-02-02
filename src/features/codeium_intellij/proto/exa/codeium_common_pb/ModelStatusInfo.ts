// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ModelStatus as _exa_codeium_common_pb_ModelStatus, ModelStatus__Output as _exa_codeium_common_pb_ModelStatus__Output } from '../../exa/codeium_common_pb/ModelStatus';

export interface ModelStatusInfo {
  'model'?: (_exa_codeium_common_pb_Model);
  'message'?: (string);
  'status'?: (_exa_codeium_common_pb_ModelStatus);
  'modelUid'?: (string);
}

export interface ModelStatusInfo__Output {
  'model': (_exa_codeium_common_pb_Model__Output);
  'message': (string);
  'status': (_exa_codeium_common_pb_ModelStatus__Output);
  'modelUid': (string);
}
