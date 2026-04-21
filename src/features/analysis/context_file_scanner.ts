import { readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

import { globby } from 'globby'

const MAX_CONTEXT_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

/** Shared category sentinel — import instead of repeating the string literal. */
export const SKILL_CATEGORY = 'skill'

/** 24 hours in milliseconds — sessions older than this are pruned. */
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

type SessionMtimeEntry = {
  /** Per-file mtime map */
  files: Map<string, number>
  /** Per-skill mtime map — key is "skill:{root}:{name}", value is maxMtimeMs */
  skills: Map<string, number>
  /** Timestamp of the last update to this session entry */
  lastUpdatedAt: number
}

/**
 * Per-session mtime snapshot for change detection.
 * Outer key: sessionId → { files: Map<path, mtimeMs>, skills: Map<sessionKey, maxMtimeMs>, lastUpdatedAt }.
 * Each session tracks its own upload state independently so a file change
 * gets uploaded for every active session, not just the first one to poll.
 */
const sessionMtimes = new Map<string, SessionMtimeEntry>()

/**
 * Mark files as successfully uploaded for a session so subsequent scans
 * skip them unless their mtime has changed.
 */
export function markContextFilesUploaded(
  sessionId: string,
  files: ContextFileEntry[],
  skills?: SkillGroup[]
): void {
  let entry = sessionMtimes.get(sessionId)
  if (!entry) {
    entry = { files: new Map(), skills: new Map(), lastUpdatedAt: Date.now() }
    sessionMtimes.set(sessionId, entry)
  }
  for (const f of files) {
    entry.files.set(f.path, f.mtimeMs)
  }
  if (skills) {
    for (const sg of skills) {
      entry.skills.set(sg.sessionKey, sg.maxMtimeMs)
    }
  }
  entry.lastUpdatedAt = Date.now()
}

/**
 * Remove a session's mtime tracking data (e.g. when a session ends).
 */
export function clearSessionMtimes(sessionId: string): void {
  sessionMtimes.delete(sessionId)
}

/**
 * Returns true when the file's mtime has changed since last upload (i.e. it
 * should be re-uploaded). Returns true for files that have never been uploaded.
 * Use this to filter synthetic files that aren't on disk and therefore bypass
 * the scanner's mtime filter (e.g. Copilot user-instructions).
 */
export function hasFileChangedForSession(
  sessionId: string,
  file: { path: string; mtimeMs: number }
): boolean {
  const entry = sessionMtimes.get(sessionId)
  if (!entry) {
    return true
  }
  const prev = entry.files.get(file.path)
  return prev === undefined || file.mtimeMs > prev
}

export type ContextFileEntry = {
  /** Relative identifier, e.g. "CLAUDE.md", ".cursor/rules/security.mdc" */
  name: string
  /** Absolute path on disk */
  path: string
  /** UTF-8 file content */
  content: string
  /** Byte length */
  sizeBytes: number
  /** File category from scan config */
  category: string
  /** File modification time in ms (for change detection) */
  mtimeMs: number
}

/**
 * A skill group — either a folder skill (.claude/skills/<name>/<files>)
 * or a standalone skill (.claude/skills/<name>.md).
 */
export type SkillGroup = {
  /** Skill identifier: folder name or .md basename without extension */
  name: string
  /** Root origin: 'workspace' or 'home' */
  root: 'workspace' | 'home'
  /** Canonical path for the context event: dir path for folder skills, .md path for standalone */
  skillPath: string
  /** All files belonging to this skill */
  files: ContextFileEntry[]
  /** Whether the skill is a folder (true) or a standalone .md (false) */
  isFolder: boolean
  /** Max mtime across all files — used for change detection */
  maxMtimeMs: number
  /** Key used to track this skill's mtime in sessionMtimes */
  sessionKey: string
}

type ScanEntry = {
  glob: string
  category: string
  root: 'workspace' | 'home'
}

/**
 * Context file scan paths keyed by platform.
 * Each platform only lists files it actually auto-loads.
 *
 * Kept in sync with tscommon/backend/src/utils/tracyContextFilePaths.ts
 * (server-side canonical source). If paths diverge, the scanner will miss
 * files but no data corruption occurs — the server just won't see them.
 */
const SCAN_PATHS: Record<string, ScanEntry[]> = {
  'claude-code': [
    { glob: 'CLAUDE.md', category: 'rule', root: 'workspace' },
    { glob: 'CLAUDE.local.md', category: 'rule', root: 'workspace' },
    { glob: 'INSIGHTS.md', category: 'rule', root: 'workspace' },
    { glob: 'AGENTS.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/CLAUDE.md', category: 'rule', root: 'home' },
    { glob: '.claude/INSIGHTS.md', category: 'rule', root: 'home' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'home' },
    {
      glob: '.claude/projects/*/memory/*.md',
      category: 'memory',
      root: 'home',
    },
    {
      glob: '.claude/skills/**/*',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    { glob: '.claude/commands/*.md', category: 'command', root: 'workspace' },
    {
      glob: '.claude/agents/*.md',
      category: 'agent-config',
      root: 'workspace',
    },
    { glob: '.claude/skills/**/*', category: SKILL_CATEGORY, root: 'home' },
    { glob: '.claude/commands/*.md', category: 'command', root: 'home' },
    { glob: '.claude/agents/*.md', category: 'agent-config', root: 'home' },
    { glob: '.claude/settings.json', category: 'config', root: 'workspace' },
    {
      glob: '.claude/settings.local.json',
      category: 'config',
      root: 'workspace',
    },
    { glob: '.mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.claude/.mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.claude/settings.json', category: 'config', root: 'home' },
    { glob: '.claudeignore', category: 'ignore', root: 'workspace' },
  ],

  cursor: [
    { glob: '.cursorrules', category: 'rule', root: 'workspace' },
    { glob: '.cursor/rules/**/*.mdc', category: 'rule', root: 'workspace' },
    { glob: '.cursor/mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.cursor/mcp.json', category: 'mcp-config', root: 'home' },
    { glob: '.cursorignore', category: 'ignore', root: 'workspace' },
  ],

  copilot: [
    {
      glob: '.github/copilot-instructions.md',
      category: 'rule',
      root: 'workspace',
    },
    {
      glob: '.github/instructions/*.instructions.md',
      category: 'rule',
      root: 'workspace',
    },
    {
      glob: '.github/prompts/*.prompt.md',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    {
      glob: '.github/chatmodes/*.chatmode.md',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    {
      glob: '.config/github-copilot/global-copilot-instructions.md',
      category: 'rule',
      root: 'home',
    },
  ],
}

/**
 * Group skill ContextFileEntries into SkillGroups.
 *
 * Two layouts are supported:
 *   Standalone: skills/some_skill.md          → one group, isFolder=false
 *   Folder:     skills/another_skill/file.md  → one group per folder, isFolder=true
 *
 * Files NOT under a `skills/` directory (e.g. Copilot `.github/prompts/*.prompt.md`)
 * are always treated as standalone skills regardless of slashes in their path.
 *
 * The root (workspace/home) is inferred from baseDir.
 */
export function groupSkills(
  files: ContextFileEntry[],
  root: 'workspace' | 'home',
  baseDir: string
): SkillGroup[] {
  const skillFiles = files.filter((f) => f.category === SKILL_CATEGORY)
  const folderMap = new Map<string, ContextFileEntry[]>()
  const standalone: ContextFileEntry[] = []

  for (const f of skillFiles) {
    const rel = path.relative(baseDir, f.path).replace(/\\/g, '/')

    // Locate the `skills/` segment. Using indexOf (not a regex) prevents
    // mismatches when the workspace root itself contains the word "skills".
    const skillsMarker = 'skills/'
    const skillsIdx = rel.indexOf(skillsMarker)

    if (skillsIdx === -1) {
      // Not under any skills/ directory (e.g. Copilot .github/prompts/) — standalone
      standalone.push(f)
      continue
    }

    const relFromSkills = rel.slice(skillsIdx + skillsMarker.length)
    const slashIdx = relFromSkills.indexOf('/')
    if (slashIdx === -1) {
      // Standalone: "some_skill.md"
      standalone.push(f)
    } else {
      // Folder skill: "another_skill/file.md"
      const folderName = relFromSkills.slice(0, slashIdx)
      if (!folderMap.has(folderName)) {
        folderMap.set(folderName, [])
      }
      folderMap.get(folderName)!.push(f)
    }
  }

  const groups: SkillGroup[] = []

  for (const f of standalone) {
    const name = path.basename(f.path, path.extname(f.path))
    const sessionKey = `skill:${root}:${name}`
    groups.push({
      name,
      root,
      skillPath: f.path,
      files: [f],
      isFolder: false,
      maxMtimeMs: f.mtimeMs,
      sessionKey,
    })
  }

  for (const [folderName, folderFiles] of folderMap) {
    const maxMtimeMs = Math.max(...folderFiles.map((f) => f.mtimeMs))
    // Compute skillPath as the root of the skill folder (e.g. "~/.claude/skills/my-skill").
    // Using path.dirname(folderFiles[0]) would break when the first collected file is
    // inside a subfolder — we'd get "~/.claude/skills/my-skill/sub" instead, which makes
    // path.relative() produce "../sibling.md" entries in the zip.
    const anyFile = folderFiles[0]!
    const rel = path.relative(baseDir, anyFile.path).replace(/\\/g, '/')
    const skillsIdx = rel.indexOf('skills/')
    const skillRelPath = rel.slice(
      0,
      skillsIdx + 'skills/'.length + folderName.length
    )
    const skillPath = path.join(baseDir, skillRelPath)
    const sessionKey = `skill:${root}:${folderName}`
    groups.push({
      name: folderName,
      root,
      skillPath,
      files: folderFiles,
      isFolder: true,
      maxMtimeMs,
      sessionKey,
    })
  }

  return groups
}

/**
 * Result type for scanContextFiles — separates regular files from skill groups.
 */
export type ScanResult = {
  /** Non-skill context files (rules, memory, commands, etc.) */
  regularFiles: ContextFileEntry[]
  /** Skill groups (each group becomes one zip upload) */
  skillGroups: SkillGroup[]
}

/**
 * Scan the workspace and home directory for known context files.
 *
 * OS-sensitive:
 * - Uses os.homedir() for home-rooted paths (works on macOS, Linux, Windows)
 * - Uses path.join/resolve for cross-platform path handling
 * - Gracefully skips missing files/directories (ENOENT)
 *
 * No MD5 computed here — the processor handles that after sanitization.
 */
export async function scanContextFiles(
  workspaceRoot: string,
  platform: string,
  sessionId?: string
): Promise<ScanResult> {
  const entries = SCAN_PATHS[platform]
  if (!entries || entries.length === 0) {
    return { regularFiles: [], skillGroups: [] }
  }

  // Prune sessions that haven't been updated in 24 hours
  const now = Date.now()
  for (const [sid, entry] of sessionMtimes) {
    if (now - entry.lastUpdatedAt > SESSION_TTL_MS) {
      sessionMtimes.delete(sid)
    }
  }

  const home = homedir()
  const sessionEntry = sessionId ? sessionMtimes.get(sessionId) : undefined

  // Collect all files first (skill mtime checked at group level after grouping)
  const allFiles: ContextFileEntry[] = []
  // Track which baseDir each skill file came from for proper grouping
  const skillFilesByRoot = new Map<'workspace' | 'home', ContextFileEntry[]>()
  const seenPaths = new Set<string>()

  for (const entry of entries) {
    const baseDir = entry.root === 'home' ? home : workspaceRoot
    const matchedFiles = await globby(entry.glob, {
      cwd: baseDir,
      absolute: true,
      onlyFiles: true,
      dot: true,
    })

    for (const filePath of matchedFiles) {
      if (seenPaths.has(filePath)) {
        continue
      }
      seenPaths.add(filePath)

      try {
        const fileStat = await stat(filePath)
        if (
          fileStat.size === 0 ||
          fileStat.size > MAX_CONTEXT_FILE_SIZE ||
          !fileStat.isFile()
        ) {
          continue
        }
        const content = await readFile(filePath, 'utf-8')
        const sizeBytes = Buffer.byteLength(content, 'utf-8')
        const name = deriveIdentifier(filePath, baseDir)
        const fileEntry: ContextFileEntry = {
          name,
          path: filePath,
          content,
          sizeBytes,
          category: entry.category,
          mtimeMs: fileStat.mtimeMs,
        }

        if (entry.category === SKILL_CATEGORY) {
          // Skill files are grouped — mtime checked at group level below.
          // Use push (O(1)) instead of spread-recreate (O(n)) per iteration.
          let rootFiles = skillFilesByRoot.get(entry.root)
          if (!rootFiles) {
            rootFiles = []
            skillFilesByRoot.set(entry.root, rootFiles)
          }
          rootFiles.push(fileEntry)
        } else {
          // Non-skill: filter by per-file mtime
          const prevMtime = sessionEntry?.files.get(filePath)
          if (prevMtime !== undefined && fileStat.mtimeMs <= prevMtime) {
            continue
          }
          allFiles.push(fileEntry)
        }
      } catch (_err) {
        // Skip files that can't be read (permissions, encoding, etc.)
      }
    }
  }

  // Group skill files and apply group-level mtime change detection
  const allSkillGroups: SkillGroup[] = []
  for (const [root, files] of skillFilesByRoot) {
    const baseDir = root === 'home' ? home : workspaceRoot
    const groups = groupSkills(files, root, baseDir)
    for (const group of groups) {
      // Skip if no file in the group has changed since last upload
      if (sessionEntry) {
        const prevMtime = sessionEntry.skills.get(group.sessionKey)
        if (prevMtime !== undefined && group.maxMtimeMs <= prevMtime) {
          continue
        }
      }
      allSkillGroups.push(group)
    }
  }

  return { regularFiles: allFiles, skillGroups: allSkillGroups }
}

function deriveIdentifier(filePath: string, baseDir: string): string {
  const relative = path.relative(baseDir, filePath)
  if (!relative.startsWith('..')) {
    return relative.replace(/\\/g, '/')
  }
  return path.basename(filePath)
}
