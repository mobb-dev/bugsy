import { z } from 'zod'

import { AdoPullRequestStatus } from './types'

export const ValidPullRequestStatusZ = z.union([
  z.literal(AdoPullRequestStatus.Active),
  z.literal(AdoPullRequestStatus.Abandoned),
  z.literal(AdoPullRequestStatus.Completed),
])

export const AdoAuthResultZ = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  refresh_token: z.string().min(1),
})

export const profileZ = z.object({
  displayName: z.string(),
  publicAlias: z.string().min(1),
  emailAddress: z.string(),
  coreRevision: z.number(),
  timeStamp: z.string(),
  id: z.string(),
  revision: z.number(),
})

export const accountsZ = z.object({
  count: z.number(),
  value: z.array(
    z.object({
      accountId: z.string(),
      accountUri: z.string(),
      accountName: z.string(),
    })
  ),
})
