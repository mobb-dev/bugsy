import { describe, expect, it } from 'vitest'

import { fileUriToFsPath } from '../url'

describe('fileUriToFsPath', () => {
  it('converts a POSIX file:// URI', () => {
    expect(fileUriToFsPath('file:///Users/test/foo.ts')).toBe(
      '/Users/test/foo.ts'
    )
  })

  it('converts a Windows URI with literal colon', () => {
    expect(fileUriToFsPath('file:///C:/Users/test/foo.ts')).toMatch(
      /^[Cc]:[\\/]Users[\\/]test[\\/]foo\.ts$/
    )
  })

  it('converts a Windows URI with %3A-encoded colon', () => {
    expect(fileUriToFsPath('file:///c%3A/Users/test/foo.ts')).toMatch(
      /^[Cc]:[\\/]Users[\\/]test[\\/]foo\.ts$/
    )
  })

  it('handles %3a (lowercase a) encoding', () => {
    expect(fileUriToFsPath('file:///c%3a/Users/test/foo.ts')).toMatch(
      /^[Cc]:[\\/]Users[\\/]test[\\/]foo\.ts$/
    )
  })

  it('decodes encoded spaces (%20)', () => {
    expect(fileUriToFsPath('file:///Users/test/my%20project/foo.ts')).toBe(
      '/Users/test/my project/foo.ts'
    )
  })

  it('returns undefined for non-file:// URIs', () => {
    expect(fileUriToFsPath('https://example.com')).toBeUndefined()
    expect(fileUriToFsPath('relative/path.ts')).toBeUndefined()
    expect(fileUriToFsPath('')).toBeUndefined()
  })

  it('returns "/" for bare file:// with no path', () => {
    // new URL('file://').pathname = '/' — a valid but empty POSIX root
    expect(fileUriToFsPath('file://')).toBe('/')
  })

  it('rejects URIs with encoded slashes (%2F)', () => {
    // %2F represents a literal "/" inside a path segment, not a separator.
    // Converting it to a separator would produce a wrong path.
    expect(fileUriToFsPath('file:///Users/test/foo%2Fbar.ts')).toBeUndefined()
  })

  it('rejects URIs with encoded backslashes (%5C)', () => {
    expect(
      fileUriToFsPath('file:///C:/Users/test/foo%5Cbar.ts')
    ).toBeUndefined()
  })
})
