import { lstat, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

import { globby } from 'globby'
import { parse as parseJsoncLib, ParseError } from 'jsonc-parser'

import {
  SCAN_PATHS,
  type ScanEntry,
  SKILL_CATEGORY,
} from './context_file_scan_paths'

export { SCAN_PATHS, SKILL_CATEGORY }

const MAX_CONTEXT_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

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
  /**
   * Authoritative scope determined at scan time from the originating `ScanEntry.root`.
   * `home` / `absolute` roots always produce `user-global`; `workspace` roots leave
   * `scope` undefined so the server can fall back to path-based inference (which
   * distinguishes repo vs project via `.github/` presence).
   */
  scope?: 'project' | 'user-global' | 'repo'
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

/**
 * VS Code Copilot settings keys that let users declare extra directories
 * beyond the built-in conventions (e.g. `chat.agentSkillsLocations`).
 * We read `.vscode/settings.json` at scan time and materialize these into
 * dynamic ScanEntry values with `root: 'absolute'`.
 *
 * Each entry maps a VS Code settings key to either:
 * - `kind: 'glob'` + glob pattern + category (for files that ARE the instruction)
 * - `kind: 'skill-bundle'` (for skill directories — all files inside
 *   `<dir>/<skill>/` subdirs are scanned, loose files at the root are ignored).
 */
const COPILOT_CUSTOM_LOCATION_SETTINGS = [
  {
    key: 'chat.agentSkillsLocations',
    kind: 'skill-bundle' as const,
  },
  {
    key: 'chat.instructionsFilesLocations',
    kind: 'glob' as const,
    category: 'rule' as const,
    glob: '**/*.instructions.md',
  },
  {
    key: 'chat.promptFilesLocations',
    kind: 'glob' as const,
    category: 'skill' as const,
    glob: '**/*.prompt.md',
  },
  {
    key: 'chat.agentFilesLocations',
    kind: 'glob' as const,
    category: 'agent-config' as const,
    glob: '**/*.agent.md',
  },
] as const

/**
 * Claude Code exposes exactly one configurable discovery path:
 * `autoMemoryDirectory` in user-level `~/.claude/settings.json`. Project-level
 * settings are intentionally ignored for this key to match Claude Code's own
 * security model.
 *
 * Glob mirrors the default memory structure (`<base>/<hash>/memory/*.md`) so
 * an override at a broad path (e.g. `~/Documents`) doesn't turn the scanner
 * into a general markdown crawler.
 */
const CLAUDE_CODE_CUSTOM_LOCATION_SETTINGS = [
  {
    key: 'autoMemoryDirectory',
    category: 'memory' as const,
    glob: '*/memory/*.md',
  },
] as const

/**
 * Parse JSONC (JSON with comments and trailing commas) using the official
 * VS Code `jsonc-parser` library. Returns `null` on parse failure so callers
 * can fall back to static globs silently.
 */
function parseJsonc(text: string): unknown {
  const errors: ParseError[] = []
  const parsed = parseJsoncLib(text, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  })
  // jsonc-parser returns `undefined` on catastrophic failure; any recoverable
  // parse still returns a value plus non-empty `errors`. We accept recoverable
  // parses so a single typo in a user's settings.json doesn't wipe out all
  // custom locations.
  return parsed ?? null
}

/**
 * Extract enabled custom locations from a settings value.
 *
 * Accepts both shapes VS Code uses:
 * - Array of path strings: every non-empty string is enabled.
 * - Object mapping `path → boolean`: only entries with the exact value `true`
 *   are enabled. Truthy non-booleans (`1`, `"yes"`, `{}`) are rejected because
 *   VS Code's chat settings are strictly typed as booleans.
 */
function extractCustomLocations(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (v): v is string => typeof v === 'string' && v.length > 0
    )
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v === true)
      .map(([k]) => k)
      .filter((k) => k.length > 0)
  }
  return []
}

/**
 * Sensitive home-relative directories that must never be scanned even if the
 * user (or a hostile repo's committed `.vscode/settings.json`) names them.
 * These typically hold credentials and keys; allowing a scan would mean
 * uploading those file contents to the tracy backend.
 */
