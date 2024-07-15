import { describe, expect, it } from 'vitest'

import { normalizeUrl } from '../'

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
