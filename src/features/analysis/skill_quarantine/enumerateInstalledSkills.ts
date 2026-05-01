import { homedir } from 'node:os'
import path from 'node:path'

import { processContextFiles } from '../context_file_processor'
import { scanContextFiles, type SkillGroup } from '../context_file_scanner'

/**
 * T-467 — enumerate locally installed Claude Code skills and compute
 * their md5s using the same zip+hash algorithm the uploader uses (via
 * `processContextFiles`). Client and server therefore agree on the key
 * by construction.
 */

export type InstalledSkill = {
  /** Absolute path on disk. Directory for folder skills, `.md` file for standalone. */
  skillPath: string
  /** md5 of the sanitized zip bundle (same as `tracy_context_file.md5`). */
  md5: string
  /** Basename — folder name for folder skills, filename with extension for standalone. */
  origName: string
  /** Whether the skill is a folder (true) or a single `.md` file (false). */
  isFolder: boolean
}

export async function enumerateInstalledSkills(
  workspaceRoot: string
): Promise<InstalledSkill[]> {
  // Pass undefined sessionId so no mtime dedup — quarantine needs a full
  // snapshot every tick.
  const { skillGroups, regularFiles } = await scanContextFiles(
    workspaceRoot,
    'claude-code',
    undefined
  )

  // Agent-config files (.claude/agents/*.md) can carry malicious system-prompt
  // instructions and therefore need the same quarantine protection as skills.
  // Treat each one as a synthetic standalone skill group so processContextFiles
  // zips it and computes an md5 the server can look up.
  const home = homedir()
  const agentGroups: SkillGroup[] = regularFiles
    .filter((f) => f.category === 'agent-config')
    .map((f) => ({
      name: path.basename(f.path, path.extname(f.path)),
      root: f.path.startsWith(home + path.sep)
        ? ('home' as const)
        : ('workspace' as const),
      skillPath: f.path,
      files: [f],
      isFolder: false,
      maxMtimeMs: f.mtimeMs,
      sessionKey: `agent-config:${f.path}`,
    }))

  const allGroups = [...skillGroups, ...agentGroups]
  if (allGroups.length === 0) {
    return []
  }

  const { skills } = await processContextFiles([], allGroups)

  return skills.map((s) => {
    // For folder skills, origName is the final path segment (dir name).
    // For standalone skills (.claude/skills/someskill.md), origName is the full filename (e.g. someskill.md).
    const parts = s.group.skillPath.split(/[\\/]/)
    const origName = parts[parts.length - 1] || s.group.name
    return {
      skillPath: s.group.skillPath,
      md5: s.md5,
      origName,
      isFolder: s.group.isFolder,
    }
  })
}
