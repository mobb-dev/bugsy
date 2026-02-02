// Original file: exa/codeium_common_pb/codeium_common.proto

export const GpuType = {
  GPU_TYPE_UNSPECIFIED: 'GPU_TYPE_UNSPECIFIED',
  GPU_TYPE_L4: 'GPU_TYPE_L4',
  GPU_TYPE_T4: 'GPU_TYPE_T4',
  GPU_TYPE_A10: 'GPU_TYPE_A10',
  GPU_TYPE_A100: 'GPU_TYPE_A100',
  GPU_TYPE_V100: 'GPU_TYPE_V100',
  GPU_TYPE_A5000: 'GPU_TYPE_A5000',
} as const;

export type GpuType =
  | 'GPU_TYPE_UNSPECIFIED'
  | 0
  | 'GPU_TYPE_L4'
  | 1
  | 'GPU_TYPE_T4'
  | 2
  | 'GPU_TYPE_A10'
  | 3
  | 'GPU_TYPE_A100'
  | 4
  | 'GPU_TYPE_V100'
  | 5
  | 'GPU_TYPE_A5000'
  | 6

export type GpuType__Output = typeof GpuType[keyof typeof GpuType]
