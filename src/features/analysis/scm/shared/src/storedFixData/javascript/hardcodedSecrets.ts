import { Question } from '../../types'

export const hardcodedSecrets = {
  guidance: ({ questions }: { questions: Array<Question> }) => {
    const envVarName =
      questions.find((q) => q.key === 'env_var_name')?.value || 'the'
    const keepAsDefault = questions.find(
      (q) => q.key === 'keep_as_default'
    )?.value

    let additionalText = ''

    if (keepAsDefault === 'yes') {
      additionalText = '\n1. Remove the hardcoded secret from the code.\n'
    }

    return `Please follow the steps in this specific order:

1. Change the secret that was hardcoded. It is essential because even when you commit the changes, the secret will remain in the git history.${additionalText}
1. Update the configuration of all your application environments and CI/CD pipelines to set \`${envVarName}\` environment variable.
1. Commit the changes.`
  },
}
