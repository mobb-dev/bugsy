import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  clearCwdCache,
  extractCwdFromTranscript,
  scanForTranscripts,
} from '../transcript_scanner'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcript-scanner-test-'))
  clearCwdCache()
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('scanForTranscripts', () => {
  it('returns fresh .jsonl files with UUID names', async () => {
    const projDir = path.join(tmpDir, 'my-project')
    fs.mkdirSync(projDir, { recursive: true })

    const uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    const filePath = path.join(projDir, `${uuid}.jsonl`)
    fs.writeFileSync(filePath, '{"type":"user"}\n')

    const results = await scanForTranscripts([tmpDir])
    expect(results).toHaveLength(1)
    expect(results[0]!.sessionId).toBe(uuid)
    expect(results[0]!.filePath).toBe(filePath)
    expect(results[0]!.projectDir).toBe(projDir)
    expect(results[0]!.size).toBeGreaterThan(0)
  })

  it('skips files older than 24h', async () => {
    const projDir = path.join(tmpDir, 'old-project')
    fs.mkdirSync(projDir, { recursive: true })

    const uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    const filePath = path.join(projDir, `${uuid}.jsonl`)
    fs.writeFileSync(filePath, '{"type":"user"}\n')

    // Set mtime to 2 days ago
    const oldTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    fs.utimesSync(filePath, oldTime, oldTime)

    const results = await scanForTranscripts([tmpDir])
    expect(results).toHaveLength(0)
  })

  it('skips non-jsonl files', async () => {
    const projDir = path.join(tmpDir, 'proj')
    fs.mkdirSync(projDir, { recursive: true })
    fs.writeFileSync(
      path.join(projDir, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890.txt'),
      'not jsonl'
    )

    const results = await scanForTranscripts([tmpDir])
    expect(results).toHaveLength(0)
  })

  it('skips files without UUID names', async () => {
    const projDir = path.join(tmpDir, 'proj')
    fs.mkdirSync(projDir, { recursive: true })
    fs.writeFileSync(
      path.join(projDir, 'not-a-uuid.jsonl'),
      '{"type":"user"}\n'
    )

    const results = await scanForTranscripts([tmpDir])
    expect(results).toHaveLength(0)
  })

  it('handles empty projects directory', async () => {
    const results = await scanForTranscripts([tmpDir])
    expect(results).toHaveLength(0)
  })

  it('handles missing projects directory', async () => {
    const results = await scanForTranscripts([path.join(tmpDir, 'nonexistent')])
    expect(results).toHaveLength(0)
  })
})

describe('extractCwdFromTranscript', () => {
  it('returns cwd from first entry that has it', async () => {
    const filePath = path.join(tmpDir, 'test.jsonl')
    fs.writeFileSync(
      filePath,
      [
        JSON.stringify({ type: 'file-history-snapshot', files: [] }),
        JSON.stringify({
          type: 'user',
          cwd: '/home/user/project',
          message: 'hello',
        }),
      ].join('\n')
    )

    const cwd = await extractCwdFromTranscript(filePath)
    expect(cwd).toBe('/home/user/project')
  })

  it('handles file-history-snapshot first line without cwd', async () => {
    const filePath = path.join(tmpDir, 'test.jsonl')
    fs.writeFileSync(
      filePath,
      [
        JSON.stringify({ type: 'file-history-snapshot', files: ['a.ts'] }),
        JSON.stringify({
          type: 'user',
          cwd: '/workspace/repo',
          sessionId: '123',
        }),
      ].join('\n')
    )

    const cwd = await extractCwdFromTranscript(filePath)
    expect(cwd).toBe('/workspace/repo')
  })

  it('returns undefined when no entry has cwd', async () => {
    const filePath = path.join(tmpDir, 'test.jsonl')
    fs.writeFileSync(
      filePath,
      [
        JSON.stringify({ type: 'file-history-snapshot', files: [] }),
        JSON.stringify({ type: 'assistant', message: 'reply' }),
      ].join('\n')
    )

    const cwd = await extractCwdFromTranscript(filePath)
    expect(cwd).toBeUndefined()
  })

  it('returns undefined for missing file', async () => {
    const cwd = await extractCwdFromTranscript(path.join(tmpDir, 'nope.jsonl'))
    expect(cwd).toBeUndefined()
  })

  it('caches results', async () => {
    const filePath = path.join(tmpDir, 'cached.jsonl')
    fs.writeFileSync(
      filePath,
      JSON.stringify({ type: 'user', cwd: '/cached/path' })
    )

    const cwd1 = await extractCwdFromTranscript(filePath)
    // Modify the file — cached value should still be returned
    fs.writeFileSync(
      filePath,
      JSON.stringify({ type: 'user', cwd: '/different/path' })
    )
    const cwd2 = await extractCwdFromTranscript(filePath)

    expect(cwd1).toBe('/cached/path')
    expect(cwd2).toBe('/cached/path')
  })
})
