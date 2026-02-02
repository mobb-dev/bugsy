// Original file: exa/cortex_pb/cortex.proto

import type { GrepSearchResult as _exa_cortex_pb_GrepSearchResult, GrepSearchResult__Output as _exa_cortex_pb_GrepSearchResult__Output } from '../../exa/cortex_pb/GrepSearchResult';

export interface CortexStepGrepSearch {
  'query'?: (string);
  'includes'?: (string)[];
  'rawOutput'?: (string);
  'results'?: (_exa_cortex_pb_GrepSearchResult)[];
  'grepError'?: (string);
  'totalResults'?: (number);
  'matchPerLine'?: (boolean);
  'caseInsensitive'?: (boolean);
  'commandRun'?: (string);
  'searchPathUri'?: (string);
  'noFilesSearched'?: (boolean);
  'allowAccessGitignore'?: (boolean);
  'isRegex'?: (boolean);
  'timedOut'?: (boolean);
}

export interface CortexStepGrepSearch__Output {
  'query': (string);
  'includes': (string)[];
  'rawOutput': (string);
  'results': (_exa_cortex_pb_GrepSearchResult__Output)[];
  'grepError': (string);
  'totalResults': (number);
  'matchPerLine': (boolean);
  'caseInsensitive': (boolean);
  'commandRun': (string);
  'searchPathUri': (string);
  'noFilesSearched': (boolean);
  'allowAccessGitignore': (boolean);
  'isRegex': (boolean);
  'timedOut': (boolean);
}
