import chalk from 'chalk'
import Debug from 'debug'

import { GQLClient } from '../features/analysis/graphql'
import { LoginContext } from '../mcp/services/types'
import { CliError, keypress, Spinner } from '../utils'
import { AuthManager } from './AuthManager'

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
  debug(
    'getAuthenticatedGQLClient called with: apiUrl=%s, webAppUrl=%s',
    apiUrl || 'undefined',
    webAppUrl || 'undefined'
  )

  const authManager = new AuthManager(webAppUrl, apiUrl)
  let gqlClient = authManager.getGQLClient(inputApiKey)

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
  loginContext,
}: {
  inGqlClient: GQLClient
  apiKey?: string
  skipPrompts?: boolean
  apiUrl?: string
  webAppUrl?: string
  loginContext?: LoginContext
}): Promise<GQLClient> {
  debug(
    'handleMobbLogin: resolved URLs - apiUrl=%s (from param: %s), webAppUrl=%s (from param: %s)',
    apiUrl || 'fallback',
    apiUrl || 'fallback',
    webAppUrl || 'fallback',
    webAppUrl || 'fallback'
  )

  const { createSpinner } = Spinner({ ci: skipPrompts })
  const authManager = new AuthManager(webAppUrl, apiUrl)

  // Use the provided GQL client
  authManager.setGQLClient(inGqlClient)

  // Check if already authenticated
  try {
    const isAuthenticated = await authManager.isAuthenticated()
    if (isAuthenticated) {
      createSpinner().start().success({
        text: `🔓 Login to Mobb succeeded. Already authenticated`,
      })
      return authManager.getGQLClient()
    }
  } catch (error) {
    debug('Authentication check failed:', error)
  }

  // If API key provided but authentication failed
  if (apiKey) {
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

  try {
    // Generate login URL and open browser
    const loginUrl = await authManager.generateLoginUrl(loginContext)

    if (!loginUrl) {
      loginSpinner.error({
        text: 'Failed to generate login URL',
      })
      throw new CliError('Failed to generate login URL')
    }

    !skipPrompts &&
      console.log(
        `If the page does not open automatically, kindly access it through ${loginUrl}.`
      )

    authManager.openUrlInBrowser()

    // Wait for authentication
    const authSuccess = await authManager.waitForAuthentication()

    if (!authSuccess) {
      loginSpinner.error({
        text: 'Login timeout error',
      })
      throw new CliError('Login timeout error')
    }

    loginSpinner.success({
      text: `🔓 Login to Mobb successful!`,
    })

    return authManager.getGQLClient()
  } finally {
    // Clean up the auth manager
    authManager.cleanup()
  }
}
