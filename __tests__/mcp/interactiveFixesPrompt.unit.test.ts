import { describe, expect, it } from 'vitest'

import { FixQuestionInputType } from '../../src/features/analysis/scm/generates/client_generates'
import { interactiveFixesPrompt } from '../../src/mcp/core/prompts'
import type { McpFix } from '../../src/mcp/types'

const baseFix = (overrides: Partial<McpFix> = {}): McpFix => ({
  __typename: 'fix' as const,
  id: 'fix-id',
  confidence: 90,
  safeIssueType: 'XSS',
  safeIssueLanguage: 'JavaScript',
  severityText: 'HIGH',
  severityValue: 80,
  vulnerabilityReportIssues: [],
  patchAndQuestions: {
    __typename: 'FixData' as const,
    patch: 'diff --git a/x.js b/x.js\n',
    patchOriginalEncodingBase64: 'eA==',
    questions: [
      {
        __typename: 'FixQuestion' as const,
        content:
          'Is this code running on the server side (a NodeJS application)',
        description: '',
        guidance: '',
        key: 'isServerSideCode',
        name: 'isServerSideCode',
        defaultValue: 'no',
        value: null,
        inputType: FixQuestionInputType.Select,
        options: ['yes', 'no'],
        index: 0,
        extraContext: [],
      },
    ],
    extraContext: {
      __typename: 'FixExtraContextResponse' as const,
      fixDescription: 'Replace innerHTML with textContent',
      extraContext: [],
    },
  },
  ...overrides,
})

describe('interactiveFixesPrompt', () => {
  it('returns empty string when there are no interactive fixes', () => {
    expect(
      interactiveFixesPrompt({
        interactiveFixes: [],
        repositoryPath: '/tmp/repo',
      })
    ).toBe('')
  })

  it('renders the SELECT input contract and instructs the LLM to call scan_and_fix_vulnerabilities with interactiveAnswers', () => {
    const out = interactiveFixesPrompt({
      interactiveFixes: [baseFix()],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain('scan_and_fix_vulnerabilities')
    expect(out).toContain('"interactiveAnswers"')
    expect(out).toContain('"path": "/tmp/repo"')
    expect(out).toContain('**Fix id:** `fix-id`')
    expect(out).toContain('Pick exactly ONE of: `yes`, `no`')
    expect(out).toContain("*Default if you don't decide:* `no`")
  })

  it('resolves the analyzer-served content on the FixQuestion (JS XSS isServerSideCode)', () => {
    const out = interactiveFixesPrompt({
      interactiveFixes: [baseFix()],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain(
      'Is this code running on the server side (a NodeJS application)'
    )
  })

  it('falls back to the question name when the served content is empty', () => {
    const fix = baseFix({
      patchAndQuestions: {
        __typename: 'FixData' as const,
        patch: 'diff --git a/x.js b/x.js\n',
        patchOriginalEncodingBase64: 'eA==',
        questions: [
          {
            __typename: 'FixQuestion' as const,
            content: '',
            description: '',
            guidance: '',
            key: 'isServerSideCode',
            name: 'isServerSideCode',
            defaultValue: 'no',
            value: null,
            inputType: FixQuestionInputType.Select,
            options: ['yes', 'no'],
            index: 0,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse' as const,
          fixDescription: 'Replace innerHTML with textContent',
          extraContext: [],
        },
      },
    })
    const out = interactiveFixesPrompt({
      interactiveFixes: [fix],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain('**`isServerSideCode`** — isServerSideCode')
  })

  it('renders TEXT input contract for free-form questions', () => {
    const fix = baseFix({
      patchAndQuestions: {
        __typename: 'FixData' as const,
        patch: 'diff --git a/widget.html b/widget.html\n',
        patchOriginalEncodingBase64: 'aQ==',
        questions: [
          {
            __typename: 'FixQuestion' as const,
            content: '',
            description: '',
            guidance: '',
            key: 'iframeRestrictions',
            name: 'iframeRestrictions',
            defaultValue: '',
            value: null,
            inputType: FixQuestionInputType.Text,
            options: [],
            index: 0,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse' as const,
          fixDescription: 'Add sandbox attribute',
          extraContext: [],
        },
      },
    })
    const out = interactiveFixesPrompt({
      interactiveFixes: [fix],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain('Provide a free-form string')
  })

  it('renders the analyzer-served content with the operand already interpolated', () => {
    const fix = baseFix({
      safeIssueType: 'PT',
      patchAndQuestions: {
        __typename: 'FixData' as const,
        patch: 'diff --git a/files.js b/files.js\n',
        patchOriginalEncodingBase64: 'cA==',
        questions: [
          {
            __typename: 'FixQuestion' as const,
            content:
              'Does `userInput` represent a file name, a relative path or an absolute path?',
            description: '',
            guidance: '',
            key: 'taintedTermType',
            name: 'taintedTermType',
            defaultValue: 'file name',
            value: null,
            inputType: FixQuestionInputType.Select,
            options: ['file name', 'relative path', 'absolute path'],
            index: 0,
            extraContext: [{ key: 'expression', value: 'userInput' }],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse' as const,
          fixDescription: 'Sanitize user-controlled file path',
          extraContext: [],
        },
      },
    })
    const out = interactiveFixesPrompt({
      interactiveFixes: [fix],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain('userInput')
  })

  it('separates multiple interactive fixes with a horizontal rule', () => {
    const out = interactiveFixesPrompt({
      interactiveFixes: [baseFix({ id: 'fix-a' }), baseFix({ id: 'fix-b' })],
      repositoryPath: '/tmp/repo',
    })
    expect(out).toContain('Interactive fix 1')
    expect(out).toContain('Interactive fix 2')
    expect(out.split('\n---\n').length).toBeGreaterThan(1)
  })
})
