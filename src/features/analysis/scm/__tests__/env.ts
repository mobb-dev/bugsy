import path from 'node:path'

import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  path: [
    path.join(__dirname, '../../../../../../../__tests__/.env'),
    path.join(__dirname, '../../../../../.env'),
  ],
})

export const env = z
  .object({
    PLAYWRIGHT_BB_CLOUD_PAT: z.string().min(1),
    PLAYWRIGHT_GL_CLOUD_PAT: z.string().min(1),
    PLAYWRIGHT_GL_CLOUD_REPO_URL: z.string().min(1),
    PLAYWRIGHT_ADO_CLOUD_PAT: z.string().min(1),
    PLAYWRIGHT_ADO_CLOUD_SCM_ORG: z.string().min(1),
    PLAYWRIGHT_ADO_CLOUD_REPO_URL: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_URL: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_PAT: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_URL: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_PAT: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_PAT: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_URL: z.string().min(1),
    PLAYWRIGHT_GH_CLOUD_PAT: z.string().min(1),
    PLAYWRIGHT_GH_CLOUD_REPO_URL: z.string().min(1),
  })
  .required()
  .parse(process.env)
