import * as Types from './base-types';
import { GraphQLClient, RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type MeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'query_root', me?: { __typename?: 'MeResponse', id: string, email: string, userOrganizationsAndUserOrganizationRoles: Array<{ __typename?: 'OrganizationToRoleType', organization?: { __typename?: 'OrganizationType', brokerHosts: Array<{ __typename?: 'BrokerHostsType', realDomain: string, virtualDomain: string } | null> } | null } | null>, scmConfigs: Array<{ __typename?: 'ScmConfig', id: string, orgId?: string | null, refreshToken?: string | null, scmType: string, scmUrl: string, scmUsername?: string | null, token?: string | null, tokenLastUpdate?: string | null, userId?: string | null, scmOrg?: string | null, isTokenAvailable: boolean } | null> } | null };

export type GetLastOrgAndNamedProjectQueryVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  projectName: Types.Scalars['String']['input'];
}>;


export type GetLastOrgAndNamedProjectQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: any, userOrganizationsAndUserOrganizationRoles: Array<{ __typename?: 'organization_to_user', id: any, organization: { __typename?: 'organization', id: any, enableV2Fixes: boolean, isFixEnabled?: boolean | null, projects: Array<{ __typename?: 'project', name: string, id: any }> } }> }> };

export type GetLastOrgQueryVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type GetLastOrgQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: any, name?: string | null, userOrganizationsAndUserOrganizationRoles: Array<{ __typename?: 'organization_to_user', id: any, organization: { __typename?: 'organization', id: any, enableV2Fixes: boolean, isFixEnabled?: boolean | null } }> }> };

export type GetEncryptedApiTokenQueryVariables = Types.Exact<{
  loginId: Types.Scalars['uuid']['input'];
}>;


export type GetEncryptedApiTokenQuery = { __typename?: 'query_root', cli_login_by_pk?: { __typename?: 'cli_login', encryptedApiToken?: string | null } | null };

export type FixReportStateQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type FixReportStateQuery = { __typename?: 'query_root', fixReport_by_pk?: { __typename?: 'fixReport', state: Types.Fix_Report_State_Enum } | null };

export type GetVulnerabilityReportPathsQueryVariables = Types.Exact<{
  vulnerabilityReportId: Types.Scalars['uuid']['input'];
}>;


export type GetVulnerabilityReportPathsQuery = { __typename?: 'query_root', vulnerability_report_path: Array<{ __typename?: 'vulnerability_report_path', path: string }> };

export type GetAnalysisSubscriptionSubscriptionVariables = Types.Exact<{
  analysisId: Types.Scalars['uuid']['input'];
}>;


export type GetAnalysisSubscriptionSubscription = { __typename?: 'subscription_root', analysis?: { __typename?: 'fixReport', id: any, state: Types.Fix_Report_State_Enum, failReason?: string | null } | null };

export type GetOrganizationIdQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOrganizationIdQuery = { __typename?: 'query_root', organization: Array<{ __typename?: 'organization', id: any }> };

export type UpdateOrgScanPolicyMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
  policyJson?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateOrgScanPolicyMutation = { __typename?: 'mutation_root', updateOrganizationScanPolicy: { __typename: 'ScanPolicyRelaxLockError' } | { __typename: 'ScanPolicyUpdateSuccess', storedPolicyJson?: string | null, warnings: Array<string> } | { __typename: 'ScanPolicyValidationError', error?: string | null } };

export type GetReportFindingRuleIdsQueryVariables = Types.Exact<{
  fixReportId: Types.Scalars['uuid']['input'];
}>;


export type GetReportFindingRuleIdsQuery = { __typename?: 'query_root', fixReport_by_pk?: { __typename?: 'fixReport', vulnerabilityReport: { __typename?: 'vulnerability_report', vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', extraData?: any | null }> } } | null };

export type GetGateVerdictQueryVariables = Types.Exact<{
  fixReportId: Types.Scalars['String']['input'];
}>;


export type GetGateVerdictQuery = { __typename?: 'query_root', getGateVerdict: { __typename: 'GateVerdictError', error?: string | null } | { __typename: 'GateVerdictNotReady', state: string } | { __typename: 'GateVerdictSuccess', blocking: boolean, blockingCount: number, totalIssues: number, criticalCount: number, highCount: number, mediumCount: number, lowCount: number, unclassifiedCount: number, description: string, degraded: boolean } };

export type GetAnalysisQueryVariables = Types.Exact<{
  analysisId: Types.Scalars['uuid']['input'];
}>;


export type GetAnalysisQuery = { __typename?: 'query_root', analysis?: { __typename?: 'fixReport', id: any, state: Types.Fix_Report_State_Enum, failReason?: string | null, vulnerabilityReportId: any, repo?: { __typename?: 'repo', commitSha: string, pullRequest?: number | null } | null, vulnerabilityReport: { __typename?: 'vulnerability_report', projectId: any, project: { __typename?: 'project', organizationId: any, organization: { __typename?: 'organization', ghFixerNoFixComments: boolean } }, file?: { __typename?: 'file', signedFile?: { __typename?: 'FilePayload', url: string } | null } | null } } | null };

export type GetFixesQueryVariables = Types.Exact<{
  filters: Types.Fix_Bool_Exp;
}>;


export type GetFixesQuery = { __typename?: 'query_root', fixes: Array<{ __typename?: 'fix', safeIssueType?: string | null, id: any, severityText?: string | null, safeIssueLanguage?: string | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename: 'FixQuestion', defaultValue: string, index: number, inputType: Types.FixQuestionInputType, key: string, name: string, options: Array<string>, value?: string | null, content: string, description: string, guidance: string }>, extraContext: { __typename: 'FixExtraContextResponse', fixDescription: string, guidances: Array<string>, extraContext: Array<{ __typename: 'UnstructuredFixExtraContext', key: string, value: any }>, manifestActionsRequired: Array<{ __typename: 'FixExtraContextManifestActionRequiredResponse', action: Types.ManifestAction, language: Types.Language, lib: { __typename?: 'PackageInfoResponse', name: string, version: string }, typesLib?: { __typename?: 'PackageInfoResponse', envName?: string | null, name: string, version: string } | null }> } } | { __typename: 'GetFixNoFixError' } }> };

export type GetVulByNodesMetadataQueryVariables = Types.Exact<{
  pathFilters?: Types.InputMaybe<Array<Types.Vulnerability_Report_Issue_Bool_Exp> | Types.Vulnerability_Report_Issue_Bool_Exp>;
  vulnerabilityReportId: Types.Scalars['uuid']['input'];
}>;


export type GetVulByNodesMetadataQuery = { __typename?: 'query_root', vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', id: any, safeIssueType?: string | null, fixId?: any | null, fpId?: any | null, category?: Types.Vulnerability_Report_Issue_Category_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', tag: Types.Vulnerability_Report_Issue_Tag_Enum }>, codeNodesJson?: { __typename?: 'vulnerability_report_issue_code_nodes', nodes: any } | null }>, totalScanVulnerabilities: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null } };

export type GetFalsePositiveQueryVariables = Types.Exact<{
  fpId: Types.Scalars['uuid']['input'];
}>;


export type GetFalsePositiveQuery = { __typename?: 'query_root', getFalsePositive: { __typename?: 'FalsePositiveData', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } | { __typename?: 'GetFixNoFixError' } };

