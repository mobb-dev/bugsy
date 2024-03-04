import { sleep } from '@mobb/bugsy/utils'
import Debug from 'debug'
import { GraphQLClient } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import { API_URL } from '../../../constants'
import {
  CREATE_CLI_LOGIN,
  CREATE_COMMUNITY_USER,
  DIGEST_VULNERABILITY_REPORT,
  SUBMIT_VULNERABILITY_REPORT,
  UPDATE_SCM_TOKEN,
  UPLOAD_S3_BUCKET_INFO,
} from './mutations'
import {
  GET_ANALYSIS,
  GET_ENCRYPTED_API_TOKEN,
  GET_FIX,
  GET_FIX_REPORT_STATE,
  GET_ORG_AND_PROJECT_ID,
  GET_VUL_BY_NODES_METADATA,
  GET_VULNERABILITY_REPORT_PATHS,
  ME,
  SUBSCRIBE_TO_ANALYSIS,
} from './queries'
import { subscribe } from './subscirbe'
import {
  CreateCliLoginArgs,
  CreateCliLoginQuery,
  CreateCliLoginZ,
  CreateUpdateFixReportMutation,
  CreateUpdateFixReportMutationZ,
  DigestVulnerabilityReportArgs,
  DigestVulnerabilityReportQuery,
  DigestVulnerabilityReportZ,
  GetAnalysisQuery,
  GetAnalysisQueryZ,
  GetEncryptedApiTokenArgs,
  GetEncryptedApiTokenQuery,
  GetEncryptedApiTokenZ,
  GetFixQuery,
  GetFixQueryZ,
  GetFixReportQuery,
  GetFixReportSubscription,
  GetFixReportZ,
  GetOrgAndProjectIdQuery,
  GetOrgAndProjectIdQueryZ,
  GetVulByNodesMetadata,
  GetVulByNodesMetadataFilter,
  GetVulByNodesMetadataParams,
  GetVulByNodesMetadataQueryParams,
  GetVulByNodesMetadataZ,
  GetVulnerabilityReportPathsZ,
  MeQuery,
  SubmitVulnerabilityReportVariables,
  UpdateScmToken,
  UpdateScmTokenZ,
  UploadS3BucketInfo,
  UploadS3BucketInfoZ,
  VulnerabilityReportIssueCodeNode,
} from './types'

const debug = Debug('mobbdev:gql')

export const API_KEY_HEADER_NAME = 'x-mobb-key'
const REPORT_STATE_CHECK_DELAY = 5 * 1000 // 5 sec

type GQLClientArgs = {
  apiKey: string
}

export class GQLClient {
  _client: GraphQLClient
  _apiKey: string

