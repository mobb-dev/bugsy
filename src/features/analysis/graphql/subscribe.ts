import { API_URL } from '@mobb/bugsy/constants'
import { createClient } from 'graphql-ws'
import WebsocketNode from 'isomorphic-ws'
import WebSocket from 'ws'

import { API_KEY_HEADER_NAME } from './gql'

const SUBSCRIPTION_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes in ms

type BaseWsOptions = {
  apiKey: string
  timeoutInMs?: number
}

type WsOptions = BaseWsOptions & {
  websocket: typeof WebsocketNode | typeof WebSocket
  url: string
}

function createWSClient(options: WsOptions) {
  return createClient({
    url: options.url,
    webSocketImpl: options.websocket || WebSocket,
    connectionParams: () => {
      return {
        headers: {
          [API_KEY_HEADER_NAME]: options.apiKey,
        },
      }
    },
  })
}

export type ResolveFuncType<T> = (value: T) => void
export type NextCallbackFunction<T> = (
  resolve: ResolveFuncType<T>,
  reject: ResolveFuncType<T>,
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

          function callbackReject(data: T) {
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
