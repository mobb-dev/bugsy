import {
  FixDownloadSource,
  FixQuestionInputType,
} from '../../../features/analysis/scm/generates/client_generates'
import { ScanContext } from '../../../types'
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
import { PatchApplicationService } from '../../services/PatchApplicationService'
import { scanFiles } from '../../services/ScanFiles'
import { createMcpLoginContext } from '../../services/types'
import { McpFix, McpFixSchema } from '../../types'

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
      // Whether a fresh scan ran this call (vs. paging a stored report) —
      // used to log RISK_DETECTED only for new scan results.
      let didScan = false

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
        didScan = true
      } else {
        logInfo('Using stored fixReportId')
      }

      // Use the provided offset when defined; otherwise fallback to currentOffset or 0.
      const effectiveOffset: number = offset ?? (this.currentOffset || 0)
      const effectiveLimit: number = limit ?? MCP_DEFAULT_LIMIT
      logDebug('effectiveOffset', { effectiveOffset })

      const fixes = await this.getReportFixes({
        fixReportId,
        offset: effectiveOffset,
        limit: effectiveLimit,
      })

      // Only store fixReportId if fixes were found
      logInfo(`Found ${fixes.totalCount} fixes`)

      // MVS activity log (best-effort), only when fixes were actually
      // surfaced — an empty result isn't a meaningful "fixes viewed" row (and
      // the scan itself is already recorded server-side as a SCAN event).
      // A fresh scan that surfaced fixes is a RISK_DETECTED with the vuln
      // count; viewing the first page of fixes is FIXES_VIEWED. Only on the
      // first page so pagination doesn't double-log.
      if (fixReportId && effectiveOffset === 0 && fixes.totalCount > 0) {
        if (didScan) {
          await this.gqlClient.logMvsEvent({
            eventType: 'RISK_DETECTED',
            fixReportId,
            riskCount: fixes.totalCount,
          })
        }
        await this.gqlClient.logMvsEvent({
          eventType: 'FIXES_VIEWED',
          fixReportId,
          // Count of fixes shown, so the Event Log row mirrors Fixable Issues
          // Detected ("N issues"). Not summed into the Fixable Issues KPI,
          // which only counts RISK_DETECTED.
          riskCount: fixes.totalCount,
        })
      }

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
        interactiveFixes: fixes.interactiveFixes,
        repositoryPath,
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
    const loginContext = createMcpLoginContext('scan_vulnerabilities')
    const gqlClient = await createAuthenticatedMcpGQLClient({ loginContext })

    const isConnected = await gqlClient.verifyApiConnection()
    if (!isConnected) {
      throw new ApiConnectionError(
        'Failed to connect to the API. Please check your MOBB_API_KEY'
      )
    }

    this.gqlClient = gqlClient
    return gqlClient
  }

  private async getReportFixes({
    fixReportId,
    offset,
    limit,
  }: {
    fixReportId: string
    offset?: number
    limit?: number
  }): Promise<{
    fixes: McpFix[]
    totalCount: number
    interactiveFixes: McpFix[]
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
      interactiveFixes: fixes?.interactiveFixes || [],
    }
  }

  /** Applies patches from interactiveAnswers only (no scan). */
  public async applyInteractiveAnswers({
    interactiveAnswers,
    repositoryPath,
  }: {
    interactiveAnswers: {
      fixId: string
      answers: { key: string; value: string }[]
    }[]
    repositoryPath: string
  }): Promise<string> {
    this.gqlClient = await this.initializeGqlClient()

    logInfo(
      `Applying ${interactiveAnswers.length} interactive fix(es) with LLM-supplied answers`,
      { repositoryPath }
    )

    const applied: AppliedEntry[] = []
    const failed: { fixId: string; reason: string }[] = []
    const skipped: SkippedEntry[] = []

    for (const entry of interactiveAnswers) {
      try {
        const { fixData } = await this.gqlClient.getFixWithAnswers({
          fixId: entry.fixId,
          answers: entry.answers,
        })

        if (!fixData) {
          failed.push({
            fixId: entry.fixId,
            reason: 'Fix not found on the server (may have expired)',
          })
          continue
        }

        if (fixData.__typename !== 'FixData') {
          failed.push({
            fixId: entry.fixId,
            reason: `Backend returned ${fixData.__typename} — could not produce a patch with the supplied answers`,
          })
          continue
        }

        if (!fixData.patch) {
          failed.push({
            fixId: entry.fixId,
            reason:
              'Backend returned FixData with no patch — answers did not yield an applicable fix',
          })
          continue
        }

        // Guardrail: skip the fix if any SELECT value we sent isn't in the
        // question's options[]. Backend would otherwise fall back to its
        // default sanitizer and produce a clean-applying but wrong patch.
        const sentByKey = new Map(entry.answers.map((a) => [a.key, a.value]))
        const invalidSelectAnswers: {
          key: string
          sentValue: string
          options: string[]
        }[] = []
        for (const q of fixData.questions) {
          if (q.inputType !== FixQuestionInputType.Select) continue
          const sentValue = sentByKey.get(q.key)
          if (sentValue === undefined) continue
          if (!q.options.includes(sentValue)) {
            invalidSelectAnswers.push({
              key: q.key,
              sentValue,
              options: [...q.options],
            })
          }
        }
        if (invalidSelectAnswers.length > 0) {
          skipped.push({
            fixId: entry.fixId,
            invalidSelectAnswers,
          })
          continue
        }

        // Question keys we didn't send — either true cascading or a
        // wrong-key fallback (camelCase vs snake_case). Surface as a hint.
        const newPendingKeys = fixData.questions
          .map((q) => q.key)
          .filter((k) => !sentByKey.has(k))

        const mcpFix = McpFixSchema.parse({
          __typename: 'fix',
          id: entry.fixId,
          confidence: 0,
          safeIssueType: null,
          safeIssueLanguage: null,
          severityText: null,
          severityValue: null,
          vulnerabilityReportIssues: [],
          patchAndQuestions: fixData,
        })

        const result = await PatchApplicationService.applyFixes({
          fixes: [mcpFix],
          repositoryPath,
          gqlClient: this.gqlClient,
          scanContext: ScanContext.USER_REQUEST,
          downloadSource: FixDownloadSource.Mcp,
        })

        if (result.appliedFixes.length > 0) {
          const targetFile = extractTargetFile(fixData.patch) ?? 'unknown file'
          applied.push({
            fixId: entry.fixId,
            targetFile,
            newPendingKeys,
          })
        } else {
          failed.push({
            fixId: entry.fixId,
            reason: result.failedFixes[0]?.error ?? 'patch application failed',
          })
        }
      } catch (error) {
        failed.push({
          fixId: entry.fixId,
          reason: (error as Error).message,
        })
      }
    }

    return formatApplyAnswersSummary({ applied, failed, skipped })
  }
}

