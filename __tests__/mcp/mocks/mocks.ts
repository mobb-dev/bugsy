import { setupServer, SetupServerApi } from 'msw/node'
import { vi } from 'vitest'

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
  server.events.on('response:bypass', ({ request }) => {
    console.warn(`response:bypass ${request.url}`)
  })

  server.events.on('request:start', async ({ request }) => {
    try {
      const json = await request.clone().json()
      if (process.env['VERBOSE']) {
        console.log(`calling: ${json.operationName || 'unknown'}`)
      }
      requestSpy(json)
    } catch (_e) {
      /* empty */
    }
  })

  if (process.env['VERBOSE']) {
    server.events.on('unhandledException', ({ request }) => {
      console.error(
        'unhandledException : %s %s errored! See details below.',
        request.method,
        request.url
      )
    })

    server.events.on('response:mocked', ({ request, response }) => {
      console.log(
        '%s %s received %s',
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
