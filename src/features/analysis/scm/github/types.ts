import { Endpoints } from '@octokit/types'

import {
  CREATE_OR_UPDATE_A_REPOSITORY_SECRET,
  DELETE_COMMENT_PATH,
  DELETE_GENERAL_PR_COMMENT,
  GET_A_REPOSITORY_PUBLIC_KEY,
  GET_COMMENT_PATH,
  GET_GENERAL_PR_COMMENTS,
  GET_PR,
  GET_PR_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  GET_USER,
  POST_COMMENT_PATH,
  POST_GENERAL_PR_COMMENT,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'

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

export type GetPrCommentParams =
  Endpoints[typeof GET_PR_COMMENT_PATH]['parameters']

export type GetPrCommentResponse =
  Endpoints[typeof GET_PR_COMMENT_PATH]['response']

export type DeleteCommentResponse =
  Endpoints[typeof DELETE_COMMENT_PATH]['response']

export type DeleteCommentParams =
  Endpoints[typeof DELETE_COMMENT_PATH]['parameters']

export type UpdateCommentResponse =
  Endpoints[typeof UPDATE_COMMENT_PATH]['response']

export type ReplyToCodeReviewCommentPathParams =
  Endpoints[typeof REPLY_TO_CODE_REVIEW_COMMENT_PATH]['parameters']

export type GetPrParams = Endpoints[typeof GET_PR]['parameters']

export type GetPrResponse = Endpoints[typeof GET_PR]['response']

export type PostGeneralPrCommentParams =
  Endpoints[typeof POST_GENERAL_PR_COMMENT]['parameters']

export type PostGeneralPrCommentResponse =
  Endpoints[typeof POST_GENERAL_PR_COMMENT]['response']

export type GetPrReviewCommentsParams =
  Endpoints[typeof GET_GENERAL_PR_COMMENTS]['parameters']

export type GetGeneralPrCommentResponse =
  Endpoints[typeof GET_GENERAL_PR_COMMENTS]['response']

export type DeleteGeneralPrCommentParams =
  Endpoints[typeof DELETE_GENERAL_PR_COMMENT]['parameters']

export type DeleteGeneralPrCommentResponse =
  Endpoints[typeof DELETE_GENERAL_PR_COMMENT]['response']

export type ReplyToCodeReviewCommentPathResponse =
  Endpoints[typeof REPLY_TO_CODE_REVIEW_COMMENT_PATH]['response']

export type CreateOrUpdateRepositorySecretParams =
  Endpoints[typeof CREATE_OR_UPDATE_A_REPOSITORY_SECRET]['parameters']

export type CreateOrUpdateRepositorySecretResponse =
  Endpoints[typeof CREATE_OR_UPDATE_A_REPOSITORY_SECRET]['response']

export type GetARepositoryPublicKeyParams =
  Endpoints[typeof GET_A_REPOSITORY_PUBLIC_KEY]['parameters']

export type GetARepositoryPublicKeyResponse =
  Endpoints[typeof GET_A_REPOSITORY_PUBLIC_KEY]['response']

export type GetUserResponse = Endpoints[typeof GET_USER]['response']
export type GithubBlameResponse = {
  repository: {
    object: {
      blame: {
        ranges: {
          age: number
          endingLine: number
          startingLine: number
          commit: {
            author: {
              user: {
                email: string
                name: string
                login: string
              }
            }
          }
        }[]
      }
    }
  }
}
