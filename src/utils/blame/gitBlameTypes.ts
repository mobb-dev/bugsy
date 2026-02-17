import { z } from 'zod'

// ============================================================================
// Naming Convention: Use `Schema` suffix for Zod schemas (see ZOD_NAMING_CONVENTION.md)
// Legacy `Z` suffix maintained for backwards compatibility
// ============================================================================

export const PrepareGitBlameMessageZ = z.object({
  reportId: z.string(),
  repoArchivePath: z.string(),
})
// Preferred: Use Schema suffix for new code
export const PrepareGitBlameMessageSchema = PrepareGitBlameMessageZ

export type PrepareGitBlameMessage = z.infer<typeof PrepareGitBlameMessageZ>

export const PrepareGitBlameResponseMessageZ = z.object({
  reportId: z.string(),
})
// Preferred: Use Schema suffix for new code
export const PrepareGitBlameResponseMessageSchema =
  PrepareGitBlameResponseMessageZ

export type PrepareGitBlameResponseMessage = z.infer<
  typeof PrepareGitBlameResponseMessageZ
>

export const CommitMetadataZ = z.object({
  author: z.string().optional(),
  'author-mail': z.string().optional(),
  'author-time': z.string().optional(),
  'author-tz': z.string().optional(),
  committer: z.string().optional(),
  'committer-mail': z.string().optional(),
  'committer-time': z.string().optional(),
  'committer-tz': z.string().optional(),
  summary: z.string().optional(),
  filename: z.string().optional(),
})
export const CommitMetadataSchema = CommitMetadataZ

export type CommitMetadata = z.infer<typeof CommitMetadataZ>

export const LineToCommitMapZ = z.record(z.string(), z.string())
export const CommitMetadataMapZ = z.record(z.string(), CommitMetadataZ)

export type LineToCommitMap = z.infer<typeof LineToCommitMapZ>
export type CommitMetadataMap = z.infer<typeof CommitMetadataMapZ>

export const BlameInfoZ = z.object({
  lineToCommit: LineToCommitMapZ,
  commitMetadata: CommitMetadataMapZ,
})

export type BlameInfo = z.infer<typeof BlameInfoZ>

// ============================================================================
// Commit Blame Line Mapping Types
// ============================================================================
// These types are used for mapping PR diff lines to original line numbers
// in the introducing commit via git blame analysis.

/**
 * Line range for chunked file processing.
 */
export const LineRangeZ = z.object({
  /** First line in chunk (1-indexed) */
  start: z.number(),
  /** Last line in chunk (inclusive) */
  end: z.number(),
})

export type LineRange = z.infer<typeof LineRangeZ>

/**
 * Context for triggering blame attribution analysis after SCM agent completes PR diff computation.
 * Passed through the message so the response handler has enough context
 * to call processCommitsForAIAttribution.
 */
export const PrContextZ = z.object({
  prNumber: z.number(),
  repositoryUrl: z.string(),
  organizationId: z.string(),
  userEmail: z.string(),
  source: z.enum(['pr', 'github']),
  githubContext: z
    .object({
      prNumber: z.number(),
      installationId: z.number(),
      repositoryURL: z.string(),
    })
    .optional(),
})

export type PrContext = z.infer<typeof PrContextZ>

/**
 * Request message for commit blame line mapping consumer.
 *
 * The consumer analyzes files in a commit using git blame to extract:
 * - Original line numbers (as they appeared in the introducing commit)
 * - Current line numbers (as they appear in the PR head)
 * - Commit SHAs (which commit introduced each line)
 *
 * When `targetBranch` is provided, the SCM agent enters PR analysis mode:
 * discovers commits via merge-base and computes diffs from the clone.
 * Without `targetBranch`, enters single commit mode.
 */