const SENSITIVE_HOME_SUBDIRS = [
  '.ssh',
  '.aws',
  '.gnupg',
  '.config',
  '.kube',
  '.docker',
  '.gcloud',
  '.npmrc',
  '.netrc',
  '.git-credentials',
  '.m2',
  '.pypirc',
  '.pgpass',
  '.boto',
  '.password-store',
]

/**
 * Resolve a settings-file path to an absolute directory path, with
 * containment checks to prevent hostile or misconfigured settings from
 * redirecting the scanner to sensitive/system locations.
 *
 * Supports:
 *  - absolute paths (checked against containment + sensitive-dir rules)
 *  - `~/...` / bare `~` (home-relative)
 *  - `${workspaceFolder}/...` (VS Code variable)
 *  - anything else (workspace-relative)
 *
 * Returns `null` if:
 *  - the string references an unsupported variable
 *  - the resolved path is `~foo` (no slash — ambiguous POSIX syntax we don't support)
 *  - the resolved path escapes both the workspace and home roots
 *  - the resolved path equals `/`, `$HOME`, or one of SENSITIVE_HOME_SUBDIRS
 */
function resolveCustomLocationPath(
  raw: string,
  workspaceRoot: string,
  home: string
): string | null {
  let s = raw.replace(/\$\{workspaceFolder\}/g, workspaceRoot)
  if (/\$\{[^}]+\}/.test(s)) {
    return null
  }
  // Reject `~someuser/...` (POSIX other-user syntax) — we don't expand it
  // and silently resolving it against workspaceRoot is surprising.
  if (/^~[^/]/.test(s)) {
    return null
  }
  if (s.startsWith('~/') || s === '~') {
    s = path.join(home, s.slice(1))
  }
  if (!path.isAbsolute(s)) {
    s = path.resolve(workspaceRoot, s)
  }
  const resolved = path.normalize(s)
  // Hard-reject filesystem root and bare $HOME.
  if (resolved === '/' || resolved === home) {
    return null
  }
  // Reject sensitive home subdirs regardless of containment outcome.
  for (const sub of SENSITIVE_HOME_SUBDIRS) {
    const sensitive = path.join(home, sub)
    if (
      resolved === sensitive ||
      resolved.startsWith(`${sensitive}${path.sep}`)
    ) {
      return null
    }
  }
  // Containment: resolved path must be inside workspaceRoot or inside home.
  const relWorkspace = path.relative(workspaceRoot, resolved)
  const relHome = path.relative(home, resolved)
  const escapesWorkspace =
    relWorkspace.startsWith('..') || path.isAbsolute(relWorkspace)
  const escapesHome = relHome.startsWith('..') || path.isAbsolute(relHome)
  if (escapesWorkspace && escapesHome) {
    return null
  }
  return resolved
}

/**
 * Mtime-keyed cache for parsed settings files. Keys are absolute paths; values
 * hold the mtimeMs at parse time and the parsed payload (or `null` when the
 * file was missing / malformed). Avoids re-reading `.vscode/settings.json`
 * on every polling cycle when the file hasn't changed.
 */
type SettingsCacheEntry = {
  mtimeMs: number | null
  parsed: Record<string, unknown> | null
}
const MAX_SETTINGS_CACHE_SIZE = 50
const settingsCache = new Map<string, SettingsCacheEntry>()

/**
 * Read a JSONC settings file from disk with mtime-based caching. Returns the
 * parsed object, or `null` if the file is missing / unreadable / invalid.
 */
