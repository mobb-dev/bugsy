import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirName() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export function getTopLevelDirName(fullPath: string): string {
  return path.parse(fullPath).name
}

export default getDirName
