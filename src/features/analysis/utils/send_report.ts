import Debug from 'debug'
import { createSpinner } from 'nanospinner'

import {
  progressMassages,
  VUL_REPORT_DIGEST_TIMEOUT_MS,
} from '../../../constants'
import { GQLClient } from '../graphql'
import {
  Fix_Report_State_Enum,
  SubmitVulnerabilityReportMutationVariables,
} from '../scm/generates/client_generates'

const debug = Debug('mobbdev:index')

export async function sendReport({
  spinner,
  submitVulnerabilityReportVariables,
  gqlClient,
  polling,
}: {
  spinner: ReturnType<typeof createSpinner>
  submitVulnerabilityReportVariables: SubmitVulnerabilityReportMutationVariables
  gqlClient: GQLClient
  polling?: boolean
}) {
  try {
    const submitRes = await gqlClient.submitVulnerabilityReport(
      submitVulnerabilityReportVariables
    )
    if (
      submitRes.submitVulnerabilityReport.__typename !== 'VulnerabilityReport'
    ) {
      debug('error submit vul report %s', submitRes)
      throw new Error('🕵️‍♂️ Mobb analysis failed')
    }
    spinner.update({ text: progressMassages.processingVulnerabilityReport })

    const callback = (_analysisId: string) =>
      spinner.update({
        text: '⚙️ Vulnerability report processed successfully',
      })

    const callbackStates = [
      Fix_Report_State_Enum.Digested,
      Fix_Report_State_Enum.Finished,
    ]

    if (polling) {
      debug('[sendReport] Using POLLING mode for analysis state updates')
      await gqlClient.pollForAnalysisState({
        analysisId: submitRes.submitVulnerabilityReport.fixReportId,
        callback,
        callbackStates,
        timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
      })
    } else {
      debug('[sendReport] Using WEBSOCKET mode for analysis state updates')
      await gqlClient.subscribeToAnalysis({
        subscribeToAnalysisParams: {
          analysisId: submitRes.submitVulnerabilityReport.fixReportId,
        },
        callback,
        callbackStates,
        timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
      })
    }

    return submitRes
  } catch (e) {
    spinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
    throw e
  }
}
