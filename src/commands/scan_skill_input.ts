import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'

import { CliError } from '../utils'

const LOCAL_SKILL_ZIP_DATA_URL_PREFIX = 'data:application/zip;base64,'
const MAX_LOCAL_SKILL_ARCHIVE_BYTES = 2 * 1024 * 1024

export async function resolveSkillScanInput(
  skillInput: string
): Promise<string> {
  const resolvedPath = path.resolve(skillInput)
  if (!fs.existsSync(resolvedPath)) {
    return skillInput
  }

  const stat = fs.statSync(resolvedPath)
  if (!stat.isDirectory()) {
    throw new CliError(
      'Local skill input must be a directory containing SKILL.md'
    )
  }

  return packageLocalSkillDirectory(resolvedPath)
}

function packageLocalSkillDirectory(directoryPath: string): string {
  const zip = new AdmZip()
  const rootPath = path.resolve(directoryPath)
  const filePaths = listDirectoryFiles(rootPath)

  let hasSkillMd = false
  for (const relativePath of filePaths) {
    const fullPath = path.join(rootPath, relativePath)
    const normalizedFullPath = path.resolve(fullPath)
    if (
      normalizedFullPath !== rootPath &&
      !normalizedFullPath.startsWith(rootPath + path.sep)
    ) {
      continue
    }

    const fileContent = fs.readFileSync(normalizedFullPath)
    zip.addFile(relativePath, fileContent)

    if (path.basename(relativePath).toLowerCase() === 'skill.md') {
      hasSkillMd = true
    }
  }

  if (!hasSkillMd) {
    throw new CliError('Local skill directory must contain a SKILL.md file')
  }

  const zipBuffer = zip.toBuffer()
  if (zipBuffer.length > MAX_LOCAL_SKILL_ARCHIVE_BYTES) {
    throw new CliError(
      `Local skill directory is too large to scan via CLI (${zipBuffer.length} bytes > ${MAX_LOCAL_SKILL_ARCHIVE_BYTES} bytes)`
    )
  }

  return `${LOCAL_SKILL_ZIP_DATA_URL_PREFIX}${zipBuffer.toString('base64')}`
}

function listDirectoryFiles(rootPath: string): string[] {
  const files: string[] = []

  function walk(relativeDir: string) {
    const absoluteDir = path.join(rootPath, relativeDir)
    const entries = fs
      .readdirSync(absoluteDir, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))

    for (const entry of entries) {
      const safeEntryName = path.basename(entry.name).replace(/\0/g, '')
      if (!safeEntryName) {
        continue
      }

      const relativePath = relativeDir
        ? path.posix.join(relativeDir, safeEntryName)
        : safeEntryName
      const absolutePath = path.join(rootPath, relativePath)
      const normalizedAbsolutePath = path.resolve(absolutePath)

      if (
        normalizedAbsolutePath !== rootPath &&
        !normalizedAbsolutePath.startsWith(rootPath + path.sep)
      ) {
        continue
      }

      if (entry.isSymbolicLink()) {
        continue
      }

      if (entry.isDirectory()) {
        walk(relativePath)
        continue
      }

      if (entry.isFile()) {
        files.push(relativePath)
      }
    }
  }

  walk('')
  return files
}
