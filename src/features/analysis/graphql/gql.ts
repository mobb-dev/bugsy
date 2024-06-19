import {
  CreateCliLoginMutationVariables,
  Fix_Report_State_Enum,
  GetAnalysisDocument,
  GetAnalysisSubscription,
  GetAnalysisSubscriptionVariables,
  GetEncryptedApiTokenQueryVariables,
  getSdk,
  Sdk,
  SubmitVulnerabilityReportMutationVariables,
} from '@mobb/bugsy/generates/client_generates'
import { sleep } from '@mobb/bugsy/utils'
import Debug from 'debug'
import { GraphQLClient } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import { API_URL } from '../../../constants'
import { subscribe } from './subscribe'
import {
  GetVulByNodesMetadataFilter,
  GetVulByNodesMetadataParams,
  GetVulByNodesMetadataZ,
  VulnerabilityReportIssueCodeNode,
} from './types'

const debug = Debug('mobbdev:gql')

export const API_KEY_HEADER_NAME = 'x-mobb-key'
const REPORT_STATE_CHECK_DELAY = 5 * 1000 // 5 sec

type GQLClientArgs =
  | {
      apiKey: string
      type: 'apiKey'
    }
  | {
      token: string
      type: 'token'
    }

export class GQLClient {
  _client: GraphQLClient
  _clientSdk: Sdk

  _auth: GQLClientArgs
  constructor(args: GQLClientArgs) {
    debug(`init with  ${args}`)
    this._auth = args
    this._client = new GraphQLClient(API_URL, {
      headers:
        args.type === 'apiKey'
          ? { [API_KEY_HEADER_NAME]: args.apiKey || '' }
          : {
              Authorization: `Bearer ${args.token}`,
            },
      requestMiddleware: (request) => {
        const requestId = uuidv4()
        debug(
          `sending API request with id: ${requestId} and with request: ${request.body}`
        )
        return {
          ...request,
          headers: {
            ...request.headers,
            'x-hasura-request-id': requestId,
          },
        }
      },
    })
    this._clientSdk = getSdk(this._client)
  }

  async getUserInfo() {
    const { me } = await this._clientSdk.Me()
    return me
  }

  async createCliLogin(
    variables: CreateCliLoginMutationVariables
  ): Promise<string> {
    const res = await this._clientSdk.CreateCliLogin(variables, {
      // We may have outdated API key in the config storage. Avoid using it for the login request.
      [API_KEY_HEADER_NAME]: '',
    })

    return res.insert_cli_login_one?.id || ''
  }

  async verifyToken() {
    await this.createCommunityUser()

    try {
      await this.getUserInfo()
    } catch (e) {
      debug('verify token failed %o', e)
      return false
    }
    return true
  }

  async getOrgAndProjectId(projectName?: string) {
    const getOrgAndProjectIdResult = await this._clientSdk.getOrgAndProjectId()
    const org = getOrgAndProjectIdResult?.users
      ?.at(0)
      ?.userOrganizationsAndUserOrganizationRoles?.at(0)?.organization
    if (!org?.id) {
      throw new Error('Organization not found')
    }
    const project = projectName
      ? org?.projects.find((project) => project.name === projectName) ?? null
      : org?.projects[0]
    if (!project?.id) {
      throw new Error('Project not found')
    }
    let projectId = project?.id
    if (!projectId) {
      const createdProject = await this._clientSdk.CreateProject({
        organizationId: org.id,
        projectName: projectName || 'My project',
      })
      projectId = createdProject.createProject.projectId
    }

    return {
      organizationId: org.id,
      projectId: projectId,
    }
  }

  async getEncryptedApiToken(
    variables: GetEncryptedApiTokenQueryVariables
  ): Promise<string | null> {
    const res = await this._clientSdk.GetEncryptedApiToken(variables, {
      // We may have outdated API key in the config storage. Avoid using it for the login request.
      [API_KEY_HEADER_NAME]: '',
    })
    return res?.cli_login_by_pk?.encryptedApiToken || null
  }

  async createCommunityUser() {
    try {
      await this._clientSdk.CreateCommunityUser()
    } catch (e) {
      debug('create community user failed %o', e)
      // Ignore errors
    }
  }

  async updateScmToken(args: {
    scmType: string
    url: string
    token: string
    org: string | undefined
    username: string | undefined
    refreshToken: string | undefined
  }) {
    const { scmType, url, token, org, username, refreshToken } = args
    const updateScmTokenResult = await this._clientSdk.updateScmToken({
      scmType,
      url,
      token,
      org,
      username,
      refreshToken,
    })
    return updateScmTokenResult
  }

  async uploadS3BucketInfo() {
    const uploadS3BucketInfoResult = await this._clientSdk.uploadS3BucketInfo({
      fileName: 'report.json',
    })
    return uploadS3BucketInfoResult
  }

