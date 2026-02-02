// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

export const ForwardStatus = {
  FORWARD_STATUS_UNSPECIFIED: 'FORWARD_STATUS_UNSPECIFIED',
  FORWARD_STATUS_FAILURE: 'FORWARD_STATUS_FAILURE',
  FORWARD_STATUS_SAVED: 'FORWARD_STATUS_SAVED',
  FORWARD_STATUS_SUCCESS: 'FORWARD_STATUS_SUCCESS',
} as const;

export type ForwardStatus =
  | 'FORWARD_STATUS_UNSPECIFIED'
  | 0
  | 'FORWARD_STATUS_FAILURE'
  | 1
  | 'FORWARD_STATUS_SAVED'
  | 2
  | 'FORWARD_STATUS_SUCCESS'
  | 3

export type ForwardStatus__Output = typeof ForwardStatus[keyof typeof ForwardStatus]
