// Original file: exa/cortex_pb/cortex.proto


export interface CortexStepGrepSearchV2 {
  'searchPathUri'?: (string);
  'pattern'?: (string);
  'path'?: (string);
  'glob'?: (string);
  'outputMode'?: (string);
  'linesAfter'?: (number);
  'linesBefore'?: (number);
  'linesBoth'?: (number);
  'caseInsensitive'?: (boolean);
  'type'?: (string);
  'headLimit'?: (number);
  'multiline'?: (boolean);
  'commandRun'?: (string);
  'rawOutput'?: (string);
  'noFilesSearched'?: (boolean);
  'timedOut'?: (boolean);
}

export interface CortexStepGrepSearchV2__Output {
  'searchPathUri': (string);
  'pattern': (string);
  'path': (string);
  'glob': (string);
  'outputMode': (string);
  'linesAfter': (number);
  'linesBefore': (number);
  'linesBoth': (number);
  'caseInsensitive': (boolean);
  'type': (string);
  'headLimit': (number);
  'multiline': (boolean);
  'commandRun': (string);
  'rawOutput': (string);
  'noFilesSearched': (boolean);
  'timedOut': (boolean);
}
