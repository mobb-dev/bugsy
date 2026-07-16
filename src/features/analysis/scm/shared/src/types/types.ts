import { z } from 'zod'

import {
  Effort_To_Apply_Fix_Enum,
  Fix_Report_State_Enum,
  Fix_State_Enum,
  IssueLanguage_Enum,
  Project_Role_Type_Enum,
  Vulnerability_Report_Issue_Category_Enum,
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
import { IssuePartsZ, VulnerabilityReportIssueSharedStateZ } from './issue'
import { ParsedSeverityZ } from './shared'

export type Unpacked<T> = T extends (infer U)[] ? U : T

export const OrganizationScreenQueryParamsZ = z.object({
  organizationId: z.guid(),
})

export const PermissionsScreenQueryParamsZ = OrganizationScreenQueryParamsZ

export const ProjectPageQueryParamsZ = z.object({
  organizationId: z.guid(),
  projectId: z.guid(),
})
export const AnalysisPageQueryParamsZ = ProjectPageQueryParamsZ.extend({
  reportId: z.guid(),
})

export const FixPageQueryParamsZ = AnalysisPageQueryParamsZ.extend({
  fixId: z.guid(),
})
export const IssuePageQueryParamsZ = AnalysisPageQueryParamsZ.extend({
  issueId: z.guid(),
})

export const CliLoginPageQueryParamsZ = z.object({
  loginId: z.guid(),
})

// Note: we're using zod here becasue we need to assue we have all the data ready for rendering the page
// This saves null chekcing on the internal components

export const AnalysisReportDigestedZ = z.object({
  id: z.guid(),
  state: z.enum(Fix_Report_State_Enum),
  vulnerabilityReport: z.object({
    reportSummaryUrl: z.url().nullish(),
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
    vendor: z.enum(Vulnerability_Report_Vendor_Enum),
    project: z.object({
      organizationId: z.guid(),
    }),
  }),
})

const IssueSharedStateZ = z
  .object({
    id: z.guid(),
    createdAt: z.string(),
    isArchived: z.boolean(),
    ticketIntegrationId: z.guid().nullable(),
    ticketIntegrations: z.array(
      z.object({
        url: z.string(),
      })
    ),
  })
  .nullable()

export const ReportQueryResultZ = z.object({
  fixReport_by_pk: z.object({
    id: z.guid(),
    analysisUrl: z.string(),
    fixesCommitted: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
    fixesDownloaded: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
    fixesDoneCount: z.number(),
    fixesInprogressCount: z.number(),
    fixesReadyCount: z.object({
      aggregate: z.object({ count: z.number() }),
    }),
    issueTypes: z.record(z.string(), z.number()).nullable(),
    issueLanguages: z.record(z.string(), z.number()).nullable(),
    fixesCountByEffort: z.record(z.string(), z.number()).nullable(),
    vulnerabilitySeverities: z.record(z.string(), z.number()).nullable(),
    createdOn: z.string(),
    expirationOn: z.string().nullable(),
    state: z.enum(Fix_Report_State_Enum),
    failReason: z.string().nullable(),
    candidateToRerun: z.boolean(),
    fixes: z.array(
      z.object({
        id: z.guid(),
        safeIssueLanguage: z.string(),
        safeIssueType: z.string(),
        confidence: z.number(),
        effortToApplyFix: z.enum(Effort_To_Apply_Fix_Enum).nullable(),
        modifiedBy: z.string().nullable(),
        gitBlameLogin: z.string().nullable(),
        fixReportId: z.guid(),
        filePaths: z.array(
          z.object({
            fileRepoRelativePath: z.string(),
          })
        ),
        sharedState: FixSharedStateZ,
        numberOfVulnerabilityIssues: z.number(),
        severityText: z.enum(Vulnerability_Severity_Enum),
        vulnerabilityReportIssues: z.array(
          z.object({
            id: z.guid(),
            issueType: z.string(),
            issueLanguage: z.string(),
            category: z.enum(Vulnerability_Report_Issue_Category_Enum),
            sharedState: IssueSharedStateZ,
          })
        ),
      })
    ),
    repo: z
      .object({
        name: z.string().nullable(),
        originalUrl: z.string(),
        reference: z.string(),
        commitSha: z.string(),
        isKnownBranch: z.boolean().nullish().default(true),
      })
      .nullable()
      .transform(
        (repo) =>
          repo ?? {
            name: null,
            originalUrl: '',
            reference: '',
            commitSha: '',
            isKnownBranch: true as const,
          }
      ),
    vulnerabilityReportIssuesFixedCount: z.object({
      vulnerabilityReportIssues_aggregate: z.object({
        aggregate: z.object({ count: z.number() }),
      }),
    }),
    vulnerabilityReport: z.object({
      id: z.guid(),
      reportSummaryUrl: z.url().nullish(),
      computedVendor: z.enum(Vulnerability_Report_Vendor_Enum).nullable(),
      vendor: z.enum(Vulnerability_Report_Vendor_Enum).nullable(),
      issuesWithKnownLanguage: z.number().nullable(),
      scanDate: z.string().nullable(),
      vendorReportId: z.guid().nullable(),
      projectId: z.guid(),
      project: z.object({
        organizationId: z.guid(),
      }),
      file: z
        .object({
          id: z.guid(),
          path: z.string(),
        })
        .nullable(),
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
          id: z.guid(),
          extraData: z.object({
            missing_files: z.string().array().nullish(),
            large_files: z.string().array().nullish(),
            error_files: z.string().array().nullish(),
            ai_cost_limit_exceeded: z.string().nullish(),
          }),
        })
        .array(),
    }),
  }),
})

