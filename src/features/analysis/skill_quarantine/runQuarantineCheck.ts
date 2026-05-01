import { stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

import type { Logger } from '../../../utils/shared-logger/create-logger'
import { GQLClient } from '../graphql/gql'
import {
  HEARTBEAT_DEBOUNCE_MS,
  KILL_SWITCH_ENV,
  MALICIOUS_VERDICT,
} from './constants'
import { enumerateInstalledSkills } from './enumerateInstalledSkills'
import { Metric } from './metrics'
import { quarantineSkill, reconcileAndSweep } from './quarantineSkill'
import { queryVerdicts } from './queryVerdicts'

// Directories that can contain skills. A newly installed skill always modifies
// one of these, so directory mtime is a cheap proxy for "something changed."
const SKILL_PARENT_DIRS = [
  '.claude/skills',
  '.claude/commands',
  '.claude/agents',
]

async function getSkillDirsMtimeMs(cwd: string): Promise<number> {
  const home = homedir()
  const dirs = SKILL_PARENT_DIRS.flatMap((d) => [
    path.join(cwd, d),
    path.join(home, d),
  ])
  let max = 0
  for (const dir of dirs) {
    try {
      const s = await stat(dir)
      if (s.mtimeMs > max) max = s.mtimeMs
    } catch {
      // directory doesn't exist — not an error
    }
  }
  return max
}

/**
 * T-467 — orchestrate a single quarantine check for a session.
 *
 * Default-on for all customers. Only opt-OUT via
 * MOBB_TRACY_SKILL_QUARANTINE_DISABLE=1 (IR / kill switch).
 *
 * - in-memory debounce per sessionId (30s) prevents overlapping runs.
 * - everything inside a top-level try/catch; errors never propagate.
 */

export type RunQuarantineCheckOpts = {
  sessionId: string
  cwd: string
  gqlClient: GQLClient
  log: Logger
}

/** Keyed by sessionId. Exported for testability only. */
const lastRunAt = new Map<string, number>()
/** Maximum mtime (ms) of skill parent dirs at the time of the last full check. */
const lastDirsMtimeMs = new Map<string, number>()
/** md5s of skills that have already passed through a quarantine check this process lifetime. */
const seenSkillMd5s = new Set<string>()
let killSwitchLogged = false

export async function runQuarantineCheckIfNeeded(
  opts: RunQuarantineCheckOpts
): Promise<void> {
  const { sessionId, cwd, gqlClient, log } = opts

  // Env-var kill switch: hard-skip everything.
  if (process.env[KILL_SWITCH_ENV] === '1') {
    if (!killSwitchLogged) {
      log.warn(
        { metric: Metric.CHECK_DISABLED_ENV },
        `skill_quarantine: disabled by ${KILL_SWITCH_ENV}=1`
      )
      killSwitchLogged = true
    }
    return
  }

  const now = Date.now()
  const prev = lastRunAt.get(sessionId)
  const withinDebounce =
    prev !== undefined && now - prev < HEARTBEAT_DEBOUNCE_MS

  // Set lastRunAt before any await to close the TOCTOU window: two concurrent
  // calls could both read the same (stale) prev and both proceed past the
  // debounce check. After this line the second concurrent call will see `now`
  // and be gated by the debounce as intended.
  lastRunAt.set(sessionId, now)

  // Within the debounce window, use parent-directory mtime as a cheap proxy for
  // "a new skill was installed." Statting ~6 dirs costs microseconds; a full
  // zip+md5 enumeration can cost milliseconds per skill. If no dir has changed,
  // skip enumeration entirely. If a dir changed, fall through to full enumeration
  // which may still detect the new md5 and bypass the debounce.
  const dirsMtime = await getSkillDirsMtimeMs(cwd)
  if (withinDebounce && dirsMtime <= (lastDirsMtimeMs.get(sessionId) ?? 0)) {
    return
  }

  const installed = await enumerateInstalledSkills(cwd)
  const hasNewSkills = installed.some((s) => !seenSkillMd5s.has(s.md5))

  if (!hasNewSkills && withinDebounce) {
    return
  }

  lastDirsMtimeMs.set(sessionId, dirsMtime)

  log.info(
    { sessionId, metric: Metric.CHECK_TRIGGERED, hasNewSkills },
    'skill_quarantine: check start'
  )
  const t0 = Date.now()

  try {
    // Step 1: finish any leftover tmp archives and clean stale partials.
    await reconcileAndSweep(log)

    log.info(
      { sessionId, count: installed.length, metric: Metric.SKILLS_CHECKED },
      'skill_quarantine: skills enumerated'
    )
    if (installed.length === 0) {
      return
    }

    // Mark all current skills as seen BEFORE the network call so that a
    // transient network error still causes the debounce to apply on the next
    // tick instead of hammering the verdict endpoint at full ~5s frequency.
    // Also reconcile: remove md5s no longer present so a re-installed
    // quarantined skill is treated as new and re-checked promptly.
    const currentMd5s = new Set(installed.map((s) => s.md5))
    for (const md5 of seenSkillMd5s) {
      if (!currentMd5s.has(md5)) seenSkillMd5s.delete(md5)
    }
    for (const skill of installed) {
      seenSkillMd5s.add(skill.md5)
    }

    // Step 2: batched verdict query — fail-open on errors.
    const { verdicts, quarantineEnabled } = await queryVerdicts(
      gqlClient,
      installed.map((s) => s.md5),
      log
    )

    // T-493: per-org opt-in. If no org the user belongs to has enabled
    // quarantine, skip on-disk enforcement entirely. Verdict rows are
    // still useful telemetry server-side, so the network call above is
    // not skipped — only the file-moving step. Logged once per check so
    // we can observe the opt-in distribution in DD.
    if (!quarantineEnabled) {
      log.info(
        { sessionId, metric: Metric.CHECK_DISABLED_ORG },
        'skill_quarantine: opt-in not enabled for any org of caller; skipping enforcement'
      )
      return
    }

    // Step 3: quarantine each MALICIOUS skill.
    for (const skill of installed) {
      const verdict = verdicts.get(skill.md5)
      if (!verdict || verdict.verdict !== MALICIOUS_VERDICT) {
        continue
      }
      try {
        await quarantineSkill({
          skillPath: skill.skillPath,
          isFolder: skill.isFolder,
          md5: skill.md5,
          origName: skill.origName,
          verdict,
          log,
        })
      } catch (err) {
        // quarantineSkill swallows its own errors and returns a status,
        // so this catch is defense-in-depth for unexpected throws only.
        log.error(
          { err, md5: skill.md5, skillPath: skill.skillPath },
          'skill_quarantine: unexpected error during quarantine'
        )
      }
    }
  } finally {
    log.info(
      {
        sessionId,
        duration_ms: Date.now() - t0,
        metric: Metric.DURATION_MS,
      },
      'skill_quarantine: check done'
    )
  }
}

/** Test helper: clear in-memory debounce state. */
export function __resetQuarantineCheckStateForTests(): void {
  lastRunAt.clear()
  lastDirsMtimeMs.clear()
  seenSkillMd5s.clear()
  killSwitchLogged = false
}
