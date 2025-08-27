import { ScanContext } from '@mobb/bugsy/types'

import {
  MCP_DEFAULT_LIMIT,
  MCP_REPORT_ID_EXPIRATION_MS,
} from '../../core/configs'
import {
  ApiConnectionError,
  GqlClientError,
  NoFilesError,
} from '../../core/Errors'
import { fixesPrompt } from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import {
  createAuthenticatedMcpGQLClient,
  McpGQLClient,
} from '../../services/McpGQLClient'
import { scanFiles } from '../../services/ScanFiles'
import { McpFix } from '../../types'

export class ScanAndFixVulnerabilitiesService {
  private static instance: ScanAndFixVulnerabilitiesService

  private gqlClient?: McpGQLClient
  /**
   * Stores the fix report id that is created on the first run so that subsequent
   * calls can skip the expensive packing/uploading/scan flow and directly fetch
   * the analysis results.
   */
  private storedFixReportId?: string
  private currentOffset?: number = 0
  /**
   * Timestamp when the fixReportId was created
   * Used to expire the fixReportId after REPORT_ID_EXPIRATION_MS hours
   */
  private fixReportIdTimestamp?: number

  public static getInstance(): ScanAndFixVulnerabilitiesService {
    if (!ScanAndFixVulnerabilitiesService.instance) {
      ScanAndFixVulnerabilitiesService.instance =
        new ScanAndFixVulnerabilitiesService()
    }
    return ScanAndFixVulnerabilitiesService.instance
  }

  public reset(): void {
    this.storedFixReportId = undefined
    this.currentOffset = undefined
    this.fixReportIdTimestamp = undefined
  }

  /**
   * Checks if the stored fixReportId has expired (older than 2 hours)
   */
  private isFixReportIdExpired(): boolean {
    if (!this.fixReportIdTimestamp) {
      return true
    }

    const currentTime = Date.now()
    return currentTime - this.fixReportIdTimestamp > MCP_REPORT_ID_EXPIRATION_MS
  }

  public async processVulnerabilities({
    fileList,
    repositoryPath,
    offset,
    limit,
    isRescan = false,
  }: {
    fileList: string[]
    repositoryPath: string
    offset?: number
    limit?: number
    isRescan?: boolean
  }): Promise<string> {
    logInfo('Processing vulnerabilities')
    try {
      this.gqlClient = await this.initializeGqlClient()
      logDebug('storedFixReportId', {
        storedFixReportId: this.storedFixReportId,
        currentOffset: this.currentOffset,
        fixReportIdTimestamp: this.fixReportIdTimestamp,
        isExpired: this.storedFixReportId ? this.isFixReportIdExpired() : null,
      })

      let fixReportId: string | undefined = this.storedFixReportId

      // Reset and rescan if:
      // 1. No stored fixReportId exists
      // 2. isRescan is true
      // 3. The stored fixReportId has expired
      if (!fixReportId || isRescan || this.isFixReportIdExpired()) {
        logInfo('Scanning files')
        this.reset()
        this.validateFiles(fileList)
        const scanResult = await scanFiles({
          fileList,
          repositoryPath,
          gqlClient: this.gqlClient,
          scanContext: ScanContext.USER_REQUEST,
        })
        fixReportId = scanResult.fixReportId
      } else {
        logInfo('Using stored fixReportId')
      }

      // Use the provided offset when defined; otherwise fallback to currentOffset or 0.
      const effectiveOffset: number = offset ?? (this.currentOffset || 0)
      const effectiveLimit: number = limit ?? MCP_DEFAULT_LIMIT
      logDebug('effectiveOffset', { effectiveOffset })

      const fixes = await this.getReportFixes(
        fixReportId,
        effectiveOffset,
        effectiveLimit
      )

      // Only store fixReportId if fixes were found
      logInfo(`Found ${fixes.totalCount} fixes`)
      if (fixes.totalCount > 0) {
        this.storedFixReportId = fixReportId
        this.fixReportIdTimestamp = Date.now()
      } else {
        this.reset()
      }

      const prompt = fixesPrompt({
        fixes: fixes.fixes,
        totalCount: fixes.totalCount,
        offset: effectiveOffset,
        scannedFiles: [...fileList],
        limit: effectiveLimit,
        gqlClient: this.gqlClient,
      })

      this.currentOffset = effectiveOffset + (fixes.fixes?.length || 0)
      return prompt
    } catch (error) {
      // if (
      //   error instanceof ApiConnectionError ||
      //   error instanceof CliLoginError
      // ) {
      //   return failedToConnectToApiPrompt
      // }

      // if (
      //   error instanceof AuthenticationError ||
      //   error instanceof FailedToGetApiTokenError
      // ) {
      //   return failedToAuthenticatePrompt
      // }

      const message = (error as Error).message
      logError('Vulnerability processing failed', { error: message })
      throw error
    }
  }

  private validateFiles(fileList: string[]): void {
    if (fileList.length === 0) {
      throw new NoFilesError()
    }
  }

  private async initializeGqlClient(): Promise<McpGQLClient> {
    const gqlClient = await createAuthenticatedMcpGQLClient()

    const isConnected = await gqlClient.verifyApiConnection()
    if (!isConnected) {
      throw new ApiConnectionError(
        'Failed to connect to the API. Please check your MOBB_API_KEY'
      )
    }

    this.gqlClient = gqlClient
    return gqlClient
  }

  private async getReportFixes(
    fixReportId: string,
    offset?: number,
    limit?: number
  ): Promise<{
    fixes: McpFix[]
    totalCount: number
  }> {
    logDebug('getReportFixes', { fixReportId, offset, limit })
    if (!this.gqlClient) {
      throw new GqlClientError()
    }

    const fixes = await this.gqlClient.getReportFixesPaginated({
      reportId: fixReportId,
      offset,
      limit,
    })
    logDebug(`${fixes?.fixes?.length} fixes retrieved`)
    return {
      fixes: fixes?.fixes || [],
      totalCount: fixes?.totalCount || 0,
    }
  }
}
