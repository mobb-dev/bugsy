/* eslint-disable @typescript-eslint/naming-convention */
import type { GetLatestReportByRepoUrlQuery } from '../../../../src/features/analysis/scm/generates/client_generates'
import {
  IssueType_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../../../src/features/analysis/scm/generates/client_generates'

type MockResponse = {
  data: NonNullable<GetLatestReportByRepoUrlQuery>
}

export const mockGetLatestReportByRepoUrl: MockResponse = {
  data: {
    fixReport: [
      {
        __typename: 'fixReport' as const,
        id: 'mock-report-id',
        createdOn: '2024-03-20T12:00:00Z',
        repo: {
          __typename: 'repo' as const,
          originalUrl: 'https://github.com/mock/repo',
        },
        issueTypes: ['SECURITY'],
        filteredFixesCount: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 5,
          },
        },
        CRITICAL: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 1,
          },
        },
        HIGH: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 2,
          },
        },
        MEDIUM: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 1,
          },
        },
        LOW: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 1,
          },
        },
        fixes: [
          {
            __typename: 'fix' as const,
            id: 'test-fix-1',
            confidence: 85,
            safeIssueType: 'SQL_INJECTION',
            severityText: 'critical',
            vulnerabilityReportIssues: [
              {
                __typename: 'vulnerability_report_issue',
                parsedIssueType: IssueType_Enum.SqlInjection,
                parsedSeverity: Vulnerability_Severity_Enum.Critical,
                vulnerabilityReportIssueTags: [],
              },
            ],
            patchAndQuestions: {
              __typename: 'FixData',
              patch: 'test patch',
              patchOriginalEncodingBase64: 'dGVzdCBwYXRjaA==',
              extraContext: {
                __typename: 'FixExtraContextResponse',
                fixDescription: 'test fix description',
                extraContext: [],
              },
            },
          },
        ],
        totalFixesCount: {
          __typename: 'fix_aggregate' as const,
          aggregate: {
            count: 5,
          },
        },
        vulnerabilityReport: {
          __typename: 'vulnerability_report' as const,
          scanDate: '2024-01-01T01:00:00Z',
          vendor: Vulnerability_Report_Vendor_Enum.Snyk,
          totalVulnerabilityReportIssuesCount: {
            __typename: 'vulnerability_report_issue_aggregate' as const,
            aggregate: {
              count: 5,
            },
          },
          notFixableVulnerabilityReportIssuesCount: {
            __typename: 'vulnerability_report_issue_aggregate' as const,
            aggregate: {
              count: 0,
            },
          },
        },
      },
    ],
    expiredReport: [],
  },
}

export const mockGetLatestReportByRepoUrlEmpty: MockResponse = {
  data: {
    fixReport: [],
    expiredReport: [],
  },
}

export const mockGetLatestReportByRepoUrlError = (message: string) => ({
  errors: [
    {
      message,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  ],
})

export const mockGetLatestReportByRepoUrlExpired: MockResponse = {
  data: {
    fixReport: [],
    expiredReport: [
      {
        __typename: 'fixReport' as const,
        id: 'expired-report-id',
        expirationOn: '2024-02-01T00:00:00Z',
      },
    ],
  },
}
/* eslint-enable @typescript-eslint/naming-convention */