async function readJsoncSettings(
  settingsPath: string
): Promise<Record<string, unknown> | null> {
  // Reject symlinks — a symlinked settings file could point outside the workspace
  // and bypass the containment checks applied to paths read from it.
  try {
    const lst = await lstat(settingsPath)
    if (lst.isSymbolicLink()) {
      return null
    }
  } catch {
    // File doesn't exist — cache the absence and return.
    putSettingsCache(settingsPath, { mtimeMs: null, parsed: null })
    return null
  }

  let mtimeMs: number | null = null
  try {
    const st = await stat(settingsPath)
    if (!st.isFile()) {
      putSettingsCache(settingsPath, { mtimeMs: null, parsed: null })
      return null
    }
    mtimeMs = st.mtimeMs
  } catch (err) {
    // Only cache ENOENT — transient errors (EACCES, I/O) should retry on next scan.
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      putSettingsCache(settingsPath, { mtimeMs: null, parsed: null })
    }
    return null
  }
  const cached = settingsCache.get(settingsPath)
  if (cached && cached.mtimeMs === mtimeMs) {
    return cached.parsed
  }
  let text: string
  try {
    text = await readFile(settingsPath, 'utf-8')
  } catch {
    // Don't cache readFile errors — they may be transient (EACCES, I/O).
    return null
  }
  const parsed = parseJsonc(text)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    putSettingsCache(settingsPath, { mtimeMs, parsed: null })
    return null
  }
  const payload = parsed as Record<string, unknown>
  putSettingsCache(settingsPath, { mtimeMs, parsed: payload })
  return payload
}

/** Write an entry to the settings cache, evicting the oldest if at capacity. */
function putSettingsCache(path: string, entry: SettingsCacheEntry): void {
  if (
    !settingsCache.has(path) &&
    settingsCache.size >= MAX_SETTINGS_CACHE_SIZE
  ) {
    settingsCache.delete(settingsCache.keys().next().value!)
  }
  settingsCache.set(path, entry)
}

/**
 * Reset the settings cache. Exposed for tests that need deterministic reads
 * across workspaces; not called in production.
 */
export function __resetSettingsCacheForTesting(): void {
  settingsCache.clear()
}

/**
 * Read Copilot's custom skill/instruction/prompt/agent locations from
 * `.vscode/settings.json`. Silent no-op if the file is missing or invalid.
 */
async function readCopilotCustomLocations(
  workspaceRoot: string
): Promise<ScanEntry[]> {
  const parsed = await readJsoncSettings(
    path.join(workspaceRoot, '.vscode', 'settings.json')
  )
  if (!parsed) {
    return []
  }
  const home = homedir()
  const dynamic: ScanEntry[] = []
  const seen = new Set<string>()
  for (const setting of COPILOT_CUSTOM_LOCATION_SETTINGS) {
    for (const loc of extractCustomLocations(parsed[setting.key])) {
      const abs = resolveCustomLocationPath(loc, workspaceRoot, home)
      if (!abs) {
        continue
      }
      if (setting.kind === 'skill-bundle') {
        const dedupKey = `skill-bundle:${abs}`
        if (seen.has(dedupKey)) {
          continue
        }
        seen.add(dedupKey)
        // For dynamic skill bundles the resolved absolute path IS the skills
        // root (user's setting points at a container of skill subdirs).
        dynamic.push({
          kind: 'skill-bundle',
          skillsRoot: '.',
          root: 'absolute',
          absoluteBase: abs,
        })
      } else {
        const dedupKey = `${setting.category}:${abs}`
        if (seen.has(dedupKey)) {
          continue
        }
        seen.add(dedupKey)
        dynamic.push({
          kind: 'glob',
          glob: setting.glob,
          category: setting.category,
          root: 'absolute',
          absoluteBase: abs,
        })
      }
    }
  }
  return dynamic
}

/**
 * Read Claude Code's custom memory directory from user-level
 * `~/.claude/settings.json`. Only `autoMemoryDirectory` is configurable —
 * Claude Code intentionally disallows this key in project settings, so we
 * read user settings only.
 */
