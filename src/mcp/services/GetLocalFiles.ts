import fs from 'fs/promises'
import nodePath from 'path'

import { FileUtils } from '../../features/analysis/scm/FileUtils'
import { GitService } from '../../features/analysis/scm/git/GitService'
import { log, logDebug } from '../Logger'

export type LocalFile = {
  filename: string
  relativePath: string
  fullPath: string
  lastEdited: number
}

export const getLocalFiles = async ({
  path,
  maxFileSize = 1024 * 1024 * 5,
  maxFiles,
}: {
  path: string
  maxFileSize?: number
  maxFiles?: number
}): Promise<LocalFile[]> => {
  // Validate git repository - let validation errors bubble up as MCP errors
  // Resolve the repository path to eliminate symlink prefixes (e.g., /var vs /private/var on macOS)
  const resolvedRepoPath = await fs.realpath(path)

  const gitService = new GitService(resolvedRepoPath, log)
  const gitValidation = await gitService.validateRepository()
  let files: string[] = []
  if (!gitValidation.isValid) {
    logDebug(
      'Git repository validation failed, using all files in the repository',
      {
        path,
      }
    )
    files = FileUtils.getLastChangedFiles({
      dir: path,
      maxFileSize,
      maxFiles,
    })
    logDebug('Found files in the repository', {
      files,
      fileCount: files.length,
    })
  } else {
    logDebug('maxFiles', {
      maxFiles,
    })
    const gitResult = await gitService.getChangedFiles()
    files = gitResult.files
    if (files.length === 0 || maxFiles) {
      const recentResult = await gitService.getRecentlyChangedFiles({
        maxFiles,
      })
      files = recentResult.files
      logDebug(
        'No changes found, using recently changed files from git history',
        {
          files,
          fileCount: files.length,
          commitsChecked: recentResult.commitCount,
        }
      )
    } else {
      logDebug('Found changed files in the git repository', {
        files,
        fileCount: files.length,
      })
    }
  }
  files = files.filter((file) =>
    FileUtils.shouldPackFile(
      nodePath.resolve(resolvedRepoPath, file),
      maxFileSize
    )
  )
  const filesWithStats = await Promise.all(
    files.map(async (file) => {
      // Ensure we always work with an absolute path for the file first
      const absoluteFilePath = nodePath.resolve(resolvedRepoPath, file)

      const relativePath = nodePath.relative(resolvedRepoPath, absoluteFilePath)
      let fileStat
      try {
        fileStat = await fs.stat(absoluteFilePath)
      } catch (e) {
        logDebug('File not found', {
          file,
        })
      }
      return {
        filename: nodePath.basename(absoluteFilePath),
        relativePath,
        fullPath: absoluteFilePath,
        lastEdited: fileStat?.mtime.getTime() ?? 0,
      }
    })
  )
  return filesWithStats.filter((file) => file.lastEdited > 0)
}
