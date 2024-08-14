import chalk from 'chalk'

import { PROJECT_DEFAULT_NAME, SCANNERS } from '../constants'

export const repoOption = {
  alias: 'r',
  demandOption: true,
  type: 'string',
  describe: chalk.bold('Github / GitLab / Azure DevOps repository URL'),
} as const
export const projectNameOption = {
  type: 'string',
  describe: chalk.bold('Checkmarx project name (when scanning with Checkmarx)'),
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

export const scannerOptions = {
  alias: 's',
  choices: Object.values(SCANNERS),
  describe: chalk.bold('Select the scanner to use'),
} as const

export const mobbProjectNameOption = {
  type: 'string',
  describe: chalk.bold('Mobb project name'),
  default: PROJECT_DEFAULT_NAME,
} as const

export const ciOption = {
  describe: chalk.bold(
    'Run in CI mode, prompts and browser will not be opened'
  ),
  type: 'boolean',
  default: false,
} as const

export const apiKeyOption = {
  type: 'string',
  describe: chalk.bold('Mobb authentication api-key'),
} as const

export const commitHashOption = {
  alias: 'ch',
  describe: chalk.bold('Hash of the commit'),
  type: 'string',
} as const

export const scmTypeOption = {
  demandOption: true,
  describe: chalk.bold('SCM type (GitHub, GitLab, Ado, Bitbucket)'),
  type: 'string',
} as const

export const urlOption = {
  describe: chalk.bold(
    'URL of the repository (used in GitHub, GitLab, Azure DevOps, Bitbucket)'
  ),
  type: 'string',
  demandOption: true,
} as const

export const scmOrgOption = {
  describe: chalk.bold('Organization name in SCM (used in Azure DevOps)'),
  type: 'string',
} as const

export const scmRefreshTokenOption = {
  describe: chalk.bold('SCM refresh token (used in GitLab)'),
  type: 'string',
} as const

export const scmTokenOption = {
  describe: chalk.bold('SCM API token'),
  type: 'string',
  demandOption: true,
} as const
