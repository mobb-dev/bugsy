import { packageJson } from '@mobb/bugsy/utils'
import Configstore from 'configstore'
import crypto from 'crypto'
import { GraphQLClient } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import { subscribe } from '../../features/analysis/graphql/subscribe'
import {
  CreateCliLoginMutationVariables,
  Fix_Report_State_Enum,
  FixDownloadSource,
  GetAnalysisQuery,
  GetAnalysisSubscriptionDocument,
  GetAnalysisSubscriptionSubscription,
  GetAnalysisSubscriptionSubscriptionVariables,
  GetEncryptedApiTokenQueryVariables,
  getSdk,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { MCP_API_KEY_HEADER_NAME, MCP_DEFAULT_API_URL } from '../core/configs'
import { ApiConnectionError } from '../core/Errors'
import { logDebug, logError } from '../Logger'
import { FixReportSummary, McpFix } from '../types'
import { McpAuthService } from './McpAuthService'

type GQLClientArgs =
  | {
      apiKey: string
      type: 'apiKey'
    }
  | {
      token: string
      type: 'token'
    }

const mobbConfigStore = new Configstore(packageJson.name, { apiToken: '' })

// Simple GQLClient for the fixVulnerabilities tool
export class McpGQLClient {
  private client: GraphQLClient
  private clientSdk: ReturnType<typeof getSdk>
  _auth: GQLClientArgs

  constructor(args: GQLClientArgs) {
    this._auth = args
    const API_URL = process.env['API_URL'] || MCP_DEFAULT_API_URL

    logDebug('creating graphql client', { API_URL, args })
    this.client = new GraphQLClient(API_URL, {
      headers:
        args.type === 'apiKey'
          ? { [MCP_API_KEY_HEADER_NAME]: args.apiKey || '' }
          : {
              Authorization: `Bearer ${args.token}`,
            },

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
      endpoint: process.env['API_URL'] || MCP_DEFAULT_API_URL,
      apiKey: this._auth.type === 'apiKey' ? this._auth.apiKey : '',
      headers: {
        [MCP_API_KEY_HEADER_NAME]:
          this._auth.type === 'apiKey' ? '[REDACTED]' : 'undefined',
        'x-hasura-request-id': '[DYNAMIC]',
      },
    }
  }

  async verifyApiConnection(): Promise<boolean> {
    try {
      logDebug('GraphQL: Calling Me query for API connection verification')
      // Use the SDK's Me method for consistency
      const result = await this.clientSdk.Me()
      logDebug('GraphQL: Me query successful', { result })
      return true
    } catch (e: unknown) {
      const error = e as Error
      logDebug(`API connection verification failed ${error.toString()}`)
      if (error?.toString().includes('FetchError')) {
        logError('API connection verification failed', { error })
        return false
      }
    }
    return true
  }

  async uploadS3BucketInfo(): Promise<UploadS3BucketInfoMutation> {
    try {
      logDebug('GraphQL: Calling uploadS3BucketInfo mutation')
      // Use the SDK's uploadS3BucketInfo method
      const result = await this.clientSdk.uploadS3BucketInfo({
        fileName: 'report.json',
      })
      logDebug('GraphQL: uploadS3BucketInfo successful', { result })
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
      logDebug('GraphQL: getAnalysis successful', { result: res })
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
      logDebug('GraphQL: SubmitVulnerabilityReport successful', { result })
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
            const errorMessage =
              data.analysis?.failReason ||
              `Analysis failed with id: ${data.analysis?.id}`
            logError('GraphQL: Analysis failed', {
              analysisId: data.analysis?.id,
              state: data.analysis?.state,
              failReason: data.analysis?.failReason,
              ...this.getErrorContext(),
            })
            reject(new Error(errorMessage))
            return
          }
          if (callbackStates.includes(data.analysis?.state)) {
            logDebug('GraphQL: Analysis state matches callback states', {
              analysisId: data.analysis.id,
              state: data.analysis.state,
              callbackStates,
            })
            await params.callback(data.analysis.id)
            resolve(data)
          }
        },

        this._auth.type === 'apiKey'
          ? {
              apiKey: this._auth.apiKey,
              type: 'apiKey',
              timeoutInMs: params.timeoutInMs,
            }
          : {
              token: this._auth.token,
              type: 'token',
              timeoutInMs: params.timeoutInMs,
            }
      )
      logDebug('GraphQL: GetAnalysis subscription completed', { result })
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
      const me = await this.getUserInfo()
      if (!me) {
        throw new Error('User not found')
      }
      const userEmail = me.email
      if (!userEmail) {
        throw new Error('User email not found')
      }

      const shortEmailHash = crypto
        .createHash('sha256')
        .update(userEmail)
        .digest('hex')
        .slice(0, 8)
        .toUpperCase()

      const projectName = `MCP Scans ${shortEmailHash}`
      logDebug('GraphQL: Calling getLastOrgAndNamedProject query', {
        projectName,
      })
      const orgAndProjectRes = await this.clientSdk.getLastOrgAndNamedProject({
        email: userEmail,
        projectName,
      })
      logDebug('GraphQL: getLastOrgAndNamedProject successful', {
        result: orgAndProjectRes,
      })

      if (
        !orgAndProjectRes.user?.[0]
          ?.userOrganizationsAndUserOrganizationRoles?.[0]?.organization?.id
      ) {
        throw new Error(
          `The user with email:${userEmail}  is not associated with any organization`
        )
      }
      const organization =
        orgAndProjectRes.user?.[0]
          ?.userOrganizationsAndUserOrganizationRoles?.[0]?.organization
      const projectId = organization?.projects?.[0]?.id

      if (projectId) {
        logDebug('GraphQL: Found existing project', {
          projectId,
          projectName,
        })
        return projectId
      }

      logDebug('GraphQL: Project not found, creating new project', {
        organizationId: organization.id,
        projectName,
      })
      const createdProject = await this.clientSdk.CreateProject({
        organizationId: organization.id,
        projectName: projectName,
      })
      logDebug('GraphQL: CreateProject successful', { result: createdProject })
      return createdProject.createProject.projectId
    } catch (e) {
      logError('GraphQL: getProjectId failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getUserInfo() {
    const { me } = await this.clientSdk.Me()
    return me
  }

  async validateUserToken() {
    logDebug('validating user token')

    try {
      await this.clientSdk.CreateCommunityUser()
      const info = await this.getUserInfo()
      logDebug('user token validated successfully')
      return info?.email || true
    } catch (e) {
      logError('user token validation failed')
      return false
    }
  }

  async createCliLogin(
    variables: CreateCliLoginMutationVariables
  ): Promise<string> {
    try {
      const res = await this.clientSdk.CreateCliLogin(variables, {
        // We may have outdated API key in the config storage. Avoid using it for the login request.
        [MCP_API_KEY_HEADER_NAME]: '',
      })

      const loginId = res.insert_cli_login_one?.id || ''
      if (!loginId) {
        logError('create cli login failed - no login ID returned')
        return ''
      }
      return loginId
    } catch (e) {
      logError('create cli login failed', { error: e })
      return ''
    }
  }

  async getEncryptedApiToken(
    variables: GetEncryptedApiTokenQueryVariables
  ): Promise<string | null> {
    try {
      const res = await this.clientSdk.GetEncryptedApiToken(variables, {
        // We may have outdated API key in the config storage. Avoid using it for the login request.
        [MCP_API_KEY_HEADER_NAME]: '',
      })
      return res?.cli_login_by_pk?.encryptedApiToken || null
    } catch (e) {
      logError('get encrypted api token failed', { error: e })
      return null
    }
  }

  private mergeUserAndSystemFixes(
    reportData: { userFixes?: McpFix[]; fixes?: McpFix[] } | undefined,
    limit: number
  ): McpFix[] {
    if (!reportData) return []

    const { userFixes = [], fixes = [] } = reportData

    // Use Map for O(1) deduplication instead of O(n²) array operations
    const fixMap = new Map<string, McpFix>()

    // Prioritize user fixes
    for (const fix of userFixes) {
      if (fix.id) {
        fixMap.set(fix.id, fix)
      }
    }

    // Add system fixes that aren't duplicates
    for (const fix of fixes) {
      if (fix.id && !fixMap.has(fix.id)) {
        fixMap.set(fix.id, fix)
      }
    }

    // Convert to array and apply limit
    return Array.from(fixMap.values()).slice(0, limit)
  }

  async updateFixesDownloadStatus(fixIds: string[]) {
    if (fixIds.length > 0) {
      const resUpdate = await this.clientSdk.updateDownloadedFixData({
        fixIds,
        source: FixDownloadSource.Mcp,
      })
      logDebug('GraphQL: updateFixesDownloadStatus successful', {
        result: resUpdate,
        fixIds,
      })
    } else {
      logDebug('GraphQL: No fixes found to update download status')
    }
  }

  async getLatestReportByRepoUrl({
    repoUrl,
    limit = 3,
    offset = 0,
  }: {
    repoUrl: string
    limit?: number
    offset?: number
  }): Promise<{
    fixReport: Omit<FixReportSummary, 'userFixes'> | null
    expiredReport: { id: string; expirationOn?: string } | null
  }> {
    try {
      logDebug('GraphQL: Calling GetLatestReportByRepoUrl query', {
        repoUrl,
        limit,
        offset,
      })

      // Get the current user info to add email with wildcards
      let currentUserEmail = '%@%' // Default pattern to match any email
      try {
        const userInfo = await this.getUserInfo()
        if (userInfo?.email) {
          // Add wildcards for partial matching
          currentUserEmail = `%${userInfo.email}%`
        }
      } catch (err) {
        logDebug('Failed to get user email, using default pattern', {
          error: err,
        })
      }

      const res = await this.clientSdk.GetLatestReportByRepoUrl({
        repoUrl,
        limit,
        offset,
        currentUserEmail,
      })
      logDebug('GraphQL: GetLatestReportByRepoUrl successful', {
        result: res,
        reportCount: res.fixReport?.length || 0,
      })

      const fixes = this.mergeUserAndSystemFixes(res.fixReport?.[0], limit)
      const fixIds = fixes.map((fix) => fix.id)
      await this.updateFixesDownloadStatus(fixIds)

      return {
        fixReport: res.fixReport?.[0]
          ? {
              ...res.fixReport?.[0],
              fixes,
            }
          : null,
        expiredReport: res.expiredReport?.[0] || null,
      }
    } catch (e) {
      logError('GraphQL: GetLatestReportByRepoUrl failed', {
        error: e,
        repoUrl,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getReportFixesPaginated({
    reportId,
    limit = 3,
    offset = 0,
    issueType,
    severity,
  }: {
    reportId: string
    limit?: number
    offset?: number
    issueType?: string[]
    severity?: string[]
  }): Promise<{
    fixes: McpFix[]
    totalCount: number
    expiredReport: { id: string; expirationOn?: string } | null
  } | null> {
    // Build filters object based on issueType and severity
    const filters: Record<string, unknown> = {}

    if (issueType && issueType.length > 0) {
      filters['safeIssueType'] = { _in: issueType }
    }

    if (severity && severity.length > 0) {
      filters['severityText'] = { _in: severity }
    }

    try {
      logDebug('GraphQL: Calling GetReportFixes query', {
        reportId,
        limit,
        offset,
        filters,
        issueType,
        severity,
      })

      // Get the current user info to add email with wildcards
      let currentUserEmail = '%@%' // Default pattern to match any email
      try {
        const userInfo = await this.getUserInfo()
        if (userInfo?.email) {
          // Add wildcards for partial matching
          currentUserEmail = `%${userInfo.email}%`
        }
      } catch (err) {
        logDebug('Failed to get user email, using default pattern', {
          error: err,
        })
      }

      const res = await this.clientSdk.GetReportFixes({
        reportId,
        limit,
        offset,
        filters,
        currentUserEmail,
      })

      logDebug('GraphQL: GetReportFixes successful', {
        result: res,
        fixCount: res.fixReport?.[0]?.fixes?.length || 0,
        totalCount:
          res.fixReport?.[0]?.filteredFixesCount?.aggregate?.count || 0,
      })

      if (res.fixReport.length === 0) {
        return null
      }

      const fixes = this.mergeUserAndSystemFixes(res.fixReport?.[0], limit)
      const fixIds = fixes.map((fix) => fix.id)
      await this.updateFixesDownloadStatus(fixIds)

      return {
        fixes,
        totalCount:
          res.fixReport?.[0]?.filteredFixesCount?.aggregate?.count || 0,
        expiredReport: res.expiredReport?.[0] || null,
      }
    } catch (e) {
      logError('GraphQL: GetReportFixes failed', {
        error: e,
        reportId,
        ...this.getErrorContext(),
      })
      throw e
    }
  }
}

export async function createAuthenticatedMcpGQLClient({
  isBackgoundCall = false,
}: {
  isBackgoundCall?: boolean
} = {}): Promise<McpGQLClient> {
  logDebug('getting config', { apiToken: mobbConfigStore.get('apiToken') })
  const initialClient = new McpGQLClient({
    apiKey:
      process.env['MOBB_API_KEY'] ||
      process.env['API_KEY'] || // fallback for backward compatibility
      mobbConfigStore.get('apiToken') ||
      '',
    type: 'apiKey',
  })

  const isConnected = await initialClient.verifyApiConnection()
  logDebug('API connection status', { isConnected })
  if (!isConnected) {
    throw new ApiConnectionError('Error: failed to connect to Mobb API')
  }

  logDebug('validating user token')
  const userVerify = await initialClient.validateUserToken()
  if (userVerify) {
    return initialClient
  }

  // Token verification failed, authenticate using the auth service
  const authService = new McpAuthService(initialClient)
  const newApiToken = await authService.authenticate(isBackgoundCall)

  // Store the new token for future use
  mobbConfigStore.set('apiToken', newApiToken)

  // Return a client with the new token
  return new McpGQLClient({ apiKey: newApiToken, type: 'apiKey' })
}
