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
})
const { GITLAB_API_TOKEN, BROKERED_HOSTS, GITHUB_API_TOKEN } =
  EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  BROKERED_HOSTS,
  GITHUB_API_TOKEN,
}
export { BROKERED_HOSTS, GITHUB_API_TOKEN, GITLAB_API_TOKEN }
