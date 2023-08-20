import chalk from 'chalk'

export const repoOption = {
  alias: 'r',
  demandOption: true,
  type: 'string',
  describe: chalk.bold('Github repository URL'),
} as const

export const yesOption = {
  alias: 'yes',
  type: 'boolean',
  describe: chalk.bold('Skip prompts and use default values'),
} as const

export const refOption = {
  describe: chalk.bold('reference of the repository (branch, tag, commit)'),
  type: 'string',
  demandOption: false,
} as const

export const ciOption = {
  describe: chalk.bold(
    'Run in CI mode, prompts and browser will not be opened'
  ),
  type: 'boolean',
  default: false,
} as const
