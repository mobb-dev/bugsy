import crypto from 'node:crypto'
import os from 'node:os'

import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
import Configstore from 'configstore'
import Debug from 'debug'
import open from 'open'

import {
  AddScmTokenOptions,
  AnalyzeOptions,
  ReviewOptions,
  ScanOptions,
} from '../args'
import { errorMessages, mobbAscii, SCANNERS, WEB_APP_URL } from '../constants'
import { runAnalysis } from '../features/analysis'
import { GQLClient } from '../features/analysis/graphql'
import { choseScanner } from '../features/analysis/prompts'
import { validateCheckmarxInstallation } from '../features/analysis/scanners/checkmarx'
import { CliError, keypress, packageJson, sleep, Spinner } from '../utils'

const debug = Debug('mobbdev:commands')

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
    createOnePr,
    commitDirectly,
    pullRequest,
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
    },
    { skipPrompts }
  )
}
export type CommandOptions = {
  skipPrompts?: boolean
}

const config = new Configstore(packageJson.name, { apiToken: '' })

export async function addScmToken(addScmTokenOptions: AddScmTokenOptions) {
  const { apiKey, token, organization, scmType, url, refreshToken, ci } =
    addScmTokenOptions
  let gqlClient = new GQLClient({
    apiKey: apiKey ?? config.get('apiToken') ?? '',
    type: 'apiKey',
  })

  gqlClient = await handleMobbLogin({
    inGqlClient: gqlClient,
    skipPrompts: ci,
    apiKey,
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

export const LOGIN_MAX_WAIT = 10 * 60 * 1000 // 10 minutes
export const LOGIN_CHECK_DELAY = 5 * 1000 // 5 sec

const webLoginUrl = `${WEB_APP_URL}/cli-login`

const MOBB_LOGIN_REQUIRED_MSG = `🔓 Login to Mobb is Required, you will be redirected to our login page, once the authorization is complete return to this prompt, ${chalk.bgBlue(
  'press any key to continue'
)};`

export async function handleMobbLogin({
  inGqlClient,
  apiKey,
  skipPrompts,
}: {
  inGqlClient: GQLClient
  apiKey?: string
  skipPrompts?: boolean
}) {
  const { createSpinner } = Spinner({ ci: skipPrompts })

  const isConnected = await inGqlClient.verifyApiConnection()
  if (!isConnected) {
    createSpinner().start().error({
      text: '🔓 Connection to Mobb: failed to connect to the Mobb server',
    })
    throw new CliError(
      'Connection to Mobb: failed to connect to the Mobb server'
    )
  }
  createSpinner().start().success({
    text: `🔓 Connection to Mobb: succeeded`,
  })

  const userVerify = await inGqlClient.validateUserToken()
  if (userVerify) {
    createSpinner()
      .start()
      .success({
        text: `🔓 Login to Mobb succeeded. ${typeof userVerify === 'string' ? `Logged in as ${userVerify}` : ''}`,
      })

    return inGqlClient
  } else if (apiKey) {
    createSpinner().start().error({
      text: '🔓 Login to Mobb failed: The provided API key does not match any configured API key on the system',
    })
    throw new CliError(
      'Login to Mobb failed: The provided API key does not match any configured API key on the system'
    )
  }

  const loginSpinner = createSpinner().start()

  if (!skipPrompts) {
    loginSpinner.update({ text: MOBB_LOGIN_REQUIRED_MSG })
    await keypress()
  }

  loginSpinner.update({
    text: '🔓 Waiting for Mobb login...',
  })

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })

  const loginId = await inGqlClient.createCliLogin({
    publicKey: publicKey.export({ format: 'pem', type: 'pkcs1' }).toString(),
  })
  const browserUrl = `${webLoginUrl}/${loginId}?hostname=${os.hostname()}`

  !skipPrompts &&
    console.log(
      `If the page does not open automatically, kindly access it through ${browserUrl}.`
    )
  await open(browserUrl)

  let newApiToken = null

  for (let i = 0; i < LOGIN_MAX_WAIT / LOGIN_CHECK_DELAY; i++) {
    const encryptedApiToken = await inGqlClient.getEncryptedApiToken({
      loginId,
    })
    loginSpinner.spin()

    if (encryptedApiToken) {
      debug('encrypted API token received %s', encryptedApiToken)
      newApiToken = crypto
        .privateDecrypt(privateKey, Buffer.from(encryptedApiToken, 'base64'))
        .toString('utf-8')
      debug('API token decrypted')
      break
    }
    await sleep(LOGIN_CHECK_DELAY)
  }

  if (!newApiToken) {
    loginSpinner.error({
      text: 'Login timeout error',
    })
    throw new CliError()
  }

  const newGqlClient = new GQLClient({ apiKey: newApiToken, type: 'apiKey' })

  const loginSuccess = await newGqlClient.validateUserToken()
  if (loginSuccess) {
    debug(`set api token ${newApiToken}`)
    config.set('apiToken', newApiToken)
    loginSpinner.success({
      text: `🔓 Login to Mobb successful! ${typeof loginSpinner === 'string' ? `Logged in as ${loginSuccess}` : ''}`,
    })
  } else {
    loginSpinner.error({
      text: 'Something went wrong, API token is invalid.',
    })
    throw new CliError()
  }
  return newGqlClient
}
