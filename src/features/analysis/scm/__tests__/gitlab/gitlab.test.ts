import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { GithubSCMLib } from '../../github/GithubSCMLib'
import { GetGitlabTokenParams, GitlabTokenRequestTypeEnum } from '../../gitlab'
import {
  createMarkdownCommentOnPullRequest,
  getGitlabBranchList,
  getGitlabCommitDiff,
  getGitlabCommitUrl,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequest,
  getGitlabMergeRequestDiff,
  getGitlabMergeRequestLinesAdded,
  getGitlabMergeRequestMetrics,
  getGitlabMrCommitsBatch,
  getGitlabMrDataBatch,
  getGitlabRecentCommits,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabRepoList,
  getGitlabToken,
  getGitlabUsername,
  gitlabValidateParams,
  parseGitlabOwnerAndRepo,
  searchGitlabMergeRequests,
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
      expect(status).toHaveProperty('remaining')
      expect(status).toHaveProperty('reset')
      expect(typeof status.remaining).toBe('number')
      expect(status.reset).toBeInstanceOf(Date)
    }
    // Note: Some GitLab instances may not return rate limit headers
  })

  it('getRecentCommits returns commits since a given date', async () => {
    // Use a date in the past that has commits
    const since = new Date('2019-01-01T00:00:00Z').toISOString()
    const result = await scmLib.getRecentCommits(since)

    expect(result).toHaveProperty('data')
    expect(Array.isArray(result.data)).toBe(true)

    // The repo should have commits since 2019
    if (result.data.length > 0) {
      const commit = result.data[0]!
      expect(commit).toHaveProperty('sha')
      expect(typeof commit.sha).toBe('string')
      expect(commit).toHaveProperty('commit')
      expect(commit.commit).toHaveProperty('author')
    }
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

    if (commits.length > 0) {
      const commit = commits[0]!
      expect(commit).toHaveProperty('sha')
      expect(commit).toHaveProperty('commit')
      expect(commit.commit).toHaveProperty('committer')
      expect(commit.commit).toHaveProperty('author')
      expect(commit.commit).toHaveProperty('message')
      expect(commit).toHaveProperty('parents')
      expect(Array.isArray(commit.parents)).toBe(true)
    }
  })
})

describe('getGitlabCommitDiff - helper function', () => {
  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns commit diff with all required fields', async () => {
    const result = await getGitlabCommitDiff({
      repoUrl: GITLAB_TEST_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT!,
      commitSha: GITLAB_TEST_COMMIT_SHA,
    })

    expect(result).toHaveProperty('diff')
    expect(result).toHaveProperty('commitTimestamp')
    expect(result).toHaveProperty('commitSha')
    expect(result).toHaveProperty('authorName')
    expect(result).toHaveProperty('authorEmail')
    expect(result).toHaveProperty('message')
    expect(typeof result.diff).toBe('string')
    expect(result.commitTimestamp).toBeInstanceOf(Date)
    expect(result.commitSha).toBe(GITLAB_TEST_COMMIT_SHA)
  })

  it('diff contains expected unified diff format elements', async () => {
    const result = await getGitlabCommitDiff({
      repoUrl: GITLAB_TEST_URL,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT!,
      commitSha: GITLAB_TEST_COMMIT_SHA,
    })

    // The diff should contain standard unified diff elements
    // (diff header, file paths, or hunk markers)
    const hasGitDiffHeader = result.diff.includes('diff --git')
    const hasFilePaths =
      result.diff.includes('---') || result.diff.includes('+++')
    const hasHunkMarkers = result.diff.includes('@@')

    // At least one of these should be present for a valid diff
    expect(hasGitDiffHeader || hasFilePaths || hasHunkMarkers).toBe(true)
  })
})

describe('GitlabSCMLib - getCommitDiff method', () => {
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

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns commit diff with required GetCommitDiffResult fields', async () => {
    const result = await scmLib.getCommitDiff(GITLAB_TEST_COMMIT_SHA)

    expect(result).toHaveProperty('diff')
    expect(result).toHaveProperty('commitTimestamp')
    expect(result).toHaveProperty('commitSha')
    expect(typeof result.diff).toBe('string')
    expect(result.commitTimestamp).toBeInstanceOf(Date)
    expect(result.commitSha).toBe(GITLAB_TEST_COMMIT_SHA)
  })
})