export type UpdateScmTokenMutationVariables = Types.Exact<{
  scmType: Types.Scalars['String']['input'];
  url: Types.Scalars['String']['input'];
  token: Types.Scalars['String']['input'];
  org?: Types.InputMaybe<Types.Scalars['String']['input']>;
  refreshToken?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateScmTokenMutation = { __typename?: 'mutation_root', updateScmToken?: { __typename: 'BadScmCredentials', status: Types.Status, error?: string | null } | { __typename: 'InvalidScmTypeError', status: Types.Status, error?: string | null } | { __typename: 'RepoUnreachableError', status: Types.Status } | { __typename: 'ScmAccessTokenUpdateSuccess', token: string } | null };

export type UploadS3BucketInfoMutationVariables = Types.Exact<{
  fileName: Types.Scalars['String']['input'];
}>;


export type UploadS3BucketInfoMutation = { __typename?: 'mutation_root', uploadS3BucketInfo: { __typename?: 'UploadResponse', status: Types.Status, error?: string | null, reportUploadInfo?: { __typename?: 'UploadResult', url: string, fixReportId: string, uploadFieldsJSON: string, uploadKey: string } | null, repoUploadInfo?: { __typename?: 'UploadResult', url: string, fixReportId: string, uploadFieldsJSON: string, uploadKey: string } | null } };

export type GetTracyDiffUploadUrlMutationVariables = Types.Exact<{
  commitSha: Types.Scalars['String']['input'];
}>;


export type GetTracyDiffUploadUrlMutation = { __typename?: 'mutation_root', getTracyDiffUploadUrl: { __typename?: 'GetTracyDiffUploadUrlResponse', status: Types.Status, error?: string | null, uploadInfo?: { __typename?: 'TracyDiffUploadInfo', url: string, uploadFieldsJSON: string, uploadKey: string } | null } };

export type AnalyzeCommitForExtensionAiBlameMutationVariables = Types.Exact<{
  repositoryURL: Types.Scalars['String']['input'];
  commitSha: Types.Scalars['String']['input'];
  organizationId: Types.Scalars['String']['input'];
  commitTimestamp?: Types.InputMaybe<Types.Scalars['Timestamp']['input']>;
  commitAuthor?: Types.InputMaybe<Types.GitIdentityInput>;
  commitCommitter?: Types.InputMaybe<Types.GitIdentityInput>;
  commitCoAuthors?: Types.InputMaybe<Array<Types.GitIdentityInput> | Types.GitIdentityInput>;
}>;


export type AnalyzeCommitForExtensionAiBlameMutation = { __typename?: 'mutation_root', analyzeCommitForAIBlame: { __typename: 'ProcessAIBlameErrorResult', status: Types.BlameStatus, error: string } | { __typename: 'ProcessAIBlameFinalResult', status: Types.BlameStatus, inferencesProcessed: number, attributionsCreated: number, attributions: Array<{ __typename?: 'AIBlameAttribution', id: string, aiBlameCommitId: string, aiBlameInferenceId: string, filePath: string, lineNumber: number, model?: string | null, toolName?: string | null, commitSha: string, inferenceType: Types.AiBlameInferenceType }> } | { __typename: 'ProcessAIBlameRequestedResult', status: Types.BlameStatus, requestIds: Array<string>, commitBlameRequestIds: Array<string> } };

export type GetAiBlameInferenceQueryVariables = Types.Exact<{
  aiBlameInferenceIds?: Types.InputMaybe<Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input']>;
}>;


export type GetAiBlameInferenceQuery = { __typename?: 'query_root', ai_blame_inference: Array<{ __typename?: 'ai_blame_inference', id: any, type: Types.Ai_Blame_Inference_Type_Enum, aiResponseAt: any }> };

export type GetAiBlameAttributionPromptQueryVariables = Types.Exact<{
  aiBlameAttributionId: Types.Scalars['String']['input'];
}>;


export type GetAiBlameAttributionPromptQuery = { __typename?: 'query_root', getAIBlameInferenceData: { __typename?: 'GetAIBlameInferencePromptResponse', promptUrl?: string | null, conversationMessages?: Array<{ __typename?: 'ConversationMessage', type: string, text: string, date: string }> | null } };

export type GetPromptSummaryQueryVariables = Types.Exact<{
  aiBlameAttributionId: Types.Scalars['String']['input'];
}>;


export type GetPromptSummaryQuery = { __typename?: 'query_root', getPromptSummary: { __typename: 'PromptSummaryError', status: Types.Status, error: string } | { __typename: 'PromptSummaryProcessing', status: Types.Status } | { __typename: 'PromptSummarySuccess', status: Types.Status, summary: { __typename?: 'PromptSummaryData', goal: string, developersPlan: Array<string>, aiImplementationDetails: Array<string>, developersPushbacks: Array<string>, importantInstructionsAndDecisions: Array<string>, appliedSkills: Array<string>, backAndForthLevel: { __typename?: 'BackAndForthLevel', level: number, justification: string }, mcpCalls: Array<{ __typename?: 'McpCallData', mcpServer: string, mcpTool: string, callCount: number }> } } };

export type UploadAiBlameInferencesInitMutationVariables = Types.Exact<{
  sessions: Array<Types.AiBlameInferenceInitInput> | Types.AiBlameInferenceInitInput;
}>;


export type UploadAiBlameInferencesInitMutation = { __typename?: 'mutation_root', uploadAIBlameInferencesInit: { __typename?: 'UploadAIBlameInferencesResponse', status: Types.Status, error?: string | null, uploadSessions: Array<{ __typename?: 'AIBlameInferenceUpload', aiBlameInferenceId: string, prompt: { __typename?: 'AIBlameUploadResult', url: string, artifactId: string, fileName: string, uploadFieldsJSON: string, uploadKey: string }, inference: { __typename?: 'AIBlameUploadResult', url: string, artifactId: string, fileName: string, uploadFieldsJSON: string, uploadKey: string } }> } };

export type FinalizeAiBlameInferencesUploadMutationVariables = Types.Exact<{
  sessions: Array<Types.AiBlameInferenceFinalizeInput> | Types.AiBlameInferenceFinalizeInput;
}>;


export type FinalizeAiBlameInferencesUploadMutation = { __typename?: 'mutation_root', finalizeAIBlameInferencesUpload: { __typename?: 'AIBlameValidationResponse', status: Types.Status, error?: string | null } };

export type UploadTracyRecordsMutationVariables = Types.Exact<{
  records: Array<Types.TracyRecordInput> | Types.TracyRecordInput;
}>;


export type UploadTracyRecordsMutation = { __typename?: 'mutation_root', uploadTracyRecords: { __typename?: 'TracyBatchUploadResponse', status: Types.Status, error?: string | null, retryable: boolean } };

export type GetTracyRawDataUploadUrlMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type GetTracyRawDataUploadUrlMutation = { __typename?: 'mutation_root', getTracyRawDataUploadUrl: { __typename?: 'TracyRawDataUploadUrlResponse', status: Types.Status, error?: string | null, url?: string | null, uploadFieldsJSON?: string | null, keyPrefix?: string | null } };

export type DigestVulnerabilityReportMutationVariables = Types.Exact<{
  vulnerabilityReportFileName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  fixReportId: Types.Scalars['String']['input'];
  projectId: Types.Scalars['String']['input'];
  scanSource: Types.Scalars['String']['input'];
  repoUrl?: Types.InputMaybe<Types.Scalars['String']['input']>;
  reference?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sha?: Types.InputMaybe<Types.Scalars['String']['input']>;
  baselineCommit?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isFixEnabled?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type DigestVulnerabilityReportMutation = { __typename?: 'mutation_root', digestVulnerabilityReport: { __typename: 'BadShaError' } | { __typename: 'MobbProjectAccessError' } | { __typename: 'RabbitSendError', status: Types.Status, error?: string | null } | { __typename: 'ReferenceNotFoundError', status: Types.Status, error?: string | null } | { __typename: 'RepoValidationError' } | { __typename: 'ReportValidationError', status: Types.Status, error?: string | null } | { __typename: 'UploadReportS3Error' } | { __typename: 'VulnerabilityReport', vulnerabilityReportId: string, fixReportId: string } | { __typename: 'VulnerabilityReportDownloadError' } };

export type SubmitVulnerabilityReportMutationVariables = Types.Exact<{
  fixReportId: Types.Scalars['String']['input'];
  repoUrl: Types.Scalars['String']['input'];
  reference: Types.Scalars['String']['input'];
  projectId: Types.Scalars['String']['input'];
  scanSource: Types.Scalars['String']['input'];
  sha?: Types.InputMaybe<Types.Scalars['String']['input']>;
  experimentalEnabled?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  vulnerabilityReportFileName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  pullRequest?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  isFullScan?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  scanContext: Types.Scalars['String']['input'];
  fileCount?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  computerName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  computerUser?: Types.InputMaybe<Types.Scalars['String']['input']>;
  clientVersion?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type SubmitVulnerabilityReportMutation = { __typename?: 'mutation_root', submitVulnerabilityReport: { __typename: 'BadShaError' } | { __typename: 'MobbProjectAccessError' } | { __typename: 'RabbitSendError' } | { __typename: 'ReferenceNotFoundError' } | { __typename: 'RepoValidationError' } | { __typename: 'ReportValidationError' } | { __typename: 'UploadReportS3Error' } | { __typename: 'VulnerabilityReport', vulnerabilityReportId: string, fixReportId: string } | { __typename: 'VulnerabilityReportDownloadError' } };

export type CreateCommunityUserMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateCommunityUserMutation = { __typename?: 'mutation_root', initOrganizationAndProject?: { __typename: 'InitOrganizationAndProjectGoodResponse', projectId?: string | null, userId: string, organizationId: string } | { __typename: 'UserAlreadyInProjectError', error?: string | null, status: Types.Status } | { __typename: 'UserHasNoPermissionInProjectError', error?: string | null, status: Types.Status } | null };

export type CreateCliLoginMutationVariables = Types.Exact<{
  publicKey: Types.Scalars['String']['input'];
}>;


export type CreateCliLoginMutation = { __typename?: 'mutation_root', insert_cli_login_one?: { __typename?: 'cli_login', id: any } | null };

export type PerformCliLoginMutationVariables = Types.Exact<{
  loginId: Types.Scalars['String']['input'];
}>;


export type PerformCliLoginMutation = { __typename?: 'mutation_root', performCliLogin?: { __typename?: 'StatusQueryResponse', status: Types.Status } | null };

export type SetQuarantineEnabledMutationVariables = Types.Exact<{
  enabled: Types.Scalars['Boolean']['input'];
}>;


export type SetQuarantineEnabledMutation = { __typename?: 'mutation_root', update_organization?: { __typename?: 'organization_mutation_response', affected_rows: number } | null };

export type CreateProjectMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
  projectName: Types.Scalars['String']['input'];
}>;


export type CreateProjectMutation = { __typename?: 'mutation_root', createProject: { __typename?: 'CreateProjectResponse', projectId: string } };

export type ValidateRepoUrlQueryVariables = Types.Exact<{
  repoUrl: Types.Scalars['String']['input'];
}>;


export type ValidateRepoUrlQuery = { __typename?: 'query_root', validateRepoUrl?: { __typename: 'BadScmCredentials', status: Types.Status, error?: string | null, scmType?: string | null } | { __typename: 'InvalidRepoUrlError' } | { __typename: 'RepoUnreachableError', status: Types.Status, error?: string | null, scmType?: string | null } | { __typename: 'RepoValidationSuccess', status: Types.Status, defaultBranch: string, defaultBranchLastModified: string, defaultBranchSha: string, scmType?: string | null } | null };

export type GitReferenceQueryVariables = Types.Exact<{
  repoUrl: Types.Scalars['String']['input'];
  reference: Types.Scalars['String']['input'];
}>;


export type GitReferenceQuery = { __typename?: 'query_root', gitReference?: { __typename: 'GitReferenceData', status: Types.Status, sha: string, date: string } | { __typename: 'ReferenceNotFoundError', status: Types.Status, error?: string | null } | { __typename: 'RepoUnreachableError' } | null };

export type AutoPrAnalysisMutationVariables = Types.Exact<{
  analysisId: Types.Scalars['String']['input'];
  commitDirectly?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  prId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  prStrategy?: Types.InputMaybe<Types.PrStrategy>;
  deliveryMode?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AutoPrAnalysisMutation = { __typename?: 'mutation_root', autoPrAnalysis?: { __typename: 'AutoPrError', status: Types.Status, error: string } | { __typename: 'AutoPrSuccess', status: Types.Status, appliedAutoPrIssueTypes: Array<string> } | null };

export type FixDetailsFragment = { __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } };

export type GetFixWithAnswersQueryVariables = Types.Exact<{
  fixId: Types.Scalars['uuid']['input'];
  userInput: Array<Types.QuestionAnswer> | Types.QuestionAnswer;
}>;


export type GetFixWithAnswersQuery = { __typename?: 'query_root', fixData: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } };

export type FixReportSummaryFieldsFragment = { __typename?: 'fixReport', id: any, createdOn: any, issueTypes?: any | null, repo?: { __typename?: 'repo', originalUrl: string } | null, CRITICAL: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, HIGH: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, MEDIUM: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, LOW: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, fixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, userFixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, filteredFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, totalFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, vulnerabilityReport: { __typename?: 'vulnerability_report', scanDate?: any | null, vendor?: Types.Vulnerability_Report_Vendor_Enum | null, projectId: any, project: { __typename?: 'project', organizationId: any }, totalVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null }, notFixableVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null } } };

