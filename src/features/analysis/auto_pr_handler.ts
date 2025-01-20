import Debug from 'debug'

import { CreateSpinner } from '../../utils/spinner'
import { GQLClient } from './graphql'
import { Fix_Report_State_Enum } from './scm/generates/client_generates'

const debug = Debug('mobbdev:handleAutoPr')

export async function handleAutoPr(params: {
  gqlClient: GQLClient
  analysisId: string
  commitDirectly?: boolean
  createSpinner: CreateSpinner
}) {
  const { gqlClient, analysisId, commitDirectly, createSpinner } = params
  const createAutoPrSpinner = createSpinner(
    '🔄 Waiting for the analysis to finish before initiating automatic pull request creation'
  ).start()
  return await gqlClient.subscribeToAnalysis({
    subscribeToAnalysisParams: {
      analysisId,
    },
    callback: async (analysisId) => {
      const autoPrAnalysisRes = await gqlClient.autoPrAnalysis(
        analysisId,
        commitDirectly
      )
      debug('auto pr analysis res %o', autoPrAnalysisRes)
      if (autoPrAnalysisRes.autoPrAnalysis?.__typename === 'AutoPrError') {
        createAutoPrSpinner.error({
          text: `🔄 Automatic pull request failed - ${autoPrAnalysisRes.autoPrAnalysis.error}`,
        })
        return
      }
      if (autoPrAnalysisRes.autoPrAnalysis?.__typename === 'AutoPrSuccess') {
        const { appliedAutoPrIssueTypes } = autoPrAnalysisRes.autoPrAnalysis
        if (appliedAutoPrIssueTypes.length === 0) {
          createAutoPrSpinner.success({
            text: '🔄 Automatic pull request did not find any new fixes to open a pull request for',
          })
          return
        }
        createAutoPrSpinner.success({
          text: `🔄 Automatic pull request creation initiated successfully for the following issue types: ${appliedAutoPrIssueTypes}`,
        })
      }
    },
    callbackStates: [Fix_Report_State_Enum.Finished],
  })
}
