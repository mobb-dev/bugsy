/**
 * T-467 — DD metric names used by the quarantine pipeline.
 *
 * Emitted as structured log entries via the caller's `log` instance. The
 * CLI ships logs through Datadog's agent, so each `log.info(...)` with a
 * `metric` field and numeric value becomes a dogstatsd-friendly datapoint
 * downstream. Keeping the names centralized so metric dashboards / alerts
 * can reference a single source.
 */
export const Metric = {
  /** A heartbeat triggered the quarantine check (after debounce). */
  CHECK_TRIGGERED: 'skill_quarantine.check_triggered',
  /** The env-var kill switch skipped the run. */
  CHECK_DISABLED_ENV: 'skill_quarantine.check_disabled_env',
  /** Verdict-query call failed. Fail-open. */
  QUERY_ERROR: 'skill_quarantine.query_error',
  /** Count of skills enumerated in this run (histogram-ish). */
  SKILLS_CHECKED: 'skill_quarantine.skills_checked',
  /** A skill was freshly quarantined. Tagged with shape. */
  QUARANTINED: 'skill_quarantine.quarantined',
  /** Presence check hit; skill already quarantined. */
  ALREADY_QUARANTINED: 'skill_quarantine.already_quarantined',
  /** Move step failed. Tagged with phase (stage | publish). */
  MOVE_ERROR: 'skill_quarantine.move_error',
  /** Stub creation failed after the move succeeded. */
  STUB_ERROR: 'skill_quarantine.stub_error',
  /** A stale staging dir was swept. */
  ORPHAN_SWEPT: 'skill_quarantine.orphan_swept',
  /** Total run duration including I/O. */
  DURATION_MS: 'skill_quarantine.duration_ms',
} as const

export type MetricName = (typeof Metric)[keyof typeof Metric]
