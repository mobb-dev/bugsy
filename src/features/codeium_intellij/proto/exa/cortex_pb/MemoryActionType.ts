// Original file: exa/cortex_pb/cortex.proto

export const MemoryActionType = {
  MEMORY_ACTION_TYPE_UNSPECIFIED: 'MEMORY_ACTION_TYPE_UNSPECIFIED',
  MEMORY_ACTION_TYPE_CREATE: 'MEMORY_ACTION_TYPE_CREATE',
  MEMORY_ACTION_TYPE_UPDATE: 'MEMORY_ACTION_TYPE_UPDATE',
  MEMORY_ACTION_TYPE_DELETE: 'MEMORY_ACTION_TYPE_DELETE',
} as const;

export type MemoryActionType =
  | 'MEMORY_ACTION_TYPE_UNSPECIFIED'
  | 0
  | 'MEMORY_ACTION_TYPE_CREATE'
  | 1
  | 'MEMORY_ACTION_TYPE_UPDATE'
  | 2
  | 'MEMORY_ACTION_TYPE_DELETE'
  | 3

export type MemoryActionType__Output = typeof MemoryActionType[keyof typeof MemoryActionType]
