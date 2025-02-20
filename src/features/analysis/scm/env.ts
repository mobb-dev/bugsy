import { z } from 'zod'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  GITHUB_API_TOKEN: z.string().optional(),
  GIT_COMMITTER_EMAIL: z.string().optional(),
  GIT_COMMITTER_NAME: z.string().optional(),
  GIT_PROXY_HOST: z.string(),
})
const {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
  GIT_COMMITTER_EMAIL,
  GIT_COMMITTER_NAME,
} = EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
}
export {
  GIT_COMMITTER_EMAIL,
  GIT_COMMITTER_NAME,
  GIT_PROXY_HOST,
  GITHUB_API_TOKEN,
  GITLAB_API_TOKEN,
}
