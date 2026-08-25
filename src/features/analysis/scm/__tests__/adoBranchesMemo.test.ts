import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getAdoSdk } from '../ado/ado'
import { AdoTokenTypeEnum } from '../ado/constants'
import { GetAdoApiClientParams } from '../ado/types'

// One ADO branch enumeration has to serve validation, the access check and the
// branch list. On on-prem servers `stats/branches` costs 10-20s, so a second
// fetch is the difference between answering inside the gateway budget and timing
// out with the branch list never requested (MOBB-3845).

const REPO_URL = 'https://dev.azure.com/myOrg/myProject/_git/myRepo'

const getBranches = vi.fn()
const getGitApi = vi.fn(async () => ({ getBranches }))
const connect = vi.fn(async () => ({}))

vi.mock('../ado/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../ado/utils')>()
  return {
    ...actual,
    getAdoApiClient: vi.fn(async () => ({ getGitApi, connect })),
  }
})

function branch(name: string, isoDate: string) {
  return { name, commit: { committer: { date: new Date(isoDate) } } }
}

const CLIENT_PARAMS: GetAdoApiClientParams = {
  tokenType: AdoTokenTypeEnum.PAT,
  accessToken: 'pat',
  patTokenOrg: 'myorg',
  orgName: 'myorg',
}

describe('ado branch fetch is shared across one sdk instance', () => {
  beforeEach(() => {
    getBranches.mockReset()
    getGitApi.mockClear()
    connect.mockClear()
  })

  it('fetches branches once for validation, the access check and the list', async () => {
    getBranches.mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    await adoSdk.getAdoIsUserCollaborator({ repoUrl: REPO_URL })
    const branchList = await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })

    expect(branchList).toEqual(['main'])
    expect(getBranches).toHaveBeenCalledTimes(1)
    // The git client is resolved once too — each resolution is a resource-area
    // discovery round trip over the broker on on-prem.
    expect(getGitApi).toHaveBeenCalledTimes(1)
  })

  it('does not reorder the shared array when sorting the branch list', async () => {
    const shared = [
      branch('old', '2020-01-01T00:00:00Z'),
      branch('new', '2026-08-01T00:00:00Z'),
    ]
    getBranches.mockResolvedValue(shared)
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    // Newest first in the returned list...
    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([
      'new',
      'old',
    ])
    // ...while the memoized value keeps its original order, so a later reader
    // (validation, the access check) sees what the server actually returned.
    expect(shared.map((b) => b.name)).toEqual(['old', 'new'])
  })

  it('retries after a failure instead of replaying the rejection', async () => {
    getBranches
      .mockRejectedValueOnce(new Error('ADO unreachable'))
      .mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(
      adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    ).rejects.toThrow()
    // The resolvers wrap these calls in a retry helper; a memoized rejection
    // would make every retry replay the same transient failure.
    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([
      'main',
    ])
    expect(getBranches).toHaveBeenCalledTimes(2)
  })

  it('rejects a repo with no branches', async () => {
    getBranches.mockResolvedValue([])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(adoSdk.validateAdoRepo({ repoUrl: REPO_URL })).rejects.toThrow(
      'no branches'
    )
    expect(await adoSdk.getAdoIsUserCollaborator({ repoUrl: REPO_URL })).toBe(
      false
    )
    // An empty result is a SUCCESSFUL fetch, so it stays memoized even though
    // both callers above surfaced it as a failure — the one place where the
    // memo's success and error paths could plausibly diverge.
    expect(getBranches).toHaveBeenCalledTimes(1)
  })

  it('reports no access for a url that is not an ADO repo url', async () => {
    // The parse guard skips the branch check, so the credential is proved by
    // resolving the git client instead — a bad token must still read as false.
    getGitApi.mockRejectedValueOnce(new Error('TF400813: unauthorized'))
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    expect(
      await adoSdk.getAdoIsUserCollaborator({
        repoUrl: 'https://dev.azure.com/myOrg',
      })
    ).toBe(false)
    expect(getBranches).not.toHaveBeenCalled()
  })
})
