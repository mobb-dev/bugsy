import Debug from 'debug'
import { GraphQLClient } from 'graphql-request'

import { API_URL } from '../../../constants'
import {
  CREATE_CLI_LOGIN,
  CREATE_COMMUNITY_USER,
  SUBMIT_VULNERABILITY_REPORT,
  UPLOAD_S3_BUCKET_INFO,
} from './mutations'
import { GET_ENCRYPTED_API_TOKEN, GET_ORG_AND_PROJECT_ID, ME } from './queries'
import {
  CreateCliLoginArgs,
  CreateCliLoginQuery,
  CreateCliLoginZ,
  GetEncryptedApiTokenArgs,
  GetEncryptedApiTokenQuery,
  GetEncryptedApiTokenZ,
  GetOrgAndProjectIdQuery,
  GetOrgAndProjectIdQueryZ,
  MeQuery,
  SubmitVulnerabilityReportArgs,
  SubmitVulnerabilityReportVariables,
  UploadS3BucketInfo,
  UploadS3BucketInfoZ,
} from './types'

const debug = Debug('mobbdev:gql')

const API_KEY_HEADER_NAME = 'x-mobb-key'

type GQLClientArgs = {
  apiKey: string
}

export class GQLClient {
  _client: GraphQLClient

  constructor(args: GQLClientArgs) {
    const { apiKey } = args
    debug(`init with apiKey ${apiKey}`)
    this._client = new GraphQLClient(API_URL, {
      headers: { [API_KEY_HEADER_NAME]: apiKey || '' },
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
