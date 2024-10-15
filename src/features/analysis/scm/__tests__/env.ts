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
    TEST_MINIMAL_WEBGOAT_BITBUCKET_USERNAME: z.string().min(1),
    TEST_MINIMAL_WEBGOAT_BITBUCKET_PASSWORD: z.string().min(1),
    TEST_MINIMAL_WEBGOAT_GITHUB_TOKEN: z.string().min(1),
    TEST_MINIMAL_WEBGOAT_GITLAB_TOKEN: z.string().min(1),
    TEST_MINIMAL_WEBGOAT_ADO_TOKEN: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_URL: z.string().min(1),
    PLAYWRIGHT_GL_ON_PREM_PAT: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_URL: z.string().min(1),
    PLAYWRIGHT_GH_ON_PREM_PAT: z.string().min(1),
    ADO_TEST_ACCESS_TOKEN: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_PAT: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_REPO_URL: z.string().min(1),
    PLAYWRIGHT_ADO_ON_PREM_URL: z.string().min(1),
  })
  .required()
  .parse(process.env)
