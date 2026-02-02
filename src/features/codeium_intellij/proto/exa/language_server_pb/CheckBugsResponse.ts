// Original file: exa/language_server_pb/language_server.proto

import type { Bug as _exa_bug_checker_pb_Bug, Bug__Output as _exa_bug_checker_pb_Bug__Output } from '../../exa/bug_checker_pb/Bug';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CheckBugsResponse {
  'bugs'?: (_exa_bug_checker_pb_Bug)[];
  'bugCheckId'?: (string);
  'methodUsed'?: (string);
  'modelUsed'?: (string);
  'playgrounds'?: (string);
  'modelId'?: (_exa_codeium_common_pb_Model);
  'agentVersion'?: (string);
}

export interface CheckBugsResponse__Output {
  'bugs': (_exa_bug_checker_pb_Bug__Output)[];
  'bugCheckId': (string);
  'methodUsed': (string);
  'modelUsed': (string);
  'playgrounds': (string);
  'modelId': (_exa_codeium_common_pb_Model__Output);
  'agentVersion': (string);
}
