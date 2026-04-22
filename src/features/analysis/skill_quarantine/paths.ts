import { homedir } from 'node:os'
import path from 'node:path'

/**
 * T-467 — filesystem layout for client-side skill quarantine.
 *
 * All paths are Tracy-owned under `~/.tracy/`. The `{platform}/{category}/`
 * nesting leaves room for future extensions (Cursor, VS Code, other
 * categories) without rename churn — see plan §3.1.
 */

/**
 * Root for Claude Code skill quarantine.
 * Example: `/Users/alice/.tracy/quarantine/claude/skills/`.
 */
export function getQuarantineRoot(): string {
  return path.join(homedir(), '.tracy', 'quarantine', 'claude', 'skills')
}

/**
 * Presence of this directory is the "already quarantined" signal.
 * Example: `~/.tracy/quarantine/claude/skills/a1b2c3.../`.
 */
export function getQuarantinedHashDir(md5: string): string {
  return path.join(getQuarantineRoot(), md5)
}

/**
 * Final destination for the moved skill content.
 * For folder skills this is a directory; for standalone `.md` skills it is
 * a file. `origName` includes the extension for standalone skills.
 */
export function getQuarantinedTargetPath(
  md5: string,
  origName: string
): string {
  return path.join(getQuarantinedHashDir(md5), origName)
}

/**
 * Unique staging directory for a single quarantine attempt. The uuid
 * suffix prevents collisions between two daemons on the same machine or
 * successive retries for the same md5.
 */
export function getStagingDir(md5: string, pid: number, uuid: string): string {
  return path.join(getQuarantineRoot(), `${md5}_tmp_${pid}_${uuid}`)
}

/** Regex for identifying staging dirs during orphan sweep. */
export const STAGING_DIR_REGEX = /^([0-9a-f]{32})_tmp_/
