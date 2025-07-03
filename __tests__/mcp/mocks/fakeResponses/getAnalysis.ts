import { Fix_Report_State_Enum } from '../../../../src/features/analysis/scm/generates/client_generates'

export const mockGetAnalysis = {
  data: {
    analysis: {
      id: 'test-analysis-id',
      state: Fix_Report_State_Enum.Finished,
      failReason: '',
      repo: {
        commitSha: 'abc123def456',
        pullRequest: null,
      },
      vulnerabilityReportId: 'test-vulnerability-report-id',
      vulnerabilityReport: {
        projectId: 'test-project-id',
        project: {
          organizationId: 'test-organization-id',
        },
        file: {
          signedFile: {
            url: 'https://test-bucket.s3.amazonaws.com/vulnerability-report.json',
          },
        },
      },
    },
  },
}
