import { z } from 'zod'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  BROKERED_HOSTS: z
    .string()
    .toLowerCase()
    .transform((x) =>
      x
        .split(',')
        .map((url) => url.trim(), [])
        .filter(Boolean)
    )
    .default(''),
  GITHUB_API_TOKEN: z.string().optional(),
  GIT_PROXY_HOST: z.string().default('http://tinyproxy:8888'),
})
const { GITLAB_API_TOKEN, BROKERED_HOSTS, GITHUB_API_TOKEN, GIT_PROXY_HOST } =
  EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  BROKERED_HOSTS,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
}
export { BROKERED_HOSTS, GIT_PROXY_HOST, GITHUB_API_TOKEN, GITLAB_API_TOKEN }
