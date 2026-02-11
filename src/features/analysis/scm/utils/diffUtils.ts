import parseDiff, { AddChange } from 'parse-diff'

/**
 * Extracts added line numbers from a unified diff patch using parse-diff library.
 * This is a robust implementation that handles edge cases like binary files,
 * rename headers, and extended git headers.
 *
 * @param patch - Unified diff patch string for a single file
 * @returns Array of line numbers (in the new file) that were added
 */
export function parseAddedLinesFromPatch(patch: string): number[] {
  // Wrap the patch in a minimal diff format if it doesn't have file headers
  // parse-diff expects a full diff with --- and +++ headers
  const normalizedPatch = patch.includes('---')
    ? patch
    : `--- a/file\n+++ b/file\n${patch}`

  const parsedDiff = parseDiff(normalizedPatch)
  const addedLines: number[] = []

  for (const file of parsedDiff) {
    if (!file.chunks) {
      continue
    }

    for (const chunk of file.chunks) {
      for (const change of chunk.changes) {
        if (change.type === 'add') {
          const addChange = change as AddChange
          addedLines.push(addChange.ln)
        }
      }
    }
  }

  return addedLines
}

/**
 * Extracts added lines from a full diff (potentially multiple files).
 * Returns a map of file path to array of added line numbers.
 *
 * @param diff - Full unified diff string
 * @returns Map of file path to array of added line numbers
 */
export function parseAddedLinesByFile(diff: string): Map<string, number[]> {
  const result = new Map<string, number[]>()
  const parsedDiff = parseDiff(diff)

  for (const file of parsedDiff) {
    if (!file.to || file.to === '/dev/null') {
      continue // Skip deleted files
    }

    const filePath = file.to
    const addedLines: number[] = []

    if (file.chunks) {
      for (const chunk of file.chunks) {
        for (const change of chunk.changes) {
          if (change.type === 'add') {
            const addChange = change as AddChange
            addedLines.push(addChange.ln)
          }
        }
      }
    }

    if (addedLines.length > 0) {
      result.set(filePath, addedLines)
    }
  }

  return result
}
