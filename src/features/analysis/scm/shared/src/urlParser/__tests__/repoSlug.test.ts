import { describe, expect, it } from 'vitest'

import { getRepoSlug, normalizeRepoUrl } from '../repoSlug'

describe('normalizeRepoUrl', () => {
  it('returns canonical URL for valid GitHub URLs', () => {
    expect(normalizeRepoUrl('https://github.com/Org/Repo')).toBe(
      'https://github.com/org/repo'
    )
  })

  it('normalizes mixed-case GitHub URLs', () => {
    expect(normalizeRepoUrl('https://github.com/MyOrg/MyRepo')).toBe(
      'https://github.com/myorg/myrepo'
    )
  })

  it('handles SSH URLs', () => {
    expect(normalizeRepoUrl('git@github.com:Org/Repo.git')).toBe(
      'https://github.com/org/repo'
    )
  })

  it('throws for unparseable URLs', () => {
    expect(() => normalizeRepoUrl('not-a-valid-url')).toThrow(
      '[normalizeRepoUrl] failed to parse repo URL: not-a-valid-url'
    )
  })

  it('throws for empty string', () => {
    expect(() => normalizeRepoUrl('')).toThrow(
      '[normalizeRepoUrl] failed to parse repo URL: '
    )
  })
})

describe('getRepoSlug', () => {
  it('returns slug for valid GitHub URL', () => {
    expect(getRepoSlug('https://github.com/org/repo')).toBe(
      'github-com-org-repo'
    )
  })

  it('throws for invalid URL', () => {
    expect(() => getRepoSlug('not-a-url')).toThrow('Invalid repository URL')
  })
})
