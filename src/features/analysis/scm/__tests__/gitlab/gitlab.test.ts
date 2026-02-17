import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { GithubSCMLib } from '../../github/GithubSCMLib'
import { GetGitlabTokenParams, GitlabTokenRequestTypeEnum } from '../../gitlab'
import {
  createMarkdownCommentOnPullRequest,
  getGitlabBranchList,
  getGitlabCommitUrl,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequest,
  getGitlabMergeRequestMetrics,
  getGitlabMrCommitsBatch,
  getGitlabMrDataBatch,
  getGitlabRecentCommits,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabToken,
  getGitlabUsername,
  gitlabValidateParams,
  parseGitlabOwnerAndRepo,
  searchGitlabMergeRequests,
  searchGitlabProjects,
} from '../../gitlab/gitlab'
import { GitlabSCMLib } from '../../gitlab/GitlabSCMLib'
import { createScmLib } from '../../scmFactory'
import { ScmLibScmType } from '../../types'
import { RepoConfig } from '../common'
import { env } from '../env'

function isArrayWithBrachOrLength(response: string[], name: string): boolean {
  return response.includes(name) || response.length === 100
}

const reposConfig: RepoConfig[] = [
  {
    url: {
      valid: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      invalid: 'https://invalid.com/mobbcitestjob',
      nonExisting: 'https://gitlab.com/mobbcitestjob/webgoat1111',
    },
    commit: {
      date: new Date('2024-11-18T09:12:19.000Z'),
      sha: '737a5344cbfaccde78d109329d15c1f3123c992b',
    },
    branch: {
      name: 'main',
      date: new Date('2024-11-18T09:12:19.000Z'),
      sha: '737a5344cbfaccde78d109329d15c1f3123c992b',
    },
    tag: {
      name: 'v2023.8',
      date: new Date('2023-12-05T10:21:15.000Z'),
      sha: '5357a65e054976cd7d79b81ef3906ded050ed921',
    },
    // We need a real token for authenticated access to the private repo
    accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
  },
  {
    url: {
      valid: env.PLAYWRIGHT_GL_ON_PREM_REPO_URL,
      invalid: 'https://invalid.com/org',
      nonExisting: `${env.PLAYWRIGHT_GL_ON_PREM_URL}/org/I_DONT_EXIST`,
    },
    commit: {
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    branch: {
      name: 'main',
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    tag: {
      name: '0.0.1',
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    accessToken: env.PLAYWRIGHT_GL_ON_PREM_PAT,
  },
]

describe.each(Object.entries(reposConfig))(
  'Gitlab reference',
  (_, repoConfig: RepoConfig) => {
    beforeAll(async () => {
      // Disable the certificate check when calling a resource and avoids the 'self-signed certificate' error.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    })
    afterAll(async () => {
      // Enabling it again, just in case. The certificate check gets disabled on the `beforeAll` clause.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
    })
    it('test non existing repo', async () => {
      await expect(() =>
        getGitlabRepoDefaultBranch(repoConfig.url.nonExisting, {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        })
      ).rejects.toThrow('Not Found')
    })
    it('test existing repo', async () => {
      expect(
        await getGitlabRepoDefaultBranch(repoConfig.url.valid, {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        })
      ).toEqual(repoConfig.branch.name)
    })
    it('branch list non existing repo', async () => {
      await expect(
        getGitlabBranchList({
          repoUrl: repoConfig.url.nonExisting,
          accessToken: repoConfig.accessToken!,
        })
      ).resolves.toEqual([])
    })
    it('branch list existing repo', async () => {
      const response = await getGitlabBranchList({
        repoUrl: repoConfig.url.valid,
        accessToken: repoConfig.accessToken!,
      })
      expect(isArrayWithBrachOrLength(response, repoConfig.branch.name)).toBe(
        true
      )
    })
    it('test if date is correct for commit', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.commit.sha,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.commit.date,
        sha: repoConfig.commit.sha,
        type: 'COMMIT',
      })
    })
    it('test if date is correct for branch', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.branch.name,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.branch.date,
        sha: repoConfig.branch.sha,
        type: 'BRANCH',
      })
    })
    it('test if date is correct for tag', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.tag.name,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.tag.date,
        sha: repoConfig.tag.sha,
        type: 'TAG',
      })
    })
    it('test we get an error for incorrect tag', async () => {
      await expect(
        getGitlabReferenceData(
          {
            gitlabUrl: repoConfig.url.valid,
            ref: 'I_DO_NOT_EXIST',
          },
          {
            gitlabAuthToken: repoConfig.accessToken,
            url: repoConfig.url.valid,
          }
        )
      ).rejects.toThrow('ref')
    })
  }
)

const GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce'
const INVALID_URL = 'https://invalid.com/zj-gitlab'

describe('scm instance tests', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await createScmLib({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      scmType: ScmLibScmType.GITLAB,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      scmOrg: undefined,
    })
    const authHeaders = scmLib.getAuthHeaders()
    expect(authHeaders).toStrictEqual({
      'Private-Token': env.PLAYWRIGHT_GL_CLOUD_PAT,
    })
  })
})

describe('parsing gitlab url', () => {
  it('should parse the url', () => {
    const response = parseGitlabOwnerAndRepo(GITLAB_URL)
    expect(response).toStrictEqual({
      owner: 'zj-gitlab',
      projectPath: 'zj-gitlab/gitlab-ce',
      repo: 'gitlab-ce',
    })
  })
  it('should work with trailing slash', () => {
    const response = parseGitlabOwnerAndRepo(`${GITLAB_URL}/`)
    expect(response).toStrictEqual({
      owner: 'zj-gitlab',
      projectPath: 'zj-gitlab/gitlab-ce',
      repo: 'gitlab-ce',
    })
  })
  it('fail if the url is invalid', () => {
    expect(() => parseGitlabOwnerAndRepo(INVALID_URL)).toThrow()
  })
  it.each<{ tokenType: GetGitlabTokenParams['tokenType'] }>([
    { tokenType: GitlabTokenRequestTypeEnum.REFRESH_TOKEN },
    { tokenType: GitlabTokenRequestTypeEnum.CODE },
  ])('should fail on invalid $tokenType', async ({ tokenType }) => {
    const result = await getGitlabToken({
      token: 'refresh_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType,
    })
    expect(result.success).toBe(false)
  })
})

// Test configuration for GitLab repos with known commits
const GITLAB_TEST_URL = env.PLAYWRIGHT_GL_CLOUD_REPO_URL
// Known commit from the org-owned webgoat repo (v2023.8 tag commit, has non-empty diff + parent)
const GITLAB_TEST_COMMIT_SHA = '5357a65e054976cd7d79b81ef3906ded050ed921'

describe('GitlabSCMLib - getRecentCommits and getRateLimitStatus', () => {
  let scmLib: GitlabSCMLib

  beforeAll(async () => {
    // Disable certificate check for on-prem testing
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    scmLib = (await createScmLib({
      url: GITLAB_TEST_URL,
      scmType: ScmLibScmType.GITLAB,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      scmOrg: undefined,
    })) as GitlabSCMLib
  })

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('getRateLimitStatus returns rate limit info from response headers', async () => {
    const status = await scmLib.getRateLimitStatus()
    // GitLab returns rate limit info via response headers
    if (status) {
      expect(status.remaining).toBeGreaterThanOrEqual(0)
      expect(status.reset).toBeInstanceOf(Date)
      expect(isNaN(status.reset.getTime())).toBe(false)
      expect(Object.keys(status).sort()).toEqual([
        'limit',
        'remaining',
        'reset',
      ])
    }
    // Note: Some GitLab instances may not return rate limit headers
  })

  it('getRecentCommits returns commits since a given date', async () => {
    // Use a date in the past that has commits
    const since = new Date('2019-01-01T00:00:00Z').toISOString()
    const result = await scmLib.getRecentCommits(since)

    expect(Array.isArray(result.data)).toBe(true)
    expect(result.data.length).toBeGreaterThan(0)

    // Most recent commit on main branch is known and stable
    const firstCommit = result.data[0]!
    expect(firstCommit.sha).toBe('737a5344cbfaccde78d109329d15c1f3123c992b')
    expect(firstCommit.commit.author!.email).toBe('kirill@mobb.dev')
    expect(firstCommit.commit.committer!.date).toBeDefined()
    expect(firstCommit.commit.message).toContain('Revert')
    expect(firstCommit.parents!.length).toBe(1)
    expect(firstCommit.parents![0]).toEqual({
      sha: '06ef2737f86a87f52ecb8378ef92704c8680c64f',
    })
  })
})

