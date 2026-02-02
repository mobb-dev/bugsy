// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CompletionConfiguration as _exa_codeium_common_pb_CompletionConfiguration, CompletionConfiguration__Output as _exa_codeium_common_pb_CompletionConfiguration__Output } from '../../exa/codeium_common_pb/CompletionConfiguration';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { PromptElementRange as _exa_codeium_common_pb_PromptElementRange, PromptElementRange__Output as _exa_codeium_common_pb_PromptElementRange__Output } from '../../exa/codeium_common_pb/PromptElementRange';
import type { PromptElementKindInfo as _exa_codeium_common_pb_PromptElementKindInfo, PromptElementKindInfo__Output as _exa_codeium_common_pb_PromptElementKindInfo__Output } from '../../exa/codeium_common_pb/PromptElementKindInfo';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { PromptStageLatency as _exa_codeium_common_pb_PromptStageLatency, PromptStageLatency__Output as _exa_codeium_common_pb_PromptStageLatency__Output } from '../../exa/codeium_common_pb/PromptStageLatency';
import type { Repository as _exa_codeium_common_pb_Repository, Repository__Output as _exa_codeium_common_pb_Repository__Output } from '../../exa/codeium_common_pb/Repository';
import type { PromptAnnotationRange as _exa_codeium_common_pb_PromptAnnotationRange, PromptAnnotationRange__Output as _exa_codeium_common_pb_PromptAnnotationRange__Output } from '../../exa/codeium_common_pb/PromptAnnotationRange';
import type { Long } from '@grpc/proto-loader';

export interface CompletionsRequest {
  'configuration'?: (_exa_codeium_common_pb_CompletionConfiguration | null);
  'prompt'?: (string);
  'editorLanguage'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'absolutePathUriForTelemetry'?: (string);
  'relativePathForTelemetry'?: (string);
  'experimentFeaturesJson'?: (string);
  'promptElementRanges'?: (_exa_codeium_common_pb_PromptElementRange)[];
  'promptElementKindInfos'?: (_exa_codeium_common_pb_PromptElementKindInfo)[];
  'model'?: (_exa_codeium_common_pb_Model);
  'promptLatencyMs'?: (number | string | Long);
  'promptStageLatencies'?: (_exa_codeium_common_pb_PromptStageLatency)[];
  'workspaceUriForTelemetry'?: (string);
  'hasLineSuffix'?: (boolean);
  'shouldInlineFim'?: (boolean);
  'repository'?: (_exa_codeium_common_pb_Repository | null);
  'modelTag'?: (string);
  'experimentTags'?: (string)[];
  'experimentVariantJson'?: (string);
  'numTokenizedBytes'?: (number | string | Long);
  'contextPrompt'?: (string);
  'evalSuffix'?: (string);
  'promptAnnotationRanges'?: (_exa_codeium_common_pb_PromptAnnotationRange)[];
  'supportsPackedStreamingCompletionMaps'?: (boolean);
  'uid'?: (string);
}

export interface CompletionsRequest__Output {
  'configuration': (_exa_codeium_common_pb_CompletionConfiguration__Output | null);
  'prompt': (string);
  'editorLanguage': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'absolutePathUriForTelemetry': (string);
  'relativePathForTelemetry': (string);
  'experimentFeaturesJson': (string);
  'promptElementRanges': (_exa_codeium_common_pb_PromptElementRange__Output)[];
  'promptElementKindInfos': (_exa_codeium_common_pb_PromptElementKindInfo__Output)[];
  'model': (_exa_codeium_common_pb_Model__Output);
  'promptLatencyMs': (string);
  'promptStageLatencies': (_exa_codeium_common_pb_PromptStageLatency__Output)[];
  'workspaceUriForTelemetry': (string);
  'hasLineSuffix': (boolean);
  'shouldInlineFim': (boolean);
  'repository': (_exa_codeium_common_pb_Repository__Output | null);
  'modelTag': (string);
  'experimentTags': (string)[];
  'experimentVariantJson': (string);
  'numTokenizedBytes': (string);
  'contextPrompt': (string);
  'evalSuffix': (string);
  'promptAnnotationRanges': (_exa_codeium_common_pb_PromptAnnotationRange__Output)[];
  'supportsPackedStreamingCompletionMaps': (boolean);
  'uid': (string);
}
