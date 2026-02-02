// Original file: exa/cortex_pb/cortex.proto

export const TrajectoryShareStatus = {
  TRAJECTORY_SHARE_STATUS_UNSPECIFIED: 'TRAJECTORY_SHARE_STATUS_UNSPECIFIED',
  TRAJECTORY_SHARE_STATUS_TEAM: 'TRAJECTORY_SHARE_STATUS_TEAM',
} as const;

export type TrajectoryShareStatus =
  | 'TRAJECTORY_SHARE_STATUS_UNSPECIFIED'
  | 0
  | 'TRAJECTORY_SHARE_STATUS_TEAM'
  | 1

export type TrajectoryShareStatus__Output = typeof TrajectoryShareStatus[keyof typeof TrajectoryShareStatus]
