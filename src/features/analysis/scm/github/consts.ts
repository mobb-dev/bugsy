export const POST_COMMENT_PATH =
  'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments'

export const DELETE_COMMENT_PATH =
  'DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const UPDATE_COMMENT_PATH =
  'PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const GET_PR_COMMENTS_PATH =
  'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments'
export const GET_PR_COMMENT_PATH =
  'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const REPLY_TO_CODE_REVIEW_COMMENT_PATH =
  'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies'

export const GET_PR = 'GET /repos/{owner}/{repo}/pulls/{pull_number}'
export const POST_GENERAL_PR_COMMENT =
  'POST /repos/{owner}/{repo}/issues/{issue_number}/comments'

export const GET_GENERAL_PR_COMMENTS =
  'GET /repos/{owner}/{repo}/issues/{issue_number}/comments'

export const DELETE_GENERAL_PR_COMMENT =
  'DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}'

export const GET_COMMENT_PATH =
  'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const CREATE_OR_UPDATE_A_REPOSITORY_SECRET =
  'PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}'

export const GET_A_REPOSITORY_PUBLIC_KEY =
  'GET /repos/{owner}/{repo}/actions/secrets/public-key'

export const GET_USER = 'GET /user'
export const GET_USER_REPOS = 'GET /user/repos'

export const GET_REPO_BRANCHES = 'GET /repos/{owner}/{repo}/branches'

/**
 * GraphQL fragments for batch operations on GitHub's GraphQL API.
 * These are used with executeBatchGraphQL to fetch data for multiple items in a single request.
 */
export const GITHUB_GRAPHQL_FRAGMENTS = {
  /**
   * Fragment for fetching PR additions/deletions.
   * Use with pullRequest(number: $n) alias.
   */
  PR_CHANGES: `
    additions
    deletions
  `,

  /**
   * Fragment for fetching PR comments.
   * Returns first 100 comments with author info.
   */
  PR_COMMENTS: `
    comments(first: 100) {
      nodes {
        author {
          login
          __typename
        }
        body
      }
    }
  `,
} as const
export const GET_PR_METRICS_QUERY = `
  query GetPRMetrics($owner: String!, $repo: String!, $prNumber: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $prNumber) {
        id
        number
        state
        isDraft
        createdAt
        mergedAt
        additions
        deletions
        commits(first: 100) {
          totalCount
          nodes {
            commit {
              oid
              committedDate
              author {
                date
              }
            }
          }
        }
        comments(first: 100) {
          totalCount
          nodes {
            id
          }
        }
      }
    }
  }
`
