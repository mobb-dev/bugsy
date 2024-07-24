import { WEB_APP_URL } from '@mobb/bugsy/constants'
import Debug from 'debug'
import parseDiff, { AddChange } from 'parse-diff'
import { z } from 'zod'

import { GQLClient } from '../graphql'
import { GetVulByNodeHunk } from '../graphql/types'
import {
  getCommitUrl,
  getFixUrlWithRedirect,
  getIssueType,
  GithubSCMLib,
} from '../scm'
import { MOBB_ICON_IMG } from '../scm'
import {
  GetGeneralPrCommentResponse,
  GetPrCommentsResponse,
} from '../scm/github/types'
import { keyBy } from '../utils'
import {
  COMMIT_FIX_SVG,
  contactUsMarkdown,
  MobbIconMarkdown,
  noVulnerabilitiesFoundTitle,
  scannerToFriendlyString,
} from './constants'
import {
  FixesById,
  PostAnalysisInsightCommentParams,
  PostAnalysisSummaryParams,
  PostFixCommentParams,
  PrVulenrabilities,
} from './types'

const debug = Debug('mobbdev:handle-finished-analysis')
const getCommitFixButton = (commitUrl: string) =>
  `<a href="${commitUrl}"><img src=${COMMIT_FIX_SVG}></a>`

export function calculateRanges(integers: number[]): [number, number][] {
  // Sort the array in ascending order
  if (integers.length === 0) {
    return []
  }

  integers.sort((a, b) => a - b)

  const ranges = integers.reduce<[number, number][]>(
    (result, current, index) => {
      if (index === 0) {
        // Initialize the first range
        return [...result, [current, current]]
      }
      const currentRange = result[result.length - 1] as [number, number]
      const [_start, end] = currentRange
      if (current === end + 1) {
        // Expand the current range
        currentRange[1] = current
      } else {
        // Start a new range
        result.push([current, current])
      }

      return result
    },
    [] as [number, number][]
  )

  return ranges
}

export function deleteAllPreviousComments({
  comments,
  scm,
}: {
  comments: GetPrCommentsResponse
  scm: GithubSCMLib
}) {
  return comments.data
    .filter((comment) => {
      return comment.body.includes(MOBB_ICON_IMG)
    })
    .map((comment) => {
      try {
        return scm.deleteComment({ comment_id: comment.id })
      } catch (e) {
        debug('delete comment failed %s', e)
        return Promise.resolve()
      }
    })
}

export function deleteAllPreviousGeneralPrComments(params: {
  generalPrComments: GetGeneralPrCommentResponse
  scm: GithubSCMLib
}) {
  const { generalPrComments, scm } = params
  return generalPrComments.data
    .filter((comment) => {
      if (!comment.body) {
        return false
      }
      return comment.body.includes(MOBB_ICON_IMG)
    })
    .map((comment) => {
      try {
        return scm.deleteGeneralPrComment({ commentId: comment.id })
      } catch (e) {
        debug('delete comment failed %s', e)
        return Promise.resolve()
      }
    })
}

export async function postFixComment(params: PostFixCommentParams) {
  const {
    vulnerabilityReportIssueCodeNode,
    projectId,
    analysisId,
    organizationId,
    fixesById,
    scm,
    commitSha,
    pullRequest,
    scanner,
  } = params

  const {
    path,
    startLine,
    vulnerabilityReportIssue: { fixId },
  } = vulnerabilityReportIssueCodeNode

  const fix = fixesById[fixId]
  if (!fix || fix.patchAndQuestions.__typename !== 'FixData') {
    throw new Error(`fix ${fixId} not found`)
  }
  const {
    patchAndQuestions: { patch },
  } = fix

  const commentRes = await scm.postPrComment({
    body: 'empty',
    pull_number: pullRequest,
    commit_id: commitSha,
    path,
    line: startLine,
  })
  const commentId = commentRes.data.id
  const commitUrl = getCommitUrl({
    appBaseUrl: WEB_APP_URL,
    fixId,
    projectId,
    analysisId,
    organizationId,
    redirectUrl: commentRes.data.html_url,
    commentId,
  })
  const fixUrl = getFixUrlWithRedirect({
    appBaseUrl: WEB_APP_URL,
    fixId,
    projectId,
    analysisId,
    organizationId,
    redirectUrl: commentRes.data.html_url,
    commentId,
  })
  const scanerString = scannerToFriendlyString[scanner]
  const issueType = getIssueType(fix.issueType ?? null)
  const title = `# ${MobbIconMarkdown} ${issueType} fix is ready`
  const subTitle = `### Apply the following code change to fix ${issueType} issue detected by **${scanerString}**:`
  const diff = `\`\`\`diff\n${patch} \n\`\`\``
  const fixPageLink = `[Learn more and fine tune the fix](${fixUrl})`

  return await scm.updatePrComment({
    body: `${title}\n${subTitle}\n${diff}\n${getCommitFixButton(
      commitUrl
    )}\n${fixPageLink}`,
    comment_id: commentId,
  })
}

