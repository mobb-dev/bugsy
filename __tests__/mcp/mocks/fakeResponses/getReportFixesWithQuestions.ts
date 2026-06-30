import {
  FixQuestionInputType,
  type GetReportFixesQuery,
  Vulnerability_Report_Issue_Tag_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../../../src/features/analysis/scm/generates/client_generates'

// Report fixture: fixes only in interactive form (covers SELECT/TEXT question shapes).
export const mockGetReportFixesWithQuestions: {
  data: GetReportFixesQuery
} = {
  data: {
    fixReport: [
      {
        __typename: 'fixReport',
        id: 'test-fix-report-questions',
        createdOn: '2024-01-01T01:00:00Z',
        issueTypes: ['XSS', 'IFRAME_WITHOUT_SANDBOX', 'PT'],
        repo: {
          __typename: 'repo',
          originalUrl: 'https://github.com/mock/repo',
        },
        CRITICAL: { __typename: 'fix_aggregate', aggregate: { count: 0 } },
        HIGH: { __typename: 'fix_aggregate', aggregate: { count: 2 } },
        MEDIUM: { __typename: 'fix_aggregate', aggregate: { count: 1 } },
        LOW: { __typename: 'fix_aggregate', aggregate: { count: 0 } },

        fixes: [
          {
            __typename: 'fix' as const,
            id: 'fix-xss-server-side',
            confidence: 90,
            safeIssueType: 'XSS',
            safeIssueLanguage: 'JavaScript',
            severityText: 'HIGH',
            severityValue: 80,
            gitBlameLogin: 'alice',
            vulnerabilityReportIssues: [
              {
                __typename: 'vulnerability_report_issue' as const,
                parsedIssueType: 'XSS',
                parsedSeverity: Vulnerability_Severity_Enum.High,
                vulnerabilityReportIssueTags: [],
              },
            ],
            patchAndQuestions: {
              __typename: 'FixData' as const,
              patch: `diff --git a/src/render.js b/src/render.js
--- a/src/render.js
+++ b/src/render.js
@@ -1,3 +1,3 @@
-document.body.innerHTML = userBio;
+document.body.textContent = userBio;
`,
              patchOriginalEncodingBase64:
                'ZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCA9IHVzZXJCaW87',
              questions: [
                {
                  __typename: 'FixQuestion' as const,
                  key: 'isServerSideCode',
                  name: 'isServerSideCode',
                  inputType: FixQuestionInputType.Select,
                  options: ['yes', 'no'],
                  defaultValue: 'no',
                  value: null,
                  index: 0,
                  extraContext: [],
                },
              ],
              extraContext: {
                __typename: 'FixExtraContextResponse' as const,
                fixDescription:
                  'Replace innerHTML with textContent to prevent XSS. Different fix shape required for server-side vs browser code.',
                extraContext: [],
              },
            },
          },

          {
            __typename: 'fix' as const,
            id: 'fix-iframe-sandbox',
            confidence: 85,
            safeIssueType: 'IFRAME_WITHOUT_SANDBOX',
            safeIssueLanguage: 'JavaScript',
            severityText: 'MEDIUM',
            severityValue: 60,
            gitBlameLogin: 'bob',
            vulnerabilityReportIssues: [
              {
                __typename: 'vulnerability_report_issue' as const,
                parsedIssueType: 'IFRAME_WITHOUT_SANDBOX',
                parsedSeverity: Vulnerability_Severity_Enum.Medium,
                vulnerabilityReportIssueTags: [],
              },
            ],
            patchAndQuestions: {
              __typename: 'FixData' as const,
              patch: `diff --git a/src/widget.html b/src/widget.html
--- a/src/widget.html
+++ b/src/widget.html
@@ -1 +1 @@
-<iframe src="https://partner.example.com/embed"></iframe>
+<iframe src="https://partner.example.com/embed" sandbox=""></iframe>
`,
              patchOriginalEncodingBase64: 'aWZyYW1l',
              questions: [
                {
                  __typename: 'FixQuestion' as const,
                  key: 'iframeRestrictions',
                  name: 'iframeRestrictions',
                  inputType: FixQuestionInputType.Text,
                  options: [],
                  defaultValue: '',
                  value: null,
                  index: 0,
                  extraContext: [],
                },
              ],
              extraContext: {
                __typename: 'FixExtraContextResponse' as const,
                fixDescription:
                  'Add the sandbox attribute to the iframe. Optional comma-separated allow-list relaxes restrictions.',
                extraContext: [],
              },
            },
          },

          {
            __typename: 'fix' as const,
            id: 'fix-pt-tainted-term',
            confidence: 80,
            safeIssueType: 'PT',
            safeIssueLanguage: 'JavaScript',
            severityText: 'HIGH',
            severityValue: 75,
            gitBlameLogin: 'carol',
            vulnerabilityReportIssues: [
              {
                __typename: 'vulnerability_report_issue' as const,
                parsedIssueType: 'PT',
                parsedSeverity: Vulnerability_Severity_Enum.High,
                vulnerabilityReportIssueTags: [
                  {
                    __typename:
                      'vulnerability_report_issue_to_vulnerability_report_issue_tag' as const,
                    vulnerability_report_issue_tag_value:
                      Vulnerability_Report_Issue_Tag_Enum.AutogeneratedCode,
                  },
                ],
              },
            ],
            patchAndQuestions: {
              __typename: 'FixData' as const,
              patch: `diff --git a/src/files.js b/src/files.js
--- a/src/files.js
+++ b/src/files.js
@@ -1,2 +1,3 @@
-fs.readFile(path.join(UPLOAD_DIR, userInput), cb);
+const safe = sanitizeFileName(userInput);
+fs.readFile(path.join(UPLOAD_DIR, safe), cb);
`,
              patchOriginalEncodingBase64: 'cHQ=',
              questions: [
                {
                  __typename: 'FixQuestion' as const,
                  key: 'taintedTermType',
                  name: 'taintedTermType',
                  inputType: FixQuestionInputType.Select,
                  options: ['file name', 'relative path', 'absolute path'],
                  defaultValue: 'file name',
                  value: null,
                  index: 0,
                  extraContext: [{ key: 'expression', value: 'userInput' }],
                },
              ],
              extraContext: {
                __typename: 'FixExtraContextResponse' as const,
                fixDescription:
                  'Sanitize the user-controlled file path. Sanitizer choice depends on whether the value is a name vs path.',
                extraContext: [],
              },
            },
          },
        ],
        userFixes: [],

        filteredFixesCount: {
          __typename: 'fix_aggregate' as const,
          aggregate: { __typename: 'fix_aggregate_fields', count: 3 },
        },
        totalFixesCount: {
          __typename: 'fix_aggregate' as const,
          aggregate: { count: 3 },
        },
        vulnerabilityReport: {
          __typename: 'vulnerability_report' as const,
          scanDate: '2024-01-01T01:00:00Z',
          vendor: Vulnerability_Report_Vendor_Enum.Snyk,
          projectId: 'test-project-id',
          project: {
            __typename: 'project' as const,
            organizationId: 'test-org-id',
          },
          totalVulnerabilityReportIssuesCount: {
            __typename: 'vulnerability_report_issue_aggregate' as const,
            aggregate: { count: 3 },
          },
          notFixableVulnerabilityReportIssuesCount: {
            __typename: 'vulnerability_report_issue_aggregate' as const,
            aggregate: { count: 0 },
          },
        },
      },
    ],
    expiredReport: [],
  },
}
