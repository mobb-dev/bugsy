import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import fs from 'fs/promises'
import parseDiff from 'parse-diff'
import path from 'path'

import { MCP_AUTO_FIX_DEBUG_MODE } from '../core/configs'
import { logDebug, logError, logInfo, logWarn } from '../Logger'
import { McpFix } from '../types'
import { McpGQLClient } from './McpGQLClient'

export type PatchApplicationResult = {
  success: boolean
  appliedFixes: McpFix[]
  failedFixes: { fix: McpFix; error: string }[]
}

export class PatchApplicationService {
  /**
   * Gets the appropriate comment syntax for a file based on its extension
   */
  private static getCommentSyntax(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase()
    const basename = path.basename(filePath)

    // Map file extensions to comment syntax
    const commentMap: Record<string, string> = {
      // C-style languages (single line comments)
      '.js': '//',
      '.jsx': '//',
      '.mjs': '//',
      '.cjs': '//',
      '.ts': '//',
      '.tsx': '//',
      '.java': '//',
      '.c': '//',
      '.cpp': '//',
      '.cc': '//',
      '.cxx': '//',
      '.c++': '//',
      '.pcc': '//',
      '.tpp': '//',
      '.C': '//',
      '.h': '//',
      '.hpp': '//',
      '.hh': '//',
      '.hxx': '//',
      '.inl': '//',
      '.ipp': '//',
      '.cs': '//',
      '.php': '//',
      '.tpl': '//',
      '.phtml': '//',
      '.go': '//',
      '.rs': '//',
      '.swift': '//',
      '.kt': '//',
      '.kts': '//',
      '.ktm': '//',
      '.scala': '//',
      '.dart': '//',
      '.cls': '//', // Apex
      '.sol': '//', // Solidity
      '.move': '//', // Move
      '.hack': '//', // Hack
      '.hck': '//', // Hack
      '.jl': '//', // Julia
      '.proto': '//', // Protocol Buffers

      // Python-style languages
      '.py': '#',
      '.pyx': '#',
      '.pyi': '#',
      '.sh': '#',
      '.bash': '#',
      '.zsh': '#',
      '.fish': '#',
      '.pl': '#',
      '.pm': '#',
      '.rb': '#',
      '.r': '#',
      '.R': '#',
      '.yaml': '#',
      '.yml': '#',
      '.toml': '#',
      '.conf': '#',
      '.cfg': '#',
      '.ini': '#',
      '.dockerfile': '#',
      '.Dockerfile': '#',
      '.tf': '#', // Terraform
      '.tfvars': '#', // Terraform
      '.hcl': '#', // Terraform/HCL
      '.promql': '#', // PromQL
      '.cairo': '#', // Cairo
      '.circom': '#', // Circom

      // SQL
      '.sql': '--',

      // HTML/XML style
      '.html': '<!--',
      '.htm': '<!--',
      '.xml': '<!--',
      '.plist': '<!--',
      '.xhtml': '<!--',
      '.svg': '<!--',
      '.vue': '<!--', // Vue templates

      // CSS
      '.css': '/*',
      '.less': '//',
      '.scss': '//',
      '.sass': '//',

      // Other scripting
      '.lua': '--',
      '.vim': '"',
      '.vimrc': '"',
      '.ql': '//', // QL
      '.qll': '//', // QL

      // Assembly
      '.asm': ';',
      '.s': ';',

      // Batch/PowerShell
      '.bat': 'REM',
      '.cmd': 'REM',
      '.ps1': '#',

      // Functional languages
      '.hs': '--',
      '.lhs': '--',
      '.elm': '--',
      '.ml': '(*',
      '.mli': '(*',
      '.fs': '//',
      '.fsx': '//',
      '.fsi': '//',

      // Lisp family
      '.lisp': ';',
      '.lsp': ';',
      '.cl': ';',
      '.el': ';', // Emacs Lisp
      '.scm': ';',
      '.ss': ';',
      '.clj': ';',
      '.cljs': ';',
      '.cljc': ';',
      '.edn': ';', // Clojure EDN

      // Configuration files
      '.properties': '#',
      '.gitignore': '#',
      '.env': '#',
      '.editorconfig': '#',
      '.ex': '#', // Elixir
      '.exs': '#', // Elixir
      '.json': '//', // JSON (though rarely commented)
      '.ipynb': '#', // Jupyter notebooks (JSON-based)
      '.jsonnet': '//', // Jsonnet
      '.libsonnet': '//', // Jsonnet
      Dockerfile: '#', // Docker files without extension

      // Default fallback
      '': '//',
    }

    // Check for specific filename patterns first (for files without extensions)
    if (commentMap[basename]) {
      return commentMap[basename]
    }

    return commentMap[ext] || commentMap[''] || '//'
  }

