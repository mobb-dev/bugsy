import { Scanner } from '@mobb/bugsy/constants'
import Debug from 'debug'

import { GQLClient } from '../graphql'
import {
  FalsePositivePartsZ,
  getParsedFalsePositiveMessage,
  SCMLib,
} from '../scm'
import { GithubSCMLib } from '../scm/github/GithubSCMLib'
import {
  deleteAllPreviousComments,
  deleteAllPreviousGeneralPrComments,
  getFixesData,
  getRelevantVulenrabilitiesFromDiff,
  postAnalysisInsightComment,
  postFixComment,
  postIssueComment,
} from './utils'

const debug = Debug('mobbdev:handle-finished-analysis')

export async function addFixCommentsForPr({
  analysisId,
  scm: _scm,
  gqlClient,
  scanner,
}: {
  analysisId: string
  scm: SCMLib
  gqlClient: GQLClient
  scanner: Scanner
}) {
  if (!(_scm instanceof GithubSCMLib)) {
    return
  }

  const scm = _scm as GithubSCMLib
  const getAnalysisRes = await gqlClient.getAnalysis(analysisId)
  debug('getAnalysis %o', getAnalysisRes)
  const {
    vulnerabilityReport: {
      projectId,
      project: { organizationId },
    },
  } = getAnalysisRes
  if (!getAnalysisRes.repo?.commitSha || !getAnalysisRes.repo.pullRequest) {
    throw new Error('repo not found')
  }
  const { commitSha, pullRequest } = getAnalysisRes.repo

  const diff = await scm.getPrDiff({ pull_number: pullRequest })
  const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
    diff,
    gqlClient,
    vulnerabilityReportId: getAnalysisRes.vulnerabilityReportId,
  })

  const {
    vulnerabilityReportIssueCodeNodes,
    irrelevantVulnerabilityReportIssues,
  } = prVulenrabilities
  const fixesId = vulnerabilityReportIssueCodeNodes.map(
    ({ vulnerabilityReportIssue: { fixId } }) => fixId
  )

  const fixesById = await getFixesData({ fixesId, gqlClient })
  const [comments, generalPrComments] = await Promise.all([
    scm.getPrComments({ pull_number: pullRequest }),
    scm.getGeneralPrComments({ prNumber: pullRequest }),
  ])
  // Delete all previous mobb comments
  await Promise.all([
    ...deleteAllPreviousComments({ comments, scm }),
    ...deleteAllPreviousGeneralPrComments({ generalPrComments, scm }),
  ])
  await Promise.all([
    ...prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
      (vulnerabilityReportIssueCodeNode) => {
        return postFixComment({
          vulnerabilityReportIssueCodeNode,
          projectId,
          analysisId,
          organizationId,
          fixesById,
          scm,
          pullRequest,
          scanner,
          commitSha,
        })
      }
    ),
    ...irrelevantVulnerabilityReportIssues.map(
      async (vulnerabilityReportIssue) => {
        let fpDescription: string | null = null
        if (vulnerabilityReportIssue.fpId) {
          const fpRes = await gqlClient.getFalsePositive({
            fpId: vulnerabilityReportIssue.fpId,
          })
          const parsedFpRes = await FalsePositivePartsZ.parseAsync(
            fpRes?.getFalsePositive
          )
          const { description, contextString } =
            getParsedFalsePositiveMessage(parsedFpRes)
          fpDescription = contextString
            ? `${description}\n\n${contextString}`
            : description
        }
        return await Promise.all(
          vulnerabilityReportIssue.codeNodes.map(
            async (vulnerabilityReportIssueCodeNode) => {
              return await postIssueComment({
                vulnerabilityReportIssueCodeNode: {
                  path: vulnerabilityReportIssueCodeNode.path,
                  startLine: vulnerabilityReportIssueCodeNode.startLine,
                  vulnerabilityReportIssue: {
                    fixId: '',
                    safeIssueType: vulnerabilityReportIssue.safeIssueType,
                    vulnerabilityReportIssueTags:
                      vulnerabilityReportIssue.vulnerabilityReportIssueTags,
                    category: vulnerabilityReportIssue.category,
                  },
                  vulnerabilityReportIssueId: vulnerabilityReportIssue.id,
                },
                projectId,
                analysisId,
                organizationId,
                fixesById,
                scm,
                pullRequest,
                scanner,
                commitSha,
                fpDescription,
              })
            }
          )
        )
      }
    ),
    postAnalysisInsightComment({
      prVulenrabilities,
      pullRequest,
      scanner,
      scm,
    }),
  ])
}
