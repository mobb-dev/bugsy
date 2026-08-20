import { afterEach, describe, expect, it, vi } from 'vitest'

import { CliError } from '../../../utils'
import type { AnalyzeOptions } from '../../types'
import { analyzeHandler, validateAnalyzeOptions } from '../analyze'

const mocks = vi.hoisted(() => ({ analyze: vi.fn() }))

vi.mock('../../../commands', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../commands')>()
  return { ...actual, analyze: mocks.analyze }
})

// A file that certainly exists, so the -f existence check never masks the
// flag-combination error under test.
const EXISTING_FILE = __filename

function analyzeArgv(overrides: Partial<AnalyzeOptions>): AnalyzeOptions {
  return {
    _: ['analyze'],
    $0: 'mobbdev',
    repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
    ...overrides,
  } as AnalyzeOptions
}

describe('validateAnalyzeOptions --gate (MOBB-3810)', () => {
  it('rejects --gate with a user-supplied report file: the gate only judges Mobb scans', () => {
    expect(() =>
      validateAnalyzeOptions(analyzeArgv({ gate: true, f: EXISTING_FILE }))
    ).toThrow(CliError)
    expect(() =>
      validateAnalyzeOptions(analyzeArgv({ gate: true, f: EXISTING_FILE }))
    ).toThrow(/--gate/)
  })

  it('accepts --gate on a plain Mobb scan', () => {
    expect(() =>
      validateAnalyzeOptions(analyzeArgv({ gate: true }))
    ).not.toThrow()
  })

  it('accepts --gate together with --scan-only (the primary CI shape)', () => {
    expect(() =>
      validateAnalyzeOptions(analyzeArgv({ gate: true, scanOnly: true }))
    ).not.toThrow()
  })
})

// The exit-2 contract, pinned. yargs treats any handler rejection as a usage
// failure (help screen + process.exit(1)) — the analyzeHandler try/catch is
// what carries a gate block's exit code past it, and removing that catch would
// silently downgrade exit 2 to exit 1 with an otherwise-green suite.
describe('analyzeHandler exit-code propagation (MOBB-3810)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    mocks.analyze.mockReset()
  })

  it('maps a gate-blocked CliError to process.exit(2) before yargs can intercept it', async () => {
    mocks.analyze.mockRejectedValueOnce(
      new CliError('🚧 Gate: 2 blocking merge', { exitCode: 2 })
    )
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const exitSignal = new Error('process.exit called')
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw exitSignal
    }) as never)

    await expect(analyzeHandler(analyzeArgv({ gate: true }))).rejects.toBe(
      exitSignal
    )
    expect(exitSpy).toHaveBeenCalledWith(2)
  })

  it('rethrows a default (exit-1) CliError so the existing yargs path keeps handling it', async () => {
    const operational = new CliError('boom')
    mocks.analyze.mockRejectedValueOnce(operational)
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never)

    await expect(analyzeHandler(analyzeArgv({}))).rejects.toBe(operational)
    expect(exitSpy).not.toHaveBeenCalled()
  })
})
