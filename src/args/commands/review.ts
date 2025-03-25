import fs from 'node:fs'

import { review } from '@mobb/bugsy/commands'
import { CliError } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  commitHashOption,
  mobbProjectNameOption,
  refOption,
  repoOption,
  scannerOptions,
} from '../options'
import { BaseReviewOptions, ReviewOptions } from '../types'
import { validateReportFileFormat, validateRepoUrl } from '../validation'

export function reviewBuilder(
  yargs: Yargs.Argv<unknown>
): Yargs.Argv<BaseReviewOptions> {
  return yargs
    .option('f', {
      alias: 'scan-file',
      demandOption: true,
      type: 'string',
      describe: chalk.bold(
        'Select the vulnerability report to analyze (Checkmarx, Snyk, Fortify, CodeQL, Sonarqube, Semgrep)'
      ),
    })
    .option('repo', { ...repoOption, demandOption: true })
    .option('scanner', { ...scannerOptions, demandOption: true })
    .option('ref', { ...refOption, demandOption: true })
    .option('ch', {
      alias: 'commit-hash',
      describe: chalk.bold('Hash of the commit'),
      type: 'string',
      demandOption: true,
    })
    .option('mobb-project-name', mobbProjectNameOption)
    .option('api-key', { ...apiKeyOption, demandOption: true })
    .option('commit-hash', { ...commitHashOption, demandOption: true })
    .option('github-token', {
      describe: chalk.bold('Github action token'),
      type: 'string',
      demandOption: true,
    })

    .option('pull-request', {
      alias: ['pr', 'pr-number', 'pr-id'],
      describe: chalk.bold('Number of the pull request'),
      type: 'number',
      demandOption: true,
    })
    .option('p', {
      alias: 'src-path',
      describe: chalk.bold(
        'Path to the repository folder with the source code'
      ),
      type: 'string',
      demandOption: false,
    })
    .example(
      'npx mobbdev@latest review -r https://github.com/WebGoat/WebGoat -f <your_vulnerability_report_path>  --ch <pr_last_commit>   --pr <pr_number> --ref <pr_branch_name>  --api-key <api_key> --src-path <your_repo_path>',
      'add fixes to your pr'
    )
    .help()
}

function validateReviewOptions(argv: ReviewOptions) {
  if (!fs.existsSync(argv.f)) {
    throw new CliError(`\nCan't access ${chalk.bold(argv.f)}`)
  }
  validateRepoUrl(argv)

  validateReportFileFormat(argv.f)
}

export async function reviewHandler(args: ReviewOptions) {
  validateReviewOptions(args)
  await review(args, { skipPrompts: true })
}
