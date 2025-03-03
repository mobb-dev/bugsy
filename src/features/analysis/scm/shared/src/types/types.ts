import { z } from 'zod'

import {
  Effort_To_Apply_Fix_Enum,
  Fix_Report_State_Enum,
  Fix_State_Enum,
  IssueLanguage_Enum,
  Project_Role_Type_Enum,
  Vulnerability_Report_Issue_State_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../../generates/client_generates'
import { IssueTypeSettingZ } from '../validations'
import { FixPageFixReportZ } from './analysis'
import {
  FixPartsForFixScreenZ,
  FixSharedStateZ,
  PatchAndQuestionsZ,
} from './fix'
import { IssuePartsZ } from './issue'
import { ParsedSeverityZ } from './shared'

export type Unpacked<T> = T extends (infer U)[] ? U : T

export const OrganizationScreenQueryParamsZ = z.object({
  organizationId: z.string().uuid(),
})

export const PermissionsScreenQueryParamsZ = OrganizationScreenQueryParamsZ

export const ProjectPageQueryParamsZ = z.object({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
})
export const AnalysisPageQueryParamsZ = ProjectPageQueryParamsZ.extend({
  reportId: z.string().uuid(),
})

export const FixPageQueryParamsZ = AnalysisPageQueryParamsZ.extend({
  fixId: z.string().uuid(),
})
export const IssuePageQueryParamsZ = AnalysisPageQueryParamsZ.extend({
  issueId: z.string().uuid(),
})

export const CliLoginPageQueryParamsZ = z.object({
  loginId: z.string().uuid(),
})

// Note: we're using zod here becasue we need to assue we have all the data ready for rendering the page
// This saves null chekcing on the internal components

export const AnalysisReportDigestedZ = z.object({
  id: z.string().uuid(),
  state: z.nativeEnum(Fix_Report_State_Enum),
  vulnerabilityReport: z.object({
    reportSummaryUrl: z.string().url().nullish(),
    scanDate: z.string().nullable(),
    supported: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    all: z.object({
      aggregate: z.object({
        count: z.number(),
      }),
    }),
    vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum),
    project: z.object({
      organizationId: z.string().uuid(),
    }),
  }),
})

export const ReportQueryResultZ = z.object({
  fixReport_by_pk: z.object({
    id: z.string().uuid(),
    analysisUrl: z.string(),
    fixesCommitted: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
    fixesDownloaded: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
    fixesDoneCount: z.number(),
    fixesInprogressCount: z.number(),
    fixesReadyCount: z.number(),
    issueTypes: z.record(z.string(), z.number()).nullable(),
    issueLanguages: z.record(z.string(), z.number()).nullable(),
    fixesCountByEffort: z.record(z.string(), z.number()).nullable(),
    vulnerabilitySeverities: z.record(z.string(), z.number()).nullable(),
    createdOn: z.string(),
    expirationOn: z.string().nullable(),
    state: z.nativeEnum(Fix_Report_State_Enum),
    fixes: z.array(
      z.object({
        id: z.string().uuid(),
        safeIssueLanguage: z.string(),
        safeIssueType: z.string(),
        confidence: z.number(),
        effortToApplyFix: z.nativeEnum(Effort_To_Apply_Fix_Enum).nullable(),
        modifiedBy: z.string().nullable(),
        gitBlameLogin: z.string().nullable(),
        fixReportId: z.string().uuid(),
        filePaths: z.array(
          z.object({
            fileRepoRelativePath: z.string(),
          })
        ),
        sharedState: FixSharedStateZ,
        numberOfVulnerabilityIssues: z.number(),
        severityText: z.nativeEnum(Vulnerability_Severity_Enum),
        vulnerabilityReportIssues: z.array(
          z.object({
            id: z.string().uuid(),
            issueType: z.string(),
            issueLanguage: z.string(),
          })
        ),
        // scmSubmitFixRequests: ScmSubmitFixRequestsZ,
      })
    ),
    repo: z.object({
      name: z.string().nullable(),
      originalUrl: z.string(),
      reference: z.string(),
      commitSha: z.string(),
      isKnownBranch: z.boolean().nullish().default(true),
    }),
    vulnerabilityReportIssuesFixedCount: z.object({
      vulnerabilityReportIssues_aggregate: z.object({
        aggregate: z.object({ count: z.number() }),
      }),
    }),
    vulnerabilityReport: z.object({
      id: z.string().uuid(),
      reportSummaryUrl: z.string().url().nullish(),
      vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum).nullable(),
      issuesWithKnownLanguage: z.number().nullable(),
      scanDate: z.string().nullable(),
      vendorReportId: z.string().uuid().nullable(),
      projectId: z.string().uuid(),
      project: z.object({
        organizationId: z.string().uuid(),
      }),
      file: z.object({
        id: z.string().uuid(),
        path: z.string(),
      }),
      pending: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      irrelevant: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      remaining: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      digested: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      supported: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      all: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      fixable: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      errors: z.object({
        aggregate: z.object({
          count: z.number(),
        }),
      }),
      vulnerabilityReportIssues: z
        .object({
          id: z.string().uuid(),
          extraData: z.object({
            missing_files: z.string().array().nullish(),
            large_files: z.string().array().nullish(),
            error_files: z.string().array().nullish(),
          }),
        })
        .array(),
    }),
  }),
})

