import WebsocketNode from 'isomorphic-ws'
import { describe, expect, it, vi } from 'vitest'

import { createWSClient } from '../subscribe'

// Capture the options passed to graphql-ws createClient
let capturedOptions: { webSocketImpl?: unknown; url?: string } | null = null

vi.mock('graphql-ws', () => ({
  createClient: vi.fn((opts: { webSocketImpl?: unknown; url?: string }) => {
    capturedOptions = opts
    return { subscribe: vi.fn() }
  }),
}))

describe('createWSClient', () => {
  beforeEach(() => {
    capturedOptions = null
  })

  it('uses WebsocketNode (ws library) by default, not global WebSocket', () => {
    // Even on Node.js 22+ where global WebSocket exists, we should use
    // the ws library (via isomorphic-ws) to get proper proxy support
    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
    })

    // When no custom websocket is provided, createWSClient should use
    // WebsocketNode directly (not the global WebSocket)
    expect(capturedOptions!.webSocketImpl).toBe(WebsocketNode)
  })

  it('uses custom websocket implementation when provided', () => {
    const customWs = class CustomWS {} as unknown as typeof WebsocketNode

    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
      websocket: customWs,
    })

    expect(capturedOptions!.webSocketImpl).toBe(customWs)
  })

  it('wraps websocket with proxy agent when proxyAgent is provided', () => {
    const fakeAgent = { proxy: 'http://proxy.local:3128' }

    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
      proxyAgent: fakeAgent,
    })

    // When proxyAgent is provided, createWSClient wraps the websocket
    // in a CustomWebSocket class that passes the agent in the constructor
    expect(capturedOptions!.webSocketImpl).not.toBe(WebsocketNode)
    expect(typeof capturedOptions!.webSocketImpl).toBe('function')
  })

  it('passes proxy agent to websocket constructor as third argument', () => {
    const fakeAgent = { proxy: 'http://proxy.local:3128' }
    const constructorArgs: unknown[][] = []

    // Spy WebSocket that records constructor arguments
    class SpyWebSocket {
      constructor(...args: unknown[]) {
        constructorArgs.push(args)
      }
    }

    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
      websocket: SpyWebSocket as unknown as typeof WebsocketNode,
      proxyAgent: fakeAgent,
    })

    // Instantiate the captured (wrapped) WebSocket to verify args
    const WrappedWs = capturedOptions!.webSocketImpl as new (
      address: string,
      protocols?: string | string[]
    ) => unknown
    new WrappedWs('ws://example.com', 'graphql-transport-ws')

    expect(constructorArgs).toHaveLength(1)
    expect(constructorArgs[0]).toEqual([
      'ws://example.com',
      'graphql-transport-ws',
      { agent: fakeAgent },
    ])
  })

  it('does not wrap websocket when no proxyAgent is provided', () => {
    class SpyWebSocket {
      constructor() {
        // no-op
      }
    }

    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
      websocket: SpyWebSocket as unknown as typeof WebsocketNode,
    })

    // Without proxyAgent, the websocket should be passed through unchanged
    expect(capturedOptions!.webSocketImpl).toBe(SpyWebSocket)
  })

  it('resolves URL from options.url first', () => {
    createWSClient({
      apiKey: 'test',
      type: 'apiKey',
      url: 'ws://custom.example.com/v1/graphql',
    })

    expect(capturedOptions!.url).toBe('ws://custom.example.com/v1/graphql')
  })

  it('falls back to process.env.API_URL when no url option is provided', () => {
    const originalApiUrl = process.env['API_URL']
    process.env['API_URL'] = 'https://env.example.com/v1/graphql'

    try {
      createWSClient({
        apiKey: 'test',
        type: 'apiKey',
      })

      expect(capturedOptions!.url).toBe('wss://env.example.com/v1/graphql')
    } finally {
      if (originalApiUrl !== undefined) {
        process.env['API_URL'] = originalApiUrl
      } else {
        delete process.env['API_URL']
      }
    }
  })
})
