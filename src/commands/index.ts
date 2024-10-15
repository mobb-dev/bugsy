import fs from 'node:fs'
import path from 'node:path'

import {
  AddScmTokenOptions,
  AnalyzeOptions,
  ReviewOptions,
  ScanOptions,
} from '@mobb/bugsy/args'
import { errorMessages, mobbAscii, SCANNERS } from '@mobb/bugsy/constants'
import { runAnalysis } from '@mobb/bugsy/features/analysis/index'
import { choseScanner } from '@mobb/bugsy/features/analysis/prompts'
import { validateCheckmarxInstallation } from '@mobb/bugsy/features/analysis/scanners/checkmarx'
import { CliError, getDirName, sleep } from '@mobb/bugsy/utils'
import chalkAnimation from 'chalk-animation'
import Configstore from 'configstore'

import { GQLClient } from '../features/analysis/graphql'

export async function review(
  params: ReviewOptions,
  { skipPrompts = true }: CommandOptions = {}
) {
  const {
    repo,
    f: scanFile,
    ref,
    apiKey,
    commitHash,
    mobbProjectName,
    pullRequest,
    githubToken,
    scanner,
    srcPath,
  } = params
  await runAnalysis(
    {
      repo,
      scanFile,
      ref,
      apiKey,
      ci: true,
      commitHash,
      experimentalEnabled: false,
      mobbProjectName,
      pullRequest,
      githubToken,
      scanner,
      command: 'review',
      srcPath,
    },
    { skipPrompts }
  )
}

export async function analyze(
  {
    repo,
    f: scanFile,
    ref,
    apiKey,
    ci,
    commitHash,
    srcPath,
    mobbProjectName,
    organizationId,
    autoPr,
  }: AnalyzeOptions,
  { skipPrompts = false }: CommandOptions = {}
) {
  !ci && (await showWelcomeMessage(skipPrompts))

  await runAnalysis(
    {
      repo,
      scanFile,
      ref,
      apiKey,
      ci,
      commitHash,
      mobbProjectName,
      srcPath,
      organizationId,
      command: 'analyze',
      autoPr,
    },
    { skipPrompts }
  )
}
export type CommandOptions = {
  skipPrompts?: boolean
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(getDirName(), '../package.json'), 'utf8')
)

const config = new Configstore(packageJson.name, { apiToken: '' })

export async function addScmToken(addScmTokenOptions: AddScmTokenOptions) {
  const { apiKey, token, organization, scmType, url, refreshToken } =
    addScmTokenOptions
  const gqlClient = new GQLClient({
    apiKey: apiKey || config.get('apiToken'),
    type: 'apiKey',
  })
  if (!scmType) {
    throw new CliError(errorMessages.invalidScmType)
  }
  await gqlClient.updateScmToken({
    scmType,
    url,
    token,
    org: organization,
    refreshToken,
  })
}

export async function scan(
  scanOptions: ScanOptions,
  { skipPrompts = false }: CommandOptions = {}
) {
  const { scanner, ci } = scanOptions

  !ci && (await showWelcomeMessage(skipPrompts))
  const selectedScanner = scanner || (await choseScanner())
  if (
    selectedScanner !== SCANNERS.Checkmarx &&
    selectedScanner !== SCANNERS.Snyk
  ) {
    // we can't use includes when using 'as const', weird
    throw new CliError(
      'Vulnerability scanning via Bugsy is available only with Snyk and Checkmarx at the moment. Additional scanners will follow soon.'
    )
  }
  selectedScanner === SCANNERS.Checkmarx && validateCheckmarxInstallation()
  if (selectedScanner === SCANNERS.Checkmarx && !scanOptions.cxProjectName) {
    throw new CliError(errorMessages.missingCxProjectName)
  }

  await runAnalysis(
    { ...scanOptions, scanner: selectedScanner, command: 'scan' },
    { skipPrompts }
  )
}
async function showWelcomeMessage(skipPrompts = false) {
  console.log(mobbAscii)
  const welcome = chalkAnimation.rainbow('\n\t\t\tWelcome to Bugsy\n')
  skipPrompts ? await sleep(100) : await sleep(2000)
  welcome.stop()
}
