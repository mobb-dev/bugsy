import fs from 'node:fs'
import path from 'node:path'

import { z } from 'zod'

import { IssueType_Enum } from '../../features/analysis/scm/generates/client_generates'
import { GitService } from '../../features/analysis/scm/services/GitService'
import { fixDetailsData } from '../../features/analysis/scm/shared/src/fixDetailsData'
import { logDebug, logError, logInfo } from '../Logger'
import { McpFix } from '../types'

/**
 * Extracts file path from a git patch string
 * @param patch Git patch content
 * @returns File path or null if not found
 */
function extractPathFromPatch(patch?: string): string | null {
  const match = patch?.match(/diff --git a\/([^\s]+) b\//)
  return match?.[1] ?? null
}

/**
 * Parses issue type string to enum using zod validation
 * @param issueType Issue type string
 * @returns Parsed result with success/failure status
 */
function parsedIssueTypeRes(issueType: string | undefined) {
  return z.nativeEnum(IssueType_Enum).safeParse(issueType)
}

export type FolderInfo = {
  path: string
  exists: boolean
  isDirectory: boolean
  size?: number
  filesCount?: number
}

export type FolderCreationResult = {
  success: boolean
  path: string
  error?: string
}

export type FolderOperationResult = {
  success: boolean
  message: string
  error?: string
}

export type SavePatchResult = {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
  message: string
}

export type LogPatchResult = {
  success: boolean
  filePath?: string
  error?: string
  message: string
}

/**
 * Service for handling local Mobb folder operations
 * Supports both git repositories and regular directories
 * - Git repositories: manages .gitignore entries and provides full git integration
 * - Non-git directories: skips git operations but provides all folder management functionality
 */
export class LocalMobbFolderService {
  private readonly defaultMobbFolderName = '.mobb'
  private readonly mobbIgnorePattern = '**/.mobb'
  private readonly repoPath: string
  private readonly gitService: GitService | null

  /**
   * Creates a new LocalMobbFolderService instance
   * @param repoPath Path to the repository or directory (supports both git and non-git)
   */
  constructor(repoPath: string) {
    this.repoPath = repoPath
    try {
      this.gitService = new GitService(
        repoPath,
        (message: string, level: string, data?: unknown) => {
          // Adapter to match our logging interface
          if (level === 'debug') {
            logDebug(message, data)
          } else if (level === 'info') {
            logInfo(message, data)
          } else if (level === 'error') {
            logError(message, data)
          }
        }
      )
    } catch (error) {
      // GitService creation failed - likely non-existent directory or invalid path
      // We'll handle this gracefully in the methods that use GitService
      logDebug('[LocalMobbFolderService] GitService initialization failed', {
        repoPath,
        error: String(error),
      })
      this.gitService = null // Will be handled when checking git repo status
    }
    logDebug('[LocalMobbFolderService] Service initialized', { repoPath })
  }

  /**
   * Gets or creates the .mobb folder in the repository path
   * For git repositories: ensures .gitignore exists and contains wildcard pattern to ignore .mobb folders
   * For non-git directories: skips gitignore functionality but creates .mobb folder normally
   * @returns Path to the .mobb folder
   * @throws Error if path validation fails or folder creation fails
   */
  private async getFolder(): Promise<string> {
    logDebug('[LocalMobbFolderService] Getting .mobb folder')

    try {
      // Check if this is a git repository
      const isGitRepo = this.gitService
        ? await this.gitService.isGitRepository()
        : false
      logDebug('[LocalMobbFolderService] Repository type detected', {
        isGitRepo,
      })

      if (isGitRepo && this.gitService) {
        // Git repository: handle .gitignore operations
        try {
          const gitRoot = await this.gitService.getGitRoot()
          logDebug('[LocalMobbFolderService] Git root found', { gitRoot })

          // Make sure .gitignore exists and contains wildcard pattern for .mobb folders
          const wasAdded = await this.gitService.ensureGitignoreEntry(
            this.mobbIgnorePattern
          )
          if (wasAdded) {
            logInfo(
              '[LocalMobbFolderService] Added .mobb wildcard pattern to .gitignore',
              {
                pattern: this.mobbIgnorePattern,
              }
            )
          } else {
            logDebug(
              '[LocalMobbFolderService] .mobb pattern already in .gitignore'
            )
          }
        } catch (gitError) {
          logDebug(
            '[LocalMobbFolderService] Git operations failed, treating as non-git repo',
            { gitError }
          )
          // Continue as non-git repo if git operations fail
        }
      } else {
        logInfo(
          '[LocalMobbFolderService] Non-git repository detected, skipping .gitignore operations'
        )
      }

      // Create .mobb folder in the repoPath (works for both git and non-git)
      const mobbFolderPath = path.join(
        this.repoPath,
        this.defaultMobbFolderName
      )
      if (!fs.existsSync(mobbFolderPath)) {
        logInfo('[LocalMobbFolderService] Creating .mobb folder', {
          mobbFolderPath,
        })
        fs.mkdirSync(mobbFolderPath, { recursive: true })
      } else {
        logDebug('[LocalMobbFolderService] .mobb folder already exists')
      }

      // Verify it's actually a directory
      const stats = fs.statSync(mobbFolderPath)
      if (!stats.isDirectory()) {
        throw new Error(`Path exists but is not a directory: ${mobbFolderPath}`)
      }

      // Return the path to .mobb folder
      logDebug('[LocalMobbFolderService] .mobb folder ready', {
        mobbFolderPath,
        repoPath: this.repoPath,
        isGitRepo,
      })
      return mobbFolderPath
    } catch (error) {
      const errorMessage = `Failed to get/create .mobb folder: ${error}`
      logError(errorMessage, { repoPath: this.repoPath, error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Public method to get or create the .mobb folder
   * This is the main entry point for accessing the Mobb folder
   * @returns Promise<string> Path to the .mobb folder
   */
  public async getMobbFolder(): Promise<string> {
    return await this.getFolder()
  }

  /**
   * Validates the repository (git or non-git) and ensures it's ready for Mobb operations
   * For git repositories: validates git structure and accessibility
   * For non-git directories: validates directory exists and is accessible
   * @returns Promise<boolean> True if repository/directory is valid
   * @throws Error if repository validation fails
   */
  public async validateRepository(): Promise<boolean> {
    const isGitRepo = this.gitService
      ? await this.gitService.isGitRepository()
      : false

    if (isGitRepo && this.gitService) {
      // Git repository validation
      const result = await this.gitService.validateRepository()
      if (!result.isValid) {
        throw new Error(result.error || 'Git repository validation failed')
      }
      logDebug('[LocalMobbFolderService] Git repository validated successfully')
    } else {
      // Non-git directory validation
      try {
        const stats = fs.statSync(this.repoPath)
        if (!stats.isDirectory()) {
          throw new Error(
            `Path exists but is not a directory: ${this.repoPath}`
          )
        }

        // Check if directory is readable/writable
        fs.accessSync(this.repoPath, fs.constants.R_OK | fs.constants.W_OK)
        logDebug(
          '[LocalMobbFolderService] Non-git directory validated successfully'
        )
      } catch (error) {
        throw new Error(`Directory validation failed: ${error}`)
      }
    }

    return true
  }

  /**
   * Extracts patch content from McpFix object
   * @param fix McpFix object
   * @returns Patch content or null if not available
   */
  private extractPatchFromFix(fix: McpFix): string | null {
    if (fix.patchAndQuestions.__typename === 'FixData') {
      return fix.patchAndQuestions.patch || null
    }
    return null
  }

  /**
   * Extracts severity level from McpFix object
   * @param fix McpFix object
   * @returns Severity string
   */
  private extractSeverity(fix: McpFix): string {
    return fix.severityText?.toLowerCase() || 'unknown'
  }

  /**
   * Extracts vulnerability type from McpFix object
   * @param fix McpFix object
   * @returns Vulnerability type string
   */
  private extractVulnerabilityType(fix: McpFix): string {
    return fix.safeIssueType || 'security-vulnerability'
  }

  /**
   * Extracts filename from McpFix object by parsing the patch
   * @param fix McpFix object
   * @returns Filename or null if not determinable
   */
  private extractFileNameFromFix(fix: McpFix): string | null {
    const patch = this.extractPatchFromFix(fix)
    if (!patch) {
      return null
    }

    // Try to extract filename from patch using helper function
    const extractedPath = extractPathFromPatch(patch)
    if (extractedPath) {
      // Return just the filename, not the full path
      const pathParts = extractedPath.split('/')
      const fileName = pathParts[pathParts.length - 1]
      return fileName || null
    }

    // Fallback: use fix ID as filename
    return `fix-${fix.id}`
  }

  /**
   * Saves a git patch as a file in the .mobb folder
   * @param fix McpFix object containing all fix information
   * @param customFileName Optional custom filename (overrides generated format)
   * @returns Result of the save operation including file path
   */
  public async savePatch(
    fix: McpFix,
    customFileName?: string
  ): Promise<SavePatchResult> {
    // Extract information from McpFix object
    const patch = this.extractPatchFromFix(fix)
    const severity = this.extractSeverity(fix)
    const vulnerabilityType = this.extractVulnerabilityType(fix)
    const fileName = this.extractFileNameFromFix(fix)

    logDebug('[LocalMobbFolderService] Saving patch', {
      fixId: fix.id,
      fileName,
      severity,
      vulnerabilityType,
      customFileName,
    })

    try {
      // Validate that we have valid patch content
      if (!patch || patch.trim().length === 0) {
        const error = `No valid patch content found for fix ${fix.id}`
        logError('[LocalMobbFolderService] Invalid patch content', {
          error,
          fixId: fix.id,
        })
        return {
          success: false,
          error,
          message: 'Failed to save patch: no valid patch content',
        }
      }

      // Validate that we can determine a filename
      if (!fileName) {
        const error = `Could not determine filename for fix ${fix.id}`
        logError('[LocalMobbFolderService] Missing fileName', {
          error,
          fixId: fix.id,
        })
        return {
          success: false,
          error,
          message: 'Failed to save patch: could not determine filename',
        }
      }

      // Get or create the .mobb folder
      const mobbFolderPath = await this.getFolder()

      // Generate filename using new format or use custom filename
      let baseFileName: string
      if (customFileName) {
        // Ensure custom filename has .patch extension
        baseFileName = customFileName.endsWith('.patch')
          ? customFileName
          : `${customFileName}.patch`
      } else {
        baseFileName = this.generatePatchFileName(
          severity,
          vulnerabilityType,
          fileName
        )
      }

      // Get unique filename (handle conflicts with index suffix)
      const uniqueFileName = this.getUniqueFileName(
        mobbFolderPath,
        baseFileName
      )
      const filePath = path.join(mobbFolderPath, uniqueFileName)

      // Write patch to file
      await fs.promises.writeFile(filePath, patch, 'utf8')

      logInfo('[LocalMobbFolderService] Patch saved successfully', {
        filePath,
        fileName: uniqueFileName,
        patchSize: patch.length,
      })

      return {
        success: true,
        filePath,
        fileName: uniqueFileName,
        message: `Patch saved successfully as ${uniqueFileName}`,
      }
    } catch (error) {
      const errorMessage = `Failed to save patch for fix ${fix.id}: ${error}`
      logError(errorMessage, {
        fixId: fix.id,
        fileName,
        severity,
        vulnerabilityType,
        customFileName,
        error,
      })
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      }
    }
  }

  /**
   * Generates a filename for a patch using the format: severity-vulnerabilityType-in-fileName.patch
   * @param severity Severity level of the vulnerability
   * @param vulnerabilityType Type of vulnerability
   * @param fileName Name of the file being patched
   * @returns Generated filename with .patch extension
   */
  private generatePatchFileName(
    severity: string,
    vulnerabilityType: string,
    fileName: string
  ): string {
    // Sanitize inputs for filename safety
    const safeSeverity = this.sanitizeForFilename(severity)
    const safeVulnType = this.sanitizeForFilename(vulnerabilityType)
    const safeFileName = this.sanitizeForFilename(fileName)

    return `${safeSeverity}-${safeVulnType}-in-${safeFileName}.patch`
  }

  /**
   * Sanitizes a string to be safe for use in filenames
   * @param input String to sanitize
   * @returns Sanitized string safe for filenames
   */
  private sanitizeForFilename(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-') // Replace non-alphanumeric chars with dashes
      .replace(/-+/g, '-') // Replace multiple consecutive dashes with single dash
      .replace(/^-|-$/g, '') // Remove leading/trailing dashes
  }

  /**
   * Gets a unique filename by adding index suffix if file already exists
   * @param folderPath Path to the folder where file will be saved
   * @param baseFileName Base filename to make unique
   * @returns Unique filename that doesn't conflict with existing files
   */
  private getUniqueFileName(folderPath: string, baseFileName: string): string {
    const baseName = path.parse(baseFileName).name
    const extension = path.parse(baseFileName).ext

    let uniqueFileName = baseFileName
    let index = 1

    // Keep incrementing index until we find a non-existing filename
    while (fs.existsSync(path.join(folderPath, uniqueFileName))) {
      uniqueFileName = `${baseName}-${index}${extension}`
      index++

      // Safety check to prevent infinite loop
      if (index > 1000) {
        const timestamp = Date.now()
        uniqueFileName = `${baseName}-${timestamp}${extension}`
        break
      }
    }

    if (uniqueFileName !== baseFileName) {
      logDebug(
        '[LocalMobbFolderService] Generated unique filename to avoid conflict',
        {
          original: baseFileName,
          unique: uniqueFileName,
        }
      )
    }

    return uniqueFileName
  }

  /**
   * Logs fix details in markdown format to patchInfo.md file
   * Prepends the new fix information to maintain chronological order (newest first)
   * @param fix McpFix object containing fix details
   * @param savedPatchFileName The filename of the saved patch file
   * @returns Result of the log operation
   */
  public async logPatch(
    fix: McpFix,
    savedPatchFileName?: string
  ): Promise<LogPatchResult> {
    logDebug('[LocalMobbFolderService] Logging patch info', { fixId: fix.id })

    try {
      // Get or create the .mobb folder
      const mobbFolderPath = await this.getFolder()
      const patchInfoPath = path.join(mobbFolderPath, 'patchInfo.md')

      // Generate markdown content for this fix
      const markdownContent = this.generateFixMarkdown(fix, savedPatchFileName)

      // Read existing content if file exists
      let existingContent = ''
      if (fs.existsSync(patchInfoPath)) {
        existingContent = await fs.promises.readFile(patchInfoPath, 'utf8')
        logDebug('[LocalMobbFolderService] Existing patchInfo.md found')
      } else {
        logDebug('[LocalMobbFolderService] Creating new patchInfo.md file')
      }

      // Prepend new content to existing content with proper separator
      const separator = existingContent
        ? '\n\n================================================================================\n\n'
        : ''
      const updatedContent = `${markdownContent}${separator}${existingContent}`

      // Write updated content to file
      await fs.promises.writeFile(patchInfoPath, updatedContent, 'utf8')

      logInfo('[LocalMobbFolderService] Patch info logged successfully', {
        patchInfoPath,
        fixId: fix.id,
        contentLength: updatedContent.length,
      })

      return {
        success: true,
        filePath: patchInfoPath,
        message: `Fix details logged to patchInfo.md`,
      }
    } catch (error) {
      const errorMessage = `Failed to log patch info: ${error}`
      logError(errorMessage, { fixId: fix.id, error })
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      }
    }
  }

  /**
   * Generates markdown formatted content for a fix
   * @param fix McpFix object to format
   * @param savedPatchFileName The filename of the saved patch file
   * @returns Markdown formatted string
   */
  private generateFixMarkdown(
    fix: McpFix,
    savedPatchFileName?: string
  ): string {
    const timestamp = new Date().toISOString()

    // Extract patch and determine patched file path
    const patch = this.extractPatchFromFix(fix)
    const relativePatchedFilePath = patch ? extractPathFromPatch(patch) : null
    const patchedFilePath = relativePatchedFilePath
      ? path.resolve(this.repoPath, relativePatchedFilePath)
      : null

    // Use savedPatchFileName to determine fix identifier, fallback to fix ID
    const fixIdentifier = savedPatchFileName
      ? savedPatchFileName.replace('.patch', '')
      : fix.id

    // Start building markdown content
    let markdown = `# Fix ${fixIdentifier}\n\n`
    markdown += `**Logged:** ${timestamp}\n\n`

    // Add patched file path if available
    if (patchedFilePath) {
      markdown += `**Patched File:** ${patchedFilePath}\n\n`
    }

    // Add fix URL if available (replace Fix ID)
    if (fix.fixUrl) {
      markdown += `**Fix URL:** [View Fix](${fix.fixUrl})\n\n`
    }

    // Add severity information
    if (fix.severityText) {
      markdown += `**Severity:** ${fix.severityText}`
      if (fix.severityValue !== null && fix.severityValue !== undefined) {
        markdown += ` (${fix.severityValue})`
      }
      markdown += `\n\n`
    }

    // Add confidence score
    markdown += `**Confidence:** ${fix.confidence}\n\n`

    // Add issue type
    if (fix.safeIssueType) {
      markdown += `**Issue Type:** ${fix.safeIssueType}\n\n`
    }

    // Add vulnerability details using same content as WrappedFixInfo
    const parseIssueTypeRes = parsedIssueTypeRes(fix.safeIssueType || undefined)
    const staticData = parseIssueTypeRes.success
      ? fixDetailsData[parseIssueTypeRes.data]
      : null
    const { issueDescription, fixInstructions } = staticData || {}

    // Add vulnerability details section
    markdown += `\n## Vulnerability Details\n\n`

    // Issue section (from static data)
    if (issueDescription) {
      markdown += `### Issue\n\n`
      markdown += `${issueDescription}\n\n`
    }

    // How to Fix section (from static data)
    if (fixInstructions) {
      markdown += `### How to Fix\n\n`
      markdown += `${fixInstructions}\n\n`
    }

    // Additional vulnerability report details if available
    if (fix.vulnerabilityReportIssues.length > 0) {
      fix.vulnerabilityReportIssues.forEach((issue) => {
        if (
          issue.vulnerabilityReportIssueTags &&
          issue.vulnerabilityReportIssueTags.length > 0
        ) {
          markdown += `**Tags:** ${issue.vulnerabilityReportIssueTags
            .map((tag) => tag.vulnerability_report_issue_tag_value)
            .join(', ')}\n\n`
        }
      })
    }

    // Add patch information if available
    if (fix.patchAndQuestions.__typename === 'FixData') {
      const fixData = fix.patchAndQuestions

      // Add fix description if available
      if (fixData.extraContext.fixDescription) {
        markdown += `## Fix Description\n\n`
        markdown += `${fixData.extraContext.fixDescription}\n\n`
      }

      // Add extra context if available
      if (fixData.extraContext.extraContext.length > 0) {
        markdown += `## Additional Context\n\n`
        fixData.extraContext.extraContext.forEach((context) => {
          markdown += `**${context.key}:** ${JSON.stringify(context.value)}\n\n`
        })
      }

      // Add patch preview (first few lines)
      const patchLines = fixData.patch.split('\n')
      const previewLines = patchLines.slice(0, 10) // First 10 lines
      markdown += `## Patch Preview\n\n`
      markdown += `\`\`\`diff\n`
      markdown += `${previewLines.join('\n')}`

      if (patchLines.length > 10) {
        markdown += `\n... (${patchLines.length - 10} more lines)`
      }

      markdown += `\n\`\`\`\n\n`
    } else if (fix.patchAndQuestions.__typename === 'GetFixNoFixError') {
      markdown += `## Fix Status\n\n`
      markdown += `⚠️ **No fix available** - This vulnerability could not be automatically fixed.\n\n`
    }

    return markdown
  }

  //   /**
  //    * Gets information about a local Mobb folder
  //    * @param folderPath Path to the folder to examine
  //    * @returns Folder information including existence and basic stats
  //    */
  //   public async getFolderInfo(folderPath: string): Promise<FolderInfo> {
  //     logDebug('[LocalMobbFolderService] Getting folder info', { folderPath })

  //     const folderInfo: FolderInfo = {
  //       path: folderPath,
  //       exists: false,
  //       isDirectory: false,
  //     }

  //     try {
  //       const stats = await fs.promises.stat(folderPath)
  //       folderInfo.exists = true
  //       folderInfo.isDirectory = stats.isDirectory()

  //       if (folderInfo.isDirectory) {
  //         // Count files in directory
  //         const files = await fs.promises.readdir(folderPath)
  //         folderInfo.filesCount = files.length

  //         // Calculate directory size (optional, can be expensive for large directories)
  //         let totalSize = 0
  //         for (const file of files) {
  //           try {
  //             const filePath = path.join(folderPath, file)
  //             const fileStats = await fs.promises.stat(filePath)
  //             if (fileStats.isFile()) {
  //               totalSize += fileStats.size
  //             }
  //           } catch (error) {
  //             logDebug('[LocalMobbFolderService] Error getting file size', { file, error })
  //           }
  //         }
  //         folderInfo.size = totalSize
  //       }
  //     } catch (error) {
  //       logDebug('[LocalMobbFolderService] Folder does not exist or is not accessible', {
  //         folderPath,
  //         error,
  //       })
  //     }

  //     return folderInfo
  //   }

  //   /**
  //    * Creates a local Mobb folder at the specified path
  //    * @param basePath Base directory where the Mobb folder should be created
  //    * @param folderName Optional custom folder name (defaults to '.mobb')
  //    * @returns Result of the folder creation operation
  //    */
  //   public async createMobbFolder(
  //     basePath: string,
  //     folderName: string = this.defaultMobbFolderName
  //   ): Promise<FolderCreationResult> {
  //     const targetPath = path.join(basePath, folderName)
  //     logInfo('[LocalMobbFolderService] Creating Mobb folder', { targetPath })

  //     try {
  //       // Check if base path exists
  //       const basePathExists = await this.pathExists(basePath)
  //       if (!basePathExists) {
  //         const error = `Base path does not exist: ${basePath}`
  //         logError(error)
  //         return {
  //           success: false,
  //           path: targetPath,
  //           error,
  //         }
  //       }

  //       // Check if target folder already exists
  //       const folderExists = await this.pathExists(targetPath)
  //       if (folderExists) {
  //         logInfo('[LocalMobbFolderService] Mobb folder already exists', { targetPath })
  //         return {
  //           success: true,
  //           path: targetPath,
  //         }
  //       }

  //       // Create the folder
  //       await fs.promises.mkdir(targetPath, { recursive: true })
  //       logInfo('[LocalMobbFolderService] Mobb folder created successfully', { targetPath })

  //       return {
  //         success: true,
  //         path: targetPath,
  //       }
  //     } catch (error) {
  //       const errorMessage = `Failed to create Mobb folder: ${error}`
  //       logError(errorMessage, { targetPath, error })
  //       return {
  //         success: false,
  //         path: targetPath,
  //         error: errorMessage,
  //       }
  //     }
  //   }

  //   /**
  //    * Finds the nearest Mobb folder by traversing up the directory tree
  //    * @param startPath Starting directory to search from
  //    * @param folderName Optional custom folder name to search for (defaults to '.mobb')
  //    * @returns Path to the found Mobb folder or null if not found
  //    */
  //   public async findNearestMobbFolder(
  //     startPath: string,
  //     folderName: string = this.defaultMobbFolderName
  //   ): Promise<string | null> {
  //     logDebug('[LocalMobbFolderService] Searching for nearest Mobb folder', {
  //       startPath,
  //       folderName,
  //     })

  //     let currentPath = path.resolve(startPath)
  //     const rootPath = path.parse(currentPath).root

  //     while (currentPath !== rootPath) {
  //       const mobbFolderPath = path.join(currentPath, folderName)
  //       const folderInfo = await this.getFolderInfo(mobbFolderPath)

  //       if (folderInfo.exists && folderInfo.isDirectory) {
  //         logDebug('[LocalMobbFolderService] Found Mobb folder', { mobbFolderPath })
  //         return mobbFolderPath
  //       }

  //       // Move up one directory
  //       const parentPath = path.dirname(currentPath)
  //       if (parentPath === currentPath) {
  //         break // Reached the root
  //       }
  //       currentPath = parentPath
  //     }

  //     logDebug('[LocalMobbFolderService] No Mobb folder found')
  //     return null
  //   }

  //   /**
  //    * Cleans up a Mobb folder by removing its contents
  //    * @param folderPath Path to the Mobb folder to clean
  //    * @returns Result of the cleanup operation
  //    */
  //   public async cleanMobbFolder(folderPath: string): Promise<FolderOperationResult> {
  //     logInfo('[LocalMobbFolderService] Cleaning Mobb folder', { folderPath })

  //     try {
  //       const folderInfo = await this.getFolderInfo(folderPath)

  //       if (!folderInfo.exists) {
  //         return {
  //           success: false,
  //           message: `Folder does not exist: ${folderPath}`,
  //           error: 'Folder not found',
  //         }
  //       }

  //       if (!folderInfo.isDirectory) {
  //         return {
  //           success: false,
  //           message: `Path is not a directory: ${folderPath}`,
  //           error: 'Not a directory',
  //         }
  //       }

  //       // Remove all contents
  //       const files = await fs.promises.readdir(folderPath)
  //       for (const file of files) {
  //         const filePath = path.join(folderPath, file)
  //         try {
  //           const stats = await fs.promises.stat(filePath)
  //           if (stats.isDirectory()) {
  //             await fs.promises.rmdir(filePath, { recursive: true })
  //           } else {
  //             await fs.promises.unlink(filePath)
  //           }
  //         } catch (error) {
  //           logError('[LocalMobbFolderService] Error removing file/folder', {
  //             filePath,
  //             error,
  //           })
  //         }
  //       }

  //       logInfo('[LocalMobbFolderService] Mobb folder cleaned successfully', { folderPath })
  //       return {
  //         success: true,
  //         message: `Successfully cleaned folder: ${folderPath}`,
  //       }
  //     } catch (error) {
  //       const errorMessage = `Failed to clean Mobb folder: ${error}`
  //       logError(errorMessage, { folderPath, error })
  //       return {
  //         success: false,
  //         message: errorMessage,
  //         error: String(error),
  //       }
  //     }
  //   }

  //   /**
  //    * Validates that a path is safe for Mobb folder operations
  //    * @param folderPath Path to validate
  //    * @returns True if the path is safe to use
  //    */
  //   public validatePath(folderPath: string): boolean {
  //     logDebug('[LocalMobbFolderService] Validating path', { folderPath })

  //     // Check for path traversal attempts
  //     if (folderPath.includes('..') || folderPath.includes('\0')) {
  //       logError('[LocalMobbFolderService] Dangerous path detected', { folderPath })
  //       return false
  //     }

  //     // Check for absolute path requirements (optional, depending on your needs)
  //     const normalizedPath = path.normalize(folderPath)
  //     if (normalizedPath.includes('..')) {
  //       logError('[LocalMobbFolderService] Path traversal detected after normalization', {
  //         folderPath,
  //         normalizedPath,
  //       })
  //       return false
  //     }

  //     return true
  //   }

  //   /**
  //    * Helper method to check if a path exists
  //    * @param targetPath Path to check
  //    * @returns True if the path exists
  //    */
  //   private async pathExists(targetPath: string): Promise<boolean> {
  //     try {
  //       await fs.promises.access(targetPath)
  //       return true
  //     } catch {
  //       return false
  //     }
  //   }
}
