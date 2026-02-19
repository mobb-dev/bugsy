import { describe, expect, it, vi } from 'vitest'

import type { WsOptions } from '../../../../utils/subscribe/subscribe'
import { Fix_Report_State_Enum } from '../../scm/generates/client_generates'
import { GQLClient } from '../gql'

// Capture the WsOptions passed to subscribeStream
let capturedWsOptions: WsOptions | null = null

vi.mock('../../../../utils/subscribe/subscribe', () => ({
  subscribeStream: vi.fn(
    (
      _query: string,
      _variables: unknown,
      _handlers: unknown,
      wsOptions: WsOptions
    ) => {
      capturedWsOptions = wsOptions
      return { unsubscribe: vi.fn() }
    }
  ),
}))

// Mock proxy to avoid loading constants (which need env vars)
vi.mock('../../../../utils/proxy', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    getProxyAgent: vi.fn(() => undefined),
    fetchWithProxy: vi.fn(),
  }
})

// Use importOriginal to get the real enums from client_generates
vi.mock('../../scm/generates/client_generates', async (importOriginal) => {
  const actual =
    (await importOriginal()) as typeof import('../../scm/generates/client_generates')
  return {
    ...actual,
    getSdk: () => ({}),
  }
})

describe('subscribeToAnalysis URL propagation', () => {
  beforeEach(() => {
    capturedWsOptions = null
  })

  it('passes the correct WebSocket URL derived from apiUrl (apiKey auth)', () => {
    const client = new GQLClient({
      apiKey: 'test-key',
      type: 'apiKey',
      apiUrl: 'https://custom-api.example.com/v1/graphql',
    })

    // Call subscribeToAnalysis - it will internally call subscribeStream
    // which we've mocked to capture wsOptions
    client.subscribeToAnalysis({
      subscribeToAnalysisParams: { analysisId: 'test-analysis-id' },
      callback: vi.fn(),
      callbackStates: [Fix_Report_State_Enum.Finished],
    })

    expect(capturedWsOptions).not.toBeNull()
    expect(capturedWsOptions!.url).toBe(
      'wss://custom-api.example.com/v1/graphql'
    )
    expect((capturedWsOptions as Record<string, unknown>)['type']).toBe(
      'apiKey'
    )
  })

  it('passes the correct WebSocket URL derived from apiUrl (token auth)', () => {
    const client = new GQLClient({
      token: 'test-token',
      type: 'token',
      apiUrl: 'https://custom-api.example.com/v1/graphql',
    })

    client.subscribeToAnalysis({
      subscribeToAnalysisParams: { analysisId: 'test-analysis-id' },
      callback: vi.fn(),
      callbackStates: [Fix_Report_State_Enum.Finished],
    })

    expect(capturedWsOptions).not.toBeNull()
    expect(capturedWsOptions!.url).toBe(
      'wss://custom-api.example.com/v1/graphql'
    )
    expect((capturedWsOptions as Record<string, unknown>)['type']).toBe('token')
  })

  it('converts http:// to ws:// in the WebSocket URL', () => {
    const client = new GQLClient({
      apiKey: 'test-key',
      type: 'apiKey',
      apiUrl: 'http://localhost:8080/v1/graphql',
    })

    client.subscribeToAnalysis({
      subscribeToAnalysisParams: { analysisId: 'test-analysis-id' },
      callback: vi.fn(),
      callbackStates: [Fix_Report_State_Enum.Finished],
    })

    expect(capturedWsOptions).not.toBeNull()
    expect(capturedWsOptions!.url).toBe('ws://localhost:8080/v1/graphql')
  })
})
