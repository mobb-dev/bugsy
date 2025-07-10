import { graphql, HttpResponse } from 'msw'

import type {
  CreateCommunityUserMutation,
  CreateCommunityUserMutationVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GetLastOrgAndNamedProjectQuery,
  GetLastOrgAndNamedProjectQueryVariables,
  GetLatestReportByRepoUrlQuery,
  GetLatestReportByRepoUrlQueryVariables,
  GetReportFixesQuery,
  GetReportFixesQueryVariables,
  MeQuery,
  MeQueryVariables,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UpdateDownloadedFixDataMutation,
  UpdateDownloadedFixDataMutationVariables,
  UploadS3BucketInfoMutation,
  UploadS3BucketInfoMutationVariables,
} from '../../../src/features/analysis/scm/generates/client_generates'
import {
  mockCreateCommunityUser,
  mockCreateCommunityUserError,
  mockCreateProject,
  mockCreateProjectError,
  mockGetLastOrgAndNamedProject,
  mockGetLastOrgAndNamedProjectError,
  mockGetLastOrgAndNamedProjectProjectNotFound,
  mockGetReportFixes,
  mockGetReportFixesEmpty,
  mockGetReportFixesError,
  mockMe,
  mockMeConnectionError,
  mockMeError,
  mockMeFetchError,
  mockSubmitVulnerabilityReport,
  mockSubmitVulnerabilityReportError,
  mockUploadS3BucketInfo,
  mockUploadS3BucketInfoError,
} from './fakeResponses'
import {
  mockGetLatestReportByRepoUrl,
  mockGetLatestReportByRepoUrlEmpty,
  mockGetLatestReportByRepoUrlError,
  mockGetLatestReportByRepoUrlExpired,
} from './fakeResponses/getLatestReportByRepoUrl'
import { mockUpdateDownloadedFixData } from './fakeResponses/updateDownloadedFixData'
import {
  createCliLoginHandler,
  getEncryptedApiTokenHandler,
  setupAuthHandlers,
} from './handlers/authHandlers'

export const BAD_API_KEY = 'bad-api-key'

// Mock control state
type MockState = {
  me: 'success' | 'connectionError' | 'error' | 'fetchError'
  uploadS3BucketInfo: 'success' | 'error'
  getLastOrgAndNamedProject: 'success' | 'projectNotFound' | 'error'
  createProject: 'success' | 'error'
  submitVulnerabilityReport: 'success' | 'error'
  getLatestReportByRepoUrl: 'success' | 'error' | 'empty' | 'expired'
  createCliLogin: 'success' | 'error'
  updateDownloadedFixData: 'success'
  getEncryptedApiToken: 'success' | 'error'
  createCommunityUser: 'success' | 'error' | 'badApiKey'
  errorMessages: Record<string, string>
  getReportFixes: 'success' | 'empty' | 'error'
}

// Initialize the mock state
const mockState: MockState = {
  me: 'success',
  uploadS3BucketInfo: 'success',
  getLastOrgAndNamedProject: 'success',
  createProject: 'success',
  submitVulnerabilityReport: 'success',
  getLatestReportByRepoUrl: 'success',
  createCliLogin: 'success',
  updateDownloadedFixData: 'success',
  getEncryptedApiToken: 'success',
  createCommunityUser: 'success',
  errorMessages: {},
  getReportFixes: 'success',
}

// Share the mock state with auth handlers
setupAuthHandlers(mockState, mockState.errorMessages)