describe('getGitlabRecentCommits - helper function', () => {
  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns commits with correct structure', async () => {
    const since = new Date('2019-01-01T00:00:00Z').toISOString()
    const commits = await getGitlabRecentCommits({
      repoUrl: GITLAB_TEST_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT!,
      since,
    })

    expect(Array.isArray(commits)).toBe(true)
    expect(commits.length).toBeGreaterThan(0)

    // Most recent commit on main is known and stable
    const first = commits[0]!
    expect(first.sha).toBe('737a5344cbfaccde78d109329d15c1f3123c992b')
    expect(first.commit.author.email).toBe('kirill@mobb.dev')
    expect(first.commit.committer!.date).toContain('2024-11-18')
    expect(first.commit.message).toContain(
      'Revert "SQL Injection vulnerability fix (powered by Mobb)-6aec560d-81f4-47e9-a7ce-0fac8467da80"'
    )
    expect(first.commit.message).toContain(
      'This reverts commit 6844339e38b532016f705806bac4c80b2999185f.'
    )
    expect(first.parents).toEqual([
      { sha: '06ef2737f86a87f52ecb8378ef92704c8680c64f' },
    ])
  })
})

describe('GitlabSCMLib - extractLinearTicketsFromComments', () => {
  let scmLib: GitlabSCMLib

  beforeAll(async () => {
    scmLib = new GitlabSCMLib(undefined, undefined, undefined)
  })

  it('extracts tickets from HTML format comments', () => {
    const comments = [
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: 'Linked issue: <a href="https://linear.app/team/issue/PROJ-123/fix-bug">PROJ-123</a>',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(1)
    expect(tickets[0]).toEqual({
      name: 'PROJ-123',
      title: 'fix bug',
      url: 'https://linear.app/team/issue/PROJ-123/fix-bug',
    })
  })

  it('extracts tickets from Markdown format comments', () => {
    const comments = [
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: 'Linked issue: [PROJ-456](https://linear.app/team/issue/PROJ-456/add-feature)',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(1)
    expect(tickets[0]).toEqual({
      name: 'PROJ-456',
      title: 'add feature',
      url: 'https://linear.app/team/issue/PROJ-456/add-feature',
    })
  })

  it('handles Linear bot with username "linear" (without [bot] suffix)', () => {
    const comments = [
      {
        author: { login: 'linear', type: 'User' },
        body: 'Linked: <a href="https://linear.app/team/issue/ABC-789/task">ABC-789</a>',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(1)
    expect(tickets[0]?.name).toBe('ABC-789')
  })

  it('handles Bot type author with linear-related username', () => {
    const comments = [
      {
        author: { login: 'linear-integration', type: 'Bot' },
        body: 'Linked: <a href="https://linear.app/team/issue/DEF-111/something">DEF-111</a>',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(1)
    expect(tickets[0]?.name).toBe('DEF-111')
  })

  it('ignores non-Linear bot with Bot type', () => {
    const comments = [
      {
        author: { login: 'some-other-bot', type: 'Bot' },
        body: 'Linked: <a href="https://linear.app/team/issue/DEF-111/something">DEF-111</a>',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(0)
  })

  it('extracts multiple tickets from single comment', () => {
    const comments = [
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: `
          Linked issues:
          <a href="https://linear.app/team/issue/PROJ-1/first">PROJ-1</a>
          [PROJ-2](https://linear.app/team/issue/PROJ-2/second)
          <a href="https://linear.app/team/issue/PROJ-3/third">PROJ-3</a>
        `,
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(3)
    // Sort results since HTML patterns are processed before Markdown patterns
    expect(tickets.map((t) => t.name).sort()).toEqual([
      'PROJ-1',
      'PROJ-2',
      'PROJ-3',
    ])
  })

  it('deduplicates tickets with same name and URL', () => {
    const comments = [
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: `
          <a href="https://linear.app/team/issue/PROJ-1/same">PROJ-1</a>
          <a href="https://linear.app/team/issue/PROJ-1/same">PROJ-1</a>
        `,
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(1)
  })

  it('ignores comments from non-Linear bot users', () => {
    const comments = [
      {
        author: { login: 'regular-user', type: 'User' },
        body: 'Check out [PROJ-999](https://linear.app/team/issue/PROJ-999/fake)',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(0)
  })

  it('returns empty array for empty comments', () => {
    const tickets = scmLib.extractLinearTicketsFromComments([])
    expect(tickets).toHaveLength(0)
  })

  it('returns empty array when author is null', () => {
    const comments = [
      {
        author: null,
        body: '<a href="https://linear.app/team/issue/PROJ-123/test">PROJ-123</a>',
      },
    ]

    const tickets = scmLib.extractLinearTicketsFromComments(comments)

    expect(tickets).toHaveLength(0)
  })

  it('matches GitHub SCMLib implementation for same input', () => {
    // This test verifies that GitLab and GitHub implementations produce consistent results
    const gitlabLib = new GitlabSCMLib(undefined, undefined, undefined)
    const githubLib = new GithubSCMLib(undefined, undefined, undefined)

    const comments = [
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: `
          <a href="https://linear.app/team/issue/PROJ-1/first-task">PROJ-1</a>
          [PROJ-2](https://linear.app/team/issue/PROJ-2/second-task)
        `,
      },
    ]

    const gitlabTickets = gitlabLib.extractLinearTicketsFromComments(comments)
    const githubTickets = githubLib.extractLinearTicketsFromComments(comments)

    expect(gitlabTickets).toEqual(githubTickets)
  })
})

// ============================================================================
// Integration tests for GitLab helper functions
// ============================================================================

describe('gitlabValidateParams', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('does not throw for valid params', async () => {
    await expect(
      gitlabValidateParams({
        url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
        accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      })
    ).resolves.not.toThrow()
  })

  it('throws for invalid access token', async () => {
    await expect(
      gitlabValidateParams({
        url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
        accessToken: 'glpat-invalid-token',
      })
    ).rejects.toThrow()
  })
})

describe('getGitlabUsername', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns a non-empty username string', async () => {
    const username = await getGitlabUsername(
      env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      env.PLAYWRIGHT_GL_CLOUD_PAT
    )
    expect(typeof username).toBe('string')
    expect(username.length).toBeGreaterThan(0)
  })
})

describe('getGitlabIsUserCollaborator', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns true for a user with access', async () => {
    const result = await getGitlabIsUserCollaborator({
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
    })
    expect(result).toBe(true)
  })
})

describe('getGitlabIsRemoteBranch', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns true for an existing branch', async () => {
    const result = await getGitlabIsRemoteBranch({
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      branch: 'main',
    })
    expect(result).toBe(true)
  })

  it('returns false for a non-existing branch', async () => {
    const result = await getGitlabIsRemoteBranch({
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      branch: 'this-branch-does-not-exist-xyz',
    })
    expect(result).toBe(false)
  })
})

describe('searchGitlabProjects', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns a paginated list of projects with correct data', async () => {
    const result = await searchGitlabProjects({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      perPage: 5,
      page: 1,
    })

    // Test account (mobbcitestjob) has exactly 1 project
    expect(result.projects.length).toBe(1)
    expect(result.hasMore).toBe(false)

    const project = result.projects[0]!
    expect(project.id).toBe(63143892)
    expect(project.path).toBe('webgoat')
    expect(project.web_url).toBe('https://gitlab.com/mobbcitestjob/webgoat')
    expect(project.namespace_name).toBe('mobb citest')
    expect(project.visibility).toBe('private')
    // last_activity_at changes with each test run, verify it's a valid ISO date
    expect(new Date(project.last_activity_at).getTime()).not.toBeNaN()
  })
})