export const ReportFixesQueryFixZ = z.object({
  id: z.string().uuid(),
  sharedState: FixSharedStateZ,
  confidence: z.number(),
  gitBlameLogin: z.string().nullable(),
  effortToApplyFix: z.nativeEnum(Effort_To_Apply_Fix_Enum).nullable(),
  safeIssueLanguage: z.string(),
  safeIssueType: z.string(),
  fixReportId: z.string().uuid(),
  filePaths: z.array(
    z.object({
      fileRepoRelativePath: z.string(),
    })
  ),
  numberOfVulnerabilityIssues: z.number(),
  severityText: z.nativeEnum(Vulnerability_Severity_Enum),
  vulnerabilityReportIssues: z
    .array(
      z.object({
        issueType: z.string(),
        issueLanguage: z.string(),
      })
    )
    .min(1),
})

// todo: merge with the issue parts on './issue'
export const VulnerabilityReportIssueZ = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  state: z.nativeEnum(Vulnerability_Report_Issue_State_Enum),
  safeIssueType: z.string(),
  safeIssueLanguage: z.string(),
  extraData: z.object({
    missing_files: z.string().array().nullish(),
    large_files: z.string().array().nullish(),
    error_files: z.string().array().nullish(),
  }),
  fix: ReportFixesQueryFixZ.nullable(),
  falsePositive: z
    .object({
      id: z.string().uuid(),
    })
    .nullable(),
  parsedSeverity: ParsedSeverityZ,
  severity: z.string(),
  severityValue: z.number(),
  codeNodes: z.array(z.object({ path: z.string() })),
  vulnerabilityReportIssueTags: z.array(
    z.object({
      vulnerability_report_issue_tag_value: z.string(),
    })
  ),
})
export type VulnerabilityReportIssue = z.infer<typeof VulnerabilityReportIssueZ>

export const GetReportIssuesQueryZ = z
  .object({
    fixReport: z
      .object({
        vulnerabilityReport: z.object({
          id: z.string().uuid(),
          lastIssueUpdatedAt: z.string(),
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
          vulnerabilityReportIssues: z.array(VulnerabilityReportIssueZ),
        }),
      })
      .array(),
  })
  .nullish()

export const FixReportByProjectZ = z.object({
  project_by_pk: z.object({
    vulnerabilityReports: z.array(
      z.object({
        fixReport: z.object({ id: z.string().uuid() }).nullable(),
      })
    ),
  }),
})

export const FixScreenQueryResultZ = z.object({
  fixReport_by_pk: FixPageFixReportZ,
  fix_by_pk: FixPartsForFixScreenZ,
  fixesWithSameIssueType: z.array(
    z.object({
      id: z.string().uuid(),
      sharedState: z
        .object({ state: z.nativeEnum(Fix_State_Enum) })
        .nullable()
        .default({ state: Fix_State_Enum.Ready }),
    })
  ),
  relevantIssue: IssuePartsZ.nullish(),
})

export const FixPageQueryZ = z.object({
  data: FixScreenQueryResultZ,
})

export const GetReportFixesQueryZ = z
  .object({
    fixReport: z.array(
      z.object({
        fixes: z.array(ReportFixesQueryFixZ),
        vulnerabilityReportIssuesTotalCount: z.object({
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
        }),
        vulnerabilityReportIssuesFixedCount: z.object({
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
        }),
        vulnerabilityReportIssuesIrrelevantCount: z.object({
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
        }),
        vulnerabilityReportIssuesRemainingCount: z.object({
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
        }),
      })
    ),
  })
  .nullish()

