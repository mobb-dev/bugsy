import crypto from 'crypto'

import { AuthManager } from '../../commands/AuthManager'
import {
  GQLClient,
  isAuthError,
  isTransientError,
} from '../../features/analysis/graphql'
import {
  Fix_Report_State_Enum,
  FixDownloadSource,
  GetAnalysisQuery,
  GetAnalysisSubscriptionDocument,
  GetAnalysisSubscriptionSubscription,
  GetAnalysisSubscriptionSubscriptionVariables,
  MeQuery,
  SubmitVulnerabilityReportMutation,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { configStore } from '../../utils/ConfigStoreService'
import { getProxyAgent, httpToWsUrl } from '../../utils/proxy'
import { subscribeStream } from '../../utils/subscribe/subscribe'
import {
  MCP_DEFAULT_LIMIT,
  MCP_TOOLS_BROWSER_COOLDOWN_MS,
} from '../core/configs'
import {
  ApiConnectionError,
  AuthenticationError,
  FailedToGetApiTokenError,
} from '../core/Errors'
import { logDebug, logError } from '../Logger'
import { FixReportSummary, FixReportSummarySchema, McpFix } from '../types'
import { LoginContext } from './types'

// Re-export for existing consumers
export { isAuthError, isTransientError }
// Backwards-compatible alias
export const isNetworkError = isTransientError

type McpGQLClientArgs =
  | { apiKey: string; type: 'apiKey' }
  | { token: string; type: 'token' }

export class McpGQLClient extends GQLClient {
  private currentUser: MeQuery['me'] | null = null

  constructor(args: McpGQLClientArgs) {
    // Resolve API URL at construction time from env (matching old behavior)
    // so tests can set process.env['API_URL'] before creating a client.
    super({
      ...args,
      apiUrl: process.env['API_URL'] || undefined,
    })
  }

  private getErrorContext() {
    return {
      endpoint: this._apiUrl,
      apiKey: this._auth.type === 'apiKey' ? this._auth.apiKey : '',
      headers: {
        'x-mobb-key': this._auth.type === 'apiKey' ? '[REDACTED]' : 'undefined',
        'x-hasura-request-id': '[DYNAMIC]',
      },
    }
  }

  override async getUserInfo() {
    const me = await super.getUserInfo()
    this.currentUser = me
    return me
  }

  getCurrentUser(): MeQuery['me'] | null {
    return this.currentUser
  }

  override async uploadS3BucketInfo(): Promise<UploadS3BucketInfoMutation> {
    try {
      logDebug('[GraphQL] Calling uploadS3BucketInfo mutation')
      const result = await this._clientSdk.uploadS3BucketInfo({
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

  override async getAnalysis(
    analysisId: string
  ): Promise<NonNullable<GetAnalysisQuery['analysis']>> {
    try {
      logDebug('[GraphQL] Calling getAnalysis query', { analysisId })
      const res = await this._clientSdk.getAnalysis({
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

  override async submitVulnerabilityReport(
    variables: SubmitVulnerabilityReportMutationVariables
  ): Promise<SubmitVulnerabilityReportMutation> {
    try {
      logDebug('[GraphQL] Calling SubmitVulnerabilityReport mutation', {
        variables,
      })
      const result = await this._clientSdk.SubmitVulnerabilityReport(variables)
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
      return new Promise<GetAnalysisSubscriptionSubscription>(
        (resolve, reject) => {
          const subscription = subscribeStream<
            GetAnalysisSubscriptionSubscription,
            GetAnalysisSubscriptionSubscriptionVariables
          >(
            GetAnalysisSubscriptionDocument,
            params.subscribeToAnalysisParams,
            {
              next: async (data) => {
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
                  subscription.unsubscribe()
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
                  subscription.unsubscribe()
                  logDebug(
                    `[${scanContext}] GraphQL: GetAnalysis subscription completed`,
                    {
                      analysisId: data.analysis.id,
                      state: data.analysis.state,
                    }
                  )
                  resolve(data)
                }
              },
              error: (error) => {
                logError(
                  `[${scanContext}] GraphQL: GetAnalysis subscription failed`,
                  {
                    error,
                    params: params.subscribeToAnalysisParams,
                    ...this.getErrorContext(),
                  }
                )
                subscription.unsubscribe()
                reject(error)
              },
            },
            this._auth.type === 'apiKey'
              ? {
                  apiKey: this._auth.apiKey,
                  type: 'apiKey',
                  url: httpToWsUrl(this._apiUrl),
                  timeoutInMs: params.timeoutInMs,
                  proxyAgent: getProxyAgent(this._apiUrl),
                }
              : {
                  token: this._auth.token,
                  type: 'token',
                  url: httpToWsUrl(this._apiUrl),
                  timeoutInMs: params.timeoutInMs,
                  proxyAgent: getProxyAgent(this._apiUrl),
                }
          )
        }
      )
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
      const orgAndProjectRes = await this._clientSdk.getLastOrgAndNamedProject({
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
        const createdProject = await this._clientSdk.CreateProject({
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
            await this._clientSdk.getLastOrgAndNamedProject({
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

    const appBaseUrl = this._apiUrl
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
      projectId: reportData.vulnerabilityReport?.projectId,
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
      const resUpdate = await this._clientSdk.updateDownloadedFixData({
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
      const resUpdate = await this._clientSdk.updateDownloadedFixData({
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

      const result = await this._clientSdk.GetUserMvsAutoFix({
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
    fileFilter,
  }: {
    repoUrl: string
    limit?: number
    offset?: number
    fileFilter?: string[]
  }): Promise<{
    fixReport: Omit<FixReportSummary, 'userFixes'> | null
    expiredReport: { id: string; expirationOn?: string } | null
  }> {
    try {
      logDebug('[GraphQL] Calling GetLatestReportByRepoUrl query', {
        repoUrl,
        limit,
        offset,
        fileFilter,
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

      // Build filters object including file filter if provided
      const filters: Record<string, unknown> = {}
      if (fileFilter && fileFilter.length > 0) {
        filters['vulnerabilityReportIssues'] = {
          codeNodes: { path: { _in: fileFilter } },
        }
      }

      const resp = await this._clientSdk.GetLatestReportByRepoUrl({
        repoUrl,
        limit,
        offset,
        currentUserEmail,
        filters,
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
    fileFilter,
  }: {
    reportId: string
    limit?: number
    offset?: number
    issueType?: string[]
    severity?: string[]
    fileFilter?: string[]
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
    // Build filters object based on issueType, severity, and fileFilter
    const filters: Record<string, unknown> = {}

    if (issueType && issueType.length > 0) {
      filters['safeIssueType'] = { _in: issueType }
    }

    if (severity && severity.length > 0) {
      filters['severityText'] = { _in: severity }
    }

    if (fileFilter && fileFilter.length > 0) {
      filters['vulnerabilityReportIssues'] = {
        codeNodes: { path: { _in: fileFilter } },
      }
    }

    try {
      logDebug('[GraphQL] Calling GetReportFixes query', {
        reportId,
        limit,
        offset,
        filters,
        issueType,
        severity,
        fileFilter,
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

      const res = await this._clientSdk.GetReportFixes({
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

      logDebug('[GraphQL] GetReportFixes response parsed', { fixes: fixes })

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
  loginContext,
}: {
  isBackgroundCall?: boolean
  loginContext?: LoginContext
} = {}): Promise<McpGQLClient> {
  // Set MCP-specific browser cooldown
  if (isBackgroundCall) {
    AuthManager.setBrowserCooldown(MCP_TOOLS_BROWSER_COOLDOWN_MS)
  }

  logDebug('[GraphQL] Getting config', {
    apiToken: configStore.get('apiToken'),
  })

  const apiKey =
    process.env['MOBB_API_KEY'] ||
    process.env['API_KEY'] || // fallback for backward compatibility
    configStore.get('apiToken') ||
    ''

  // Use the same resolved API URL for both McpGQLClient and AuthManager
  // to avoid subtle mismatches between process.env reads at different times.
  const resolvedApiUrl = process.env['API_URL'] || undefined
  const authManager = new AuthManager(undefined, resolvedApiUrl)
  const initialClient = new McpGQLClient({ apiKey, type: 'apiKey' })
  authManager.setGQLClient(initialClient)

  const authResult = await authManager.checkAuthentication()

  if (authResult.isAuthenticated) {
    return initialClient
  }

  if (authResult.reason === 'unknown') {
    // Transient error — do NOT open browser
    logError('[GraphQL] Auth check failed with transient error', {
      message: authResult.message,
    })
    throw new ApiConnectionError(
      `Cannot verify authentication: ${authResult.message}`
    )
  }

  // Token invalid -> login flow
  const loginUrl = await authManager.generateLoginUrl(
    '/mvs-login',
    loginContext
  )
  if (!loginUrl) {
    throw new AuthenticationError('Failed to generate login URL')
  }

  const opened = authManager.openUrlInBrowser()
  if (!opened) {
    throw new AuthenticationError(
      'Authentication required but browser cooldown is active'
    )
  }

  // Use waitForApiToken (not waitForAuthentication) to avoid a redundant
  // validateUserToken call on a plain GQLClient. We validate below on
  // the McpGQLClient which overrides createCommunityUser to propagate
  // errors — ensuring the user is properly registered.
  const newApiToken = await authManager.waitForApiToken()
  if (!newApiToken) {
    throw new FailedToGetApiTokenError(
      `Login timeout: authentication not completed within ${AuthManager.loginMaxWait / 1000 / 60} minutes`
    )
  }

  const authenticatedClient = new McpGQLClient({
    apiKey: newApiToken,
    type: 'apiKey',
  })
  const loginSuccess = await authenticatedClient.validateUserToken()
  if (!loginSuccess) {
    throw new AuthenticationError('Login failed: token validation failed')
  }
  configStore.set('apiToken', newApiToken)

  return authenticatedClient
}
