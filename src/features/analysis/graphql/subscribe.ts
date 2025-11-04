import { Agent } from 'node:http'

import Debug from 'debug'
import { createClient } from 'graphql-ws'
import { HttpsProxyAgent } from 'https-proxy-agent'
import WebsocketNode from 'isomorphic-ws'
import WebSocket from 'ws'

import { API_KEY_HEADER_NAME } from './gql'

const DEFAULT_API_URL = 'https://api.mobb.ai/v1/graphql'

const debug = Debug('mobbdev:subscribe')

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
  //We use the HttpsProxyAgent class for both options and not the HttpProxyAgent class as it doesn't work for websocket connections.
  //The HttpsProxyAgent class makes the connection use the CONNECT HTTP method with the proxy server which is needed for websocket connections,
  //even non-encrypted ones.
  const proxy =
    options.url.startsWith('wss://') && process.env['HTTPS_PROXY']
      ? new HttpsProxyAgent(process.env['HTTPS_PROXY'])
      : options.url.startsWith('ws://') && process.env['HTTP_PROXY']
        ? new HttpsProxyAgent(process.env['HTTP_PROXY'])
        : null
  debug(
    `Using proxy: ${proxy ? 'yes' : 'no'} with url: ${options.url} and with proxy: ${process.env['HTTP_PROXY']} for the websocket connection`
  )
  // Create a custom WebSocket that uses the proxy agent
  const CustomWebSocket = class extends WebSocket {
    constructor(address: string, protocols?: string | string[]) {
      super(
        address,
        protocols,
        proxy ? { agent: proxy as unknown as Agent } : undefined
      )
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
    const API_URL = process.env['API_URL'] || DEFAULT_API_URL
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
