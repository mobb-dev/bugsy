// Original file: exa/auto_cascade_common_pb/auto_cascade_common.proto

import type { GithubCICheckStatus as _exa_auto_cascade_common_pb_GithubCICheckStatus, GithubCICheckStatus__Output as _exa_auto_cascade_common_pb_GithubCICheckStatus__Output } from '../../exa/auto_cascade_common_pb/GithubCICheckStatus';
import type { GithubPullRequestBranchStatus as _exa_auto_cascade_common_pb_GithubPullRequestBranchStatus, GithubPullRequestBranchStatus__Output as _exa_auto_cascade_common_pb_GithubPullRequestBranchStatus__Output } from '../../exa/auto_cascade_common_pb/GithubPullRequestBranchStatus';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface GithubPullRequestInfo {
  'url'?: (string);
  'owner'?: (string);
  'repo'?: (string);
  'title'?: (string);
  'number'?: (string);
  'ciStatus'?: (_exa_auto_cascade_common_pb_GithubCICheckStatus);
  'branchStatus'?: (_exa_auto_cascade_common_pb_GithubPullRequestBranchStatus);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
}

export interface GithubPullRequestInfo__Output {
  'url': (string);
  'owner': (string);
  'repo': (string);
  'title': (string);
  'number': (string);
  'ciStatus': (_exa_auto_cascade_common_pb_GithubCICheckStatus__Output);
  'branchStatus': (_exa_auto_cascade_common_pb_GithubPullRequestBranchStatus__Output);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
}
