import * as assert from 'node:assert'
import { test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

/**
 * MOBB-3810 / MOBB-3816 — CLI-time gate enforcement, end to end.
 *
 * The backend decides whether the effective Scan & Gate Policy (org + project)
 * blocks the report; the CLI only translates that verdict into an exit code
 * (0 pass / 2 blocked). This suite drives the whole stack: policy → real
 * OpenGrep scan of a public vulnerable repo → verdict → exit code.
 *
 * Three scenarios; each runs in isolation because the shared before() fixture
 * (not a sibling subtest) supplies the project id + fired rule ids, and each
 * subtest sets both the org AND project policy it needs and re-scans a clean
 * project:
 *  1. Default org policy (gate-on-by-default) blocks.
 *  2. Un-gating the fired rules at the org passes.
 *  3. A project-level gate overrides the org's un-gate and blocks again.
 *
 * The project id and fired rule ids are discovered once in before() from a
 * default-policy scan — both stable across runs (same repo → same project +
 * same rules). before() also clears the project policy so a gate leaked by a
 * crashed prior run can't taint scenario 1.
 *
 * Runs non-interactively (--ci --api-key), so unlike index.mjs there is no
 * login choreography.
 */

const SVJP_REPO = 'https://github.com/mobb-dev/simple-vulnerable-java-project'
const REPORT_URL_RE =
  /\/organization\/[^/]+\/project\/[^/]+\/report\/([0-9a-f-]{36})/
// Same URL, capturing the project id — the project scan policy is set on it.
const PROJECT_URL_RE =
  /\/organization\/[^/]+\/project\/([0-9a-f-]{36})\/report\//
const SCAN_TIMEOUT_MS = 300000

test('Bugsy gate E2E tests', async (t) => {
  let organizationId
  let apiKey
  // Read-only fixture from the before() discovery scan: the project the CLI uses
  // for this repo and the rule ids that fire. Both are stable across runs, so
  // every subtest sets its own policy and re-scans a clean project.
  let projectId
  let firedRuleIds = []

  /**
   * One gated scan-only analyze run. --scan-only keeps the backend from
   * generating fixes (irrelevant here and slow); the verdict only needs the
   * digested findings. extraArgs lets runs cover both analysis-wait transports
   * (--polling vs the default WebSocket).
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

  // A ScanPolicyDoc that gates (true) or un-gates (false) exactly the fired
  // rules — the "ignore/enforce this specific issue" motion, driven by the
  // report's own data instead of hardcoded rule ids that rot when rules change.
  const firedRuleGateDoc = (blocking) =>
    JSON.stringify({
      ruleGate: Object.fromEntries(firedRuleIds.map((id) => [id, blocking])),
    })

  // Fail fast on the one environment gap that otherwise surfaces as a confusing
  // wrong verdict: without rules_manifest.json the backend cannot classify the
  // rule ids and per-rule gate overrides are silently ignored.
  const assertRulesRecognized = (warnings) =>
    assert.deepStrictEqual(
      warnings.filter((warning) => warning.includes('unknown rule id')),
      [],
      'Backend does not recognize the fired rule ids — is rules_manifest.json missing? Run scripts/opengrep_init.sh.'
    )

  await t.before(async () => {
    await mobbApi.init()
    await registry.start()
    await npm.init()

    organizationId = await mobbApi.getOrganizationId()
    apiKey = await mobbApi.createApiToken()

    // Two-step discovery, isolated from any policy a crashed prior run leaked:
    //   1. A first scan only to learn the project id (its report may have run
    //      under a leaked policy, so we never read rule ids from it).
    //   2. Clear org + project policy, then a second CLEAN scan whose report
    //      supplies firedRuleIds. Clearing after step 1 can't repair step 1's
    //      already-created report, so the rule ids must come from step 2.
    // --polling on step 1 covers the polling analysis-wait branch; scenario scans
    // cover the default WebSocket branch.
    await mobbApi.updateOrgScanPolicy(organizationId, null)
    const discovery = await runGatedAnalyze(['--polling'])
    projectId = discovery.getOutput().match(PROJECT_URL_RE)?.[1]
    assert.ok(
      projectId,
      `Discovery scan must yield a project id. Output: ${discovery
        .getOutput()
        .slice(-2048)}`
    )

    await mobbApi.updateProjectScanPolicy(projectId, null)
    await mobbApi.updateOrgScanPolicy(organizationId, null)
    const clean = await runGatedAnalyze()
    const fixReportId = clean.getOutput().match(REPORT_URL_RE)?.[1]
    assert.ok(
      fixReportId,
      `Clean discovery scan must yield a report. Output: ${clean
        .getOutput()
        .slice(-2048)}`
    )

    // extra_data.rule_id is written during analysis; with --gate the CLI already
    // waits for Finished, so the first read normally succeeds. Poll as a margin.
    const ruleIdsDeadline = Date.now() + 120000
    while (firedRuleIds.length === 0 && Date.now() < ruleIdsDeadline) {
      firedRuleIds = await mobbApi.getReportFindingRuleIds(fixReportId)
      if (firedRuleIds.length === 0) {
        await delay(3000)
      }
    }
    assert.ok(
      firedRuleIds.length > 0,
      `Findings must carry extra_data.rule_id — did the engine persist rule ids for this scan? fixReportId=${fixReportId}`
    )
  })

  await t.after(async () => {
    // Best-effort teardown that still FAILS the suite on error: every step runs
    // (one failure can't skip the rest and leave a leftover policy or a running
    // registry that wedges the next suite), errors are collected, and an
    // aggregate is thrown at the end so CI can't go green on polluted shared
    // org/project state.
    const cleanups = [
      () =>
        projectId
          ? mobbApi.updateProjectScanPolicy(projectId, null)
          : undefined,
      () =>
        organizationId
          ? mobbApi.updateOrgScanPolicy(organizationId, null)
          : undefined,
      () => registry.stop(),
      () => npm.destroy(),
    ]
    const errors = []
    for (const cleanup of cleanups) {
      try {
        await cleanup()
      } catch (error) {
        errors.push(error)
      }
    }
    if (errors.length > 0) {
      throw new AggregateError(errors, 'gate e2e teardown failed')
    }
  })

  await t.test(
    'gate: the default org policy blocks a vulnerable scan',
    async () => {
      // Clean slate: default (cleared) org policy, no project override.
      await mobbApi.updateOrgScanPolicy(organizationId, null)
      await mobbApi.updateProjectScanPolicy(projectId, null)
      const blockedRun = await runGatedAnalyze()
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
    }
  )

  await t.test(
    'gate: un-gating the fired rules at the org lets the scan pass',
    async () => {
      // No project override; the org un-gates exactly the rules that fired.
      await mobbApi.updateProjectScanPolicy(projectId, null)
      const { warnings } = await mobbApi.updateOrgScanPolicy(
        organizationId,
        firedRuleGateDoc(false)
      )
      assertRulesRecognized(warnings)

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

  await t.test(
    'gate: a project-level gate overrides the org and re-blocks the merge',
    async () => {
      // Org un-gates the fired rules (org-effective verdict = pass)…
      await mobbApi.updateOrgScanPolicy(organizationId, firedRuleGateDoc(false))
      // …and the project re-gates the same rules. resolveEffectiveGatePolicyDocs
      // lets the project's ruleGate win over the org's, so the scan blocks again.
      const { warnings } = await mobbApi.updateProjectScanPolicy(
        projectId,
        firedRuleGateDoc(true)
      )
      assertRulesRecognized(warnings)

      const reblockedRun = await runGatedAnalyze()
      assert.strictEqual(
        reblockedRun.getExitCode(),
        2,
        `A project gate that re-blocks the org-passed rules must exit 2. Output: ${reblockedRun
          .getOutput()
          .slice(-2048)}`
      )
      assert.match(
        reblockedRun.getOutput(),
        /blocking merge/,
        'Blocked verdict must be spelled out to the user.'
      )
    }
  )
})
