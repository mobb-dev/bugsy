import {
  type Dispatcher,
  getGlobalDispatcher,
  MockAgent,
  setGlobalDispatcher,
} from 'undici'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getOctoKit } from '../github/utils'

describe('getOctoKit retry config', () => {
  let mockAgent: MockAgent
  let originalDispatcher: Dispatcher

  beforeEach(() => {
    originalDispatcher = getGlobalDispatcher()
    mockAgent = new MockAgent()
    mockAgent.disableNetConnect()
    setGlobalDispatcher(mockAgent)
  })

  afterEach(async () => {
    await mockAgent.close()
    setGlobalDispatcher(originalDispatcher)
  })

  it('retries 401 on /user so a fresh OAuth token propagation glitch recovers, even when the caller does not pass isEnableRetries', async () => {
    const pool = mockAgent.get('https://api.github.com')
    // First call: GitHub briefly returns 401 for a freshly minted token
    pool
      .intercept({ path: '/user', method: 'GET' })
      .reply(401, JSON.stringify({ message: 'Bad credentials' }), {
        headers: { 'content-type': 'application/json' },
      })
    // Retry succeeds
    pool
      .intercept({ path: '/user', method: 'GET' })
      .reply(200, JSON.stringify({ login: 'test-user', id: 1 }), {
        headers: { 'content-type': 'application/json' },
      })

    const octokit = getOctoKit({
      auth: 'gho_test-token',
      url: 'https://github.com',
    })

    const res = await octokit.rest.users.getAuthenticated()
    expect(res.status).toBe(200)
    expect(res.data.login).toBe('test-user')
  })

  it('does not retry 404 (excluded via doNotRetry)', async () => {
    const pool = mockAgent.get('https://api.github.com')
    pool
      .intercept({
        path: '/repos/owner/missing/branches?per_page=1',
        method: 'GET',
      })
      .reply(404, { message: 'Not Found' })

    const octokit = getOctoKit({
      auth: 'gho_test-token',
      url: 'https://github.com',
    })

    await expect(
      octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: 'owner',
        repo: 'missing',
        per_page: 1,
      })
    ).rejects.toMatchObject({ status: 404 })
  })
})
