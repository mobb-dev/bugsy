import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - istextorbinary module doesn't have proper TypeScript declarations
import { FileUtils } from '../../features/analysis/scm/FileUtils'
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
  FileProcessingError,
  FileUploadError,
  GqlClientError,
  ReportInitializationError,
  ScanError,
} from '../core/Errors'
import { logError, logInfo } from '../Logger'
import { McpGQLClient } from './McpGQLClient'

export const scanFiles = async (
  fileList: string[],
  repositoryPath: string,
  gqlClient: McpGQLClient
): Promise<{
  fixReportId: string
  projectId: string
}> => {
  const repoUploadInfo = await initializeReport(gqlClient)
  const fixReportId = repoUploadInfo!.fixReportId

  const zipBuffer = await packFiles(fileList, repositoryPath)
  await uploadFiles(zipBuffer, repoUploadInfo)

  const projectId = await getProjectId(gqlClient)
  await runScan({ fixReportId, projectId, gqlClient })
  return {
    fixReportId,
    projectId,
  }
}

const initializeReport = async (
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
    logInfo('Upload info retrieved', { uploadKey: repoUploadInfo?.uploadKey })
    return repoUploadInfo
  } catch (error) {
    const message = (error as Error).message
    throw new ReportInitializationError(`Error initializing report: ${message}`)
  }
}

const packFiles = async (
  fileList: string[],
  repositoryPath: string
): Promise<Buffer> => {
  try {
    logInfo(`FilePacking: packing files from ${repositoryPath}`)

    const zip = new AdmZip()
    let packedFilesCount = 0

    // Resolve the repository path to get the canonical absolute path
    const resolvedRepoPath = path.resolve(repositoryPath)

    logInfo('FilePacking: compressing files')
    for (const filepath of fileList) {
      const absoluteFilepath = path.join(repositoryPath, filepath)

      // Security check: Validate the file path doesn't escape the repository directory
      const resolvedFilePath = path.resolve(absoluteFilepath)
      if (!resolvedFilePath.startsWith(resolvedRepoPath)) {
        logInfo(
          `FilePacking: skipping ${filepath} due to potential path traversal`
        )
        continue
      }

      // Use FileUtils to check if file should be packed
      if (!FileUtils.shouldPackFile(absoluteFilepath, MCP_MAX_FILE_SIZE)) {
        logInfo(
          `FilePacking: ignoring ${filepath} because it is excluded or invalid`
        )
        continue
      }

      let data: Buffer
      try {
        data = fs.readFileSync(absoluteFilepath)
      } catch (fsError) {
        logInfo(
          `FilePacking: failed to read ${filepath} from filesystem: ${fsError}`
        )
        continue
      }

      zip.addFile(filepath, data)
      packedFilesCount++
    }

    const zipBuffer = zip.toBuffer()
    logInfo(
      `FilePacking: read ${packedFilesCount} source files. total size: ${zipBuffer.length} bytes`
    )
    logInfo('Files packed successfully', { fileCount: fileList.length })
    return zipBuffer
  } catch (error) {
    const message = (error as Error).message
    throw new FileProcessingError(`Error packing files: ${message}`)
  }
}

const uploadFiles = async (
  zipBuffer: Buffer,
  repoUploadInfo: UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo']
): Promise<void> => {
  if (!repoUploadInfo) {
    throw new FileUploadError('Upload info is required')
  }

  try {
    await uploadFile({
      file: zipBuffer,
      url: repoUploadInfo.url,
      uploadFields: JSON.parse(repoUploadInfo.uploadFieldsJSON) as Record<
        string,
        string
      >,
      uploadKey: repoUploadInfo.uploadKey,
    })
    logInfo('File uploaded successfully')
  } catch (error) {
    logError('File upload failed', { error: (error as Error).message })
    throw new FileUploadError(
      `Failed to upload the file: ${(error as Error).message}`
    )
  }
}

const getProjectId = async (gqlClient: McpGQLClient): Promise<string> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }

  const projectId = await gqlClient.getProjectId()
  logInfo('Project ID retrieved', { projectId })
  return projectId
}

const runScan = async ({
  fixReportId,
  projectId,
  gqlClient,
}: {
  fixReportId: string
  projectId: string
  gqlClient: McpGQLClient
}): Promise<void> => {
  if (!gqlClient) {
    throw new GqlClientError()
  }
  logInfo('Starting scan', { fixReportId, projectId })

  const submitVulnerabilityReportVariables: SubmitVulnerabilityReportMutationVariables =
    {
      fixReportId,
      projectId,
      repoUrl: '',
      reference: 'no-branch',
      scanSource: Scan_Source_Enum.Mcp,
    }

  logInfo('Submitting vulnerability report')
  const submitRes = await gqlClient.submitVulnerabilityReport(
    submitVulnerabilityReportVariables
  )

  if (
    submitRes.submitVulnerabilityReport.__typename !== 'VulnerabilityReport'
  ) {
    logError('Vulnerability report submission failed', {
      response: submitRes,
    })
    throw new ScanError('🕵️‍♂️ Mobb analysis failed')
  }

  logInfo('Vulnerability report submitted successfully', {
    analysisId: submitRes.submitVulnerabilityReport.fixReportId,
  })

  logInfo('Starting analysis subscription')
  await gqlClient.subscribeToGetAnalysis({
    subscribeToAnalysisParams: {
      analysisId: submitRes.submitVulnerabilityReport.fixReportId,
    },
    callback: () => {
      /* empty */
    },
    callbackStates: [Fix_Report_State_Enum.Finished],
    timeoutInMs: MCP_VUL_REPORT_DIGEST_TIMEOUT_MS,
  })

  logInfo('Analysis subscription completed')
}
