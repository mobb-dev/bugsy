import fs from 'fs'
import os from 'os'
import path from 'path'

import { MCP_SYSTEM_FIND_TIMEOUT_MS } from '../../core/configs'
import { logWarn } from '../../Logger'

const MAX_DEPTH = 2
const patterns = ['mcp', 'claude']

const isFileMatch = (fileName: string) => {
  const lowerName = fileName.toLowerCase()
  return (
    lowerName.endsWith('.json') &&
    patterns.some((p) => lowerName.includes(p.toLowerCase()))
  )
}

const safeAccess = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Limited recursion search for config files
 */
const searchDir = async (dir: string, depth = 0): Promise<string[]> => {
  const results: string[] = []

  if (depth > MAX_DEPTH) return results

  const entries = await fs.promises
    .readdir(dir, { withFileTypes: true })
    .catch(() => [])

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isFile() && isFileMatch(entry.name)) {
      results.push(fullPath)
    } else if (entry.isDirectory()) {
      if (await safeAccess(fullPath)) {
        const subResults = await searchDir(fullPath, depth + 1)
        results.push(...subResults)
      }
    }
  }

  return results
}

export const findSystemMCPConfigs = async (): Promise<string[]> => {
  try {
    const home = os.homedir()
    const platform = os.platform()

    // Known paths per platform
    const knownDirs =
      platform === 'win32'
        ? [
            path.join(home, '.cursor'),
            path.join(home, 'Documents'),
            path.join(home, 'Downloads'),
          ]
        : [
            path.join(home, '.cursor'),
            process.env['XDG_CONFIG_HOME'] || path.join(home, '.config'),
            path.join(home, 'Documents'),
            path.join(home, 'Downloads'),
          ]

    const timeoutPromise = new Promise<string[]>((resolve) =>
      setTimeout(() => {
        logWarn(
          `MCP config search timed out after ${MCP_SYSTEM_FIND_TIMEOUT_MS / 1000}s`
        )
        resolve([])
      }, MCP_SYSTEM_FIND_TIMEOUT_MS)
    )

    const searchPromise = Promise.all(
      knownDirs.map((dir) =>
        fs.existsSync(dir) ? searchDir(dir) : Promise.resolve([])
      )
    ).then((results) => results.flat())

    return await Promise.race([timeoutPromise, searchPromise])
  } catch (err) {
    logWarn('MCP config search unexpected error', { err })
    return []
  }
}
