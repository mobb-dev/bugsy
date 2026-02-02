// Original file: exa/cortex_pb/cortex.proto

export const TaskStatus = {
  TASK_STATUS_UNSPECIFIED: 'TASK_STATUS_UNSPECIFIED',
  TASK_STATUS_TODO: 'TASK_STATUS_TODO',
  TASK_STATUS_IN_PROGRESS: 'TASK_STATUS_IN_PROGRESS',
  TASK_STATUS_DONE: 'TASK_STATUS_DONE',
} as const;

export type TaskStatus =
  | 'TASK_STATUS_UNSPECIFIED'
  | 0
  | 'TASK_STATUS_TODO'
  | 1
  | 'TASK_STATUS_IN_PROGRESS'
  | 2
  | 'TASK_STATUS_DONE'
  | 3

export type TaskStatus__Output = typeof TaskStatus[keyof typeof TaskStatus]
