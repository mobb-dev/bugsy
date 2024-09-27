export const missingCheckAgainstNull = {
  preferredAction: {
    content: ({ tainted_expression }: { tainted_expression: string }) =>
      `What is expected behavior if \`${tainted_expression}\` returns null?`,
    description: () => '',
    guidance: () => '',
  },
  javaVersionGreaterOrEqual17: {
    content: () => 'Is `java.util.Objects` package available in your runtime?',
    description: () =>
      '`java.util.Objects` is supported in Java 1.7 or greater.',
    guidance: () => '',
  },
}
