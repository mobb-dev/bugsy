import * as assert from 'node:assert'
import { test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

/**
 * MOBB-3810 — CLI-time gate enforcement, end to end.
 *
 * The backend decides whether the org's Scan & Gate Policy blocks the report;
 * the CLI only translates that verdict into an exit code (0 pass / 2 blocked).
 * This suite drives the whole stack: org policy → real OpenGrep scan of a
 * public vulnerable repo → verdict → exit code, then un-gates the exact rules
 * that fired and proves the same scan passes.
 *
 * Runs non-interactively (--ci --api-key), so unlike index.mjs there is no
 * login choreography.
 */

const SVJP_REPO = 'https://github.com/mobb-dev/simple-vulnerable-java-project'
const REPORT_URL_RE =
  /\/organization\/[^/]+\/project\/[^/]+\/report\/([0-9a-f-]{36})/
const SCAN_TIMEOUT_MS = 300000

test('Bugsy gate E2E tests', async (t) => {
  let organizationId
  let apiKey

  await t.before(async () => {
    await mobbApi.init()
    await registry.start()
    await npm.init()

    organizationId = await mobbApi.getOrganizationId()
    apiKey = await mobbApi.createApiToken()
  })

  await t.after(async () => {
    // Leave a clean org for the other suites and the next run.
    if (organizationId) {
      await mobbApi.updateOrgScanPolicy(organizationId, null)
    }
    await registry.stop()
    await npm.destroy()
  })

  /**
   * One gated scan-only analyze run. --scan-only keeps the backend from
   * generating fixes (irrelevant here and slow); the verdict only needs the
   * digested findings. extraArgs lets the two runs cover both analysis-wait
   * transports (--polling vs the default WebSocket).
   */
  const runGatedAnalyze = async (extraArgs = []) => {
    const bugsy = await npm.npx(
      [
        'mobbdev',
        'analyze',
        '-r',
        SVJP_REPO,
        '--ci',
        '--api-key',
        apiKey,
        '--scan-only',
        '--gate',
        ...extraArgs,
      ],
      CLI_LOCAL_ENV_OVERWRITE
    )
    await bugsy.waitForString(REPORT_URL_RE, SCAN_TIMEOUT_MS)
    await bugsy.waitForExit()
    return bugsy
  }

  await t.test(
    'gate: default policy blocks, un-gating the fired rules passes',
    async () => {
      // 1. Define the org gate policy: cleared = gate-on-by-default, so every
      //    scanned finding blocks. Clearing (not setting) keeps the test
      //    idempotent across reruns.
      await mobbApi.updateOrgScanPolicy(organizationId, null)

      // 2-3. Scan the vulnerable repo; the default gate must block. This run
      //    uses --polling so the polling analysis-wait branch is covered; the
      //    passing run below covers the default WebSocket branch.
      const blockedRun = await runGatedAnalyze(['--polling'])
      assert.strictEqual(
        blockedRun.getExitCode(),
        2,
        `Gated scan of a vulnerable repo must exit 2. Output: ${blockedRun
          .getOutput()
          .slice(-2048)}`
      )
      assert.match(
        blockedRun.getOutput(),
        /blocking merge/,
        'Blocked verdict must be spelled out to the user.'
      )

      const fixReportId = blockedRun.getOutput().match(REPORT_URL_RE)[1]

      // 4. Un-gate exactly the rules that fired — the "ignore this specific
      //    issue from the gate" product motion, driven by the report's own
      //    data instead of hardcoded rule ids that rot when rules change.
      //
      // Polled as a robustness margin: extra_data.rule_id is written during
      // the analysis phase. With --gate the CLI already waits for Finished, so
      // the first read normally succeeds immediately.
      let ruleIds = []
      const ruleIdsDeadline = Date.now() + 120000
      while (ruleIds.length === 0 && Date.now() < ruleIdsDeadline) {
        ruleIds = await mobbApi.getReportFindingRuleIds(fixReportId)
        if (ruleIds.length === 0) {
          await delay(3000)
        }
      }
      assert.ok(
        ruleIds.length > 0,
        `Findings must carry extra_data.rule_id — did the engine persist rule ids for this scan? fixReportId=${fixReportId}`
      )

      const { warnings } = await mobbApi.updateOrgScanPolicy(
        organizationId,
        JSON.stringify({
          ruleGate: Object.fromEntries(ruleIds.map((id) => [id, false])),
        })
      )
      // Fail fast on the one environment gap that would otherwise show up as a
      // confusing exit-2 below: without rules_manifest.json the backend cannot
      // classify the rule ids and per-rule gate overrides are ignored. Only the
      // unknown-rule-id warnings matter here — an unrelated future warning must
      // not misfire this assert.
      assert.deepStrictEqual(
        warnings.filter((warning) => warning.includes('unknown rule id')),
        [],
        'Backend does not recognize the fired rule ids — is rules_manifest.json missing? Run scripts/opengrep_init.sh.'
      )

      // 5-6. Same scan again; nothing gated is left, so the gate must pass.
      const passedRun = await runGatedAnalyze()
      assert.strictEqual(
        passedRun.getExitCode(),
        0,
        `With every fired rule un-gated the scan must exit 0. Output: ${passedRun
          .getOutput()
          .slice(-2048)}`
      )
      assert.match(
        passedRun.getOutput(),
        /none block the merge/,
        'Passing verdict must say findings exist but nothing blocks.'
      )
    }
  )
})