describe('getGitlabMergeRequest', () => {
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 1,
    })
    if (result.items.length > 0) {
      testMrNumber = result.items[0]!.iid
    }
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns MR details with expected fields', async () => {
    if (testMrNumber === null) {
      console.log('No MRs found, skipping test')
      return
    }

    const mr = await getGitlabMergeRequest({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      prNumber: testMrNumber,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
    })

    expect(mr.iid).toBe(testMrNumber)
    expect(mr.title.length).toBeGreaterThan(0)
    expect(['opened', 'closed', 'merged']).toContain(mr.state)
    expect(new Date(mr.created_at).getTime()).not.toBeNaN()
    expect(mr.source_branch.length).toBeGreaterThan(0)
    expect(mr.target_branch).toBe('main')
  })
})

describe('getGitlabCommitUrl', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns commit data with web_url', async () => {
    const result = await getGitlabCommitUrl({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      commitSha: GITLAB_TEST_COMMIT_SHA,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
    })

    expect(result.web_url).toBe(
      'https://gitlab.com/mobbcitestjob/webgoat/-/commit/5357a65e054976cd7d79b81ef3906ded050ed921'
    )
  })
})

describe('searchGitlabMergeRequests', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns paginated MR results with expected fields', async () => {
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 5,
    })

    expect(result.items.length).toBeGreaterThan(0)
    expect(result.items.length).toBeLessThanOrEqual(5)

    const mr = result.items[0]!
    expect(mr.iid).toBeGreaterThan(0)
    expect(mr.title.length).toBeGreaterThan(0)
    expect(['opened', 'closed', 'merged']).toContain(mr.state)
    expect(mr.sourceBranch.length).toBeGreaterThan(0)
    expect(mr.targetBranch).toBe('main')
    expect(new Date(mr.createdAt).getTime()).not.toBeNaN()
    expect(new Date(mr.updatedAt).getTime()).not.toBeNaN()
  })

  it('respects state filter', async () => {
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'merged',
      perPage: 3,
    })

    for (const mr of result.items) {
      expect(mr.state).toBe('merged')
    }
  })
})

