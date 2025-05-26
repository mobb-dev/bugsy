import fs from 'node:fs'

import { analyze } from '@mobb/bugsy/commands'
import { CliError } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  autoPrOption,
  ciOption,
  commitDirectlyOption,
  commitHashOption,
  createOnePrOption,
  mobbProjectNameOption,
  organizationIdOptions,
  refOption,
  repoOption,
  yesOption,
} from '../options'
import { AnalyzeOptions, BaseAnalyzeOptions } from '../types'
import {
  validateOrganizationId,
  validateReportFileFormat,
  validateRepoUrl,
} from '../validation'

export function analyzeBuilder(
  yargs: Yargs.Argv<unknown>
): Yargs.Argv<BaseAnalyzeOptions> {
  return yargs
    .option('f', {
      alias: 'scan-file',
      type: 'string',
      describe: chalk.bold(
        'Select the vulnerability report to analyze (Checkmarx, Snyk, Fortify, CodeQL, Sonarqube, Semgrep, Datadog)'
      ),
    })
    .option('repo', repoOption)
    .option('p', {
      alias: 'src-path',
      describe: chalk.bold(
        'Path to the repository folder with the source code; alternatively, you can specify the Fortify FPR file to extract source code out of it'
      ),
      type: 'string',
    })
    .option('ref', refOption)
    .option('ch', {
      alias: 'commit-hash',
      describe: chalk.bold('Hash of the commit'),
      type: 'string',
    })
    .option('mobb-project-name', mobbProjectNameOption)
    .option('y', yesOption)
    .option('ci', ciOption)
    .option('org', organizationIdOptions)
    .option('api-key', apiKeyOption)
    .option('commit-hash', commitHashOption)
    .option('auto-pr', autoPrOption)
    .option('create-one-pr', createOnePrOption)
    .option('commit-directly', commitDirectlyOption)
    .option('pull-request', {
      alias: ['pr', 'pr-number', 'pr-id'],
      describe: chalk.bold('Number of the pull request'),
      type: 'number',
      demandOption: false,
    })
    .example(
      'npx mobbdev@latest analyze -r https://github.com/WebGoat/WebGoat -f <your_vulnerability_report_path>',
      'analyze an existing repository'
    )
    .help()
}

function validateAnalyzeOptions(argv: AnalyzeOptions) {
  if (argv.f && !fs.existsSync(argv.f)) {
    throw new CliError(`\nCan't access ${chalk.bold(argv.f)}`)
  }
  validateOrganizationId(argv.organizationId)
  if (!argv.srcPath && !argv.repo) {
    throw new CliError('You must supply either --src-path or --repo')
  }
  if (!argv.srcPath && argv.repo) {
    validateRepoUrl(argv)
  }

  if (argv.ci && !argv.apiKey) {
    throw new CliError('--ci flag requires --api-key to be provided as well')
  }
  if (argv.commitDirectly && !argv['auto-pr']) {
    throw new CliError(
      '--commit-directly flag requires --auto-pr to be provided as well'
    )
  }
  if (argv['create-one-pr'] && !argv['auto-pr']) {
    throw new CliError(
      '--create-one-pr flag requires --auto-pr to be provided as well'
    )
  }
  if (argv['create-one-pr'] && argv.commitDirectly) {
    throw new CliError(
      '--create-one-pr and --commit-directly cannot be provided at the same time'
    )
  }
  if (argv.pullRequest && !argv.commitDirectly) {
    throw new CliError(
      '--pull-request flag requires --commit-directly to be provided as well'
    )
  }
  if (argv.f) {
    validateReportFileFormat(argv.f)
  }
}

export async function analyzeHandler(args: AnalyzeOptions) {
  validateAnalyzeOptions(args)
  await analyze(args, { skipPrompts: args.yes })
}
