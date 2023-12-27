export const POST_COMMENT_PATH =
  'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments'

export const DELETE_COMMENT_PATH =
  'DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const UPDATE_COMMENT_PATH =
  'PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}'

export const GET_PR_COMMENTS_PATH = 'GET /repos/{owner}/{repo}/pulls/comments'

export const REPLY_TO_CODE_REVIEW_COMMENT_PATH =
  'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies'

export const GET_COMMENT_PATH =
  'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}'
