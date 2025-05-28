import { graphql, HttpResponse } from 'msw'

import type {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GetMcpFixesQuery,
  GetMcpFixesQueryVariables,
  GetOrgAndProjectIdQuery,
  GetOrgAndProjectIdQueryVariables,
  MeQuery,
  MeQueryVariables,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
  UploadS3BucketInfoMutationVariables,
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

// GraphQL handlers with proper typing
export const graphqlHandlers = [
  graphql.query<MeQuery, MeQueryVariables>('Me', () => {
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

  graphql.mutation<
    UploadS3BucketInfoMutation,
    UploadS3BucketInfoMutationVariables
  >('uploadS3BucketInfo', () => {
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

  graphql.query<GetOrgAndProjectIdQuery, GetOrgAndProjectIdQueryVariables>(
    'getOrgAndProjectId',
    () => {
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
    }
  ),

  graphql.mutation<CreateProjectMutation, CreateProjectMutationVariables>(
    'CreateProject',
    () => {
      if (mockState.createProject === 'error') {
        return HttpResponse.json(
          mockCreateProjectError(
            mockState.errorMessages['createProject'] || 'Create Project Error'
          ),
          { status: 500 }
        )
      }
      return HttpResponse.json(mockCreateProject)
    }
  ),

  graphql.query<GetMcpFixesQuery, GetMcpFixesQueryVariables>(
    'GetMCPFixes',
    () => {
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
    }
  ),

  graphql.mutation<
    SubmitVulnerabilityReportMutation,
    SubmitVulnerabilityReportMutationVariables
  >('SubmitVulnerabilityReport', () => {
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

// Mock GraphQL control system
export const mockGraphQL = (
  requestSpy: ReturnType<typeof import('vitest').vi.fn>
) => ({
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
