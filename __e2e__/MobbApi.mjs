import path from 'node:path'

import { CLI_LOCAL_ENV_OVERWRITE, run, SCRIPTS_DIR_PATH } from './utils.mjs'

/**
 * Wrapper to interact with Mobb API. All GraphQL queries here are copy-paste
 * from the browser requests tab. We should keep this class as simple as
 * possible.
 */
export class MobbApi {
  #auth0Token

  /**
   * Acquire an auth0 token and initialize user account.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.#auth0Token = (
      await run(path.join(SCRIPTS_DIR_PATH, 'login_auth0.sh'))
    )
      .split('\n')[0]
      .trim()
    await this.#initUser()
  }

  async #initUser() {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: '{"query":"\\n    mutation InitOrganizationAndProject {\\n  initOrganizationAndProject {\\n    __typename\\n    ... on InitOrganizationAndProjectGoodResponse {\\n      projectId\\n      userId\\n    }\\n    ... on UserAlreadyInProjectError {\\n      error\\n      status\\n    }\\n    ... on UserHasNoPermissionInProjectError {\\n      error\\n      status\\n    }\\n  }\\n}\\n    ","variables":{},"operationName":"InitOrganizationAndProject"}',
      method: 'POST',
    })
    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to perform user init ${JSON.stringify(body, null, 2)}`
      )
    }
  }

  /**
   * Perform CLI login (generate a new API token and update the CLI login table).
   *
   * @param {string} loginId
   * @returns {Promise<void>}
   */
  async cliLogin(loginId) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: `{"query":"\\n    mutation performCliLogin($loginId: String!, $hostname: String) {\\n  performCliLogin(loginId: $loginId, hostname: $hostname) {\\n    status\\n  }\\n}\\n    ","variables":{"loginId":"${loginId}","hostname":"example-hostname"},"operationName":"performCliLogin"}`,
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to perform CLI login ${JSON.stringify(body, null, 2)}`
      )
    }
  }

  /**
   * Create new Mobb API token.
   *
   * @returns {Promise<string>}
   */
  async createApiToken() {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: '{"query":"\\n    mutation CreateToken($tokenName: String!) {\\n  createToken(tokenName: $tokenName) {\\n    token\\n    name\\n  }\\n}\\n    ","variables":{"tokenName":"test"},"operationName":"CreateToken"}',
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to create API token ${JSON.stringify(body, null, 2)}`
      )
    }

    return body.data.createToken.token
  }
}

export const mobbApi = new MobbApi()
