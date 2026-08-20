import { afterEach, describe, expect, it, vi } from 'vitest'

import { CliError } from '../../../utils'
import { enforceGateVerdict } from '../gate_verdict'
import type { GetGateVerdictQuery } from '../scm/generates/client_generates'

type GateVerdictAnswer = GetGateVerdictQuery['getGateVerdict']

const successVerdict = {
  __typename: 'GateVerdictSuccess' as const,
  blocking: false,
  blockingCount: 0,
  totalIssues: 2,
  criticalCount: 0,
  highCount: 1,
  mediumCount: 1,
  lowCount: 0,
  unclassifiedCount: 0,
  description: '1 high, 1 medium — 2 new issues, none block the merge',
  degraded: false,
}

function clientReturning(verdict: GateVerdictAnswer) {
  return { getGateVerdict: vi.fn(async () => verdict) }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('enforceGateVerdict (MOBB-3810)', () => {
  it('resolves quietly on a passing verdict and prints it', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const gqlClient = clientReturning(successVerdict)

    await enforceGateVerdict({ gqlClient, fixReportId: 'report-1' })

    expect(gqlClient.getGateVerdict).toHaveBeenCalledWith('report-1')
    expect(log.mock.calls.flat().join('\n')).toMatch(/none block the merge/)
  })

  it('throws exit-code-2 CliError on a blocking verdict, naming the verdict', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const gqlClient = clientReturning({
      ...successVerdict,
      blocking: true,
      blockingCount: 2,
      description: '1 high, 1 medium — 2 new issues, 2 blocking merge',
    })

    const thrown = await enforceGateVerdict({
      gqlClient,
      fixReportId: 'report-1',
    }).then(
      () => null,
      (error) => error
    )

    expect(thrown).toBeInstanceOf(CliError)
    expect(thrown.exitCode).toBe(2)
    expect(thrown.message).toMatch(/blocking merge/)
  })

  it('treats a backend error answer as an operational failure (exit 1)', async () => {
    const gqlClient = clientReturning({
      __typename: 'GateVerdictError' as const,
      error: 'gate verdict is only available for Mobb SAST scan reports',
    })

    const thrown = await enforceGateVerdict({
      gqlClient,
      fixReportId: 'report-1',
    }).then(
      () => null,
      (error) => error
    )

    expect(thrown).toBeInstanceOf(CliError)
    expect(thrown.exitCode).toBe(1)
    expect(thrown.message).toMatch(/Mobb SAST/)
  })

  it('treats not-ready as an operational failure — unreachable after the digest wait', async () => {
    const gqlClient = clientReturning({
      __typename: 'GateVerdictNotReady' as const,
      state: 'Created',
    })

    const thrown = await enforceGateVerdict({
      gqlClient,
      fixReportId: 'report-1',
    }).then(
      () => null,
      (error) => error
    )

    expect(thrown).toBeInstanceOf(CliError)
    expect(thrown.exitCode).toBe(1)
    expect(thrown.message).toMatch(/Created/)
  })
})

describe('CliError exit codes', () => {
  it('defaults to 1 so every existing throw keeps its behavior', () => {
    expect(new CliError('boom').exitCode).toBe(1)
  })

  it('carries a custom exit code', () => {
    expect(new CliError('gated', { exitCode: 2 }).exitCode).toBe(2)
  })
})