export function buildAnalysisSummaryComment(params: {
  prVulenrabilities: PrVulenrabilities
  fixesById: FixesById
}) {
  const { prVulenrabilities: fixesFromDiff, fixesById } = params
  const { vulnerabilityReportIssueCodeNodes, fixablePrVuls } = fixesFromDiff
  const title = `# ${MobbIconMarkdown} ${fixablePrVuls} ${
    fixablePrVuls === 1 ? 'fix is' : 'fixes are'
  } ready to be committed`
  const summary = Object.entries(
    // count every issue type
    vulnerabilityReportIssueCodeNodes.reduce<Record<string, number>>(
      (result, vulnerabilityReportIssueCodeNode) => {
        const { vulnerabilityReportIssue } = vulnerabilityReportIssueCodeNode
        const fix = fixesById[vulnerabilityReportIssue.fixId]
        if (!fix) {
          throw new Error(`fix ${vulnerabilityReportIssue.fixId} not found`)
        }
        const issueType = getIssueType(fix.issueType ?? null)
        const vulnerabilityReportIssueCount = (result[issueType] || 0) + 1
        return {
          ...result,
          [issueType]: vulnerabilityReportIssueCount,
        }
      },
      {}
    )
  ).map(([issueType, issueTypeCount]) => `**${issueType}** - ${issueTypeCount}`)

  return `${title}\n${summary.join('\n')}`
}

export async function getRelevantVulenrabilitiesFromDiff(params: {
  gqlClient: GQLClient
  diff: string
  vulnerabilityReportId: string
}) {
  const { gqlClient, diff, vulnerabilityReportId } = params
  const parsedDiff = parseDiff(diff)

  const fileHunks = parsedDiff.map((file) => {
    const fileNumbers = file.chunks
      .flatMap((chunk) => chunk.changes)
      // create a filter only for added lines
      .filter((change) => change.type === 'add')
      .map((_change) => {
        const change = _change as AddChange
        return change.ln
      })
    const lineAddedRanges = calculateRanges(fileNumbers)
    const fileFilter: GetVulByNodeHunk = {
      path: z.string().parse(file.to),
      ranges: lineAddedRanges.map(([startLine, endLine]) => ({
        endLine,
        startLine,
      })),
    }
    return fileFilter
  })
  return gqlClient.getVulByNodesMetadata({
    hunks: fileHunks,
    vulnerabilityReportId,
  })
}

export async function getFixesData(params: {
  gqlClient: GQLClient
  fixesId: string[]
}) {
  const { gqlClient, fixesId } = params
  const { fixes } = await gqlClient.getFixes(fixesId)
  return keyBy(fixes, 'id')
}

export async function postAnalysisSummary(params: PostAnalysisSummaryParams) {
  const { prVulenrabilities, fixesById, pullRequest, scm } = params
  // no need to post a summary if there are no fixes
  if (Object.values(fixesById).length === 0) {
    return
  }
  const analysisSummaryComment = buildAnalysisSummaryComment({
    fixesById,
    prVulenrabilities: prVulenrabilities,
  })
  await scm.postGeneralPrComment({
    body: analysisSummaryComment,
    prNumber: pullRequest,
  })
}

export async function postAnalysisInsightComment(
  params: PostAnalysisInsightCommentParams
) {
  const { prVulenrabilities, pullRequest, scanner, scm } = params
  const scanerString = scannerToFriendlyString[scanner]
  const {
    totalPrVulnerabilities,
    vulnerabilitiesOutsidePr,
    fixablePrVuls,
    nonFixablePrVuls,
  } = prVulenrabilities
  debug({
    fixablePrVuls,
    nonFixablePrVuls,
    vulnerabilitiesOutsidePr,
    totalPrVulnerabilities,
  })
  // no vulnerabilities were found
  if (totalPrVulnerabilities === 0 && vulnerabilitiesOutsidePr === 0) {
    const body = `Awesome! No vulnerabilities were found  by **${scanerString}**`
    const noVulsFoundComment = `${noVulnerabilitiesFoundTitle}\n${body}`
    await scm.postGeneralPrComment({
      body: noVulsFoundComment,
      prNumber: pullRequest,
    })
    return
  }

  // no vulnerabilities were found in the PR but there are vulnerabilities outside the PR
  if (totalPrVulnerabilities === 0 && vulnerabilitiesOutsidePr > 0) {
    const body = `Awesome! No vulnerabilities were found by **${scanerString}** in the changes made as part of this PR.`
    const body2 = `Please notice there are issues in this repo that are unrelated to this PR.`

    const noVulsFoundComment = `${noVulnerabilitiesFoundTitle}\n${body}\n${body2}`
    await scm.postGeneralPrComment({
      body: noVulsFoundComment,
      prNumber: pullRequest,
    })
    return
  }
  // we can't fix any of the issues
  if (fixablePrVuls === 0 && nonFixablePrVuls > 0) {
    const title = `# ${MobbIconMarkdown} We couldn't fix the issues detected by **${scanerString}**`
    const body = `Mobb Fixer gets better and better every day, but unfortunately your current issues aren't supported yet.`
    const noFixableVulsComment = `${title}\n${body}\n${contactUsMarkdown}`
    await scm.postGeneralPrComment({
      body: noFixableVulsComment,
      prNumber: pullRequest,
    })
    return
  }
  // we can fix some of the issues
  if (fixablePrVuls < nonFixablePrVuls && fixablePrVuls > 0) {
    const title = `# ${MobbIconMarkdown} We couldn't fix some of the issues detected by **${scanerString}**`
    const body =
      "Mobb Fixer gets better and better every day, but unfortunately your current issues aren't supported yet."
    const fixableVulsComment = `${title}\n${body}\n${contactUsMarkdown}`
    await scm.postGeneralPrComment({
      body: fixableVulsComment,
      prNumber: pullRequest,
    })
    return
  }
}
