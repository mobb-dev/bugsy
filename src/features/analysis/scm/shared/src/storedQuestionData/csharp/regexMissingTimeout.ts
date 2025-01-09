export const regexMissingTimeout = {
  netVersionGreaterOrEqual7: {
    content: () => 'Is your target framework .NET 7 or greater?',
    description: () => '',
    guidance: () => '',
  },
  timeout: {
    content: () => 'Enter the timeout in milliseconds',
    description: () =>
      'If the limit is reached a RegexTimeoutException is thrown, this could be caused by excessive backtracking',
    guidance: () => '',
  },
  useBacktrackingOption: {
    content: () => 'Use non backtracking option',
    description: () =>
      'If the regex does not need to use backtracking we can disable it using regex options',
    guidance: () => '',
  },
}
