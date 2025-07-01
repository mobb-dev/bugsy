import {
  MCP_MAX_FILE_SIZE,
  MCP_PERIODIC_CHECK_INTERVAL,
} from '../../core/configs'
import {
  freshFixesPrompt,
  initialScanInProgressPrompt,
  noFreshFixesPrompt,
} from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { getLocalFiles, LocalFile } from '../../services/GetLocalFiles'
import { getMcpGQLClient } from '../../services/McpGQLClient'
import { scanFiles } from '../../services/ScanFiles'
import { McpFix } from '../../types'

function extractPathFromPatch(patch?: string): string | null {
  const match = patch?.match(/^diff --git a\/([^\s]+) b\//)
  return match?.[1] ?? null
}

/**
 * Placeholder service responsible for checking if new fixes have been generated
 * for a repository since the last time the user queried. The actual
 * implementation will be added in a future iteration once the backend API is
 * finalised.
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

  public static getInstance(): CheckForNewAvailableFixesService {
    if (!CheckForNewAvailableFixesService.instance) {
      CheckForNewAvailableFixesService.instance =
        new CheckForNewAvailableFixesService()
    }
    return CheckForNewAvailableFixesService.instance
  }

  /**
   * Resets any cached state so the service can be reused between independent
   * MCP sessions.
   */
  public reset(): void {
    this.filesLastScanned = {}
    this.freshFixes = []
    this.reportedFixes = []
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Stub implementation – in a future version this will query the backend for
   * the latest fixes count and compare it with the cached value. For now it
   * simply returns a placeholder string so that the tool can be wired into the
   * system and used in tests.
   */
  private async scan({ path }: { path: string }): Promise<void> {
    logInfo('Scanning for new fixes', { path })
    const gqlClient = await getMcpGQLClient()

    const isConnected = await gqlClient.verifyConnection()
    if (!isConnected) {
      logError('Failed to connect to the API, scan aborted')
      return
    }
    logInfo('Connected to the API, assebling list of files to scan', { path })
    const files = await getLocalFiles({
      path,
      maxFileSize: MCP_MAX_FILE_SIZE,
    })
    logInfo('Active files', { files })
    const filesToScan = files.filter((file) => {
      const lastScannedEditTime = this.filesLastScanned[file.fullPath]
      if (!lastScannedEditTime) {
        return true
      }
      return file.lastEdited > lastScannedEditTime
    })
    if (filesToScan.length === 0) {
      logInfo('No files to scan', { path })
      return
    }
    logInfo('Files to scan', { filesToScan })
    const { fixReportId, projectId } = await scanFiles(
      filesToScan.map((file) => file.relativePath),
      path,
      gqlClient
    )
    logInfo('Scan completed', { fixReportId, projectId })

    const fixes = await gqlClient.getReportFixesPaginated({
      reportId: fixReportId,
      offset: 0,
      limit: 1000,
    })

    const newFixes = fixes?.fixes?.filter((fix) => !this.isAlreadyReported(fix))

    logInfo('Fixes retrieved', {
      count: fixes?.fixes?.length || 0,
      newFixes: newFixes?.length || 0,
    })
    this.freshFixes = this.freshFixes
      .filter((fix) => !this.isFixFromOldScan(fix, filesToScan))
      .concat(newFixes || [])

    logInfo('Fresh fixes', { freshFixes: this.freshFixes })
    filesToScan.forEach((file) => {
      this.filesLastScanned[file.fullPath] = file.lastEdited
    })
    this.isInitialScanComplete = true
  }

  private isAlreadyReported(fix: McpFix): boolean {
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
    logInfo('isOldFix', {
      fixFile,
      filesToScan,
      isOldFix: filesToScan.some((file) => file.relativePath === fixFile),
    })
    return filesToScan.some((file) => file.relativePath === fixFile)
  }

  public async getFreshFixes({ path }: { path: string }): Promise<string> {
    if (this.path !== path) {
      this.path = path
      this.reset()
    }

    if (!this.intervalId) {
      logInfo('Starting periodic scan for new fixes', { path })
      this.intervalId = setInterval(() => {
        logDebug('Triggering periodic scan', { path })
        this.scan({ path }).catch((error) => {
          logError('Error during periodic scan', { error })
        })
      }, MCP_PERIODIC_CHECK_INTERVAL)

      logDebug('Triggering initial scan', { path })
      // Execute initial scan and suppress any errors to avoid unhandled rejections
      this.scan({ path }).catch((error) => {
        logError('Error during initial scan', { error })
      })
    }

    if (this.freshFixes.length > 0) {
      //pop 3 fixes from the front of the array
      const freshFixes = this.freshFixes.splice(0, 3)
      if (freshFixes.length > 0) {
        this.reportedFixes.concat(freshFixes)
        return freshFixesPrompt({ fixes: freshFixes })
      }
    }
    if (!this.isInitialScanComplete) {
      return initialScanInProgressPrompt
    }
    return noFreshFixesPrompt
  }
}
