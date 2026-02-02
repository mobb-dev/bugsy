// Original file: exa/cortex_pb/cortex.proto

import type { AskUserQuestionOption as _exa_cortex_pb_AskUserQuestionOption, AskUserQuestionOption__Output as _exa_cortex_pb_AskUserQuestionOption__Output } from '../../exa/cortex_pb/AskUserQuestionOption';
import type { CortexStepUserInput as _exa_cortex_pb_CortexStepUserInput, CortexStepUserInput__Output as _exa_cortex_pb_CortexStepUserInput__Output } from '../../exa/cortex_pb/CortexStepUserInput';

export interface _exa_cortex_pb_CortexStepAskUserQuestion_Request {
  'question'?: (string);
  'options'?: (_exa_cortex_pb_AskUserQuestionOption)[];
  'allowMultiple'?: (boolean);
}

export interface _exa_cortex_pb_CortexStepAskUserQuestion_Request__Output {
  'question': (string);
  'options': (_exa_cortex_pb_AskUserQuestionOption__Output)[];
  'allowMultiple': (boolean);
}

export interface _exa_cortex_pb_CortexStepAskUserQuestion_Response {
  'selectedOptions'?: (_exa_cortex_pb_CortexStepAskUserQuestion_SelectedOptions | null);
  'userInput'?: (_exa_cortex_pb_CortexStepUserInput | null);
  'responseType'?: "selectedOptions"|"userInput";
}

export interface _exa_cortex_pb_CortexStepAskUserQuestion_Response__Output {
  'selectedOptions'?: (_exa_cortex_pb_CortexStepAskUserQuestion_SelectedOptions__Output | null);
  'userInput'?: (_exa_cortex_pb_CortexStepUserInput__Output | null);
  'responseType'?: "selectedOptions"|"userInput";
}

export interface _exa_cortex_pb_CortexStepAskUserQuestion_SelectedOptions {
  'indices'?: (number)[];
}

export interface _exa_cortex_pb_CortexStepAskUserQuestion_SelectedOptions__Output {
  'indices': (number)[];
}

export interface CortexStepAskUserQuestion {
  'request'?: (_exa_cortex_pb_CortexStepAskUserQuestion_Request | null);
  'response'?: (_exa_cortex_pb_CortexStepAskUserQuestion_Response | null);
}

export interface CortexStepAskUserQuestion__Output {
  'request': (_exa_cortex_pb_CortexStepAskUserQuestion_Request__Output | null);
  'response': (_exa_cortex_pb_CortexStepAskUserQuestion_Response__Output | null);
}
