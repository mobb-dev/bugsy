import crypto from 'node:crypto'
import os from 'node:os'

import open from 'open'

import { WEB_APP_URL } from '../../constants'
import { sleep } from '../../utils'
import {
  MCP_LOGIN_CHECK_DELAY,
  MCP_LOGIN_MAX_WAIT,
  MCP_TOOLS_BROWSER_COOLDOWN_MS,
} from '../core/configs'
import {
  AuthenticationError,
  CliLoginError,
  FailedToGetApiTokenError,
} from '../core/Errors'
import { logDebug } from '../Logger'
import { McpGQLClient } from './McpGQLClient'
import { buildLoginUrl, LoginContext } from './types'

/**
 * Service for handling authentication operations with the Mobb API
 */
export class McpAuthService {
  private client: McpGQLClient
  private lastBrowserOpenTime = 0

  constructor(client: McpGQLClient) {
    this.client = client
  }

  /**
   * Opens a browser window for authentication
   * @param url URL to open in browser
   * @param isBackgoundCall Whether this is called from tools context
   */
  async openBrowser(url: string, isBackgoundCall: boolean): Promise<void> {
    if (isBackgoundCall) {
      const now = Date.now()
      if (now - this.lastBrowserOpenTime < MCP_TOOLS_BROWSER_COOLDOWN_MS) {
        logDebug(`browser cooldown active, skipping open for ${url}`)
        return
      }
    }
    logDebug(`opening browser url ${url}`)
    await open(url)
    this.lastBrowserOpenTime = Date.now()
  }

  /**
   * Handles the complete authentication flow
   * @param isBackgoundCall Whether this is called from tools context
   * @param loginContext Context information about who triggered the login
   * @returns Authenticated API token
   */
  async authenticate(
    isBackgoundCall = false,
    loginContext?: LoginContext
  ): Promise<string> {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    })

    logDebug('creating cli login')
    const loginId = await this.client.createCliLogin({
      publicKey: publicKey.export({ format: 'pem', type: 'pkcs1' }).toString(),
    })

    if (!loginId) {
      throw new CliLoginError('Error: createCliLogin failed')
    }

    logDebug(`cli login created ${loginId}`)
    const webLoginUrl = `${WEB_APP_URL}/mvs-login`

    // Build URL with context query parameters if provided
    const browserUrl = loginContext
      ? buildLoginUrl(webLoginUrl, loginId, os.hostname(), loginContext)
      : `${webLoginUrl}/${loginId}?hostname=${os.hostname()}`

    await this.openBrowser(browserUrl, isBackgoundCall)

    logDebug(`waiting for login to complete`)
    let newApiToken = null

    for (let i = 0; i < MCP_LOGIN_MAX_WAIT / MCP_LOGIN_CHECK_DELAY; i++) {
      const encryptedApiToken = await this.client.getEncryptedApiToken({
        loginId,
      })

      if (encryptedApiToken) {
        logDebug('encrypted API token received')
        newApiToken = crypto
          .privateDecrypt(privateKey, Buffer.from(encryptedApiToken, 'base64'))
          .toString('utf-8')
        logDebug('API token decrypted')
        break
      }

      await sleep(MCP_LOGIN_CHECK_DELAY)
    }

    if (!newApiToken) {
      throw new FailedToGetApiTokenError(
        'Error: failed to get encrypted api token'
      )
    }

    // Verify the new token works
    const verifyClient = new McpGQLClient({
      apiKey: newApiToken,
      type: 'apiKey',
    })
    const loginSuccess = await verifyClient.validateUserToken()

    if (!loginSuccess) {
      throw new AuthenticationError('Invalid API token')
    }

    return newApiToken
  }
}
