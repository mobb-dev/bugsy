import { setupServer, SetupServerApi } from 'msw/node'
import { vi } from 'vitest'

import { log } from '../helpers/log'
import {
  graphqlHandlers,
  mockGraphQL as createMockGraphQL,
} from './graphqlHandlers'

// Use a local mock API URL for testing
export const MOCK_API_URL = 'http://localhost:3001/graphql'

const requestSpy = vi.fn()

export function getLastRequest(operationName?: string): {
  operationName: string
  variables: Record<string, never>
} | null {
  if (operationName) {
    const lastRequest = requestSpy.mock.calls
      .reverse()
      .find((call) => call[0]?.operationName === operationName)
    if (!lastRequest) {
      return null
    }
    return lastRequest[0]
  }
  const lastCall = requestSpy.mock.calls[requestSpy.mock.calls.length - 1]
  return lastCall ? lastCall[0] : null
}

export const monitorNetworkCalls = (server: SetupServerApi) => {
  const logHeaders = (headers: Headers) => {
    const headerObj: Record<string, string> = {}
    headers.forEach((value, key) => {
      headerObj[key] = value
    })
    return headerObj
  }

  server.events.on('response:bypass', ({ request }) => {
    log(
      `[MSW] Request bypassed: ${request.method} ${request.url}`,
      '\n[MSW] Request headers:',
      logHeaders(request.headers)
    )
  })

  server.events.on('request:start', async ({ request }) => {
    try {
      const json = await request.clone().json()
      if (process.env['VERBOSE']) {
        console.log(
          `[MSW] GraphQL Request: ${json.operationName || 'unknown'}`,
          '\n[MSW] Request URL:',
          `${request.method} ${request.url}`,
          '\n[MSW] Request headers:',
          logHeaders(request.headers)
        )
      }
      requestSpy(json)
    } catch (e) {
      // Log non-JSON requests that might be unhandled (only if VERBOSE is set)
      log(
        `[MSW] Non-JSON request detected: ${request.method} ${request.url}`,
        '\n[MSW] Request headers:',
        logHeaders(request.headers)
      )
      if (e instanceof Error) {
        log('[MSW] Error parsing request:', e.message)
      }
    }
  })

  // Always log unhandled requests, not just in VERBOSE mode
  server.events.on('unhandledException', ({ request, error }) => {
    log(
      '[MSW] Unhandled request: %s %s',
      request.method,
      request.url,
      '\n[MSW] Request headers:',
      logHeaders(request.headers)
    )
    if (error) {
      log('[MSW] Error details:', error)
    }
  })

  if (process.env['VERBOSE']) {
    server.events.on('response:mocked', ({ request, response }) => {
      console.log(
        '[MSW] Mocked response: %s %s received %s',
        request.method,
        request.url,
        response.status
      )
    })
  }
}

// Create the mock server
export const server = setupServer(...graphqlHandlers)

// Add monitoring
monitorNetworkCalls(server)

// Export the mock GraphQL control system
export const mockGraphQL = () => createMockGraphQL(requestSpy)
