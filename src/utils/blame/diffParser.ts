import parseDiff from 'parse-diff'

/**
 * Represents a changed file with its modified line numbers.
 * Used for tracking which lines in a diff need blame data.
 */
export type ChangedFile = {
  filePath: string
  changedLines: number[]
}

/**
 * Extracts changed files, additions count, and deletions count from a unified diff.
 * Uses `parse-diff` for reliable parsing instead of hand-rolled regex.
 *
 * - `changedFiles`: files with their added line numbers (used by targeted blame)
 * - `additions` / `deletions`: total counts across all files
 *
 * @param diff - Unified diff string
 */
export function extractDiffStats(diff: string): {
  changedFiles: ChangedFile[]
  additions: number
  deletions: number
} {
  const parsedDiff = parseDiff(diff)

  let additions = 0
  let deletions = 0
  const changedFiles: ChangedFile[] = []

  for (const file of parsedDiff) {
    additions += file.additions
    deletions += file.deletions

    if (!file.to || file.to === '/dev/null') {
      continue // Skip deleted files for changedFiles list
    }

    const filePath = file.to
    const changedLines: number[] = []

    if (file.chunks) {
      for (const chunk of file.chunks) {
        let newLineNumber = chunk.newStart

        for (const change of chunk.changes) {
          if (change.type === 'add') {
            changedLines.push(newLineNumber)
            newLineNumber++
          } else if (change.type === 'normal') {
            newLineNumber++
          }
          // 'del' type: don't increment newLineNumber
        }
      }
    }

    if (changedLines.length > 0) {
      changedFiles.push({ filePath, changedLines })
    }
  }

  return { changedFiles, additions, deletions }
}
