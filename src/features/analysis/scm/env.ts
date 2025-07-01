import { z } from 'zod'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  GITHUB_API_TOKEN: z.string().optional(),
  GIT_PROXY_HOST: z.string().optional().default('http://tinyproxy:8888'),
  MAX_UPLOAD_FILE_SIZE_MB: z.coerce.number().gt(0).default(5),
})
const {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
  MAX_UPLOAD_FILE_SIZE_MB,
} = EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
  MAX_UPLOAD_FILE_SIZE_MB,
}
export {
  GIT_PROXY_HOST,
  GITHUB_API_TOKEN,
  GITLAB_API_TOKEN,
  MAX_UPLOAD_FILE_SIZE_MB,
}
