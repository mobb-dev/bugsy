// Original file: exa/language_server_pb/language_server.proto

import type { CascadeTrajectorySummary as _exa_cortex_pb_CascadeTrajectorySummary, CascadeTrajectorySummary__Output as _exa_cortex_pb_CascadeTrajectorySummary__Output } from '../../exa/cortex_pb/CascadeTrajectorySummary';
import type { UserInputWithMetadata as _exa_language_server_pb_UserInputWithMetadata, UserInputWithMetadata__Output as _exa_language_server_pb_UserInputWithMetadata__Output } from '../../exa/language_server_pb/UserInputWithMetadata';

export interface GetAllCascadeTrajectoriesResponse {
  'trajectorySummaries'?: ({[key: string]: _exa_cortex_pb_CascadeTrajectorySummary});
  'userInputs'?: (_exa_language_server_pb_UserInputWithMetadata)[];
}

export interface GetAllCascadeTrajectoriesResponse__Output {
  'trajectorySummaries': ({[key: string]: _exa_cortex_pb_CascadeTrajectorySummary__Output});
  'userInputs': (_exa_language_server_pb_UserInputWithMetadata__Output)[];
}
