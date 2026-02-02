// Original file: exa/cortex_pb/cortex.proto

import type { ReplacementChunk as _exa_cortex_pb_ReplacementChunk, ReplacementChunk__Output as _exa_cortex_pb_ReplacementChunk__Output } from '../../exa/cortex_pb/ReplacementChunk';

export interface ReplacementChunkInfo {
  'originalChunk'?: (_exa_cortex_pb_ReplacementChunk | null);
  'fuzzyMatch'?: (string);
  'editDistance'?: (number);
  'relEditDistance'?: (number | string);
  'numMatches'?: (number);
  'error'?: (boolean);
  'isNonExact'?: (boolean);
  'boundaryLinesMatch'?: (boolean);
  'errorStr'?: (string);
  'fastApplyFixable'?: (boolean);
}

export interface ReplacementChunkInfo__Output {
  'originalChunk': (_exa_cortex_pb_ReplacementChunk__Output | null);
  'fuzzyMatch': (string);
  'editDistance': (number);
  'relEditDistance': (number);
  'numMatches': (number);
  'error': (boolean);
  'isNonExact': (boolean);
  'boundaryLinesMatch': (boolean);
  'errorStr': (string);
  'fastApplyFixable': (boolean);
}
