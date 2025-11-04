import fs from 'fs/promises'
import nodePath from 'path'

import { FileUtils } from '../../features/analysis/scm/services/FileUtils'
import { GitService } from '../../features/analysis/scm/services/GitService'
import { ScanContext } from '../../types'
import { MCP_MAX_FILE_SIZE } from '../core/configs'
import { log, logDebug, logError } from '../Logger'

export type LocalFile = {
  filename: string
  relativePath: string
  fullPath: string
  lastEdited: number
}

export const getLocalFiles = async ({
  path,
  maxFileSize = MCP_MAX_FILE_SIZE,
  maxFiles,
  isAllFilesScan,
  scanContext,
  scanRecentlyChangedFiles,
}: {
  path: string
  maxFileSize?: number
  maxFiles?: number
  isAllFilesScan?: boolean
  scanContext: ScanContext
  scanRecentlyChangedFiles?: boolean
}): Promise<LocalFile[]> => {
  logDebug(`[${scanContext}] Starting getLocalFiles`, {
    path,
    maxFileSize,
    maxFiles,
    isAllFilesScan,
    scanRecentlyChangedFiles,
  })

  try {
    // Validate git repository - let validation errors bubble up as MCP errors
    // Resolve the repository path to eliminate symlink prefixes (e.g., /var vs /private/var on macOS)
    const resolvedRepoPath = await fs.realpath(path)
    logDebug(`[${scanContext}] Resolved repository path`, {
      resolvedRepoPath,
      originalPath: path,
    })

    const gitService = new GitService(resolvedRepoPath, log)

    const gitValidation = await gitService.validateRepository()
    logDebug(`[${scanContext}] Git repository validation result`, {
      isValid: gitValidation.isValid,
      error: gitValidation.error,
      isAllFilesScan,
    })

    let files: string[] = []
    if (!gitValidation.isValid || isAllFilesScan) {
      // For non-git repos, always scan recently changed files (treat as if scanRecentlyChangedFiles is true)
      try {
        files = await FileUtils.getLastChangedFiles({
          dir: path,
          maxFileSize,
          maxFiles,
          isAllFilesScan,
        })
        logDebug(`[${scanContext}] Found files in the repository`, {
          fileCount: files.length,
        })
      } catch (error) {
        logError(`${scanContext}Error getting last changed files`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
        throw error
      }
    } else {
      try {
        const gitResult = await gitService.getChangedFiles()
        files = gitResult.files

        // Only fallback to recently changed files if:
        // 1. scanRecentlyChangedFiles is explicitly true, OR
        // 2. maxFiles is specified (existing behavior for comprehensive scans)
        if (
          (files.length === 0 || maxFiles) &&
          (scanRecentlyChangedFiles || maxFiles)
        ) {
          logDebug(
            `[${scanContext}] No changes found or maxFiles specified, getting recently changed files`,
            { maxFiles, scanRecentlyChangedFiles }
          )

          const recentResult = await gitService.getRecentlyChangedFiles({
            maxFiles,
          })
          files = recentResult.files
          logDebug(
            `[${scanContext}] Using recently changed files from git history`,
            {
              fileCount: files.length,
              commitsChecked: recentResult.commitCount,
            }
          )
        } else {
          logDebug(
            `[${scanContext}] Found changed files in the git repository`,
            {
              fileCount: files.length,
            }
          )
        }
      } catch (error) {
        logError(`${scanContext}Error getting files from git`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
        throw error
      }
    }

    files = files.filter((file) => {
      const fullPath = nodePath.resolve(resolvedRepoPath, file)
      const isPackable = FileUtils.shouldPackFile(fullPath, maxFileSize)
      return isPackable
    })

    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        // Ensure we always work with an absolute path for the file first
        const absoluteFilePath = nodePath.resolve(resolvedRepoPath, file)
        const relativePath = nodePath.relative(
          resolvedRepoPath,
          absoluteFilePath
        )

        try {
          const fileStat = await fs.stat(absoluteFilePath)

          return {
            filename: nodePath.basename(absoluteFilePath),
            relativePath,
            fullPath: absoluteFilePath,
            lastEdited: fileStat.mtime.getTime(),
          }
        } catch (e) {
          logError(`[${scanContext}] Error getting file stats`, {
            file,
            absoluteFilePath,
            error: e instanceof Error ? e.message : String(e),
          })

          return {
            filename: nodePath.basename(absoluteFilePath),
            relativePath,
            fullPath: absoluteFilePath,
            lastEdited: 0,
          }
        }
      })
    )

    const result = filesWithStats.filter((file) => file.lastEdited > 0)
    return result
  } catch (error) {
    logError(`${scanContext}Unexpected error in getLocalFiles`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      path,
    })
    throw error
  }
}