export const ReportFixesQueryFixZ = z.object({
  id: z.guid(),
  sharedState: FixSharedStateZ,
  confidence: z.number(),
  gitBlameLogin: z.string().nullable(),
  effortToApplyFix: z.enum(Effort_To_Apply_Fix_Enum).nullable(),
  safeIssueLanguage: z.string(),
  safeIssueType: z.string(),
  fixReportId: z.guid(),
  filePaths: z.array(
    z.object({
      fileRepoRelativePath: z.string(),
    })
  ),
  numberOfVulnerabilityIssues: z.number(),
  severityText: z.enum(Vulnerability_Severity_Enum),
  vulnerabilityReportIssues: z
    .array(
      z.object({
        issueType: z.string(),
        issueLanguage: z.string(),
        sharedState: IssueSharedStateZ,
      })
    )
    .min(1),
})

// Base schema with common fields for vulnerability report issues
export const BaseVulnerabilityReportIssueZ = z.object({
  id: z.guid(),
  createdAt: z.string(),
  state: z.enum(Vulnerability_Report_Issue_State_Enum),
  safeIssueType: z.string(),
  safeIssueLanguage: z.string(),
  extraData: z.object({
    missing_files: z.string().array().nullish(),
    large_files: z.string().array().nullish(),
    error_files: z.string().array().nullish(),
    ai_cost_limit_exceeded: z.string().nullish(),
  }),
  fix: ReportFixesQueryFixZ.nullable(),
  falsePositive: z
    .object({
      id: z.guid(),
    })
    .nullable(),
  parsedSeverity: ParsedSeverityZ,
  severity: z.string(),
  severityValue: z.number(),
  category: z.string(),
  vulnerabilityReportIssueTags: z.array(
    z.object({
      vulnerability_report_issue_tag_value: z.string(),
    })
  ),
  sharedState: VulnerabilityReportIssueSharedStateZ,
})

// schema with codeNodes (for existing functionality, issue page)
export const VulnerabilityReportIssueZ = BaseVulnerabilityReportIssueZ.extend(
  z.object({
    codeNodes: z.array(z.object({ path: z.string() })),
  }).shape
)
export type VulnerabilityReportIssue = z.infer<typeof VulnerabilityReportIssueZ>

// New schema with codeFilePath (for GetReportIssuesQuery)
export const VulnerabilityReportIssueWithCodeFilePathZ =
  BaseVulnerabilityReportIssueZ.extend(
    z.object({
      codeFilePath: z.string().nullable(),
    }).shape
  )
export type VulnerabilityReportIssueWithCodeFilePath = z.infer<
  typeof VulnerabilityReportIssueWithCodeFilePathZ
>

