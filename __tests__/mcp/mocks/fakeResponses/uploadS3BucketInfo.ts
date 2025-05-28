import { Status } from '../../../../src/features/analysis/scm/generates/client_generates'

export const mockUploadS3BucketInfo = {
  data: {
    uploadS3BucketInfo: {
      status: Status.Ok,
      error: null,
      reportUploadInfo: {
        url: 'https://test-bucket.s3.amazonaws.com',
        fixReportId: 'test-fix-report-id',
        uploadFieldsJSON: JSON.stringify({
          key: 'test-key',
          'Content-Type': 'application/zip',
        }),
        uploadKey: 'test-upload-key',
        fileName: 'test-report.zip',
      },
      repoUploadInfo: {
        url: 'https://test-bucket.s3.amazonaws.com',
        fixReportId: 'test-fix-report-id',
        uploadFieldsJSON: JSON.stringify({
          key: 'test-repo-key',
          'Content-Type': 'application/zip',
        }),
        uploadKey: 'test-repo-upload-key',
        fileName: 'test-repo.zip',
      },
    },
  },
}

export const mockUploadS3BucketInfoError = (message: string) => ({
  errors: [
    {
      message: message || 'Upload Error',
    },
  ],
})
