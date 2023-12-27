import { WEB_APP_URL } from '@mobb/bugsy/constants'

export * from './get_issue_type'

type GetFixUrlParam = {
  fixId: string
  projectId: string
  organizationId: string
  analysisId: string
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
