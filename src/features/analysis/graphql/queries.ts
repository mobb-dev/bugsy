import { gql } from 'graphql-request'

export const ME = gql`
  query Me {
    me {
      id
      email
      scmConfigs {
        id
        isBroker
        orgId
        refreshToken
        scmType
        scmUrl
        scmUsername
        token
        tokenLastUpdate
        userId
        scmOrg
        isTokenAvailable
      }
    }
  }
`

//TDOO: theres a bug here- we should query only the user's projects
export const GET_ORG_AND_PROJECT_ID = gql`
  query getOrgAndProjectId {
    users: user {
      userOrganizationsAndUserOrganizationRoles {
        organization {
          id
          projects(order_by: { updatedAt: desc }) {
            id
            name
          }
        }
      }
    }
  }
`

export const GET_ENCRYPTED_API_TOKEN = gql`
  query GetEncryptedApiToken($loginId: uuid!) {
    cli_login_by_pk(id: $loginId) {
      encryptedApiToken
    }
  }
`

export const GET_FIX_REPORT_STATE = gql`
  query FixReportState($id: uuid!) {
    fixReport_by_pk(id: $id) {
      state
    }
  }
`

export const GET_VULNERABILITY_REPORT_PATHS = gql`
  query GetVulnerabilityReportPaths($vulnerabilityReportId: uuid!) {
    vulnerability_report_path(
      where: { vulnerabilityReportId: { _eq: $vulnerabilityReportId } }
    ) {
      path
    }
  }
`

export const SUBSCRIBE_TO_ANALYSIS = gql`
  subscription getAnalysis($analysisId: uuid!) {
    analysis: fixReport_by_pk(id: $analysisId) {
      id
      state
    }
  }
`

export const GET_ANALYSIS = gql`
  query getAnalsyis($analysisId: uuid!) {
    analysis: fixReport_by_pk(id: $analysisId) {
      id
      state
      repo {
        commitSha
        pullRequest
      }
      vulnerabilityReportId
      vulnerabilityReport {
        projectId
        project {
          organizationId
        }
        file {
          signedFile {
            url
          }
        }
      }
    }
  }
`

export const GET_FIX = gql`
  query getFix($fixId: uuid!) {
    fix_by_pk(id: $fixId) {
      issueType
      id
      patchAndQuestions {
        patch
      }
    }
  }
`

export const GET_VUL_BY_NODES_METADATA = gql`
  query getVulByNodesMetadata(
    $filters: [vulnerability_report_issue_code_node_bool_exp!]
    $vulnerabilityReportId: uuid!
  ) {
    vulnerabilityReportIssueCodeNodes: vulnerability_report_issue_code_node(
      order_by: { index: desc }
      where: {
        _or: $filters
        vulnerabilityReportIssue: {
          vulnerabilityReportId: { _eq: $vulnerabilityReportId }
        }
      }
    ) {
      vulnerabilityReportIssueId
      path
      startLine
      vulnerabilityReportIssue {
        issueType
        fixId
      }
    }
  }
`
