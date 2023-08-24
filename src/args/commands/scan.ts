import { scan } from '@mobb/bugsy/commands'
import { SCANNERS } from '@mobb/bugsy/constants'
import { CliError } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  ciOption,
  refOption,
  repoOption,
  yesOption,
} from '../options'
import { BaseScanOptions, ScanOptions } from '../types'
import { validateRepoUrl } from '../validation'

export function scanBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseScanOptions> {
  return (
    args
      // handles scanner case insensitive
      .coerce('scanner', (arg) => arg.toLowerCase())
      .option('repo', repoOption)
      .option('ref', refOption)
      .option('s', {
        alias: 'scanner',
        choices: Object.values(SCANNERS),
        describe: chalk.bold('Select the scanner to use'),
      })
      .option('y', yesOption)
      .option('ci', ciOption)
      .option('api-key', apiKeyOption)
      .example(
        '$0 scan -r https://github.com/WebGoat/WebGoat',
        'Scan an existing repository'
      )
      .help()
  )
}

export function validateScanOptions(argv: ScanOptions) {
  validateRepoUrl(argv)
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
