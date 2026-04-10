import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let tmpDir: string

vi.mock('node:os', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    default: {
      ...(actual['default'] as Record<string, unknown>),
      homedir: () => tmpDir,
    },
  }
})

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pid-test-'))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
  vi.restoreAllMocks()
})

describe('DaemonPidFile', () => {
  describe('write + read', () => {
    it('writes and reads back PID file data', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      pf.write(12345)

      const data = pf.read()
      expect(data).not.toBeNull()
      expect(data!.pid).toBe(12345)
      expect(data!.startedAt).toBeGreaterThan(0)
      expect(data!.heartbeat).toBeGreaterThan(0)
    })
  })

  describe('read', () => {
    it('returns null when PID file does not exist', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      const data = pf.read()
      expect(data).toBeNull()
    })

    it('returns null for invalid JSON', async () => {
      const { DaemonPidFile, getMobbdevDir } =
        await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      fs.writeFileSync(
        path.join(getMobbdevDir(), 'daemon.pid'),
        'not json',
        'utf8'
      )
      const data = pf.read()
      expect(data).toBeNull()
    })

    it('returns null for JSON missing required fields', async () => {
      const { DaemonPidFile, getMobbdevDir } =
        await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      fs.writeFileSync(
        path.join(getMobbdevDir(), 'daemon.pid'),
        JSON.stringify({ pid: 123 }),
        'utf8'
      )
      const data = pf.read()
      expect(data).toBeNull()
    })
  })

  describe('updateHeartbeat', () => {
    it('updates only the heartbeat field', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      pf.write(99999)

      const before = pf.read()!
      await new Promise((r) => setTimeout(r, 10))
      pf.updateHeartbeat()

      const after = pf.read()!
      expect(after.pid).toBe(before.pid)
      expect(after.startedAt).toBe(before.startedAt)
      expect(after.heartbeat).toBeGreaterThanOrEqual(before.heartbeat)
    })
  })

  describe('isAlive', () => {
    it('returns false when PID file is missing', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.read()
      expect(pf.isAlive()).toBe(false)
    })

    it('returns false when heartbeat is stale', async () => {
      const { DaemonPidFile, getMobbdevDir } =
        await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      fs.writeFileSync(
        path.join(getMobbdevDir(), 'daemon.pid'),
        JSON.stringify({
          pid: process.pid,
          startedAt: Date.now() - 60000,
          heartbeat: Date.now() - 60000,
        }),
        'utf8'
      )
      pf.read()
      expect(pf.isAlive()).toBe(false)
    })

    it('returns true when heartbeat is fresh and process exists', async () => {
      const { DaemonPidFile, getMobbdevDir } =
        await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      fs.writeFileSync(
        path.join(getMobbdevDir(), 'daemon.pid'),
        JSON.stringify({
          pid: process.pid,
          startedAt: Date.now(),
          heartbeat: Date.now(),
        }),
        'utf8'
      )
      pf.read()
      expect(pf.isAlive()).toBe(true)
    })
  })

  describe('remove', () => {
    it('removes the PID file', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      pf.ensureDir()
      pf.write(12345)
      expect(pf.read()).not.toBeNull()
      pf.remove()
      expect(pf.read()).toBeNull()
    })

    it('does not throw when file does not exist', async () => {
      const { DaemonPidFile } = await import('../daemon_pid_file')
      const pf = new DaemonPidFile()
      expect(() => pf.remove()).not.toThrow()
    })
  })
})
