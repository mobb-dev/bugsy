import chalk from 'chalk'

import { CliError } from '../../utils'
import type { GetGateVerdictQuery } from './scm/generates/client_generates'

type GateVerdictAnswer = GetGateVerdictQuery['getGateVerdict']

/**
 * Ask the backend for the gate verdict on a report and turn it into CLI
 * behavior (MOBB-3810): print the verdict, resolve when nothing blocks, and
 * throw an exit-code-2 CliError when the Scan & Gate Policy blocks the run.
 * The backend is the only decider — this module never sees the policy or the
 * issue list, only the verdict.
 *
 * MUST be called only after the report reaches `Finished`. On the CLI flow the
 * finding's `extra_data.rule_id` — the key per-rule and per-issue-type gate
 * overrides resolve against — is written during the analysis phase, seconds
 * AFTER the digest. A verdict fetched earlier falls back to severity-only
 * gating and over-blocks findings the policy explicitly un-gated. (The webhook
 * path is safe by construction: its completion event fires only after the
 * batch processing that writes the rule ids.) The backend refuses pre-Finished
 * reports with NotReady for the same reason.
 *
 * NotReady is unreachable here (the caller already waited for Finished), so it
 * is treated like any other operational error: message + exit 1.
 */
export async function enforceGateVerdict({
  gqlClient,
  fixReportId,
}: {
  gqlClient: {
    getGateVerdict(fixReportId: string): Promise<GateVerdictAnswer>
  }
  fixReportId: string
}): Promise<void> {
  const verdict = await gqlClient.getGateVerdict(fixReportId)

  if (verdict.__typename === 'GateVerdictError') {
    throw new CliError(`🚧 Gate verdict unavailable: ${verdict.error}`)
  }
  if (verdict.__typename === 'GateVerdictNotReady') {
    throw new CliError(
      `🚧 Gate verdict not ready — report state is ${verdict.state}`
    )
  }

  if (verdict.degraded) {
    console.log(
      chalk.yellow(
        '⚠️  The gate policy could not be read; the fail-closed default was applied.'
      )
    )
  }

  if (verdict.blocking) {
    // The message is the exit reason CI users see; index.ts prints it and
    // exits with the carried code.
    throw new CliError(chalk.red(`🚧 Gate: ${verdict.description}`), {
      exitCode: 2,
    })
  }

  console.log(chalk.green(`🚧 Gate: ${verdict.description}`))
}
