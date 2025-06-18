import { fixesFoundPrompt, noReportFoundPrompt } from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { getMcpGQLClient } from '../../services/McpGQLClient'

export class AvailableFixesService {
  private gqlClient: Awaited<ReturnType<typeof getMcpGQLClient>> | null = null

  private currentOffset: number = 0

  private async initializeGqlClient() {
    if (!this.gqlClient) {
      this.gqlClient = await getMcpGQLClient()
    }
    return this.gqlClient
  }

  public async checkForAvailableFixes({
    repoUrl,
    limit = 3,
    offset = 0,
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

      let effectiveOffset: number
      if (offset !== undefined) {
        effectiveOffset = offset
      } else if (this.currentOffset) {
        effectiveOffset = this.currentOffset ?? 0
      } else {
        effectiveOffset = 0
      }
      logDebug('effectiveOffset', { test: 'j', effectiveOffset })

      const result = await gqlClient.getLatestReportByRepoUrl({
        repoUrl,
        limit,
        offset: effectiveOffset,
      })
      logDebug('received latest report result', { result })

      if (!result) {
        logInfo('No report found for repository', { repoUrl })
        return noReportFoundPrompt
      }

      logInfo('Successfully retrieved available fixes', {
        reportFound: true,
      })

      this.currentOffset = effectiveOffset + (result.fixes?.length || 0)

      return fixesFoundPrompt({
        fixReport: result,
        offset: this.currentOffset,
      })
    } catch (error) {
      logError('Failed to check for available fixes', {
        error,
        repoUrl,
      })
      throw error
    }
  }
}
