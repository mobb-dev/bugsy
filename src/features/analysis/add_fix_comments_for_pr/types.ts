import { Scanner } from '@mobb/bugsy/constants'

import { GithubSCMLib } from '../scm'
import { getFixesData, getRelevantVulenrabilitiesFromDiff } from './utils'

export type PrVulenrabilities = Awaited<
  ReturnType<typeof getRelevantVulenrabilitiesFromDiff>
>

export type FixesById = Awaited<ReturnType<typeof getFixesData>>

export type PostFixCommentParams = {
  vulnerabilityReportIssueCodeNode: PrVulenrabilities['vulnerabilityReportIssueCodeNodes'][0]
  projectId: string
  analysisId: string
  organizationId: string
  fixesById: FixesById
  scm: GithubSCMLib
  pullRequest: number
  scanner: Scanner
  commitSha: string
}

export type PostAnalysisSummaryParams = {
  prVulenrabilities: PrVulenrabilities
  fixesById: FixesById
  pullRequest: number
  scm: GithubSCMLib
}

export type PostAnalysisInsightCommentParams = {
  prVulenrabilities: PrVulenrabilities
  pullRequest: number
  scanner: Scanner
  scm: GithubSCMLib
}
