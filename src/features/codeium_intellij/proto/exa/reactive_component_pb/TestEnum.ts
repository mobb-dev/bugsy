// Original file: exa/reactive_component_pb/reactive_component.proto

export const TestEnum = {
  TEST_ENUM_UNSPECIFIED: 'TEST_ENUM_UNSPECIFIED',
  TEST_ENUM_ONE: 'TEST_ENUM_ONE',
  TEST_ENUM_TWO: 'TEST_ENUM_TWO',
} as const;

export type TestEnum =
  | 'TEST_ENUM_UNSPECIFIED'
  | 0
  | 'TEST_ENUM_ONE'
  | 1
  | 'TEST_ENUM_TWO'
  | 2

export type TestEnum__Output = typeof TestEnum[keyof typeof TestEnum]