describe('getGitlabMergeRequestDiff - helper function', () => {
  // Use the same test repo that works for other GitLab tests
  const testRepoUrl = GITLAB_TEST_URL
  const testAccessToken = env.PLAYWRIGHT_GL_CLOUD_PAT
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

    try {
      const result = await searchGitlabMergeRequests({
        repoUrl: testRepoUrl,
        accessToken: testAccessToken,
        state: 'all',
        perPage: 1,
      })

      if (result.items.length > 0) {
        testMrNumber = result.items[0]!.iid
      }
    } catch (error) {
      console.log('Failed to fetch MRs:', error)
    }
  }, 60000)

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns MR diff with all required fields', async () => {
    if (testMrNumber === null) {
      console.log('No merge requests found in test repo, skipping test')
      return
    }

    const result = await getGitlabMergeRequestDiff({
      repoUrl: testRepoUrl,
      accessToken: testAccessToken,
      mrNumber: testMrNumber,
    })

    expect(result).toHaveProperty('diff')
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
    expect(result).toHaveProperty('submitRequestId')
    expect(result).toHaveProperty('submitRequestNumber')
    expect(result).toHaveProperty('sourceBranch')
    expect(result).toHaveProperty('targetBranch')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('commits')
    expect(result).toHaveProperty('diffLines')

    expect(typeof result.diff).toBe('string')
    expect(result.diff).toContain('diff --git')
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.updatedAt).toBeInstanceOf(Date)
    expect(result.submitRequestNumber).toBe(testMrNumber)
    expect(Array.isArray(result.commits)).toBe(true)
    expect(Array.isArray(result.diffLines)).toBe(true)
  }, 60000)

  it('returns commits with correct structure', async () => {
    if (testMrNumber === null) {
      console.log('No merge requests found in test repo, skipping test')
      return
    }

    const result = await getGitlabMergeRequestDiff({
      repoUrl: testRepoUrl,
      accessToken: testAccessToken,
      mrNumber: testMrNumber,
    })

    if (result.commits.length > 0) {
      const commit = result.commits[0]!
      expect(commit).toHaveProperty('diff')
      expect(commit).toHaveProperty('commitTimestamp')
      expect(commit).toHaveProperty('commitSha')
      expect(commit).toHaveProperty('authorName')
      expect(commit).toHaveProperty('message')
      expect(typeof commit.diff).toBe('string')
      expect(commit.commitTimestamp).toBeInstanceOf(Date)
      expect(typeof commit.commitSha).toBe('string')
    }
  }, 60000)

  it('returns diffLines attribution for added lines', async () => {
    if (testMrNumber === null) {
      console.log('No merge requests found in test repo, skipping test')
      return
    }

    const result = await getGitlabMergeRequestDiff({
      repoUrl: testRepoUrl,
      accessToken: testAccessToken,
      mrNumber: testMrNumber,
    })

    // diffLines should be an array (may be empty if MR has no additions)
    expect(Array.isArray(result.diffLines)).toBe(true)

    if (result.diffLines.length > 0) {
      const diffLine = result.diffLines[0]!
      expect(diffLine).toHaveProperty('file')
      expect(diffLine).toHaveProperty('line')

      expect(typeof diffLine.file).toBe('string')
      expect(typeof diffLine.line).toBe('number')
    }
  }, 60000)
})

