import fs from 'node:fs'
import path from 'node:path'

import { logDebug, logError } from '../Logger'

export type PathValidationResult = {
  isValid: boolean
  error?: string
}

export class PathValidation {
  /**
   * Validates a path for MCP usage - combines security and existence checks
   */
  public async validatePath(inputPath: string): Promise<PathValidationResult> {
    logDebug('Validating MCP path', { inputPath })

    // Check for obvious path traversal patterns
    if (inputPath.includes('..')) {
      const error = `Path contains path traversal patterns: ${inputPath}`
      logError(error)
      return { isValid: false, error }
    }

    // Ensure the path doesn't try to access system directories via path traversal
    const normalizedPath = path.normalize(inputPath)
    if (normalizedPath.includes('..')) {
      const error = `Normalized path contains path traversal patterns: ${inputPath}`
      logError(error)
      return { isValid: false, error }
    }

    // Check for encoded path traversal attempts
    const decodedPath = decodeURIComponent(inputPath)
    if (decodedPath.includes('..') || decodedPath !== inputPath) {
      const error = `Path contains encoded traversal attempts: ${inputPath}`
      logError(error)
      return { isValid: false, error }
    }

    // Check for null bytes and other dangerous characters
    if (inputPath.includes('\0') || inputPath.includes('\x00')) {
      const error = `Path contains dangerous characters: ${inputPath}`
      logError(error)
      return { isValid: false, error }
    }

    logDebug('Path validation successful', { inputPath })

    // Check if the path exists and is accessible
    logDebug('Checking path existence', { inputPath })

    try {
      await fs.promises.access(inputPath)
      logDebug('Path exists and is accessible', { inputPath })
      return { isValid: true }
    } catch (error) {
      const errorMessage = `Path does not exist or is not accessible: ${inputPath}`
      logError(errorMessage, { error })
      return { isValid: false, error: errorMessage }
    }
  }
}
