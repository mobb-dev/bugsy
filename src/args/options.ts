import chalk from 'chalk'

import { PROJECT_DEFAULT_NAME, SCANNERS } from '../constants'
import {
  ConvertToSarifInputFileFormat,
  ScmType,
} from '../features/analysis/scm'

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
  describe: chalk.bold('Reference of the repository (branch, tag, commit)'),
  type: 'string',
  demandOption: false,
} as const
export const organizationIdOptions = {
  describe: chalk.bold('Organization id'),
  alias: 'organization-id',
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

export const autoPrOption = {
  describe: chalk.bold('Enable automatic pull requests for new fixes'),
  type: 'boolean',
  default: false,
} as const

export const createOnePrOption = {
  describe: chalk.bold(
    'Create a single unified PR for all fixes (requires --auto-pr)'
  ),
  type: 'boolean',
  default: false,
} as const

export const commitDirectlyOption = {
  describe: chalk.bold(
    'Commit directly to the scanned branch instead of creating a pull request'
  ),
  type: 'boolean',
  default: false,
} as const

export const scmTypeOption = {
  demandOption: true,
  describe: chalk.bold('SCM type'),
  choices: Object.values(ScmType),
} as const

export const urlOption = {
  describe: chalk.bold(
    `URL of the repository (used in ${Object.values(ScmType).join(', ')})`
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

export const convertToSarifInputFilePathOption = {
  demandOption: true,
  describe: chalk.bold('Original SAST report file path'),
  type: 'string',
} as const

export const convertToSarifOutputFilePathOption = {
  demandOption: true,
  describe: chalk.bold('Output SARIF report file path'),
  type: 'string',
} as const

export const convertToSarifInputFileFormatOption = {
  demandOption: true,
  choices: Object.values(ConvertToSarifInputFileFormat),
  describe: chalk.bold('SAST report file type'),
} as const

export const convertToSarifCodePathPatternsOption = {
  demandOption: false,
  describe: chalk.bold(
    'Glob-like patterns. Any code node with this pattern makes the issue be included.'
  ),
  type: 'string',
  array: true,
} as const
