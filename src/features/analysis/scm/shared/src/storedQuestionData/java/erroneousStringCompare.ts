export const erroneousStringCompare = {
  javaVersionGreaterOrEqual17: {
    content: () => 'Is `java.util.Objects` package available in your runtime?',
    description: () =>
      '`java.util.Objects` is supported in Java 1.7 or greater.',
    guidance: () => '',
  },
}