  async getVulByNodesMetadata({
    hunks,
    vulnerabilityReportId,
  }: GetVulByNodesMetadataParams) {
    const filters = hunks.map((hunk) => {
      const filter: GetVulByNodesMetadataFilter = {
        path: { _eq: hunk.path },
        _or: hunk.ranges.flatMap(({ endLine, startLine }) => {
          return [
            { startLine: { _gte: startLine, _lte: endLine } },
            { endLine: { _gte: startLine, _lte: endLine } },
          ]
        }),
      }
      return filter
    })
    const getVulByNodesMetadataRes =
      await this._clientSdk.getVulByNodesMetadata({
        filters: { _or: filters },
        vulnerabilityReportId,
      })
    const parsedGetVulByNodesMetadataRes = GetVulByNodesMetadataZ.parse(
      getVulByNodesMetadataRes
    )

    // We need to filter out duplicate vulnerabilities by metadata,
    // the vulnerability nodes are ordered by index, so we can just take the first one
    const uniqueVulByNodesMetadata =
      parsedGetVulByNodesMetadataRes.vulnerabilityReportIssueCodeNodes.reduce<
        Record<string, VulnerabilityReportIssueCodeNode>
      >((acc, vulnerabilityReportIssueCodeNode) => {
        if (acc[vulnerabilityReportIssueCodeNode.vulnerabilityReportIssueId]) {
          return acc
        }
        return {
          ...acc,
          [vulnerabilityReportIssueCodeNode.vulnerabilityReportIssueId]:
            vulnerabilityReportIssueCodeNode,
        }
      }, {})
    const nonFixablePrVuls =
      parsedGetVulByNodesMetadataRes.nonFixablePrVuls.aggregate.count
    const fixablePrVuls =
      parsedGetVulByNodesMetadataRes.fixablePrVuls.aggregate.count
    const totalScanVulnerabilities =
      parsedGetVulByNodesMetadataRes.totalScanVulnerabilities.aggregate.count
    const vulnerabilitiesOutsidePr =
      totalScanVulnerabilities - nonFixablePrVuls - fixablePrVuls
    const totalPrVulnerabilities = nonFixablePrVuls + fixablePrVuls
    return {
      vulnerabilityReportIssueCodeNodes: Object.values(
        uniqueVulByNodesMetadata
      ),
      nonFixablePrVuls,
      fixablePrVuls,
      totalScanVulnerabilities,
      vulnerabilitiesOutsidePr,
      totalPrVulnerabilities,
    }
  }

  async digestVulnerabilityReport({
    fixReportId,
    projectId,
  }: {
    fixReportId: string
    projectId: string
  }) {
    const res = await this._clientSdk.DigestVulnerabilityReport({
      fixReportId,
      vulnerabilityReportFileName: 'report.json',
      projectId,
    })
    if (res.digestVulnerabilityReport.__typename !== 'VulnerabilityReport') {
      throw new Error('Digesting vulnerability report failed')
    }
    return res.digestVulnerabilityReport
  }

  async submitVulnerabilityReport(
    params: SubmitVulnerabilityReportMutationVariables
  ) {
    const {
      fixReportId,
      repoUrl,
      reference,
      projectId,
      sha,
      experimentalEnabled,
      vulnerabilityReportFileName,
      pullRequest,
    } = params
    const res = await this._clientSdk.SubmitVulnerabilityReport({
      fixReportId,
      repoUrl,
      reference,
      vulnerabilityReportFileName,
      projectId,
      pullRequest,
      sha: sha || '',
      experimentalEnabled,
    })
    return res
  }

  async getFixReportState(fixReportId: string) {
    const res = await this._clientSdk.FixReportState({ id: fixReportId })
    return res?.fixReport_by_pk?.state || Fix_Report_State_Enum.Created
  }

  async waitFixReportInit(fixReportId: string, includeDigested = false) {
    // report init might be very quick, so we need to do manual polling
    const FINAL_STATES = [
      Fix_Report_State_Enum.Finished,
      Fix_Report_State_Enum.Failed,
    ]
    let lastState = Fix_Report_State_Enum.Created
    let attempts = 100

    if (includeDigested) {
      FINAL_STATES.push(Fix_Report_State_Enum.Digested)
    }

    do {
      await sleep(REPORT_STATE_CHECK_DELAY)
      lastState = await this.getFixReportState(fixReportId)
    } while (
      !FINAL_STATES.includes(
        lastState // wait for final the state of the fix report
      ) &&
      attempts-- > 0
    )

    return lastState
  }

  async getVulnerabilityReportPaths(vulnerabilityReportId: string) {
    const res = await this._clientSdk.GetVulnerabilityReportPaths({
      vulnerabilityReportId,
    })
    return res.vulnerability_report_path.map((p) => p.path)
  }

  async subscribeToAnalysis(params: {
    subscribeToAnalysisParams: GetAnalysisSubscriptionVariables
    callback: (analysisId: string) => void
    callbackStates: Fix_Report_State_Enum[]
    timeoutInMs?: number
  }) {
    const { callbackStates } = params
    return subscribe<GetAnalysisSubscription, GetAnalysisSubscriptionVariables>(
      GetAnalysisDocument,
      params.subscribeToAnalysisParams,
      async (resolve, reject, data) => {
        if (
          !data.analysis?.state ||
          data.analysis?.state === Fix_Report_State_Enum.Failed
        ) {
          reject(data)
          throw new Error(`Analysis failed with id: ${data.analysis?.id}`)
        }
        if (callbackStates.includes(data.analysis?.state)) {
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
  }
  async getAnalysis(analysisId: string) {
    const res = await this._clientSdk.getAnalsyis({
      analysisId,
    })
    if (!res.analysis) {
      throw new Error(`Analysis not found: ${analysisId}`)
    }
    return res.analysis
  }
  async getFixes(fixIds: string[]) {
    const res = await this._clientSdk.getFixes({
      filters: { id: { _in: fixIds } },
    })
    return res
  }
}
