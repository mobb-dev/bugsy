import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { RepoState } from '../../../args/commands/upload_ai_blame'

const mocks = vi.hoisted(() => ({
  readRepoState: vi.fn(),
}))

vi.mock('../../../args/commands/upload_ai_blame', () => ({
  readRepoState: mocks.readRepoState,
}))

const {
  logNullRepoDiagnostics,
  NULL_REPO_DIAGNOSTIC_MESSAGE,
  _clearProbedDirectoriesForTesting,
} = await import('../repo_diagnostics')

function repoState(overrides: Partial<RepoState> = {}): RepoState {
  return {
    repositoryUrl: null,
    branch: null,
    commitSha: null,
    repoUrlCause: 'not-a-repo',
    ...overrides,
  }
}

/** An assistant entry whose tool_use edits `filePath`. */
function editEntry(filePath: string): Record<string, unknown> {
  return {
    type: 'assistant',
    message: {
      content: [
        { type: 'text', text: 'editing' },
        { type: 'tool_use', name: 'Edit', input: { file_path: filePath } },
      ],
    },
  }
}

/** A user entry carrying an Edit tool result. */
function editResultEntry(filePath: string): Record<string, unknown> {
  return { type: 'user', toolUseResult: { filePath } }
}

function makeLog() {
  return { info: vi.fn() }
}

function loggedData(log: ReturnType<typeof makeLog>): Record<string, unknown> {
  const call = log.info.mock.calls[0]
  return (call![0] as { data: Record<string, unknown> }).data
}

describe('logNullRepoDiagnostics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    _clearProbedDirectoriesForTesting()
    delete process.env['MOBB_DISABLE_REPO_DIAGNOSTICS']
    mocks.readRepoState.mockResolvedValue(repoState())
  })

  it('should stay silent when the batch already resolved a repository', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState({
        repositoryUrl: 'https://github.com/org/repo',
        repoUrlCause: 'ok',
      }),
      '/repo',
      log
    )

    expect(log.info).not.toHaveBeenCalled()
    expect(mocks.readRepoState).not.toHaveBeenCalled()
  })

  it('should be disabled by the env kill switch', async () => {
    // Self-declared temporary instrumentation shipped to all users; turning it
    // off must not require a release.
    process.env['MOBB_DISABLE_REPO_DIAGNOSTICS'] = '1'
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(log.info).not.toHaveBeenCalled()
  })

  it('should report the cause without probing when git found a repo but no remote', async () => {
    // The 22.5% bucket: branch/sha present means git worked, so probing file
    // paths would tell us nothing the cause does not already say.
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState({
        branch: 'main',
        commitSha: 'a'.repeat(40),
        repoUrlCause: 'no-remote',
      }),
      '/repo',
      log
    )

    expect(mocks.readRepoState).not.toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({
      repoUrlCause: 'no-remote',
      cwdIsRepo: true,
      filesProbed: 0,
    })
  })

  it('should probe file directories when cwd is not a git repo', async () => {
    // The 77.5% bucket, and the question that gates building file-path stamping.
    mocks.readRepoState.mockResolvedValue(
      repoState({
        repositoryUrl: 'https://github.com/org/repo',
        repoUrlCause: 'ok',
      })
    )
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).toHaveBeenCalledWith('/repo/src')
    expect(loggedData(log)).toMatchObject({
      cwdIsRepo: false,
      filesProbed: 1,
      filesResolvingRepo: 1,
    })
  })

  it('should distinguish "probed and found nothing" from "no file paths at all"', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/tmp/scratch/a.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(loggedData(log)).toMatchObject({
      filesProbed: 1,
      filesResolvingRepo: 0,
    })
  })

  it('should report zero probes when the batch touched no file paths', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [{ type: 'user', message: { content: 'just a prompt' } }],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).not.toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({ filesProbed: 0 })
  })

  // --- Parity with the server parser --------------------------------------
  // The whole justification for this module is that it measures the same signal
  // the real fix would use. A superset would inflate the ratio.

  it('should read a user entry from toolUseResult only', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editResultEntry('/repo/src/b.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).toHaveBeenCalledWith('/repo/src')
  })

  it('should not read a user entry from its content blocks', async () => {
    // ClaudeCodeParser stops at toolUseResult for user entries. Falling through
    // to content here would count paths the real parser discards.
    const log = makeLog()

    await logNullRepoDiagnostics(
      [
        {
          type: 'user',
          message: {
            content: [
              { type: 'tool_use', input: { file_path: '/repo/src/c.ts' } },
            ],
          },
        },
      ],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).not.toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({ filesProbed: 0 })
  })

  it('should ignore entry types the server parser discards', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [
        { type: 'progress', toolUseResult: { filePath: '/repo/src/d.ts' } },
        { type: 'attachment', toolUseResult: { filePath: '/repo/src/e.ts' } },
      ],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).not.toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({ filesProbed: 0 })
  })

  it('should treat a sub-agent role as its effective type', async () => {
    // Sub-agent entries use the Anthropic API shape and carry `role`, not `type`.
    const log = makeLog()

    await logNullRepoDiagnostics(
      [{ role: 'user', toolUseResult: { filePath: '/repo/src/f.ts' } }],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).toHaveBeenCalledWith('/repo/src')
  })

  // --- Cost control --------------------------------------------------------

  it('should cap probing so a large batch cannot flood the hook path with git calls', async () => {
    const log = makeLog()
    const entries = Array.from({ length: 50 }, (_, i) =>
      editEntry(`/repo/dir${i}/file.ts`)
    )

    await logNullRepoDiagnostics(entries, repoState(), '/tmp/scratch', log)

    expect(mocks.readRepoState).toHaveBeenCalledTimes(2)
  })

  it('should not re-probe a directory across chunks', async () => {
    // processTranscript runs once per DAEMON_CHUNK_SIZE entries inside
    // drainTranscript's loop, so without this memo a long catch-up would re-probe
    // the same handful of directories hundreds of times.
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )
    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState(),
      '/tmp/scratch',
      makeLog()
    )

    expect(mocks.readRepoState).toHaveBeenCalledTimes(1)
  })

  it('should ignore relative file paths', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('src/relative.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(mocks.readRepoState).not.toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({ filesProbed: 0 })
  })

  // --- Failure isolation ---------------------------------------------------

  it('should still emit the line when a probe fails, and count the failure', async () => {
    // A dropped probe must cost one data point, not the whole log line — the
    // ratio's denominator depends on it.
    mocks.readRepoState.mockRejectedValue(new Error('git exploded'))
    const log = makeLog()

    await logNullRepoDiagnostics(
      [editEntry('/repo/src/a.ts')],
      repoState(),
      '/tmp/scratch',
      log
    )

    expect(log.info).toHaveBeenCalled()
    expect(loggedData(log)).toMatchObject({
      filesProbed: 0,
      probeErrors: 1,
    })
  })

  it('should log under a stable message so the ratio can be queried', async () => {
    const log = makeLog()

    await logNullRepoDiagnostics([], repoState(), '/tmp/scratch', log)

    expect(log.info).toHaveBeenCalledWith(
      expect.anything(),
      NULL_REPO_DIAGNOSTIC_MESSAGE
    )
  })
})
