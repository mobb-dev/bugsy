import path from 'node:path'

import {
  readRepoState,
  type RepoState,
} from '../../args/commands/upload_ai_blame'

/**
 * T-538 — temporary instrumentation, no behaviour change.
 *
 * ~49% of claude-code events upload with `repository_url` NULL because the batch's
 * repository is derived from the session's working directory. Measured on
 * production (7d, 955,256 null events) that population splits in two, and the two
 * halves need completely different fixes:
 *
 * | | share | fixable by |
 * | -- | -- | -- |
 * | no branch and no sha — cwd is not a git repo | 77.5% | resolving from the edited file's directory |
 * | branch/sha present — git worked, no usable remote | 22.5% | a `getRemoteUrl` gap |
 *
 * Neither half can be sized from the server: the distinguishing state is
 * client-side and never reaches the upload. This module logs both so the next
 * step is chosen on evidence rather than on the assumption that edited files sit
 * inside git checkouts — which is exactly the assumption in doubt.
 *
 * REMOVE once the ratios are known. Set `MOBB_DISABLE_REPO_DIAGNOSTICS=1` to turn
 * it off without a release.
 */

/**
 * Distinct file directories probed per call.
 *
 * Note this is per *chunk*, not per session: `processTranscript` runs inside
 * `drainTranscript`'s `while (hasMore)` loop at `DAEMON_CHUNK_SIZE` entries per
 * iteration, so a large catch-up calls this many times. The module-level
 * `probedDirectories` cache below is what keeps the total bounded by distinct
 * directories rather than by chunk count.
 */
const MAX_PROBED_DIRECTORIES = 2

/**
 * Directories already probed, shared across chunks for the daemon's lifetime.
 * Without this a 5,000-entry catch-up would re-probe the same handful of
 * directories on every 50-entry chunk — ~600 git invocations for an answer that
 * does not change.
 */
const probedDirectories = new Map<string, boolean>()

/** Bound on the memo, so a long-lived daemon cannot grow it without limit. */
const MAX_PROBED_ENTRIES = 500

type TranscriptEntry = Record<string, unknown>

type ContentBlock = {
  type?: string
  input?: Record<string, unknown>
}

/**
 * Absolute path of the file an entry operated on.
 *
 * Mirrors `ClaudeCodeParser.extractFilePath` including its branching on entry
 * type: a `user` entry reads `toolUseResult.filePath` and stops there, an
 * `assistant` entry reads the first `tool_use` block's `file_path` / `path`, and
 * anything else yields nothing. The branching matters — checking both sources for
 * every entry would additionally match `progress` / `attachment` / `system`
 * entries that the real parser discards, inflating the ratio this module exists to
 * measure. Sub-agent entries carry `role` instead of `type`, which is why the
 * effective type falls back to it.
 */
function extractFilePath(entry: TranscriptEntry): string | null {
  const effectiveType =
    (entry['type'] as string | undefined) ??
    (entry['role'] as string | undefined)

  if (effectiveType === 'user') {
    const toolUseResult = entry['toolUseResult']
    if (!toolUseResult || typeof toolUseResult !== 'object') {
      return null
    }
    const fp = (toolUseResult as Record<string, unknown>)['filePath']
    return typeof fp === 'string' && fp.length > 0 ? fp : null
  }

  if (effectiveType !== 'assistant') {
    return null
  }

  const message = entry['message'] as Record<string, unknown> | undefined
  const content = message?.['content']
  if (!Array.isArray(content)) {
    return null
  }
  for (const raw of content) {
    const block = raw as ContentBlock
    if (block?.type !== 'tool_use') {
      continue
    }
    const fp = block.input?.['file_path'] ?? block.input?.['path']
    return typeof fp === 'string' && fp.length > 0 ? fp : null
  }
  return null
}

/** Distinct parent directories of the files this batch touched, capped. */
function collectFileDirectories(entries: TranscriptEntry[]): string[] {
  const dirs = new Set<string>()
  for (const entry of entries) {
    const filePath = extractFilePath(entry)
    if (!filePath || !path.isAbsolute(filePath)) {
      continue
    }
    dirs.add(path.dirname(filePath))
    if (dirs.size >= MAX_PROBED_DIRECTORIES) {
      break
    }
  }
  return [...dirs]
}

/** Does this directory resolve to a repository? Memoized across chunks. */
async function directoryResolvesRepo(dir: string): Promise<boolean> {
  const memoized = probedDirectories.get(dir)
  if (memoized !== undefined) {
    return memoized
  }
  const probed = await readRepoState(dir)
  const resolved = probed.repositoryUrl !== null
  if (probedDirectories.size >= MAX_PROBED_ENTRIES) {
    probedDirectories.clear()
  }
  probedDirectories.set(dir, resolved)
  return resolved
}

type DiagnosticLogger = {
  info: (obj: { data: Record<string, unknown> }, msg: string) => void
}

export const NULL_REPO_DIAGNOSTIC_MESSAGE = 'Null repository_url diagnostic'

/** @internal Test-only helper to reset the cross-chunk probe memo. */
export function _clearProbedDirectoriesForTesting(): void {
  probedDirectories.clear()
}

/**
 * Emit one line per batch that resolved no repository URL. No-op otherwise, so
 * batches that already carry a repository cost nothing.
 *
 * Not awaited by the caller: nothing consumes the result, and the probes must not
 * sit in front of an upload. Never rejects.
 */
export async function logNullRepoDiagnostics(
  entries: TranscriptEntry[],
  repoState: RepoState,
  cwd: string | undefined,
  log: DiagnosticLogger
): Promise<void> {
  if (repoState.repositoryUrl !== null) {
    return
  }
  if (process.env['MOBB_DISABLE_REPO_DIAGNOSTICS'] === '1') {
    return
  }

  // branch/sha present means git resolved a repo and only the remote lookup
  // failed — the 22.5% bucket, where `repoUrlCause` is the whole answer and
  // probing file paths would tell us nothing new.
  const cwdIsRepo = repoState.branch !== null || repoState.commitSha !== null

  let filesProbed = 0
  let filesResolvingRepo = 0
  let probeErrors = 0

  if (!cwdIsRepo) {
    for (const dir of collectFileDirectories(entries)) {
      try {
        const resolved = await directoryResolvesRepo(dir)
        filesProbed++
        if (resolved) {
          filesResolvingRepo++
        }
      } catch {
        // Counted rather than swallowed: a dropped probe that silently vanished
        // would bias the very ratio this module computes.
        probeErrors++
      }
    }
  }

  // Deliberately outside the probe loop's error handling — a probe failure must
  // cost one data point, not the whole line.
  log.info(
    {
      data: {
        // Which of the null causes fired.
        repoUrlCause: repoState.repoUrlCause,
        cwdIsRepo,
        hasCwd: cwd !== undefined,
        entryCount: entries.length,
        // Would the edited file's directory have resolved where cwd did not?
        // `filesProbed: 0` means the batch touched no absolute file path at all —
        // a distinct outcome from "probed and found nothing".
        filesProbed,
        filesResolvingRepo,
        probeErrors,
      },
    },
    NULL_REPO_DIAGNOSTIC_MESSAGE
  )
}
