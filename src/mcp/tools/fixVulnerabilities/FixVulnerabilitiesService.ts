import {
  Fix_Report_State_Enum,
  Scan_Source_Enum,
  SubmitVulnerabilityReportMutationVariables,
  UploadS3BucketInfoMutation,
} from '../../../features/analysis/scm/generates/client_generates'
import { uploadFile } from '../../../features/analysis/upload-file'
import { fixesPrompt } from '../../core/prompts'
import { logDebug, logError, logInfo } from '../../Logger'
import { FilePacking } from '../../services/FilePacking'
import { getMcpGQLClient, McpGQLClient } from '../../services/McpGQLClient'
import { McpFix } from '../../types'
import {
  ApiConnectionError,
  FileProcessingError,
  FileUploadError,
  GqlClientError,
  NoFilesError,
  ReportInitializationError,
  ScanError,
} from './errors/VulnerabilityFixErrors'

export const VUL_REPORT_DIGEST_TIMEOUT_MS = 1000 * 60 * 5 // 5 minutes in msec

export class VulnerabilityFixService {
  private gqlClient?: McpGQLClient
  private filePacking: FilePacking
  /**
   * Stores the fix report id that is created on the first run so that subsequent
   * calls can skip the expensive packing/uploading/scan flow and directly fetch
   * the analysis results.
   */
  private storedFixReportId?: string
  private currentOffset?: number = 0

  constructor() {
    this.filePacking = new FilePacking()
  }

  public async processVulnerabilities({
    fileList,
    repositoryPath,
    offset,
    limit,
    isRescan = false,
  }: {
    fileList: string[]
    repositoryPath: string
    offset?: number
    limit?: number
    isRescan?: boolean
  }): Promise<string> {
    try {
      this.gqlClient = await this.initializeGqlClient()

      let fixReportId: string | undefined = this.storedFixReportId

      if (!fixReportId || isRescan) {
        this.validateFiles(fileList)

        const repoUploadInfo = await this.initializeReport()
        fixReportId = repoUploadInfo!.fixReportId
        this.storedFixReportId = fixReportId // cache for future calls

        const zipBuffer = await this.packFiles(fileList, repositoryPath)
        await this.uploadFiles(zipBuffer, repoUploadInfo)

        const projectId = await this.getProjectId()
        await this.runScan({ fixReportId, projectId })
      }

      // Determine the offset to use when fetching fixes.
      let effectiveOffset: number
      if (offset !== undefined) {
        effectiveOffset = offset
      } else if (fixReportId) {
        effectiveOffset = this.currentOffset ?? 0
      } else {
        effectiveOffset = 0
      }
      logDebug('effectiveOffset', { effectiveOffset })

      const fixes = await this.getReportFixes(
        fixReportId,
        effectiveOffset,
        limit
      )

      // Update the current offset for subsequent pagination calls
      this.currentOffset = effectiveOffset + (fixes.fixes?.length || 0)

      return fixesPrompt({
        fixes: fixes.fixes,
        totalCount: fixes.totalCount,
        offset: effectiveOffset,
      })
    } catch (error) {
      // if (
      //   error instanceof ApiConnectionError ||
      //   error instanceof CliLoginError
      // ) {
      //   return failedToConnectToApiPrompt
      // }

      // if (
      //   error instanceof AuthenticationError ||
      //   error instanceof FailedToGetApiTokenError
      // ) {
      //   return failedToAuthenticatePrompt
      // }

      const message = (error as Error).message
      logError('Vulnerability processing failed', { error: message })
      throw error
    }
  }

  private validateFiles(fileList: string[]): void {
    if (fileList.length === 0) {
      throw new NoFilesError()
    }
  }

  private async initializeGqlClient(): Promise<McpGQLClient> {
    const gqlClient = await getMcpGQLClient()

    const isConnected = await gqlClient.verifyConnection()
    if (!isConnected) {
      throw new ApiConnectionError(
        'Failed to connect to the API. Please check your API_KEY'
      )
    }

    return gqlClient
  }

  private async initializeReport(): Promise<
    UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo']
  > {
    if (!this.gqlClient) {
      throw new GqlClientError()
    }

    try {
      const {
        uploadS3BucketInfo: { repoUploadInfo },
      } = await this.gqlClient.uploadS3BucketInfo()
      logInfo('Upload info retrieved', { uploadKey: repoUploadInfo?.uploadKey })
      return repoUploadInfo
    } catch (error) {
      const message = (error as Error).message
      throw new ReportInitializationError(
        `Error initializing report: ${message}`
      )
    }
  }

  private async packFiles(
    fileList: string[],
    repositoryPath: string
  ): Promise<Buffer> {
    try {
      const zipBuffer = await this.filePacking.packFiles(
        repositoryPath,
        fileList
      )
      logInfo('Files packed successfully', { fileCount: fileList.length })
      return zipBuffer
    } catch (error) {
      const message = (error as Error).message
      throw new FileProcessingError(`Error packing files: ${message}`)
    }
  }

  private async uploadFiles(
    zipBuffer: Buffer,
    repoUploadInfo: UploadS3BucketInfoMutation['uploadS3BucketInfo']['repoUploadInfo']
  ): Promise<void> {
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

  private async getProjectId(): Promise<string> {
    if (!this.gqlClient) {
      throw new GqlClientError()
    }

    const projectId = await this.gqlClient.getProjectId()
    logInfo('Project ID retrieved', { projectId })
    return projectId
  }

  private async runScan(params: {
    fixReportId: string
    projectId: string
  }): Promise<void> {
    if (!this.gqlClient) {
      throw new GqlClientError()
    }

    const { fixReportId, projectId } = params
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
    const submitRes = await this.gqlClient.submitVulnerabilityReport(
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
    await this.gqlClient.subscribeToGetAnalysis({
      subscribeToAnalysisParams: {
        analysisId: submitRes.submitVulnerabilityReport.fixReportId,
      },
      callback: () => {
        /* empty */
      },
      callbackStates: [Fix_Report_State_Enum.Finished],
      timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
    })

    logInfo('Analysis subscription completed')
  }

  private async getReportFixes(
    fixReportId: string,
    offset?: number,
    limit?: number
  ): Promise<{
    fixes: McpFix[]
    totalCount: number
  }> {
    logDebug('getReportFixes', { fixReportId, offset, limit })
    if (!this.gqlClient) {
      throw new GqlClientError()
    }

    const fixes = await this.gqlClient.getReportFixesPaginated({
      reportId: fixReportId,
      offset,
      limit,
    })
    logInfo('Fixes retrieved', { fixCount: fixes?.fixes?.length })
    return {
      fixes: fixes?.fixes || [],
      totalCount: fixes?.totalCount || 0,
    }
  }
}
