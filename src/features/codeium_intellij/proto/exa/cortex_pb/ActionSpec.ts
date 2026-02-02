// Original file: exa/cortex_pb/cortex.proto

import type { ActionSpecCommand as _exa_cortex_pb_ActionSpecCommand, ActionSpecCommand__Output as _exa_cortex_pb_ActionSpecCommand__Output } from '../../exa/cortex_pb/ActionSpecCommand';
import type { ActionSpecCreateFile as _exa_cortex_pb_ActionSpecCreateFile, ActionSpecCreateFile__Output as _exa_cortex_pb_ActionSpecCreateFile__Output } from '../../exa/cortex_pb/ActionSpecCreateFile';
import type { ActionSpecDeleteFile as _exa_cortex_pb_ActionSpecDeleteFile, ActionSpecDeleteFile__Output as _exa_cortex_pb_ActionSpecDeleteFile__Output } from '../../exa/cortex_pb/ActionSpecDeleteFile';

export interface ActionSpec {
  'command'?: (_exa_cortex_pb_ActionSpecCommand | null);
  'createFile'?: (_exa_cortex_pb_ActionSpecCreateFile | null);
  'parentStepIndices'?: (number)[];
  'deleteFile'?: (_exa_cortex_pb_ActionSpecDeleteFile | null);
  'spec'?: "command"|"createFile"|"deleteFile";
}

export interface ActionSpec__Output {
  'command'?: (_exa_cortex_pb_ActionSpecCommand__Output | null);
  'createFile'?: (_exa_cortex_pb_ActionSpecCreateFile__Output | null);
  'parentStepIndices': (number)[];
  'deleteFile'?: (_exa_cortex_pb_ActionSpecDeleteFile__Output | null);
  'spec'?: "command"|"createFile"|"deleteFile";
}
