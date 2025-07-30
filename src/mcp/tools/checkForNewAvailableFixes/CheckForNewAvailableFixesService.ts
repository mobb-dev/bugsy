import {
  MCP_DEFAULT_LIMIT,
  MCP_PERIODIC_CHECK_INTERVAL,
} from '../../core/configs'
import { ApiConnectionError } from '../../core/Errors'
import {
  freshFixesPrompt,
  initialScanInProgressPrompt,
  noFreshFixesPrompt,
} from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { configStore } from '../../services/ConfigStoreService'
import { getLocalFiles, LocalFile } from '../../services/GetLocalFiles'
import {
  createAuthenticatedMcpGQLClient,
  McpGQLClient,
} from '../../services/McpGQLClient'
import { scanFiles } from '../../services/ScanFiles'
import { McpFix } from '../../types'

function extractPathFromPatch(patch?: string): string | null {
  const match = patch?.match(/^diff --git a\/([^\s]+) b\//)
  return match?.[1] ?? null
}

/**
 * Service responsible for monitoring repositories and detecting new security fixes
 * since the last scan. Implements periodic scanning with intelligent caching.
 */
export class CheckForNewAvailableFixesService {
  private static instance: CheckForNewAvailableFixesService

  /**
   * Cache of the last known total number of fixes per repository URL so that we
   * can determine whether *new* fixes have been generated since the user last
   * asked.
   */
  private path: string = ''
  private filesLastScanned: Record<string, number> = {}
  private freshFixes: McpFix[] = []
  private reportedFixes: McpFix[] = []
  private intervalId: NodeJS.Timeout | null = null
  private isInitialScanComplete: boolean = false
  private gqlClient: McpGQLClient | null = null
  private fullScanPathsScanned: string[] = []

  public static getInstance(): CheckForNewAvailableFixesService {
    if (!CheckForNewAvailableFixesService.instance) {
      CheckForNewAvailableFixesService.instance =
        new CheckForNewAvailableFixesService()
    }
    return CheckForNewAvailableFixesService.instance
  }

  constructor() {
    this.fullScanPathsScanned = configStore.get('fullScanPathsScanned') || []
  }

  /**
   * Resets any cached state so the service can be reused between independent
   * MCP sessions.
   */
  public reset(): void {
    this.filesLastScanned = {}
    this.freshFixes = []
    this.reportedFixes = []
    this.fullScanPathsScanned = configStore.get('fullScanPathsScanned') || []
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Scans repository for security vulnerabilities and identifies new fixes
   * since the last scan.
   */
  private async scanForSecurityVulnerabilities({
    path,
    isAllDetectionRulesScan,
    isAllFilesScan,
    scanContext,
  }: {
    path: string
    isAllDetectionRulesScan?: boolean
    isAllFilesScan?: boolean
    scanContext: 'FULL_SCAN' | 'BACKGROUND_INITIAL' | 'BACKGROUND_PERIODIC'
  }): Promise<void> {
    logDebug(`[${scanContext}] Scanning for new security vulnerabilities`, {
      path,
    })
    if (!this.gqlClient) {
      logInfo(`[${scanContext}] No GQL client found, skipping scan`)
      throw new Error('No GQL client found')
    }

    try {
      const isConnected = await this.gqlClient.verifyApiConnection()
      if (!isConnected) {
        logError(`[${scanContext}] Failed to connect to the API, scan aborted`)
        throw new ApiConnectionError()
      }

      logDebug(
        `[${scanContext}] Connected to the API, assembling list of files to scan`,
        { path }
      )
      const files = await getLocalFiles({
        path,
        isAllFilesScan,
      })

      logDebug(`[${scanContext}] Active files`, { files })
      const filesToScan = files.filter((file) => {
        const lastScannedEditTime = this.filesLastScanned[file.fullPath]
        if (!lastScannedEditTime) {
          return true
        }
        return file.lastEdited > lastScannedEditTime
      })

      if (filesToScan.length === 0) {
        logInfo(`[${scanContext}] No files require scanning`)
        return
      }

      logDebug(`[${scanContext}] Files requiring security scan`, {
        filesToScan,
      })
      const { fixReportId, projectId } = await scanFiles({
        fileList: filesToScan.map((file) => file.relativePath),
        repositoryPath: path,
        gqlClient: this.gqlClient,
        isAllDetectionRulesScan,
        scanContext,
      })

      logInfo(
        `[${scanContext}] Security scan completed for ${path} reportId: ${fixReportId} projectId: ${projectId}`
      )

      if (isAllFilesScan) {
        return
      }

      const fixes = await this.gqlClient.getReportFixesPaginated({
        reportId: fixReportId,
        offset: 0,
        limit: 1000,
      })

      const newFixes = fixes?.fixes?.filter(
        (fix) => !this.isFixAlreadyReported(fix)
      )

      logInfo(
        `[${scanContext}] Security fixes retrieved, total: ${fixes?.fixes?.length || 0}, new: ${
          newFixes?.length || 0
        }`
      )

      this.updateFreshFixesCache(newFixes || [], filesToScan)
      this.updateFilesScanTimestamps(filesToScan)
      this.isInitialScanComplete = true
    } catch (error) {
      const errorMessage = (error as Error).message

      // Handle authentication-specific errors gracefully
      if (
        errorMessage.includes('Authentication failed') ||
        errorMessage.includes('access-denied') ||
        errorMessage.includes('Authentication hook unauthorized')
      ) {
        logError(
          'Periodic scan skipped due to authentication failure. Please re-authenticate by running a manual scan.',
          {
            error: errorMessage,
          }
        )
        return
      }

      // Handle other ReportInitializationErrors
      if (errorMessage.includes('ReportInitializationError')) {
        logError('Periodic scan failed during report initialization', {
          error: errorMessage,
        })
        return
      }

      // Re-throw unexpected errors
      logError('Unexpected error during periodic security scan', { error })
      throw error
    }
  }

  private updateFreshFixesCache(
    newFixes: McpFix[],
    filesToScan: LocalFile[]
  ): void {
    this.freshFixes = this.freshFixes
      .filter((fix) => !this.isFixFromOldScan(fix, filesToScan))
      .concat(newFixes)
      .sort((a: McpFix, b: McpFix) => {
        return (b.severityValue ?? 0) - (a.severityValue ?? 0)
      })

    logInfo(`Fresh fixes cache updated, total: ${this.freshFixes.length}`)
  }

  private updateFilesScanTimestamps(filesToScan: LocalFile[]): void {
    filesToScan.forEach((file) => {
      this.filesLastScanned[file.fullPath] = file.lastEdited
    })
  }

  private isFixAlreadyReported(fix: McpFix): boolean {
    return this.reportedFixes.some(
      (reportedFix) => reportedFix.sharedState?.id === fix.sharedState?.id
    )
  }

  private isFixFromOldScan(fix: McpFix, filesToScan: LocalFile[]): boolean {
    const patch =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.patch
        : undefined
    const fixFile = extractPathFromPatch(patch)

    if (!fixFile) {
      return false
    }

    logDebug('Checking if fix is from old scan', {
      fixFile,
      filesToScan,
      isFromOldScan: filesToScan.some((file) => file.relativePath === fixFile),
    })

    return filesToScan.some((file) => file.relativePath === fixFile)
  }

  public async getFreshFixes({ path }: { path: string }): Promise<string> {
    if (this.path !== path) {
      this.path = path
      this.reset()
    }
    this.gqlClient = await createAuthenticatedMcpGQLClient()

    this.triggerScan({ path, gqlClient: this.gqlClient })

    if (this.freshFixes.length > 0) {
      return this.generateFreshFixesResponse()
    }

    if (!this.isInitialScanComplete) {
      return initialScanInProgressPrompt
    }

    return noFreshFixesPrompt
  }

  public triggerScan({
    path,
    gqlClient,
  }: {
    path: string
    gqlClient: McpGQLClient
  }): void {
    this.gqlClient = gqlClient
    if (!this.intervalId) {
      this.startPeriodicScanning(path)
      this.executeInitialScan(path)
      void this.executeInitialFullScan(path)
    }
  }

  private startPeriodicScanning(path: string): void {
    logDebug('Starting periodic scan for new security vulnerabilities', {
      path,
    })

    this.intervalId = setInterval(() => {
      logDebug('Triggering periodic security scan', { path })
      this.scanForSecurityVulnerabilities({
        path,
        scanContext: 'BACKGROUND_PERIODIC',
      }).catch((error) => {
        logError('Error during periodic security scan', { error })
      })
    }, MCP_PERIODIC_CHECK_INTERVAL)
  }

  private async executeInitialFullScan(path: string): Promise<void> {
    const scanContext = 'FULL_SCAN'
    logDebug(`[${scanContext}] Triggering initial full security scan`, { path })

    logDebug(`[${scanContext}] Full scan paths scanned`, {
      fullScanPathsScanned: this.fullScanPathsScanned,
    })
    if (this.fullScanPathsScanned.includes(path)) {
      logDebug(`[${scanContext}] Full scan already executed for this path`, {
        path,
      })
      return
    }

    configStore.set('fullScanPathsScanned', [
      ...this.fullScanPathsScanned,
      path,
    ])
    try {
      await this.scanForSecurityVulnerabilities({
        path,
        isAllFilesScan: true,
        isAllDetectionRulesScan: true,
        scanContext: 'FULL_SCAN',
      })
      // Only update the class member and configstore after successful scan completion
      if (!this.fullScanPathsScanned.includes(path)) {
        this.fullScanPathsScanned.push(path)
        configStore.set('fullScanPathsScanned', this.fullScanPathsScanned)
      }
      logInfo(`[${scanContext}] Full scan completed`, { path })
    } catch (error) {
      logError('Error during initial full security scan', { error })
    }
  }

  private executeInitialScan(path: string): void {
    const scanContext = 'BACKGROUND_INITIAL'
    logDebug(`[${scanContext}] Triggering initial security scan`, { path })

    this.scanForSecurityVulnerabilities({
      path,
      scanContext: 'BACKGROUND_INITIAL',
    }).catch((error) => {
      logError(`[${scanContext}] Error during initial security scan`, { error })
    })
  }

  private generateFreshFixesResponse(): string {
    // Extract up to 3 fixes from the front of the array
    const freshFixes = this.freshFixes.splice(0, MCP_DEFAULT_LIMIT)

    if (freshFixes.length > 0) {
      this.reportedFixes.push(...freshFixes)
      return freshFixesPrompt({ fixes: freshFixes, limit: MCP_DEFAULT_LIMIT })
    }

    return noFreshFixesPrompt
  }
}
