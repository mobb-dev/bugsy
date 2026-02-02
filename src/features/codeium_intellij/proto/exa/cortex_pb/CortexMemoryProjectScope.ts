// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemoryTrigger as _exa_cortex_pb_CortexMemoryTrigger, CortexMemoryTrigger__Output as _exa_cortex_pb_CortexMemoryTrigger__Output } from '../../exa/cortex_pb/CortexMemoryTrigger';
import type { RuleSource as _exa_cortex_pb_RuleSource, RuleSource__Output as _exa_cortex_pb_RuleSource__Output } from '../../exa/cortex_pb/RuleSource';

export interface CortexMemoryProjectScope {
  'filePath'?: (string);
  'baseDirUris'?: (string)[];
  'corpusNames'?: (string)[];
  'trigger'?: (_exa_cortex_pb_CortexMemoryTrigger);
  'description'?: (string);
  'globs'?: (string)[];
  'absoluteFilePath'?: (string);
  'ruleSource'?: (_exa_cortex_pb_RuleSource);
}

export interface CortexMemoryProjectScope__Output {
  'filePath': (string);
  'baseDirUris': (string)[];
  'corpusNames': (string)[];
  'trigger': (_exa_cortex_pb_CortexMemoryTrigger__Output);
  'description': (string);
  'globs': (string)[];
  'absoluteFilePath': (string);
  'ruleSource': (_exa_cortex_pb_RuleSource__Output);
}