  /**
   * Writes content to a file and adds Mobb fix comment in debug mode
   */
  private static writeFileWithFixComment({
    filePath,
    repositoryPath,
    content,
    fix,
    scanContext,
  }: {
    filePath: string
    repositoryPath: string
    content: string
    fix: McpFix
    scanContext: string
  }): string {
    const { normalizedPath: normalizedFilePath } = this.resolvePathWithinRepo({
      repositoryPath,
      targetPath: filePath,
    })

    let finalContent = content

    if (MCP_AUTO_FIX_DEBUG_MODE) {
      // Add Mobb security fix comment at the bottom
      const fixType = fix.safeIssueType || 'Security Issue'

      const commentPrefix = this.getCommentSyntax(filePath)

      // Check if the last line is already a Mobb fix comment
      const lines = content.split('\n')
      const lastLine = lines[lines.length - 1]?.trim() || ''
      const isMobbComment = lastLine.includes('Mobb security fix applied:')

      // Determine spacing: add empty line unless the last line is already a fix comment
      const spacing = isMobbComment ? '\n' : '\n\n'

      const fixComment = `Mobb security fix applied: ${fixType} ${fix.fixUrl || ''}`
      let comment: string
      if (commentPrefix === '<!--') {
        // HTML/XML style comment
        comment = `${spacing}<!-- ${fixComment} -->`
      } else if (commentPrefix === '/*') {
        // CSS style comment
        comment = `${spacing}/* ${fixComment} */`
      } else if (commentPrefix === '(*') {
        // OCaml style comment
        comment = `${spacing}(* ${fixComment} *)`
      } else {
        // Single line comment style
        comment = `${spacing}${commentPrefix} ${fixComment}`
      }

      finalContent = content + comment
      logInfo(
        `[${scanContext}] Debug mode: Adding fix comment to ${filePath}`,
        {
          fixId: fix.id,
          fixType,
          fixLink: fix.fixUrl,
          commentSyntax: commentPrefix,
          spacing: isMobbComment ? 'single line' : 'empty line above',
        }
      )
    }

    // Ensure parent directories exist before writing the file
    const dirPath = path.dirname(normalizedFilePath)
    mkdirSync(dirPath, { recursive: true })

    writeFileSync(normalizedFilePath, finalContent, 'utf8')
    return normalizedFilePath
  }

  private static resolvePathWithinRepo({
    repositoryPath,
    targetPath,
  }: {
    repositoryPath: string
    targetPath: string
  }): { repoRoot: string; normalizedPath: string; relativePath: string } {
    const repoRoot = path.resolve(repositoryPath)
    const normalizedPath = path.resolve(repoRoot, targetPath)
    const repoRootWithSep = repoRoot.endsWith(path.sep)
      ? repoRoot
      : `${repoRoot}${path.sep}`

    if (
      normalizedPath !== repoRoot &&
      !normalizedPath.startsWith(repoRootWithSep)
    ) {
      throw new Error(
        `Security violation: target path ${targetPath} resolves outside repository`
      )
    }

    return {
      repoRoot,
      normalizedPath,
      relativePath: path.relative(repoRoot, normalizedPath),
    }
  }

  /**
   * Extracts target file path from a fix
   */
  private static getFixTargetFile(fix: McpFix): string | null {
    if (fix.patchAndQuestions?.__typename !== 'FixData') {
      return null
    }
    const patch = fix.patchAndQuestions.patch
    if (!patch) return null

    // Extract file path from patch
    const match = patch.match(/^\+\+\+ b\/(.+)$/m)
    return match?.[1] || null
  }

