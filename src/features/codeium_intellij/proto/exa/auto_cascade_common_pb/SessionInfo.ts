// Original file: exa/auto_cascade_common_pb/auto_cascade_common.proto

import type { CascadeRunStatus as _exa_cortex_pb_CascadeRunStatus, CascadeRunStatus__Output as _exa_cortex_pb_CascadeRunStatus__Output } from '../../exa/cortex_pb/CascadeRunStatus';
import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { GitRepoInfo as _exa_auto_cascade_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_auto_cascade_common_pb_GitRepoInfo__Output } from '../../exa/auto_cascade_common_pb/GitRepoInfo';

export interface SessionInfo {
  'sessionId'?: (string);
  'explanation'?: (string);
  'sshUrl'?: (string);
  'status'?: (_exa_cortex_pb_CascadeRunStatus);
  'summary'?: (string);
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'sessionKey'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'gitRepos'?: (_exa_auto_cascade_common_pb_GitRepoInfo)[];
  'updatedAt'?: (_google_protobuf_Timestamp | null);
}

export interface SessionInfo__Output {
  'sessionId': (string);
  'explanation': (string);
  'sshUrl': (string);
  'status': (_exa_cortex_pb_CascadeRunStatus__Output);
  'summary': (string);
  'trajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'sessionKey': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'gitRepos': (_exa_auto_cascade_common_pb_GitRepoInfo__Output)[];
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
}
