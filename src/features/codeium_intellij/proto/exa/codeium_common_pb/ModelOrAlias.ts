// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ModelAlias as _exa_codeium_common_pb_ModelAlias, ModelAlias__Output as _exa_codeium_common_pb_ModelAlias__Output } from '../../exa/codeium_common_pb/ModelAlias';

export interface ModelOrAlias {
  'model'?: (_exa_codeium_common_pb_Model);
  'alias'?: (_exa_codeium_common_pb_ModelAlias);
  'modelUid'?: (string);
  'choice'?: "model"|"alias"|"modelUid";
}

export interface ModelOrAlias__Output {
  'model'?: (_exa_codeium_common_pb_Model__Output);
  'alias'?: (_exa_codeium_common_pb_ModelAlias__Output);
  'modelUid'?: (string);
  'choice'?: "model"|"alias"|"modelUid";
}
