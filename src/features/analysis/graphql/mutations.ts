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
