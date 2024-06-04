import { Scanner, WEB_APP_URL } from '@mobb/bugsy/constants'
import { Octokit } from '@octokit/core'
import Debug from 'debug'
import parseDiff, { AddChange } from 'parse-diff'
import { z } from 'zod'

import { GQLClient } from './graphql'
import { GetVulByNodeHunk } from './graphql/types'
import { GithubSCMLib, SCMLib } from './scm'
import { COMMIT_FIX_SVG, MOBB_ICON_IMG } from './scm/constants'
import { getCommitUrl, getFixUrlWithRedirect, getIssueType } from './scm/utils'
import { calculateRanges, keyBy } from './utils'

const debug = Debug('mobbdev:handle-finished-analysis')
const contactUsMarkdown = `For specific requests [contact us](https://mobb.ai/contact) and we'll do the most to answer your need quickly.`
const commitFixButton = (commitUrl: string) =>
  `<a href="${commitUrl}"><img src=${COMMIT_FIX_SVG}></a>`
const MobbIconMarkdown = `![image](${MOBB_ICON_IMG})`
const noVulnerabilitiesFoundTitle = `# ${MobbIconMarkdown} No security issues were found ✅`

function scannerToFriendlyString(scanner: Scanner) {
  switch (scanner) {
    case 'checkmarx':
      return 'Checkmarx'
    case 'codeql':
      return 'CodeQL'
    case 'fortify':
      return 'Fortify'
    case 'snyk':
      return 'Snyk'
  }
}

type PrVulenrabilities = Awaited<
  ReturnType<typeof getRelevantVulenrabilitiesFromDiff>
>
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
type FixesById = Awaited<ReturnType<typeof getFixesData>>
async function getFixesData(params: {
  gqlClient: GQLClient
  fixesId: string[]
}) {
  const { gqlClient, fixesId } = params
  const { fixes } = await gqlClient.getFixes(fixesId)
  return keyBy(fixes, 'id')
}

