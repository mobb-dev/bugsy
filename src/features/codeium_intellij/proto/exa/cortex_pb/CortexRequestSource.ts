// Original file: exa/cortex_pb/cortex.proto

export const CortexRequestSource = {
  CORTEX_REQUEST_SOURCE_UNSPECIFIED: 'CORTEX_REQUEST_SOURCE_UNSPECIFIED',
  CORTEX_REQUEST_SOURCE_CASCADE: 'CORTEX_REQUEST_SOURCE_CASCADE',
  CORTEX_REQUEST_SOURCE_USER_IMPLICIT: 'CORTEX_REQUEST_SOURCE_USER_IMPLICIT',
} as const;

export type CortexRequestSource =
  | 'CORTEX_REQUEST_SOURCE_UNSPECIFIED'
  | 0
  | 'CORTEX_REQUEST_SOURCE_CASCADE'
  | 1
  | 'CORTEX_REQUEST_SOURCE_USER_IMPLICIT'
  | 2

export type CortexRequestSource__Output = typeof CortexRequestSource[keyof typeof CortexRequestSource]