describe('getGitlabMrCommitsBatch', () => {
  let testMrNumbers: number[] = []

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 2,
    })
    testMrNumbers = result.items.map((mr) => mr.iid)
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns commit SHAs for each MR', async () => {
    if (testMrNumbers.length === 0) {
      console.log('No MRs found, skipping test')
      return
    }

    const result = await getGitlabMrCommitsBatch({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      mrNumbers: testMrNumbers,
    })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(testMrNumbers.length)
    for (const mrNumber of testMrNumbers) {
      expect(result.has(mrNumber)).toBe(true)
      const shas = result.get(mrNumber)!
      expect(Array.isArray(shas)).toBe(true)
      expect(shas.length).toBeGreaterThan(0)
      // Commit SHAs are 40-char hex strings
      expect(shas[0]).toMatch(/^[0-9a-f]{40}$/)
    }
  })

  it('returns empty map for empty input', async () => {
    const result = await getGitlabMrCommitsBatch({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      mrNumbers: [],
    })
    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
  })
})

describe('getGitlabMrDataBatch', () => {
  let testMrNumbers: number[] = []

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 2,
    })
    testMrNumbers = result.items.map((mr) => mr.iid)
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns changedLines and comments for each MR', async () => {
    if (testMrNumbers.length === 0) {
      console.log('No MRs found, skipping test')
      return
    }

    const result = await getGitlabMrDataBatch({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      mrNumbers: testMrNumbers,
    })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(testMrNumbers.length)
    for (const mrNumber of testMrNumbers) {
      expect(result.has(mrNumber)).toBe(true)
      const data = result.get(mrNumber)!
      expect(data.changedLines.additions).toBeGreaterThanOrEqual(0)
      expect(data.changedLines.deletions).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(data.comments)).toBe(true)
      expect(Object.keys(data.changedLines).sort()).toEqual([
        'additions',
        'deletions',
      ])
    }
  })
})

