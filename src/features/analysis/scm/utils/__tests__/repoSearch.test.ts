import { describe, expect, it } from 'vitest'

import {
  buildGithubRepoSearchQuery,
  escapeBitbucketFilterValue,
  githubOwnerQualifier,
  repoMatchesSearch,
  sanitizeGithubRepoNameQuery,
} from '../repoSearch'

describe('sanitizeGithubRepoNameQuery', () => {
  it('strips qualifier separators so typed org: cannot hijack Search', () => {
    expect(sanitizeGithubRepoNameQuery('org:other autofixer')).toBe(
      'org other autofixer'
    )
  })
})

describe('buildGithubRepoSearchQuery', () => {
  it('includes forks and scopes to the owner', () => {
    expect(
      buildGithubRepoSearchQuery({
        nameQuery: 'engine',
        ownerQualifiers: ['org:mobb-dev'],
      })
    ).toBe('fork:true engine in:name org:mobb-dev')
  })
})

describe('githubOwnerQualifier', () => {
  it('strips anything that is not a GitHub login character', () => {
    expect(githubOwnerQualifier('mobb-dev', 'Organization')).toBe(
      'org:mobb-dev'
    )
    // A crafted scmOwner must not smuggle in a second qualifier.
    expect(githubOwnerQualifier('mobb fork:only', 'User')).toBe(
      'user:mobbforkonly'
    )
  })
})

describe('repoMatchesSearch', () => {
  it('matches on repo name substring', () => {
    expect(
      repoMatchesSearch(
        { repoName: 'autofixer', repoOwner: 'mobb-dev' },
        'auto'
      )
    ).toBe(true)
    expect(
      repoMatchesSearch({ repoName: 'engine', repoOwner: 'mobb-dev' }, 'tracy')
    ).toBe(false)
  })

  it('does NOT match on the owner alone — owner-uniform lists would match everything', () => {
    // Fallback lists are usually a single drained org: matching the bare owner
    // made 'mob' match all 8,000 repos of org 'mobb'.
    expect(
      repoMatchesSearch({ repoName: 'engine', repoOwner: 'mobb-dev' }, 'mobb')
    ).toBe(false)
  })

  it("matches owner/name only when the query itself contains '/'", () => {
    expect(
      repoMatchesSearch(
        { repoName: 'autofixer', repoOwner: 'mobb-dev' },
        'mobb-dev/auto'
      )
    ).toBe(true)
    expect(
      repoMatchesSearch(
        { repoName: 'autofixer', repoOwner: 'mobb-dev' },
        'other-org/auto'
      )
    ).toBe(false)
  })
})

describe('escapeBitbucketFilterValue', () => {
  it('escapes quotes used by q=name~', () => {
    expect(escapeBitbucketFilterValue('foo"bar')).toBe('foo\\"bar')
  })
})

describe('buildGithubRepoSearchQuery owner packing', () => {
  it('keeps a realistic org list intact rather than truncating it', () => {
    const orgs = Array.from({ length: 40 }, (_, i) =>
      githubOwnerQualifier(`org-number-${i}`, 'Organization')
    )
    const q = buildGithubRepoSearchQuery({
      nameQuery: 'engine',
      ownerQualifiers: orgs,
    })
    for (const org of orgs) {
      expect(q).toContain(org)
    }
  })

  it('drops qualifiers it did not build', () => {
    expect(
      buildGithubRepoSearchQuery({
        ownerQualifiers: ['org:mobb-dev', 'fork:only', 'is:public'],
      })
    ).toBe('fork:true org:mobb-dev')
  })
})