export type GetFixReportsByRepoUrlQueryVariables = Types.Exact<{
  repoUrl: Types.Scalars['String']['input'];
}>;


export type GetFixReportsByRepoUrlQuery = { __typename?: 'query_root', fixReport: Array<{ __typename?: 'fixReport', id: any, state: Types.Fix_Report_State_Enum, createdOn: any, repo?: { __typename?: 'repo', originalUrl: string } | null, vulnerabilityReport: { __typename?: 'vulnerability_report', scanDate?: any | null, vendor?: Types.Vulnerability_Report_Vendor_Enum | null } }> };

export type GetReportFixesQueryVariables = Types.Exact<{
  reportId: Types.Scalars['uuid']['input'];
  filters?: Types.InputMaybe<Types.Fix_Bool_Exp>;
  limit: Types.Scalars['Int']['input'];
  offset: Types.Scalars['Int']['input'];
  currentUserEmail: Types.Scalars['String']['input'];
}>;


export type GetReportFixesQuery = { __typename?: 'query_root', fixReport: Array<{ __typename?: 'fixReport', id: any, createdOn: any, issueTypes?: any | null, repo?: { __typename?: 'repo', originalUrl: string } | null, CRITICAL: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, HIGH: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, MEDIUM: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, LOW: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, fixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, userFixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, filteredFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, totalFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, vulnerabilityReport: { __typename?: 'vulnerability_report', scanDate?: any | null, vendor?: Types.Vulnerability_Report_Vendor_Enum | null, projectId: any, project: { __typename?: 'project', organizationId: any }, totalVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null }, notFixableVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null } } }>, expiredReport: Array<{ __typename?: 'fixReport', id: any, expirationOn?: any | null }> };

export type GetLatestReportByRepoUrlQueryVariables = Types.Exact<{
  repoUrl: Types.Scalars['String']['input'];
  filters?: Types.InputMaybe<Types.Fix_Bool_Exp>;
  limit: Types.Scalars['Int']['input'];
  offset: Types.Scalars['Int']['input'];
  currentUserEmail: Types.Scalars['String']['input'];
}>;


