import { lstat, open, readdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { TRANSCRIPT_MAX_AGE_MS } from './data_collector_constants'

export type TranscriptFileInfo = {
  filePath: string
  sessionId: string
  projectDir: string
  mtimeMs: number
  size: number
  /**
   * T-510: true when the file is a sub-agent transcript
   * (`<sessionId>/subagents/agent-*.jsonl`). False for the main session file.
   */
  isSubagent: boolean
  /**
   * T-510: agent type from the sibling `<slug>.meta.json` sidecar
   * (e.g. "Explore", "general-purpose"). Null for main-session files and
   * for sub-agent files whose meta sidecar is missing. Spike 1 verified
   * the sidecar is reliably present for sub-agent files from current
   * Claude Code, but old transcripts (>30d) sometimes don't have one.
   */
  agentType: string | null
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Return all candidate project directories, respecting CLAUDE_CONFIG_DIR and v1.0.30+ paths. */
function getClaudeProjectsDirs(): string[] {
  const dirs: string[] = []
  const configDir = process.env['CLAUDE_CONFIG_DIR']
  if (configDir) {
    dirs.push(path.join(configDir, 'projects'))
  }
  dirs.push(path.join(os.homedir(), '.config', 'claude', 'projects'))
  dirs.push(path.join(os.homedir(), '.claude', 'projects'))
  return dirs
}

/**
 * T-510: read `agentType` from a sub-agent's sibling `<slug>.meta.json`
 * sidecar. The file is written by Claude Code at sub-agent dispatch, so it's
 * typically present *before* the JSONL is populated. Returns null when the
 * file is missing, unreadable, oversized, a symlink, or doesn't contain a
 * shaped `agentType` string.
 *
 * Hardening notes (T-510 review):
 *   - Caps the read at `META_MAX_BYTES` (4 KiB) to prevent a hostile local
 *     `.meta.json` from OOMing the daemon or blocking its event loop in
 *     `JSON.parse`. A real Claude Code sidecar is < 200 bytes.
 *   - Rejects symlinks via `lstat` so a hostile symlink can't siphon the
 *     contents of an arbitrary file into `agentType`.
 *   - Validates the returned shape with the same regex/length the
 *     server-side Zod schema applies (tracyTypes.ts), so the daemon can
 *     log a metric early instead of pushing garbage through the wire and
 *     having the backend reject it.
 */
const META_MAX_BYTES = 4096
const AGENT_TYPE_RE = /^[A-Za-z0-9_.\- ]+$/

// T-510 perf: `.meta.json` is written once at sub-agent dispatch and never
// rewritten (Spike 1). Cache the parsed `agentType` keyed by
// `(jsonlPath, jsonlMtimeMs)` so the daemon's scan loop doesn't re-read +
// re-parse the sidecar every poll. Cache size is bounded by the number of
// sub-agent transcripts the user has ever produced; entries are cheap
// (~50 bytes) and we evict by `clearAgentTypeCache()` at the same point
// `clearCwdCache` is called (test teardown / re-init).
type AgentTypeCacheEntry = { mtimeMs: number; value: string | null }
const agentTypeCache = new Map<string, AgentTypeCacheEntry>()

export function clearAgentTypeCache(): void {
  agentTypeCache.clear()
}

// Negative cache: session-uuids confirmed to have no `subagents/` directory.
// Persists across polls so the daemon doesn't re-stat the absent dir on every
// cycle. Bounded by the count of Claude Code sessions ever scanned (cheap).
const knownAbsentSubagentDirs = new Set<string>()

export function clearAbsentSubagentDirsCache(): void {
  knownAbsentSubagentDirs.clear()
}

async function readAgentType(
  jsonlPath: string,
  jsonlMtimeMs: number
): Promise<string | null> {
  const cached = agentTypeCache.get(jsonlPath)
  if (cached && cached.mtimeMs === jsonlMtimeMs) {
    return cached.value
  }

  const metaPath = jsonlPath.replace(/\.jsonl$/, '.meta.json')
  let fh
  let value: string | null = null
  try {
    // `lstat` (not `stat`) so a hostile symlink can't redirect us to an
    // unrelated file. `.isFile()` rejects symlinks, FIFOs, sockets, dirs.
    const lst = await lstat(metaPath)
    if (!lst.isFile() || lst.size > META_MAX_BYTES) {
      agentTypeCache.set(jsonlPath, { mtimeMs: jsonlMtimeMs, value: null })
      return null
    }
    fh = await open(metaPath, 'r')
    const buf = Buffer.alloc(Math.min(lst.size, META_MAX_BYTES))
    const { bytesRead } = await fh.read(buf, 0, buf.length, 0)
    const raw = buf.toString('utf8', 0, bytesRead)
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const candidate = (parsed as { agentType?: unknown }).agentType
      if (
        typeof candidate === 'string' &&
        candidate.length > 0 &&
        candidate.length <= 128 &&
        AGENT_TYPE_RE.test(candidate.trim())
      ) {
        value = candidate.trim()
      }
    }
  } catch {
    // missing / unparseable / permission denied — value stays null
  } finally {
    if (fh) {
      await fh.close().catch(() => undefined)
    }
  }
  agentTypeCache.set(jsonlPath, { mtimeMs: jsonlMtimeMs, value })
  return value
}

/**
 * Collect .jsonl files from a directory into results. Two modes:
 * - Main scan (override absent): basename must match UUID_RE; sessionId
 *   derived from the basename; isSubagent=false.
 * - Sub-agent scan (override.parentUuid set): accepts any `*.jsonl` whose
 *   basename is NOT `*.meta.json`; sessionId is the parent UUID; isSubagent
 *   is true; agentType comes from the sibling `<slug>.meta.json`.
 */
async function collectJsonlFiles(
  files: string[],
  dir: string,
  projectDir: string,
  seen: Set<string>,
  now: number,
  results: TranscriptFileInfo[],
  override?: { parentUuid: string }
): Promise<void> {
  for (const file of files) {
    if (!file.endsWith('.jsonl')) continue

    let sessionId: string
    let isSubagent: boolean

    if (override) {
      // Sub-agent scan: the outer `.endsWith('.jsonl')` already excludes
      // `.meta.json` sidecars (they end in `.meta.json`, not `.jsonl`).
      // Enforce the actual Claude Code filename shape so we don't admit
      // arbitrary `*.jsonl` files a hostile/buggy local process drops into
      // the subagents/ directory.
      if (!/^agent-[A-Za-z0-9_-]+\.jsonl$/.test(file)) continue
      sessionId = override.parentUuid
      isSubagent = true
    } else {
      const basename = file.replace('.jsonl', '')
      if (!UUID_RE.test(basename)) continue
      sessionId = basename
      isSubagent = false
    }

    const filePath = path.join(dir, file)
    if (seen.has(filePath)) continue
    seen.add(filePath)

    let fileStat
    try {
      fileStat = await stat(filePath)
    } catch {
      continue
    }
    if (now - fileStat.mtimeMs > TRANSCRIPT_MAX_AGE_MS) continue

    const agentType = isSubagent
      ? await readAgentType(filePath, fileStat.mtimeMs)
      : null

    results.push({
      filePath,
      sessionId,
      projectDir,
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
      isSubagent,
      agentType,
    })
  }
}

export async function scanForTranscripts(
  projectsDirs: string[] = getClaudeProjectsDirs()
): Promise<TranscriptFileInfo[]> {
  const results: TranscriptFileInfo[] = []
  const seen = new Set<string>()
  const now = Date.now()

  for (const projectsDir of projectsDirs) {
    let projectDirs: string[]
    try {
      projectDirs = await readdir(projectsDir)
    } catch {
      continue
    }

    for (const projName of projectDirs) {
      const projPath = path.join(projectsDir, projName)
      let projStat
      try {
        projStat = await stat(projPath)
      } catch {
        continue
      }
      if (!projStat.isDirectory()) continue

      let files: string[]
      try {
        files = await readdir(projPath)
      } catch {
        continue
      }

      await collectJsonlFiles(files, projPath, projPath, seen, now, results)

      // Also scan <uuid>/subagents/ directories. Tracking "we've already
      // confirmed this session has no subagents dir" avoids one stat syscall
      // per poll for the (common) case of sessions that never spawned a
      // sub-agent.
      for (const entry of files) {
        if (!UUID_RE.test(entry)) continue
        const subagentsDir = path.join(projPath, entry, 'subagents')
        if (knownAbsentSubagentDirs.has(subagentsDir)) continue
        try {
          const s = await stat(subagentsDir)
          if (!s.isDirectory()) continue
          const subFiles = await readdir(subagentsDir)
          await collectJsonlFiles(
            subFiles,
            subagentsDir,
            projPath,
            seen,
            now,
            results,
            { parentUuid: entry }
          )
        } catch {
          // no subagents dir — remember so we don't keep stat'ing every poll
          knownAbsentSubagentDirs.add(subagentsDir)
        }
      }
    }
  }

  return results
}

const CWD_READ_BYTES = 8192
const cwdCache = new Map<string, string>()

export async function extractCwdFromTranscript(
  filePath: string
): Promise<string | undefined> {
  const cached = cwdCache.get(filePath)
  if (cached !== undefined) return cached

  try {
    const fh = await open(filePath, 'r')
    try {
      const buf = Buffer.alloc(CWD_READ_BYTES)
      const { bytesRead } = await fh.read(buf, 0, CWD_READ_BYTES, 0)

      const text = buf.toString('utf8', 0, bytesRead)
      const lines = text.split('\n')

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const entry = JSON.parse(line)
          if (typeof entry.cwd === 'string') {
            cwdCache.set(filePath, entry.cwd)
            return entry.cwd
          }
        } catch {
          // partial last line — ignore
        }
      }
    } finally {
      await fh.close()
    }
  } catch {
    // file read error
  }

  // Don't cache — cwd entry may appear in later transcript lines
  return undefined
}

export function clearCwdCache(): void {
  cwdCache.clear()
}

/** Number of cached CWD entries (for monitoring unbounded growth). */
export function getCwdCacheSize(): number {
  return cwdCache.size
}
