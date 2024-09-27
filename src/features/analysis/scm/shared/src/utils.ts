export type GetFixUrlParam = {
  appBaseUrl: string
  fixId: string
  projectId: string
  organizationId: string
  analysisId: string
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
