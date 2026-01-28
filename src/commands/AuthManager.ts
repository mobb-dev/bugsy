import crypto from 'node:crypto'
import os from 'node:os'

import open from 'open'

import { API_URL, WEB_APP_URL } from '../constants'
import { GQLClient } from '../features/analysis/graphql'
import { buildLoginUrl, LoginContext } from '../mcp/services/types'
import { sleep } from '../utils'
import { configStore } from '../utils/ConfigStoreService'

export const LOGIN_MAX_WAIT = 10 * 60 * 1000 // 10 minutes
export const LOGIN_CHECK_DELAY = 5 * 1000 // 5 sec

export class AuthManager {
  private publicKey?: crypto.KeyObject
  private privateKey?: crypto.KeyObject
  private loginId?: string
  private gqlClient?: GQLClient
  private currentBrowserUrl?: string | null
  private authenticated: boolean | null = null
  private resolvedWebAppUrl: string
  private resolvedApiUrl: string

  constructor(webAppUrl?: string, apiUrl?: string) {
    this.resolvedWebAppUrl = webAppUrl || WEB_APP_URL
    this.resolvedApiUrl = apiUrl || API_URL
  }

  openUrlInBrowser(): boolean {
    if (this.currentBrowserUrl) {
      open(this.currentBrowserUrl)
      return true
    }
    return false
  }

  async waitForAuthentication(): Promise<boolean> {
    let newApiToken = null
    for (let i = 0; i < LOGIN_MAX_WAIT / LOGIN_CHECK_DELAY; i++) {
      newApiToken = await this.getApiToken()
      if (newApiToken) {
        break
      }
      await sleep(LOGIN_CHECK_DELAY)
    }
    if (!newApiToken) {
      return false
    }

    this.gqlClient = new GQLClient({
      apiKey: newApiToken,
      type: 'apiKey',
      apiUrl: this.resolvedApiUrl,
    })

    const loginSuccess = await this.gqlClient.validateUserToken()
    if (loginSuccess) {
      configStore.set('apiToken', newApiToken)
      this.authenticated = true
      return true
    }
    return false
  }

  /**
   * Checks if the user is already authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (this.authenticated === null) {
      const result = await this.checkAuthentication()
      this.authenticated = result.isAuthenticated
    }
    return this.authenticated
  }

  /**
   * Private function to check if the user is authenticated with the server
   */
  private async checkAuthentication(
    apiKey?: string
  ): Promise<{ isAuthenticated: boolean; message: string }> {
    try {
      if (!this.gqlClient) {
        this.gqlClient = this.getGQLClient(apiKey)
      }

      // Verify connection to server
      const isConnected = await this.gqlClient.verifyApiConnection()
      if (!isConnected) {
        return {
          isAuthenticated: false,
          message: 'Failed to connect to Mobb server',
        }
      }

      // Check if user is already authenticated
      const userVerify = await this.gqlClient.validateUserToken()
      if (!userVerify) {
        return {
          isAuthenticated: false,
          message: 'User token validation failed',
        }
      }
    } catch (error) {
      return {
        isAuthenticated: false,
        message:
          error instanceof Error
            ? error.message
            : 'Unknown authentication error',
      }
    }
    return { isAuthenticated: true, message: 'Successfully authenticated' }
  }

  /**
   * Generates a login URL for manual authentication
   */
  async generateLoginUrl(loginContext?: LoginContext): Promise<string | null> {
    try {
      if (!this.gqlClient) {
        this.gqlClient = this.getGQLClient()
      }

      // Generate key pair for this login session
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
      })

      this.publicKey = publicKey
      this.privateKey = privateKey

      // Create login session
      this.loginId = await this.gqlClient.createCliLogin({
        publicKey: this.publicKey
          .export({ format: 'pem', type: 'pkcs1' })
          .toString(),
      })

      // Build the login URL
      const webLoginUrl = `${this.resolvedWebAppUrl}/cli-login`
      const browserUrl = loginContext
        ? buildLoginUrl(webLoginUrl, this.loginId, os.hostname(), loginContext)
        : `${webLoginUrl}/${this.loginId}?hostname=${os.hostname()}`

      // Store current URL for potential reuse
      this.currentBrowserUrl = browserUrl
      return browserUrl
    } catch (error) {
      console.error('Failed to generate login URL:', error)
      return null
    }
  }

  /**
   * Retrieves and decrypts the API token after authentication
   */
  async getApiToken(): Promise<string | null> {
    if (!this.gqlClient || !this.loginId || !this.privateKey) {
      return null
    }
    const encryptedApiToken = await this.gqlClient.getEncryptedApiToken({
      loginId: this.loginId,
    })
    if (encryptedApiToken) {
      return crypto
        .privateDecrypt(
          this.privateKey,
          Buffer.from(encryptedApiToken, 'base64')
        )
        .toString('utf-8')
    }
    return null
  }

  /**
   * Gets the current GQL client (if authenticated)
   */
  getGQLClient(inputApiKey?: string): GQLClient {
    if (this.gqlClient === undefined) {
      this.gqlClient = new GQLClient({
        apiKey: inputApiKey || configStore.get('apiToken') || '',
        type: 'apiKey',
        apiUrl: this.resolvedApiUrl,
      })
    }
    return this.gqlClient
  }

  /**
   * Assigns a GQL client instance to the AuthManager, and resets auth state
   * @param gqlClient The GQL client instance to set
   */
  setGQLClient(gqlClient: GQLClient): void {
    this.gqlClient = gqlClient
    this.cleanup()
  }

  /**
   * Cleans up any active login session
   */
  cleanup(): void {
    this.publicKey = undefined
    this.privateKey = undefined
    this.loginId = undefined
    this.authenticated = null
    this.currentBrowserUrl = null
  }
}
