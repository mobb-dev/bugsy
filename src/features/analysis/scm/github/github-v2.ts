import { Octokit } from '@octokit/core'

import {
  CREATE_OR_UPDATE_A_REPOSITORY_SECRET,
  DELETE_COMMENT_PATH,
  DELETE_GENERAL_PR_COMMENT,
  GET_A_REPOSITORY_PUBLIC_KEY,
  GET_GENERAL_PR_COMMENTS,
  GET_PR,
  GET_PR_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  POST_COMMENT_PATH,
  POST_GENERAL_PR_COMMENT,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'
import {
  CreateOrUpdateRepositorySecretParams,
  CreateOrUpdateRepositorySecretResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
  DeleteGeneralPrCommentParams,
  DeleteGeneralPrCommentResponse,
  GetARepositoryPublicKeyParams,
  GetARepositoryPublicKeyResponse,
  GetGeneralPrCommentResponse,
  GetPrCommentParams,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPrCommentsResponse,
  GetPrParams,
  GetPrResponse,
  GetPrReviewCommentsParams,
  PostCommentParams,
  PostCommentReposnse,
  PostGeneralPrCommentParams,
  PostGeneralPrCommentResponse,
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
export function getPrComment(
  client: Octokit,
  params: GetPrCommentParams
): Promise<GetPrCommentResponse> {
  return client.request(GET_PR_COMMENT_PATH, params)
}

export function deleteComment(
  client: Octokit,
  params: DeleteCommentParams
): Promise<DeleteCommentResponse> {
  return client.request(DELETE_COMMENT_PATH, params)
}

export function replyToCodeReviewComment(
  client: Octokit,
  params: ReplyToCodeReviewCommentPathParams
): Promise<ReplyToCodeReviewCommentPathResponse> {
  return client.request(REPLY_TO_CODE_REVIEW_COMMENT_PATH, params)
}
export function getPrDiff(client: Octokit, params: GetPrParams) {
  // we're using the media type to get the diff
  //https://docs.github.com/en/rest/using-the-rest-api/media-types?apiVersion=2022-11-28#commits-commit-comparison-and-pull-requests
  return client.request(GET_PR, { ...params, mediaType: { format: 'diff' } })
}
export function getPr(
  client: Octokit,
  params: GetPrParams
): Promise<GetPrResponse> {
  return client.request(GET_PR, { ...params })
}

export function createOrUpdateRepositorySecret(
  client: Octokit,
  params: CreateOrUpdateRepositorySecretParams
): Promise<CreateOrUpdateRepositorySecretResponse> {
  return client.request(CREATE_OR_UPDATE_A_REPOSITORY_SECRET, params)
}
export function getARepositoryPublicKey(
  client: Octokit,
  params: GetARepositoryPublicKeyParams
): Promise<GetARepositoryPublicKeyResponse> {
  return client.request(GET_A_REPOSITORY_PUBLIC_KEY, params)
}

export function postGeneralPrComment(
  client: Octokit,
  params: PostGeneralPrCommentParams
): Promise<PostGeneralPrCommentResponse> {
  return client.request(POST_GENERAL_PR_COMMENT, params)
}
export function getGeneralPrComments(
  client: Octokit,
  params: GetPrReviewCommentsParams
): Promise<GetGeneralPrCommentResponse> {
  return client.request(GET_GENERAL_PR_COMMENTS, params)
}
export function deleteGeneralPrComment(
  client: Octokit,
  params: DeleteGeneralPrCommentParams
): Promise<DeleteGeneralPrCommentResponse> {
  return client.request(DELETE_GENERAL_PR_COMMENT, params)
}
