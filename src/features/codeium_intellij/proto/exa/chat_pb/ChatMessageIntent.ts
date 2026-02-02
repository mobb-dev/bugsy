// Original file: exa/chat_pb/chat.proto

import type { IntentGeneric as _exa_chat_pb_IntentGeneric, IntentGeneric__Output as _exa_chat_pb_IntentGeneric__Output } from '../../exa/chat_pb/IntentGeneric';
import type { IntentFunctionExplain as _exa_chat_pb_IntentFunctionExplain, IntentFunctionExplain__Output as _exa_chat_pb_IntentFunctionExplain__Output } from '../../exa/chat_pb/IntentFunctionExplain';
import type { IntentFunctionDocstring as _exa_chat_pb_IntentFunctionDocstring, IntentFunctionDocstring__Output as _exa_chat_pb_IntentFunctionDocstring__Output } from '../../exa/chat_pb/IntentFunctionDocstring';
import type { IntentFunctionRefactor as _exa_chat_pb_IntentFunctionRefactor, IntentFunctionRefactor__Output as _exa_chat_pb_IntentFunctionRefactor__Output } from '../../exa/chat_pb/IntentFunctionRefactor';
import type { IntentCodeBlockExplain as _exa_chat_pb_IntentCodeBlockExplain, IntentCodeBlockExplain__Output as _exa_chat_pb_IntentCodeBlockExplain__Output } from '../../exa/chat_pb/IntentCodeBlockExplain';
import type { IntentCodeBlockRefactor as _exa_chat_pb_IntentCodeBlockRefactor, IntentCodeBlockRefactor__Output as _exa_chat_pb_IntentCodeBlockRefactor__Output } from '../../exa/chat_pb/IntentCodeBlockRefactor';
import type { IntentFunctionUnitTests as _exa_chat_pb_IntentFunctionUnitTests, IntentFunctionUnitTests__Output as _exa_chat_pb_IntentFunctionUnitTests__Output } from '../../exa/chat_pb/IntentFunctionUnitTests';
import type { IntentProblemExplain as _exa_chat_pb_IntentProblemExplain, IntentProblemExplain__Output as _exa_chat_pb_IntentProblemExplain__Output } from '../../exa/chat_pb/IntentProblemExplain';
import type { IntentGenerateCode as _exa_chat_pb_IntentGenerateCode, IntentGenerateCode__Output as _exa_chat_pb_IntentGenerateCode__Output } from '../../exa/chat_pb/IntentGenerateCode';
import type { IntentClassExplain as _exa_chat_pb_IntentClassExplain, IntentClassExplain__Output as _exa_chat_pb_IntentClassExplain__Output } from '../../exa/chat_pb/IntentClassExplain';
import type { IntentSearch as _exa_chat_pb_IntentSearch, IntentSearch__Output as _exa_chat_pb_IntentSearch__Output } from '../../exa/chat_pb/IntentSearch';
import type { IntentFastApply as _exa_chat_pb_IntentFastApply, IntentFastApply__Output as _exa_chat_pb_IntentFastApply__Output } from '../../exa/chat_pb/IntentFastApply';

export interface ChatMessageIntent {
  'generic'?: (_exa_chat_pb_IntentGeneric | null);
  'explainFunction'?: (_exa_chat_pb_IntentFunctionExplain | null);
  'functionDocstring'?: (_exa_chat_pb_IntentFunctionDocstring | null);
  'functionRefactor'?: (_exa_chat_pb_IntentFunctionRefactor | null);
  'explainCodeBlock'?: (_exa_chat_pb_IntentCodeBlockExplain | null);
  'codeBlockRefactor'?: (_exa_chat_pb_IntentCodeBlockRefactor | null);
  'functionUnitTests'?: (_exa_chat_pb_IntentFunctionUnitTests | null);
  'problemExplain'?: (_exa_chat_pb_IntentProblemExplain | null);
  'generateCode'?: (_exa_chat_pb_IntentGenerateCode | null);
  'explainClass'?: (_exa_chat_pb_IntentClassExplain | null);
  'search'?: (_exa_chat_pb_IntentSearch | null);
  'numTokens'?: (number);
  'fastApply'?: (_exa_chat_pb_IntentFastApply | null);
  'intent'?: "generic"|"explainFunction"|"functionDocstring"|"functionRefactor"|"explainCodeBlock"|"codeBlockRefactor"|"functionUnitTests"|"problemExplain"|"generateCode"|"explainClass"|"search"|"fastApply";
}

export interface ChatMessageIntent__Output {
  'generic'?: (_exa_chat_pb_IntentGeneric__Output | null);
  'explainFunction'?: (_exa_chat_pb_IntentFunctionExplain__Output | null);
  'functionDocstring'?: (_exa_chat_pb_IntentFunctionDocstring__Output | null);
  'functionRefactor'?: (_exa_chat_pb_IntentFunctionRefactor__Output | null);
  'explainCodeBlock'?: (_exa_chat_pb_IntentCodeBlockExplain__Output | null);
  'codeBlockRefactor'?: (_exa_chat_pb_IntentCodeBlockRefactor__Output | null);
  'functionUnitTests'?: (_exa_chat_pb_IntentFunctionUnitTests__Output | null);
  'problemExplain'?: (_exa_chat_pb_IntentProblemExplain__Output | null);
  'generateCode'?: (_exa_chat_pb_IntentGenerateCode__Output | null);
  'explainClass'?: (_exa_chat_pb_IntentClassExplain__Output | null);
  'search'?: (_exa_chat_pb_IntentSearch__Output | null);
  'numTokens': (number);
  'fastApply'?: (_exa_chat_pb_IntentFastApply__Output | null);
  'intent'?: "generic"|"explainFunction"|"functionDocstring"|"functionRefactor"|"explainCodeBlock"|"codeBlockRefactor"|"functionUnitTests"|"problemExplain"|"generateCode"|"explainClass"|"search"|"fastApply";
}
