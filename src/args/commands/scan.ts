import type * as Yargs from 'yargs'

import { scan } from '../../commands'
import { errorMessages, SCANNERS } from '../../constants'
import { validateCheckmarxInstallation } from '../../features/analysis/scanners/checkmarx'
import { CliError } from '../../utils'
import {
  apiKeyOption,
  autoPrOption,
  ciOption,
  mobbProjectNameOption,
  organizationIdOptions,
  projectNameOption,
  refOption,
  repoOption,
  scannerOptions,
  yesOption,
} from '../options'
import { BaseScanOptions, ScanOptions } from '../types'
import { validateOrganizationId, validateRepoUrl } from '../validation'

export function scanBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseScanOptions> {
  return (
    args
      // handles scanner case insensitive
      .coerce('scanner', (arg) => arg.toLowerCase())

      .option('repo', repoOption)
      .option('ref', refOption)
      .option('scanner', scannerOptions)
      .option('org', organizationIdOptions)
      .option('mobb-project-name', mobbProjectNameOption)
      .option('y', yesOption)
      .option('ci', ciOption)
      .option('api-key', apiKeyOption)
      .option('cx-project-name', projectNameOption)
      .option('auto-pr', autoPrOption)
      .example(
        'npx mobbdev@latest scan -r https://github.com/WebGoat/WebGoat',
        'Scan an existing repository'
      )
      .help()
  )
}

export function validateScanOptions(argv: ScanOptions) {
  validateRepoUrl(argv)
  validateOrganizationId(argv.organizationId)
  argv.scanner === SCANNERS.Checkmarx && validateCheckmarxInstallation()
  if (argv.scanner === SCANNERS.Checkmarx && !argv.cxProjectName) {
    throw new CliError(errorMessages.missingCxProjectName)
  }
  if (argv.ci && !argv.apiKey) {
    throw new CliError(
      '\nError: --ci flag requires --api-key to be provided as well'
    )
  }
}

export async function scanHandler(args: ScanOptions) {
  validateScanOptions(args)
  await scan(args, { skipPrompts: args.yes })
}