export type GetLatestReportByRepoUrlQuery = { __typename?: 'query_root', fixReport: Array<{ __typename?: 'fixReport', id: any, createdOn: any, issueTypes?: any | null, repo?: { __typename?: 'repo', originalUrl: string } | null, CRITICAL: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, HIGH: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, MEDIUM: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, LOW: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, fixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, userFixes: Array<{ __typename?: 'fix', id: any, confidence: number, safeIssueType?: string | null, safeIssueLanguage?: string | null, severityText?: string | null, gitBlameLogin?: string | null, severityValue?: number | null, vulnerabilityReportIssues: Array<{ __typename?: 'vulnerability_report_issue', category?: Types.Vulnerability_Report_Issue_Category_Enum | null, parsedIssueType?: string | null, parsedSeverity?: Types.Vulnerability_Severity_Enum | null, vulnerabilityReportIssueTags: Array<{ __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag', vulnerability_report_issue_tag_value: Types.Vulnerability_Report_Issue_Tag_Enum }> }>, sharedState?: { __typename?: 'fix_shared_state', id: any, downloadedBy: Array<{ __typename?: 'fix_download_to_user', downloadSource?: Types.Fix_Download_Source_Enum | null }> } | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename?: 'FixQuestion', key: string, name: string, defaultValue: string, value?: string | null, inputType: Types.FixQuestionInputType, options: Array<string>, index: number, content: string, description: string, guidance: string }>, extraContext: { __typename?: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> } } | { __typename: 'GetFixNoFixError' } }>, filteredFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, totalFixesCount: { __typename?: 'fix_aggregate', aggregate?: { __typename?: 'fix_aggregate_fields', count: number } | null }, vulnerabilityReport: { __typename?: 'vulnerability_report', scanDate?: any | null, vendor?: Types.Vulnerability_Report_Vendor_Enum | null, projectId: any, project: { __typename?: 'project', organizationId: any }, totalVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null }, notFixableVulnerabilityReportIssuesCount: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null } } }>, expiredReport: Array<{ __typename?: 'fixReport', id: any, expirationOn?: any | null }> };

export type UpdateDownloadedFixDataMutationVariables = Types.Exact<{
  fixIds: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  source: Types.FixDownloadSource;
}>;


export type UpdateDownloadedFixDataMutation = { __typename?: 'mutation_root', updateDownloadedFixData?: { __typename?: 'StatusQueryResponse', status: Types.Status } | null };

export type GetUserMvsAutoFixQueryVariables = Types.Exact<{
  userEmail: Types.Scalars['String']['input'];
}>;


export type GetUserMvsAutoFixQuery = { __typename?: 'query_root', user_email_notification_settings: Array<{ __typename?: 'user_email_notification_settings', mvs_auto_fix: boolean }> };

export type StreamBlameAiAnalysisRequestsSubscriptionVariables = Types.Exact<{
  requestIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type StreamBlameAiAnalysisRequestsSubscription = { __typename?: 'subscription_root', blame_ai_analysis_request: Array<{ __typename?: 'blame_ai_analysis_request', id: any, state: Types.Blame_Ai_Analysis_Request_State_Enum, commitId?: any | null, organizationId: any, createdOn: any }> };

export type StreamCommitBlameRequestsSubscriptionVariables = Types.Exact<{
  requestIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type StreamCommitBlameRequestsSubscription = { __typename?: 'subscription_root', commit_blame_request: Array<{ __typename?: 'commit_blame_request', id: any, state: Types.Blame_Ai_Analysis_Request_State_Enum, organizationId: any, repositoryUrl: string, commitSha: string, createdOn: any, completedOn?: any | null, error?: string | null }> };

export type ScanSkillMutationVariables = Types.Exact<{
  skillUrl: Types.Scalars['String']['input'];
}>;


export type ScanSkillMutation = { __typename?: 'mutation_root', scanSkill: { __typename?: 'ScanSkillResult', skillName: string, skillHash?: string | null, skillVersion?: string | null, verdict: string, findingsCount: number, scanDurationMs: number, layersExecuted: Array<string>, cached: boolean, summary?: string | null, findings: Array<{ __typename?: 'ScanFinding', category: string, severity: string, ruleId?: string | null, explanation: string, evidence?: string | null, filePath?: string | null, lineNumber?: number | null, confidence: number, layer: string }> } };

export type SkillVerdictsByMd5QueryVariables = Types.Exact<{
  md5s: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type SkillVerdictsByMd5Query = { __typename?: 'query_root', skillVerdictsByMd5: { __typename?: 'SkillVerdictsResponse', quarantineEnabled: boolean, verdicts: Array<{ __typename?: 'SkillVerdict', md5: string, verdict: string, summary?: string | null, scannerName: string, scannerVersion: string, scannedAt: string }> } };

export type LogMvsEventMutationVariables = Types.Exact<{
  eventType: Types.Scalars['String']['input'];
  fixReportId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  projectId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  repoUrl?: Types.InputMaybe<Types.Scalars['String']['input']>;
  riskCount?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  computerName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  computerUser?: Types.InputMaybe<Types.Scalars['String']['input']>;
  clientVersion?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type LogMvsEventMutation = { __typename?: 'mutation_root', logMvsEvent?: { __typename?: 'StatusQueryResponse', status: Types.Status } | null };

export type GetMvsProjectMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['String']['input'];
}>;


export type GetMvsProjectMutation = { __typename?: 'mutation_root', getMvsProject: { __typename?: 'CreateProjectResponse', projectId: string } };

export type IssueTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IssueTypesQuery = { __typename?: 'query_root', issueTypes: Array<{ __typename?: 'IssueTypeResponse', value: string, label: string, issueDescription?: string | null, fixInstructions?: string | null }> };

export const FixDetailsFragmentDoc = `
    fragment FixDetails on fix {
  id
  confidence
  safeIssueType
  safeIssueLanguage
  severityText
  gitBlameLogin
  severityValue
  vulnerabilityReportIssues {
    category
    parsedIssueType
    parsedSeverity
    vulnerabilityReportIssueTags {
      vulnerability_report_issue_tag_value
    }
  }
  sharedState {
    id
    downloadedBy {
      downloadSource
    }
  }
  patchAndQuestions {
    __typename
    ... on FixData {
      patch
      patchOriginalEncodingBase64
      questions {
        key
        name
        defaultValue
        value
        inputType
        options
        index
        content
        description
        guidance
      }
      extraContext {
        extraContext {
          key
          value
        }
        fixDescription
      }
    }
  }
}
    `;
export const FixReportSummaryFieldsFragmentDoc = `
    fragment FixReportSummaryFields on fixReport {
  id
  createdOn
  repo {
    originalUrl
  }
  issueTypes
  CRITICAL: fixes_aggregate(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, {severityText: {_eq: "critical"}}]}
  ) {
    aggregate {
      count
    }
  }
  HIGH: fixes_aggregate(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, {severityText: {_eq: "high"}}]}
  ) {
    aggregate {
      count
    }
  }
  MEDIUM: fixes_aggregate(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, {severityText: {_eq: "medium"}}]}
  ) {
    aggregate {
      count
    }
  }
  LOW: fixes_aggregate(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, {severityText: {_eq: "low"}}]}
  ) {
    aggregate {
      count
    }
  }
  fixes(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, {_or: [{gitBlameLogin: {_is_null: true}}, {_not: {gitBlameLogin: {_ilike: $currentUserEmail}}}]}, $filters]}
    order_by: {severityValue: desc}
    limit: $limit
    offset: $offset
  ) {
    ...FixDetails
  }
  userFixes: fixes(
    where: {_and: [{gitBlameLogin: {_ilike: $currentUserEmail}}, {vulnerabilityReportIssues: {category: {_eq: Fixable}}}, $filters]}
    order_by: {severityValue: desc}
    limit: $limit
    offset: $offset
  ) {
    ...FixDetails
  }
  filteredFixesCount: fixes_aggregate(
    where: {_and: [{vulnerabilityReportIssues: {category: {_eq: Fixable}}}, $filters]}
  ) {
    aggregate {
      count
    }
  }
  totalFixesCount: fixes_aggregate {
    aggregate {
      count
    }
  }
  vulnerabilityReport {
    scanDate
    vendor
    projectId
    project {
      organizationId
    }
    totalVulnerabilityReportIssuesCount: vulnerabilityReportIssues_aggregate {
      aggregate {
        count
      }
    }
    notFixableVulnerabilityReportIssuesCount: vulnerabilityReportIssues_aggregate(
      where: {category: {_neq: Fixable}}
    ) {
      aggregate {
        count
      }
    }
  }
}
    ${FixDetailsFragmentDoc}`;
export const MeDocument = `
    query Me {
  me {
    id
    email
    userOrganizationsAndUserOrganizationRoles {
      organization {
        brokerHosts {
          realDomain
          virtualDomain
        }
      }
    }
    scmConfigs {
      id
      orgId
      refreshToken
      scmType
      scmUrl
      scmUsername
      token
      tokenLastUpdate
      userId
      scmOrg
      isTokenAvailable
    }
  }
}
    `;
export const GetLastOrgAndNamedProjectDocument = `
    query getLastOrgAndNamedProject($email: String!, $projectName: String!) {
  user(where: {email: {_eq: $email}}) {
    id
    userOrganizationsAndUserOrganizationRoles(order_by: {createdOn: desc}) {
      id
      organization {
        id
        enableV2Fixes
        isFixEnabled
        projects(where: {name: {_eq: $projectName}}) {
          name
          id
        }
      }
    }
  }
}
    `;
export const GetLastOrgDocument = `
    query getLastOrg($email: String!) {
  user(where: {email: {_eq: $email}}, limit: 1) {
    id
    name
    userOrganizationsAndUserOrganizationRoles(order_by: {createdOn: desc}) {
      id
      organization {
        id
        enableV2Fixes
        isFixEnabled
      }
    }
  }
}
    `;
export const GetEncryptedApiTokenDocument = `
    query GetEncryptedApiToken($loginId: uuid!) {
  cli_login_by_pk(id: $loginId) {
    encryptedApiToken
  }
}
    `;
export const FixReportStateDocument = `
    query FixReportState($id: uuid!) {
  fixReport_by_pk(id: $id) {
    state
  }
}
    `;
export const GetVulnerabilityReportPathsDocument = `
    query GetVulnerabilityReportPaths($vulnerabilityReportId: uuid!) {
  vulnerability_report_path(
    where: {vulnerabilityReportId: {_eq: $vulnerabilityReportId}}
  ) {
    path
  }
}
    `;
export const GetAnalysisSubscriptionDocument = `
    subscription getAnalysisSubscription($analysisId: uuid!) {
  analysis: fixReport_by_pk(id: $analysisId) {
    id
    state
    failReason
  }
}
    `;
export const GetOrganizationIdDocument = `
    query GetOrganizationId {
  organization {
    id
  }
}
    `;
export const UpdateOrgScanPolicyDocument = `
    mutation UpdateOrgScanPolicy($organizationId: String!, $policyJson: String) {
  updateOrganizationScanPolicy(
    organizationId: $organizationId
    policyJson: $policyJson
  ) {
    __typename
    ... on ScanPolicyUpdateSuccess {
      storedPolicyJson
      warnings
    }
    ... on ScanPolicyValidationError {
      error
    }
  }
}
    `;
export const GetReportFindingRuleIdsDocument = `
    query GetReportFindingRuleIds($fixReportId: uuid!) {
  fixReport_by_pk(id: $fixReportId) {
    vulnerabilityReport {
      vulnerabilityReportIssues {
        extraData(path: "rule_id")
      }
    }
  }
}
    `;
export const GetGateVerdictDocument = `
    query getGateVerdict($fixReportId: String!) {
  getGateVerdict(fixReportId: $fixReportId) {
    __typename
    ... on GateVerdictSuccess {
      blocking
      blockingCount
      totalIssues
      criticalCount
      highCount
      mediumCount
      lowCount
      unclassifiedCount
      description
      degraded
    }
    ... on GateVerdictNotReady {
      state
    }
    ... on GateVerdictError {
      error
    }
  }
}
    `;
export const GetAnalysisDocument = `
    query getAnalysis($analysisId: uuid!) {
  analysis: fixReport_by_pk(id: $analysisId) {
    id
    state
    failReason
    repo {
      commitSha
      pullRequest
    }
    vulnerabilityReportId
    vulnerabilityReport {
      projectId
      project {
        organizationId
        organization {
          ghFixerNoFixComments
        }
      }
      file {
        signedFile {
          url
        }
      }
    }
  }
}
    `;
export const GetFixesDocument = `
    query getFixes($filters: fix_bool_exp!) {
  fixes: fix(where: $filters) {
    safeIssueType
    id
    severityText
    safeIssueLanguage
    patchAndQuestions {
      __typename
      ... on FixData {
        patch
        patchOriginalEncodingBase64
        questions {
          defaultValue
          index
          inputType
          key
          name
          options
          value
          content
          description
          guidance
          __typename
        }
        extraContext {
          extraContext {
            key
            value
            __typename
          }
          fixDescription
          guidances
          manifestActionsRequired {
            action
            lib {
              name
              version
            }
            language
            typesLib {
              envName
              name
              version
            }
            __typename
          }
          __typename
        }
      }
    }
  }
}
    `;
export const GetVulByNodesMetadataDocument = `
    query getVulByNodesMetadata($pathFilters: [vulnerability_report_issue_bool_exp!], $vulnerabilityReportId: uuid!) {
  vulnerabilityReportIssues: vulnerability_report_issue(
    where: {vulnerabilityReportId: {_eq: $vulnerabilityReportId}, _or: $pathFilters}
  ) {
    id
    safeIssueType
    fixId
    fpId
    category
    vulnerabilityReportIssueTags {
      tag: vulnerability_report_issue_tag_value
    }
    codeNodesJson {
      nodes
    }
  }
  totalScanVulnerabilities: vulnerability_report_issue_aggregate(
    where: {vulnerabilityReportId: {_eq: $vulnerabilityReportId}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const GetFalsePositiveDocument = `
    query getFalsePositive($fpId: uuid!) {
  getFalsePositive(fpId: $fpId) {
    ... on FalsePositiveData {
      extraContext {
        key
        value
      }
      fixDescription
    }
  }
}
    `;
export const UpdateScmTokenDocument = `
    mutation updateScmToken($scmType: String!, $url: String!, $token: String!, $org: String, $refreshToken: String) {
  updateScmToken(
    scmType: $scmType
    url: $url
    token: $token
    org: $org
    refreshToken: $refreshToken
  ) {
    __typename
    ... on ScmAccessTokenUpdateSuccess {
      token
    }
    ... on InvalidScmTypeError {
      status
      error
    }
    ... on BadScmCredentials {
      status
      error
    }
    ... on RepoUnreachableError {
      status
    }
  }
}
    `;
export const UploadS3BucketInfoDocument = `
    mutation uploadS3BucketInfo($fileName: String!) {
  uploadS3BucketInfo(fileName: $fileName) {
    status
    error
    reportUploadInfo: uploadInfo {
      url
      fixReportId
      uploadFieldsJSON
      uploadKey
    }
    repoUploadInfo {
      url
      fixReportId
      uploadFieldsJSON
      uploadKey
    }
  }
}
    `;
export const GetTracyDiffUploadUrlDocument = `
    mutation GetTracyDiffUploadUrl($commitSha: String!) {
  getTracyDiffUploadUrl(commitSha: $commitSha) {
    status
    error
    uploadInfo {
      url
      uploadFieldsJSON
      uploadKey
    }
  }
}
    `;
export const AnalyzeCommitForExtensionAiBlameDocument = `
    mutation AnalyzeCommitForExtensionAIBlame($repositoryURL: String!, $commitSha: String!, $organizationId: String!, $commitTimestamp: Timestamp, $commitAuthor: GitIdentityInput, $commitCommitter: GitIdentityInput, $commitCoAuthors: [GitIdentityInput!]) {
  analyzeCommitForAIBlame(
    repositoryURL: $repositoryURL
    commitSha: $commitSha
    organizationId: $organizationId
    commitTimestamp: $commitTimestamp
    commitAuthor: $commitAuthor
    commitCommitter: $commitCommitter
    commitCoAuthors: $commitCoAuthors
  ) {
    __typename
    ... on ProcessAIBlameFinalResult {
      status
      inferencesProcessed
      attributionsCreated
      attributions {
        id
        aiBlameCommitId
        aiBlameInferenceId
        filePath
        lineNumber
        model
        toolName
        commitSha
        inferenceType
      }
    }
    ... on ProcessAIBlameErrorResult {
      status
      error
    }
    ... on ProcessAIBlameRequestedResult {
      status
      requestIds
      commitBlameRequestIds
    }
  }
}
    `;
export const GetAiBlameInferenceDocument = `
    query GetAIBlameInference($aiBlameInferenceIds: [uuid!]) {
  ai_blame_inference(where: {id: {_in: $aiBlameInferenceIds}}) {
    id
    type
    aiResponseAt
  }
}
    `;
export const GetAiBlameAttributionPromptDocument = `
    query GetAIBlameAttributionPrompt($aiBlameAttributionId: String!) {
  getAIBlameInferenceData(aiBlameAttributionId: $aiBlameAttributionId) {
    promptUrl
    conversationMessages {
      type
      text
      date
    }
  }
}
    `;
export const GetPromptSummaryDocument = `
    query GetPromptSummary($aiBlameAttributionId: String!) {
  getPromptSummary(aiBlameAttributionId: $aiBlameAttributionId) {
    __typename
    ... on PromptSummarySuccess {
      status
      summary {
        goal
        developersPlan
        aiImplementationDetails
        developersPushbacks
        importantInstructionsAndDecisions
        backAndForthLevel {
          level
          justification
        }
        appliedSkills
        mcpCalls {
          mcpServer
          mcpTool
          callCount
        }
      }
    }
    ... on PromptSummaryProcessing {
      status
    }
    ... on PromptSummaryError {
      status
      error
    }
  }
}
    `;
export const UploadAiBlameInferencesInitDocument = `
    mutation UploadAIBlameInferencesInit($sessions: [AIBlameInferenceInitInput!]!) {
  uploadAIBlameInferencesInit(sessions: $sessions) {
    status
    error
    uploadSessions {
      aiBlameInferenceId
      prompt {
        url
        artifactId
        fileName
        uploadFieldsJSON
        uploadKey
      }
      inference {
        url
        artifactId
        fileName
        uploadFieldsJSON
        uploadKey
      }
    }
  }
}
    `;
export const FinalizeAiBlameInferencesUploadDocument = `
    mutation FinalizeAIBlameInferencesUpload($sessions: [AIBlameInferenceFinalizeInput!]!) {
  finalizeAIBlameInferencesUpload(sessions: $sessions) {
    status
    error
  }
}
    `;
export const UploadTracyRecordsDocument = `
    mutation UploadTracyRecords($records: [TracyRecordInput!]!) {
  uploadTracyRecords(records: $records) {
    status
    error
    retryable
  }
}
    `;
export const GetTracyRawDataUploadUrlDocument = `
    mutation GetTracyRawDataUploadUrl {
  getTracyRawDataUploadUrl {
    status
    error
    url
    uploadFieldsJSON
    keyPrefix
  }
}
    `;
export const DigestVulnerabilityReportDocument = `
    mutation DigestVulnerabilityReport($vulnerabilityReportFileName: String, $fixReportId: String!, $projectId: String!, $scanSource: String!, $repoUrl: String, $reference: String, $sha: String, $baselineCommit: String, $isFixEnabled: Boolean) {
  digestVulnerabilityReport(
    fixReportId: $fixReportId
    vulnerabilityReportFileName: $vulnerabilityReportFileName
    projectId: $projectId
    scanSource: $scanSource
    repoUrl: $repoUrl
    reference: $reference
    sha: $sha
    baselineCommit: $baselineCommit
    isFixEnabled: $isFixEnabled
  ) {
    __typename
    ... on VulnerabilityReport {
      vulnerabilityReportId
      fixReportId
    }
    ... on RabbitSendError {
      status
      error
    }
    ... on ReportValidationError {
      status
      error
    }
    ... on ReferenceNotFoundError {
      status
      error
    }
  }
}
    `;
export const SubmitVulnerabilityReportDocument = `
    mutation SubmitVulnerabilityReport($fixReportId: String!, $repoUrl: String!, $reference: String!, $projectId: String!, $scanSource: String!, $sha: String, $experimentalEnabled: Boolean, $vulnerabilityReportFileName: String, $pullRequest: Int, $isFullScan: Boolean, $scanContext: String!, $fileCount: Int, $computerName: String, $computerUser: String, $clientVersion: String) {
  submitVulnerabilityReport(
    fixReportId: $fixReportId
    repoUrl: $repoUrl
    reference: $reference
    sha: $sha
    experimentalEnabled: $experimentalEnabled
    pullRequest: $pullRequest
    isFullScan: $isFullScan
    projectId: $projectId
    vulnerabilityReportFileName: $vulnerabilityReportFileName
    scanSource: $scanSource
    scanContext: $scanContext
    fileCount: $fileCount
    computerName: $computerName
    computerUser: $computerUser
    clientVersion: $clientVersion
  ) {
    __typename
    ... on VulnerabilityReport {
      vulnerabilityReportId
      fixReportId
    }
  }
}
    `;
export const CreateCommunityUserDocument = `
    mutation CreateCommunityUser {
  initOrganizationAndProject {
    __typename
    ... on InitOrganizationAndProjectGoodResponse {
      projectId
      userId
      organizationId
    }
    ... on UserAlreadyInProjectError {
      error
      status
    }
    ... on UserHasNoPermissionInProjectError {
      error
      status
    }
  }
}
    `;
export const CreateCliLoginDocument = `
    mutation CreateCliLogin($publicKey: String!) {
  insert_cli_login_one(object: {publicKey: $publicKey}) {
    id
  }
}
    `;
export const PerformCliLoginDocument = `
    mutation performCliLogin($loginId: String!) {
  performCliLogin(loginId: $loginId) {
    status
  }
}
    `;
export const SetQuarantineEnabledDocument = `
    mutation SetQuarantineEnabled($enabled: Boolean!) {
  update_organization(where: {}, _set: {quarantineEnabled: $enabled}) {
    affected_rows
  }
}
    `;
export const CreateProjectDocument = `
    mutation CreateProject($organizationId: String!, $projectName: String!) {
  createProject(organizationId: $organizationId, projectName: $projectName) {
    projectId
  }
}
    `;
export const ValidateRepoUrlDocument = `
    query validateRepoUrl($repoUrl: String!) {
  validateRepoUrl(repoUrl: $repoUrl) {
    __typename
    ... on RepoValidationSuccess {
      status
      defaultBranch
      defaultBranchLastModified
      defaultBranchSha
      scmType
    }
    ... on RepoUnreachableError {
      status
      error
      scmType
    }
    ... on BadScmCredentials {
      status
      error
      scmType
    }
  }
}
    `;
export const GitReferenceDocument = `
    query gitReference($repoUrl: String!, $reference: String!) {
  gitReference(repoUrl: $repoUrl, reference: $reference) {
    __typename
    ... on GitReferenceData {
      status
      sha
      date
    }
    ... on ReferenceNotFoundError {
      status
      error
    }
  }
}
    `;
export const AutoPrAnalysisDocument = `
    mutation autoPrAnalysis($analysisId: String!, $commitDirectly: Boolean, $prId: Int, $prStrategy: PRStrategy, $deliveryMode: String) {
  autoPrAnalysis(
    analysisId: $analysisId
    sameBranchCommit: $commitDirectly
    prId: $prId
    prStrategy: $prStrategy
    deliveryMode: $deliveryMode
  ) {
    __typename
    ... on AutoPrSuccess {
      status
      appliedAutoPrIssueTypes
    }
    ... on AutoPrError {
      status
      error
    }
  }
}
    `;
export const GetFixWithAnswersDocument = `
    query getFixWithAnswers($fixId: uuid!, $userInput: [QuestionAnswer!]!) {
  fixData: getFix(fixId: $fixId, userInput: $userInput, loadAnswers: false) {
    __typename
    ... on FixData {
      patch
      patchOriginalEncodingBase64
      questions {
        key
        name
        defaultValue
        value
        inputType
        options
        index
        content
        description
        guidance
      }
      extraContext {
        extraContext {
          key
          value
        }
        fixDescription
      }
    }
  }
}
    `;
export const GetFixReportsByRepoUrlDocument = `
    query GetFixReportsByRepoUrl($repoUrl: String!) {
  fixReport(where: {repo: {originalUrl: {_eq: $repoUrl}}}) {
    id
    state
    createdOn
    repo {
      originalUrl
    }
    vulnerabilityReport {
      scanDate
      vendor
    }
  }
}
    `;
export const GetReportFixesDocument = `
    query GetReportFixes($reportId: uuid!, $filters: fix_bool_exp = {}, $limit: Int!, $offset: Int!, $currentUserEmail: String!) {
  fixReport(where: {_and: [{id: {_eq: $reportId}}, {state: {_eq: Finished}}]}) {
    ...FixReportSummaryFields
  }
  expiredReport: fixReport(
    where: {_and: [{id: {_eq: $reportId}}, {state: {_eq: Expired}}]}
  ) {
    id
    expirationOn
  }
}
    ${FixReportSummaryFieldsFragmentDoc}`;
export const GetLatestReportByRepoUrlDocument = `
    query GetLatestReportByRepoUrl($repoUrl: String!, $filters: fix_bool_exp = {}, $limit: Int!, $offset: Int!, $currentUserEmail: String!) {
  fixReport(
    where: {_and: [{repo: {originalUrl: {_ilike: $repoUrl}}}, {state: {_eq: Finished}}, {vulnerabilityReport: {scanSource: {_neq: MCP}}}]}
    order_by: {createdOn: desc}
    limit: 1
  ) {
    ...FixReportSummaryFields
  }
  expiredReport: fixReport(
    where: {_and: [{repo: {originalUrl: {_ilike: $repoUrl}}}, {state: {_eq: Expired}}, {vulnerabilityReport: {scanSource: {_neq: MCP}}}]}
    order_by: {createdOn: desc}
    limit: 1
  ) {
    id
    expirationOn
  }
}
    ${FixReportSummaryFieldsFragmentDoc}`;
export const UpdateDownloadedFixDataDocument = `
    mutation updateDownloadedFixData($fixIds: [String!]!, $source: FixDownloadSource!) {
  updateDownloadedFixData(fixIds: $fixIds, source: $source) {
    status
  }
}
    `;
export const GetUserMvsAutoFixDocument = `
    query GetUserMvsAutoFix($userEmail: String!) {
  user_email_notification_settings(where: {user: {email: {_eq: $userEmail}}}) {
    mvs_auto_fix
  }
}
    `;
export const StreamBlameAiAnalysisRequestsDocument = `
    subscription streamBlameAiAnalysisRequests($requestIds: [uuid!]!) {
  blame_ai_analysis_request(where: {id: {_in: $requestIds}}) {
    id
    state
    commitId
    organizationId
    createdOn
  }
}
    `;
export const StreamCommitBlameRequestsDocument = `
    subscription streamCommitBlameRequests($requestIds: [uuid!]!) {
  commit_blame_request(where: {id: {_in: $requestIds}}) {
    id
    state
    organizationId
    repositoryUrl
    commitSha
    createdOn
    completedOn
    error
  }
}
    `;
export const ScanSkillDocument = `
    mutation ScanSkill($skillUrl: String!) {
  scanSkill(skillUrl: $skillUrl) {
    skillName
    skillHash
    skillVersion
    verdict
    findingsCount
    findings {
      category
      severity
      ruleId
      explanation
      evidence
      filePath
      lineNumber
      confidence
      layer
    }
    scanDurationMs
    layersExecuted
    cached
    summary
  }
}
    `;
export const SkillVerdictsByMd5Document = `
    query SkillVerdictsByMd5($md5s: [String!]!) {
  skillVerdictsByMd5(md5s: $md5s) {
    quarantineEnabled
    verdicts {
      md5
      verdict
      summary
      scannerName
      scannerVersion
      scannedAt
    }
  }
}
    `;
export const LogMvsEventDocument = `
    mutation LogMvsEvent($eventType: String!, $fixReportId: String, $projectId: String, $repoUrl: String, $riskCount: Int, $computerName: String, $computerUser: String, $clientVersion: String) {
  logMvsEvent(
    eventType: $eventType
    fixReportId: $fixReportId
    projectId: $projectId
    repoUrl: $repoUrl
    riskCount: $riskCount
    computerName: $computerName
    computerUser: $computerUser
    clientVersion: $clientVersion
  ) {
    status
  }
}
    `;
export const GetMvsProjectDocument = `
    mutation getMvsProject($organizationId: String!) {
  getMvsProject(organizationId: $organizationId) {
    projectId
  }
}
    `;
export const IssueTypesDocument = `
    query IssueTypes {
  issueTypes {
    value
    label
    issueDescription
    fixInstructions
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Me(variables?: MeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeQuery>({ document: MeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Me', 'query', variables);
    },
    getLastOrgAndNamedProject(variables: GetLastOrgAndNamedProjectQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLastOrgAndNamedProjectQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastOrgAndNamedProjectQuery>({ document: GetLastOrgAndNamedProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getLastOrgAndNamedProject', 'query', variables);
    },
    getLastOrg(variables: GetLastOrgQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLastOrgQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastOrgQuery>({ document: GetLastOrgDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getLastOrg', 'query', variables);
    },
    GetEncryptedApiToken(variables: GetEncryptedApiTokenQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetEncryptedApiTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEncryptedApiTokenQuery>({ document: GetEncryptedApiTokenDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetEncryptedApiToken', 'query', variables);
    },
    FixReportState(variables: FixReportStateQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FixReportStateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FixReportStateQuery>({ document: FixReportStateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'FixReportState', 'query', variables);
    },
    GetVulnerabilityReportPaths(variables: GetVulnerabilityReportPathsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetVulnerabilityReportPathsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVulnerabilityReportPathsQuery>({ document: GetVulnerabilityReportPathsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetVulnerabilityReportPaths', 'query', variables);
    },
    getAnalysisSubscription(variables: GetAnalysisSubscriptionSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAnalysisSubscriptionSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAnalysisSubscriptionSubscription>({ document: GetAnalysisSubscriptionDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getAnalysisSubscription', 'subscription', variables);
    },
    GetOrganizationId(variables?: GetOrganizationIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetOrganizationIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOrganizationIdQuery>({ document: GetOrganizationIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetOrganizationId', 'query', variables);
    },
    UpdateOrgScanPolicy(variables: UpdateOrgScanPolicyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateOrgScanPolicyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateOrgScanPolicyMutation>({ document: UpdateOrgScanPolicyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateOrgScanPolicy', 'mutation', variables);
    },
    GetReportFindingRuleIds(variables: GetReportFindingRuleIdsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetReportFindingRuleIdsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetReportFindingRuleIdsQuery>({ document: GetReportFindingRuleIdsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetReportFindingRuleIds', 'query', variables);
    },
    getGateVerdict(variables: GetGateVerdictQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetGateVerdictQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGateVerdictQuery>({ document: GetGateVerdictDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getGateVerdict', 'query', variables);
    },
    getAnalysis(variables: GetAnalysisQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAnalysisQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAnalysisQuery>({ document: GetAnalysisDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getAnalysis', 'query', variables);
    },
    getFixes(variables: GetFixesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFixesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFixesQuery>({ document: GetFixesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getFixes', 'query', variables);
    },
    getVulByNodesMetadata(variables: GetVulByNodesMetadataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetVulByNodesMetadataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVulByNodesMetadataQuery>({ document: GetVulByNodesMetadataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getVulByNodesMetadata', 'query', variables);
    },
    getFalsePositive(variables: GetFalsePositiveQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFalsePositiveQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFalsePositiveQuery>({ document: GetFalsePositiveDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getFalsePositive', 'query', variables);
    },
    updateScmToken(variables: UpdateScmTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateScmTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateScmTokenMutation>({ document: UpdateScmTokenDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateScmToken', 'mutation', variables);
    },
    uploadS3BucketInfo(variables: UploadS3BucketInfoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UploadS3BucketInfoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadS3BucketInfoMutation>({ document: UploadS3BucketInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'uploadS3BucketInfo', 'mutation', variables);
    },
    GetTracyDiffUploadUrl(variables: GetTracyDiffUploadUrlMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTracyDiffUploadUrlMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTracyDiffUploadUrlMutation>({ document: GetTracyDiffUploadUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetTracyDiffUploadUrl', 'mutation', variables);
    },
    AnalyzeCommitForExtensionAIBlame(variables: AnalyzeCommitForExtensionAiBlameMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AnalyzeCommitForExtensionAiBlameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AnalyzeCommitForExtensionAiBlameMutation>({ document: AnalyzeCommitForExtensionAiBlameDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AnalyzeCommitForExtensionAIBlame', 'mutation', variables);
    },
    GetAIBlameInference(variables?: GetAiBlameInferenceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAiBlameInferenceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAiBlameInferenceQuery>({ document: GetAiBlameInferenceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAIBlameInference', 'query', variables);
    },
    GetAIBlameAttributionPrompt(variables: GetAiBlameAttributionPromptQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAiBlameAttributionPromptQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAiBlameAttributionPromptQuery>({ document: GetAiBlameAttributionPromptDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAIBlameAttributionPrompt', 'query', variables);
    },
    GetPromptSummary(variables: GetPromptSummaryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPromptSummaryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPromptSummaryQuery>({ document: GetPromptSummaryDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPromptSummary', 'query', variables);
    },
    UploadAIBlameInferencesInit(variables: UploadAiBlameInferencesInitMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UploadAiBlameInferencesInitMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadAiBlameInferencesInitMutation>({ document: UploadAiBlameInferencesInitDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UploadAIBlameInferencesInit', 'mutation', variables);
    },
    FinalizeAIBlameInferencesUpload(variables: FinalizeAiBlameInferencesUploadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FinalizeAiBlameInferencesUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FinalizeAiBlameInferencesUploadMutation>({ document: FinalizeAiBlameInferencesUploadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'FinalizeAIBlameInferencesUpload', 'mutation', variables);
    },
    UploadTracyRecords(variables: UploadTracyRecordsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UploadTracyRecordsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadTracyRecordsMutation>({ document: UploadTracyRecordsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UploadTracyRecords', 'mutation', variables);
    },
    GetTracyRawDataUploadUrl(variables?: GetTracyRawDataUploadUrlMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTracyRawDataUploadUrlMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTracyRawDataUploadUrlMutation>({ document: GetTracyRawDataUploadUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetTracyRawDataUploadUrl', 'mutation', variables);
    },
    DigestVulnerabilityReport(variables: DigestVulnerabilityReportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DigestVulnerabilityReportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DigestVulnerabilityReportMutation>({ document: DigestVulnerabilityReportDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DigestVulnerabilityReport', 'mutation', variables);
    },
    SubmitVulnerabilityReport(variables: SubmitVulnerabilityReportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SubmitVulnerabilityReportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmitVulnerabilityReportMutation>({ document: SubmitVulnerabilityReportDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SubmitVulnerabilityReport', 'mutation', variables);
    },
    CreateCommunityUser(variables?: CreateCommunityUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCommunityUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCommunityUserMutation>({ document: CreateCommunityUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCommunityUser', 'mutation', variables);
    },
    CreateCliLogin(variables: CreateCliLoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCliLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCliLoginMutation>({ document: CreateCliLoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCliLogin', 'mutation', variables);
    },
    performCliLogin(variables: PerformCliLoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PerformCliLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PerformCliLoginMutation>({ document: PerformCliLoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'performCliLogin', 'mutation', variables);
    },
    SetQuarantineEnabled(variables: SetQuarantineEnabledMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SetQuarantineEnabledMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetQuarantineEnabledMutation>({ document: SetQuarantineEnabledDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SetQuarantineEnabled', 'mutation', variables);
    },
    CreateProject(variables: CreateProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProjectMutation>({ document: CreateProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateProject', 'mutation', variables);
    },
    validateRepoUrl(variables: ValidateRepoUrlQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ValidateRepoUrlQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateRepoUrlQuery>({ document: ValidateRepoUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'validateRepoUrl', 'query', variables);
    },
    gitReference(variables: GitReferenceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GitReferenceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GitReferenceQuery>({ document: GitReferenceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'gitReference', 'query', variables);
    },
    autoPrAnalysis(variables: AutoPrAnalysisMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AutoPrAnalysisMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AutoPrAnalysisMutation>({ document: AutoPrAnalysisDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'autoPrAnalysis', 'mutation', variables);
    },
    getFixWithAnswers(variables: GetFixWithAnswersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFixWithAnswersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFixWithAnswersQuery>({ document: GetFixWithAnswersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getFixWithAnswers', 'query', variables);
    },
    GetFixReportsByRepoUrl(variables: GetFixReportsByRepoUrlQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFixReportsByRepoUrlQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFixReportsByRepoUrlQuery>({ document: GetFixReportsByRepoUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFixReportsByRepoUrl', 'query', variables);
    },
    GetReportFixes(variables: GetReportFixesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetReportFixesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetReportFixesQuery>({ document: GetReportFixesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetReportFixes', 'query', variables);
    },
    GetLatestReportByRepoUrl(variables: GetLatestReportByRepoUrlQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLatestReportByRepoUrlQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestReportByRepoUrlQuery>({ document: GetLatestReportByRepoUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetLatestReportByRepoUrl', 'query', variables);
    },
    updateDownloadedFixData(variables: UpdateDownloadedFixDataMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateDownloadedFixDataMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDownloadedFixDataMutation>({ document: UpdateDownloadedFixDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateDownloadedFixData', 'mutation', variables);
    },
    GetUserMvsAutoFix(variables: GetUserMvsAutoFixQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetUserMvsAutoFixQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserMvsAutoFixQuery>({ document: GetUserMvsAutoFixDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetUserMvsAutoFix', 'query', variables);
    },
    streamBlameAiAnalysisRequests(variables: StreamBlameAiAnalysisRequestsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StreamBlameAiAnalysisRequestsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<StreamBlameAiAnalysisRequestsSubscription>({ document: StreamBlameAiAnalysisRequestsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'streamBlameAiAnalysisRequests', 'subscription', variables);
    },
    streamCommitBlameRequests(variables: StreamCommitBlameRequestsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StreamCommitBlameRequestsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<StreamCommitBlameRequestsSubscription>({ document: StreamCommitBlameRequestsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'streamCommitBlameRequests', 'subscription', variables);
    },
    ScanSkill(variables: ScanSkillMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ScanSkillMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ScanSkillMutation>({ document: ScanSkillDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ScanSkill', 'mutation', variables);
    },
    SkillVerdictsByMd5(variables: SkillVerdictsByMd5QueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SkillVerdictsByMd5Query> {
      return withWrapper((wrappedRequestHeaders) => client.request<SkillVerdictsByMd5Query>({ document: SkillVerdictsByMd5Document, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SkillVerdictsByMd5', 'query', variables);
    },
    LogMvsEvent(variables: LogMvsEventMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LogMvsEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogMvsEventMutation>({ document: LogMvsEventDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'LogMvsEvent', 'mutation', variables);
    },
    getMvsProject(variables: GetMvsProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMvsProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMvsProjectMutation>({ document: GetMvsProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getMvsProject', 'mutation', variables);
    },
    IssueTypes(variables?: IssueTypesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<IssueTypesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IssueTypesQuery>({ document: IssueTypesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'IssueTypes', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export * from './base-types';