import { z } from 'zod'

export const GitlabAuthResultZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
})

export enum GitlabTokenRequestTypeEnum {
  CODE = 'code',
  REFRESH_TOKEN = 'refresh_token',
}
