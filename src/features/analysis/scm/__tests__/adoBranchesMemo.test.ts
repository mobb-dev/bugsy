import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getAdoSdk } from '../ado/ado'
import { AdoTokenTypeEnum } from '../ado/constants'
import { GetAdoApiClientParams } from '../ado/types'

// Two properties of the ADO sdk are pinned here.
//
// 1. Validation and the access check must NOT enumerate branches (MOBB-3852).
//    `stats/branches` computes ahead/behind statistics for every branch in the
//    repo and was measured at 27s on the on-prem fixture; the repo lookup that
//    answers the same "does this repo exist and is it usable" question was
//    measured at ~1s against the same server in the same run.
// 2. Whatever a caller does need is fetched at most once per sdk instance
//    (MOBB-3845), so a request that validates, checks access and then lists
//    branches answers inside the gateway budget instead of timing out with the
//    branch list never requested.

const REPO_URL = 'https://dev.azure.com/myOrg/myProject/_git/myRepo'

const getBranches = vi.fn()
const getRepository = vi.fn()
const getGitApi = vi.fn(async () => ({ getBranches, getRepository }))
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

describe('ado repo validation does not enumerate branches', () => {
  beforeEach(() => {
    getBranches.mockReset()
    getRepository.mockReset()
    getGitApi.mockClear()
    connect.mockClear()
    getRepository.mockResolvedValue({ defaultBranch: 'refs/heads/main' })
  })

  it('validates and checks access off the repo record, never stats/branches', async () => {
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    expect(await adoSdk.getAdoIsUserCollaborator({ repoUrl: REPO_URL })).toBe(
      true
    )

    // The whole point of MOBB-3852: the 27s call is off the validation path.
    expect(getBranches).not.toHaveBeenCalled()
    // ...and the ~1s call that replaced it is shared by both callers (MOBB-3845).
    expect(getRepository).toHaveBeenCalledTimes(1)
  })

  it('passes the repo and project decoded exactly once', async () => {
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await adoSdk.validateAdoRepo({
      repoUrl: 'https://dev.azure.com/myOrg/my%20project/_git/my%20repo',
    })

    // `parseAdoOwnerAndRepo` does the decoding (MOBB-2084) — an encoded name is
    // not a repo name ADO knows about.
    expect(getRepository).toHaveBeenCalledWith('my repo', 'my project')
  })

  it('does not decode the repo name a second time', async () => {
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    // `getAdoRepoDefaultBranch` used to call decodeURI on an already-decoded
    // name. For a repo whose name contains a literal `%` that is not a cosmetic
    // difference: the second decode throws URIError before the request is made.
    await adoSdk.validateAdoRepo({
      repoUrl: 'https://dev.azure.com/myOrg/myProject/_git/100%25',
    })

    expect(getRepository).toHaveBeenCalledWith('100%', 'myProject')
  })

  it('shares one repo lookup with the default-branch getter', async () => {
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    expect(await adoSdk.getAdoRepoDefaultBranch({ repoUrl: REPO_URL })).toBe(
      'main'
    )

    expect(getRepository).toHaveBeenCalledTimes(1)
  })

  it('rejects a repo with no default branch', async () => {
    // An ADO repo only reports a defaultBranch once something has been pushed,
    // so this is what a repo with no commits looks like on the wire.
    getRepository.mockResolvedValue({ defaultBranch: undefined })
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(adoSdk.validateAdoRepo({ repoUrl: REPO_URL })).rejects.toThrow(
      'no default branch'
    )
    expect(await adoSdk.getAdoIsUserCollaborator({ repoUrl: REPO_URL })).toBe(
      false
    )
    // A repo record without a defaultBranch is a SUCCESSFUL fetch, so it stays
    // memoized even though both callers above surfaced it as a failure — the one
    // place where the memo's success and error paths could plausibly diverge.
    expect(getRepository).toHaveBeenCalledTimes(1)
    expect(getBranches).not.toHaveBeenCalled()
  })

  // The two predicates the swap moves between are `getBranches().length > 0`
  // (old) and `defaultBranch != null` (new). They disagree in exactly two states,
  // one in each direction, and both are pinned below so the change is a stated
  // decision rather than a side effect.
  //
  // Note what is NOT a difference: a repo whose default ref was deleted while
  // other branches remain. Its branch list is non-empty AND ADO keeps reporting
  // the stale defaultBranch, so old and new both accept it.

  it('accepts a repo with a stale defaultBranch and an empty branch list', async () => {
    // LOOSER direction: old rejected (no branches), new accepts (pointer still
    // there). Reachable only after every branch is gone while ADO retains the
    // default-branch pointer.
    getBranches.mockResolvedValue([])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(
      adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    ).resolves.toBeUndefined()
  })

  it('rejects a repo that has branches but no defaultBranch', async () => {
    // STRICTER direction, and the one that carries risk: a repo the old check
    // accepted is now rejected, which surfaces to the user as an unreachable
    // repo. Held to be unreachable against a real ADO server — ADO sets
    // defaultBranch on first push and keeps it thereafter, even when the ref it
    // names is deleted — so a repo with branches always reports one. Pinned here
    // because that argument is about ADO's behaviour, not about this code: if it
    // is ever wrong, this test names the failure instead of leaving it to be
    // rediscovered as "repo unreachable" during onboarding.
    getBranches.mockResolvedValue([branch('feature', '2026-08-01T00:00:00Z')])
    getRepository.mockResolvedValue({ defaultBranch: undefined })
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(adoSdk.validateAdoRepo({ repoUrl: REPO_URL })).rejects.toThrow(
      'no default branch'
    )
  })

  it('builds repo-derived urls for a repo whose name contains a percent', async () => {
    // The five URL/commit helpers decoded the already-decoded names too, so
    // `decodeURI('100%')` threw URIError before the request went out. Their own
    // suite (ado.test.ts) is credentialed and does not run on a PR under T-329,
    // so the regression guard lives here.
    getRepository.mockResolvedValue({
      defaultBranch: 'refs/heads/main',
      webUrl: 'https://dev.azure.com/myOrg/myProject/_git/100%25',
    })
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(
      adoSdk.getAdoPrUrl({
        url: 'https://dev.azure.com/myOrg/myProject/_git/100%25',
        prNumber: 7,
      })
    ).resolves.toBe(
      'https://dev.azure.com/myOrg/myProject/_git/100%25/pullrequest/7'
    )
    expect(getRepository).toHaveBeenCalledWith('100%', 'myProject')
  })

  it('reports no access for a url that is not an ADO repo url', async () => {
    // The parse guard skips the repo lookup, so the credential is proved by
    // resolving the git client instead — a bad token must still read as false.
    getGitApi.mockRejectedValueOnce(new Error('TF400813: unauthorized'))
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    expect(
      await adoSdk.getAdoIsUserCollaborator({
        repoUrl: 'https://dev.azure.com/myOrg',
      })
    ).toBe(false)
    expect(getRepository).not.toHaveBeenCalled()
    expect(getBranches).not.toHaveBeenCalled()
  })

  it('reports no access when the credential is rejected', async () => {
    // Load-bearing: this boolean is the only thing that turns a bad credential
    // into RepoNoTokenAccessError in scmPerformGeneralChecks. If it read `true`,
    // a bad token would proceed on a StubSCMLib whose getBranchList() returns []
    // — the silently-disabled Continue button MOBB-3845 was filed for.
    getRepository.mockRejectedValue({ statusCode: 401 })
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    expect(await adoSdk.getAdoIsUserCollaborator({ repoUrl: REPO_URL })).toBe(
      false
    )
  })

  it('retries a failed repo lookup instead of replaying the rejection', async () => {
    getRepository
      .mockRejectedValueOnce(new Error('ADO unreachable'))
      .mockResolvedValue({ defaultBranch: 'refs/heads/main' })
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(
      adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    ).rejects.toThrow()
    // The resolvers wrap these calls in a retry helper; a memoized rejection
    // would make every retry replay the same transient failure.
    await expect(
      adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    ).resolves.toBeUndefined()
    expect(getRepository).toHaveBeenCalledTimes(2)
  })
})

