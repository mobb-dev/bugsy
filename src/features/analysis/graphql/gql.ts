import Debug from 'debug'
import { GraphQLClient } from 'graphql-request'

import { API_URL } from '../../../constants'
import {
  CREATE_COMMUNITY_USER,
  SUBMIT_VULNERABILITY_REPORT,
  UPLOAD_S3_BUCKET_INFO,
} from './mutations'
import { GET_ORG_AND_PROJECT_ID, ME } from './queries'
import {
  GetOrgAndProjectIdQuery,
  GetOrgAndProjectIdQueryZ,
  MeQuery,
  SubmitVulnerabilityReportArgs,
  SubmitVulnerabilityReportVariables,
  UploadS3BucketInfo,
  UploadS3BucketInfoZ,
} from './types'

const debug = Debug('mobbdev:gql')

type GQLClientArgs = {
  token?: string
  apiKey?: string
}

export class GQLClient {
  _client: GraphQLClient
  constructor(args: GQLClientArgs) {
    const { token, apiKey } = args
    debug(`init with apiKey ${apiKey} token ${token}`)
    const headers: ClientHeaders = apiKey
      ? { 'x-mobb-key': apiKey }
      : {
          authorization: `Bearer ${token}`,
        }
    this._client = new GraphQLClient(API_URL, { headers })
  }
  async getUserInfo() {
    const { me } = await this._client.request<MeQuery>(ME)
    return me
  }

  async verifyToken() {
    await this.createCommunityUser()

    try {
      await this._client.request<MeQuery>(ME)
    } catch (e) {
      debug('verify token failed %o', e)
      return false
    }
    return true
  }

  async getOrgAndProjectId() {
    const getOrgAndProjectIdResult =
      await this._client.request<GetOrgAndProjectIdQuery>(
        GET_ORG_AND_PROJECT_ID
      )
    const [user] = GetOrgAndProjectIdQueryZ.parse(
      getOrgAndProjectIdResult
    ).users

    const org = user.userOrganizationsAndUserOrganizationRoles[0].organization
    return {
      organizationId: org.id,
      projectId: org.projects[0].id,
    }
  }

  async createCommunityUser() {
    try {
      await this._client.request(CREATE_COMMUNITY_USER)
    } catch (e) {
      debug('create community user failed %o', e)
      // Ignore errors
    }
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

  async submitVulnerabilityReport({
    fixReportId,
    repoUrl,
    reference,
    projectId,
    sha,
  }: SubmitVulnerabilityReportArgs) {
    await this._client.request<
      { __typname: string },
      SubmitVulnerabilityReportVariables
    >(SUBMIT_VULNERABILITY_REPORT, {
      fixReportId,
      repoUrl,
      reference,
      vulnerabilityReportFileName: 'report.json',
      projectId,
      sha: sha || '',
    })
  }
}

type ClientHeaders = { 'x-mobb-key': string } | { authorization: string }