// GraphQL handlers with proper typing
export const graphqlHandlers = [
  graphql.query<MeQuery, MeQueryVariables>('Me', () => {
    if (mockState.me === 'connectionError') {
      return HttpResponse.json(mockMeConnectionError)
    }
    if (mockState.me === 'fetchError') {
      throw mockMeFetchError()
    }
    if (mockState.me === 'error') {
      return HttpResponse.json(
        mockMeError(mockState.errorMessages['me'] || 'Me Error')
      )
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

  graphql.query<
    GetLastOrgAndNamedProjectQuery,
    GetLastOrgAndNamedProjectQueryVariables
  >('getLastOrgAndNamedProject', () => {
    if (mockState.getLastOrgAndNamedProject === 'error') {
      return HttpResponse.json(
        mockGetLastOrgAndNamedProjectError(
          mockState.errorMessages['getLastOrgAndNamedProject'] ||
            'Project Error'
        ),
        { status: 500 }
      )
    }
    if (mockState.getLastOrgAndNamedProject === 'projectNotFound') {
      return HttpResponse.json(mockGetLastOrgAndNamedProjectProjectNotFound)
    }
    return HttpResponse.json(mockGetLastOrgAndNamedProject)
  }),

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

  graphql.mutation<
    UpdateDownloadedFixDataMutation,
    UpdateDownloadedFixDataMutationVariables
  >('updateDownloadedFixData', () => {
    return HttpResponse.json(mockUpdateDownloadedFixData)
  }),

  // Use the updated auth handlers directly
  createCliLoginHandler,
  getEncryptedApiTokenHandler,

  graphql.mutation<
    CreateCommunityUserMutation,
    CreateCommunityUserMutationVariables
  >('CreateCommunityUser', ({ request }) => {
    if (request.headers.get('x-mobb-key') === BAD_API_KEY) {
      return HttpResponse.json(
        mockCreateCommunityUserError('Invalid API key'),
        { status: 401 }
      )
    }
    if (mockState.createCommunityUser === 'error') {
      return HttpResponse.json(
        mockCreateCommunityUserError(
          mockState.errorMessages['createCommunityUser'] || 'Create User Error'
        ),
        { status: 500 }
      )
    }
    return HttpResponse.json(mockCreateCommunityUser)
  }),

  graphql.query<
    GetLatestReportByRepoUrlQuery,
    GetLatestReportByRepoUrlQueryVariables
  >('GetLatestReportByRepoUrl', () => {
    if (mockState.getLatestReportByRepoUrl === 'error') {
      return HttpResponse.json(
        mockGetLatestReportByRepoUrlError(
          mockState.errorMessages['getLatestReportByRepoUrl'] ||
            'Get Latest Report Error'
        ),
        { status: 500 }
      )
    }
    if (mockState.getLatestReportByRepoUrl === 'empty') {
      return HttpResponse.json({ data: mockGetLatestReportByRepoUrlEmpty.data })
    }
    if (mockState.getLatestReportByRepoUrl === 'expired') {
      return HttpResponse.json({
        data: mockGetLatestReportByRepoUrlExpired.data,
      })
    }
    return HttpResponse.json({ data: mockGetLatestReportByRepoUrl.data })
  }),

  graphql.query<GetReportFixesQuery, GetReportFixesQueryVariables>(
    'GetReportFixes',
    () => {
      if (mockState.getReportFixes === 'error') {
        return HttpResponse.json(mockGetReportFixesError)
      }
      if (mockState.getReportFixes === 'empty') {
        return HttpResponse.json(mockGetReportFixesEmpty)
      }
      return HttpResponse.json(mockGetReportFixes)
    }
  ),
]

// Mock GraphQL control system
export const mockGraphQL = (
  requestSpy: ReturnType<typeof import('vitest').vi.fn>
) => ({
  reset: () => {
    try {
      // Clear request spy
      try {
        requestSpy.mockClear()
      } catch (e) {
        console.error('Error clearing requestSpy:', e)
      }

      // Reset all mock states to success
      try {
        mockState.me = 'success'
        mockState.uploadS3BucketInfo = 'success'
        mockState.getLastOrgAndNamedProject = 'success'
        mockState.createProject = 'success'
        mockState.submitVulnerabilityReport = 'success'
        mockState.getLatestReportByRepoUrl = 'success'
        mockState.createCliLogin = 'success'
        mockState.updateDownloadedFixData = 'success'
        mockState.getEncryptedApiToken = 'success'
        mockState.createCommunityUser = 'success'
        mockState.errorMessages = {}
        mockState.getReportFixes = 'success'
      } catch (e) {
        console.error('Error resetting mock states:', e)
      }
    } catch (e) {
      console.error('Error in mockGraphQL reset:', e)
    }

    // Always return this to ensure method chaining works
    return this
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
  getLastOrgAndNamedProject: () => {
    return {
      succeeds() {
        mockState.getLastOrgAndNamedProject = 'success'
        return this
      },
      projectNotFound() {
        mockState.getLastOrgAndNamedProject = 'projectNotFound'
        return this
      },
      failsWithError(message: string) {
        mockState.getLastOrgAndNamedProject = 'error'
        mockState.errorMessages['getLastOrgAndNamedProject'] = message
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
  createCliLogin: () => {
    return {
      succeeds() {
        mockState.createCliLogin = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.createCliLogin = 'error'
        mockState.errorMessages['createCliLogin'] = message
        return this
      },
    }
  },
  updateDownloadedFixData: () => {
    return {
      succeeds() {
        mockState.updateDownloadedFixData = 'success'
        return this
      },
    }
  },
  getEncryptedApiToken: () => {
    return {
      succeeds() {
        mockState.getEncryptedApiToken = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.getEncryptedApiToken = 'error'
        mockState.errorMessages['getEncryptedApiToken'] = message
        return this
      },
    }
  },
  createCommunityUser: () => {
    return {
      succeeds() {
        mockState.createCommunityUser = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.createCommunityUser = 'error'
        mockState.errorMessages['createCommunityUser'] = message
        return this
      },
      failsWithBadApiKey() {
        mockState.createCommunityUser = 'badApiKey'
        return this
      },
    }
  },
  getLatestReportByRepoUrl: () => {
    return {
      succeeds() {
        mockState.getLatestReportByRepoUrl = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.getLatestReportByRepoUrl = 'error'
        mockState.errorMessages['getLatestReportByRepoUrl'] = message
        return this
      },
      returnsEmptyReport() {
        mockState.getLatestReportByRepoUrl = 'empty'
        return this
      },
      returnsExpiredReport() {
        mockState.getLatestReportByRepoUrl = 'expired'
        return this
      },
    }
  },
  getReportFixes: () => {
    return {
      succeeds() {
        mockState.getReportFixes = 'success'
        return this
      },
      failsWithError(message: string) {
        mockState.getReportFixes = 'error'
        mockState.errorMessages['getReportFixes'] = message
        return this
      },
      returnsEmptyFixes() {
        mockState.getReportFixes = 'empty'
        return this
      },
    }
  },
})