const ProjectVulnerabilityReport = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum).nullable(),
  fixReport: z.object({
    id: z.string().uuid(),
    createdOn: z.string(),
    vulnerabilityReportIssuesFixedCount: z.object({
      vulnerabilityReportIssues_aggregate: z.object({
        aggregate: z.object({ count: z.number() }),
      }),
    }),
    issueTypes: z.record(z.string(), z.number()).nullable(),
    issueLanguages: z
      .record(z.nativeEnum(IssueLanguage_Enum), z.number())
      .nullable(),
    fixesCountByEffort: z
      .record(z.nativeEnum(Effort_To_Apply_Fix_Enum), z.number())
      .nullable(),
    vulnerabilitySeverities: z
      .record(z.nativeEnum(Vulnerability_Severity_Enum), z.number())
      .nullable(),
    fixesDoneCount: z.number(),
    fixesInprogressCount: z.number(),
    fixesReadyCount: z.number(),
    repo: z.object({
      originalUrl: z.string(),
      reference: z.string(),
      name: z.string(),
    }),
    createdByUser: z
      .object({
        email: z.string(),
      })
      .nullable(),
    state: z.nativeEnum(Fix_Report_State_Enum),
    expirationOn: z.string(),
  }),
})

const ProjectGetProjectZ = z.object({
  id: z.string().uuid(),
  name: z.string(),
  vulnerabilityReports: z
    .object({
      vendor: z.nativeEnum(Vulnerability_Report_Vendor_Enum).nullable(),
      fixReport: z.object({
        issueLanguages: z
          .record(z.nativeEnum(IssueLanguage_Enum), z.number())
          .nullable(),
        state: z.nativeEnum(Fix_Report_State_Enum),
        repo: z.object({
          originalUrl: z.string(),
          reference: z.string(),
        }),
        expirationOn: z.string(),
      }),
    })
    .array(),
})

export type ProjectGetProjectType = z.infer<typeof ProjectGetProjectZ>

export const GetProjectsQueryZ = z.array(ProjectGetProjectZ)

export const ProjectPageQueryResultZ = z.object({
  name: z.string(),
  id: z.string().uuid(),
  isDefault: z.boolean().default(false),
  organizationId: z.string().uuid(),
  vulnerabilityReports: z.array(ProjectVulnerabilityReport),
  projectIssueTypeSettings: z.array(
    IssueTypeSettingZ.merge(z.object({ id: z.string() }))
  ),
})

export type PatchAndQuestions = z.infer<typeof PatchAndQuestionsZ>
export type FixExtraContext = PatchAndQuestions['extraContext']
export type FixQueryResult = z.infer<typeof FixScreenQueryResultZ>
export type ReportQueryResult = z.infer<typeof ReportQueryResultZ>
export type FixPageData = z.infer<typeof FixScreenQueryResultZ>
export type FixReportByProject = z.infer<typeof FixReportByProjectZ>
export type FixQuestionsData =
  FixQueryResult['fix_by_pk']['patchAndQuestions']['questions']
export type FixQuestionData = Unpacked<FixQuestionsData>
export type ExtraContext = Unpacked<FixQuestionData['extraContext']>['value']
export type FixOnReport = z.infer<typeof ReportFixesQueryFixZ>
export type Fix = FixPageData['fix_by_pk']
export type ProjectQueryResult = z.infer<typeof ProjectPageQueryResultZ>
export type ProjectVulnerabilityReport = z.infer<
  typeof ProjectVulnerabilityReport
>
export type GetProjectsQueryResult = z.infer<typeof GetProjectsQueryZ>

export const GetProjectMembersDataZ = z.object({
  project_by_pk: z.object({
    name: z.string(),
    id: z.string(),
    projectUsers: z.array(
      z.object({
        projectToRole: z.object({
          projectRole: z.object({
            type: z.nativeEnum(Project_Role_Type_Enum),
          }),
        }),
        user: z.object({
          id: z.string().uuid(),
          picture: z.string().optional(),
          name: z.string().nullish(),
          email: z.string().email(),
        }),
      })
    ),
  }),
})

export type GetProjectMembersData = z.infer<typeof GetProjectMembersDataZ>

export const RepoArgsZ = z.object({
  originalUrl: z.string().url(),
  branch: z.string(),
  commitSha: z.string(),
})

export type Question = {
  value: string
  defaultValue: string
  key: string
  error: boolean
  guidance?: string
} & FixQuestionData

export const scmCloudUrl: Record<ScmType, string> = {
  GitLab: 'https://gitlab.com',
  GitHub: 'https://github.com',
  Ado: 'https://dev.azure.com',
  Bitbucket: 'https://bitbucket.org',
} as const

export enum ScmType {
  GitHub = 'GitHub',
  GitLab = 'GitLab',
  Ado = 'Ado',
  Bitbucket = 'Bitbucket',
}

type BaseParseScmURLRes = {
  hostname: string
  organization: string
  projectPath: string
  repoName: string
  protocol: string
  pathElements: string[]
}

export type ParseScmURLRes =
  | ({
      scmType: ScmType.Ado
      projectName: string
      prefixPath: string
    } & BaseParseScmURLRes)
  | ({
      scmType: ScmType.GitHub | ScmType.Bitbucket | ScmType.GitLab
    } & BaseParseScmURLRes)
  | null
