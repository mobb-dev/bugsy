import crypto from 'node:crypto'
import os from 'node:os'

import chalk from 'chalk'
import Debug from 'debug'
import open from 'open'

import { API_URL, WEB_APP_URL } from '../constants'
import { GQLClient } from '../features/analysis/graphql'
import { CliError, keypress, sleep, Spinner } from '../utils'
import { configStore } from '../utils/ConfigStoreService'

const debug = Debug('mobbdev:commands')

export const LOGIN_MAX_WAIT = 10 * 60 * 1000 // 10 minutes
export const LOGIN_CHECK_DELAY = 5 * 1000 // 5 sec

const MOBB_LOGIN_REQUIRED_MSG = `🔓 Login to Mobb is Required, you will be redirected to our login page, once the authorization is complete return to this prompt, ${chalk.bgBlue(
  'press any key to continue'
)};`

/**
 * Initializes and authenticates a GQL client for Bugsy operations.
 * This function can be called separately to reuse an authenticated client
 * across multiple operations.
 *
 * @param inputApiKey - Optional API key override
 * @param isSkipPrompts - Skip interactive prompts (default: true)
 * @param apiUrl - Optional API URL (defaults to DEFAULT_API_URL)
 * @param webAppUrl - Optional web app URL (defaults to DEFAULT_WEB_APP_URL)
 * @returns Promise<GQLClient> An authenticated GQL client ready for use
 */
export async function getAuthenticatedGQLClient({
  inputApiKey = '',
  isSkipPrompts = true,
  apiUrl,
  webAppUrl,
}: {
  inputApiKey?: string
  isSkipPrompts?: boolean
  apiUrl?: string
  webAppUrl?: string
}): Promise<GQLClient> {
  let gqlClient = new GQLClient({
    apiKey: inputApiKey || configStore.get('apiToken') || '',
    type: 'apiKey',
    apiUrl,
  })

  gqlClient = await handleMobbLogin({
    inGqlClient: gqlClient,
    skipPrompts: isSkipPrompts,
    apiUrl,
    webAppUrl,
  })

  return gqlClient
}

export async function handleMobbLogin({
  inGqlClient,
  apiKey,
  skipPrompts,
  apiUrl,
  webAppUrl,
}: {
  inGqlClient: GQLClient
  apiKey?: string
  skipPrompts?: boolean
  apiUrl?: string
  webAppUrl?: string
}) {
  const resolvedWebAppUrl = webAppUrl || WEB_APP_URL
  const resolvedApiUrl = apiUrl || API_URL
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
  const browserUrl = `${resolvedWebAppUrl}/cli-login/${loginId}?hostname=${os.hostname()}`

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

  const newGqlClient = new GQLClient({
    apiKey: newApiToken,
    type: 'apiKey',
    apiUrl: resolvedApiUrl,
  })

  const loginSuccess = await newGqlClient.validateUserToken()
  if (loginSuccess) {
    debug(`set api token ${newApiToken}`)
    configStore.set('apiToken', newApiToken)
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
