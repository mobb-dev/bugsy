import { runAnalysis } from '@mobb/bugsy/features/analysis'
import { GQLClient } from '@mobb/bugsy/features/analysis/graphql'
import { mobbCliCommand } from '@mobb/bugsy/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createOpenMockImplementation,
  setupCommonBeforeEach,
  token,
} from './integration-test-utils'

vi.useFakeTimers({ shouldAdvanceTime: true })

const { _createOpenMock } = vi.hoisted(() => ({ _createOpenMock: vi.fn() }))
vi.mock('open', () => ({ default: _createOpenMock }))

setupCommonBeforeEach()

const _openMockImpl = createOpenMockImplementation()
beforeEach(() => {
  _createOpenMock.mockImplementation(_openMockImpl)
})

// mobb-dev/simple-vulnerable-java-project has exactly two commits:
//   d3582ba "init"       — pre-existing SQLi findings the opengrep rule pack catches
//   3bcfcb0 "test commit" — adds CMDInjectionExample.java, whose System.out.println
//                           calls the rule pack now flags (USE_OF_SYSTEM_OUTPUT_STREAM).
// That makes this a clean contrast fixture: a baseline-filtered scan returns ONLY
// the post-baseline file (CMDInjectionExample.java) and excludes the pre-existing
// SQLi backlog, so it reports strictly fewer paths than an unfiltered scan of HEAD.
const REPO = 'https://github.com/mobb-dev/simple-vulnerable-java-project'
const HEAD_SHA = '3bcfcb0f8d0932b9453b427667dd034b82a1d2d5'
const BASELINE_SHA = 'd3582bad097136e59cb381e0183d2f09a8921386'

describe('Analyze with --baseline-commit', () => {
  it('filters opengrep findings to only those introduced after the baseline', async () => {
    const baselineAnalysisId = await runAnalysis(
      {
        repo: REPO,
        ref: HEAD_SHA,
        ci: true,
        command: mobbCliCommand.analyze,
        mobbProjectName: 'baseline-commit-with',
        baselineCommit: BASELINE_SHA,
      },
      { skipPrompts: true }
    )

    const fullAnalysisId = await runAnalysis(
      {
        repo: REPO,
        ref: HEAD_SHA,
        ci: true,
        command: mobbCliCommand.analyze,
        mobbProjectName: 'baseline-commit-without',
      },
      { skipPrompts: true }
    )

    const gqlClient = new GQLClient({ token, type: 'token' })
    const [baselineAnalysis, fullAnalysis] = await Promise.all([
      gqlClient.getAnalysis(baselineAnalysisId),
      gqlClient.getAnalysis(fullAnalysisId),
    ])
    const [baselinePaths, fullPaths] = await Promise.all([
      gqlClient.getVulnerabilityReportPaths(
        baselineAnalysis.vulnerabilityReportId
      ),
      gqlClient.getVulnerabilityReportPaths(fullAnalysis.vulnerabilityReportId),
    ])

    // Unfiltered scan must report the init-commit SQLi backlog (plus the new file).
    expect(fullPaths.length).toBeGreaterThan(0)
    // With --baseline-commit, opengrep emits only findings introduced after the
    // baseline. The single post-baseline change is CMDInjectionExample.java, whose
    // System.out.println(...) calls the rule pack now flags — so the baseline scan
    // returns exactly that file and excludes the pre-existing SQLi backlog.
    expect(baselinePaths).toEqual(['CMDInjectionExample.java'])
    // Baseline filtering stays strict: fewer paths than the full scan, and the
    // full scan is a superset that also contains the post-baseline file.
    expect(baselinePaths.length).toBeLessThan(fullPaths.length)
    expect(fullPaths).toContain('CMDInjectionExample.java')
  })
})