  /**
   * Groups fixes by target file and returns ranked fixes with fallback options
   */
  private static selectBestFixesPerFile(fixes: McpFix[]): {
    fileFixGroups: Map<string, McpFix[]>
    standaloneFixesFixes: McpFix[]
  } {
    const fileToFixMap = new Map<string, McpFix[]>()
    const standaloneFixesFixes: McpFix[] = []

    // Group fixes by target file
    for (const fix of fixes) {
      const targetFile = this.getFixTargetFile(fix)
      if (!targetFile) {
        standaloneFixesFixes.push(fix) // Include fixes that don't target specific files
        continue
      }

      if (!fileToFixMap.has(targetFile)) {
        fileToFixMap.set(targetFile, [])
      }
      const fixes = fileToFixMap.get(targetFile)
      if (fixes) {
        fixes.push(fix)
      }
    }

    // Sort fixes within each file group by severity (highest first)
    for (const [_targetFile, fileFixes] of fileToFixMap) {
      fileFixes.sort((a, b) => (b.severityValue ?? 0) - (a.severityValue ?? 0))
    }

    return { fileFixGroups: fileToFixMap, standaloneFixesFixes }
  }

  /**
   * Processes invalid fixes from file modification checks
   */
  private static processInvalidFixes(
    invalidFixes: { fix: McpFix; reason: string }[],
    failedFixes: { fix: McpFix; error: string }[],
    scanContext: string
  ): void {
    if (invalidFixes.length === 0) return

    // Log individual warning for each invalid fix
    for (const invalidFix of invalidFixes) {
      logWarn(
        `[${scanContext}] Patch ${invalidFix.fix.id} not applied - file modified after scan`,
        {
          fixId: invalidFix.fix.id,
          issueType: invalidFix.fix.safeIssueType,
          severity: invalidFix.fix.severityText,
          severityValue: invalidFix.fix.severityValue,
          confidence: invalidFix.fix.confidence,
          reason: invalidFix.reason,
        }
      )
    }

    logInfo(
      `[${scanContext}] Discarded ${invalidFixes.length} fixes due to file modifications after scan`,
      {
        discardedFixes: invalidFixes.map((f) => ({
          fixId: f.fix.id,
          reason: f.reason,
        })),
      }
    )

    // Add to failed fixes for reporting
    failedFixes.push(
      ...invalidFixes.map((f) => ({ fix: f.fix, error: f.reason }))
    )
  }

  /**
   * Applies standalone fixes (fixes that don't target specific files)
   */
  private static async applyStandaloneFixes({
    fixes,
    repositoryPath,
    appliedFixes,
    failedFixes,
    scanContext,
  }: {
    fixes: McpFix[]
    repositoryPath: string
    appliedFixes: McpFix[]
    failedFixes: { fix: McpFix; error: string }[]
    scanContext: string
  }): Promise<void> {
    for (const fix of fixes) {
      try {
        const result = await this.applySingleFix({
          fix,
          repositoryPath,
          scanContext,
        })
        if (result.success) {
          appliedFixes.push(fix)
          logInfo(
            `[${scanContext}] Successfully applied standalone fix ${fix.id}`,
            {
              issueType: fix.safeIssueType,
              severity: fix.severityText,
            }
          )
        } else {
          failedFixes.push({ fix, error: result.error || 'Unknown error' })
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`[${scanContext}] Failed to apply standalone fix ${fix.id}`, {
          error: errorMessage,
          issueType: fix.safeIssueType,
        })
        failedFixes.push({ fix, error: errorMessage })
      }
    }
  }