export const GetReportIssuesQueryZ = z
  .object({
    fixReport: z
      .object({
        vulnerabilityReport: z.object({
          id: z.guid(),
          lastIssueUpdatedAt: z.string(),
          vulnerabilityReportIssues_aggregate: z.object({
            aggregate: z.object({ count: z.number() }),
          }),
          vulnerabilityReportIssues: z.array(
            VulnerabilityReportIssueWithCodeFilePathZ
          ),
        }),
      })
      .array(),
  })
  .nullish()

export const FixReportByProjectZ = z.object({
  project_by_pk: z.object({
    vulnerabilityReports: z.array(
      z.object({
        fixReport: z.object({ id: z.guid() }).nullable(),
      })
    ),
  }),
})

export const FixScreenQueryResultZ = z.object({
  fixReport_by_pk: FixPageFixReportZ,
  fix_by_pk: FixPartsForFixScreenZ,
  fixesWithSameIssueType: z.array(
    z.object({
      id: z.guid(),
      sharedState: z
        .object({ state: z.enum(Fix_State_Enum) })
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

export const GetFixReportStatsQueryZ = z.object({
  fixReport_by_pk: z
    .object({
      id: z.guid(),
      vulnerabilitySeverities: z
        .partialRecord(z.enum(Vulnerability_Severity_Enum), z.number())
        .nullable(),
      vulnerabilityReportIrrelevantIssuesCount: z.object({
        vulnerabilityReportIssues_aggregate: z.object({
          aggregate: z.object({ count: z.number() }),
        }),
      }),
    })
    .nullable(),
})

const ProjectVulnerabilityReport = z.object({
  id: z.guid(),
  name: z.string().nullable(),
  vendor: z.enum(Vulnerability_Report_Vendor_Enum).nullable(),
  computedVendor: z.enum(Vulnerability_Report_Vendor_Enum).nullable(),
  fixReport: z.object({
    id: z.guid(),
    createdOn: z.string(),
    issueTypes: z.record(z.string(), z.number()).nullable(),
    // reports only contain the languages actually found in the repo
    issueLanguages: z
      .partialRecord(z.enum(IssueLanguage_Enum), z.number())
      .nullable(),
    repo: z
      .object({
        originalUrl: z.string(),
        reference: z.string(),
        name: z.string(),
      })
      .nullable()
      .transform(
        (repo) =>
          repo ?? {
            originalUrl: '',
            reference: '',
            name: '',
          }
      ),
    createdByUser: z
      .object({
        email: z.string(),
      })
      .nullable(),
    state: z.enum(Fix_Report_State_Enum),
    expirationOn: z.string(),
  }),
})

export const GetProjectsQueryZ = z.object({
  organization: z.object({
    id: z.string(),
    projects: z.array(
      z.object({
        id: z.guid(),
        name: z.string(),
        numberOfUniqueRepos: z.number(),
      })
    ),
  }),
})

export const ProjectPageQueryResultZ = z.object({
  name: z.string(),
  id: z.guid(),
  isDefault: z.boolean().default(false),
  organizationId: z.guid(),
  vulnerabilityReports: z.array(ProjectVulnerabilityReport),
  autoPrIncludeAiFixes: z.preprocess(
    (val) => (val === null || val === undefined ? false : val),
    z.boolean()
  ),
  projectIssueTypeSettings: z.array(
    IssueTypeSettingZ.extend(z.object({ id: z.string() }).shape)
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
            type: z.enum(Project_Role_Type_Enum),
          }),
        }),
        user: z.object({
          id: z.guid(),
          picture: z.string().nullable().optional(),
          name: z.string().nullish(),
          email: z.email(),
        }),
      })
    ),
  }),
})

export type GetProjectMembersData = z.infer<typeof GetProjectMembersDataZ>
export type GetFixReportStatsQuery = z.infer<typeof GetFixReportStatsQueryZ>

export const RepoArgsZ = z.object({
  originalUrl: z.url(),
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
  /** Canonical HTTPS URL (normalized: no credentials, no .git suffix, lowercase hostname, lowercase path for GitHub/GitLab/Bitbucket/ADO) */
  canonicalUrl: string
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
  | ({
      scmType: 'Unknown'
    } & BaseParseScmURLRes)
  | null

export enum ConvertToSarifInputFileFormat {
  FortifyFPR = 'FortifyFPR',
}
