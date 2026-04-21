import { createHash } from 'node:crypto'
import path from 'node:path'

import AdmZip from 'adm-zip'
import pLimit from 'p-limit'

import { sanitizeDataWithCounts } from '../../utils/sanitize-sensitive-data'
import type { ContextFileEntry, SkillGroup } from './context_file_scanner'

const SANITIZE_CONCURRENCY = 5

export type ProcessedFile = {
  entry: ContextFileEntry
  sanitizedContent: string
  /** MD5 computed AFTER sanitization */
  md5: string
  sizeBytes: number
}

export type ProcessedSkill = {
  group: SkillGroup
  zipBuffer: Buffer
  /** MD5 computed on the zip buffer (all files sanitized before zipping) */
  md5: string
  sizeBytes: number
}

function md5Hex(data: string | Buffer): string {
  return createHash('md5')
    .update(typeof data === 'string' ? Buffer.from(data, 'utf-8') : data)
    .digest('hex')
}

async function sanitizeFileContent(content: string): Promise<string> {
  const { sanitizedData } = await sanitizeDataWithCounts(content, {
    noSizeLimit: true,
  })
  return sanitizedData as string
}

/**
 * Sanitize content of each file, compute MD5, and zip skill groups.
 * MD5 is always computed AFTER sanitization.
 */
export async function processContextFiles(
  regularFiles: ContextFileEntry[],
  skillGroups: SkillGroup[]
): Promise<{ files: ProcessedFile[]; skills: ProcessedSkill[] }> {
  const limit = pLimit(SANITIZE_CONCURRENCY)

  const processedFiles = await Promise.all(
    regularFiles.map((entry) =>
      limit(async (): Promise<ProcessedFile> => {
        const sanitizedContent = await sanitizeFileContent(entry.content)
        const md5 = md5Hex(sanitizedContent)
        const sizeBytes = Buffer.byteLength(sanitizedContent, 'utf-8')
        return { entry, sanitizedContent, md5, sizeBytes }
      })
    )
  )

  const processedSkills = await Promise.all(
    skillGroups
      .filter((group) => group.files.length > 0)
      .map((group) =>
        limit(async (): Promise<ProcessedSkill> => {
          const zip = new AdmZip()
          // Sort by path for deterministic zip ordering (stable MD5)
          const sortedFiles = [...group.files].sort((a, b) =>
            a.path.localeCompare(b.path)
          )
          for (const file of sortedFiles) {
            const sanitizedContent = await sanitizeFileContent(file.content)
            const zipEntryName = group.isFolder
              ? path.relative(group.skillPath, file.path).replace(/\\/g, '/')
              : path.basename(file.path)
            zip.addFile(zipEntryName, Buffer.from(sanitizedContent, 'utf-8'))
          }

          const zipBuffer = zip.toBuffer()
          const md5 = md5Hex(zipBuffer)
          return { group, zipBuffer, md5, sizeBytes: zipBuffer.byteLength }
        })
      )
  )

  return { files: processedFiles, skills: processedSkills }
}