export const PrepareCommitBlameMessageZ = z.object({
  /** Commit blame request ID from database (for tracking and updating status) */
  commitBlameRequestId: z.string(),
  /** Organization ID (for org-scoped caching) */
  organizationId: z.string(),
  /** Full repository URL (e.g., https://github.com/org/repo) */
  repositoryUrl: z.string(),
  /** Commit SHA to analyze (typically PR head commit) */
  commitSha: z.string(),
  /** Authentication headers for repository access (e.g., GitHub token) */
  extraHeaders: z.record(z.string(), z.string()).default({}),

  // --- PR analysis fields ---
  /** Target branch name (from getPr() base.ref). When set, enables PR analysis mode. */
  targetBranch: z.string().optional(),
  /** Context for triggering blame attribution analysis after SCM agent completes. */
  prContext: PrContextZ.optional(),
  /** User email for blame attribution analysis trigger context (used for both PR and single commit flows). */
  userEmail: z.string().optional(),
})
// Preferred: Use Schema suffix for new code
export const PrepareCommitBlameMessageSchema = PrepareCommitBlameMessageZ

export type PrepareCommitBlameMessage = z.infer<
  typeof PrepareCommitBlameMessageZ
>

/**
 * Blame info for a single line.
 * null if the line doesn't exist (e.g., index 0 in 1-indexed array).
 */

export const BlameLineInfoZ = z
  .object({
    /** Line number as it appeared in the introducing commit */
    originalLineNumber: z.number(),
    /** Commit SHA that introduced this line */
    commitSha: z.string(),
    /** Author name for this line */
    authorName: z.string().optional(),
    /** Author email for this line */
    authorEmail: z.string().optional(),
  })
  .nullable()

export type BlameLineInfo = z.infer<typeof BlameLineInfoZ>

/**
 * Line mapping for a single file chunk.
 * Array format where index = line number (1-indexed within chunk).
 * Index 0 is always null (no line 0).
 *
 * For chunked files, indices are relative to the chunk:
 * - Chunk 0: index 1 = line 1, index 10000 = line 10000
 * - Chunk 1: index 1 = line 10001, index 10000 = line 20000
 */
export const FileBlameDataZ = z.array(BlameLineInfoZ)

export type FileBlameData = z.infer<typeof FileBlameDataZ>

/**
 * Result of fetching a chunk from S3.
 */
export const ChunkFetchResultZ = z.object({
  filePath: z.string(),
  lines: z.array(z.number()),
  data: FileBlameDataZ.nullable(),
})

export type ChunkFetchResult = z.infer<typeof ChunkFetchResultZ>

/**
 * Blame data entry for a file/chunk in the response.
 * Note: Total lines can be computed as data.length - 1 (1-indexed array).
 */
export const FileBlameResponseEntryZ = z.object({
  /** Chunk index (0 for small files, 0-N for large file chunks) */
  chunkIndex: z.number(),
  /** Blame data array (1-indexed, index 0 is null) */
  blameData: FileBlameDataZ,
})

export type FileBlameResponseEntry = z.infer<typeof FileBlameResponseEntryZ>

/**
 * Full blame data structure for a commit response.
 * Structure: { [fileName]: FileBlameResponseEntry[] }
 * Each file can have multiple chunk entries.
 */
export const CommitBlameDataZ = z.record(
  z.string(), // fileName
  z.array(FileBlameResponseEntryZ)
)

export type CommitBlameData = z.infer<typeof CommitBlameDataZ>

/**
 * Info about a commit referenced in blame data.
 */
export const CommitInfoZ = z.object({
  /** Number of parent commits (1 = normal commit, 2+ = merge commit, null = failed to determine) */
  parentCount: z.number().nullable(),
})

export type CommitInfo = z.infer<typeof CommitInfoZ>

/**
 * Commit-level data stored in S3 at commits/{commitSha}.json.
 * Shared across PR and single-commit analyses.
 */
export const CommitDataZ = z.object({
  diff: z.string(),
  authorEmail: z.string().optional(),
  authorName: z.string().optional(),
  timestamp: z.number(), // Unix timestamp in seconds
  message: z.string().optional(),
  parentCount: z.number().nullable(),
})

export type CommitData = z.infer<typeof CommitDataZ>

