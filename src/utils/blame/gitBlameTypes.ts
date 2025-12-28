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
 * Represents a file chunk for blame data storage.
 * Files are split into chunks of 10,000 lines for efficient S3 storage.
 */
export const ChunkZ = z.object({
  filePath: z.string(),
  chunkIndex: z.number(),
})

export type Chunk = z.infer<typeof ChunkZ>

/**
 * Represents a changed file with its modified line numbers.
 * Used for tracking which lines in a diff need blame data.
 */
export const ChangedFileZ = z.object({
  filePath: z.string(),
  changedLines: z.array(z.number()),
})

export type ChangedFile = z.infer<typeof ChangedFileZ>

/**
 * Request for fetching blame data for a specific line.
 */
export const LineBlameRequestZ = z.object({
  filePath: z.string(),
  lineNumber: z.number(),
})

export type LineBlameRequest = z.infer<typeof LineBlameRequestZ>

/**
 * Chunk group for batch fetching blame data.
 */
export const ChunkGroupZ = z.object({
  filePath: z.string(),
  chunkIndex: z.number(),
  lines: z.array(z.number()),
})

export type ChunkGroup = z.infer<typeof ChunkGroupZ>

// Utility functions are in gitBlameUtils.ts

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
 * Changed files for commit blame request.
 * Record format: { [filePath]: chunkIndices[] }
 * - Empty array [] = entire file (small files, no chunking)
 * - [0, 1, 2] = specific chunks to process (large files)
 */
export const ChangedFilesZ = z.record(z.string(), z.array(z.number()))

export type ChangedFiles = z.infer<typeof ChangedFilesZ>

/**
 * Request message for commit blame line mapping consumer.
 *
 * The consumer analyzes files in a commit using git blame to extract:
 * - Original line numbers (as they appeared in the introducing commit)
 * - Current line numbers (as they appear in the PR head)
 * - Commit SHAs (which commit introduced each line)
 *
 * For large files (> 1k lines), files are split into chunks.
 * Each chunk is processed separately and stored with its chunk index.
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
  /**
   * Files to analyze as record: { [filePath]: chunkIndices[] }
   * - Empty array [] = blame entire file
   * - [0, 1] = blame specific chunks
   */
  changedFiles: ChangedFilesZ,
  /** Authentication headers for repository access (e.g., GitHub token) */
  extraHeaders: z.record(z.string(), z.string()).default({}),
  /** First relevant commit SHA in the PR (for commit context) */
  firstRelevantCommitSha: z.string(),
  fetchCommitCount: z.number(),
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
})
// Preferred: Use Schema suffix for new code
export const PrepareCommitBlameResponseMessageSchema =
  PrepareCommitBlameResponseMessageZ

export type PrepareCommitBlameResponseMessage = z.infer<
  typeof PrepareCommitBlameResponseMessageZ
>
