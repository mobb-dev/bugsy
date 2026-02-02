// Original file: exa/cortex_pb/cortex.proto


export interface CortexStepRelatedFiles {
  'absoluteUri'?: (string);
  'relatedFileAbsoluteUris'?: (string)[];
  'scores'?: (number | string)[];
  'relatedFileError'?: (string);
}

export interface CortexStepRelatedFiles__Output {
  'absoluteUri': (string);
  'relatedFileAbsoluteUris': (string)[];
  'scores': (number)[];
  'relatedFileError': (string);
}
