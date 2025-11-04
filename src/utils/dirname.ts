import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Declare __dirname for TypeScript when it might not exist
declare const __dirname: string | undefined

/**
 * Finds the module's root directory by walking up the file tree until package.json is found.
 *
 * This approach is necessary because:
 * - Dev environment uses ts-node with source files in src/
 * - Production uses compiled files in dist/ with different nesting depths
 * - Files may be imported from various depths (e.g., utils/, args/commands/)
 * - Hardcoded relative paths (../, ../../) break depending on the importer's location
 *
 * Walking up the tree ensures we always find package.json regardless of the calling context.
 */
export function getModuleRootDir() {
  let manifestDir = getDirName()

  for (let i = 0; i < 10; i++) {
    const manifestPath = path.join(manifestDir, 'package.json')

    if (fs.existsSync(manifestPath)) {
      return manifestDir
    }

    manifestDir = path.join(manifestDir, '..')
  }

  // This should never happen.
  throw new Error('Cannot locate package.json file')
}

export function getDirName() {
  // Handle both ESM and CommonJS environments
  if (typeof __filename !== 'undefined') {
    // CommonJS environment
    return path.dirname(__filename)
  } else {
    // ESM environment - use Function constructor to avoid parser seeing import.meta
    try {
      // eslint-disable-next-line no-new-func
      const getImportMetaUrl = new Function('return import.meta.url')
      const importMetaUrl = getImportMetaUrl()
      return path.dirname(fileURLToPath(importMetaUrl))
    } catch (e) {
      // If that fails, try using a different approach for ESM
      // This handles cases where the code is bundled or transformed
      try {
        // Try to get the current file URL from error stack
        const err = new Error()
        const stack = err.stack || ''
        const match = stack.match(/file:\/\/[^\s)]+/)
        if (match) {
          const fileUrl = match[0]
          return path.dirname(fileURLToPath(fileUrl))
        }
      } catch {
        // Ignore and fall through to error
      }
      throw new Error('Unable to determine directory name in this environment')
    }
  }
}

export function getTopLevelDirName(fullPath: string): string {
  return path.parse(fullPath).name
}

export default getDirName
