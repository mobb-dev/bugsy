import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FixQuestionInputType } from '../../src/features/analysis/scm/generates/client_generates'
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

const makeQuestion = (
  name: string
): NonNullable<
  Extract<McpFix['patchAndQuestions'], { __typename: 'FixData' }>['questions']
>[number] => ({
  __typename: 'FixQuestion' as const,
  content: '',
  description: '',
  guidance: '',
  key: name,
  name,
  defaultValue: '',
  value: null,
  inputType: FixQuestionInputType.Text,
  options: [],
  index: 0,
})

const makeFix = (
  id: string,
  safeIssueType: string,
  questionNames: string[]
): McpFix => ({
  __typename: 'fix' as const,
  id,
  confidence: 80,
  safeIssueType,
  safeIssueLanguage: 'JavaScript',
  severityText: 'HIGH',
  severityValue: 80,
  gitBlameLogin: 'someone',
  vulnerabilityReportIssues: [],
  patchAndQuestions: {
    __typename: 'FixData' as const,
    patch: 'diff --git a/x.js b/x.js\n',
    patchOriginalEncodingBase64: 'eA==',
    questions: questionNames.map(makeQuestion),
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
  safeIssueLanguage: 'JavaScript',
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
    delete process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER']
  })

  it('returns empty arrays for an empty input and does not log', () => {
    const result = partitionInteractiveFixes([])
    expect(result.applicableFixes).toEqual([])
    expect(result.interactiveFixes).toEqual([])
    expect(logInfoMock).not.toHaveBeenCalled()
  })

  it('keeps fixes with empty questions in the applicable bucket and does not log', () => {
    const fixes = [makeFix('a', 'XSS', []), makeFix('b', 'SQLi', [])]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual(['a', 'b'])
    expect(result.interactiveFixes).toEqual([])
    expect(logInfoMock).not.toHaveBeenCalled()
  })

  it('routes fixes with non-empty questions into the interactive bucket and logs distribution', () => {
    const fixes = [
      makeFix('keep-1', 'XSS', []),
      makeFix('inter-1', 'SQL_INJECTION', ['Which DB driver?']),
      makeFix('inter-2', 'SQL_INJECTION', ['Which ORM?']),
      makeFix('inter-3', 'PATH_TRAVERSAL', ['Which sanitiser?']),
      makeFix('keep-2', 'XSS', []),
    ]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual([
      'keep-1',
      'keep-2',
    ])
    expect(result.interactiveFixes.map((f) => f.id)).toEqual([
      'inter-1',
      'inter-2',
      'inter-3',
    ])
    expect(logInfoMock).toHaveBeenCalledTimes(1)
    const [message, payload] = logInfoMock.mock.calls[0]!
    expect(message).toBe(
      '[InteractiveFixFilter] Routing interactive fixes to LLM'
    )
    expect(payload).toMatchObject({
      totalFixes: 5,
      interactiveCount: 3,
      interactiveByRule: { SQL_INJECTION: 2, PATH_TRAVERSAL: 1 },
    })
  })

  it('treats GetFixNoFixError fixes as non-interactive (no questions field present)', () => {
    const fixes = [noFixFix('no-fix-1', 'XSS'), makeFix('inter', 'SQLi', ['Q'])]
    const result = partitionInteractiveFixes(fixes)
    expect(result.applicableFixes.map((f) => f.id)).toEqual(['no-fix-1'])
    expect(result.interactiveFixes.map((f) => f.id)).toEqual(['inter'])
  })

  it('preserves the original fix object (including patch and questions) in the interactive bucket', () => {
    const fix = makeFix('inter', 'XSS', ['isServerSideCode'])
    const result = partitionInteractiveFixes([fix])
    expect(result.interactiveFixes[0]).toBe(fix)
  })

  // Opt-out kill switch — default off, drops interactive fixes when truthy.
  describe('MOBB_MCP_DISABLE_INTERACTIVE_FILTER kill switch', () => {
    it('default (env var unset): interactive routing stays on', () => {
      const fixes = [makeFix('app', 'XSS', []), makeFix('inter', 'SQLi', ['Q'])]
      const result = partitionInteractiveFixes(fixes)
      expect(result.applicableFixes.map((f) => f.id)).toEqual(['app'])
      expect(result.interactiveFixes.map((f) => f.id)).toEqual(['inter'])
    })

    it.each([['true'], ['1'], ['TRUE'], ['True']])(
      'drops interactive fixes when set to %s',
      (raw) => {
        process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER'] = raw
        const fixes = [
          makeFix('app-1', 'XSS', []),
          makeFix('inter-1', 'SQLi', ['Q']),
          makeFix('inter-2', 'PATH_TRAVERSAL', ['Q1', 'Q2']),
          makeFix('app-2', 'XSS', []),
        ]
        const result = partitionInteractiveFixes(fixes)
        expect(result.applicableFixes.map((f) => f.id)).toEqual([
          'app-1',
          'app-2',
        ])
        expect(result.interactiveFixes).toEqual([])
        expect(logInfoMock).toHaveBeenCalledTimes(1)
        const [message, payload] = logInfoMock.mock.calls[0]!
        expect(message).toBe(
          '[InteractiveFixFilter] Dropping interactive fixes (MOBB_MCP_DISABLE_INTERACTIVE_FILTER=true)'
        )
        expect(payload).toMatchObject({
          totalFixes: 4,
          droppedCount: 2,
          droppedByRule: { SQLi: 1, PATH_TRAVERSAL: 1 },
        })
      }
    )

    it.each([['false'], ['0'], ['no'], ['off'], ['']])(
      'treats %p as default off',
      (raw) => {
        process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER'] = raw
        const fixes = [makeFix('inter', 'SQLi', ['Q'])]
        const result = partitionInteractiveFixes(fixes)
        expect(result.applicableFixes).toEqual([])
        expect(result.interactiveFixes.map((f) => f.id)).toEqual(['inter'])
      }
    )

    it('no drop log when there were no interactive fixes to drop', () => {
      process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER'] = 'true'
      const fixes = [makeFix('app', 'XSS', [])]
      const result = partitionInteractiveFixes(fixes)
      expect(result.applicableFixes.map((f) => f.id)).toEqual(['app'])
      expect(result.interactiveFixes).toEqual([])
      expect(logInfoMock).not.toHaveBeenCalled()
    })
  })
})