  /**
   * Attempts to apply a single fix and handles the result
   */
  private static async attemptFixApplication({
    fix,
    targetFile,
    attemptNumber,
    totalAttempts,
    repositoryPath,
    scanContext,
  }: {
    fix: McpFix
    targetFile: string
    attemptNumber: number
    totalAttempts: number
    repositoryPath: string
    scanContext: string
  }): Promise<{ success: boolean; error?: string }> {
    logInfo(
      `[${scanContext}] Attempting fix ${fix.id} for ${targetFile} (priority ${attemptNumber}/${totalAttempts})`,
      {
        issueType: fix.safeIssueType,
        severity: fix.severityText,
        severityValue: fix.severityValue,
      }
    )

    try {
      const result = await this.applySingleFix({
        fix,
        repositoryPath,
        scanContext,
      })
      if (result.success) {
        logInfo(
          `[${scanContext}] Successfully applied fix ${fix.id} to ${targetFile}`,
          {
            issueType: fix.safeIssueType,
            severity: fix.severityText,
            attemptNumber,
          }
        )
        return { success: true }
      } else {
        logInfo(
          `[${scanContext}] Fix ${fix.id} failed for ${targetFile}, trying next option if available`,
          {
            error: result.error,
            attemptNumber,
            remainingOptions: totalAttempts - attemptNumber,
          }
        )
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logInfo(
        `[${scanContext}] Fix ${fix.id} threw exception for ${targetFile}, trying next option if available`,
        {
          error: errorMessage,
          issueType: fix.safeIssueType,
          attemptNumber,
          remainingOptions: totalAttempts - attemptNumber,
        }
      )
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Applies fixes for a specific file with fallback logic
   */
  private static async applyFixesForFile({
    targetFile,
    rankedFixes,
    repositoryPath,
    appliedFixes,
    failedFixes,
    skippedFixes,
    scanContext,
  }: {
    targetFile: string
    rankedFixes: McpFix[]
    repositoryPath: string
    appliedFixes: McpFix[]
    failedFixes: { fix: McpFix; error: string }[]
    skippedFixes: { fix: McpFix; reason: string }[]
    scanContext: string
  }): Promise<void> {
    let appliedForFile = false

    for (let i = 0; i < rankedFixes.length; i++) {
      const fix = rankedFixes[i]
      if (!fix) continue

      if (appliedForFile) {
        // Skip remaining fixes for this file since we already applied one successfully
        const reason = `Another fix was already successfully applied to ${targetFile}`
        skippedFixes.push({
          fix,
          reason,
        })

        // Log individual warning for each skipped patch
        logWarn(
          `[${scanContext}] Patch ${fix.id} not applied - file already patched`,
          {
            fixId: fix.id,
            targetFile,
            issueType: fix.safeIssueType,
            severity: fix.severityText,
            severityValue: fix.severityValue,
            reason,
            confidence: fix.confidence,
          }
        )
        continue
      }

      const result = await this.attemptFixApplication({
        fix,
        targetFile,
        attemptNumber: i + 1,
        totalAttempts: rankedFixes.length,
        repositoryPath,
        scanContext,
      })

      if (result.success) {
        appliedFixes.push(fix)
        appliedForFile = true
      } else {
        // Only add to failed fixes if this was the last option for the file
        if (i === rankedFixes.length - 1) {
          failedFixes.push({ fix, error: result.error || 'Unknown error' })
        }
      }
    }
  }

  /**
   * Applies fixes grouped by file with fallback logic
   */
  private static async applyFileGroupFixes({
    fileFixGroups,
    repositoryPath,
    appliedFixes,
    failedFixes,
    skippedFixes,
    scanContext,
  }: {
    fileFixGroups: Map<string, McpFix[]>
    repositoryPath: string
    appliedFixes: McpFix[]
    failedFixes: { fix: McpFix; error: string }[]
    skippedFixes: { fix: McpFix; reason: string }[]
    scanContext: string
  }): Promise<void> {
    for (const [targetFile, rankedFixes] of fileFixGroups) {
      await this.applyFixesForFile({
        targetFile,
        rankedFixes,
        repositoryPath,
        appliedFixes,
        failedFixes,
        skippedFixes,
        scanContext,
      })
    }
  }

  /**
   * Logs skipped fixes as informational warnings
   */
  private static logSkippedFixes(
    skippedFixes: { fix: McpFix; reason: string }[],
    scanContext: string
  ): void {
    if (skippedFixes.length === 0) return

    logWarn(
      `[${scanContext}] ${skippedFixes.length} fixes skipped because other fixes were successfully applied to their target files`,
      {
        skippedFixes: skippedFixes.map((f) => ({
          fixId: f.fix.id,
          reason: f.reason,
          severity: f.fix.severityText,
          issueType: f.fix.safeIssueType,
        })),
      }
    )
  }

  /**
   * Checks if target files have been modified since scan time
   */
  private static async checkFileModificationTimes({
    fixes,
    repositoryPath,
    scanStartTime,
    scanContext,
  }: {
    fixes: McpFix[]
    repositoryPath: string
    scanStartTime: number
    scanContext: string
  }): Promise<{
    validFixes: McpFix[]
    invalidFixes: { fix: McpFix; reason: string }[]
  }> {
    const validFixes: McpFix[] = []
    const invalidFixes: { fix: McpFix; reason: string }[] = []

    for (const fix of fixes) {
      const targetFile = this.getFixTargetFile(fix)
      if (!targetFile) {
        validFixes.push(fix) // Include fixes that don't target specific files
        continue
      }

      try {
        const absolutePath = path.resolve(repositoryPath, targetFile)
        if (existsSync(absolutePath)) {
          const stats = await fs.stat(absolutePath)
          const fileModTime = stats.mtime.getTime()

          if (fileModTime > scanStartTime) {
            logError(
              `[${scanContext}] Target file ${targetFile} was modified after scan started (file: ${new Date(fileModTime).toISOString()}, scan: ${new Date(scanStartTime).toISOString()})`
            )
            invalidFixes.push({
              fix,
              reason: `Target file ${targetFile} was modified after scan started (file: ${new Date(fileModTime).toISOString()}, scan: ${new Date(scanStartTime).toISOString()})`,
            })
          } else {
            validFixes.push(fix)
          }
        } else {
          validFixes.push(fix) // File doesn't exist, let normal patch logic handle it
        }
      } catch (error) {
        logError(
          `[${scanContext}] Error checking modification time for ${targetFile}`,
          {
            error: error instanceof Error ? error.message : String(error),
          }
        )
        validFixes.push(fix) // On error, proceed with patch
      }
    }

    return { validFixes, invalidFixes }
  }

  /**
   * Applies multiple patches to the repository
   */
  public static async applyFixes({
    fixes,
    repositoryPath,
    scanStartTime,
    gqlClient,
    scanContext,
  }: {
    fixes: McpFix[]
    repositoryPath: string
    scanStartTime?: number
    gqlClient?: McpGQLClient
    scanContext: string
  }): Promise<PatchApplicationResult> {
    const appliedFixes: McpFix[] = []
    const failedFixes: { fix: McpFix; error: string }[] = []
    const skippedFixes: { fix: McpFix; reason: string }[] = []

    // Resolve the repository path to eliminate symlink prefixes
    const resolvedRepoPath = await fs.realpath(repositoryPath)

    logInfo(
      `[${scanContext}] Starting patch application for ${fixes.length} fixes`,
      {
        repositoryPath,
        resolvedRepoPath,
        fixIds: fixes.map((f) => f.id),
        scanStartTime: scanStartTime
          ? new Date(scanStartTime).toISOString()
          : 'not provided',
      }
    )

    // Protection 1: Check file modification times
    let processedFixes = fixes
    if (scanStartTime) {
      const { validFixes, invalidFixes } =
        await this.checkFileModificationTimes({
          fixes,
          repositoryPath: resolvedRepoPath,
          scanStartTime,
          scanContext,
        })

      this.processInvalidFixes(invalidFixes, failedFixes, scanContext)
      processedFixes = validFixes
    }

    // Protection 2: Group fixes by file and rank them by severity
    const { fileFixGroups, standaloneFixesFixes } =
      this.selectBestFixesPerFile(processedFixes)

    logInfo(
      `[${scanContext}] Grouped fixes: ${standaloneFixesFixes.length} standalone fixes, ${fileFixGroups.size} file groups`,
      {
        originalCount: fixes.length,
        totalFixesToApply: standaloneFixesFixes.length + fileFixGroups.size,
      }
    )

    // Apply standalone fixes (fixes that don't target specific files)
    await this.applyStandaloneFixes({
      fixes: standaloneFixesFixes,
      repositoryPath: resolvedRepoPath,
      appliedFixes,
      failedFixes,
      scanContext,
    })

    // Apply fixes for each file group with fallback logic
    await this.applyFileGroupFixes({
      fileFixGroups,
      repositoryPath: resolvedRepoPath,
      appliedFixes,
      failedFixes,
      skippedFixes,
      scanContext,
    })

    // Log skipped fixes as informational warnings
    this.logSkippedFixes(skippedFixes, scanContext)

    logInfo(`[${scanContext}] Patch application completed`, {
      total: fixes.length,
      applied: appliedFixes.length,
      failed: failedFixes.length,
      skipped: skippedFixes.length,
    })

    // Update download status for successfully applied fixes
    if (appliedFixes.length > 0 && gqlClient) {
      try {
        const appliedFixIds = appliedFixes.map((fix) => fix.id).filter(Boolean)
        await gqlClient.updateAutoAppliedFixesStatus(appliedFixIds)
        logDebug(
          `[${scanContext}] Successfully updated download status for auto-applied fixes`,
          {
            appliedFixIds,
            count: appliedFixIds.length,
          }
        )
      } catch (error) {
        logError(
          `[${scanContext}] Failed to update download status for auto-applied fixes`,
          {
            error: error instanceof Error ? error.message : String(error),
            appliedFixCount: appliedFixes.length,
          }
        )
      }
    }

    return {
      success: appliedFixes.length > 0,
      appliedFixes,
      failedFixes,
    }
  }

  /**
   * Validates fix data and returns patch content
   */
  private static validateFixData(
    fix: McpFix,
    scanContext: string
  ): {
    success: boolean
    patch?: string
    error?: string
  } {
    if (fix.patchAndQuestions?.__typename !== 'FixData') {
      const error = 'Fix does not contain patch data'
      logError(`[${scanContext}] Fix ${fix.id} does not contain patch data`)
      return { success: false, error }
    }

    const patch = fix.patchAndQuestions.patch
    if (!patch) {
      const error = 'Fix has empty patch content'
      logError(`[${scanContext}] Fix ${fix.id} has empty patch content`)
      return { success: false, error }
    }

    return { success: true, patch }
  }

  /**
   * Logs patch application information with error handling
   */
  private static logPatchInfo(
    fix: McpFix,
    patch: string,
    targetFiles: string[],
    scanContext: string
  ): void {
    try {
      logInfo(`[${scanContext}] Applying patch for fix ${fix.id}`, {
        fixType: fix.safeIssueType,
        severity: fix.severityText,
        confidence: fix.confidence,
        targetFiles,
        patchLength: patch.length,
        patchPreview:
          patch.substring(0, 200) + (patch.length > 200 ? '...' : ''),
        description:
          fix.patchAndQuestions.__typename === 'FixData'
            ? fix.patchAndQuestions.extraContext?.fixDescription
            : undefined,
      })
    } catch (logError) {
      // If logging fails due to circular reference, log a simpler message
      logInfo(
        `[${scanContext}] Applying patch for fix ${fix.id} - fixType: ${fix.safeIssueType}`
      )
    }
  }

  /**
   * Parses a patch and validates it contains changes
   */
  private static parsePatchSafely({
    patch,
    fixId,
    scanContext,
  }: {
    patch: string
    fixId: string
    scanContext: string
  }): parseDiff.File[] {
    const parsedPatch = parseDiff(patch)

    if (!parsedPatch || parsedPatch.length === 0) {
      throw new Error('Failed to parse patch - no changes found')
    }

    logDebug(`[${scanContext}] Parsed patch for fix ${fixId}`, {
      filesCount: parsedPatch.length,
      files: parsedPatch.map((f) => ({
        from: f.from,
        to: f.to,
        deletions: f.deletions,
        additions: f.additions,
      })),
    })

    return parsedPatch
  }

  /**
   * Resolves file paths for patch application
   */
  private static resolveFilePaths({
    targetFile,
    repositoryPath,
    scanContext,
  }: {
    targetFile: string
    repositoryPath: string
    scanContext: string
  }): { absoluteFilePath: string; relativePath: string } {
    const {
      repoRoot,
      normalizedPath: absoluteFilePath,
      relativePath,
    } = this.resolvePathWithinRepo({
      repositoryPath,
      targetPath: targetFile,
    })

    logDebug(`[${scanContext}] Resolving file path for ${targetFile}`, {
      repositoryPath: repoRoot,
      targetFile,
      absoluteFilePath,
      relativePath,
      exists: existsSync(absoluteFilePath),
    })

    return { absoluteFilePath, relativePath }
  }

  /**
   * Handles file creation from patch
   */
  private static handleFileCreation({
    fileDiff,
    absoluteFilePath,
    relativePath,
    repositoryPath,
    fix,
    appliedFiles,
    scanContext,
  }: {
    fileDiff: parseDiff.File
    absoluteFilePath: string
    relativePath: string
    repositoryPath: string
    fix: McpFix
    appliedFiles: string[]
    scanContext: string
  }): void {
    const newContent = this.applyHunksToEmptyFile(fileDiff.chunks)
    const actualPath = this.writeFileWithFixComment({
      filePath: absoluteFilePath,
      repositoryPath,
      content: newContent,
      fix,
      scanContext,
    })
    appliedFiles.push(path.relative(repositoryPath, actualPath))
    logDebug(`[${scanContext}] Created new file: ${relativePath}`)
  }

  /**
   * Handles file deletion from patch
   */
  private static handleFileDeletion({
    absoluteFilePath,
    relativePath,
    appliedFiles,
    scanContext,
  }: {
    absoluteFilePath: string
    relativePath: string
    appliedFiles: string[]
    scanContext: string
  }): void {
    if (existsSync(absoluteFilePath)) {
      unlinkSync(absoluteFilePath)
      appliedFiles.push(relativePath)
      logDebug(`[${scanContext}] Deleted file: ${relativePath}`)
    }
  }

  /**
   * Handles file modification from patch
   */
  private static handleFileModification({
    fileDiff,
    absoluteFilePath,
    relativePath,
    targetFile,
    repositoryPath,
    fix,
    appliedFiles,
    scanContext,
  }: {
    fileDiff: parseDiff.File
    absoluteFilePath: string
    relativePath: string
    targetFile: string
    repositoryPath: string
    fix: McpFix
    appliedFiles: string[]
    scanContext: string
  }): void {
    if (!existsSync(absoluteFilePath)) {
      throw new Error(
        `Target file does not exist: ${targetFile} (resolved to: ${absoluteFilePath})`
      )
    }

    const originalContent = readFileSync(absoluteFilePath, 'utf8')
    const modifiedContent = this.applyHunksToFile(
      originalContent,
      fileDiff.chunks
    )

    if (modifiedContent !== originalContent) {
      const actualPath = this.writeFileWithFixComment({
        filePath: absoluteFilePath,
        repositoryPath,
        content: modifiedContent,
        fix,
        scanContext,
      })
      appliedFiles.push(path.relative(repositoryPath, actualPath))
      logDebug(`[${scanContext}] Modified file: ${relativePath}`)
    }
  }

  /**
   * Processes a single file diff from a parsed patch
   */
  private static processFileDiff({
    fileDiff,
    repositoryPath,
    fix,
    appliedFiles,
    scanContext,
  }: {
    fileDiff: parseDiff.File
    repositoryPath: string
    fix: McpFix
    appliedFiles: string[]
    scanContext: string
  }): void {
    const targetFile = fileDiff.to || fileDiff.from
    if (!targetFile || targetFile === '/dev/null') {
      return
    }

    const { absoluteFilePath, relativePath } = this.resolveFilePaths({
      targetFile,
      repositoryPath,
      scanContext,
    })

    // Check if this is a file creation, deletion, or modification
    if (fileDiff.from === '/dev/null') {
      // File creation
      this.handleFileCreation({
        fileDiff,
        absoluteFilePath,
        relativePath,
        repositoryPath,
        fix,
        appliedFiles,
        scanContext,
      })
    } else if (fileDiff.to === '/dev/null') {
      // File deletion
      this.handleFileDeletion({
        absoluteFilePath,
        relativePath,
        appliedFiles,
        scanContext,
      })
    } else {
      // File modification
      this.handleFileModification({
        fileDiff,
        absoluteFilePath,
        relativePath,
        targetFile,
        repositoryPath,
        fix,
        appliedFiles,
        scanContext,
      })
    }
  }

  /**
   * Applies a single patch using git apply
   */
  private static async applySingleFix({
    fix,
    repositoryPath,
    scanContext,
  }: {
    fix: McpFix
    repositoryPath: string
    scanContext: string
  }): Promise<{ success: boolean; error?: string }> {
    // Validate fix data
    const validation = this.validateFixData(fix, scanContext)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }
    const patch = validation.patch!

    // Extract target files from patch
    let targetFiles: string[] = []
    try {
      targetFiles = this.extractTargetFilesFromPatch(patch)
    } catch (extractError) {
      logError(
        `[${scanContext}] Failed to extract target files from patch for fix ${fix.id}`,
        {
          error:
            extractError instanceof Error
              ? extractError.message
              : String(extractError),
        }
      )
    }

    // Log patch information
    this.logPatchInfo(fix, patch, targetFiles, scanContext)

    try {
      logDebug(`[${scanContext}] Applying patch in memory for fix ${fix.id}`, {
        repositoryPath,
        targetFiles,
      })

      // Parse the patch to understand what changes to make
      const parsedPatch = this.parsePatchSafely({
        patch,
        fixId: fix.id,
        scanContext,
      })

      // Apply changes to each file
      const appliedFiles: string[] = []
      for (const fileDiff of parsedPatch) {
        this.processFileDiff({
          fileDiff,
          repositoryPath,
          fix,
          appliedFiles,
          scanContext,
        })
      }

      logInfo(
        `[${scanContext}] In-memory patch application successful for fix ${fix.id}`,
        {
          appliedFiles,
          filesCount: appliedFiles.length,
        }
      )
      return { success: true }
    } catch (patchError) {
      const errorMessage =
        patchError instanceof Error ? patchError.message : String(patchError)

      logError(
        `[${scanContext}] In-memory patch application failed for fix ${fix.id}`,
        {
          errorMessage,
          patchErrorType:
            patchError instanceof Error ? patchError.name : typeof patchError,
          targetFiles,
        }
      )

      return {
        success: false,
        error: `Patch application failed: ${errorMessage}`,
      }
    }
  }

  /**
   * Extracts the file path from a git patch
   */
  public static extractPathFromPatch(patch?: string): string | null {
    if (!patch) return null
    const match = patch.match(/^diff --git a\/([^\s]+) b\//)
    return match?.[1] ?? null
  }

  /**
   * Extracts target file paths from a git patch
   */
  private static extractTargetFilesFromPatch(patch: string): string[] {
    const targetFiles: string[] = []
    const lines = patch.split('\n')

    for (const line of lines) {
      // Look for lines that start with "+++ b/" which indicate the target file
      if (line.startsWith('+++ b/')) {
        const filePath = line.substring(6) // Remove "+++ b/" prefix
        if (filePath && !targetFiles.includes(filePath)) {
          targetFiles.push(filePath)
        }
      }
      // Also look for "diff --git" lines as backup
      else if (line.startsWith('diff --git a/') && line.includes(' b/')) {
        const match = line.match(/diff --git a\/.+ b\/(.+)/)
        if (match?.[1] && !targetFiles.includes(match[1])) {
          targetFiles.push(match[1])
        }
      }
    }

    return targetFiles
  }

  /**
   * Apply hunks to an empty file (for file creation)
   */
  private static applyHunksToEmptyFile(
    chunks: { changes: { type: string; content: string }[] }[]
  ): string {
    const lines: string[] = []

    for (const chunk of chunks) {
      for (const change of chunk.changes) {
        if (change.type === 'add') {
          lines.push(change.content.substring(1)) // Remove the '+' prefix
        }
      }
    }

    return lines.join('\n')
  }

  /**
   * Apply hunks to an existing file content
   */
  private static applyHunksToFile(
    originalContent: string,
    chunks: {
      oldStart: number
      oldLines: number
      changes: { type: string; content: string }[]
    }[]
  ): string {
    const originalLines = originalContent.split('\n')
    const result = [...originalLines]

    // Sort chunks by old start line in reverse order to avoid line number shifts
    const sortedChunks = chunks.sort((a, b) => b.oldStart - a.oldStart)

    for (const chunk of sortedChunks) {
      const { oldStart, oldLines } = chunk
      const startIndex = oldStart - 1 // Convert to 0-based index

      // Collect the new lines for this chunk
      const newLines: string[] = []

      for (const change of chunk.changes) {
        if (change.type === 'add') {
          newLines.push(change.content.substring(1)) // Remove the '+' prefix
        } else if (change.type === 'normal') {
          newLines.push(change.content.substring(1)) // Remove the ' ' prefix
        }
        // Skip 'del' lines as they are being removed
      }

      // Replace the old lines with new lines
      result.splice(startIndex, oldLines, ...newLines)
    }

    return result.join('\n')
  }
}

// Mobb security fix applied: PT https://app.mobb.ai/fixes/a3169b73-f2d2-4ef0-bfac-ba1b21c1b821
