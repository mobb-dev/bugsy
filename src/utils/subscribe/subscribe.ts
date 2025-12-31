/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from 'graphql-ws'
import WebsocketNode from 'isomorphic-ws'

import { getGraphQlHeaders, GetGraphQlHeadersOptions } from './graphql'

const DEFAULT_API_URL = 'https://api.mobb.ai/v1/graphql'
const SUBSCRIPTION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes in ms

export type WsOptions = GetGraphQlHeadersOptions & {
  url?: string
  timeoutInMs?: number
  websocket?: typeof WebsocketNode | typeof WebSocket
  // biome-ignore lint/suspicious/noExplicitAny: Optional proxy agent for Node.js environments (HttpsProxyAgent | HttpProxyAgent), using any to avoid Node.js imports in frontend builds
  proxyAgent?: any
}

export function createWSClient(options: WsOptions) {
  const url =
    options.url ||
    (process.env['API_URL'] || DEFAULT_API_URL).replace('http', 'ws')
  const websocketImpl =
    options.websocket ||
    (typeof WebSocket !== 'undefined' ? WebSocket : WebsocketNode)

  // Create custom WebSocket with proxy support if proxy agent is provided
  const CustomWebSocket = options.proxyAgent
    ? // biome-ignore lint/suspicious/noExplicitAny: Dynamic WebSocket extension requires any cast for cross-platform compatibility
      class extends (websocketImpl as any) {
        constructor(address: string, protocols?: string | string[]) {
          super(address, protocols, { agent: options.proxyAgent })
        }
      }
    : websocketImpl

  return createClient({
    //this is needed to prevent AWS from killing the connection
    //currently our load balancer has a 29s idle timeout
    keepAlive: 10000,
    url,
    webSocketImpl: CustomWebSocket,
    connectionParams: () => {
      return {
        headers: getGraphQlHeaders(options),
      }
    },
  })
}

export type SubscriptionHandlers<T> = {
  next: (data: T) => void
  error: (error: unknown) => void
}

/**
 * Streaming GraphQL subscription helper.
 *
 * Returns an `unsubscribe()` function immediately so callers can
 * reliably clean up even if no payload has been received yet.
 */
export function subscribeStream<T, TV extends Record<string, unknown>>(
  query: string,
  variables: TV,
  handlers: SubscriptionHandlers<T>,
  wsClientOptions: WsOptions
): { unsubscribe: () => void } {
  let timer: null | ReturnType<typeof setTimeout> = null
  const { timeoutInMs = SUBSCRIPTION_TIMEOUT_MS } = wsClientOptions
  const client = createWSClient(wsClientOptions)

  let unsub: (() => void) | null = null
  let settled = false

  const cleanup = () => {
    if (unsub) {
      try {
        unsub()
      } catch {
        // ignore cleanup errors
      }
      unsub = null
    }
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const finalizeError = (error: unknown) => {
    if (settled) {
      return
    }
    settled = true
    cleanup()
    handlers.error(error)
  }

  unsub = client.subscribe<T>(
    { query, variables },
    {
      next: (payload) => {
        if (settled) {
          return
        }
        if (!payload.data) {
          finalizeError(
            new Error(
              `Broken data object from graphQL subscribe: ${JSON.stringify(
                payload
              )} for query: ${query}`
            )
          )
          return
        }
        handlers.next(payload.data)
      },
      error: (error) => {
        finalizeError(error)
      },
      complete: () => {
        return
      },
    }
  )

  if (typeof timeoutInMs === 'number') {
    timer = setTimeout(() => {
      finalizeError(
        new Error(
          `Timeout expired for graphQL subscribe query: ${query} with timeout: ${timeoutInMs}`
        )
      )
    }, timeoutInMs)
  }

  return {
    unsubscribe: () => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
    },
  }
}

// Re-export blame subscription utilities for easier access
export * from './blameSubscriptions'
