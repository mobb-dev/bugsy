import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'

import { FileUtils } from '../../features/analysis/scm/services/FileUtils'
import { logDebug, logError, logInfo } from '../Logger'

export type FileData = {
  relativePath: string
  absolutePath: string
  content: Buffer
}

export type PackingResult = {
  archive: Buffer
  packedFilesCount: number
  totalSize: number
}

export class FileOperations {
  /**
   * Creates a ZIP archive containing the specified source files
   * @param fileList Array of relative file paths to include
   * @param repositoryPath Base path for resolving relative file paths
   * @param maxFileSize Maximum size allowed for individual files
   * @returns ZIP archive as a Buffer with metadata
   */
  public async createSourceCodeArchive(
    fileList: string[],
    repositoryPath: string,
    maxFileSize: number
  ): Promise<PackingResult> {
    logDebug('[FileOperations] Packing files')

    const zip = new AdmZip()
    let packedFilesCount = 0

    // Resolve the repository path to get the canonical absolute path
    const resolvedRepoPath = path.resolve(repositoryPath)
    for (const filepath of fileList) {
      const absoluteFilepath = path.join(repositoryPath, filepath)

      // Security check: Validate the file path doesn't escape the repository directory
      const resolvedFilePath = path.resolve(absoluteFilepath)
      if (!resolvedFilePath.startsWith(resolvedRepoPath)) {
        logDebug(
          `[FileOperations] Skipping ${filepath} due to potential path traversal security risk`
        )
        continue
      }

      // Use FileUtils to check if file should be packed
      if (!FileUtils.shouldPackFile(absoluteFilepath, maxFileSize)) {
        logDebug(
          `[FileOperations] Excluding ${filepath} - file is too large, binary, or matches exclusion rules`
        )
        continue
      }

      const fileContent = await this.readSourceFile(absoluteFilepath, filepath)
      if (fileContent) {
        zip.addFile(filepath, fileContent)
        packedFilesCount++
      }
    }

    const archiveBuffer = zip.toBuffer()
    const result: PackingResult = {
      archive: archiveBuffer,
      packedFilesCount,
      totalSize: archiveBuffer.length,
    }

    logInfo(
      `[FileOperations] Files packed successfully ${packedFilesCount} files, ${result.totalSize} bytes`
    )
    return result
  }

  /**
   * Validates that file paths are within the repository and safe to access
   * @param fileList Array of relative file paths to validate
   * @param repositoryPath Base path for validation
   * @returns Array of validated file paths
   */
  public async validateFilePaths(
    fileList: string[],
    repositoryPath: string
  ): Promise<string[]> {
    const resolvedRepoPath = path.resolve(repositoryPath)
    const validatedPaths: string[] = []

    for (const filepath of fileList) {
      const absoluteFilepath = path.join(repositoryPath, filepath)
      const resolvedFilePath = path.resolve(absoluteFilepath)

      // Security check: Prevent path traversal attacks
      if (!resolvedFilePath.startsWith(resolvedRepoPath)) {
        logDebug(
          `[FileOperations] Rejecting ${filepath} - path traversal attempt detected`
        )
        continue
      }

      // Check if file exists and is accessible
      try {
        await fs.promises.access(absoluteFilepath, fs.constants.R_OK)
        validatedPaths.push(filepath)
      } catch (error) {
        logDebug(
          `[FileOperations] Skipping ${filepath} - file is not accessible: ${error}`
        )
      }
    }

    return validatedPaths
  }

  /**
   * Reads source files and returns their data
   * @param filePaths Array of absolute file paths to read
   * @returns Array of file data objects
   */
  public async readSourceFiles(filePaths: string[]): Promise<FileData[]> {
    const fileDataArray: FileData[] = []

    for (const absolutePath of filePaths) {
      try {
        const content = await fs.promises.readFile(absolutePath)
        const relativePath = path.basename(absolutePath)

        fileDataArray.push({
          relativePath,
          absolutePath,
          content,
        })
      } catch (error) {
        logError(
          `[FileOperations] Failed to read file ${absolutePath}: ${error}`
        )
      }
    }

    return fileDataArray
  }

  /**
   * Safely reads a single source file
   * @param absoluteFilepath Absolute path to the file
   * @param relativeFilepath Relative path for logging purposes
   * @returns File content as Buffer or null if failed
   */
  private async readSourceFile(
    absoluteFilepath: string,
    relativeFilepath: string
  ): Promise<Buffer | null> {
    try {
      return await fs.promises.readFile(absoluteFilepath)
    } catch (fsError) {
      logError(
        `[FileOperations] Failed to read ${relativeFilepath} from filesystem: ${fsError}`
      )
      return null
    }
  }
}
