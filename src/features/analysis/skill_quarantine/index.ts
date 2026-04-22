/**
 * T-467 — client-side skill quarantine for Claude Code CLI.
 *
 * Public surface. Consumers (the CLI data collector) call
 * `runQuarantineCheckIfNeeded` once per heartbeat — it debounces, queries
 * the backend for MALICIOUS verdicts on installed skills, and moves any
 * flagged skill into `~/.tracy/quarantine/claude/skills/{md5}/` with a
 * stub at the original path.
 */
export type { RunQuarantineCheckOpts } from './runQuarantineCheck'
export { runQuarantineCheckIfNeeded } from './runQuarantineCheck'
