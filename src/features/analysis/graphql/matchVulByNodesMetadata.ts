import {
  GetVulByNodeHunk,
  VulByNodesMetadataCodeNode,
  VulByNodesMetadataCodeNodeZ,
  VulnerabilityReportIssueCodeNode,
  VulnerabilityReportIssueWithNodes,
} from './types'

// Kept as data (not just a where-clause) since MOBB-3770 moved this filter
// client-side: these are the categories the PR review surfaces as
// "irrelevant" findings rather than fixable/non-fixable counts.
const IRRELEVANT_CATEGORIES = new Set([
  'Irrelevant',
  'FalsePositive',
  'Filtered',
])
const SUPPRESSED_TAG = 'SUPPRESSED'

/**
 * The line-window predicate the legacy relational query ran server-side: a
 * node matches a hunk when the paths are equal and the node's start OR end
 * line falls inside one of the hunk's ranges. `-1` sentinel lines never match
 * (ranges start at 1), same as before.
 */
function nodeMatchesHunks(
  node: VulByNodesMetadataCodeNode,
  hunks: GetVulByNodeHunk[]
): boolean {
  return hunks.some(
    (hunk) =>
      hunk.path === node.path &&
      hunk.ranges.some(
        ({ startLine, endLine }) =>
          (node.startLine >= startLine && node.startLine <= endLine) ||
          (node.endLine >= startLine && node.endLine <= endLine)
      )
  )
}

/**
 * An issue's hunk-matching JSONB nodes, highest index first. The legacy query
 * ordered rows `index: desc` globally and the caller then deduped client-side
 * to the first row per issue — taking the head of this list reproduces that
 * pick exactly. Malformed entries are dropped per-node.
 */
function matchingNodes(
  issue: VulnerabilityReportIssueWithNodes,
  hunks: GetVulByNodeHunk[]
): VulByNodesMetadataCodeNode[] {
  const rawNodes = issue.codeNodesJson?.nodes
  if (!Array.isArray(rawNodes)) {
    return []
  }
  return rawNodes
    .map((rawNode) => VulByNodesMetadataCodeNodeZ.safeParse(rawNode))
    .filter((parsed) => parsed.success)
    .map((parsed) => parsed.data)
    .filter((node) => nodeMatchesHunks(node, hunks))
    .sort((a, b) => b.index - a.index)
}

/**
 * The client-side half of getVulByNodesMetadata: the server pre-filters the
 * report's issues to those with a node in a PR-changed file (jsonb `_contains`
 * on path); this reproduces the line-window matching, per-issue node pick and
 * fixable/non-fixable counts the legacy relational query computed server-side,
 * with identical predicates.
 */
export function matchVulByNodesMetadata(
  issues: VulnerabilityReportIssueWithNodes[],
  hunks: GetVulByNodeHunk[]
): {
  vulnerabilityReportIssueCodeNodes: VulnerabilityReportIssueCodeNode[]
  fixablePrVuls: number
  nonFixablePrVuls: number
  irrelevantVulnerabilityReportIssues: {
    id: string
    safeIssueType: string
    fixId: string | null
    category: VulnerabilityReportIssueWithNodes['category']
    vulnerabilityReportIssueTags: VulnerabilityReportIssueWithNodes['vulnerabilityReportIssueTags']
    codeNodes: { path: string; startLine: number }[]
    fpId: string | null
  }[]
} {
  const vulnerabilityReportIssueCodeNodes: VulnerabilityReportIssueCodeNode[] =
    []
  let fixablePrVuls = 0
  let nonFixablePrVuls = 0
  const irrelevantVulnerabilityReportIssues: ReturnType<
    typeof matchVulByNodesMetadata
  >['irrelevantVulnerabilityReportIssues'] = []

  for (const issue of issues) {
    const nodes = matchingNodes(issue, hunks)
    const bestNode = nodes[0]

    if (issue.fixId !== null && bestNode) {
      fixablePrVuls += 1
      vulnerabilityReportIssueCodeNodes.push({
        vulnerabilityReportIssueId: issue.id,
        path: bestNode.path,
        startLine: bestNode.startLine,
        vulnerabilityReportIssue: {
          fixId: issue.fixId,
          category: issue.category,
          safeIssueType: issue.safeIssueType,
          vulnerabilityReportIssueTags: issue.vulnerabilityReportIssueTags,
        },
      })
    } else if (issue.fixId === null && bestNode) {
      nonFixablePrVuls += 1
    }

    if (
      issue.fixId === null &&
      IRRELEVANT_CATEGORIES.has(issue.category) &&
      !issue.vulnerabilityReportIssueTags.some(
        (issueTag) => issueTag.tag === SUPPRESSED_TAG
      )
    ) {
      irrelevantVulnerabilityReportIssues.push({
        id: issue.id,
        safeIssueType: issue.safeIssueType,
        fixId: issue.fixId,
        category: issue.category,
        vulnerabilityReportIssueTags: issue.vulnerabilityReportIssueTags,
        codeNodes: bestNode
          ? [{ path: bestNode.path, startLine: bestNode.startLine }]
          : [],
        fpId: issue.fpId,
      })
    }
  }

  return {
    vulnerabilityReportIssueCodeNodes,
    fixablePrVuls,
    nonFixablePrVuls,
    irrelevantVulnerabilityReportIssues,
  }
}
