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
