import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { HEARTBEAT_STALE_MS } from './data_collector_constants'

export type PidFileData = {
  pid: number
  startedAt: number
  heartbeat: number
  version?: string
}

/** Lazy path getters — resolved at call time so os.homedir() mocks work in tests. */
export function getMobbdevDir(): string {
  return path.join(os.homedir(), '.mobbdev')
}

export function getDaemonCheckScriptPath(): string {
  return path.join(getMobbdevDir(), 'daemon-check.js')
}

/**
 * Encapsulates all operations on the daemon PID file (~/.mobbdev/daemon.pid).
 *
 * Typical usage:
 *   const pf = new DaemonPidFile()
 *   pf.read()
 *   if (pf.isAlive()) { ... }
 *   pf.write(process.pid)
 */
export class DaemonPidFile {
  data: PidFileData | null = null

  private get filePath(): string {
    return path.join(getMobbdevDir(), 'daemon.pid')
  }

  /** Ensure ~/.mobbdev/ directory exists. */
  ensureDir(): void {
    fs.mkdirSync(getMobbdevDir(), { recursive: true })
  }

  /** Read the PID file from disk. Returns the parsed data or null. */
  read(): PidFileData | null {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8')
      const parsed = JSON.parse(raw)
      if (
        typeof parsed.pid !== 'number' ||
        typeof parsed.startedAt !== 'number' ||
        typeof parsed.heartbeat !== 'number'
      ) {
        this.data = null
      } else {
        this.data = parsed as PidFileData
      }
    } catch {
      this.data = null
    }
    return this.data
  }

  /** Write a new PID file for the given process id. */
  write(pid: number, version?: string): void {
    this.data = {
      pid,
      startedAt: Date.now(),
      heartbeat: Date.now(),
      version,
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data), 'utf8')
  }

  /** Update the heartbeat timestamp of the current PID file. */
  updateHeartbeat(): void {
    if (!this.data) this.read()
    if (!this.data) return
    this.data.heartbeat = Date.now()
    fs.writeFileSync(this.filePath, JSON.stringify(this.data), 'utf8')
  }

  /** Check whether the previously read PID data represents a live daemon. */
  isAlive(): boolean {
    if (!this.data) return false
    if (Date.now() - this.data.heartbeat > HEARTBEAT_STALE_MS) return false
    try {
      process.kill(this.data.pid, 0)
      return true
    } catch {
      return false
    }
  }

  /** Remove the PID file from disk (best-effort). */
  remove(): void {
    this.data = null
    try {
      fs.unlinkSync(this.filePath)
    } catch {
      // best-effort
    }
  }
}
