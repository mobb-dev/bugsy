import crypto from 'crypto'
import { GraphQLClient } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import { subscribe } from '../../features/analysis/graphql/subscribe'
import {
  CreateCliLoginMutationVariables,
  FinalizeAiBlameInferencesUploadMutation,
  FinalizeAiBlameInferencesUploadMutationVariables,
  Fix_Report_State_Enum,
  FixDownloadSource,
  GetAnalysisQuery,
  GetAnalysisSubscriptionDocument,
  GetAnalysisSubscriptionSubscription,
  GetAnalysisSubscriptionSubscriptionVariables,
  GetEncryptedApiTokenQueryVariables,
  getSdk,
  MeQuery,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UploadAiBlameInferencesInitMutation,
  UploadAiBlameInferencesInitMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import {
  MCP_API_KEY_HEADER_NAME,
  MCP_DEFAULT_API_URL,
  MCP_DEFAULT_LIMIT,
} from '../core/configs'
import { ApiConnectionError } from '../core/Errors'
import { logDebug, logError } from '../Logger'
import { FixReportSummary, FixReportSummarySchema, McpFix } from '../types'
import { configStore } from './ConfigStoreService'
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

// Simple GQLClient for the fixVulnerabilities tool
export class McpGQLClient {
  private client: GraphQLClient
  private clientSdk: ReturnType<typeof getSdk>
  _auth: GQLClientArgs
  private currentUser: MeQuery['me'] | null = null
  private readonly apiUrl: string

  constructor(args: GQLClientArgs) {
    this._auth = args
    this.apiUrl = process.env['API_URL'] || MCP_DEFAULT_API_URL

    logDebug(`[GraphQL] Creating graphql client with api url ${this.apiUrl}`, {
      args,
    })
    this.client = new GraphQLClient(this.apiUrl, {
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
      endpoint: this.apiUrl,
      apiKey: this._auth.type === 'apiKey' ? this._auth.apiKey : '',
      headers: {
        [MCP_API_KEY_HEADER_NAME]:
          this._auth.type === 'apiKey' ? '[REDACTED]' : 'undefined',
        'x-hasura-request-id': '[DYNAMIC]',
      },
    }
  }

  async uploadAIBlameInferencesInitRaw(
    variables: UploadAiBlameInferencesInitMutationVariables
  ): Promise<UploadAiBlameInferencesInitMutation> {
    return await this.clientSdk.UploadAIBlameInferencesInit(variables)
  }

  async finalizeAIBlameInferencesUploadRaw(
    variables: FinalizeAiBlameInferencesUploadMutationVariables
  ): Promise<FinalizeAiBlameInferencesUploadMutation> {
    return await this.clientSdk.FinalizeAIBlameInferencesUpload(variables)
  }

  async isApiEndpointReachable(): Promise<boolean> {
    try {
      logDebug('[GraphQL] Calling Me query for API connection verification')
      // Use the getUserInfo method for consistency
      const result = await this.getUserInfo()
      logDebug('[GraphQL] Me query successful', { result })
      return true
    } catch (e: unknown) {
      const error = e as Error
      logDebug(`[GraphQL] API connection verification failed`, { error })
      if (error?.toString().includes('FetchError')) {
        logError('[GraphQL] API connection verification failed', { error })
        return false
      }
    }
    return true
  }

  /**
   * Verifies both API endpoint reachability and user authentication
   * @returns true if both API is reachable and user is authenticated
   */
  async verifyApiConnection(): Promise<boolean> {
    // First check if API endpoint is reachable
    const isReachable = await this.isApiEndpointReachable()
    if (!isReachable) {
      return false
    }

    // Then validate user token
    try {
      await this.validateUserToken()
      return true
    } catch (e) {
      logError('User token validation failed', { error: e })
      return false
    }
  }

  async uploadS3BucketInfo(): Promise<UploadS3BucketInfoMutation> {
    try {
      logDebug('[GraphQL] Calling uploadS3BucketInfo mutation')
      // Use the SDK's uploadS3BucketInfo method
      const result = await this.clientSdk.uploadS3BucketInfo({
        fileName: 'report.json',
      })
      logDebug('[GraphQL] uploadS3BucketInfo successful', { result })
      return result
    } catch (e) {
      logError('[GraphQL] uploadS3BucketInfo failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getAnalysis(analysisId: string): Promise<GetAnalysisQuery['analysis']> {
    try {
      logDebug('[GraphQL] Calling getAnalysis query', { analysisId })
      const res = await this.clientSdk.getAnalysis({
        analysisId,
      })
      logDebug('[GraphQL] getAnalysis successful', { result: res })
      if (!res.analysis) {
        throw new Error(`Analysis not found: ${analysisId}`)
      }
      return res.analysis
    } catch (e) {
      logError('[GraphQL] getAnalysis failed', {
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
      logDebug('[GraphQL] Calling SubmitVulnerabilityReport mutation', {
        variables,
      })
      const result = await this.clientSdk.SubmitVulnerabilityReport(variables)
      logDebug('[GraphQL] SubmitVulnerabilityReport successful', { result })
      return result
    } catch (e) {
      logError('[GraphQL] SubmitVulnerabilityReport failed', {
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
    scanContext: string
  }): Promise<GetAnalysisSubscriptionSubscription> {
    const { scanContext } = params
    try {
      logDebug(`[${scanContext}] GraphQL: Starting GetAnalysis subscription`, {
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
          logDebug(
            `[${scanContext}] GraphQL: GetAnalysis subscription data received ${data.analysis?.state}`,
            { data }
          )
          if (
            !data.analysis?.state ||
            data.analysis?.state === Fix_Report_State_Enum.Failed
          ) {
            const errorMessage =
              data.analysis?.failReason ||
              `Analysis failed with id: ${data.analysis?.id}`
            logError(`[${scanContext}] GraphQL: Analysis failed`, {
              analysisId: data.analysis?.id,
              state: data.analysis?.state,
              failReason: data.analysis?.failReason,
              ...this.getErrorContext(),
            })
            reject(new Error(errorMessage))
            return
          }
          if (callbackStates.includes(data.analysis?.state)) {
            logDebug(
              `[${scanContext}] GraphQL: Analysis state matches callback states: ${data.analysis.state}`,
              {
                analysisId: data.analysis.id,
                state: data.analysis.state,
                callbackStates,
              }
            )
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
      logDebug(`[${scanContext}] GraphQL: GetAnalysis subscription completed`, {
        result,
      })
      return result
    } catch (e) {
      logError(`[${scanContext}] GraphQL: GetAnalysis subscription failed`, {
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
      logDebug('[GraphQL] Calling getLastOrgAndNamedProject query', {
        projectName,
      })
      const orgAndProjectRes = await this.clientSdk.getLastOrgAndNamedProject({
        email: userEmail,
        projectName,
      })
      logDebug('[GraphQL] getLastOrgAndNamedProject successful', {
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
        logDebug('[GraphQL] Found existing project', {
          projectId,
          projectName,
        })
        return projectId
      }

      logDebug('[GraphQL] Project not found, creating new project', {
        organizationId: organization.id,
        projectName,
      })

      try {
        const createdProject = await this.clientSdk.CreateProject({
          organizationId: organization.id,
          projectName: projectName,
        })
        logDebug('[GraphQL] CreateProject successful', {
          result: createdProject,
        })
        return createdProject.createProject.projectId
      } catch (createError: unknown) {
        // Check if the error is a uniqueness constraint violation
        const errorMessage =
          createError instanceof Error
            ? createError.message
            : String(createError)
        const isConstraintViolation =
          errorMessage.includes(
            'duplicate key value violates unique constraint'
          ) && errorMessage.includes('project_name_organization_id_key')

        if (isConstraintViolation) {
          logDebug(
            '[GraphQL] Project creation failed due to constraint violation, retrying fetch',
            {
              organizationId: organization.id,
              projectName,
              error: errorMessage,
            }
          )

          // Retry fetching the project that was created by another process
          const retryOrgAndProjectRes =
            await this.clientSdk.getLastOrgAndNamedProject({
              email: userEmail,
              projectName,
            })

          const retryProjectId =
            retryOrgAndProjectRes.user?.[0]
              ?.userOrganizationsAndUserOrganizationRoles?.[0]?.organization
              ?.projects?.[0]?.id

          if (retryProjectId) {
            logDebug(
              '[GraphQL] Successfully found existing project after constraint violation',
              {
                projectId: retryProjectId,
                projectName,
              }
            )
            return retryProjectId
          }

          // If we still can't find the project after retry, throw the original error
          logError(
            '[GraphQL] Failed to find project even after constraint violation retry',
            {
              organizationId: organization.id,
              projectName,
              retryResult: retryOrgAndProjectRes,
            }
          )
        }

        // Re-throw the original error if it's not a constraint violation or retry failed
        throw createError
      }
    } catch (e) {
      logError('[GraphQL] getProjectId failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getUserInfo() {
    const { me } = await this.clientSdk.Me()
    this.currentUser = me
    return me
  }

  getCurrentUser(): MeQuery['me'] | null {
    return this.currentUser
  }

  async validateUserToken() {
    logDebug('[GraphQL] Validating user token')

    try {
      await this.clientSdk.CreateCommunityUser()
      const info = await this.getUserInfo()
      logDebug('[GraphQL] User token validated successfully')
      return info?.email || true
    } catch (e) {
      logError('[GraphQL] User token validation failed')
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
        logError('[GraphQL] Create cli login failed - no login ID returned')
        return ''
      }
      return loginId
    } catch (e) {
      logError('[GraphQL] Create cli login failed', { error: e })
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
      logError('[GraphQL] Get encrypted api token failed', { error: e })
      return null
    }
  }

  private generateFixUrl({
    fixId,
    organizationId,
    projectId,
    reportId,
  }: {
    fixId: string
    organizationId?: string
    projectId?: string
    reportId?: string
  }): string | undefined {
    if (!organizationId || !projectId || !reportId) {
      return undefined
    }

    const appBaseUrl = this.apiUrl
      .replace('/v1/graphql', '')
      .replace('api.', '')
    return `${appBaseUrl}/organization/${organizationId}/project/${projectId}/report/${reportId}/fix/${fixId}`
  }

  private mergeUserAndSystemFixes({
    reportData,
    limit,
  }: {
    reportData: FixReportSummary | undefined
    limit: number
  }): McpFix[] {
    if (!reportData) return []

    const reportMetadata = {
      id: reportData.id,
      organizationId: reportData.vulnerabilityReport?.project?.organizationId,
      projectId: reportData.vulnerabilityReport?.project?.id,
    }

    const { userFixes = [], fixes = [] } = reportData

    // Use Map for O(1) deduplication instead of O(n²) array operations
    const fixMap = new Map<string, McpFix>()

    // Prioritize user fixes
    for (const fix of userFixes) {
      if (fix.id) {
        const fixWithUrl = {
          ...fix,
          fixUrl: this.generateFixUrl({
            fixId: fix.id,
            organizationId: reportMetadata?.organizationId,
            projectId: reportMetadata?.projectId,
            reportId: reportMetadata?.id,
          }),
        }
        fixMap.set(fix.id, fixWithUrl)
      }
    }

    // Add system fixes that aren't duplicates
    for (const fix of fixes) {
      if (fix.id && !fixMap.has(fix.id)) {
        const fixWithUrl = {
          ...fix,
          fixUrl: this.generateFixUrl({
            fixId: fix.id,
            organizationId: reportMetadata?.organizationId,
            projectId: reportMetadata?.projectId,
            reportId: reportMetadata?.id,
          }),
        }
        fixMap.set(fix.id, fixWithUrl)
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
      logDebug('[GraphQL] updateFixesDownloadStatus successful', {
        result: resUpdate,
        fixIds,
      })
    } else {
      logDebug('[GraphQL] No fixes found to update download status')
    }
  }

  async updateAutoAppliedFixesStatus(fixIds: string[]) {
    if (fixIds.length > 0) {
      const resUpdate = await this.clientSdk.updateDownloadedFixData({
        fixIds,
        source: FixDownloadSource.AutoMvs,
      })
      logDebug('[GraphQL] updateAutoAppliedFixesStatus successful', {
        result: resUpdate,
        fixIds,
        note: 'Auto-applied via MVS automation',
      })
    } else {
      logDebug('[GraphQL] No auto-applied fixes to update status')
    }
  }

  async getMvsAutoFixSettings(): Promise<boolean> {
    try {
      // Check for environment variable override first
      const envOverride = process.env['MVS_AUTO_FIX']
      if (envOverride !== undefined) {
        const overrideValue = envOverride.toLowerCase() === 'true'
        logDebug('[Environment] Using MVS_AUTO_FIX override', {
          envValue: envOverride,
          resolvedValue: overrideValue,
        })
        return overrideValue
      }

      const userInfo = await this.getUserInfo()
      if (!userInfo?.email) {
        throw new Error('User email not found')
      }

      logDebug('[GraphQL] Calling GetUserMvsAutoFix query', {
        userEmail: userInfo.email,
      })

      const result = await this.clientSdk.GetUserMvsAutoFix({
        userEmail: userInfo.email,
      })

      logDebug('[GraphQL] GetUserMvsAutoFix successful', { result })

      // Return the mvs_auto_fix value from the first settings record, default to true if no settings found
      return result.user_email_notification_settings?.[0]?.mvs_auto_fix ?? true
    } catch (e) {
      logError('[GraphQL] GetUserMvsAutoFix failed', {
        error: e,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getLatestReportByRepoUrl({
    repoUrl,
    limit = MCP_DEFAULT_LIMIT,
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
      logDebug('[GraphQL] Calling GetLatestReportByRepoUrl query', {
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
        logDebug('[GraphQL] Failed to get user email, using default pattern', {
          error: err,
        })
      }

      const resp = await this.clientSdk.GetLatestReportByRepoUrl({
        repoUrl,
        limit,
        offset,
        currentUserEmail,
      })

      logDebug('[GraphQL] GetLatestReportByRepoUrl successful', {
        result: resp,
        reportCount: resp.fixReport?.length || 0,
      })
      const latestReport =
        resp.fixReport?.[0] && FixReportSummarySchema.parse(resp.fixReport?.[0])

      const fixes = this.mergeUserAndSystemFixes({
        reportData: latestReport,
        limit,
      })

      return {
        fixReport: latestReport
          ? {
              ...latestReport,
              fixes,
            }
          : null,
        expiredReport: resp.expiredReport?.[0] || null,
      }
    } catch (e) {
      logError('[GraphQL] GetLatestReportByRepoUrl failed', {
        error: e,
        repoUrl,
        ...this.getErrorContext(),
      })
      throw e
    }
  }

  async getReportFixesPaginated({
    reportId,
    limit = MCP_DEFAULT_LIMIT,
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
    fixReport?: {
      id: string
      organizationId?: string
      projectId?: string
    }
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
      logDebug('[GraphQL] Calling GetReportFixes query', {
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
        logDebug('[GraphQL] Failed to get user email, using default pattern', {
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

      logDebug('[GraphQL] GetReportFixes successful', {
        result: res,
        fixCount: res.fixReport?.[0]?.fixes?.length || 0,
        totalCount:
          res.fixReport?.[0]?.filteredFixesCount?.aggregate?.count || 0,
      })

      if (res.fixReport.length === 0) {
        return null
      }

      const latestReport = FixReportSummarySchema.parse(res.fixReport?.[0])

      const fixes = this.mergeUserAndSystemFixes({
        reportData: latestReport,
        limit,
      })

      return {
        fixes,
        totalCount:
          res.fixReport?.[0]?.filteredFixesCount?.aggregate?.count || 0,
        expiredReport: res.expiredReport?.[0] || null,
        fixReport: res.fixReport?.[0]
          ? {
              id: res.fixReport[0].id,
              organizationId:
                res.fixReport[0].vulnerabilityReport?.project?.organizationId,
              projectId: res.fixReport[0].vulnerabilityReport?.projectId,
            }
          : undefined,
      }
    } catch (e) {
      logError('[GraphQL] GetReportFixes failed', {
        error: e,
        reportId,
        ...this.getErrorContext(),
      })
      throw e
    }
  }
}

export async function createAuthenticatedMcpGQLClient({
  isBackgroundCall = false,
}: {
  isBackgroundCall?: boolean
} = {}): Promise<McpGQLClient> {
  logDebug('[GraphQL] Getting config', {
    apiToken: configStore.get('apiToken'),
  })
  const initialClient = new McpGQLClient({
    apiKey:
      process.env['MOBB_API_KEY'] ||
      process.env['API_KEY'] || // fallback for backward compatibility
      configStore.get('apiToken') ||
      '',
    type: 'apiKey',
  })

  const isApiEndpointReachable = await initialClient.isApiEndpointReachable()
  logDebug('[GraphQL] API connection status', { isApiEndpointReachable })
  if (!isApiEndpointReachable) {
    throw new ApiConnectionError('Error: failed to reach Mobb GraphQL endpoint')
  }

  logDebug('[GraphQL] Validating user token')
  const userVerify = await initialClient.validateUserToken()
  if (userVerify) {
    return initialClient
  }

  // Token verification failed, authenticate using the auth service
  const authService = new McpAuthService(initialClient)
  const newApiToken = await authService.authenticate(isBackgroundCall)

  // Store the new token for future use
  configStore.set('apiToken', newApiToken)

  // Return a client with the new token
  return new McpGQLClient({ apiKey: newApiToken, type: 'apiKey' })
}
