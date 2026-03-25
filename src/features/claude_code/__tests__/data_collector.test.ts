import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { resolveTranscriptPath } from '../data_collector'

describe('resolveTranscriptPath', () => {
  let tmpDir: string
  let projectsDir: string

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'transcript-test-'))
    projectsDir = path.join(tmpDir, 'projects')
    await mkdir(projectsDir)
  })

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('returns original path when file exists', async () => {
    const projectDir = path.join(projectsDir, '-Users-dev-proj-autofixer')
    await mkdir(projectDir)
    const transcriptPath = path.join(projectDir, 'session-123.jsonl')
    await writeFile(transcriptPath, '{"test": true}\n')

    const result = await resolveTranscriptPath(transcriptPath, 'session-123')
    expect(result).toBe(transcriptPath)
  })

  it('strips worktree suffix to find transcript (regex-strip)', async () => {
    const mainDir = path.join(projectsDir, '-Users-dev-proj-autofixer')
    await mkdir(mainDir)

    const filename = 'session-abc.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Worktree path with double-dash before claude-worktrees
    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-autofixer--claude-worktrees-my-worktree',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-abc')
    expect(result).toBe(realFile)
  })

  it('strips worktree suffix with dot prefix (.claude)', async () => {
    const mainDir = path.join(projectsDir, '-Users-dev-proj-repo')
    await mkdir(mainDir)

    const filename = 'session-def.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Worktree path with dot-claude prefix
    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-repo.claude-worktrees-some-name',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-def')
    expect(result).toBe(realFile)
  })

  it('falls back to sibling scan when strip does not match', async () => {
    // Main dir has a name that doesn't match the strip pattern
    const mainDir = path.join(projectsDir, '-Users-dev-other-project')
    await mkdir(mainDir)

    const filename = 'session-ghi.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Non-worktree path that simply doesn't exist
    const missingDir = path.join(projectsDir, '-Users-dev-renamed-project')
    const missingPath = path.join(missingDir, filename)
    const result = await resolveTranscriptPath(missingPath, 'session-ghi')
    expect(result).toBe(realFile)
  })

  it('falls back to sibling scan when strip resolves to wrong dir', async () => {
    // Strip produces a dir name that exists but doesn't have the file
    const strippedDir = path.join(projectsDir, '-Users-dev-proj-repo')
    await mkdir(strippedDir)
    // No transcript file here

    // The file is in a different sibling
    const actualDir = path.join(projectsDir, '-Users-dev-proj-repo-v2')
    await mkdir(actualDir)
    const filename = 'session-jkl.jsonl'
    const realFile = path.join(actualDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-repo-claude-worktrees-wt1',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-jkl')
    expect(result).toBe(realFile)
  })

  it('returns original path when no fallback found', async () => {
    const missingPath = path.join(
      projectsDir,
      '-Users-dev-proj-autofixer--claude-worktrees-gone',
      'session-xyz.jsonl'
    )

    const result = await resolveTranscriptPath(missingPath, 'session-xyz')
    expect(result).toBe(missingPath)
  })

  it('returns original path when projects directory does not exist', async () => {
    const missingPath = path.join(
      tmpDir,
      'nonexistent',
      'subdir',
      'session.jsonl'
    )

    const result = await resolveTranscriptPath(missingPath, 'session')
    expect(result).toBe(missingPath)
  })
})
