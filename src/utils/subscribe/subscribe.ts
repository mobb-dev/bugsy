/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from 'graphql-ws'
import WebsocketNode from 'isomorphic-ws'

import { getGraphQlHeaders, GetGraphQlHeadersOptions } from './graphql'

const DEFAULT_API_URL = 'https://api.mobb.ai/v1/graphql'
const SUBSCRIPTION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes in ms

type WsOptions = GetGraphQlHeadersOptions & {
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

export type ResolveFuncType<T> = (value: T) => void
export type NextCallbackFunction<T> = (
  resolve: ResolveFuncType<T>,
  reject: ResolveFuncType<unknown>,
  data: T
) => void

export function subscribe<T, TV extends Record<string, unknown>>(
  query: string,
  variables: TV,
  callback: NextCallbackFunction<T>,
  wsClientOptions: WsOptions
) {
  return new Promise<T>((resolve, reject) => {
    let timer: null | ReturnType<typeof setTimeout> = null
    let settled = false
    const { timeoutInMs = SUBSCRIPTION_TIMEOUT_MS } = wsClientOptions
    const client = createWSClient(wsClientOptions)
    let unsubscribe: () => void = () => {
      return
    }

    function cleanup() {
      // graphql-ws unsubscribe should be idempotent, but guard anyway.
      try {
        unsubscribe()
      } catch {
        // ignore cleanup errors
      }
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    function finalizeResolve(data: T) {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      resolve(data)
    }

    function finalizeReject(error: unknown) {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      reject(error)
    }

    unsubscribe = client.subscribe<T>(
      { query, variables },
      {
        next: (data) => {
          if (!data.data) {
            finalizeReject(
              new Error(
                `Broken data object from graphQL subscribe: ${JSON.stringify(
                  data
                )} for query: ${query}`
              )
            )
          } else {
            callback(finalizeResolve, finalizeReject, data.data)
          }
        },
        error: (error) => {
          finalizeReject(error)
        },
        complete: () => {
          return
        },
      }
    )
    if (typeof timeoutInMs === 'number') {
      timer = setTimeout(() => {
        finalizeReject(
          new Error(
            `Timeout expired for graphQL subscribe query: ${query} with timeout: ${timeoutInMs}`
          )
        )
      }, timeoutInMs)
    }
  })
}
