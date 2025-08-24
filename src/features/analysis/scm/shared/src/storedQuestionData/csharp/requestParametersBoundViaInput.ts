export const requestParametersBoundViaInput = {
  fieldsToCopy: {
    content: () =>
      'Please list all the fields you expect as input from the user. Use comma separated list.',
    description: () =>
      `This is meant to avoid mass assignment vulnerabilities, where the user would enter an inner unexpected field`,
    guidance: () => '',
  },
}
