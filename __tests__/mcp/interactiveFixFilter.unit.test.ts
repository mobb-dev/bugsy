import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { partitionInteractiveFixes } from '../../src/mcp/services/InteractiveFixFilter'
import type { McpFix } from '../../src/mcp/types'

const logInfoMock = vi.fn()

vi.mock('../../src/mcp/Logger', () => ({
  logInfo: (...args: unknown[]) => logInfoMock(...args),
  logError: vi.fn(),
  logWarn: vi.fn(),
  logDebug: vi.fn(),
  log: vi.fn(),
}))

const makeFix = (
  id: string,
  safeIssueType: string,
  questions: { name: string }[]
): McpFix => ({
  __typename: 'fix' as const,
  id,
  confidence: 80,
  safeIssueType,
  severityText: 'HIGH',
  severityValue: 80,
  gitBlameLogin: 'someone',
  vulnerabilityReportIssues: [],
  patchAndQuestions: {
    __typename: 'FixData' as const,
    patch: 'diff --git a/x.js b/x.js\n',
    patchOriginalEncodingBase64: 'eA==',
    questions: questions.map((q) => ({
      __typename: 'FixQuestion' as const,
      name: q.name,
    })),
    extraContext: {
      __typename: 'FixExtraContextResponse' as const,
      fixDescription: 'desc',
      extraContext: [],
    },
  },
})

const noFixFix = (id: string, safeIssueType: string): McpFix => ({
  __typename: 'fix' as const,
  id,
  confidence: 80,
  safeIssueType,
  severityText: 'HIGH',
  severityValue: 80,
  gitBlameLogin: 'someone',
  vulnerabilityReportIssues: [],
  patchAndQuestions: {
    __typename: 'GetFixNoFixError' as const,
  },
})

describe('partitionInteractiveFixes', () => {
  beforeEach(() => {
    logInfoMock.mockClear()
    delete process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER']
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('returns empty arrays for an empty input and does not log', () => {
    const result = partitionInteractiveFixes([])
    expect(result.applicableFixes).toEqual([])
    expect(result.skippedRuleIds).toEqual([])
    expect(logInfoMock).not.toHaveBeenCalled()
  })

  it('keeps fixes with empty questions and does not log when nothing is skipped', () => {
    const fixes = [makeFix('a', 'XSS', []), makeFix('b', 'SQLi', [])]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual(['a', 'b'])
    expect(result.skippedRuleIds).toEqual([])
    expect(logInfoMock).not.toHaveBeenCalled()
  })

  it('skips fixes with non-empty questions and aggregates by rule', () => {
    const fixes = [
      makeFix('keep-1', 'XSS', []),
      makeFix('skip-1', 'SQL_INJECTION', [{ name: 'Which DB driver?' }]),
      makeFix('skip-2', 'SQL_INJECTION', [{ name: 'Which ORM?' }]),
      makeFix('skip-3', 'PATH_TRAVERSAL', [{ name: 'Which sanitiser?' }]),
      makeFix('keep-2', 'XSS', []),
    ]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual([
      'keep-1',
      'keep-2',
    ])
    expect(result.skippedRuleIds.sort()).toEqual([
      'PATH_TRAVERSAL',
      'SQL_INJECTION',
      'SQL_INJECTION',
    ])
    expect(logInfoMock).toHaveBeenCalledTimes(1)
    const [message, payload] = logInfoMock.mock.calls[0]!
    expect(message).toBe('[InteractiveFixFilter] Skipped interactive fixes')
    expect(payload).toMatchObject({
      totalFixes: 5,
      skippedCount: 3,
      skippedByRule: { SQL_INJECTION: 2, PATH_TRAVERSAL: 1 },
    })
  })

  it('treats GetFixNoFixError fixes as non-interactive (no questions field present)', () => {
    const fixes = [
      noFixFix('no-fix-1', 'XSS'),
      makeFix('skip', 'SQLi', [{ name: 'Q' }]),
    ]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual(['no-fix-1'])
    expect(result.skippedRuleIds).toEqual(['SQLi'])
  })

  it('uses UNKNOWN as the rule id when safeIssueType is null', () => {
    const fix = makeFix('skip', 'placeholder', [{ name: 'Q' }])
    fix.safeIssueType = null
    const result = partitionInteractiveFixes([fix])
    expect(result.skippedRuleIds).toEqual(['UNKNOWN'])
  })

  it('disables filtering when MOBB_MCP_DISABLE_INTERACTIVE_FILTER is set', () => {
    process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER'] = '1'
    const fixes = [
      makeFix('a', 'XSS', [{ name: 'Q' }]),
      makeFix('b', 'XSS', []),
    ]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual(['a', 'b'])
    expect(result.skippedRuleIds).toEqual([])
    expect(logInfoMock).not.toHaveBeenCalled()
  })
})
