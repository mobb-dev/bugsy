import Debug from 'debug'

import { CreateSpinner } from '../../utils/spinner'
import { GQLClient } from './graphql'
import {
  Fix_Report_State_Enum,
  PrStrategy,
} from './scm/generates/client_generates'

const debug = Debug('mobbdev:handleAutoPr')

export async function handleAutoPr(params: {
  gqlClient: GQLClient
  analysisId: string
  commitDirectly?: boolean
  prId?: number
  createSpinner: CreateSpinner
  createOnePr?: boolean
  polling?: boolean
}) {
  const {
    gqlClient,
    analysisId,
    commitDirectly,
    prId,
    createSpinner,
    createOnePr,
    polling,
  } = params
  const createAutoPrSpinner = createSpinner(
    '🔄 Waiting for the analysis to finish before initiating automatic pull request creation'
  ).start()

  const callback = async (analysisId: string) => {
    const autoPrAnalysisRes = await gqlClient.autoPrAnalysis({
      analysisId,
      commitDirectly,
      prId,
      prStrategy: createOnePr ? PrStrategy.Condense : PrStrategy.Spread,
    })
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
  }

  const callbackStates = [Fix_Report_State_Enum.Finished]

  if (polling) {
    debug('[handleAutoPr] Using POLLING mode for analysis state updates')
    return await gqlClient.pollForAnalysisState({
      analysisId,
      callback,
      callbackStates,
    })
  } else {
    debug('[handleAutoPr] Using WEBSOCKET mode for analysis state updates')
    return await gqlClient.subscribeToAnalysis({
      subscribeToAnalysisParams: {
        analysisId,
      },
      callback,
      callbackStates,
    })
  }
}