describe('GitlabSCMLib - getSubmitRequestDiff method', () => {
  let scmLib: GitlabSCMLib | null = null
  // Use the same test repo that works for other GitLab tests
  const testRepoUrl = GITLAB_TEST_URL
  const testAccessToken = env.PLAYWRIGHT_GL_CLOUD_PAT
  let testMrNumber: number | null = null

  beforeAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

    try {
      const result = await searchGitlabMergeRequests({
        repoUrl: testRepoUrl,
        accessToken: testAccessToken,
        state: 'all',
        perPage: 1,
      })

      if (result.items.length > 0) {
        testMrNumber = result.items[0]!.iid
      }

      scmLib = (await createScmLib({
        url: testRepoUrl,
        scmType: ScmLibScmType.GITLAB,
        accessToken: testAccessToken,
        scmOrg: undefined,
      })) as GitlabSCMLib
    } catch (error) {
      console.log('Failed to setup SCMLib:', error)
    }
  }, 60000)

  afterAll(async () => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns MR diff via SCMLib interface', async () => {
    if (testMrNumber === null || scmLib === null) {
      console.log(
        'No merge requests found or SCMLib not initialized, skipping test'
      )
      return
    }

    const result = await scmLib.getSubmitRequestDiff(String(testMrNumber))

    expect(result).toHaveProperty('diff')
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
    expect(result).toHaveProperty('submitRequestId')
    expect(result).toHaveProperty('submitRequestNumber')
    expect(result).toHaveProperty('sourceBranch')
    expect(result).toHaveProperty('targetBranch')
    expect(result).toHaveProperty('commits')
    expect(result).toHaveProperty('diffLines')

    expect(result.submitRequestNumber).toBe(testMrNumber)
  }, 60000)
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

describe('getGitlabRepoList', () => {
  beforeAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  })
  afterAll(() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  })

  it('returns a non-empty list of repos', async () => {
    const repos = await getGitlabRepoList(
      env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      env.PLAYWRIGHT_GL_CLOUD_PAT
    )
    expect(Array.isArray(repos)).toBe(true)
    expect(repos.length).toBeGreaterThan(0)

    const repo = repos[0]!
    expect(repo).toHaveProperty('repoName')
    expect(repo).toHaveProperty('repoUrl')
    expect(repo).toHaveProperty('repoOwner')
    expect(typeof repo.repoName).toBe('string')
    expect(typeof repo.repoUrl).toBe('string')
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

    expect(mr).toHaveProperty('iid', testMrNumber)
    expect(mr).toHaveProperty('title')
    expect(mr).toHaveProperty('state')
    expect(mr).toHaveProperty('created_at')
    expect(mr).toHaveProperty('source_branch')
    expect(mr).toHaveProperty('target_branch')
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

    expect(result).toHaveProperty('web_url')
    expect(typeof result.web_url).toBe('string')
    expect(result.web_url).toContain(GITLAB_TEST_COMMIT_SHA)
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

    expect(result).toHaveProperty('items')
    expect(result).toHaveProperty('hasMore')
    expect(Array.isArray(result.items)).toBe(true)
    expect(result.items.length).toBeGreaterThan(0)
    expect(result.items.length).toBeLessThanOrEqual(5)

    const mr = result.items[0]!
    expect(mr).toHaveProperty('iid')
    expect(mr).toHaveProperty('title')
    expect(mr).toHaveProperty('state')
    expect(mr).toHaveProperty('sourceBranch')
    expect(mr).toHaveProperty('targetBranch')
    expect(mr).toHaveProperty('createdAt')
    expect(mr).toHaveProperty('updatedAt')
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
    for (const mrNumber of testMrNumbers) {
      expect(result.has(mrNumber)).toBe(true)
      const shas = result.get(mrNumber)!
      expect(Array.isArray(shas)).toBe(true)
      if (shas.length > 0) {
        expect(typeof shas[0]).toBe('string')
        expect(shas[0]!.length).toBeGreaterThan(0)
      }
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
    for (const mrNumber of testMrNumbers) {
      expect(result.has(mrNumber)).toBe(true)
      const data = result.get(mrNumber)!
      expect(data).toHaveProperty('changedLines')
      expect(data.changedLines).toHaveProperty('additions')
      expect(data.changedLines).toHaveProperty('deletions')
      expect(typeof data.changedLines.additions).toBe('number')
      expect(typeof data.changedLines.deletions).toBe('number')
      expect(data).toHaveProperty('comments')
      expect(Array.isArray(data.comments)).toBe(true)
    }
  })
})

