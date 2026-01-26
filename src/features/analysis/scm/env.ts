import { z } from 'zod'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  GITHUB_API_TOKEN: z.string().optional(),
  GIT_PROXY_HOST: z.string().optional().default('http://tinyproxy:8888'),
  MAX_UPLOAD_FILE_SIZE_MB: z.coerce.number().gt(0).default(5),
  GITHUB_API_CONCURRENCY: z.coerce.number().gt(0).optional().default(10),
})
const {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
  MAX_UPLOAD_FILE_SIZE_MB,
  GITHUB_API_CONCURRENCY,
} = EnvVariablesZod.parse(process.env)

export const env = {
  GITLAB_API_TOKEN,
  GITHUB_API_TOKEN,
  GIT_PROXY_HOST,
  MAX_UPLOAD_FILE_SIZE_MB,
  GITHUB_API_CONCURRENCY,
}
export {
  GIT_PROXY_HOST,
  GITHUB_API_CONCURRENCY,
  GITHUB_API_TOKEN,
  GITLAB_API_TOKEN,
  MAX_UPLOAD_FILE_SIZE_MB,
}
