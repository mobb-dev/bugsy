// Original file: exa/codeium_common_pb/codeium_common.proto

export const TrajectoryType = {
  TRAJECTORY_TYPE_UNSPECIFIED: 'TRAJECTORY_TYPE_UNSPECIFIED',
  TRAJECTORY_TYPE_CASCADE: 'TRAJECTORY_TYPE_CASCADE',
  TRAJECTORY_TYPE_MAINLINE_TRAJECTORY: 'TRAJECTORY_TYPE_MAINLINE_TRAJECTORY',
} as const;

export type TrajectoryType =
  | 'TRAJECTORY_TYPE_UNSPECIFIED'
  | 0
  | 'TRAJECTORY_TYPE_CASCADE'
  | 1
  | 'TRAJECTORY_TYPE_MAINLINE_TRAJECTORY'
  | 2

export type TrajectoryType__Output = typeof TrajectoryType[keyof typeof TrajectoryType]
