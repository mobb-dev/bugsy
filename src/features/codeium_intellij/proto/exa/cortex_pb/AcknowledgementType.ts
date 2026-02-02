// Original file: exa/cortex_pb/cortex.proto

export const AcknowledgementType = {
  ACKNOWLEDGEMENT_TYPE_UNSPECIFIED: 'ACKNOWLEDGEMENT_TYPE_UNSPECIFIED',
  ACKNOWLEDGEMENT_TYPE_ACCEPT: 'ACKNOWLEDGEMENT_TYPE_ACCEPT',
  ACKNOWLEDGEMENT_TYPE_REJECT: 'ACKNOWLEDGEMENT_TYPE_REJECT',
} as const;

export type AcknowledgementType =
  | 'ACKNOWLEDGEMENT_TYPE_UNSPECIFIED'
  | 0
  | 'ACKNOWLEDGEMENT_TYPE_ACCEPT'
  | 1
  | 'ACKNOWLEDGEMENT_TYPE_REJECT'
  | 2

export type AcknowledgementType__Output = typeof AcknowledgementType[keyof typeof AcknowledgementType]
