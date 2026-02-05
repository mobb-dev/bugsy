import chalkAnimation from 'chalk-animation'

import {
  AddScmTokenOptions,
  AnalyzeOptions,
  ReviewOptions,
  ScanOptions,
} from '../args'
import { errorMessages, mobbAscii, SCANNERS } from '../constants'
import { runAnalysis } from '../features/analysis'
import { choseScanner } from '../features/analysis/prompts'
import { validateCheckmarxInstallation } from '../features/analysis/scanners/checkmarx'
import { CliError, sleep } from '../utils'
import { getAuthenticatedGQLClient } from './handleMobbLogin'

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
    polling,
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
      polling,
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
    createOnePr,
    commitDirectly,
    pullRequest,
    polling,
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
      commitDirectly,
      pullRequest,
      createOnePr,
      polling,
    },
    { skipPrompts }
  )
}
export type CommandOptions = {
  skipPrompts?: boolean
}

export async function addScmToken(addScmTokenOptions: AddScmTokenOptions) {
  const { apiKey, token, organization, scmType, url, refreshToken, ci } =
    addScmTokenOptions
  const gqlClient = await getAuthenticatedGQLClient({
    inputApiKey: apiKey,
    isSkipPrompts: ci,
  })
  if (!scmType) {
    throw new CliError(errorMessages.invalidScmType)
  }
  const resp = await gqlClient.updateScmToken({
    scmType,
    url,
    token,
    org: organization,
    refreshToken,
  })
  if (resp.updateScmToken?.__typename === 'RepoUnreachableError') {
    throw new CliError(
      'Mobb could not reach the repository. Please try again. If Mobb is connected through a broker, please make sure the broker is connected.'
    )
  } else if (resp.updateScmToken?.__typename === 'BadScmCredentials') {
    throw new CliError('Invalid SCM credentials. Please try again.')
  } else if (
    resp.updateScmToken?.__typename === 'ScmAccessTokenUpdateSuccess'
  ) {
    console.log('Token added successfully')
  } else {
    throw new CliError('Unexpected error, failed to add token')
  }
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
