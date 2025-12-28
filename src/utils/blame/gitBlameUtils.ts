import type { FileBlameData, LineRange } from './gitBlameTypes'

/** Chunk size for large file splitting (1,000 lines per chunk) */
export const BLAME_CHUNK_SIZE = 1000

/**
 * Parses git blame --porcelain output and builds a 1-indexed array of blame info.
 *
 * Returns blame data as a 1-indexed array where:
 * - Index 0 is always null (no line 0)
 * - Index 1 = first line in output, index 2 = second line, etc.
 * - Total lines = result.length - 1
 *
 * @param output - Raw output from `git blame --porcelain` command
 * @returns 1-indexed array of blame info (FileBlameData)
 */
export function parseGitBlamePorcelain(output: string): FileBlameData {
  // Initialize 1-indexed array (index 0 is always null)
  const blameData: FileBlameData = [null]

  if (!output || output.trim().length === 0) {
    return blameData
  }

  const lines = output.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line || line.trim().length === 0) {
      i++
      continue
    }

    // Parse header line: <40-hex-sha> <orig-line> <final-line> <num-lines-in-group>
    // Example: "a1b2c3d4... 10 42 1"
    const headerMatch = line.match(
      /^([0-9a-f]{40})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/
    )

    if (!headerMatch) {
      // Not a header line, skip to next
      i++
      continue
    }

    const commitSha = headerMatch[1]
    const originalLine = parseInt(headerMatch[2]!, 10)

    // Validate parsed numbers
    if (isNaN(originalLine) || originalLine < 1) {
      i++
      continue
    }

    // Skip metadata lines until we find the content line (starts with tab)
    i++
    while (i < lines.length && !lines[i]!.startsWith('\t')) {
      i++
    }

    // Append blame info (array is 1-indexed, so push gives us indices 1, 2, 3...)
    blameData.push({
      originalLineNumber: originalLine,
      commitSha: commitSha!,
    })

    // Skip the content line (tab-prefixed line that while loop stopped at)
    if (i < lines.length) {
      i++
    }
  }

  return blameData
}

export type BlameLineInfo = {
  commit: string
  originalLine: number
}

/**
 * Parses git blame --porcelain output into a map keyed by final line number.
 * Useful for looking up blame info for specific lines in the current file version.
 *
 * @param output - Raw output from `git blame --porcelain` command
 * @returns Record mapping final line number to { commit, originalLine }
 */
export function parseGitBlamePorcelainByLine(
  output: string
): Record<number, BlameLineInfo> {
  const result: Record<number, BlameLineInfo> = {}

  if (!output || output.trim().length === 0) {
    return result
  }

  const lines = output.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!line?.trim()) {
      continue
    }

    // Format: <hash> <orig_lineno> <final_lineno> <num_lines>
    const match = line.match(/^([a-f0-9]+)\s+(\d+)\s+(\d+)/)
    if (match) {
      const commit = match[1]
      const originalLine = parseInt(match[2]!, 10)
      const finalLine = parseInt(match[3]!, 10)

      result[finalLine] = { commit: commit!, originalLine }
    }
  }

  return result
}

/**
 * Calculate chunk index for a given line number.
 * @param lineNumber - 1-indexed line number
 * @returns Chunk index (0 for lines 1-1000, 1 for lines 1001-2000, etc.)
 */
export function getChunkIndexForLine(lineNumber: number): number {
  return Math.floor((lineNumber - 1) / BLAME_CHUNK_SIZE)
}

/**
 * Options for building git blame command arguments.
 */
export type GitBlameArgsOptions = {
  /** Relative path to file within repository */
  filePath: string
  /** Optional line range for chunked processing (1-indexed, inclusive) */
  lineRange?: LineRange
} & (
  | {
      /**
       * Mode for blaming committed code at specific commit range.
       * Used by scm_agent for PR analysis.
       */
      mode: 'commitRange'
      /** First relevant commit SHA (for commit context) */
      firstRelevantCommitSha: string
      /** Commit SHA to blame at (e.g., PR head commit) */
      commitSha: string
    }
  | {
      /**
       * Mode for blaming working tree with optional dirty content.
       * Used by VS Code extension for live editor content.
       */
      mode: 'workingTree'
      /** Optional path to file containing content to blame (for dirty/unsaved files) */
      contentsPath?: string
    }
)

/**
 * Builds git blame command arguments for different use cases.
 *
 * Supports two modes:
 * - `commitRange`: For analyzing committed code at specific commits (scm_agent)
 * - `workingTree`: For analyzing working tree files, optionally with dirty content (VS Code extension)
 *
 * @param options - Options for building the blame command
 * @returns Array of git blame arguments (without 'git' itself)
 *
 * @example
 * // For scm_agent (commit range analysis)
 * buildGitBlameArgs({
 *   mode: 'commitRange',
 *   filePath: 'src/index.ts',
 *   firstRelevantCommitSha: 'abc123',
 *   commitSha: 'def456',
 * })
 * // Returns: ['blame', '--porcelain', '-l', 'abc123^..def456', 'src/index.ts']
 *
 * @example
 * // For VS Code extension (dirty file)
 * buildGitBlameArgs({
 *   mode: 'workingTree',
 *   filePath: 'src/index.ts',
 *   contentsPath: '/tmp/dirty-content.txt',
 * })
 * // Returns: ['blame', '--porcelain', '--contents', '/tmp/dirty-content.txt', '--', 'src/index.ts']
 *
 * @example
 * // For VS Code extension (clean file)
 * buildGitBlameArgs({
 *   mode: 'workingTree',
 *   filePath: 'src/index.ts',
 * })
 * // Returns: ['blame', '--porcelain', '--', 'src/index.ts']
 */
export function buildGitBlameArgs(options: GitBlameArgsOptions): string[] {
  const args: string[] = ['blame', '--porcelain']

  if (options.mode === 'commitRange') {
    // Add -l flag for long commit hashes (used by scm_agent)
    args.push('-l')

    // Add line range if specified
    if (options.lineRange) {
      args.push('-L', `${options.lineRange.start},${options.lineRange.end}`)
    }

    // Add commit range and file path
    args.push(
      `${options.firstRelevantCommitSha}^..${options.commitSha}`,
      options.filePath
    )
  } else {
    // workingTree mode
    // Add contents flag for dirty files
    if (options.contentsPath) {
      args.push('--contents', options.contentsPath)
    }

    // Add line range if specified
    if (options.lineRange) {
      args.push('-L', `${options.lineRange.start},${options.lineRange.end}`)
    }

    // Add separator and file path
    args.push('--', options.filePath)
  }

  return args
}

/**
 * Calculate line range for a given chunk index.
 * @param chunkIndex - Chunk index (0, 1, 2...) or undefined
 * @returns Line range for that chunk (1-indexed, inclusive), or undefined when chunking is disabled
 */
export function getLineRangeForChunk(
  chunkIndex: number | undefined
): LineRange | undefined {
  // `undefined` means "no chunking"; chunk index `0` is the first chunk.
  if (chunkIndex === undefined || chunkIndex < 0) {
    return undefined
  }
  return {
    start: chunkIndex * BLAME_CHUNK_SIZE + 1,
    end: (chunkIndex + 1) * BLAME_CHUNK_SIZE,
  }
}
