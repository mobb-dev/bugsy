import { WEB_APP_URL } from '@mobb/bugsy/constants'

export * from './calculate_ranges'
export * from './get_issue_type'
type GetFixUrlParam = {
  fixId: string
  projectId: string
  organizationId: string
  analysisId: string
}

export function getFixUrlWithRedirect({
  fixId,
  projectId,
  organizationId,
  analysisId,
  redirectUrl,
}: GetFixUrlParam & { redirectUrl: string }) {
  return `${getFixUrl({
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}?commit_redirect_url=${encodeURIComponent(redirectUrl)}`
}

export function getFixUrl({
  fixId,
  projectId,
  organizationId,
  analysisId,
}: GetFixUrlParam) {
  return `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/fix/${fixId}`
}

type GetCommitUrlParam = GetFixUrlParam & { redirectUrl: string }
export function getCommitUrl({
  fixId,
  projectId,
  organizationId,
  analysisId,
  redirectUrl,
}: GetCommitUrlParam) {
  return `${getFixUrl({
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}/commit?redirect_url=${encodeURIComponent(redirectUrl)}`
}
