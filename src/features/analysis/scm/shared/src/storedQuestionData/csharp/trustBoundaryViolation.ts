export const trustBoundaryViolation = {
  validationPattern: {
    content: ({ expression }: { expression: string }) =>
      `What is the expected type of \`${expression}\`?`,
    description: () =>
      'We use regex to validate the input to avoid runtime surprises',
    guidance: () => '',
  },
  otherPatternValue: {
    content: () =>
      `Enter the regex pattern you would like to use to validate the input`,
    description: () =>
      'See patterns at [the regex docs](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference)',
    guidance: () => '',
  },
}
