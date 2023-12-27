import { Octokit } from '@octokit/core'

import {
  DELETE_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  POST_COMMENT_PATH,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'
import {
  DeleteCommentParams,
  DeleteCommentResponse,
  GetCommentParams,
  GetPrCommentsParams,
  GetPrCommentsResponse,
  PostCommentParams,
  PostCommentReposnse,
  ReplyToCodeReviewCommentPathParams,
  ReplyToCodeReviewCommentPathResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'

export function postPrComment(
  client: Octokit,
  params: PostCommentParams
): Promise<PostCommentReposnse> {
  return client.request(POST_COMMENT_PATH, params)
}
export function updatePrComment(
  client: Octokit,
  params: UpdateCommentParams
): Promise<UpdateCommentResponse> {
  return client.request(UPDATE_COMMENT_PATH, params)
}

export function getPrComments(
  client: Octokit,
  params: GetPrCommentsParams
): Promise<GetPrCommentsResponse> {
  return client.request(GET_PR_COMMENTS_PATH, params)
}

export function deleteComment(
  client: Octokit,
  params: DeleteCommentParams
): Promise<DeleteCommentResponse> {
  return client.request(DELETE_COMMENT_PATH, params)
}

export function getComment(
  client: Octokit,
  params: GetCommentParams
): Promise<GetPrCommentsResponse> {
  return client.request(GET_PR_COMMENTS_PATH, params)
}

export function replyToCodeReviewComment(
  client: Octokit,
  params: ReplyToCodeReviewCommentPathParams
): Promise<ReplyToCodeReviewCommentPathResponse> {
  return client.request(REPLY_TO_CODE_REVIEW_COMMENT_PATH, params)
}
