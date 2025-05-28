import { GraphQLClient } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import {
  Fix_Report_State_Enum,
  GetAnalysisQuery,
  GetAnalysisSubscriptionDocument,
  GetAnalysisSubscriptionSubscription,
  GetAnalysisSubscriptionSubscriptionVariables,
  getSdk,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { API_KEY_HEADER_NAME, DEFAULT_API_URL } from '../constants'
import { logDebug, logError, logInfo } from '../Logger'
import { subscribe } from './Subscribe'

// Simple GQLClient for the fixVulnerabilities tool
export class McpGQLClient {
  private client: GraphQLClient
  private clientSdk: ReturnType<typeof getSdk>
  private apiKey: string
  private apiUrl: string

  constructor(args: { apiKey: string; type: 'apiKey' }) {
    const API_URL = process.env['API_URL'] || DEFAULT_API_URL

    this.apiKey = args.apiKey
    this.apiUrl = API_URL
    this.client = new GraphQLClient(API_URL, {
      headers: { [API_KEY_HEADER_NAME]: args.apiKey || '' },
      requestMiddleware: (request) => {
        const requestId = uuidv4()
        return {
          ...request,
          headers: {
            ...request.headers,
            'x-hasura-request-id': requestId,
          },
        }
      },
    })

    this.clientSdk = getSdk(this.client)
  }

  private getErrorContext() {
    return {
      endpoint: this.apiUrl,
      headers: {
        [API_KEY_HEADER_NAME]: this.apiKey ? '[REDACTED]' : 'undefined',
        'x-hasura-request-id': '[DYNAMIC]',
      },
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      logDebug('GraphQL: Calling Me query for connection verification')
      // Use the SDK's Me method for consistency
      const result = await this.clientSdk.Me()
      logInfo('GraphQL: Me query successful', { result })
      return true
    } catch (e) {
      logError('GraphQL: Me query failed', {
        error: e,
        ...this.getErrorContext(),
      })
      if (e?.toString().startsWith('FetchError')) {
        console.error('Connection verification failed:', e)
      }
      return false
    }
  }

  async uploadS3BucketInfo(): Promise<UploadS3BucketInfoMutation> {
    try {
      logDebug('GraphQL: Calling uploadS3BucketInfo mutation')
      // Use the SDK's uploadS3BucketInfo method
      const result = await this.clientSdk.uploadS3BucketInfo({
        fileName: 'report.json',
      })
      logInfo('GraphQL: uploadS3BucketInfo successful', { result })
      return result
    } catch (e) {
      logError('GraphQL: uploadS3BucketInfo failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getAnalysis(analysisId: string): Promise<GetAnalysisQuery['analysis']> {
    try {
      logDebug('GraphQL: Calling getAnalysis query', { analysisId })
      const res = await this.clientSdk.getAnalysis({
        analysisId,
      })
      logInfo('GraphQL: getAnalysis successful', { result: res })
      if (!res.analysis) {
        throw new Error(`Analysis not found: ${analysisId}`)
      }
      return res.analysis
    } catch (e) {
      logError('GraphQL: getAnalysis failed', {
        error: e,
        analysisId,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async submitVulnerabilityReport(
    variables: SubmitVulnerabilityReportMutationVariables
  ): Promise<SubmitVulnerabilityReportMutation> {
    try {
      logDebug('GraphQL: Calling SubmitVulnerabilityReport mutation', {
        variables,
      })
      const result = await this.clientSdk.SubmitVulnerabilityReport(variables)
      logInfo('GraphQL: SubmitVulnerabilityReport successful', { result })
      return result
    } catch (e) {
      logError('GraphQL: SubmitVulnerabilityReport failed', {
        error: e,
        variables,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async subscribeToGetAnalysis(params: {
    subscribeToAnalysisParams: GetAnalysisSubscriptionSubscriptionVariables
    callback: (analysisId: string) => void
    callbackStates: Fix_Report_State_Enum[]
    timeoutInMs?: number
  }): Promise<GetAnalysisSubscriptionSubscription> {
    try {
      logDebug('GraphQL: Starting GetAnalysis subscription', {
        params: params.subscribeToAnalysisParams,
      })
      const { callbackStates } = params
      const result = await subscribe<
        GetAnalysisSubscriptionSubscription,
        GetAnalysisSubscriptionSubscriptionVariables
      >(
        GetAnalysisSubscriptionDocument,
        params.subscribeToAnalysisParams,
        async (resolve, reject, data) => {
          logDebug('GraphQL: GetAnalysis subscription data received', { data })
          if (
            !data.analysis?.state ||
            data.analysis?.state === Fix_Report_State_Enum.Failed
          ) {
            logError('GraphQL: Analysis failed', {
              analysisId: data.analysis?.id,
              state: data.analysis?.state,
              ...this.getErrorContext(),
            })
            reject(new Error(`Analysis failed with id: ${data.analysis?.id}`))
            return
          }
          if (callbackStates.includes(data.analysis?.state)) {
            logInfo('GraphQL: Analysis state matches callback states', {
              analysisId: data.analysis.id,
              state: data.analysis.state,
              callbackStates,
            })
            await params.callback(data.analysis.id)
            resolve(data)
          }
        },
        {
          apiKey: this.apiKey,
          type: 'apiKey',
          timeoutInMs: params.timeoutInMs,
        }
      )
      logInfo('GraphQL: GetAnalysis subscription completed', { result })
      return result
    } catch (e) {
      logError('GraphQL: GetAnalysis subscription failed', {
        error: e,
        params: params.subscribeToAnalysisParams,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getProjectId() {
    try {
      const projectName = 'MCP Scans'
      logDebug('GraphQL: Calling getOrgAndProjectId query', { projectName })
      const getOrgAndProjectIdResult = await this.clientSdk.getOrgAndProjectId({
        filters: {},
        limit: 1,
      })
      logInfo('GraphQL: getOrgAndProjectId successful', {
        result: getOrgAndProjectIdResult,
      })

      const [organizationToOrganizationRole] =
        getOrgAndProjectIdResult.organization_to_organization_role
      if (!organizationToOrganizationRole) {
        throw new Error('Organization not found')
      }

      const { organization: org } = organizationToOrganizationRole
      const project = projectName
        ? (org?.projects.find((project) => project.name === projectName) ??
          null)
        : org?.projects[0]

      if (project?.id) {
        logInfo('GraphQL: Found existing project', {
          projectId: project.id,
          projectName,
        })
        return project.id
      }

      logDebug('GraphQL: Project not found, creating new project', {
        organizationId: org.id,
        projectName,
      })
      const createdProject = await this.clientSdk.CreateProject({
        organizationId: org.id,
        projectName: projectName,
      })
      logInfo('GraphQL: CreateProject successful', { result: createdProject })
      return createdProject.createProject.projectId
    } catch (e) {
      logError('GraphQL: getProjectId failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getReportFixes(fixReportId: string) {
    try {
      logDebug('GraphQL: Calling GetMCPFixes query', { fixReportId })
      const res = await this.clientSdk.GetMCPFixes({ fixReportId })
      logInfo('GraphQL: GetMCPFixes successful', {
        result: res,
        fixCount: res.fix?.length || 0,
      })
      return res.fix
    } catch (e) {
      logError('GraphQL: GetMCPFixes failed', {
        error: e,
        fixReportId,
        ...this.getErrorContext(),
      })
      throw e
    }
  }
}
