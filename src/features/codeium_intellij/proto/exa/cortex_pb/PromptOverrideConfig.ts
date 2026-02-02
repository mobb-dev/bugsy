// Original file: exa/cortex_pb/cortex.proto


export interface PromptOverrideConfig {
  'sectionOverrides'?: ({[key: string]: string});
  'additionalInstructions'?: (string)[];
}

export interface PromptOverrideConfig__Output {
  'sectionOverrides': ({[key: string]: string});
  'additionalInstructions': (string)[];
}