type AppliedEntry = {
  fixId: string
  targetFile: string
  newPendingKeys: string[]
}

type SkippedEntry = {
  fixId: string
  invalidSelectAnswers: {
    key: string
    sentValue: string
    options: string[]
  }[]
}

function extractTargetFile(patch: string): string | null {
  const match = patch.match(/^\+\+\+ b\/(.+)$/m)
  return match?.[1] ?? null
}

function formatApplyAnswersSummary({
  applied,
  failed,
  skipped,
}: {
  applied: AppliedEntry[]
  failed: { fixId: string; reason: string }[]
  skipped: SkippedEntry[]
}): string {
  const sections: string[] = []

  if (applied.length > 0) {
    sections.push(
      `## ✅ Applied ${applied.length} fix${applied.length === 1 ? '' : 'es'}\n\n` +
        applied
          .map((a) => {
            const hint =
              a.newPendingKeys.length > 0
                ? `\n  ⚠️ The backend returned additional question key(s) we didn't send: [${a.newPendingKeys
                    .map((k) => `\`${k}\``)
                    .join(
                      ', '
                    )}]. This is either (a) a true cascading question — re-call \`scan_and_fix_vulnerabilities\` with those added to \`interactiveAnswers\` if you have a confident answer; or (b) the key we sent was wrong (e.g. camelCase vs snake_case) and the backend fell back to its default — copy the echoed key verbatim and retry. The patch above was already applied using defaults.`
                : ''
            return `- **\`${a.fixId}\`** → \`${a.targetFile}\`${hint}`
          })
          .join('\n')
    )
  }

  if (skipped.length > 0) {
    sections.push(
      `## ⏭️ Skipped ${skipped.length} fix${skipped.length === 1 ? '' : 'es'} — invalid SELECT answer value(s)\n\n` +
        skipped
          .map((s) => {
            const detail = s.invalidSelectAnswers
              .map(
                (a) =>
                  `\`${a.key}\` got \`"${a.sentValue}"\` — allowed options: [${a.options
                    .map((o) => `\`"${o}"\``)
                    .join(', ')}]`
              )
              .join('; ')
            return `- **\`${s.fixId}\`** — ${detail}\n  The file was **not modified**. Re-call \`scan_and_fix_vulnerabilities\` with one of the exact allowed option strings (copy character-for-character, no commentary appended) or omit this fix entirely if no option is justified by the code.`
          })
          .join('\n') +
        `\n\nThis guardrail exists to prevent the backend from silently falling back to its default sanitizer for an answer it didn't recognize — which could apply a semantically-wrong patch and break legitimate code paths.`
    )
  }

  if (failed.length > 0) {
    sections.push(
      `## ❌ Failed\n\n` +
        failed.map((f) => `- **\`${f.fixId}\`** — ${f.reason}`).join('\n')
    )
  }

  if (sections.length === 0) {
    return 'No fixes were processed.'
  }

  return sections.join('\n\n')
}
