import fs from 'node:fs'
import path from 'node:path'

import { logDebug, logError } from '../Logger'

export type PathValidationResult = {
  isValid: boolean
  error?: string
  path: string
}

/**
 * Validates a path for MCP usage - combines security and existence checks
 */
export async function validatePath(
  inputPath: string
): Promise<PathValidationResult> {
  logDebug('Validating MCP path', { inputPath })

  if (inputPath === '.') {
    if (process.env['WORKSPACE_FOLDER_PATHS']) {
      logDebug('Fallback to workspace folder path', {
        inputPath,
        workspaceFolderPaths: process.env['WORKSPACE_FOLDER_PATHS'],
      })
      return {
        isValid: true,
        path: process.env['WORKSPACE_FOLDER_PATHS'],
      }
    } else {
      const error = `"." is not a valid path, please provide a full localpath to the repository`
      logError(error)
      return { isValid: false, error, path: inputPath }
    }
  }

  // Check for obvious path traversal patterns
  if (inputPath.includes('..')) {
    const error = `Path contains path traversal patterns: ${inputPath}`
    logError(error)
    return { isValid: false, error, path: inputPath }
  }

  // Ensure the path doesn't try to access system directories via path traversal
  const normalizedPath = path.normalize(inputPath)
  if (normalizedPath.includes('..')) {
    const error = `Normalized path contains path traversal patterns: ${inputPath}`
    logError(error)
    return { isValid: false, error, path: inputPath }
  }

  // Check for encoded path traversal attempts
  let decodedPath: string
  try {
    decodedPath = decodeURIComponent(inputPath)
  } catch (err) {
    const error = `Failed to decode path: ${inputPath}`
    logError(error, { err })
    return { isValid: false, error, path: inputPath }
  }

  if (decodedPath.includes('..') || decodedPath !== inputPath) {
    const error = `Path contains encoded traversal attempts: ${inputPath}`
    logError(error)
    return { isValid: false, error, path: inputPath }
  }

  // Check for null bytes and other dangerous characters
  if (inputPath.includes('\0') || inputPath.includes('\x00')) {
    const error = `Path contains dangerous characters: ${inputPath}`
    logError(error)
    return { isValid: false, error, path: inputPath }
  }

  logDebug('Path validation successful', { inputPath })

  // Check if the path exists and is accessible
  logDebug('Checking path existence', { inputPath })

  try {
    await fs.promises.access(inputPath)
    logDebug('Path exists and is accessible', { inputPath })
    return { isValid: true, path: inputPath }
  } catch (error) {
    const errorMessage = `Path does not exist or is not accessible: ${inputPath}`
    logError(errorMessage, { error })
    return { isValid: false, error: errorMessage, path: inputPath }
  }
}
