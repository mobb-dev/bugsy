// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { ModelType as _exa_codeium_common_pb_ModelType, ModelType__Output as _exa_codeium_common_pb_ModelType__Output } from '../../exa/codeium_common_pb/ModelType';
import type { ModelFeatures as _exa_codeium_common_pb_ModelFeatures, ModelFeatures__Output as _exa_codeium_common_pb_ModelFeatures__Output } from '../../exa/codeium_common_pb/ModelFeatures';
import type { APIProvider as _exa_codeium_common_pb_APIProvider, APIProvider__Output as _exa_codeium_common_pb_APIProvider__Output } from '../../exa/codeium_common_pb/APIProvider';
import type { PromptTemplaterType as _exa_codeium_common_pb_PromptTemplaterType, PromptTemplaterType__Output as _exa_codeium_common_pb_PromptTemplaterType__Output } from '../../exa/codeium_common_pb/PromptTemplaterType';
import type { ToolFormatterType as _exa_codeium_common_pb_ToolFormatterType, ToolFormatterType__Output as _exa_codeium_common_pb_ToolFormatterType__Output } from '../../exa/codeium_common_pb/ToolFormatterType';
import type { ArenaTier as _exa_codeium_common_pb_ArenaTier, ArenaTier__Output as _exa_codeium_common_pb_ArenaTier__Output } from '../../exa/codeium_common_pb/ArenaTier';

export interface ModelInfo {
  'modelId'?: (_exa_codeium_common_pb_Model);
  'isInternal'?: (boolean);
  'modelType'?: (_exa_codeium_common_pb_ModelType);
  'maxTokens'?: (number);
  'tokenizerType'?: (string);
  'modelFeatures'?: (_exa_codeium_common_pb_ModelFeatures | null);
  'apiProvider'?: (_exa_codeium_common_pb_APIProvider);
  'modelName'?: (string);
  'supportsContext'?: (boolean);
  'embedDim'?: (number);
  'baseUrl'?: (string);
  'chatModelName'?: (string);
  'maxOutputTokens'?: (number);
  'promptTemplaterType'?: (_exa_codeium_common_pb_PromptTemplaterType);
  'toolFormatterType'?: (_exa_codeium_common_pb_ToolFormatterType);
  'modelUid'?: (string);
  'inferenceServerUrl'?: (string);
  'arenaTier'?: (_exa_codeium_common_pb_ArenaTier);
  'harnessUids'?: (string)[];
}

export interface ModelInfo__Output {
  'modelId': (_exa_codeium_common_pb_Model__Output);
  'isInternal': (boolean);
  'modelType': (_exa_codeium_common_pb_ModelType__Output);
  'maxTokens': (number);
  'tokenizerType': (string);
  'modelFeatures': (_exa_codeium_common_pb_ModelFeatures__Output | null);
  'apiProvider': (_exa_codeium_common_pb_APIProvider__Output);
  'modelName': (string);
  'supportsContext': (boolean);
  'embedDim': (number);
  'baseUrl': (string);
  'chatModelName': (string);
  'maxOutputTokens': (number);
  'promptTemplaterType': (_exa_codeium_common_pb_PromptTemplaterType__Output);
  'toolFormatterType': (_exa_codeium_common_pb_ToolFormatterType__Output);
  'modelUid': (string);
  'inferenceServerUrl': (string);
  'arenaTier': (_exa_codeium_common_pb_ArenaTier__Output);
  'harnessUids': (string)[];
}
