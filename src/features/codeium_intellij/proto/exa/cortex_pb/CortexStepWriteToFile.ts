// Original file: exa/cortex_pb/cortex.proto

import type { DiffBlock as _exa_diff_action_pb_DiffBlock, DiffBlock__Output as _exa_diff_action_pb_DiffBlock__Output } from '../../exa/diff_action_pb/DiffBlock';
import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';

export interface CortexStepWriteToFile {
  'targetFileUri'?: (string);
  'codeContent'?: (string)[];
  'diff'?: (_exa_diff_action_pb_DiffBlock | null);
  'fileCreated'?: (boolean);
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
}

export interface CortexStepWriteToFile__Output {
  'targetFileUri': (string);
  'codeContent': (string)[];
  'diff': (_exa_diff_action_pb_DiffBlock__Output | null);
  'fileCreated': (boolean);
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
}
