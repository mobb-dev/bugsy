// Original file: exa/language_server_pb/language_server.proto

import type { ActionResultEdit as _exa_cortex_pb_ActionResultEdit, ActionResultEdit__Output as _exa_cortex_pb_ActionResultEdit__Output } from '../../exa/cortex_pb/ActionResultEdit';
import type { Long } from '@grpc/proto-loader';

export interface WorkspaceEditState {
  'repoRoot'?: (string);
  'numAdditions'?: (number | string | Long);
  'numDeletions'?: (number | string | Long);
  'edits'?: (_exa_cortex_pb_ActionResultEdit)[];
}

export interface WorkspaceEditState__Output {
  'repoRoot': (string);
  'numAdditions': (string);
  'numDeletions': (string);
  'edits': (_exa_cortex_pb_ActionResultEdit__Output)[];
}