describe('ado branch fetch is shared across one sdk instance', () => {
  beforeEach(() => {
    getBranches.mockReset()
    getRepository.mockReset()
    getGitApi.mockClear()
    connect.mockClear()
    getRepository.mockResolvedValue({ defaultBranch: 'refs/heads/main' })
  })

  it('fetches branches once no matter how often the list is asked for', async () => {
    getBranches.mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([
      'main',
    ])
    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([
      'main',
    ])

    expect(getBranches).toHaveBeenCalledTimes(1)
  })

  it('resolves the git client once across both memos', async () => {
    getBranches.mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })

    // Each resolution is a resource-area discovery round trip over the broker on
    // on-prem, so splitting validation off the branch fetch must not buy a
    // second one.
    expect(getGitApi).toHaveBeenCalledTimes(1)
  })

  it('retries a failed git client resolution instead of replaying it', async () => {
    // getGitApiOnce evicts on rejection for the same reason the per-repo memos
    // do. It is the one memo shared by BOTH of them, so a retained rejection
    // would poison validation and the branch list together for the rest of the
    // request — every later call in the same sdk instance replaying one
    // transient handshake failure.
    getGitApi.mockRejectedValueOnce(new Error('TF400813: unauthorized'))
    getBranches.mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    await expect(
      adoSdk.validateAdoRepo({ repoUrl: REPO_URL })
    ).rejects.toThrow()
    await expect(
      adoSdk.getAdoBranchList({ repoUrl: REPO_URL })
    ).resolves.toEqual(['main'])
    expect(getGitApi).toHaveBeenCalledTimes(2)
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
    // sees what the server actually returned.
    expect(shared.map((b) => b.name)).toEqual(['old', 'new'])
  })

  it('retries after a failure instead of replaying the rejection', async () => {
    getBranches
      .mockRejectedValueOnce(new Error('ADO unreachable'))
      .mockResolvedValue([branch('main', '2026-08-01T00:00:00Z')])
    const adoSdk = await getAdoSdk(CLIENT_PARAMS)

    // getAdoBranchList swallows the failure into an empty list...
    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([])
    // ...and the next call gets a fresh attempt rather than the memoized reject.
    expect(await adoSdk.getAdoBranchList({ repoUrl: REPO_URL })).toEqual([
      'main',
    ])
    expect(getBranches).toHaveBeenCalledTimes(2)
  })
})
