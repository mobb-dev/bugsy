import { describe, expect, it } from 'vitest'

import {
  Vulnerability_Report_Issue_Category_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
} from '../scm/generates/client_generates'
import { matchVulByNodesMetadata } from './matchVulByNodesMetadata'
import { VulnerabilityReportIssueWithNodes } from './types'

const node = (
  index: number,
  path: string,
  startLine: number,
  endLine = startLine
) => ({
  index,
  path,
  startLine,
  endLine,
  startCol: 0,
  endCol: 1,
  startOffset: 0,
  endOffset: 1,
  sourceCodeFileId: null,
  sourceCodeFilePath: null,
})

const issue = (
  overrides: Partial<VulnerabilityReportIssueWithNodes> & {
    nodes?: unknown
  } = {}
): VulnerabilityReportIssueWithNodes => {
  const { nodes, ...rest } = overrides
  return {
    id: 'issue-1',
    fixId: 'fix-1',
    category: Vulnerability_Report_Issue_Category_Enum.Fixable,
    safeIssueType: 'SQL_Injection',
    fpId: null,
    vulnerabilityReportIssueTags: [],
    codeNodesJson: nodes === undefined ? null : { nodes },
    ...rest,
  }
}

const hunk = (path: string, startLine: number, endLine: number) => ({
  path,
  ranges: [{ startLine, endLine }],
})

describe('matchVulByNodesMetadata', () => {
  it('picks the highest-index matching node per fixable issue', () => {
    // Legacy pick = global `order_by index desc` + first-per-issue dedupe.
    const result = matchVulByNodesMetadata(
      [
        issue({
          nodes: [
            node(0, 'src/a.ts', 10),
            node(2, 'src/a.ts', 12),
            node(1, 'src/a.ts', 11),
          ],
        }),
      ],
      [hunk('src/a.ts', 1, 100)]
    )

    expect(result.fixablePrVuls).toBe(1)
    expect(result.vulnerabilityReportIssueCodeNodes).toEqual([
      {
        vulnerabilityReportIssueId: 'issue-1',
        path: 'src/a.ts',
        startLine: 12,
        vulnerabilityReportIssue: {
          fixId: 'fix-1',
          category: Vulnerability_Report_Issue_Category_Enum.Fixable,
          safeIssueType: 'SQL_Injection',
          vulnerabilityReportIssueTags: [],
        },
      },
    ])
  })

  it('matches when either the start or the end line falls in a hunk range', () => {
    const startsInside = matchVulByNodesMetadata(
      [issue({ nodes: [node(0, 'src/a.ts', 5, 50)] })],
      [hunk('src/a.ts', 1, 10)]
    )
    const endsInside = matchVulByNodesMetadata(
      [issue({ nodes: [node(0, 'src/a.ts', 5, 50)] })],
      [hunk('src/a.ts', 45, 60)]
    )
    const spansAround = matchVulByNodesMetadata(
      // Neither endpoint inside the range — the legacy predicate did NOT
      // match this shape, so neither does this one.
      [issue({ nodes: [node(0, 'src/a.ts', 5, 50)] })],
      [hunk('src/a.ts', 20, 30)]
    )

    expect(startsInside.fixablePrVuls).toBe(1)
    expect(endsInside.fixablePrVuls).toBe(1)
    expect(spansAround.fixablePrVuls).toBe(0)
  })

  it('requires the path to match the hunk', () => {
    const result = matchVulByNodesMetadata(
      [issue({ nodes: [node(0, 'src/other.ts', 5)] })],
      [hunk('src/a.ts', 1, 100)]
    )

    expect(result.fixablePrVuls).toBe(0)
    expect(result.vulnerabilityReportIssueCodeNodes).toEqual([])
  })

  it('counts non-fixable matching issues without emitting rows', () => {
    const result = matchVulByNodesMetadata(
      [issue({ fixId: null, nodes: [node(0, 'src/a.ts', 5)] })],
      [hunk('src/a.ts', 1, 10)]
    )

    expect(result.nonFixablePrVuls).toBe(1)
    expect(result.fixablePrVuls).toBe(0)
    expect(result.vulnerabilityReportIssueCodeNodes).toEqual([])
  })

  it('drops malformed nodes and keeps the valid ones', () => {
    const result = matchVulByNodesMetadata(
      [
        issue({
          nodes: [{ index: 0, path: 'src/a.ts' }, node(1, 'src/a.ts', 5)],
        }),
      ],
      [hunk('src/a.ts', 1, 10)]
    )

    expect(result.fixablePrVuls).toBe(1)
    expect(result.vulnerabilityReportIssueCodeNodes[0]?.startLine).toBe(5)
  })

  it('returns zero counts for empty hunks', () => {
    const result = matchVulByNodesMetadata(
      [issue({ nodes: [node(0, 'src/a.ts', 5)] })],
      []
    )

    expect(result.fixablePrVuls).toBe(0)
    expect(result.nonFixablePrVuls).toBe(0)
    expect(result.vulnerabilityReportIssueCodeNodes).toEqual([])
  })

  it('lists irrelevant issues, excluding suppressed ones', () => {
    const result = matchVulByNodesMetadata(
      [
        issue({
          id: 'irrelevant-1',
          fixId: null,
          fpId: 'fp-1',
          category: Vulnerability_Report_Issue_Category_Enum.FalsePositive,
          nodes: [node(0, 'src/a.ts', 5)],
        }),
        issue({
          id: 'suppressed-1',
          fixId: null,
          category: Vulnerability_Report_Issue_Category_Enum.Irrelevant,
          vulnerabilityReportIssueTags: [
            { tag: Vulnerability_Report_Issue_Tag_Enum.Suppressed },
          ],
          nodes: [node(0, 'src/a.ts', 6)],
        }),
        issue({
          // Path-matched but line-unmatched: still listed, with no nodes
          // (legacy returned it with an empty codeNodes array).
          id: 'irrelevant-no-line-match',
          fixId: null,
          category: Vulnerability_Report_Issue_Category_Enum.Filtered,
          nodes: [node(0, 'src/a.ts', 999)],
        }),
      ],
      [hunk('src/a.ts', 1, 10)]
    )

    expect(
      result.irrelevantVulnerabilityReportIssues.map((i) => [i.id, i.codeNodes])
    ).toEqual([
      ['irrelevant-1', [{ path: 'src/a.ts', startLine: 5 }]],
      ['irrelevant-no-line-match', []],
    ])
  })
})
