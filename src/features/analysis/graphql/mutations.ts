import { gql } from 'graphql-request'

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

export const SUBMIT_VULNERABILITY_REPORT = gql`
  mutation SubmitVulnerabilityReport(
    $vulnerabilityReportFileName: String!
    $fixReportId: String!
    $repoUrl: String!
    $reference: String!
    $projectId: String!
    $sha: String
  ) {
    submitVulnerabilityReport(
      fixReportId: $fixReportId
      repoUrl: $repoUrl
      reference: $reference
      sha: $sha
      vulnerabilityReportFileName: $vulnerabilityReportFileName
      projectId: $projectId
    ) {
      __typename
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
