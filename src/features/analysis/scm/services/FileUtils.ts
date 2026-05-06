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
import {
  EXCLUDED_FILE_PATTERNS,
  IMPORTANT_PROJECT_FILES,
  SUPPORTED_EXTENSIONS,
} from './FilePatterns'
import type { GitService as GitServiceClass } from './GitService'

export class FileUtils {
  // Important project configuration files that should always be included

  static isExcludedFileType(filepath: string): boolean {
    const basename = path.basename(filepath).toLowerCase()

    // Always allow important project configuration files
    if (IMPORTANT_PROJECT_FILES.includes(basename)) {
      return false
    }

    // Check if file has a supported extension
    const ext = path.extname(filepath).toLowerCase()
    const isSupported =
      SUPPORTED_EXTENSIONS.includes(ext) ||
      SUPPORTED_EXTENSIONS.includes(basename) // For files like 'Dockerfile'

    // If not a supported extension, exclude it
    if (!isSupported) {
      return true
    }

    // If supported extension, check against additional exclusion patterns
    // (patterns have been cleaned to avoid conflicts with whitelist)
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
    // Keep track of visited directories to prevent circular symlink recursion
    const visitedDirs = new Set<string>()

    // Process directories without applying root exclusions
    return this.processDirectory(
      dir,
      dir,
      excludedRootDirectories,
      0,
      visitedDirs,
      true
    )
  }

  // Process directories with tracking to prevent circular symlink recursion
  private static async processDirectory(
    dir: string,
    rootDir: string,
    excludedRootDirectories: string[] = [],
    depth: number = 0,
    visitedDirs: Set<string> = new Set(),
    isRootLevel: boolean = false
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

    // Get canonical path to handle symlinks
    let canonicalPath
    try {
      canonicalPath = await fsPromises.realpath(dir)

      // Skip if we've already visited this directory (prevents circular symlinks)
      if (visitedDirs.has(canonicalPath)) {
        return []
      }

      // Add to visited set
      visitedDirs.add(canonicalPath)
    } catch {
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
      const safeInput = path.resolve(
        path.sep,
        path.normalize(
          String(dir || '')
            .replace('\0', '')
            .replace(/^(\.\.(\/|\\$))+/, '')
        )
      )
      const fullPath = path.join(safeInput, item)

      try {
        await fsPromises.access(fullPath, fs.constants.R_OK)
        const stat = await fsPromises.stat(fullPath)

        if (stat.isDirectory()) {
          // At root level, apply excluded root directory exclusions
          if (isRootLevel && excludedRootDirectories.includes(item)) {
            continue
          }

          // Process subdirectory
          filePromises.push(
            this.processDirectory(fullPath, rootDir, [], depth + 1, visitedDirs)
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
      if (!stats.isDirectory()) {
        return []
      }
    } catch {
      return []
    }

    // Get .gitignore matcher if available
    let gitMatcher: ReturnType<typeof ignore> | null = null
    try {
      const { GitService } = (await import('./GitService')) as {
        GitService: typeof GitServiceClass
      }
      const gitService = new GitService(dir)
      gitMatcher = await gitService.getGitignoreMatcher()
    } catch {
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

// Mobb security fix applied: PT https://api-st-stenant.mobb.dev/organization/d9e4bd39-84bb-4849-a4f7-975157cbc999/project/4b0b311e-72e7-49c4-a6a7-7002029661f6/report/5dc12c28-44f9-49f1-8429-513828d658b9/fix/51296daf-fb02-4c00-a488-de45bffd73ca
