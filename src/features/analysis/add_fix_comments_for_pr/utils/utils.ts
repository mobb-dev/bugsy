import Debug from 'debug'
import parseDiff, { AddChange } from 'parse-diff'
import { z } from 'zod'

import { GQLClient } from '../../graphql'
import { GetVulByNodeHunk } from '../../graphql/types'
import { mapCategoryToBucket, MOBB_ICON_IMG } from '../../scm'
import { GithubSCMLib } from '../../scm/github'
import {
  GetGeneralPrCommentResponse,
  GetPrCommentsResponse,
} from '../../scm/github/types'
import { keyBy } from '../../utils'
import {
  contactUsMarkdown,
  MobbIconMarkdown,
  noVulnerabilitiesFoundTitle,
  scannerToFriendlyString,
} from '../constants'
import {
  PostAnalysisInsightCommentParams,
  PostFixCommentParams,
  PostIssueCommentParams,
} from '../types'
import { buildFixCommentBody, buildIssueCommentBody } from './buildCommentBody'

const debug = Debug('mobbdev:handle-finished-analysis')

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

export async function postIssueComment(params: PostIssueCommentParams) {
  const {
    vulnerabilityReportIssueCodeNode,
    projectId,
    analysisId,
    organizationId,
    scm,
    commitSha,
    pullRequest,
    scanner,
    fpDescription,
  } = params

  const {
    path,
    startLine,
    vulnerabilityReportIssue: {
      vulnerabilityReportIssueTags,
      category,
      safeIssueType,
    },
    vulnerabilityReportIssueId,
  } = vulnerabilityReportIssueCodeNode

  const irrelevantIssueWithTags =
    mapCategoryToBucket[category] === 'irrelevant' &&
    vulnerabilityReportIssueTags?.length > 0
      ? vulnerabilityReportIssueTags
      : []

  const commentRes = await scm.postPrComment({
    body: `# ${MobbIconMarkdown} Your fix is ready!\nRefresh the page in order to see the changes.`,
    pull_number: pullRequest,
    commit_id: commitSha,
    path,
    line: startLine,
  })
  const commentId = commentRes.data.id

  const commentBody = buildIssueCommentBody({
    issueId: vulnerabilityReportIssueId,
    issueType: safeIssueType,
    irrelevantIssueWithTags,
    commentId,
    commentUrl: commentRes.data.html_url,
    scanner,
    projectId,
    analysisId,
    organizationId,
    fpDescription,
  })

  return await scm.updatePrComment({
    body: commentBody,
    comment_id: commentId,
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
    vulnerabilityReportIssue: { fixId, vulnerabilityReportIssueTags, category },
    vulnerabilityReportIssueId,
  } = vulnerabilityReportIssueCodeNode

  const irrelevantIssueWithTags =
    mapCategoryToBucket[category] === 'irrelevant' &&
    vulnerabilityReportIssueTags?.length > 0
      ? vulnerabilityReportIssueTags
      : []

  const fix = fixesById[fixId]
  if (!fix || fix.patchAndQuestions.__typename !== 'FixData') {
    throw new Error(`fix ${fixId} not found`)
  }
  const {
    patchAndQuestions: { patch },
  } = fix

  const commentRes = await scm.postPrComment({
    body: `# ${MobbIconMarkdown} Your fix is ready!\nRefresh the page in order to see the changes.`,
    pull_number: pullRequest,
    commit_id: commitSha,
    path,
    line: startLine,
  })
  const commentId = commentRes.data.id

  const commentBody = buildFixCommentBody({
    fix,
    issueId: vulnerabilityReportIssueId,
    irrelevantIssueWithTags,
    commentId,
    commentUrl: commentRes.data.html_url,
    scanner,
    fixId,
    projectId,
    analysisId,
    organizationId,
    patch,
  })

  return await scm.updatePrComment({
    body: commentBody,
    comment_id: commentId,
  })
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
