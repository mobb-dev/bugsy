import { ADO_PREFIX_PATH, NAME_REGEX } from '../shared/src'

export * from './broker'

type GetFixUrlParam = {
  appBaseUrl: string
  fixId: string
  projectId: string
  organizationId: string
  analysisId: string
}

export function getFixUrlWithRedirect(params: GetCommitUrlParam) {
  const {
    fixId,
    projectId,
    organizationId,
    analysisId,
    redirectUrl,
    appBaseUrl,
    commentId,
  } = params
  const searchParams = new URLSearchParams()
  searchParams.append('commit_redirect_url', redirectUrl)
  searchParams.append('comment_id', commentId.toString())
  return `${getFixUrl({
    appBaseUrl,
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}?${searchParams.toString()}`
}

export function getFixUrl({
  appBaseUrl,
  fixId,
  projectId,
  organizationId,
  analysisId,
}: GetFixUrlParam) {
  return `${appBaseUrl}/organization/${organizationId}/project/${projectId}/report/${analysisId}/fix/${fixId}`
}

type GetCommitUrlParam = GetFixUrlParam & {
  redirectUrl: string
  commentId: number
}
export function getCommitUrl(params: GetCommitUrlParam) {
  const {
    fixId,
    projectId,
    organizationId,
    analysisId,
    redirectUrl,
    appBaseUrl,
    commentId,
  } = params
  const searchParams = new URLSearchParams()
  searchParams.append('redirect_url', redirectUrl)
  searchParams.append('comment_id', commentId.toString())
  return `${getFixUrl({
    appBaseUrl,
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}/commit?${searchParams.toString()}`
}

// username patteren such as 'https://haggai-mobb@bitbucket.org/workspace/repo_slug.git'
const userNamePattern = /^(https?:\/\/)([^@]+@)?([^/]+\/.+)$/

// ssh path pattern such as 'git@bitbucket.org:workspace/repo_slug.git'
const sshPattern = /^git@([\w.-]+):([\w./-]+)$/

export function normalizeUrl(repoUrl: string) {
  let trimmedUrl = repoUrl.trim().replace(/\/+$/, '')
  if (repoUrl.endsWith('.git')) {
    trimmedUrl = trimmedUrl.slice(0, -'.git'.length)
  }

  const usernameMatch = trimmedUrl.match(userNamePattern)
  if (usernameMatch) {
    const [_all, protocol, _username, repoPath] = usernameMatch
    trimmedUrl = `${protocol}${repoPath}`
  }
  const sshMatch = trimmedUrl.match(sshPattern)
  if (sshMatch) {
    const [_all, hostname, reporPath] = sshMatch
    trimmedUrl = `https://${hostname}/${reporPath}`
  }
  return trimmedUrl
}

const isUrlHasPath = (url: string) => {
  return new URL(url).origin !== url
}

// note: in some cases we want to use non repo related calls for on prem urls,
// e.g. we want to fetch the user info.
// so we don't need to validate the url, otherwise it will fail
// in case the url does contain extends beyond the origin, we do want to validate it
export function shouldValidateUrl(repoUrl?: string | null) {
  return repoUrl && isUrlHasPath(repoUrl)
}

//check in general that the URL is a valid repo URL (GH, GL, ADO, on prem options as well)
//make sure that it has a user/org and a repo name but that the path doesn't have more than 4 parts
//make sure that the path parts are valid names for repo/user/org names
export const sanityRepoURL = (scmURL: string) => {
  try {
    const url = new URL(scmURL)
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')
    const pathParts = projectPath.split('/')

    if (pathParts.length < 2) return false
    if (pathParts.length > 4 && pathParts.at(0) !== ADO_PREFIX_PATH)
      return false
    if (pathParts.some((part) => !part.match(NAME_REGEX))) return false
    return true
  } catch (e) {
    return null
  }
}
