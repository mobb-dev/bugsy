export const hardcodedSecrets = {
  envVarName: {
    content: () => 'Please define an environment variable name',
    description: () =>
      `We will use this environment variable instead of the hardcoded secret`,
    guidance: () => '',
  },
  keepAsDefault: {
    content: () =>
      'Do you want to keep the hardcoded secret in the code for now?',
    description: () =>
      'Answer "yes" if you cannot set the environment variable in all environments right away.',
    guidance: () => '',
  },
}
