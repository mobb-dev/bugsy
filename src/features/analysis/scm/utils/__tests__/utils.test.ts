import { describe, expect, it } from 'vitest'

import {
  extractLinearTicketsFromComments,
  isLinearBotComment,
  normalizeUrl,
} from '../'

const github = {
  urls: [
    'https://github.com/HCL-TECH-SOFTWARE/AltoroJ//',
    'https://github.com/HCL-TECH-SOFTWARE/AltoroJ.git',
    'git@github.com:HCL-TECH-SOFTWARE/AltoroJ.git',
    'https://haggai-mobb@github.com/HCL-TECH-SOFTWARE/AltoroJ.git',
  ],
  NOMALIZED_URL: 'https://github.com/HCL-TECH-SOFTWARE/AltoroJ',
} as const
const bitbucket = {
  urls: [
    'https://haggai-mobb@bitbucket.org/workspace/repo_slug.git',
    'git@bitbucket.org:workspace/repo_slug.git',
  ],
  NOMALIZED_URL: 'https://bitbucket.org/workspace/repo_slug',
} as const

describe('normalizeUrl', () => {
  it('should return to correct normalizedUrl', () => {
    github.urls.forEach((url) => {
      expect(normalizeUrl(url)).toBe(github.NOMALIZED_URL)
    })
    bitbucket.urls.forEach((url) => {
      expect(normalizeUrl(url)).toBe(bitbucket.NOMALIZED_URL)
    })
    // somethimes the url is not a valid url (zip upload) so it should return the same url
    expect(normalizeUrl('random-string')).toBe('random-string')
    expect(
      normalizeUrl('https://dev.azure.com/azure-org/proj/_git/webgoat.git')
    ).toBe('https://dev.azure.com/azure-org/proj/_git/webgoat')
  })
})

describe('isLinearBotComment', () => {
  it('returns true for linear[bot] login', () => {
    expect(
      isLinearBotComment({
        author: { login: 'linear[bot]', type: 'Bot' },
        body: '',
      })
    ).toBe(true)
  })

  it('returns true for linear login (GitLab integration account)', () => {
    expect(
      isLinearBotComment({
        author: { login: 'linear', type: 'User' },
        body: '',
      })
    ).toBe(true)
  })

  it('returns true for Bot type with linear in login', () => {
    expect(
      isLinearBotComment({
        author: { login: 'linear-integration', type: 'Bot' },
        body: '',
      })
    ).toBe(true)
  })

  it('is case-insensitive for login', () => {
    expect(
      isLinearBotComment({
        author: { login: 'Linear[bot]', type: 'Bot' },
        body: '',
      })
    ).toBe(true)
  })

  it('returns false for non-Linear bot', () => {
    expect(
      isLinearBotComment({
        author: { login: 'github-actions[bot]', type: 'Bot' },
        body: '',
      })
    ).toBe(false)
  })

  it('returns false for regular user with "linearfan" login', () => {
    expect(
      isLinearBotComment({
        author: { login: 'linearfan', type: 'User' },
        body: '',
      })
    ).toBe(false)
  })

  it('returns false when author is null', () => {
    expect(isLinearBotComment({ author: null, body: '' })).toBe(false)
  })

  it('returns false for dependabot', () => {
    expect(
      isLinearBotComment({
        author: { login: 'dependabot[bot]', type: 'Bot' },
        body: '',
      })
    ).toBe(false)
  })
})

describe('extractLinearTicketsFromComments', () => {
  it('extracts tickets from linear[bot] comments', () => {
    const tickets = extractLinearTicketsFromComments([
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: '<a href="https://linear.app/team/issue/PROJ-123/fix-bug">PROJ-123</a>',
      },
    ])

    expect(tickets).toHaveLength(1)
    expect(tickets[0]).toEqual({
      name: 'PROJ-123',
      title: 'fix bug',
      url: 'https://linear.app/team/issue/PROJ-123/fix-bug',
    })
  })

  it('ignores non-Linear bot comments even if body contains Linear URLs (GitHub bug fix)', () => {
    const tickets = extractLinearTicketsFromComments([
      {
        author: { login: 'github-actions[bot]', type: 'Bot' },
        body: 'Check <a href="https://linear.app/team/issue/PROJ-999/task">PROJ-999</a>',
      },
    ])

    expect(tickets).toHaveLength(0)
  })

  it('deduplicates tickets across multiple comments', () => {
    const tickets = extractLinearTicketsFromComments([
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: '<a href="https://linear.app/team/issue/PROJ-1/task">PROJ-1</a>',
      },
      {
        author: { login: 'linear[bot]', type: 'Bot' },
        body: '<a href="https://linear.app/team/issue/PROJ-1/task">PROJ-1</a>',
      },
    ])

    expect(tickets).toHaveLength(1)
  })

  it('extracts tickets from GitLab linear user without [bot] suffix', () => {
    const tickets = extractLinearTicketsFromComments([
      {
        author: { login: 'linear', type: 'User' },
        body: '<a href="https://linear.app/team/issue/ABC-789/task">ABC-789</a>',
      },
    ])

    expect(tickets).toHaveLength(1)
    expect(tickets[0]?.name).toBe('ABC-789')
  })

  it('returns empty array for empty comments', () => {
    expect(extractLinearTicketsFromComments([])).toHaveLength(0)
  })
})
