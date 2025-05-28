import { HttpResponse } from 'msw'
import { setupServer, SetupServerApi } from 'msw/node'
import { vi } from 'vitest'

import {
  mockCreateProjectMutation,
  mockGetMcpFixesQuery,
  mockGetOrgAndProjectIdQuery,
  mockMeQuery,
  mockSubmitVulnerabilityReportMutation,
  mockUploadS3BucketInfoMutation,
} from '../../../src/features/analysis/scm/generates/client_generates'
import {
  mockCreateProject,
  mockCreateProjectError,
  mockGetMCPFixes,
  mockGetMCPFixesEmpty,
  mockGetMCPFixesError,
  mockGetOrgAndProjectId,
  mockGetOrgAndProjectIdError,
  mockGetOrgAndProjectIdProjectNotFound,
  mockMe,
  mockMeConnectionError,
  mockMeError,
  mockMeFetchError,
  mockSubmitVulnerabilityReport,
  mockSubmitVulnerabilityReportError,
  mockUploadS3BucketInfo,
  mockUploadS3BucketInfoError,
} from './fakeResponses'

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

// Mock control state
type MockState = {
  me: 'success' | 'connectionError' | 'error' | 'fetchError'
  uploadS3BucketInfo: 'success' | 'error'
  getOrgAndProjectId: 'success' | 'projectNotFound' | 'error'
  createProject: 'success' | 'error'
  submitVulnerabilityReport: 'success' | 'error'
  getMCPFixes: 'success' | 'error' | 'empty'
  errorMessages: Record<string, string>
}

const mockState: MockState = {
  me: 'success',
  uploadS3BucketInfo: 'success',
  getOrgAndProjectId: 'success',
  createProject: 'success',
  submitVulnerabilityReport: 'success',
  getMCPFixes: 'success',
  errorMessages: {},
}

// Use the generated mock handlers with dynamic responses based on mock state
const handlers = [
  mockMeQuery(() => {
    if (mockState.me === 'connectionError') {
      return HttpResponse.json(mockMeConnectionError, { status: 500 })
    }
    if (mockState.me === 'error') {
      return HttpResponse.json(
        mockMeError(mockState.errorMessages['me'] || 'API Error'),
        { status: 500 }
      )
    }
    if (mockState.me === 'fetchError') {
      throw mockMeFetchError()
    }
    return HttpResponse.json(mockMe)
  }),
  mockUploadS3BucketInfoMutation(() => {
    if (mockState.uploadS3BucketInfo === 'error') {
      return HttpResponse.json(
        mockUploadS3BucketInfoError(
          mockState.errorMessages['uploadS3BucketInfo'] || 'Upload Error'
        ),
        { status: 500 }
      )
    }
    return HttpResponse.json(mockUploadS3BucketInfo)
  }),
  mockGetOrgAndProjectIdQuery(() => {
    if (mockState.getOrgAndProjectId === 'error') {
      return HttpResponse.json(
        mockGetOrgAndProjectIdError(
          mockState.errorMessages['getOrgAndProjectId'] || 'Project Error'
        ),
        { status: 500 }
      )
    }
    if (mockState.getOrgAndProjectId === 'projectNotFound') {
      return HttpResponse.json(mockGetOrgAndProjectIdProjectNotFound)
    }
    return HttpResponse.json(mockGetOrgAndProjectId)
  }),
  mockCreateProjectMutation(() => {
    if (mockState.createProject === 'error') {
      return HttpResponse.json(
        mockCreateProjectError(
          mockState.errorMessages['createProject'] || 'Create Project Error'
        ),
        { status: 500 }
      )
    }
    return HttpResponse.json(mockCreateProject)
  }),
  mockGetMcpFixesQuery(() => {
    if (mockState.getMCPFixes === 'error') {
      return HttpResponse.json(
        mockGetMCPFixesError(
          mockState.errorMessages['getMCPFixes'] || 'Get Fixes Error'
        ),
        { status: 500 }
      )
    }
    if (mockState.getMCPFixes === 'empty') {
      return HttpResponse.json(mockGetMCPFixesEmpty)
    }
    return HttpResponse.json(mockGetMCPFixes)
  }),
  mockSubmitVulnerabilityReportMutation(() => {
    if (mockState.submitVulnerabilityReport === 'error') {
      return HttpResponse.json(
        mockSubmitVulnerabilityReportError(
          mockState.errorMessages['submitVulnerabilityReport'] ||
            'Submission Error'
        ),
        { status: 500 }
      )
    }
    return HttpResponse.json(mockSubmitVulnerabilityReport)
  }),
]

// Create the mock server
export const server = setupServer(...handlers)

// Add monitoring
monitorNetworkCalls(server)

// Mock GraphQL control system - restored!
export const mockGraphQL = () => ({
  reset: () => {
    requestSpy.mockClear()
    // Reset all mock states to success
    mockState.me = 'success'
    mockState.uploadS3BucketInfo = 'success'
    mockState.getOrgAndProjectId = 'success'
    mockState.createProject = 'success'
    mockState.submitVulnerabilityReport = 'success'
    mockState.getMCPFixes = 'success'
    mockState.errorMessages = {}
  },
  me: () => {
    return {
      succeeds() {
        mockState.me = 'success'
        return this
      },
      failsWithConnectionError() {
        mockState.me = 'connectionError'
        return this
      },
      failsWithFetchError() {
        mockState.me = 'fetchError'
        return this
      },
    }
  },
  uploadS3BucketInfo: () => {
    return {
      succeeds() {
        mockState.uploadS3BucketInfo = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.uploadS3BucketInfo = 'error'
        mockState.errorMessages['uploadS3BucketInfo'] = message
        return this
      },
    }
  },
  getOrgAndProjectId: () => {
    return {
      succeeds() {
        mockState.getOrgAndProjectId = 'success'
        return this
      },
      projectNotFound() {
        mockState.getOrgAndProjectId = 'projectNotFound'
        return this
      },
      failsWithError(message: string) {
        mockState.getOrgAndProjectId = 'error'
        mockState.errorMessages['getOrgAndProjectId'] = message
        return this
      },
    }
  },
  createProject: () => {
    return {
      succeeds() {
        mockState.createProject = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.createProject = 'error'
        mockState.errorMessages['createProject'] = message
        return this
      },
    }
  },
  submitVulnerabilityReport: () => {
    return {
      succeeds() {
        mockState.submitVulnerabilityReport = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.submitVulnerabilityReport = 'error'
        mockState.errorMessages['submitVulnerabilityReport'] = message
        return this
      },
    }
  },
  getMCPFixes: () => {
    return {
      succeeds() {
        mockState.getMCPFixes = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.getMCPFixes = 'error'
        mockState.errorMessages['getMCPFixes'] = message
        return this
      },
      returnsEmptyFixes() {
        mockState.getMCPFixes = 'empty'
        return this
      },
    }
  },
})
