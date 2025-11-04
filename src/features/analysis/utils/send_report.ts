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
}: {
  spinner: ReturnType<typeof createSpinner>
  submitVulnerabilityReportVariables: SubmitVulnerabilityReportMutationVariables
  gqlClient: GQLClient
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

    await gqlClient.subscribeToAnalysis({
      subscribeToAnalysisParams: {
        analysisId: submitRes.submitVulnerabilityReport.fixReportId,
      },
      callback: () =>
        spinner.update({
          text: '⚙️ Vulnerability report processed successfully',
        }),

      callbackStates: [
        Fix_Report_State_Enum.Digested,
        Fix_Report_State_Enum.Finished,
      ],
      timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
    })

    return submitRes
  } catch (e) {
    spinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
    throw e
  }
}