  constructor(args: GQLClientArgs) {
    const { apiKey } = args
    this._apiKey = apiKey
    debug(`init with apiKey ${apiKey}`)
    this._client = new GraphQLClient(API_URL, {
      headers: { [API_KEY_HEADER_NAME]: apiKey || '' },
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
  }

  async getUserInfo() {
    const { me } = await this._client.request<MeQuery>(ME)
    return me
  }

  async createCliLogin(variables: CreateCliLoginArgs): Promise<string> {
    const res = CreateCliLoginZ.parse(
      await this._client.request<CreateCliLoginQuery>(
        CREATE_CLI_LOGIN,
        variables,
        {
          // We may have outdated API key in the config storage. Avoid using it for the login request.
          [API_KEY_HEADER_NAME]: '',
        }
      )
    )

    return res.insert_cli_login_one.id
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
    const getOrgAndProjectIdResult =
      await this._client.request<GetOrgAndProjectIdQuery>(
        GET_ORG_AND_PROJECT_ID
      )
    const [user] = GetOrgAndProjectIdQueryZ.parse(
      getOrgAndProjectIdResult
    ).users

    const org = user.userOrganizationsAndUserOrganizationRoles[0].organization
    const project = projectName
      ? org.projects.find((project) => project.name === projectName) ??
        org.projects[0]
      : org.projects[0]

    return {
      organizationId: org.id,
      projectId: project.id,
    }
  }

  async getEncryptedApiToken(
    variables: GetEncryptedApiTokenArgs
  ): Promise<string | null> {
    const res = await this._client.request<GetEncryptedApiTokenQuery>(
      GET_ENCRYPTED_API_TOKEN,
      variables,
      {
        // We may have outdated API key in the config storage. Avoid using it for the login request.
        [API_KEY_HEADER_NAME]: '',
      }
    )
    return GetEncryptedApiTokenZ.parse(res).cli_login_by_pk.encryptedApiToken
  }

  async createCommunityUser() {
    try {
      await this._client.request(CREATE_COMMUNITY_USER)
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
    const updateScmTokenResult = await this._client.request<
      UpdateScmToken,
      {
        scmType: string
        url: string
        token: string
        org: string | undefined
        username: string | undefined
        refreshToken: string | undefined
      }
    >(UPDATE_SCM_TOKEN, {
      scmType,
      url,
      token,
      org,
      username,
      refreshToken,
    })
    return UpdateScmTokenZ.parse(updateScmTokenResult)
  }

  async uploadS3BucketInfo() {
    const uploadS3BucketInfoResult = await this._client.request<
      UploadS3BucketInfo,
      { fileName: string }
    >(UPLOAD_S3_BUCKET_INFO, {
      fileName: 'report.json',
    })
    return UploadS3BucketInfoZ.parse(uploadS3BucketInfoResult)
  }

  async getVulByNodesMetadata({
    hunks,
    vulnerabilityReportId,
  }: GetVulByNodesMetadataParams) {
    const filters = hunks.map((hunk) => {
      const filter: GetVulByNodesMetadataFilter = {
        path: { _eq: hunk.path },
        vulnerabilityReportIssue: { fixId: { _is_null: false } },
        _or: hunk.ranges.map(({ endLine, startLine }) => ({
          startLine: { _gte: startLine, _lte: endLine },
          endLine: { _gte: startLine, _lte: endLine },
        })),
      }
      return filter
    })
    const getVulByNodesMetadataRes = await this._client.request<
      GetVulByNodesMetadata,
      GetVulByNodesMetadataQueryParams
    >(GET_VUL_BY_NODES_METADATA, {
      filters: { _or: filters },
      vulnerabilityReportId,
    })
    const parsedGetVulByNodesMetadataRes = GetVulByNodesMetadataZ.parse(
      getVulByNodesMetadataRes
    )
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
    return {
      vulnerabilityReportIssueCodeNodes: Object.values(
        uniqueVulByNodesMetadata
      ),
    }
  }

  async digestVulnerabilityReport({
    fixReportId,
    projectId,
  }: DigestVulnerabilityReportArgs) {
    const res = await this._client.request<DigestVulnerabilityReportQuery>(
      DIGEST_VULNERABILITY_REPORT,
      {
        fixReportId,
        vulnerabilityReportFileName: 'report.json',
        projectId,
      }
    )
    return DigestVulnerabilityReportZ.parse(res).digestVulnerabilityReport
  }

  async submitVulnerabilityReport(params: SubmitVulnerabilityReportVariables) {
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
    const res = await this._client.request<
      CreateUpdateFixReportMutation,
      SubmitVulnerabilityReportVariables
    >(SUBMIT_VULNERABILITY_REPORT, {
      fixReportId,
      repoUrl,
      reference,
      vulnerabilityReportFileName,
      projectId,
      pullRequest,
      sha: sha || '',
      experimentalEnabled,
    })
    return CreateUpdateFixReportMutationZ.parse(res)
  }

  async getFixReportState(fixReportId: string) {
    const res = await this._client.request<GetFixReportQuery>(
      GET_FIX_REPORT_STATE,
      { id: fixReportId }
    )
    return GetFixReportZ.parse(res).fixReport_by_pk.state
  }

  async waitFixReportInit(fixReportId: string, includeDigested = false) {
    // report init might be very quick, so we need to do manual polling
    const FINAL_STATES = ['Finished', 'Failed']
    let lastState = 'Created'
    let attempts = 100

    if (includeDigested) {
      FINAL_STATES.push('Digested')
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
    const res = await this._client.request<GetFixReportQuery>(
      GET_VULNERABILITY_REPORT_PATHS,
      { vulnerabilityReportId }
    )
    return GetVulnerabilityReportPathsZ.parse(
      res
    ).vulnerability_report_path.map((p) => p.path)
  }

  async subscribeToAnalysis(
    params: SubscribeToAnalysisParams,
    callback: (analysisId: string) => void
  ) {
    return subscribe<GetFixReportSubscription, SubscribeToAnalysisParams>(
      SUBSCRIBE_TO_ANALYSIS,
      params,
      async (resolve, reject, data) => {
        if (data.analysis.state === 'Failed') {
          reject(data)
          throw new Error(`Analysis failed with id: ${data.analysis.id}`)
        }
        if (data.analysis?.state === 'Finished') {
          await callback(data.analysis.id)
          resolve(data)
        }
      },
      {
        apiKey: this._apiKey,
      }
    )
  }
  async getAnalysis(analysisId: string) {
    const res = await this._client.request<GetAnalysisQuery>(GET_ANALYSIS, {
      analysisId,
    })
    return GetAnalysisQueryZ.parse(res)
  }
  async getFix(fixId: string) {
    const res = await this._client.request<GetFixQuery, { fixId: string }>(
      GET_FIX,
      {
        fixId,
      }
    )
    return GetFixQueryZ.parse(res)
  }
}

type SubscribeToAnalysisParams = { analysisId: string }
