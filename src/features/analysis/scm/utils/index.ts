export * from './get_issue_type'

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