describe('getGitlabMergeRequestMetrics', () => {
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 1,
    })
    if (result.items.length > 0) {
      testMrNumber = result.items[0]!.iid
    }
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns all expected metric fields', async () => {
    if (testMrNumber === null) {
      console.log('No MRs found, skipping test')
      return
    }

    const metrics = await getGitlabMergeRequestMetrics({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      prNumber: testMrNumber,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
    })

    expect(['opened', 'closed', 'merged']).toContain(metrics.state)
    expect(metrics.isDraft).toBe(false)
    expect(new Date(metrics.createdAt).getTime()).not.toBeNaN()
    expect(metrics.linesAdded).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(metrics.commentIds)).toBe(true)
    // mergedAt is null for non-merged MRs, or a valid date string for merged ones
    if (metrics.mergedAt !== null) {
      expect(new Date(metrics.mergedAt).getTime()).not.toBeNaN()
    } else {
      expect(metrics.mergedAt).toBeNull()
    }
  })
})

describe('GitlabSCMLib - getPullRequestMetrics', () => {
  let scmLib: GitlabSCMLib
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    scmLib = (await createScmLib({
      url: GITLAB_TEST_URL,
      scmType: ScmLibScmType.GITLAB,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      scmOrg: undefined,
    })) as GitlabSCMLib

    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'all',
      perPage: 1,
    })
    if (result.items.length > 0) {
      testMrNumber = result.items[0]!.iid
    }
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns PullRequestMetrics with all required fields', async () => {
    if (testMrNumber === null) {
      console.log('No MRs found, skipping test')
      return
    }

    const metrics = await scmLib.getPullRequestMetrics(testMrNumber)

    expect(metrics.prId).toBe(String(testMrNumber))
    expect(metrics.repositoryUrl).toBe(
      'https://gitlab.com/mobbcitestjob/webgoat'
    )
    expect(metrics.prCreatedAt).toBeInstanceOf(Date)
    expect(isNaN(metrics.prCreatedAt.getTime())).toBe(false)
    expect(metrics.linesAdded).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(metrics.commentIds)).toBe(true)
    expect(['ACTIVE', 'CLOSED', 'MERGED', 'DRAFT']).toContain(metrics.prStatus)

    if (metrics.prMergedAt !== null) {
      expect(metrics.prMergedAt).toBeInstanceOf(Date)
      expect(isNaN(metrics.prMergedAt.getTime())).toBe(false)
    } else {
      expect(metrics.prMergedAt).toBeNull()
    }
  })
})

describe('GitlabSCMLib - searchSubmitRequests', () => {
  let scmLib: GitlabSCMLib

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    scmLib = (await createScmLib({
      url: GITLAB_TEST_URL,
      scmType: ScmLibScmType.GITLAB,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      scmOrg: undefined,
    })) as GitlabSCMLib
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns paginated results via SCMLib interface', async () => {
    const result = await scmLib.searchSubmitRequests({
      repoUrl: GITLAB_TEST_URL,
      filters: { state: 'all' },
      limit: 3,
    })

    expect(result.results.length).toBeGreaterThan(0)
    expect(result.results.length).toBeLessThanOrEqual(3)

    const pr = result.results[0]!
    expect(Number(pr.submitRequestId)).toBeGreaterThan(0)
    expect(pr.title.length).toBeGreaterThan(0)
    expect(['open', 'closed', 'merged']).toContain(pr.status)
    expect(pr.sourceBranch.length).toBeGreaterThan(0)
    expect(pr.targetBranch).toBe('main')
    expect(pr.createdAt).toBeInstanceOf(Date)
    expect(isNaN(pr.createdAt.getTime())).toBe(false)
  })
})

describe('createMarkdownCommentOnPullRequest', () => {
  // Note: This is a write operation test. We create a comment and verify it doesn't throw.
  // The comment is created on a real MR - consider cleanup in afterAll if needed.
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const result = await searchGitlabMergeRequests({
      repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
      state: 'opened',
      perPage: 1,
    })
    if (result.items.length > 0) {
      testMrNumber = result.items[0]!.iid
    }
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('creates a comment without throwing', async () => {
    if (testMrNumber === null) {
      console.log('No open MRs found, skipping write test')
      return
    }

    await expect(
      createMarkdownCommentOnPullRequest({
        accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
        repoUrl: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
        mrNumber: testMrNumber,
        markdownComment: `_Integration test comment - ${new Date().toISOString()}_`,
      })
    ).resolves.not.toThrow()
  })
})
