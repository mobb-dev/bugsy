import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
  return path.dirname(fileURLToPath(import.meta.url))
}

export function getTopLevelDirName(fullPath: string): string {
  return path.parse(fullPath).name
}

export default getDirName