async function readClaudeCodeCustomLocations(): Promise<ScanEntry[]> {
  const home = homedir()
  const parsed = await readJsoncSettings(
    path.join(home, '.claude', 'settings.json')
  )
  if (!parsed) {
    return []
  }
  const dynamic: ScanEntry[] = []
  for (const { key, category, glob } of CLAUDE_CODE_CUSTOM_LOCATION_SETTINGS) {
    const raw = parsed[key]
    if (typeof raw !== 'string' || raw.length === 0) {
      continue
    }
    // `${workspaceFolder}` is nonsensical for user-scoped settings — reject it
    // so a typo doesn't silently bind to $HOME.
    if (/\$\{workspaceFolder\}/.test(raw)) {
      continue
    }
    const abs = resolveCustomLocationPath(raw, home, home)
    if (!abs) {
      continue
    }
    dynamic.push({
      kind: 'glob',
      glob,
      category,
      root: 'absolute',
      absoluteBase: abs,
    })
  }
  return dynamic
}

/**
 * Read user-declared custom locations for each platform.
 */
async function readCustomLocations(
  workspaceRoot: string,
  platform: string
): Promise<ScanEntry[]> {
  if (platform === 'copilot') {
    return readCopilotCustomLocations(workspaceRoot)
  }
  if (platform === 'claude-code') {
    return readClaudeCodeCustomLocations()
  }
  return []
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
 * Platform-specific dynamic resolution:
 * - `copilot`: reads `.vscode/settings.json` for `chat.*FilesLocations` /
 *   `chat.agentSkillsLocations` overrides.
 * - `claude-code`: reads `~/.claude/settings.json` for `autoMemoryDirectory`
 *   (user-scope only; Claude Code disallows this key in project settings).
 *
 * No MD5 computed here — the processor handles that after sanitization.
 */
export async function scanContextFiles(
  workspaceRoot: string,
  platform: string,
  sessionId?: string
): Promise<ScanResult> {
  const staticEntries = SCAN_PATHS[platform] ?? []
  const dynamicEntries = await readCustomLocations(workspaceRoot, platform)
  const entries = [...staticEntries, ...dynamicEntries]
  if (entries.length === 0) {
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
  // Track skill file batches keyed by (effectiveRoot, baseDir) for proper grouping.
  // Absolute entries (user-declared paths) use 'workspace' as effectiveRoot so
  // groupSkills can compute skill names and sessionKeys consistently.
  type SkillBatch = {
    root: 'workspace' | 'home'
    baseDir: string
    files: ContextFileEntry[]
  }
  const skillBatches = new Map<string, SkillBatch>()
  const seenPaths = new Set<string>()

  for (const entry of entries) {
    const baseDir = resolveBaseDir(entry, workspaceRoot, home)
    const scope = scopeForRoot(entry.root)
    const isDynamic = entry.root === 'absolute'
    const matches =
      entry.kind === 'skill-bundle'
        ? await enumerateSkillBundle(baseDir, entry.skillsRoot)
        : await enumerateGlob(entry.glob, baseDir, entry.category, isDynamic)

    for (const { path: filePath, category } of matches) {
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
          category,
          mtimeMs: fileStat.mtimeMs,
        }
        if (scope) {
          fileEntry.scope = scope
        }

        if (category === SKILL_CATEGORY) {
          // Skill files are grouped — mtime checked at group level below.
          const effectiveRoot: 'workspace' | 'home' =
            entry.root === 'home' ? 'home' : 'workspace'
          const batchKey = `${effectiveRoot}:${baseDir}`
          let batch = skillBatches.get(batchKey)
          if (!batch) {
            batch = { root: effectiveRoot, baseDir, files: [] }
            skillBatches.set(batchKey, batch)
          }
          batch.files.push(fileEntry)
        } else {
          // Non-skill: filter by per-file mtime
          const prevMtime = sessionEntry?.files.get(filePath)
          if (prevMtime !== undefined && fileStat.mtimeMs <= prevMtime) {
            continue
          }
          allFiles.push(fileEntry)
        }
      } catch {
        // Skip files that can't be read (permissions, encoding, etc.)
      }
    }
  }

  // Group skill files and apply group-level mtime change detection
  const allSkillGroups: SkillGroup[] = []
  for (const { root, baseDir, files } of skillBatches.values()) {
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

/** Plain glob enumeration returning `{path, category}` tuples. */
async function enumerateGlob(
  pattern: string,
  cwd: string,
  category: string,
  isDynamic: boolean
): Promise<{ path: string; category: string }[]> {
  let files: string[]
  try {
    files = await globby(pattern, {
      cwd,
      absolute: true,
      onlyFiles: true,
      dot: true,
      // Never follow symlinks — a malicious committed repo can place a
      // symlink at a scanned path (e.g. .github/copilot-instructions.md →
      // ~/.aws/credentials) and the scanner would read and upload the target.
      followSymbolicLinks: false,
      // Dynamic absolute bases additionally cap traversal depth so a
      // misconfigured setting can't enumerate the whole filesystem.
      ...(isDynamic ? { deep: DYNAMIC_SCAN_MAX_DEPTH } : {}),
    })
  } catch {
    // Missing/unreadable cwd, or any other globby rejection: treat as no
    // matches rather than failing the whole scan.
    return []
  }
  return files.map((path) => ({ path, category }))
}

/**
 * Skill-bundle enumeration: identifies skill directories by finding SKILL.md
 * manifests, then returns ALL files inside each skill directory recursively
 * (including nested subdirectories).
 *
 * Two-pass approach:
 * 1. Find `<skillsRoot>/<skill>/SKILL.md` to identify valid skill dirs.
 * 2. For each skill dir, enumerate all files recursively so the zip pipeline
 *    captures sibling resources, templates, nested helpers, etc.
 *
 * Loose files directly under `<skillsRoot>/` (no skill subdirectory) and
 * directories without a SKILL.md manifest are excluded.
 */
async function enumerateSkillBundle(
  baseDir: string,
  skillsRoot: string
): Promise<{ path: string; category: string }[]> {
  const skillsDir = path.resolve(baseDir, skillsRoot)

  // Pass 1: find skill directories via their SKILL.md manifests
  let manifests: string[]
  try {
    manifests = await globby('*/SKILL.md', {
      cwd: skillsDir,
      absolute: true,
      onlyFiles: true,
      dot: true,
      followSymbolicLinks: false,
      deep: SKILL_MANIFEST_SCAN_DEPTH,
    })
  } catch {
    return []
  }

  // Pass 2: enumerate all files inside each discovered skill directory (in parallel)
  const perSkillResults = await Promise.all(
    manifests.map(async (manifest) => {
      const skillDir = path.dirname(manifest)
      try {
        return await globby('**/*', {
          cwd: skillDir,
          absolute: true,
          onlyFiles: true,
          dot: true,
          followSymbolicLinks: false,
          deep: SKILL_BUNDLE_MAX_DEPTH,
        })
      } catch {
        return []
      }
    })
  )
  return perSkillResults.flat().map((p) => ({ path: p, category: 'skill' }))
}

/** Maximum traversal depth for dynamic (user-declared) scan directories. */
const DYNAMIC_SCAN_MAX_DEPTH = 6
/** Depth for SKILL.md manifest discovery: skill dirs are one level under the skills root. */
const SKILL_MANIFEST_SCAN_DEPTH = 2
/** Depth for enumerating all files inside a discovered skill directory. */
const SKILL_BUNDLE_MAX_DEPTH = 5

/** Resolve the base directory for a ScanEntry. */
function resolveBaseDir(
  entry: ScanEntry,
  workspaceRoot: string,
  home: string
): string {
  switch (entry.root) {
    case 'home':
      return home
    case 'absolute':
      return entry.absoluteBase
    default:
      return workspaceRoot
  }
}

/**
 * Authoritative scope derived from `ScanEntry.root`. `home` and `absolute`
 * entries are always user-global (they live outside the workspace). Workspace
 * entries return `undefined` so the server's path-based inference can still
 * classify `.github/` as `repo` vs other workspace paths as `project`.
 */
function scopeForRoot(root: ScanEntry['root']): 'user-global' | undefined {
  if (root === 'home' || root === 'absolute') {
    return 'user-global'
  }
  return undefined
}

function deriveIdentifier(filePath: string, baseDir: string): string {
  const relative = path.relative(baseDir, filePath)
  if (!relative.startsWith('..')) {
    return relative.replace(/\\/g, '/')
  }
  return path.basename(filePath)
}
