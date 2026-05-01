import type {
  BlameInfo,
  CommitMetadata,
  CommitMetadataMap,
  FileBlameData,
  LineRange,
  LineToCommitMap,
} from './gitBlameTypes'

// ---------------------------------------------------------------------------
// Core porcelain parser (exported for unit tests; public APIs wrap this)
// ---------------------------------------------------------------------------

type PorcelainEntry = {
  commitSha: string
  originalLine: number
  finalLine: number
  /**
   * File path at the time `commitSha` authored this line.
   *
   * Git emits `filename <path>` per entry in porcelain output (it's the last
   * metadata line before the tab-prefixed content line). When a file has been
   * renamed, the same `commitSha` can appear with different `originalFile`
   * values across different entries — which is why we capture it per-entry
   * here rather than treating it as commit-level metadata.
   *
   * Empty string if the porcelain output did not include a filename field
   * (should not happen for valid porcelain, but callers should fall back).
   */
  originalFile: string
}

type PorcelainParseResult = {
  entries: PorcelainEntry[]
  commitMetadata: Record<string, Record<string, string>>
}

const GIT_BLAME_PORCELAIN_ENTRY_LINE_RE = /^([0-9a-f]{40})\s+(\d+)\s+(\d+)/

export function parsePorcelainCore(output: string): PorcelainParseResult {
  const entries: PorcelainEntry[] = []
  const commitMetadata: Record<string, Record<string, string>> = {}
  // Git porcelain emits `filename` once per group (a contiguous run of
  // lines from the same commit+path). Subsequent entries in the same
  // group have no `filename` metadata. We carry forward the last seen
  // filename so every entry gets a populated `originalFile` — with the
  // caveat that a rename-following blame can switch filename mid-output
  // (new group, new `filename` line), which is handled because
  // lastFilename is re-assigned at every emission.
  let lastFilename = ''

  if (!output?.trim()) return { entries, commitMetadata }

  const lines = output.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line?.trim()) {
      i++
      continue
    }

    const match = line.match(GIT_BLAME_PORCELAIN_ENTRY_LINE_RE)
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
    let entryFilename = ''
    while (i < lines.length && !lines[i]!.startsWith('\t')) {
      const metaLine = lines[i]!
      const spaceIdx = metaLine.indexOf(' ')
      if (spaceIdx > 0) {
        const key = metaLine.slice(0, spaceIdx)
        const value = metaLine.slice(spaceIdx + 1)
        commitMetadata[commitSha][key] = value
        if (key === 'filename') {
          entryFilename = value
          lastFilename = value
        }
      }
      i++
    }

    // Skip content line
    if (i < lines.length) i++

    entries.push({
      commitSha,
      originalLine,
      finalLine,
      originalFile: entryFilename || lastFilename,
    })
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
  /**
   * File path as it was in `commit` at the time that commit authored this line.
   * This may differ from the current file path when a file has been renamed
   * since `commit`. Callers that use this for lookup should fall back to the
   * current file path when `originalFile` is empty (defensive; porcelain
   * should always emit a filename).
   */
  originalFile: string
  authorName?: string
  authorEmail?: string
  authorTime?: number
}

/**
 * Parses git blame --porcelain output into a map keyed by final line number.
 * Useful for looking up blame info for specific lines in the current file version.
 *
 * @param output - Raw output from `git blame --porcelain` command
 * @returns Record mapping final line number to { commit, originalLine, originalFile, ... }
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
      originalFile: entry.originalFile,
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
 * // Returns: ['blame', '--porcelain', '-M', '-L', '10,20', 'abc123..HEAD', '--', 'src/index.ts']
 *
 * @example
 * // For VS Code extension (dirty file)
 * buildGitBlameArgs({
 *   mode: 'workingTree',
 *   filePath: 'src/index.ts',
 *   contentsPath: '/tmp/dirty-content.txt',
 * })
 * // Returns: ['blame', '--porcelain', '-M', '--contents', '/tmp/dirty-content.txt', '--', 'src/index.ts']
 *
 * @example
 * // For VS Code extension (clean file)
 * buildGitBlameArgs({
 *   mode: 'workingTree',
 *   filePath: 'src/index.ts',
 * })
 * // Returns: ['blame', '--porcelain', '-M', '--', 'src/index.ts']
 */
export function buildGitBlameArgs(options: GitBlameArgsOptions): string[] {
  // `-M` enables rename detection: when a line's origin is traced through
  // a pure-rename commit (a `git mv` with no content changes), blame keeps
  // walking back to the commit that actually authored the line rather than
  // stopping at the rename. Combined with the per-entry `filename` field in
  // porcelain output, this lets the attribution lookup resolve the line's
  // historical path — even when the file has been renamed since it was
  // authored. Harmless in `workingTree` mode (single-file blame).
  const args: string[] = ['blame', '--porcelain', '-M']

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
