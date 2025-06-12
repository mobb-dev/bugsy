import { logDebug, logError, logInfo } from '../../Logger'
import { getMcpGQLClient } from '../../services/McpGQLClient'
import {
  fixesFoundPrompt,
  noReportFoundPrompt,
} from './helpers/AvailableFixesResponsePrompts'

export class AvailableFixesService {
  private gqlClient: Awaited<ReturnType<typeof getMcpGQLClient>> | null = null

  private async initializeGqlClient() {
    if (!this.gqlClient) {
      this.gqlClient = await getMcpGQLClient()
    }
    return this.gqlClient
  }

  public async checkForAvailableFixes(
    repoUrl: string,
    limit?: number
  ): Promise<string> {
    try {
      logDebug('Checking for available fixes', { repoUrl, limit })
      const gqlClient = await this.initializeGqlClient()
      logDebug('GQL client initialized')
      logDebug('querying for latest report', { repoUrl, limit })
      const result = await gqlClient.getLatestReportByRepoUrl(repoUrl, limit)
      logDebug('received latest report result', { result })

      if (!result) {
        logInfo('No report found for repository', { repoUrl })
        return noReportFoundPrompt
      }

      logInfo('Successfully retrieved available fixes', {
        reportFound: true,
      })

      return fixesFoundPrompt(result)
    } catch (error) {
      logError('Failed to check for available fixes', {
        error,
        repoUrl,
      })
      throw error
    }
  }
}
