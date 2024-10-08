import { z } from 'zod'

export const GitlabAuthResultZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
})
export type GitlabAuthResult = z.infer<typeof GitlabAuthResultZ>
export enum GitlabTokenRequestTypeEnum {
  CODE = 'code',
  REFRESH_TOKEN = 'refresh_token',
}

export type GetGitlabTokenParams = {
  token: string
  gitlabClientId: string
  gitlabClientSecret: string
  callbackUrl: string
  tokenType: GitlabTokenRequestTypeEnum
  scmUrl?: string
  brokerHosts?: { virtualDomain: string; realDomain: string }[]
}
