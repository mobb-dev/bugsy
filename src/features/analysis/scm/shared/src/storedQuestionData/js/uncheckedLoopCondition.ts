export const uncheckedLoopCondition = {
  loopLimit: {
    content: () => 'Please define a maximum loop limit',
    description: () =>
      `Setting this number to a reasonable value will prevent the vulnerability`,
    guidance: () => '',
  },
  varName: {
    content: () => 'Please define a variable name',
    description: () =>
      `We need to define a variable to be used as a counter to limit the loop`,
    guidance: () => '',
  },
}
