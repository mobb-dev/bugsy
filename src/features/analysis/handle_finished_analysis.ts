import { Scanner } from '@mobb/bugsy/constants'
import { Octokit } from '@octokit/core'
import Debug from 'debug'
import parseDiff, { AddChange } from 'parse-diff'
import { z } from 'zod'

import { GQLClient } from './graphql'
import { GetVulByNodeHunk } from './graphql/types'
import { GithubSCMLib, SCMLib } from './scm'
import {
  calculateRanges,
  getCommitUrl,
  getFixUrlWithRedirect,
  getIssueType,
} from './utils'

const debug = Debug('mobbdev:handle-finished-analysis')

const MOBB_ICON_IMG =
  '![image](https://github.com/yhaggai/GitHub-Fixer-Demo/assets/1255845/30f566df-6544-4612-929e-2ee5e8b9d345)'
const COMMIT_FIX_SVG = `https://felt-laptop-20190711103614-deployment.s3.us-east-1.amazonaws.com/commit-button.svg`
const commitFixButton = (commitUrl: string) =>
  `<a href="${commitUrl}"><img src=${COMMIT_FIX_SVG}></a>`

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

export async function getFixesFromDiff(params: {
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

export async function handleFinishedAnalysis({
  analysisId,
  scm: _scm,
  gqlClient,
  githubActionOctokit,
  scanner,
}: {
  analysisId: string
  scm: SCMLib
  gqlClient: GQLClient
  githubActionOctokit: Octokit
  scanner: Scanner
}) {
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
  } = getAnalysis.analysis
  const { commitSha, pullRequest } = getAnalysis.analysis.repo
  const getPrDiff = await scm.getPrDiff({ pull_number: pullRequest })
  const { vulnerabilityReportIssueCodeNodes } = await getFixesFromDiff({
    diff: getPrDiff.data,
    gqlClient,
    vulnerabilityReportId: getAnalysis.analysis.vulnerabilityReportId,
  })

  const comments = await scm.getPrComments({}, githubActionOctokit)
  // Delete all previus mobb comments
  await Promise.all(
    comments.data
      .filter((comment) => {
        return comment.body.includes('fix by Mobb is ready')
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
  )
  return Promise.all(
    vulnerabilityReportIssueCodeNodes.map(
      async (vulnerabilityReportIssueCodeNodes) => {
        const { path, startLine, vulnerabilityReportIssue } =
          vulnerabilityReportIssueCodeNodes
        const { fixId } = vulnerabilityReportIssue
        const { fix_by_pk } = await gqlClient.getFix(fixId)
        const {
          patchAndQuestions: { patch },
        } = fix_by_pk
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
        const commitUrl = getCommitUrl({
          fixId: fix_by_pk.id,
          projectId,
          analysisId,
          organizationId,
          redirectUrl: commentRes.data.html_url,
        })
        const fixUrl = getFixUrlWithRedirect({
          fixId: fix_by_pk.id,
          projectId,
          analysisId,
          organizationId,
          redirectUrl: commentRes.data.html_url,
        })
        const scanerString = scannerToFriendlyString(scanner)
        const issueType = getIssueType(fix_by_pk.issueType)
        const title = `# ${MOBB_ICON_IMG} ${issueType} fix by Mobb is ready`
        const subTitle = `### Apply the following code change to fix ${issueType} issue detected by ${scanerString}:`
        const diff = `\`\`\`diff\n${patch} \n\`\`\``
        const fixPageLink = `[Learn more and fine tune the fix](${fixUrl})`
        await scm.updatePrComment(
          {
            body: `${title}\n${subTitle}\n${diff}\n${commitFixButton(
              commitUrl
            )}\n${fixPageLink}`,
            comment_id: commentRes.data.id,
          },
          githubActionOctokit
        )
      }
    )
  )
}
