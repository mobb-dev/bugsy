// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface ExternalModel {
  'isInternal'?: (boolean);
  'modelId'?: (_exa_codeium_common_pb_Model);
  'modelName'?: (string);
  'baseUrl'?: (string);
  'apiKey'?: (string);
  'accessKey'?: (string);
  'secretAccessKey'?: (string);
  'region'?: (string);
  'projectId'?: (string);
  'id'?: (number);
  'maxCompletionTokens'?: (number);
  'maxInputTokens'?: (number);
}

export interface ExternalModel__Output {
  'isInternal': (boolean);
  'modelId': (_exa_codeium_common_pb_Model__Output);
  'modelName': (string);
  'baseUrl': (string);
  'apiKey': (string);
  'accessKey': (string);
  'secretAccessKey': (string);
  'region': (string);
  'projectId': (string);
  'id': (number);
  'maxCompletionTokens': (number);
  'maxInputTokens': (number);
}
