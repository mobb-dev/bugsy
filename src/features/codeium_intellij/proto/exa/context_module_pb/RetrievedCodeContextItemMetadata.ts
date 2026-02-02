// Original file: exa/context_module_pb/context_module.proto

import type { CodeContextSource as _exa_codeium_common_pb_CodeContextSource, CodeContextSource__Output as _exa_codeium_common_pb_CodeContextSource__Output } from '../../exa/codeium_common_pb/CodeContextSource';
import type { CodeContextType as _exa_codeium_common_pb_CodeContextType, CodeContextType__Output as _exa_codeium_common_pb_CodeContextType__Output } from '../../exa/codeium_common_pb/CodeContextType';
import type { CodeContextProviderMetadata as _exa_context_module_pb_CodeContextProviderMetadata, CodeContextProviderMetadata__Output as _exa_context_module_pb_CodeContextProviderMetadata__Output } from '../../exa/context_module_pb/CodeContextProviderMetadata';

export interface RetrievedCodeContextItemMetadata {
  'contextSources'?: (_exa_codeium_common_pb_CodeContextSource)[];
  'contextType'?: (_exa_codeium_common_pb_CodeContextType);
  'scorer'?: (string);
  'score'?: (number | string);
  'providerMetadata'?: ({[key: string]: _exa_context_module_pb_CodeContextProviderMetadata});
  'isInPinnedScope'?: (boolean);
}

export interface RetrievedCodeContextItemMetadata__Output {
  'contextSources': (_exa_codeium_common_pb_CodeContextSource__Output)[];
  'contextType': (_exa_codeium_common_pb_CodeContextType__Output);
  'scorer': (string);
  'score': (number);
  'providerMetadata': ({[key: string]: _exa_context_module_pb_CodeContextProviderMetadata__Output});
  'isInPinnedScope': (boolean);
}
