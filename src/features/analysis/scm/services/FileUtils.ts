import fs from 'node:fs'
import { promises as fsPromises } from 'node:fs'

import ignore from 'ignore'
import { isBinary } from 'istextorbinary'
import path from 'path'

import {
  MCP_DEFAULT_MAX_FILES_TO_SCAN,
  MCP_MAX_FILE_SIZE,
} from '../../../../mcp/core/configs'
import { EXCLUDED_DIRS } from './ExcludedDirs'
import { EXCLUDED_FILE_PATTERNS } from './ExcludedFilePatterns'

export class FileUtils {
  static isExcludedFileType(filepath: string): boolean {
    const basename = path.basename(filepath).toLowerCase()
    if (basename === '.env' || basename.startsWith('.env.')) {
      return true
    }
    if (EXCLUDED_FILE_PATTERNS.some((pattern) => basename.endsWith(pattern))) {
      return true
    }
    return false
  }

  static shouldPackFile(
    filepath: string,
    maxFileSize = MCP_MAX_FILE_SIZE
  ): boolean {
    const absoluteFilepath = path.resolve(filepath)

    if (this.isExcludedFileType(filepath)) {
      return false
    }

    try {
      const stats = fs.statSync(absoluteFilepath)

      if (stats.size > maxFileSize) {
        return false
      }

      const data = fs.readFileSync(absoluteFilepath)

      if (isBinary(null, data)) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  // Process directory at repository root level with special handling for excluded root directories
  private static async processRootDirectory(
    dir: string,
    excludedRootDirectories: string[]
  ): Promise<
    {
      name: string
      fullPath: string
      relativePath: string
      time: number
      isFile: boolean
    }[]
  > {
    // Check access to directory
    try {
      await fsPromises.access(dir, fs.constants.R_OK)
    } catch {
      return []
    }

    const items = await fsPromises.readdir(dir)
    const results: {
      name: string
      fullPath: string
      relativePath: string
      time: number
      isFile: boolean
    }[] = []

    // Process files and directories at root level
    const filePromises = []

    for (const item of items) {
      const fullPath = path.join(dir, item)

      try {
        await fsPromises.access(fullPath, fs.constants.R_OK)
        const stat = await fsPromises.stat(fullPath)

        if (stat.isDirectory()) {
          // At root level, apply excluded root directory exclusions
          if (excludedRootDirectories.includes(item)) {
            continue
          }

          // Process subdirectory (without applying root exclusions again)
          filePromises.push(this.processSubdirectory(fullPath, dir, 1))
        } else {
          results.push({
            name: item,
            fullPath,
            relativePath: item,
            time: stat.mtime.getTime(),
            isFile: true,
          })
        }
      } catch {
        continue
      }
    }

    // Wait for all subdirectory processing to complete
    const subdirResults = await Promise.all(filePromises)

    // Combine all results
    for (const subdirResult of subdirResults) {
      results.push(...subdirResult)
    }

    return results
  }

  // Process subdirectories without applying root exclusions
  private static async processSubdirectory(
    dir: string,
    rootDir: string,
    depth: number
  ): Promise<
    {
      name: string
      fullPath: string
      relativePath: string
      time: number
      isFile: boolean
    }[]
  > {
    // Skip if depth exceeds limit (prevent infinite recursion)
    if (depth > 20) {
      return []
    }

    // Check access to directory
    try {
      await fsPromises.access(dir, fs.constants.R_OK)
    } catch {
      return []
    }

    const items = await fsPromises.readdir(dir)
    const results: {
      name: string
      fullPath: string
      relativePath: string
      time: number
      isFile: boolean
    }[] = []

    // Process files and directories
    const filePromises = []

    for (const item of items) {
      const fullPath = path.join(dir, item)

      try {
        await fsPromises.access(fullPath, fs.constants.R_OK)
        const stat = await fsPromises.stat(fullPath)

        if (stat.isDirectory()) {
          // Process subdirectory recursively (no root exclusion here)
          filePromises.push(
            this.processSubdirectory(fullPath, rootDir, depth + 1)
          )
        } else {
          results.push({
            name: item,
            fullPath,
            relativePath: path.relative(rootDir, fullPath),
            time: stat.mtime.getTime(),
            isFile: true,
          })
        }
      } catch {
        continue
      }
    }

    // Wait for all subdirectory processing to complete
    const subdirResults = await Promise.all(filePromises)

    // Combine all results
    for (const subdirResult of subdirResults) {
      results.push(...subdirResult)
    }

    return results
  }

  static async getLastChangedFiles({
    dir,
    maxFileSize,
    maxFiles = MCP_DEFAULT_MAX_FILES_TO_SCAN,
    isAllFilesScan,
  }: {
    dir: string
    maxFileSize: number
    maxFiles?: number
    isAllFilesScan?: boolean
  }): Promise<string[]> {
    try {
      const stats = fs.statSync(dir)
      if (!stats.isDirectory()) return []
    } catch {
      return []
    }

    // Get .gitignore matcher if available
    let gitMatcher: ReturnType<typeof ignore> | null = null
    try {
      const { GitService } = (await import('./GitService')) as {
        GitService: typeof import('./GitService').GitService
      }
      const gitService = new GitService(dir)
      gitMatcher = await gitService.getGitignoreMatcher()
    } catch (e) {
      // ignore error – treat as if no gitignore present
    }
    // Process the directory tree (root-level files and subdirectories)
    const allFiles = await this.processRootDirectory(dir, EXCLUDED_DIRS)

    // Apply filtering
    const filteredFiles = allFiles
      .filter(
        (file) =>
          this.shouldPackFile(file.fullPath, maxFileSize) &&
          !gitMatcher?.ignores(file.relativePath)
      )
      .sort((a, b) => b.time - a.time)
      .map((file) => file.relativePath)

    if (isAllFilesScan) {
      return filteredFiles
    } else {
      return filteredFiles.slice(0, maxFiles)
    }
  }
}
