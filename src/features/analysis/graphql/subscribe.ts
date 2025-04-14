import { Agent } from 'node:http'

import { API_URL } from '@mobb/bugsy/constants'
import { createClient } from 'graphql-ws'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import WebsocketNode from 'isomorphic-ws'
import WebSocket from 'ws'

import { API_KEY_HEADER_NAME } from './gql'

const SUBSCRIPTION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes in ms

type BaseWsOptions =
  | {
      type: 'apiKey'
      apiKey: string
      timeoutInMs?: number
    }
  | {
      type: 'token'
      token: string
      timeoutInMs?: number
    }

type WsOptions = BaseWsOptions & {
  websocket: typeof WebsocketNode | typeof WebSocket
  url: string
}

function createWSClient(options: WsOptions) {
  const proxy =
    options.url.startsWith('https://') && process.env['HTTPS_PROXY']
      ? new HttpsProxyAgent(process.env['HTTPS_PROXY'])
      : options.url.startsWith('http://') && process.env['HTTP_PROXY']
        ? new HttpProxyAgent(process.env['HTTP_PROXY'])
        : null
  // Create a custom WebSocket that uses the proxy agent
  const CustomWebSocket = class extends WebSocket {
    constructor(address: string, protocols?: string | string[]) {
      super(address, protocols, proxy ? { agent: proxy as Agent } : undefined)
    }
  }

  return createClient({
    //this is needed to prevent AWS from killing the connection
    //currently our load balancer has a 29s idle timeout
    keepAlive: 10000,
    url: options.url,
    webSocketImpl: proxy ? CustomWebSocket : options.websocket || WebSocket,
    connectionParams: () => {
      return {
        headers:
          options.type === 'apiKey'
            ? {
                [API_KEY_HEADER_NAME]: options.apiKey,
              }
            : { authorization: `Bearer ${options.token}` },
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
  wsClientOptions: BaseWsOptions
) {
  return new Promise<T>((resolve, reject) => {
    let timer: null | ReturnType<typeof setTimeout> = null
    const { timeoutInMs = SUBSCRIPTION_TIMEOUT_MS } = wsClientOptions
    const client = createWSClient({
      ...wsClientOptions,
      websocket: WebSocket,
      url: API_URL.replace('http', 'ws'),
    })
    const unsubscribe = client.subscribe<T>(
      { query, variables },
      {
        next: (data) => {
          function callbackResolve(data: T) {
            unsubscribe()
            if (timer) {
              clearTimeout(timer)
            }
            resolve(data)
          }

          function callbackReject(data: unknown) {
            unsubscribe()
            if (timer) {
              clearTimeout(timer)
            }
            reject(data)
          }

          if (!data.data) {
            reject(
              new Error(
                `Broken data object from graphQL subscribe: ${JSON.stringify(
                  data
                )} for query: ${query}`
              )
            )
          } else {
            callback(callbackResolve, callbackReject, data.data)
          }
        },
        error: (error) => {
          if (timer) {
            clearTimeout(timer)
          }
          reject(error)
        },
        complete: () => {
          return
        },
      }
    )
    if (typeof timeoutInMs === 'number') {
      timer = setTimeout(() => {
        unsubscribe()
        reject(
          new Error(
            `Timeout expired for graphQL subscribe query: ${query} with timeout: ${timeoutInMs}`
          )
        )
      }, timeoutInMs)
    }
  })
}
