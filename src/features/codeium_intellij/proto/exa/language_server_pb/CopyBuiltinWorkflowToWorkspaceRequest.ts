// Original file: exa/language_server_pb/language_server.proto

import type { WorkflowSpec as _exa_cortex_pb_WorkflowSpec, WorkflowSpec__Output as _exa_cortex_pb_WorkflowSpec__Output } from '../../exa/cortex_pb/WorkflowSpec';
import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface CopyBuiltinWorkflowToWorkspaceRequest {
  'workflow'?: (_exa_cortex_pb_WorkflowSpec | null);
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
}

export interface CopyBuiltinWorkflowToWorkspaceRequest__Output {
  'workflow': (_exa_cortex_pb_WorkflowSpec__Output | null);
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
}
