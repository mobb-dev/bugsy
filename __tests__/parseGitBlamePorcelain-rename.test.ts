import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import {
  buildGitBlameArgs,
  parseGitBlamePorcelainByLine,
} from '@mobb/bugsy/utils/blame/gitBlameUtils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * These tests spawn a real `git` process against temp repos we create on
 * the fly and feed the raw porcelain output through the exact function
 * the production blame pipeline uses. Hand-crafted fixture strings would
 * silently drift out of sync with git's actual output; this harness
 * catches that drift.
 */

type GitEnv = NodeJS.ProcessEnv

const gitEnv: GitEnv = {
  ...process.env,
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@test.com',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@test.com',
  // Prevent global git config (hooks, signing, templates) from interfering.
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_SYSTEM: '/dev/null',
}

function git(cwd: string, args: string[]): string {
  return execSync(
    ['git', ...args].map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' '),
    {
      cwd,
      env: gitEnv,
      encoding: 'utf8',
    }
  )
}

async function writeFile(repo: string, relPath: string, content: string) {
  const abs = path.join(repo, relPath)
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, content)
}

async function initRepo(): Promise<string> {
  const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'blame-rename-test-'))
  git(repo, ['init', '--initial-branch=main'])
  return repo
}

function headSha(repo: string): string {
  return git(repo, ['rev-parse', 'HEAD']).trim()
}

function runBlame(repo: string, filePath: string, baseRef: string): string {
  const args = buildGitBlameArgs({
    mode: 'diffRange',
    filePath,
    baseRef,
    headRef: 'HEAD',
  })
  return execSync(
    ['git', ...args].map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' '),
    {
      cwd: repo,
      env: gitEnv,
      encoding: 'utf8',
    }
  )
}

describe('parseGitBlamePorcelainByLine — rename scenarios', () => {
  describe('scenario 1: non-merge pure rename (git mv)', () => {
    let repo: string
    let base: string
    let commitAddFile: string
    const addedLines = [
      'line one',
      'line two',
      'line three',
      'line four',
      'line five',
    ]

    beforeAll(async () => {
      repo = await initRepo()
      // Commit 1: establish a base commit so blame has a diff range to walk
      await writeFile(repo, 'README.md', 'initial\n')
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'base'])
      base = headSha(repo)

      // Commit 2: add foo.ts with 5 lines — this is the authoring commit
      await writeFile(repo, 'foo.ts', addedLines.join('\n') + '\n')
      git(repo, ['add', 'foo.ts'])
      git(repo, ['commit', '-m', 'add foo.ts'])
      commitAddFile = headSha(repo)

      // Commit 3: pure rename, no content change
      git(repo, ['mv', 'foo.ts', 'bar.ts'])
      git(repo, ['commit', '-m', 'rename foo -> bar'])
    })

    afterAll(async () => {
      await fs.rm(repo, { recursive: true, force: true })
    })

    it('traces every blamed line back to the authoring commit and reports the pre-rename path', () => {
      const raw = runBlame(repo, 'bar.ts', base)
      const lines = parseGitBlamePorcelainByLine(raw)

      const results = Object.values(lines)
      expect(results.length).toBe(addedLines.length)
      for (const info of results) {
        expect(info.commit).toBe(commitAddFile)
        // The whole point of the test: `-M` + porcelain `filename` must
        // give us the pre-rename path, not the current path.
        expect(info.originalFile).toBe('foo.ts')
      }
    })
  })

  describe('scenario 2: merge-conflict rename (PR #3596 pattern)', () => {
    let repo: string
    let featureCommit: string
    let base: string
    const fileContent =
      Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join('\n') + '\n'

    beforeAll(async () => {
      repo = await initRepo()
      // Base commit on main
      await writeFile(repo, 'README.md', 'initial\n')
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'base'])
      base = headSha(repo)

      // Feature branch: add test-1-16.ts
      git(repo, ['checkout', '-b', 'feature'])
      await writeFile(repo, 'test-1-16.ts', fileContent)
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'add test-1-16'])
      featureCommit = headSha(repo)

      // Main branch moves forward with an unrelated change
      git(repo, ['checkout', 'main'])
      await writeFile(repo, 'other.ts', 'unrelated main work\n')
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'unrelated main change'])

      // Back on feature: merge main in with a conflict-resolution rename.
      // Simulate by first merging (no actual conflict since files differ),
      // then renaming to test-1-17 in a commit that represents the
      // resolution. The merge does encode the content-path history git
      // needs to trace blame correctly.
      git(repo, ['checkout', 'feature'])
      git(repo, ['merge', '--no-edit', 'main'])
      // Rename test-1-16 -> test-1-17 to mirror the real PR
      git(repo, ['mv', 'test-1-16.ts', 'test-1-17.ts'])
      git(repo, ['commit', '-m', 'rename test-1-16 -> test-1-17'])
    })

    afterAll(async () => {
      await fs.rm(repo, { recursive: true, force: true })
    })

    it('traces every unchanged line back to the feature commit with the pre-rename path', () => {
      const raw = runBlame(repo, 'test-1-17.ts', base)
      const lines = parseGitBlamePorcelainByLine(raw)

      const results = Object.values(lines)
      expect(results.length).toBe(10)
      for (const info of results) {
        expect(info.commit).toBe(featureCommit)
        // The critical assertion: the historical path is the pre-rename
        // name, which is what the attribution rows are keyed by.
        expect(info.originalFile).toBe('test-1-16.ts')
      }
    })
  })

  describe('scenario 3: baseline (no rename)', () => {
    let repo: string
    let base: string
    let commitAddFile: string

    beforeAll(async () => {
      repo = await initRepo()
      await writeFile(repo, 'README.md', 'initial\n')
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'base'])
      base = headSha(repo)

      await writeFile(repo, 'baseline.ts', 'line one\nline two\nline three\n')
      git(repo, ['add', '.'])
      git(repo, ['commit', '-m', 'add baseline'])
      commitAddFile = headSha(repo)
    })

    afterAll(async () => {
      await fs.rm(repo, { recursive: true, force: true })
    })

    it('reports the current path as the historical path (no rename)', () => {
      const raw = runBlame(repo, 'baseline.ts', base)
      const lines = parseGitBlamePorcelainByLine(raw)

      const results = Object.values(lines)
      expect(results.length).toBe(3)
      for (const info of results) {
        expect(info.commit).toBe(commitAddFile)
        expect(info.originalFile).toBe('baseline.ts')
      }
    })
  })
})
