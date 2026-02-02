// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepCompileTool as _exa_cortex_pb_CortexStepCompileTool, CortexStepCompileTool__Output as _exa_cortex_pb_CortexStepCompileTool__Output } from '../../exa/cortex_pb/CortexStepCompileTool';
import type { CortexStepCompileDiagnostic as _exa_cortex_pb_CortexStepCompileDiagnostic, CortexStepCompileDiagnostic__Output as _exa_cortex_pb_CortexStepCompileDiagnostic__Output } from '../../exa/cortex_pb/CortexStepCompileDiagnostic';

export interface CortexStepCompile {
  'tool'?: (_exa_cortex_pb_CortexStepCompileTool);
  'inputSpec'?: (string);
  'options'?: ({[key: string]: string});
  'target'?: (string);
  'artifactPath'?: (string);
  'artifactIsExecutable'?: (boolean);
  'errors'?: (_exa_cortex_pb_CortexStepCompileDiagnostic)[];
  'warnings'?: (_exa_cortex_pb_CortexStepCompileDiagnostic)[];
}

export interface CortexStepCompile__Output {
  'tool': (_exa_cortex_pb_CortexStepCompileTool__Output);
  'inputSpec': (string);
  'options': ({[key: string]: string});
  'target': (string);
  'artifactPath': (string);
  'artifactIsExecutable': (boolean);
  'errors': (_exa_cortex_pb_CortexStepCompileDiagnostic__Output)[];
  'warnings': (_exa_cortex_pb_CortexStepCompileDiagnostic__Output)[];
}
