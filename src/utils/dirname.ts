import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirName() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export default getDirName
