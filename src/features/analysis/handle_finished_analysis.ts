import { Scanner } from '@mobb/bugsy/constants'
import { Octokit } from '@octokit/core'
import Debug from 'debug'
import { z } from 'zod'

import { GQLClient } from './graphql'
import { GithubSCMLib, SCMLib } from './scm'
import { CodeQLReport, VulReportLocationZ } from './types'
import { getCommitUrl, getFixUrl, getIssueType } from './utils'

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
  const res = await gqlClient.getAnalysis(analysisId)
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
  const {
    vulnerabilityReport: {
      file: {
        signedFile: { url: vulReportUrl },
      },
    },
    repo: { commitSha, pullRequest },
  } = res.analysis
  const {
    projectId,
    project: { organizationId },
  } = res.analysis.vulnerabilityReport
  const vulReportRes = await fetch(vulReportUrl)
  const vulReport = (await vulReportRes.json()) as CodeQLReport
  // recrate the fixes
  return Promise.all(
    res.analysis.fixes
      .map((fix) => {
        const [vulnerabilityReportIssue] = fix.vulnerabilityReportIssues
        const issueIndex = parseInt(
          z.string().parse(vulnerabilityReportIssue?.vendorIssueId)
        )
        const results = vulReport.runs[0]?.results || []
        const ruleId = results[issueIndex]?.ruleId
        const location = VulReportLocationZ.parse(
          results[issueIndex]?.locations[0]
        )
        const { uri: filePath } = location.physicalLocation.artifactLocation
        const { startLine, startColumn, endColumn } =
          location.physicalLocation.region
        const fixLocation = {
          filePath,
          startLine,
          startColumn,
          endColumn,
          ruleId,
        }
        return {
          fix,
          fixLocation,
        }
      })
      .map(async ({ fix, fixLocation }) => {
        const { filePath, startLine } = fixLocation
        const getFixContent = await gqlClient.getFix(fix.id)
        const {
          fix_by_pk: {
            patchAndQuestions: { patch },
          },
        } = getFixContent
        const commentRes = await scm.postPrComment(
          {
            body: 'empty',
            pull_number: pullRequest,
            commit_id: commitSha,
            path: filePath,
            line: startLine,
          },
          githubActionOctokit
        )
        const commitUrl = getCommitUrl({
          fixId: fix.id,
          projectId,
          analysisId,
          organizationId,
          redirectUrl: commentRes.data.html_url,
        })
        const fixUrl = getFixUrl({
          fixId: fix.id,
          projectId,
          analysisId,
          organizationId,
        })
        const scanerString = scannerToFriendlyString(scanner)
        const issueType = getIssueType(fix.issueType)
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
      })
  )
}
