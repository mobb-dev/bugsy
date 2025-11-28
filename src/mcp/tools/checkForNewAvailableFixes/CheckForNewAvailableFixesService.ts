import {
  Fix_Download_Source_Enum,
  Vulnerability_Report_Issue_Category_Enum,
} from '../../../features/analysis/scm/generates/client_generates'
import { ScanContext } from '../../../types'
import { configStore } from '../../../utils/ConfigStoreService'
import {
  MCP_DEFAULT_LIMIT,
  MCP_PERIODIC_CHECK_INTERVAL,
} from '../../core/configs'
import { ApiConnectionError } from '../../core/Errors'
import {
  appliedFixesSummaryPrompt,
  authenticationRequiredPrompt,
  freshFixesPrompt,
  initialScanInProgressPrompt,
  noFreshFixesPrompt,
  noVulnerabilitiesAutoFixPrompt,
} from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { getLocalFiles, LocalFile } from '../../services/GetLocalFiles'
import { LocalMobbFolderService } from '../../services/LocalMobbFolderService'
import {
  createAuthenticatedMcpGQLClient,
  McpGQLClient,
} from '../../services/McpGQLClient'
import { PatchApplicationService } from '../../services/PatchApplicationService'
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
  private hasAuthenticationFailed: boolean = false
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
    this.hasAuthenticationFailed = false
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
    scanContext: ScanContext
  }): Promise<void> {
    this.hasAuthenticationFailed = false
    logDebug(`[${scanContext}] Scanning for new security vulnerabilities`, {
      path,
    })
    if (!this.gqlClient) {
      logInfo(`[${scanContext}] No GQL client found, skipping scan`)
      this.hasAuthenticationFailed = true
      throw new Error('No GQL client found')
    }

    try {
      const isConnected = await this.gqlClient.verifyApiConnection()
      if (!isConnected) {
        logError(`[${scanContext}] Failed to connect to the API, scan aborted`)
        this.hasAuthenticationFailed = true
        throw new ApiConnectionError()
      }

      logDebug(
        `[${scanContext}] Connected to the API, assembling list of files to scan`,
        { path }
      )

      // Background scans should only use active files (git status), not fall back to recent files
      const isBackgroundScan =
        scanContext === ScanContext.BACKGROUND_INITIAL ||
        scanContext === ScanContext.BACKGROUND_PERIODIC

      const files = await getLocalFiles({
        path,
        isAllFilesScan,
        scanContext,
        scanRecentlyChangedFiles: !isBackgroundScan,
      })

      const scanStartTime = Date.now()
      logDebug(
        `[${scanContext}] setting scan start time to ${new Date(scanStartTime).toISOString()}`
      )
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

      // Check mvs_auto_fix setting and handle fixes accordingly
      if (newFixes && newFixes.length > 0) {
        try {
          const isMvsAutoFixEnabled =
            await this.gqlClient.getMvsAutoFixSettings()
          logDebug(
            `[${scanContext}] mvs_auto_fix setting: ${isMvsAutoFixEnabled}`
          )

          if (isMvsAutoFixEnabled) {
            // Filter fixes for MVS_AUTO_FIX flow: only include fixes with category 'Fixable' and downloadSource 'AUTO_MVS'
            const mvsAutoFixFilteredFixes = this.filterFixesForMvsAutoFix(
              newFixes,
              scanContext
            )

            await this.applyFixes({
              newFixes: mvsAutoFixFilteredFixes,
              scanContext,
              scanStartTime,
            })
          } else {
            this.updateAvailableFixes({
              newFixes,
              scannedFiles: filesToScan,
              scanContext,
            })
          }
        } catch (error) {
          logError(
            `[${scanContext}] Failed to check mvs_auto_fix setting, falling back to cache`,
            {
              error: error instanceof Error ? error.message : String(error),
            }
          )
          // Fallback to caching if we can't check the setting
          this.updateAvailableFixes({
            newFixes,
            scannedFiles: filesToScan,
            scanContext,
          })
        }
      }

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
          `[${scanContext}] Periodic scan skipped due to authentication failure. Please re-authenticate by running a manual scan.`,
          {
            error: errorMessage,
          }
        )
        this.hasAuthenticationFailed = true
        return
      }

      // Handle other ReportInitializationErrors
      if (errorMessage.includes('ReportInitializationError')) {
        logError(
          `[${scanContext}] Periodic scan failed during report initialization`,
          {
            error: errorMessage,
          }
        )
        return
      }

      // Re-throw unexpected errors
      logError(
        `[${scanContext}] Unexpected error during periodic security scan`,
        { error }
      )
      throw error
    }
  }

  /**
   * Applies fixes directly to the repository when mvs_auto_fix is enabled
   */
  private async applyFixes({
    newFixes,
    scanContext,
    scanStartTime,
  }: {
    newFixes: McpFix[]
    scanContext: ScanContext
    scanStartTime: number
  }): Promise<void> {
    if (newFixes.length === 0) {
      logInfo(`[${scanContext}] No new fixes to apply (all already reported)`)
      return
    }

    logInfo(`[${scanContext}] Auto-applying ${newFixes.length} new fixes`)

    // Use the actual repository path
    const repositoryPath = this.path

    logDebug(`[${scanContext}] Repository path for patch application`, {
      repositoryPath,
    })

    const applicationResult = await PatchApplicationService.applyFixes({
      fixes: newFixes,
      repositoryPath,
      scanStartTime,
      gqlClient: this.gqlClient || undefined,
      scanContext,
    })

    if (applicationResult.appliedFixes.length > 0) {
      logInfo(
        `[${scanContext}] Successfully auto-applied ${applicationResult.appliedFixes.length} fixes`
      )

      // Track applied fixes in reportedFixes to prevent duplicate applications
      this.reportedFixes.push(...applicationResult.appliedFixes)

      // Save patches and log fix details using LocalMobbFolderService
      await this.saveAndLogAppliedFixes({
        appliedFixes: applicationResult.appliedFixes,
        repositoryPath,
        scanContext,
      })
    }

    if (applicationResult.failedFixes.length > 0) {
      logError(
        `[${scanContext}] Failed to auto-apply ${applicationResult.failedFixes.length} fixes`,
        {
          failedFixes: applicationResult.failedFixes.map((f) => ({
            fixId: f.fix.id,
            error: f.error,
          })),
        }
      )
    }
  }

  /**
   * Saves patch files and logs fix details for successfully applied fixes
   */
  private async saveAndLogAppliedFixes({
    appliedFixes,
    repositoryPath,
    scanContext,
  }: {
    appliedFixes: McpFix[]
    repositoryPath: string
    scanContext: ScanContext
  }): Promise<void> {
    try {
      const localMobbService = new LocalMobbFolderService(repositoryPath)

      logDebug(
        `[${scanContext}] Saving and logging ${appliedFixes.length} applied fixes`,
        {
          repositoryPath,
          fixIds: appliedFixes.map((f) => f.id),
        }
      )

      for (const fix of appliedFixes) {
        try {
          // Save the patch file (LocalMobbFolderService handles validation internally)
          const saveResult = await localMobbService.savePatch(fix)

          if (saveResult.success) {
            logDebug(
              `[${scanContext}] Patch saved successfully for fix ${fix.id}`,
              {
                filePath: saveResult.filePath,
                fileName: saveResult.fileName,
              }
            )
          } else {
            logDebug(
              `[${scanContext}] Failed to save patch for fix ${fix.id}`,
              {
                error: saveResult.error,
              }
            )
          }

          // Always log the fix details (works for both patches and no-fix cases)
          const logResult = await localMobbService.logPatch(
            fix,
            saveResult.fileName
          )

          if (logResult.success) {
            logDebug(
              `[${scanContext}] Fix details logged successfully for fix ${fix.id}`,
              {
                filePath: logResult.filePath,
              }
            )
          } else {
            logError(
              `[${scanContext}] Failed to log fix details for fix ${fix.id}`,
              {
                error: logResult.error,
              }
            )
          }
        } catch (error) {
          logError(`[${scanContext}] Error processing applied fix ${fix.id}`, {
            error: String(error),
            fix,
          })
        }
      }

      logInfo(`[${scanContext}] Finished saving and logging applied fixes`, {
        processedCount: appliedFixes.length,
      })
    } catch (error) {
      logError(`[${scanContext}] Error in saveAndLogAppliedFixes`, {
        error: String(error),
        repositoryPath,
        appliedFixCount: appliedFixes.length,
      })
    }
  }

  private updateAvailableFixes({
    newFixes,
    scannedFiles,
    scanContext,
  }: {
    newFixes: McpFix[]
    scannedFiles: LocalFile[]
    scanContext: ScanContext
  }): void {
    this.freshFixes = this.freshFixes
      .filter(
        (fix) => !this.isFixFromOldScan({ fix, scannedFiles, scanContext })
      )
      .concat(newFixes)
      .sort((a: McpFix, b: McpFix) => {
        return (b.severityValue ?? 0) - (a.severityValue ?? 0)
      })

    logInfo(
      `[${scanContext}] Fresh fixes cache updated, total: ${this.freshFixes.length}`
    )
  }

  private updateFilesScanTimestamps(filesToScan: LocalFile[]): void {
    filesToScan.forEach((file) => {
      this.filesLastScanned[file.fullPath] = file.lastEdited
    })
  }

  private isFixAlreadyReported(fix: McpFix): boolean {
    return this.reportedFixes.some(
      (reportedFix) =>
        reportedFix.sharedState?.id === fix.sharedState?.id ||
        reportedFix.id === fix.id
    )
  }

  /**
   * Filters fixes for MVS_AUTO_FIX flow to only include fixes with:
   * - category 'Fixable' (or no category field - backward compatibility)
   * - do NOT have downloadSource 'AUTO_MVS'
   */
  private filterFixesForMvsAutoFix(
    fixes: McpFix[],
    scanContext: ScanContext
  ): McpFix[] {
    const filteredFixes = fixes.filter((fix) => {
      // Check if fix has vulnerability report issues with category 'Fixable'
      // If category field is missing, assume it's fixable for backward compatibility
      const hasFixableCategory =
        fix.vulnerabilityReportIssues?.some(
          (issue) =>
            !issue.category || // Handle missing field gracefully
            issue.category === Vulnerability_Report_Issue_Category_Enum.Fixable
        ) ?? true // If no vulnerabilityReportIssues, assume fixable

      // Check if fix does NOT have any downloadSource 'AUTO_MVS'
      // If downloadedBy field is missing, assume it's not AUTO_MVS
      const hasAutoMvsDownloadSource =
        fix.sharedState?.downloadedBy?.some(
          (d) => d.downloadSource === Fix_Download_Source_Enum.AutoMvs
        ) ?? false
      const doesNotHaveAutoMvsDownloadSource = !hasAutoMvsDownloadSource

      const shouldInclude =
        hasFixableCategory && doesNotHaveAutoMvsDownloadSource

      // Only log for fixes that are being filtered out
      if (!shouldInclude) {
        const filteringReasons: string[] = []

        if (!hasFixableCategory) {
          filteringReasons.push('not fixable category')
        }

        if (!doesNotHaveAutoMvsDownloadSource) {
          filteringReasons.push('has AUTO_MVS download source')
        }

        const reasonText = filteringReasons.join(' and ')

        logDebug(
          `[${scanContext}] Fix ${fix.id} filtered out - ${reasonText}`,
          {
            fixId: fix.id,
            hasFixableCategory,
            doesNotHaveAutoMvsDownloadSource,
            filteringReasons,
            categories: fix.vulnerabilityReportIssues?.map(
              (issue) => issue.category
            ),
            downloadSources: fix.sharedState?.downloadedBy?.map(
              (d) => d.downloadSource
            ),
          }
        )
      }

      return shouldInclude
    })

    logInfo(`[${scanContext}] MVS_AUTO_FIX filtering completed`, {
      originalCount: fixes.length,
      filteredCount: filteredFixes.length,
      removedCount: fixes.length - filteredFixes.length,
    })

    return filteredFixes
  }

  private isFixFromOldScan({
    fix,
    scannedFiles,
    scanContext,
  }: {
    fix: McpFix
    scannedFiles: LocalFile[]
    scanContext: ScanContext
  }): boolean {
    const patch =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.patch
        : undefined
    const fixFile = extractPathFromPatch(patch)

    if (!fixFile) {
      return false
    }

    logDebug(`[${scanContext}] Checking if fix is from old scan`, {
      fixFile,
      scannedFiles,
      isFromOldScan: scannedFiles.some((file) => file.relativePath === fixFile),
    })

    return scannedFiles.some((file) => file.relativePath === fixFile)
  }

  public async getFreshFixes({ path }: { path: string }): Promise<string> {
    const scanContext = ScanContext.USER_REQUEST
    logDebug(`[${scanContext}] Getting fresh fixes`, { path })
    if (this.path !== path) {
      this.path = path
      this.reset()
      logInfo(`[${scanContext}] Reset service state for new path`, { path })
    }
    try {
      this.gqlClient = await createAuthenticatedMcpGQLClient()
    } catch (error) {
      const errorMessage = (error as Error).message
      if (
        errorMessage.includes('Authentication failed') ||
        errorMessage.includes('access-denied') ||
        errorMessage.includes('Authentication hook unauthorized')
      ) {
        logError(
          `[${scanContext}] Failed to create authenticated client due to authentication failure`,
          {
            error: errorMessage,
          }
        )
        this.hasAuthenticationFailed = true
        return authenticationRequiredPrompt
      }
      // Re-throw non-authentication errors
      throw error
    }

    this.triggerScan({ path, gqlClient: this.gqlClient })

    // Check if auto-fix is enabled
    let isMvsAutoFixEnabled: boolean | null = null
    try {
      isMvsAutoFixEnabled = await this.gqlClient.getMvsAutoFixSettings()
      logDebug(`[${scanContext}] mvs_auto_fix setting: ${isMvsAutoFixEnabled}`)

      if (isMvsAutoFixEnabled) {
        // When auto-fix is enabled, return applied fixes from reportedFixes
        if (this.reportedFixes.length > 0) {
          return this.generateAppliedFixesResponse(scanContext)
        }
      } else {
        // When auto-fix is disabled, return fresh fixes as before
        if (this.freshFixes.length > 0) {
          return this.generateFreshFixesResponse(scanContext)
        }
      }
    } catch (error) {
      logError(`[${scanContext}] Failed to check mvs_auto_fix setting`, {
        error: error instanceof Error ? error.message : String(error),
      })
      // Fallback to original behavior
      if (this.freshFixes.length > 0) {
        return this.generateFreshFixesResponse(scanContext)
      }
    }

    if (this.hasAuthenticationFailed) {
      return authenticationRequiredPrompt
    }

    if (!this.isInitialScanComplete) {
      return initialScanInProgressPrompt
    }

    // Return appropriate prompt based on auto-fix setting
    if (isMvsAutoFixEnabled === true) {
      return noVulnerabilitiesAutoFixPrompt
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
    // Set this.path when triggerScan is called
    if (this.path !== path) {
      this.path = path
      this.reset()
      logInfo(`Reset service state for new path in triggerScan`, { path })
    }

    this.gqlClient = gqlClient
    if (!this.intervalId) {
      this.startPeriodicScanning(path)
      this.executeInitialScan(path)
      void this.executeInitialFullScan(path)
    }
  }

  private startPeriodicScanning(path: string): void {
    const scanContext = ScanContext.BACKGROUND_PERIODIC
    logDebug(
      `[${scanContext}] Starting periodic scan for new security vulnerabilities`,
      {
        path,
      }
    )

    this.intervalId = setInterval(() => {
      logDebug(`[${scanContext}] Triggering periodic security scan`, { path })
      this.scanForSecurityVulnerabilities({
        path,
        scanContext,
      }).catch((error) => {
        logError(`[${scanContext}] Error during periodic security scan`, {
          error,
        })
      })
    }, MCP_PERIODIC_CHECK_INTERVAL)
  }

  private async executeInitialFullScan(path: string): Promise<void> {
    const scanContext = ScanContext.FULL_SCAN
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
        scanContext: ScanContext.FULL_SCAN,
      })
      // Only update the class member and configstore after successful scan completion
      if (!this.fullScanPathsScanned.includes(path)) {
        this.fullScanPathsScanned.push(path)
        configStore.set('fullScanPathsScanned', this.fullScanPathsScanned)
      }
      logInfo(`[${scanContext}] Full scan completed`, { path })
    } catch (error) {
      logError(`[${scanContext}] Error during initial full security scan`, {
        error,
      })
    }
  }

  private executeInitialScan(path: string): void {
    const scanContext = ScanContext.BACKGROUND_INITIAL
    logDebug(`[${scanContext}] Triggering initial security scan`, { path })

    this.scanForSecurityVulnerabilities({
      path,
      scanContext: ScanContext.BACKGROUND_INITIAL,
    }).catch((error) => {
      logError(`[${scanContext}] Error during initial security scan`, { error })
    })
  }

  private generateFreshFixesResponse(
    scanContext: ScanContext = ScanContext.USER_REQUEST
  ): string {
    // Extract up to 3 fixes from the front of the array
    const freshFixes = this.freshFixes.splice(0, MCP_DEFAULT_LIMIT)

    if (freshFixes.length > 0) {
      logInfo(
        `[${scanContext}] Reporting ${freshFixes.length} fresh fixes to user`
      )
      this.reportedFixes.push(...freshFixes)
      return freshFixesPrompt({
        fixes: freshFixes,
        limit: MCP_DEFAULT_LIMIT,
        gqlClient: this.gqlClient!,
      })
    }
    logInfo(`[${scanContext}] No fresh fixes to report`)

    return noFreshFixesPrompt
  }

  private generateAppliedFixesResponse(
    scanContext: ScanContext = ScanContext.USER_REQUEST
  ): string {
    // Show all applied fixes from reportedFixes (no limit since this is a summary)
    const appliedFixesToShow = this.reportedFixes

    if (appliedFixesToShow.length > 0) {
      logInfo(
        `[${scanContext}] Reporting ${appliedFixesToShow.length} applied fixes to user`
      )
      return appliedFixesSummaryPrompt({
        fixes: appliedFixesToShow,
        gqlClient: this.gqlClient!,
      })
    }
    logInfo(`[${scanContext}] No applied fixes to report`)

    return noFreshFixesPrompt
  }
}
