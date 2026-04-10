import { open, readdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { TRANSCRIPT_MAX_AGE_MS } from './data_collector_constants'

export type TranscriptFileInfo = {
  filePath: string
  sessionId: string
  projectDir: string
  mtimeMs: number
  size: number
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

/** Collect UUID-named .jsonl files from a directory into results. */
async function collectJsonlFiles(
  files: string[],
  dir: string,
  projectDir: string,
  seen: Set<string>,
  now: number,
  results: TranscriptFileInfo[]
): Promise<void> {
  for (const file of files) {
    if (!file.endsWith('.jsonl')) continue
    const sessionId = file.replace('.jsonl', '')
    if (!UUID_RE.test(sessionId)) continue

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

    results.push({
      filePath,
      sessionId,
      projectDir,
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
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

      // Also scan <uuid>/subagents/ directories
      for (const entry of files) {
        if (!UUID_RE.test(entry)) continue
        const subagentsDir = path.join(projPath, entry, 'subagents')
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
            results
          )
        } catch {
          // no subagents dir — skip
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
