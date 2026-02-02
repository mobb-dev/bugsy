// Original file: exa/cortex_pb/cortex.proto

export const TrajectorySearchIdType = {
  TRAJECTORY_SEARCH_ID_TYPE_UNSPECIFIED: 'TRAJECTORY_SEARCH_ID_TYPE_UNSPECIFIED',
  TRAJECTORY_SEARCH_ID_TYPE_CASCADE_ID: 'TRAJECTORY_SEARCH_ID_TYPE_CASCADE_ID',
  TRAJECTORY_SEARCH_ID_TYPE_MAINLINE: 'TRAJECTORY_SEARCH_ID_TYPE_MAINLINE',
} as const;

export type TrajectorySearchIdType =
  | 'TRAJECTORY_SEARCH_ID_TYPE_UNSPECIFIED'
  | 0
  | 'TRAJECTORY_SEARCH_ID_TYPE_CASCADE_ID'
  | 1
  | 'TRAJECTORY_SEARCH_ID_TYPE_MAINLINE'
  | 2

export type TrajectorySearchIdType__Output = typeof TrajectorySearchIdType[keyof typeof TrajectorySearchIdType]
