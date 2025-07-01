import crypto from 'node:crypto'
import os from 'node:os' // 5 sec

import { WEB_APP_URL } from '@mobb/bugsy/constants'
import { packageJson, sleep } from '@mobb/bugsy/utils'
import Configstore from 'configstore'
import { GraphQLClient } from 'graphql-request'
import open from 'open'
import { v4 as uuidv4 } from 'uuid'

import { subscribe } from '../../features/analysis/graphql/subscribe'
import {
  CreateCliLoginMutationVariables,
  Fix_Report_State_Enum,
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
import {
  MCP_API_KEY_HEADER_NAME,
  MCP_DEFAULT_API_URL,
  MCP_LOGIN_CHECK_DELAY,
  MCP_LOGIN_MAX_WAIT,
  MCP_TOOLS_BROWSER_COOLDOWN_MS,
} from '../core/configs'
import {
  ApiConnectionError,
  AuthenticationError,
  CliLoginError,
  FailedToGetApiTokenError,
} from '../core/Errors'
import { logDebug, logError, logInfo } from '../Logger'
import { FixReportSummary, McpFix } from '../types'

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

  async verifyConnection(): Promise<boolean> {
    try {
      logDebug('GraphQL: Calling Me query for connection verification')
      // Use the SDK's Me method for consistency
      const result = await this.clientSdk.Me()
      logDebug('GraphQL: Me query successful', { result })
      return true
    } catch (e: unknown) {
      const error = e as Error
      logDebug(`verify connection failed ${error.toString()}`)
      if (error?.toString().includes('FetchError')) {
        logError('verify connection failed', { error })
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

  async getUserInfo() {
    const { me } = await this.clientSdk.Me()
    return me
  }

  async verifyToken() {
    logDebug('verifying token')

    try {
      await this.clientSdk.CreateCommunityUser()
      const info = await this.getUserInfo()
      logDebug('token verified')
      return info?.email || true
    } catch (e) {
      logError('verify token failed')
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

  async getLatestReportByRepoUrl({
    repoUrl,
    limit = 3,
    offset = 0,
  }: {
    repoUrl: string
    limit?: number
    offset?: number
  }): Promise<{
    fixReport: FixReportSummary | null
    expiredReport: { id: string; expirationOn?: string } | null
  }> {
    try {
      logDebug('GraphQL: Calling GetLatestReportByRepoUrl query', {
        repoUrl,
        limit,
        offset,
      })
      const res = await this.clientSdk.GetLatestReportByRepoUrl({
        repoUrl,
        limit,
        offset,
      })
      logInfo('GraphQL: GetLatestReportByRepoUrl successful', {
        result: res,
        reportCount: res.fixReport?.length || 0,
      })
      return {
        fixReport: res.fixReport?.[0] || null,
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
    try {
      // Build filters object based on issueType and severity
      const filters: Record<string, unknown> = {}

      if (issueType && issueType.length > 0) {
        filters['safeIssueType'] = { _in: issueType }
      }

      if (severity && severity.length > 0) {
        filters['severityText'] = { _in: severity }
      }

      logDebug('GraphQL: Calling GetReportFixes query', {
        reportId,
        limit,
        offset,
        filters,
        issueType,
        severity,
      })

      const res = await this.clientSdk.GetReportFixes({
        reportId,
        limit,
        offset,
        filters,
      })

      logInfo('GraphQL: GetReportFixes successful', {
        result: res,
        fixCount: res.fixReport?.[0]?.fixes?.length || 0,
        totalCount:
          res.fixReport?.[0]?.filteredFixesCount?.aggregate?.count || 0,
      })

      if (res.fixReport.length === 0) {
        return null
      }

      return {
        fixes: res.fixReport?.[0]?.fixes || [],
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

async function openBrowser(url: string, isToolsCall: boolean) {
  if (isToolsCall) {
    const now = Date.now()
    const lastBrowserOpenTime = mobbConfigStore.get('lastBrowserOpenTime') || 0
    if (now - lastBrowserOpenTime < MCP_TOOLS_BROWSER_COOLDOWN_MS) {
      logDebug(`browser cooldown active, skipping open for ${url}`)
      return
    }
  }
  logDebug(`opening browser url ${url}`)
  await open(url)
  mobbConfigStore.set('lastBrowserOpenTime', Date.now())
}

export async function getMcpGQLClient({
  isToolsCall = false,
}: {
  isToolsCall?: boolean
} = {}): Promise<McpGQLClient> {
  logDebug('getting config', { apiToken: mobbConfigStore.get('apiToken') })
  const inGqlClient = new McpGQLClient({
    apiKey:
      process.env['MOBB_API_KEY'] ||
      process.env['API_KEY'] || // fallback for backward compatibility
      mobbConfigStore.get('apiToken') ||
      '',
    type: 'apiKey',
  })

  const isConnected = await inGqlClient.verifyConnection()
  logDebug('isConnected', { isConnected })
  if (!isConnected) {
    throw new ApiConnectionError('Error: failed to connect to Mobb API')
  }
  logDebug('verifying token')
  const userVerify = await inGqlClient.verifyToken()
  if (userVerify) {
    return inGqlClient
  }
  logDebug('verifying token failed')
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })
  logDebug('creating cli login')
  const loginId = await inGqlClient.createCliLogin({
    publicKey: publicKey.export({ format: 'pem', type: 'pkcs1' }).toString(),
  })
  if (!loginId) {
    throw new CliLoginError('Error: createCliLogin failed')
  }

  logDebug(`cli login created ${loginId}`)
  const webLoginUrl = `${WEB_APP_URL}/cli-login`
  const browserUrl = `${webLoginUrl}/${loginId}?hostname=${os.hostname()}`
  logDebug(`opening browser url ${browserUrl}`)
  await openBrowser(browserUrl, isToolsCall)
  logDebug(`waiting for login to complete`)
  let newApiToken = null
  for (let i = 0; i < MCP_LOGIN_MAX_WAIT / MCP_LOGIN_CHECK_DELAY; i++) {
    const encryptedApiToken = await inGqlClient.getEncryptedApiToken({
      loginId,
    })
    if (encryptedApiToken) {
      logDebug('encrypted API token received')
      newApiToken = crypto
        .privateDecrypt(privateKey, Buffer.from(encryptedApiToken, 'base64'))
        .toString('utf-8')
      logDebug('API token decrypted')
      break
    }
    await sleep(MCP_LOGIN_CHECK_DELAY)
  }

  if (!newApiToken) {
    throw new FailedToGetApiTokenError(
      'Error: failed to get encrypted api token'
    )
  }

  const newGqlClient = new McpGQLClient({ apiKey: newApiToken, type: 'apiKey' })
  const loginSuccess = await newGqlClient.verifyToken()
  if (loginSuccess) {
    logDebug(`set api token ${newApiToken}`)
    mobbConfigStore.set('apiToken', newApiToken)
  } else {
    throw new AuthenticationError('Invalid API token')
  }
  return newGqlClient
}
