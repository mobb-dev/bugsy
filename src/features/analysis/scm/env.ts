import { z } from 'zod'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  GITHUB_API_TOKEN: z.string().optional(),
  GIT_PROXY_HOST: z.string().default('http://tinyproxy:8888'),
})
const { GITLAB_API_TOKEN, GITHUB_API_TOKEN, GIT_PROXY_HOST } =
  EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
}
export { GIT_PROXY_HOST, GITHUB_API_TOKEN, GITLAB_API_TOKEN }
