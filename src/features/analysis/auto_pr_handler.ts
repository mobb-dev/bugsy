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
  /**
   * Fix Policy: 'policy' when the run passed no delivery flag, so
   * the server resolves the project's pipeline_delivery and may decide not to
   * deliver at all.
   */
  deliveryMode?: 'policy' | 'pr' | 'direct'
}) {
  const {
    gqlClient,
    analysisId,
    commitDirectly,
    prId,
    createSpinner,
    createOnePr,
    polling,
    deliveryMode,
  } = params
  // A policy-driven run did not ask for delivery, so it must never fail the
  // scan or narrate a pull request the policy may decide not to open.
  const policyDriven = deliveryMode === 'policy'
  const createAutoPrSpinner = createSpinner(
    policyDriven
      ? '🔄 Waiting for the analysis to finish before applying your Fix Policy'
      : '🔄 Waiting for the analysis to finish before initiating automatic pull request creation'
  ).start()

  const callback = async (analysisId: string) => {
    try {
      await deliver(analysisId)
    } catch (error) {
      // In WebSocket mode this runs inside the subscription's `next` handler,
      // whose returned promise is discarded — an escaping rejection would be
      // unhandled and leave the outer await hanging until the 30-minute
      // timeout. Never let a run the user did not ask to deliver do that.
      if (!policyDriven) {
        throw error
      }
      debug('auto pr policy delivery failed %o', error)
      createAutoPrSpinner.error({ text: '🔄 Fix Policy: nothing delivered' })
    }
  }

  const deliver = async (analysisId: string) => {
    const autoPrAnalysisRes = await gqlClient.autoPrAnalysis({
      analysisId,
      commitDirectly,
      prId,
      // Spread (one PR per issue type) is what an explicit --auto-pr has always
      // done. A policy-driven run asked for nothing, and the Fix Policy page
      // promises "a new pull request" — singular — so it condenses, matching
      // the webhook trigger.
      prStrategy:
        createOnePr || policyDriven ? PrStrategy.Condense : PrStrategy.Spread,
      deliveryMode,
    })
    debug('auto pr analysis res %o', autoPrAnalysisRes)
    if (autoPrAnalysisRes.autoPrAnalysis?.__typename === 'AutoPrError') {
      createAutoPrSpinner.error({
        text: policyDriven
          ? `🔄 Fix Policy: delivery failed - ${autoPrAnalysisRes.autoPrAnalysis.error}`
          : `🔄 Automatic pull request failed - ${autoPrAnalysisRes.autoPrAnalysis.error}`,
      })
      return
    }
    if (autoPrAnalysisRes.autoPrAnalysis?.__typename === 'AutoPrSuccess') {
      const { appliedAutoPrIssueTypes } = autoPrAnalysisRes.autoPrAnalysis
      if (appliedAutoPrIssueTypes.length === 0) {
        createAutoPrSpinner.success({
          text: policyDriven
            ? '🔄 Fix Policy: nothing to deliver for this run'
            : '🔄 Automatic pull request did not find any new fixes to open a pull request for',
        })
        return
      }
      createAutoPrSpinner.success({
        text: `🔄 Automatic pull request creation initiated successfully for the following issue types: ${appliedAutoPrIssueTypes}`,
      })
    }
  }

  const callbackStates = [Fix_Report_State_Enum.Finished]

  try {
    if (polling) {
      debug('[handleAutoPr] Using POLLING mode for analysis state updates')
      return await gqlClient.pollForAnalysisState({
        analysisId,
        callback,
        callbackStates,
      })
    }
    debug('[handleAutoPr] Using WEBSOCKET mode for analysis state updates')
    return await gqlClient.subscribeToAnalysis({
      subscribeToAnalysisParams: {
        analysisId,
      },
      callback,
      callbackStates,
    })
  } catch (error) {
    if (!policyDriven) {
      throw error
    }
    debug('auto pr policy run did not complete %o', error)
    createAutoPrSpinner.error({ text: '🔄 Fix Policy: nothing delivered' })
    return
  }
}
