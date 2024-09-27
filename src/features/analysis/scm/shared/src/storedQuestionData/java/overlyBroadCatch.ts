export const overlyBroadCatch = {
  handleRuntimeExceptions: {
    content: () =>
      'Does the code intentionally catch `RuntimeException` instances like `ArithmeticException` or `NullPointerException` in the `catch` block?',
    description: () =>
      'Usually, when catching the general `Exception` class catching of `RuntimeException` is implied and not necessarily the wanted/safe behavior. The application needs to deal with it explicitly in a different way, as the Mobb fix suggests.',
    guidance: () => '',
  },
}