describe('getGitlabMergeRequestLinesAdded', () => {
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

  it('returns a non-negative number of lines added', async () => {
    if (testMrNumber === null) {
      console.log('No MRs found, skipping test')
      return
    }

    const linesAdded = await getGitlabMergeRequestLinesAdded({
      url: env.PLAYWRIGHT_GL_CLOUD_REPO_URL,
      prNumber: testMrNumber,
      accessToken: env.PLAYWRIGHT_GL_CLOUD_PAT,
    })

    expect(typeof linesAdded).toBe('number')
    expect(linesAdded).toBeGreaterThanOrEqual(0)
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

    expect(metrics).toHaveProperty('state')
    expect(metrics).toHaveProperty('isDraft')
    expect(metrics).toHaveProperty('createdAt')
    expect(metrics).toHaveProperty('mergedAt')
    expect(metrics).toHaveProperty('linesAdded')
    expect(metrics).toHaveProperty('commitsCount')
    expect(metrics).toHaveProperty('commitShas')
    expect(metrics).toHaveProperty('firstCommitDate')
    expect(metrics).toHaveProperty('commentIds')

    expect(typeof metrics.state).toBe('string')
    expect(typeof metrics.isDraft).toBe('boolean')
    expect(typeof metrics.createdAt).toBe('string')
    expect(typeof metrics.linesAdded).toBe('number')
    expect(metrics.linesAdded).toBeGreaterThanOrEqual(0)
    expect(typeof metrics.commitsCount).toBe('number')
    expect(metrics.commitsCount).toBeGreaterThan(0)
    expect(Array.isArray(metrics.commitShas)).toBe(true)
    expect(metrics.commitShas.length).toBe(metrics.commitsCount)
    expect(Array.isArray(metrics.commentIds)).toBe(true)

    // firstCommitDate should be a string (ISO date) or null
    if (metrics.firstCommitDate !== null) {
      expect(typeof metrics.firstCommitDate).toBe('string')
      expect(new Date(metrics.firstCommitDate).getTime()).not.toBeNaN()
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

    expect(metrics).toHaveProperty('prId', String(testMrNumber))
    expect(metrics).toHaveProperty('repositoryUrl')
    expect(metrics).toHaveProperty('prCreatedAt')
    expect(metrics).toHaveProperty('prMergedAt')
    expect(metrics).toHaveProperty('firstCommitDate')
    expect(metrics).toHaveProperty('linesAdded')
    expect(metrics).toHaveProperty('commitsCount')
    expect(metrics).toHaveProperty('commitShas')
    expect(metrics).toHaveProperty('prStatus')
    expect(metrics).toHaveProperty('commentIds')

    expect(metrics.prCreatedAt).toBeInstanceOf(Date)
    expect(isNaN(metrics.prCreatedAt.getTime())).toBe(false)
    expect(typeof metrics.linesAdded).toBe('number')
    expect(metrics.linesAdded).toBeGreaterThanOrEqual(0)
    expect(typeof metrics.commitsCount).toBe('number')
    expect(metrics.commitsCount).toBeGreaterThan(0)
    expect(Array.isArray(metrics.commitShas)).toBe(true)
    expect(metrics.commitShas.length).toBe(metrics.commitsCount)
    expect(Array.isArray(metrics.commentIds)).toBe(true)

    // prStatus should be a valid enum value
    const validStatuses = ['ACTIVE', 'CLOSED', 'MERGED', 'DRAFT']
    expect(validStatuses).toContain(metrics.prStatus)

    if (metrics.firstCommitDate !== null) {
      expect(metrics.firstCommitDate).toBeInstanceOf(Date)
      expect(isNaN(metrics.firstCommitDate.getTime())).toBe(false)
    }

    if (metrics.prMergedAt !== null) {
      expect(metrics.prMergedAt).toBeInstanceOf(Date)
      expect(isNaN(metrics.prMergedAt.getTime())).toBe(false)
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

    expect(result).toHaveProperty('results')
    expect(result).toHaveProperty('hasMore')
    expect(Array.isArray(result.results)).toBe(true)
    expect(result.results.length).toBeGreaterThan(0)
    expect(result.results.length).toBeLessThanOrEqual(3)

    const pr = result.results[0]!
    expect(pr).toHaveProperty('submitRequestId')
    expect(pr).toHaveProperty('title')
    expect(pr).toHaveProperty('status')
    expect(pr).toHaveProperty('sourceBranch')
    expect(pr).toHaveProperty('targetBranch')
    expect(pr).toHaveProperty('createdAt')
    expect(pr.createdAt).toBeInstanceOf(Date)
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