function buildAnalysisSummaryComment(params: {
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

export async function handleFinishedAnalysis({
  analysisId,
  scm: _scm,
  gqlClient,
  githubActionToken,
  scanner,
}: {
  analysisId: string
  scm: SCMLib
  gqlClient: GQLClient
  githubActionToken: string
  scanner: Scanner
}) {
  const githubActionOctokit = new Octokit({ auth: githubActionToken })
  if (_scm instanceof GithubSCMLib === false) {
    return
  }
  const scm = _scm as GithubSCMLib
  const getAnalysis = await gqlClient.getAnalysis(analysisId)
  const {
    vulnerabilityReport: {
      projectId,
      project: { organizationId },
    },
  } = getAnalysis
  if (
    !getAnalysis.repo ||
    !getAnalysis.repo.commitSha ||
    !getAnalysis.repo.pullRequest
  ) {
    throw new Error('repo not found')
  }
  const { commitSha, pullRequest } = getAnalysis.repo
  const diff = await scm.getPrDiff({ pull_number: pullRequest })
  const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
    diff,
    gqlClient,
    vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
  })
  const { vulnerabilityReportIssueCodeNodes } = prVulenrabilities
  const fixesId = vulnerabilityReportIssueCodeNodes.map(
    ({ vulnerabilityReportIssue: { fixId } }) => fixId
  )
  const fixesById = await getFixesData({ fixesId, gqlClient })

  const [comments, generalPrComments] = await Promise.all([
    scm.getPrComments({ pull_number: pullRequest }, githubActionOctokit),
    scm.getGeneralPrComments(
      { prNumber: pullRequest },
      { authToken: githubActionToken }
    ),
  ])

  async function postAnalysisSummary() {
    // no need to post a summary if there are no fixes
    if (Object.values(fixesById).length === 0) {
      return
    }
    const analysisSummaryComment = buildAnalysisSummaryComment({
      fixesById,
      prVulenrabilities: prVulenrabilities,
    })
    await scm.postGeneralPrComment(
      {
        body: analysisSummaryComment,
        prNumber: pullRequest,
      },
      { authToken: githubActionToken }
    )
  }

  function deleteAllPreviousGeneralPrComments() {
    return generalPrComments.data
      .filter((comment) => {
        if (!comment.body) {
          return false
        }
        return comment.body.includes(MOBB_ICON_IMG)
      })
      .map((comment) => {
        try {
          return scm.deleteGeneralPrComment(
            { commentId: comment.id },
            { authToken: githubActionToken }
          )
        } catch (e) {
          debug('delete comment failed %s', e)
          return Promise.resolve()
        }
      })
  }
  function deleteAllPreviousComments() {
    return comments.data
      .filter((comment) => {
        return comment.body.includes(MOBB_ICON_IMG)
      })
      .map((comment) => {
        try {
          return scm.deleteComment(
            { comment_id: comment.id },
            githubActionOctokit
          )
        } catch (e) {
          debug('delete comment failed %s', e)
          return Promise.resolve()
        }
      })
  }
  // Delete all previus mobb comments
  await Promise.all([
    ...deleteAllPreviousComments(),
    ...deleteAllPreviousGeneralPrComments(),
  ])

  async function postFixComment(
    vulnerabilityReportIssueCodeNode: (typeof vulnerabilityReportIssueCodeNodes)[0]
  ) {
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

    const commentRes = await scm.postPrComment(
      {
        body: 'empty',
        pull_number: pullRequest,
        commit_id: commitSha,
        path,
        line: startLine,
      },
      githubActionOctokit
    )
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
    const scanerString = scannerToFriendlyString(scanner)
    const issueType = getIssueType(fix.issueType ?? null)
    const title = `# ${MobbIconMarkdown} ${issueType} fix is ready`
    const subTitle = `### Apply the following code change to fix ${issueType} issue detected by **${scanerString}**:`
    const diff = `\`\`\`diff\n${patch} \n\`\`\``
    const fixPageLink = `[Learn more and fine tune the fix](${fixUrl})`

    await scm.updatePrComment(
      {
        body: `${title}\n${subTitle}\n${diff}\n${commitFixButton(
          commitUrl
        )}\n${fixPageLink}`,
        comment_id: commentId,
      },
      githubActionOctokit
    )
  }

  async function postAnalysisInsightComment() {
    const scanerString = scannerToFriendlyString(scanner)
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
      await scm.postGeneralPrComment(
        {
          body: noVulsFoundComment,
          prNumber: pullRequest,
        },
        { authToken: githubActionToken }
      )
      return
    }

    // no vulnerabilities were found in the PR but there are vulnerabilities outside the PR
    if (totalPrVulnerabilities === 0 && vulnerabilitiesOutsidePr > 0) {
      const body = `Awesome! No vulnerabilities were found by **${scanerString}** in the changes made as part of this PR.`
      const body2 = `Please notice there are issues in this repo that are unrelated to this PR.`

      const noVulsFoundComment = `${noVulnerabilitiesFoundTitle}\n${body}\n${body2}`
      await scm.postGeneralPrComment(
        {
          body: noVulsFoundComment,
          prNumber: pullRequest,
        },
        { authToken: githubActionToken }
      )
      return
    }
    // we can't fix any of the issues
    if (fixablePrVuls === 0 && nonFixablePrVuls > 0) {
      const title = `# ${MobbIconMarkdown} We couldn't fix the issues detected by **${scanerString}**`
      const body = `Mobb Fixer gets better and better every day, but unfortunately your current issues aren't supported yet.`
      const noFixableVulsComment = `${title}\n${body}\n${contactUsMarkdown}`
      await scm.postGeneralPrComment(
        {
          body: noFixableVulsComment,
          prNumber: pullRequest,
        },
        { authToken: githubActionToken }
      )
      return
    }
    // we can fix some of the issues
    if (fixablePrVuls < nonFixablePrVuls && fixablePrVuls > 0) {
      const title = `# ${MobbIconMarkdown} We couldn't fix some of the issues detected by **${scanerString}**`
      const body =
        "Mobb Fixer gets better and better every day, but unfortunately your current issues aren't supported yet."
      const fixableVulsComment = `${title}\n${body}\n${contactUsMarkdown}`
      await scm.postGeneralPrComment(
        {
          body: fixableVulsComment,
          prNumber: pullRequest,
        },
        { authToken: githubActionToken }
      )
      return
    }
  }
  await Promise.all([
    ...prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(postFixComment),
    postAnalysisInsightComment(),
    postAnalysisSummary(),
  ])
}
