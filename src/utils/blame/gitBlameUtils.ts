import type {
  BlameInfo,
  CommitMetadata,
  CommitMetadataMap,
  FileBlameData,
  LineRange,
  LineToCommitMap,
} from './gitBlameTypes'

// ---------------------------------------------------------------------------
// Core porcelain parser (private)
// ---------------------------------------------------------------------------

type PorcelainEntry = {
  commitSha: string
  originalLine: number
  finalLine: number
}

type PorcelainParseResult = {
  entries: PorcelainEntry[]
  commitMetadata: Record<string, Record<string, string>>
}

function parsePorcelainCore(output: string): PorcelainParseResult {
  const entries: PorcelainEntry[] = []
  const commitMetadata: Record<string, Record<string, string>> = {}

  if (!output?.trim()) return { entries, commitMetadata }

  const lines = output.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line?.trim()) {
      i++
      continue
    }

    const match = line.match(/^([0-9a-f]{40})\s+(\d+)\s+(\d+)/)
    if (!match) {
      i++
      continue
    }

    const commitSha = match[1]!
    const originalLine = parseInt(match[2]!, 10)
    const finalLine = parseInt(match[3]!, 10)

    // Parse all metadata key-value lines until tab-prefixed content line
    i++
    if (!commitMetadata[commitSha]) {
      commitMetadata[commitSha] = {}
    }
    while (i < lines.length && !lines[i]!.startsWith('\t')) {
      const metaLine = lines[i]!
      const spaceIdx = metaLine.indexOf(' ')
      if (spaceIdx > 0) {
        const key = metaLine.slice(0, spaceIdx)
        const value = metaLine.slice(spaceIdx + 1)
        commitMetadata[commitSha][key] = value
      }
      i++
    }

    // Skip content line
    if (i < lines.length) i++

    entries.push({ commitSha, originalLine, finalLine })
  }

  return { entries, commitMetadata }
}

// ---------------------------------------------------------------------------
// Public parsers (thin wrappers over parsePorcelainCore)
// ---------------------------------------------------------------------------

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
  const { entries } = parsePorcelainCore(output)
  const blameData: FileBlameData = [null]
  for (const entry of entries) {
    blameData.push({
      originalLineNumber: entry.originalLine,
      commitSha: entry.commitSha,
    })
  }
  return blameData
}

export type BlameLineInfo = {
  commit: string
  originalLine: number
  authorName?: string
  authorEmail?: string
  authorTime?: number
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
  const { entries, commitMetadata } = parsePorcelainCore(output)
  const result: Record<number, BlameLineInfo> = {}
  for (const entry of entries) {
    const meta = commitMetadata[entry.commitSha]
    result[entry.finalLine] = {
      commit: entry.commitSha,
      originalLine: entry.originalLine,
      authorName: meta?.['author'],
      authorEmail: meta?.['author-mail']?.replace(/^<|>$/g, ''),
      authorTime: meta?.['author-time']
        ? parseInt(meta['author-time'], 10)
        : undefined,
    }
  }
  return result
}

/**
 * Parses git blame --porcelain output into a BlameInfo structure
 * containing lineToCommit and commitMetadata maps.
 *
 * Used by scm_agent's full-file blame flow.
 *
 * @param output - Raw output from `git blame --porcelain` command
 * @returns BlameInfo with lineToCommit mapping and commit metadata
 */
export function parseGitBlamePorcelainToBlameInfo(output: string): BlameInfo {
  const { entries, commitMetadata } = parsePorcelainCore(output)
  const lineToCommit: LineToCommitMap = {}
  for (const entry of entries) {
    lineToCommit[entry.finalLine] = entry.commitSha
  }

  // Git blame skips final empty lines; mirror the last real line's blame
  const maxLine = Math.max(0, ...Object.keys(lineToCommit).map(Number))
  if (maxLine > 0 && lineToCommit[maxLine]) {
    lineToCommit[maxLine + 1] = lineToCommit[maxLine]
  }

  // Cast generic metadata to CommitMetadataMap
  const typedMetadata: CommitMetadataMap = {}
  for (const [sha, meta] of Object.entries(commitMetadata)) {
    typedMetadata[sha] = meta as CommitMetadata
  }

  return { lineToCommit, commitMetadata: typedMetadata }
}

/**
 * Options for building git blame command arguments.
 */
export type GitBlameArgsOptions = {
  /** Relative path to file within repository */
  filePath: string
  /** Optional line ranges for processing (1-indexed, inclusive). Multiple ranges produce multiple -L flags. */
  lineRanges?: LineRange[]
} & (
  | {
      /**
       * Mode for blaming a diff range between two refs.
       * Used by scm_agent for PR analysis (computeTargetedBlame).
       */
      mode: 'diffRange'
      /** Base ref for the diff range (e.g., merge-base SHA) */
      baseRef: string
      /** Head ref (e.g., 'HEAD') */
      headRef: string
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
 * - `diffRange`: For analyzing a diff range between two refs (scm_agent)
 * - `workingTree`: For analyzing working tree files, optionally with dirty content (VS Code extension)
 *
 * @param options - Options for building the blame command
 * @returns Array of git blame arguments (without 'git' itself)
 *
 * @example
 * // For scm_agent (diff range analysis)
 * buildGitBlameArgs({
 *   mode: 'diffRange',
 *   filePath: 'src/index.ts',
 *   baseRef: 'abc123',
 *   headRef: 'HEAD',
 *   lineRanges: [{ start: 10, end: 20 }],
 * })
 * // Returns: ['blame', '--porcelain', '-L', '10,20', 'abc123..HEAD', '--', 'src/index.ts']
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

  if (options.mode === 'diffRange') {
    // Add line ranges if specified
    if (options.lineRanges) {
      for (const range of options.lineRanges) {
        args.push('-L', `${range.start},${range.end}`)
      }
    }

    // Add diff range and file path
    args.push(`${options.baseRef}..${options.headRef}`, '--', options.filePath)
  } else {
    // workingTree mode
    // Add contents flag for dirty files
    if (options.contentsPath) {
      args.push('--contents', options.contentsPath)
    }

    // Add line ranges if specified
    if (options.lineRanges) {
      for (const range of options.lineRanges) {
        args.push('-L', `${range.start},${range.end}`)
      }
    }

    // Add separator and file path
    args.push('--', options.filePath)
  }

  return args
}
