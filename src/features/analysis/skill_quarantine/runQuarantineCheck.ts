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

  // Debounce: a per-session last-run map caps check frequency.
  const now = Date.now()
  const prev = lastRunAt.get(sessionId)
  if (prev !== undefined && now - prev < HEARTBEAT_DEBOUNCE_MS) {
    return
  }
  lastRunAt.set(sessionId, now)

  log.info(
    { sessionId, metric: Metric.CHECK_TRIGGERED },
    'skill_quarantine: check start'
  )
  const t0 = Date.now()

  try {
    // Step 1: finish any leftover tmp archives and clean stale partials.
    await reconcileAndSweep(log)

    // Step 2: enumerate installed skills + compute md5s.
    const installed = await enumerateInstalledSkills(cwd)
    log.info(
      { sessionId, count: installed.length, metric: Metric.SKILLS_CHECKED },
      'skill_quarantine: skills enumerated'
    )
    if (installed.length === 0) {
      return
    }

    // Step 3: batched verdict query — fail-open on errors.
    const verdicts = await queryVerdicts(
      gqlClient,
      installed.map((s) => s.md5),
      log
    )

    // Step 4: quarantine each MALICIOUS skill.
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
  killSwitchLogged = false
}
