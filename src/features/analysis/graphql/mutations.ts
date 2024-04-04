import { gql } from 'graphql-request'

export const UPDATE_SCM_TOKEN = gql`
  mutation updateScmToken(
    $scmType: String!
    $url: String!
    $token: String!
    $org: String
    $username: String
    $refreshToken: String
  ) {
    updateScmToken(
      scmType: $scmType
      url: $url
      token: $token
      org: $org
      username: $username
      refreshToken: $refreshToken
    ) {
      __typename
      ... on ScmAccessTokenUpdateSuccess {
        token
      }
      ... on InvalidScmTypeError {
        status
        error
      }
      ... on BadScmCredentials {
        status
        error
      }
    }
  }
`

export const UPLOAD_S3_BUCKET_INFO = gql`
  mutation uploadS3BucketInfo($fileName: String!) {
    uploadS3BucketInfo(fileName: $fileName) {
      status
      error
      reportUploadInfo: uploadInfo {
        url
        fixReportId
        uploadFieldsJSON
        uploadKey
      }
      repoUploadInfo {
        url
        fixReportId
        uploadFieldsJSON
        uploadKey
      }
    }
  }
`

export const DIGEST_VULNERABILITY_REPORT = gql`
  mutation DigestVulnerabilityReport(
    $vulnerabilityReportFileName: String!
    $fixReportId: String!
    $projectId: String!
  ) {
    digestVulnerabilityReport(
      fixReportId: $fixReportId
      vulnerabilityReportFileName: $vulnerabilityReportFileName
      projectId: $projectId
    ) {
      __typename
      ... on VulnerabilityReport {
        vulnerabilityReportId
        fixReportId
      }
      ... on RabbitSendError {
        status
        error
      }
      ... on ReportValidationError {
        status
        error
      }
      ... on ReferenceNotFoundError {
        status
        error
      }
    }
  }
`

export const SUBMIT_VULNERABILITY_REPORT = gql`
  mutation SubmitVulnerabilityReport(
    $fixReportId: String!
    $repoUrl: String!
    $reference: String!
    $projectId: String!
    $sha: String
    $experimentalEnabled: Boolean
    $vulnerabilityReportFileName: String
    $pullRequest: Int
  ) {
    submitVulnerabilityReport(
      fixReportId: $fixReportId
      repoUrl: $repoUrl
      reference: $reference
      sha: $sha
      experimentalEnabled: $experimentalEnabled
      pullRequest: $pullRequest
      projectId: $projectId
      vulnerabilityReportFileName: $vulnerabilityReportFileName
    ) {
      __typename
      ... on VulnerabilityReport {
        vulnerabilityReportId
        fixReportId
      }
    }
  }
`

export const CREATE_COMMUNITY_USER = gql`
  mutation CreateCommunityUser {
    initOrganizationAndProject {
      userId
      projectId
      organizationId
    }
  }
`

export const CREATE_CLI_LOGIN = gql`
  mutation CreateCliLogin($publicKey: String!) {
    insert_cli_login_one(object: { publicKey: $publicKey }) {
      id
    }
  }
`

export const PERFORM_CLI_LOGIN = gql`
  mutation performCliLogin($loginId: String!) {
    performCliLogin(loginId: $loginId) {
      status
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation CreateProject($organizationId: String!, $projectName: String!) {
    createProject(organizationId: $organizationId, projectName: $projectName) {
      projectId
    }
  }
`
