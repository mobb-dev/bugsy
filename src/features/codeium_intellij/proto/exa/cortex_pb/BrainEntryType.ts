// Original file: exa/cortex_pb/cortex.proto

export const BrainEntryType = {
  BRAIN_ENTRY_TYPE_UNSPECIFIED: 'BRAIN_ENTRY_TYPE_UNSPECIFIED',
  BRAIN_ENTRY_TYPE_PLAN: 'BRAIN_ENTRY_TYPE_PLAN',
  BRAIN_ENTRY_TYPE_TASK: 'BRAIN_ENTRY_TYPE_TASK',
} as const;

export type BrainEntryType =
  | 'BRAIN_ENTRY_TYPE_UNSPECIFIED'
  | 0
  | 'BRAIN_ENTRY_TYPE_PLAN'
  | 1
  | 'BRAIN_ENTRY_TYPE_TASK'
  | 2

export type BrainEntryType__Output = typeof BrainEntryType[keyof typeof BrainEntryType]
