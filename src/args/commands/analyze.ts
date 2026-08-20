import fs from 'node:fs'

import chalk from 'chalk'
import type * as Yargs from 'yargs'

import { analyze } from '../../commands'
import { CliError } from '../../utils'
import {
  apiKeyOption,
  autoPrOption,
  baselineCommitOption,
  ciOption,
  commitDirectlyOption,
  commitHashOption,
  createOnePrOption,
  gateOption,
  mobbProjectNameOption,
  organizationIdOptions,
  pollingOption,
  refOption,
  repoOption,
  scanOnlyOption,
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
        'Select the vulnerability report to analyze (Checkmarx, Snyk, Fortify, CodeQL, Sonarqube, Semgrep, Datadog, Black Duck)'
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
    .option('polling', pollingOption)
    .option('baseline-commit', baselineCommitOption)
    .option('scan-only', scanOnlyOption)
    .option('gate', gateOption)
    .example(
      'npx mobbdev@latest analyze -r https://github.com/org/repo --scan-only',
      'scan only — report findings without generating fixes'
    )
    .example(
      'npx mobbdev@latest analyze -r https://github.com/org/repo --ci --api-key <key> --baseline-commit <sha> --gate',
      'PR pipeline: scan the diff and fail the build (exit 2) when the Scan & Gate Policy blocks'
    )
    .example(
      'npx mobbdev@latest analyze -r https://github.com/WebGoat/WebGoat -f <your_vulnerability_report_path>',
      'analyze an existing repository'
    )
    .example(
      'npx mobbdev@latest analyze -r https://github.com/org/repo --baseline-commit <sha>',
      'analyze only findings introduced since <sha> (PR-mode scan)'
    )
    .help()
}

export function validateAnalyzeOptions(argv: AnalyzeOptions) {
  // The gate judges Mobb's own scan against the org's Scan & Gate Policy; a
  // third-party report has no Mobb rule identities to judge (MOBB-3810).
  if (argv.gate && argv.f) {
    throw new CliError(
      '--gate enforces the policy on a Mobb scan and cannot be combined with --scan-file'
    )
  }
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
  try {
    await analyze(args, { skipPrompts: args.yes })
  } catch (err) {
    // yargs treats any handler rejection as a usage failure (help screen, exit
    // 1), which would swallow a non-default exit code before index.ts sees it.
    // The gate verdict (MOBB-3810) exits 2 by contract, so it leaves here
    // directly — same precedent as scan-skill's malicious-verdict exit.
    if (err instanceof CliError && err.exitCode !== 1) {
      console.error(err.message)
      process.exit(err.exitCode)
    }
    throw err
  }
}
