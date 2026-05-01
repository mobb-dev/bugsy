import { parsePorcelainCore } from '@mobb/bugsy/utils/blame/gitBlameUtils'
import { describe, expect, it } from 'vitest'

const SHA_A = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const SHA_B = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'

function entryLine(sha: string, original: number, final: number): string {
  return `${sha} ${original} ${final}`
}

describe('parsePorcelainCore', () => {
  it('returns empty result for empty or whitespace-only input', () => {
    expect(parsePorcelainCore('')).toEqual({
      entries: [],
      commitMetadata: {},
    })
    expect(parsePorcelainCore('   \n\t  \n')).toEqual({
      entries: [],
      commitMetadata: {},
    })
  })

  it('parses one entry with metadata and content line', () => {
    const raw = [
      entryLine(SHA_A, 10, 1),
      'author Alice',
      'author-mail <a@x.com>',
      'filename src/a.ts',
      '\tconst x = 1',
    ].join('\n')

    const { entries, commitMetadata } = parsePorcelainCore(raw)

    expect(entries).toEqual([
      {
        commitSha: SHA_A,
        originalLine: 10,
        finalLine: 1,
        originalFile: 'src/a.ts',
      },
    ])
    expect(commitMetadata[SHA_A]).toEqual({
      author: 'Alice',
      'author-mail': '<a@x.com>',
      filename: 'src/a.ts',
    })
  })

  it('carries filename forward when later entries omit filename (same group)', () => {
    const raw = [
      entryLine(SHA_A, 1, 1),
      'filename src/keep.ts',
      '\tone',
      entryLine(SHA_A, 2, 2),
      'author Bob',
      '\ttwo',
    ].join('\n')

    const { entries } = parsePorcelainCore(raw)

    expect(entries).toEqual([
      {
        commitSha: SHA_A,
        originalLine: 1,
        finalLine: 1,
        originalFile: 'src/keep.ts',
      },
      {
        commitSha: SHA_A,
        originalLine: 2,
        finalLine: 2,
        originalFile: 'src/keep.ts',
      },
    ])
  })

  it('uses new filename when a later entry emits filename (rename-style groups)', () => {
    const raw = [
      entryLine(SHA_A, 1, 1),
      'filename old/name.ts',
      '\ta',
      entryLine(SHA_A, 1, 2),
      'filename new/name.ts',
      '\tb',
    ].join('\n')

    const { entries } = parsePorcelainCore(raw)

    expect(entries[0]!.originalFile).toBe('old/name.ts')
    expect(entries[1]!.originalFile).toBe('new/name.ts')
  })

  it('merges commit metadata per sha and skips non-matching header lines', () => {
    const raw = [
      'not a porcelain header',
      '',
      entryLine(SHA_A, 1, 1),
      'summary add feature',
      'filename f.ts',
      '\tline',
      entryLine(SHA_B, 5, 2),
      'summary other',
      'filename g.ts',
      '\tother',
    ].join('\n')

    const { entries, commitMetadata } = parsePorcelainCore(raw)

    expect(entries).toHaveLength(2)
    expect(entries[0]!.commitSha).toBe(SHA_A)
    expect(entries[1]!.commitSha).toBe(SHA_B)
    expect(commitMetadata[SHA_A]!['summary']).toBe('add feature')
    expect(commitMetadata[SHA_B]!['summary']).toBe('other')
  })

  it('ignores metadata lines without a key/value space split', () => {
    const raw = [entryLine(SHA_A, 1, 1), 'bogus', 'filename ok.ts', '\tx'].join(
      '\n'
    )

    const { entries, commitMetadata } = parsePorcelainCore(raw)

    expect(entries).toHaveLength(1)
    expect(commitMetadata[SHA_A]).toEqual({ filename: 'ok.ts' })
  })
})