/**
 * PR-level diff data stored in S3 at {headCommitSha}/pr-diff.json.
 */
export const PrDiffDataZ = z.object({
  diff: z.string(),
})

export type PrDiffData = z.infer<typeof PrDiffDataZ>

/**
 * PR-level stats stored in S3 at {headCommitSha}/pr-stats.json.
 * Pre-computed additions/deletions so consumers don't need to re-parse the diff.
 */
export const PrStatsZ = z.object({
  additions: z.number(),
  deletions: z.number(),
})

export type PrStats = z.infer<typeof PrStatsZ>

/**
 * Commits manifest stored in S3 at {headCommitSha}/commits-manifest.json.
 */
export const CommitsManifestZ = z.object({
  commits: z.array(z.string()), // Array of commit SHAs in order
})

export type CommitsManifest = z.infer<typeof CommitsManifestZ>

/**
 * A single blame line entry for targeted blame data.
 */
export const BlameLineEntryZ = z.object({
  file: z.string(),
  line: z.number(),
  originalCommitSha: z.string(),
  originalLineNumber: z.number(),
})

export type BlameLineEntry = z.infer<typeof BlameLineEntryZ>

/**
 * Targeted blame data stored in S3 at {headCommitSha}/blame-lines.json.
 * Contains per-line blame info for added lines in the PR diff.
 */
export const BlameLinesDataZ = z.object({
  lines: z.array(BlameLineEntryZ),
})

export type BlameLinesData = z.infer<typeof BlameLinesDataZ>

/**
 * Response message from commit blame line mapping consumer.
 *
 * On success: Contains blame data for all processed files/chunks
 * On failure: Contains error message, blame data is empty
 */
export const PrepareCommitBlameResponseMessageZ = z.object({
  /** Commit blame request ID (matches request, used to update specific DB record) */
  commitBlameRequestId: z.string(),
  /** Organization ID (matches request) */
  organizationId: z.string(),
  /** Repository URL (matches request) */
  repositoryUrl: z.string(),
  /** Commit SHA analyzed (matches request) */
  commitSha: z.string(),
  /** Processing status */
  status: z.enum(['success', 'failure']),
  /** Error message (only present if status is 'failure') */
  error: z.string().optional(),
  /**
   * Blame data for all processed files/chunks.
   * Empty dictionary if status is 'failure'.
   * Contains line mappings as arrays if status is 'success'.
   */
  blameData: CommitBlameDataZ,
  /**
   * Info about each commit referenced in the blame data plus the head commit.
   * Keyed by commit SHA, deduplicated.
   * Empty dictionary if status is 'failure'.
   */
  commits: z.record(z.string(), CommitInfoZ).default({}),

  // --- New PR diff computation response fields ---
  /** S3 paths for commit-level data (commitSha → S3 key). Present in PR analysis mode and single commit mode. */
  commitDataS3Paths: z.record(z.string(), z.string()).optional(),
  /** S3 key for PR diff JSON. Present in PR analysis mode. */
  prDiffS3Path: z.string().optional(),
  /** S3 key for commits manifest. Present in PR analysis mode. */
  commitsManifestS3Path: z.string().optional(),
  /** S3 key for per-line targeted blame data. Present in PR analysis mode. */
  blameLinesS3Path: z.string().optional(),
  /** S3 key for PR stats (additions/deletions). Present in PR analysis mode. */
  prStatsS3Path: z.string().optional(),
  /** PR context passed through from request for response handler. */
  prContext: PrContextZ.optional(),
  /** PR title from the request metadata (passed through). */
  prTitle: z.string().optional(),
  /** User email passed through from request for single commit blame attribution analysis trigger. */
  userEmail: z.string().optional(),
})
// Preferred: Use Schema suffix for new code
export const PrepareCommitBlameResponseMessageSchema =
  PrepareCommitBlameResponseMessageZ

export type PrepareCommitBlameResponseMessage = z.infer<
  typeof PrepareCommitBlameResponseMessageZ
>
