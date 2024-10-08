import { z } from 'zod'

export const BitbucketAuthResultZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
})
