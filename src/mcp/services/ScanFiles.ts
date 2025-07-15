import { GitService } from '@mobb/bugsy/features/analysis/scm/git/GitService'

import {
  Fix_Report_State_Enum,
  Scan_Source_Enum,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { uploadFile } from '../../features/analysis/upload-file'
import {
  MCP_MAX_FILE_SIZE,
  MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
} from '../core/configs'
import {
  FileUploadError,
  GqlClientError,
  ReportInitializationError,
  ScanError,
} from '../core/Errors'
import { logDebug, logError, logInfo } from '../Logger'
import { FileOperations } from './FileOperations'
import { McpGQLClient } from './McpGQLClient'

export const scanFiles = async ({
  fileList,
  repositoryPath,
  gqlClient,
}: {
  fileList: string[]
  repositoryPath: string
  gqlClient: McpGQLClient
}): Promise<{
  fixReportId: string
  projectId: string
}> => {
  const repoUploadInfo = await initializeSecurityReport(gqlClient)
  const fixReportId = repoUploadInfo!.fixReportId

  const fileOperations = new FileOperations()
  const packingResult = await fileOperations.createSourceCodeArchive(
    fileList,
    repositoryPath,
    MCP_MAX_FILE_SIZE
  )

  await uploadSourceCodeArchive(packingResult.archive, repoUploadInfo)

  const projectId = await getProjectId(gqlClient)
  const gitService = new GitService(repositoryPath)
  const { branch } = await gitService.getCurrentCommitAndBranch()
  const repoUrl = await gitService.getRemoteUrl()
  await executeSecurityScan({
    fixReportId,
    projectId,
    gqlClient,
    repoUrl: repoUrl || '',
    branchName: branch || 'no-branch',
    sha: '0123456789abcdef',
  })

  return {
    fixReportId,
    projectId,
  }
}

const initializeSecurityReport = async (
  gqlClient: McpGQLClient
): Promise<
  UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo']
> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  try {
    const {
      uploadS3BucketInfo: { repoUploadInfo },
    } = await gqlClient.uploadS3BucketInfo()
    logDebug('Upload info retrieved')
    return repoUploadInfo
  } catch (error) {
    const message = (error as Error).message
    throw new ReportInitializationError(
      `Error initializing security report: ${message}`
    )
  }
}

const uploadSourceCodeArchive = async (
  archiveBuffer: Buffer,
  repoUploadInfo: UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo']
): Promise<void> => {
  if (!repoUploadInfo) {
    throw new FileUploadError('Upload info is required for source code archive')
  }

  try {
    await uploadFile({
      file: archiveBuffer,
      url: repoUploadInfo.url,
      uploadFields: JSON.parse(repoUploadInfo.uploadFieldsJSON) as Record<
        string,
        string
      >,
      uploadKey: repoUploadInfo.uploadKey,
    })
    logInfo('File uploaded successfully')
  } catch (error) {
    logError('Source code archive upload failed', {
      error: (error as Error).message,
    })
    throw new FileUploadError(
      `Failed to upload source code archive: ${(error as Error).message}`
    )
  }
}

const getProjectId = async (gqlClient: McpGQLClient): Promise<string> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  const projectId = await gqlClient.getProjectId()
  logDebug('Project ID retrieved')
  return projectId
}

const executeSecurityScan = async ({
  fixReportId,
  projectId,
  gqlClient,
  repoUrl,
  branchName,
  sha,
}: {
  fixReportId: string
  projectId: string
  gqlClient: McpGQLClient
  repoUrl: string
  branchName: string
  sha: string
}): Promise<void> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  logInfo('Starting scan')

  const submitVulnerabilityReportVariables: SubmitVulnerabilityReportMutationVariables =
    {
      fixReportId,
      projectId,
      repoUrl,
      reference: branchName,
      scanSource: Scan_Source_Enum.Mcp,
      sha,
    }

  logInfo('Submitting vulnerability report')
  logDebug('Submit vulnerability report variables', {
    submitVulnerabilityReportVariables,
  })
  const submitRes = await gqlClient.submitVulnerabilityReport(
    submitVulnerabilityReportVariables
  )

  if (
    submitRes.submitVulnerabilityReport.__typename !== 'VulnerabilityReport'
  ) {
    throw new ScanError(
      `Security scan submission failed: ${submitRes.submitVulnerabilityReport.__typename}`
    )
  }

  const analysisId = submitRes.submitVulnerabilityReport.fixReportId
  logInfo('Vulnerability report submitted successfully')

  try {
    await gqlClient.subscribeToGetAnalysis({
      subscribeToAnalysisParams: { analysisId },
      callback: async (completedAnalysisId: string) => {
        logInfo('Security analysis completed successfully', {
          analysisId: completedAnalysisId,
        })
      },
      callbackStates: [Fix_Report_State_Enum.Finished],
      timeoutInMs: MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
    })
  } catch (error) {
    logError('Security analysis failed or timed out', { error, analysisId })
    throw new ScanError(`Security analysis failed: ${(error as Error).message}`)
  }

  logDebug('Security scan completed successfully', { fixReportId, projectId })
}
