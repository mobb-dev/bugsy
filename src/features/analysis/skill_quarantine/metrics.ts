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
  /**
   * T-493 — the per-org opt-in toggle was off for every org the caller
   * belongs to. Verdict query still ran (useful server-side telemetry);
   * on-disk enforcement was skipped.
   */
  CHECK_DISABLED_ORG: 'skill_quarantine.check_disabled_org',
  /** Verdict-query call failed. Fail-open. */
  QUERY_ERROR: 'skill_quarantine.query_error',
  /** Count of skills enumerated in this run. */
  SKILLS_CHECKED: 'skill_quarantine.skills_checked',
  /** A skill was freshly quarantined. */
  QUARANTINED: 'skill_quarantine.quarantined',
  /** Presence check hit (`<md5>.zip` exists); skill already quarantined. */
  ALREADY_QUARANTINED: 'skill_quarantine.already_quarantined',
  /** Zip build or partial→tmp rename failed (phase 1). */
  ZIP_ERROR: 'skill_quarantine.zip_error',
  /** Stub write failed (phase 2); tmp preserved for reconcile. */
  STUB_ERROR: 'skill_quarantine.stub_error',
  /** Tmp→published rename failed (phase 3); reconcile will retry. */
  PUBLISH_ERROR: 'skill_quarantine.publish_error',
  /** Reconcile published a leftover tmp whose `<md5>.zip` was missing. */
  RECONCILED: 'skill_quarantine.reconciled',
  /** Tmp removed because `<md5>.zip` already existed. */
  SWEPT_REDUNDANT_TMP: 'skill_quarantine.swept_redundant_tmp',
  /** Stale partial zip swept (older than grace window). */
  SWEPT_PARTIAL: 'skill_quarantine.swept_partial',
  /** Total run duration including I/O. */
  DURATION_MS: 'skill_quarantine.duration_ms',
  /**
   * T-492 — Stub-md5 sentinel published successfully. The next heartbeat's
   * presence check will short-circuit re-quarantining our own stub.
   */
  STUB_PREREGISTERED: 'skill_quarantine.stub_preregistered',
  /**
   * T-492 — Stub-md5 sentinel write failed. Layer 1 (the scanner LLM
   * recognising stubs) still protects against the loop; this layer is
   * defense in depth.
   */
  STUB_PREREGISTER_ERROR: 'skill_quarantine.stub_preregister_error',
} as const

export type MetricName = (typeof Metric)[keyof typeof Metric]
