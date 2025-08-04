import { GitService } from '@mobb/bugsy/features/analysis/scm/services/GitService'

import {
  Fix_Report_State_Enum,
  Scan_Source_Enum,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { uploadFile } from '../../features/analysis/upload-file'
import { ScanContext } from '../../types'
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
  isAllDetectionRulesScan = false,
  scanContext,
}: {
  fileList: string[]
  repositoryPath: string
  gqlClient: McpGQLClient
  isAllDetectionRulesScan?: boolean
  scanContext: ScanContext
}): Promise<{
  fixReportId: string
  projectId: string
}> => {
  const repoUploadInfo = await initializeSecurityReport(gqlClient, scanContext)
  const fixReportId = repoUploadInfo!.fixReportId

  const fileOperations = new FileOperations()
  const packingResult = await fileOperations.createSourceCodeArchive(
    fileList,
    repositoryPath,
    MCP_MAX_FILE_SIZE
  )
  logDebug(
    `[${scanContext}] Files ${packingResult.packedFilesCount} packed successfully, ${packingResult.totalSize} bytes`
  )

  await uploadSourceCodeArchive(
    packingResult.archive,
    repoUploadInfo,
    scanContext
  )

  const projectId = await getProjectId(gqlClient, scanContext)
  const gitService = new GitService(repositoryPath)
  const { branch } = await gitService.getCurrentCommitAndBranch()
  const repoUrl = await gitService.getRemoteUrl()
  await executeSecurityScan({
    fixReportId,
    projectId,
    gqlClient,
    isAllDetectionRulesScan,
    repoUrl: repoUrl || '',
    branchName: branch || 'no-branch',
    sha: '0123456789abcdef',
    scanContext,
    fileCount: packingResult.packedFilesCount,
  })

  return {
    fixReportId,
    projectId,
  }
}

const initializeSecurityReport = async (
  gqlClient: McpGQLClient,
  scanContext: ScanContext
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
    logDebug(`[${scanContext}] Upload info retrieved`)
    return repoUploadInfo
  } catch (error) {
    const message = (error as Error).message

    // Handle authentication-specific errors more gracefully
    if (
      message.includes('Authentication hook unauthorized') ||
      message.includes('access-denied')
    ) {
      logError(
        'Authentication failed during security report initialization. Please re-authenticate.',
        {
          error: message,
        }
      )
      throw new ReportInitializationError(
        'Authentication failed. Please re-authenticate and try again.'
      )
    }

    // Handle other errors
    logError('Error initializing security report', { error: message })
    throw new ReportInitializationError(
      `Error initializing security report: ${message}`
    )
  }
}

const uploadSourceCodeArchive = async (
  archiveBuffer: Buffer,
  repoUploadInfo: UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo'],
  scanContext: ScanContext
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
    logInfo(`[${scanContext}] File uploaded successfully`)
  } catch (error) {
    logError(`[${scanContext}] Source code archive upload failed`, {
      error: (error as Error).message,
    })
    throw new FileUploadError(
      `Failed to upload source code archive: ${(error as Error).message}`
    )
  }
}

const getProjectId = async (
  gqlClient: McpGQLClient,
  scanContext: ScanContext
): Promise<string> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  const projectId = await gqlClient.getProjectId()
  logDebug(`[${scanContext}] Project ID retrieved`)
  return projectId
}

const executeSecurityScan = async ({
  fixReportId,
  projectId,
  gqlClient,
  isAllDetectionRulesScan = false,
  repoUrl,
  branchName,
  sha,
  scanContext,
  fileCount,
}: {
  fixReportId: string
  projectId: string
  gqlClient: McpGQLClient
  isAllDetectionRulesScan: boolean
  repoUrl: string
  branchName: string
  sha: string
  scanContext: ScanContext
  fileCount: number
}): Promise<void> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  logInfo(`[${scanContext}] Starting scan`)

  const submitVulnerabilityReportVariables: SubmitVulnerabilityReportMutationVariables =
    {
      fixReportId,
      projectId,
      repoUrl,
      reference: branchName,
      scanSource: Scan_Source_Enum.Mcp,
      isFullScan: !!isAllDetectionRulesScan,
      sha,
      scanContext,
      fileCount,
    }

  logInfo(`[${scanContext}] Submitting vulnerability report`)
  logDebug(`[${scanContext}] Submit vulnerability report variables`, {
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
  logInfo(`[${scanContext}] Vulnerability report submitted successfully`)

  try {
    await gqlClient.subscribeToGetAnalysis({
      subscribeToAnalysisParams: { analysisId },
      callback: async (completedAnalysisId: string) => {
        logInfo(`[${scanContext}] Security analysis completed successfully`, {
          analysisId: completedAnalysisId,
        })
      },
      callbackStates: [Fix_Report_State_Enum.Finished],
      timeoutInMs: MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
      scanContext,
    })
  } catch (error) {
    // Enhanced error logging with detailed information
    const errorObj = error as Error
    const errorDetails = {
      message: errorObj.message || 'No error message',
      name: errorObj.name || 'Unknown error type',
      stack: errorObj.stack,
      analysisId,
      timeoutMs: MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
      isTimeoutError: errorObj.message?.includes('Timeout expired'),
      // Safely extract additional properties from the error object
      ...Object.getOwnPropertyNames(errorObj)
        .filter(
          (prop) => prop !== 'message' && prop !== 'name' && prop !== 'stack'
        )
        .reduce(
          (acc, prop) => ({
            ...acc,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [prop]: (errorObj as any)[prop],
          }),
          {}
        ),
    }

    logError(
      `[${scanContext}] Security analysis failed or timed out`,
      errorDetails
    )

    // Log additional debug information about the scan context and GQL subscription
    logDebug(`[${scanContext}] Security scan failure context`, {
      fixReportId,
      projectId,
      repoUrl,
      branchName,
      isAllDetectionRulesScan,
      fileCount,
      scanSource: Scan_Source_Enum.Mcp,
      subscriptionParams: { analysisId },
      expectedCallbackState: Fix_Report_State_Enum.Finished,
      subscriptionTimeout: {
        configuredTimeoutMs: MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
        isTimeoutError: errorObj.message?.includes('Timeout expired'),
      },
    })

    // Try to get the current analysis state
    try {
      const analysis = await gqlClient.getAnalysis(analysisId)
      if (analysis) {
        logDebug(`[${scanContext}] Current analysis state at error time`, {
          analysisId,
          state: analysis.state,
          failReason: analysis.failReason || 'No failure reason provided',
          // The createdAt field doesn't exist in the analysis type, include other useful properties
          analysisObjectId: analysis.id,
        })
      }
    } catch (analysisError) {
      logDebug(`[${scanContext}] Failed to get analysis state`, {
        analysisError: (analysisError as Error).message,
      })
    }

    throw new ScanError(
      `Security analysis failed: ${(error as Error).message || 'Unknown error'}`
    )
  }

  logDebug(`[${scanContext}] Security scan completed successfully`, {
    fixReportId,
    projectId,
  })
}
