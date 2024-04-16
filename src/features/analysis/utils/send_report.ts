import {
  progressMassages,
  VUL_REPORT_DIGEST_TIMEOUT_MS,
} from '@mobb/bugsy/constants'
import Debug from 'debug'
import { createSpinner } from 'nanospinner'

import { GQLClient } from '../graphql'
import { SubmitVulnerabilityReportVariables } from '../graphql/types'

const debug = Debug('mobbdev:index')

export async function sendReport({
  spinner,
  submitVulnerabilityReportVariables,
  gqlClient,
}: {
  spinner: ReturnType<typeof createSpinner>
  submitVulnerabilityReportVariables: SubmitVulnerabilityReportVariables
  gqlClient: GQLClient
}) {
  try {
    const sumbitRes = await gqlClient.submitVulnerabilityReport(
      submitVulnerabilityReportVariables
    )
    if (
      sumbitRes.submitVulnerabilityReport.__typename !== 'VulnerabilityReport'
    ) {
      debug('error submit vul report %s', sumbitRes)
      throw new Error('🕵️‍♂️ Mobb analysis failed')
    }
    spinner.update({ text: progressMassages.processingVulnerabilityReport })

    await gqlClient.subscribeToAnalysis({
      subscribeToAnalysisParams: {
        analysisId: sumbitRes.submitVulnerabilityReport.fixReportId,
      },
      callback: () =>
        spinner.update({
          text: '⚙️ Vulnerability report proccessed successfuly',
        }),

      callbackStates: ['Digested', 'Finished'],
      timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
    })

    return sumbitRes
  } catch (e) {
    spinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
    throw e
  }
}
