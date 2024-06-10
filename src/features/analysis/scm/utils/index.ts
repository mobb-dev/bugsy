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

export function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}
