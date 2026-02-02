// Original file: exa/language_server_pb/language_server.proto

import type { CortexMemory as _exa_cortex_pb_CortexMemory, CortexMemory__Output as _exa_cortex_pb_CortexMemory__Output } from '../../exa/cortex_pb/CortexMemory';
import type { CortexSkill as _exa_cortex_pb_CortexSkill, CortexSkill__Output as _exa_cortex_pb_CortexSkill__Output } from '../../exa/cortex_pb/CortexSkill';

export interface GetAllRulesResponse {
  'memories'?: (_exa_cortex_pb_CortexMemory)[];
  'skills'?: (_exa_cortex_pb_CortexSkill)[];
}

export interface GetAllRulesResponse__Output {
  'memories': (_exa_cortex_pb_CortexMemory__Output)[];
  'skills': (_exa_cortex_pb_CortexSkill__Output)[];
}
