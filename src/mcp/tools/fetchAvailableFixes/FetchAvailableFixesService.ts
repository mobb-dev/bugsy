import {
  expiredReportPrompt,
  fixesFoundPrompt,
  noReportFoundPrompt,
} from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { getMcpGQLClient } from '../../services/McpGQLClient'

export class FetchAvailableFixesService {
  private static instance: FetchAvailableFixesService

  private gqlClient: Awaited<ReturnType<typeof getMcpGQLClient>> | null = null
  private currentOffset: number = 0

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): FetchAvailableFixesService {
    if (!FetchAvailableFixesService.instance) {
      FetchAvailableFixesService.instance = new FetchAvailableFixesService()
    }
    return FetchAvailableFixesService.instance
  }

  public reset(): void {
    this.currentOffset = 0
  }

  private async initializeGqlClient() {
    if (!this.gqlClient) {
      this.gqlClient = await getMcpGQLClient()
    }
    return this.gqlClient
  }

  public async checkForAvailableFixes({
    repoUrl,
    limit = 3,
    offset,
  }: {
    repoUrl: string
    limit?: number
    offset?: number
  }): Promise<string> {
    try {
      logDebug('Checking for available fixes', { repoUrl, limit })
      const gqlClient = await this.initializeGqlClient()
      logDebug('GQL client initialized')
      logDebug('querying for latest report', { repoUrl, limit })

      // Use the provided offset when it is defined; otherwise fall back to the service\'s currentOffset.
      const effectiveOffset: number = offset ?? (this.currentOffset || 0)

      logDebug('effectiveOffset', { effectiveOffset })

      // Fetch the latest (non-expired) report along with any expired report
      const { fixReport, expiredReport } =
        await gqlClient.getLatestReportByRepoUrl({
          repoUrl,
          limit,
          offset: effectiveOffset,
        })
      logDebug('received latest report result', { fixReport, expiredReport })

      if (!fixReport) {
        // No up-to-date report. Inform the user if an expired one exists.
        if (expiredReport) {
          const lastReportDate = expiredReport.expirationOn
            ? new Date(expiredReport.expirationOn).toLocaleString()
            : 'Unknown date'
          logInfo('Expired report found', {
            repoUrl,
            expirationOn: expiredReport.expirationOn,
          })
          return expiredReportPrompt({ lastReportDate })
        }

        logInfo('No report (active or expired) found for repository', {
          repoUrl,
        })
        return noReportFoundPrompt
      }

      logInfo('Successfully retrieved available fixes', {
        reportFound: true,
      })

      const prompt = fixesFoundPrompt({
        fixReport,
        offset: effectiveOffset,
      })
      this.currentOffset = effectiveOffset + (fixReport.fixes?.length || 0)
      return prompt
    } catch (error) {
      logError('Failed to check for available fixes', {
        error,
        repoUrl,
      })
      throw error
    }
  }
}
