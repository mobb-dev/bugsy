import { Endpoints } from '@octokit/types'

import {
  DELETE_COMMENT_PATH,
  GET_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  POST_COMMENT_PATH,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'

export type GetCommentParams = Endpoints[typeof GET_COMMENT_PATH]['parameters']

export type GetCommentReponse = Endpoints[typeof GET_COMMENT_PATH]['response']

export type PostCommentParams =
  Endpoints[typeof POST_COMMENT_PATH]['parameters']

export type PostCommentReposnse =
  Endpoints[typeof POST_COMMENT_PATH]['response']

export type UpdateCommentParams =
  Endpoints[typeof UPDATE_COMMENT_PATH]['parameters']

export type GetPrCommentsParams =
  Endpoints[typeof GET_PR_COMMENTS_PATH]['parameters']

export type GetPrCommentsResponse =
  Endpoints[typeof GET_PR_COMMENTS_PATH]['response']

export type DeleteCommentResponse =
  Endpoints[typeof DELETE_COMMENT_PATH]['response']

export type DeleteCommentParams =
  Endpoints[typeof DELETE_COMMENT_PATH]['parameters']

export type UpdateCommentResponse =
  Endpoints[typeof UPDATE_COMMENT_PATH]['response']

export type ReplyToCodeReviewCommentPathParams =
  Endpoints[typeof REPLY_TO_CODE_REVIEW_COMMENT_PATH]['parameters']

export type ReplyToCodeReviewCommentPathResponse =
  Endpoints[typeof REPLY_TO_CODE_REVIEW_COMMENT_PATH]['response']
