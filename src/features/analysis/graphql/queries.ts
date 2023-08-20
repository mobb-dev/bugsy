import { gql } from 'graphql-request'

export const ME = gql`
  query Me {
    me {
      id
      email
      githubToken
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
          }
        }
      }
    }
  }
`
