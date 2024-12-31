import { GraphQLClient, RequestOptions } from 'graphql-request';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  Void: { input: any; output: any; }
  bigint: { input: any; output: any; }
  date: { input: any; output: any; }
  json: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  smallint: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

export type AddUserToOrganizationResponse = {
  __typename?: 'AddUserToOrganizationResponse';
  userId: Scalars['String']['output'];
};

export type AddUsersToProjectResponse = AddUsersToProjectSuccess | UserAlreadyInProjectError | UserInNotInTheOrganizationError;

export type AddUsersToProjectSuccess = {
  __typename?: 'AddUsersToProjectSuccess';
  status: Status;
};

export type AutoPrError = ScmBaseError & {
  __typename?: 'AutoPrError';
  error: Scalars['String']['output'];
  status: Status;
};

export type AutoPrResponse = AutoPrError | AutoPrSuccess;

export type AutoPrSuccess = {
  __typename?: 'AutoPrSuccess';
  appliedAutoPrIssueTypes: Array<Scalars['String']['output']>;
  status: Status;
};

export type BadScmCredentials = BaseError & {
  __typename?: 'BadScmCredentials';
  error?: Maybe<Scalars['String']['output']>;
  scmType?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type BadShaError = BaseError & {
  __typename?: 'BadShaError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type BaseError = {
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type BaseResponse = {
  __typename?: 'BaseResponse';
  status: Status;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type BrokerHostsType = {
  __typename?: 'BrokerHostsType';
  realDomain: Scalars['String']['output'];
  virtualDomain: Scalars['String']['output'];
};

export type CheckmarxProject = {
  __typename?: 'CheckmarxProject';
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  repoValid: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ClaimInvitationError = InvitationBaseError & {
  __typename?: 'ClaimInvitationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ClaimInvitationResponse = ClaimInvitationError | ClaimInvitationSuccess;

export type ClaimInvitationSuccess = {
  __typename?: 'ClaimInvitationSuccess';
  organizationId: Scalars['String']['output'];
  status: Status;
};

export type CreateBrokerApiTokenResponse = {
  __typename?: 'CreateBrokerApiTokenResponse';
  token: Scalars['String']['output'];
};

export type CreateOrUpdateRepositorySecretResponse = CreateOrUpdateRepositorySecretSuccess | ScmError;

export type CreateOrUpdateRepositorySecretSuccess = {
  __typename?: 'CreateOrUpdateRepositorySecretSuccess';
  status: Status;
};

export type CreatePrResponse = CreatePrSuccess | ScmError;

export type CreatePrSuccess = {
  __typename?: 'CreatePrSuccess';
  pullRequestUrl: Scalars['String']['output'];
  status: Status;
};

export type CreateProjectResponse = {
  __typename?: 'CreateProjectResponse';
  projectId: Scalars['String']['output'];
};

export type CreateTokenResponse = {
  __typename?: 'CreateTokenResponse';
  createdAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type FileDiffsResponse = {
  __typename?: 'FileDiffsResponse';
  downloadLink: Scalars['String']['output'];
  status: Status;
};

export type FilePayload = {
  __typename?: 'FilePayload';
  filePath: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FixData = {
  __typename?: 'FixData';
  extraContext: FixExtraContextResponse;
  patch: Scalars['String']['output'];
  patchOriginalEncodingBase64: Scalars['String']['output'];
  questions: Array<FixQuestion>;
};

export type FixExtraContextManifestActionRequiredResponse = {
  __typename?: 'FixExtraContextManifestActionRequiredResponse';
  action: ManifestAction;
  language: Language;
  lib: PackageInfoResponse;
  typesLib?: Maybe<PackageInfoResponse>;
};

export type FixExtraContextResponse = {
  __typename?: 'FixExtraContextResponse';
  extraContext: Array<UnstructuredFixExtraContext>;
  fixDescription: Scalars['String']['output'];
  manifestActionsRequired: Array<FixExtraContextManifestActionRequiredResponse>;
};

export type FixQuestion = {
  __typename?: 'FixQuestion';
  defaultValue: Scalars['String']['output'];
  extraContext: Array<UnstructuredFixExtraContext>;
  index: Scalars['Int']['output'];
  inputType: FixQuestionInputType;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options: Array<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export enum FixQuestionInputType {
  Number = 'NUMBER',
  Select = 'SELECT',
  Text = 'TEXT'
}

export type FixReportSubmitReport = {
  __typename?: 'FixReportSubmitReport';
  expirationOn: Scalars['String']['output'];
  repo?: Maybe<RepoSubmitReport>;
};

export enum FixerStatus {
  Error = 'ERROR',
  Ok = 'OK'
}

export type ForkRepoResponse = ForkRepoSuccess | ScmError;

export type ForkRepoSuccess = {
  __typename?: 'ForkRepoSuccess';
  status: Status;
  url: Scalars['String']['output'];
};

export type GetCheckmarxIntegrationDataError = {
  __typename?: 'GetCheckmarxIntegrationDataError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type GetCheckmarxIntegrationDataResponse = GetCheckmarxIntegrationDataError | GetCheckmarxIntegrationDataSuccess;

export type GetCheckmarxIntegrationDataSuccess = {
  __typename?: 'GetCheckmarxIntegrationDataSuccess';
  ast?: Maybe<Scalars['String']['output']>;
  astBaseAuthUrl?: Maybe<Scalars['String']['output']>;
  astBaseUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type GetCheckmarxProjectsError = {
  __typename?: 'GetCheckmarxProjectsError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type GetCheckmarxProjectsResponse = GetCheckmarxProjectsError | ListOfProjectsSuccess;

export type GetFixNoFixError = {
  __typename?: 'GetFixNoFixError';
  message: Scalars['String']['output'];
  status: FixerStatus;
};

export type GetGitBlameGoodResponse = {
  __typename?: 'GetGitBlameGoodResponse';
  email?: Maybe<Scalars['String']['output']>;
  login: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type GetGitBlameResponse = GetGitBlameGoodResponse | NoGitBlameInfoError | UrlNotConnectedToScmError;

export type GetReposSuccess = {
  __typename?: 'GetReposSuccess';
  repos: Array<ScmRepo>;
  status: Status;
};

export type GetScmReposResponse = GetReposSuccess | ScmAdminError | ScmError | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmRepoNoTokenAccessError | ScmUnsupportedScmTypeError;

export type GetSplitFixResponseUnion = GetFixNoFixError | SplitFixData;

export type GitReferenceData = {
  __typename?: 'GitReferenceData';
  date: Scalars['String']['output'];
  sha: Scalars['String']['output'];
  status: Status;
};

export type GitReferenceResponse = GitReferenceData | ReferenceNotFoundError | RepoUnreachableError;

export type InitOrganizationAndProjectGoodResponse = {
  __typename?: 'InitOrganizationAndProjectGoodResponse';
  organizationId: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type InitOrganizationAndProjectResponse = InitOrganizationAndProjectGoodResponse | UserAlreadyInProjectError | UserHasNoPermissionInProjectError;

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type InvalidRepoUrlError = BaseError & {
  __typename?: 'InvalidRepoUrlError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type InvalidScmTypeError = BaseError & {
  __typename?: 'InvalidScmTypeError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type InvitationBaseError = {
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export enum Language {
  Cpp = 'CPP',
  Csharp = 'CSHARP',
  Java = 'JAVA',
  Js = 'JS',
  Python = 'PYTHON',
  Sql = 'SQL',
  Xml = 'XML'
}

export type ListOfProjectsSuccess = {
  __typename?: 'ListOfProjectsSuccess';
  projects: Array<CheckmarxProject>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ListTokenResponse = {
  __typename?: 'ListTokenResponse';
  createdAt: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
};

export enum ManifestAction {
  Add = 'add',
  Relock = 'relock',
  Upgrade = 'upgrade'
}

export type MeContextResponse = {
  __typename?: 'MeContextResponse';
  email: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
};

export type MeResponse = {
  __typename?: 'MeResponse';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  scmConfigs: Array<Maybe<ScmConfig>>;
  userOrganizationsAndUserOrganizationRoles: Array<Maybe<OrganizationToRoleType>>;
};

export type NoGitBlameInfoError = {
  __typename?: 'NoGitBlameInfoError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type OrganizationToRoleType = {
  __typename?: 'OrganizationToRoleType';
  organization?: Maybe<OrganizationType>;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  brokerHosts: Array<Maybe<BrokerHostsType>>;
};

export enum PrStrategy {
  Condense = 'CONDENSE',
  Spread = 'SPREAD'
}

export type PackageInfoResponse = {
  __typename?: 'PackageInfoResponse';
  envName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export enum Projects {
  Altoroj = 'Altoroj',
  JuiceShop = 'JuiceShop',
  Webgoat = 'Webgoat'
}

export type QuestionAnswer = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type RabbitSendError = BaseError & {
  __typename?: 'RabbitSendError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ReferenceNotFoundError = BaseError & {
  __typename?: 'ReferenceNotFoundError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type RegisterUserResponse = FixData | GetFixNoFixError;

export type RepoSubmitReport = {
  __typename?: 'RepoSubmitReport';
  originalUrl: Scalars['String']['output'];
  reference: Scalars['String']['output'];
};

export type RepoUnreachableError = BaseError & {
  __typename?: 'RepoUnreachableError';
  error?: Maybe<Scalars['String']['output']>;
  scmType?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type RepoValidationError = BaseError & {
  __typename?: 'RepoValidationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type RepoValidationResponse = BadScmCredentials | InvalidRepoUrlError | RepoUnreachableError | RepoValidationSuccess;

export type RepoValidationSuccess = {
  __typename?: 'RepoValidationSuccess';
  defaultBranch: Scalars['String']['output'];
  defaultBranchLastModified: Scalars['String']['output'];
  defaultBranchSha: Scalars['String']['output'];
  scmType?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ReportValidationError = BaseError & {
  __typename?: 'ReportValidationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ResendInvitationResponse = {
  __typename?: 'ResendInvitationResponse';
  id: Scalars['String']['output'];
};

export type ScmAccessToken = {
  __typename?: 'SCMAccessToken';
  accessToken: Scalars['String']['output'];
};

export type SaveCheckmarxIntegrationError = {
  __typename?: 'SaveCheckmarxIntegrationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type SaveCheckmarxIntegrationResponse = SaveCheckmarxIntegrationError | SaveCheckmarxIntegrationSuccess;

export type SaveCheckmarxIntegrationSuccess = {
  __typename?: 'SaveCheckmarxIntegrationSuccess';
  status: Status;
};

export type ScmAccessTokenUpdateResponse = BadScmCredentials | InvalidScmTypeError | RepoUnreachableError | ScmAccessTokenUpdateSuccess;

export type ScmAccessTokenUpdateSuccess = {
  __typename?: 'ScmAccessTokenUpdateSuccess';
  id: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type ScmAdminError = ScmBaseError & {
  __typename?: 'ScmAdminError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export enum ScmApiSubmitRequestStatus {
  Closed = 'closed',
  Draft = 'draft',
  Merged = 'merged',
  Open = 'open'
}

export type ScmBaseError = {
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmCommitHashError = ScmBaseError & {
  __typename?: 'ScmCommitHashError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmConfig = {
  __typename?: 'ScmConfig';
  id: Scalars['String']['output'];
  isTokenAvailable: Scalars['Boolean']['output'];
  isTokenOauth: Scalars['Boolean']['output'];
  orgId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  scmOrg?: Maybe<Scalars['String']['output']>;
  scmType: Scalars['String']['output'];
  scmUrl: Scalars['String']['output'];
  scmUsername?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenLastUpdate?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type ScmError = ScmBaseError & {
  __typename?: 'ScmError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmGetSubmitRequestStatusResponse = ScmAdminError | ScmError | ScmGetSubmitRequestStatusSuccess | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmRepoNoTokenAccessError | ScmUnsupportedScmTypeError;

export type ScmGetSubmitRequestStatusSuccess = {
  __typename?: 'ScmGetSubmitRequestStatusSuccess';
  status: Status;
  submitRequestStatus: ScmApiSubmitRequestStatus;
};

export type ScmHasRepoPermissionsResponse = ScmAdminError | ScmError | ScmHasRepoPermissionsSuccess | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmUnsupportedScmTypeError;

export type ScmHasRepoPermissionsSuccess = {
  __typename?: 'ScmHasRepoPermissionsSuccess';
  HasRepoPermissions: Scalars['Boolean']['output'];
  status: Status;
};

export type ScmInvalidSubmitBranchNameError = ScmBaseError & {
  __typename?: 'ScmInvalidSubmitBranchNameError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmInvalidTargetBranchNameError = ScmBaseError & {
  __typename?: 'ScmInvalidTargetBranchNameError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmIsBranchExistsResponse = ScmAdminError | ScmError | ScmIsBranchExistsSuccess | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmRepoNoTokenAccessError | ScmUnsupportedScmTypeError;

export type ScmIsBranchExistsSuccess = {
  __typename?: 'ScmIsBranchExistsSuccess';
  isExists: Scalars['Boolean']['output'];
  status: Status;
};

export type ScmIsBranchValidNameResponse = ScmError | ScmIsBranchValidNameSuccess;

export type ScmIsBranchValidNameSuccess = {
  __typename?: 'ScmIsBranchValidNameSuccess';
  isValidName: Scalars['Boolean']['output'];
  status: Status;
};

export type ScmListBranchesResponse = ScmAdminError | ScmError | ScmListBranchesSuccess | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmRepoNoTokenAccessError | ScmUnsupportedScmTypeError;

export type ScmListBranchesSuccess = {
  __typename?: 'ScmListBranchesSuccess';
  branchList: Array<Scalars['String']['output']>;
  defaultBranch?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmNoFixesPermissionsError = ScmBaseError & {
  __typename?: 'ScmNoFixesPermissionsError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmNoProjectPermissionsError = ScmBaseError & {
  __typename?: 'ScmNoProjectPermissionsError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmNoScmTokenError = ScmBaseError & {
  __typename?: 'ScmNoScmTokenError';
  error?: Maybe<Scalars['String']['output']>;
  scmType: Scalars['String']['output'];
  status: Status;
};

export type ScmRepo = {
  __typename?: 'ScmRepo';
  repoIsPublic: Scalars['Boolean']['output'];
  repoLanguages: Array<Scalars['String']['output']>;
  repoName: Scalars['String']['output'];
  repoOwner: Scalars['String']['output'];
  repoUpdatedAt: Scalars['String']['output'];
  repoUrl: Scalars['String']['output'];
};

export type ScmRepoNoTokenAccessError = ScmBaseError & {
  __typename?: 'ScmRepoNoTokenAccessError';
  error?: Maybe<Scalars['String']['output']>;
  scmType: Scalars['String']['output'];
  status: Status;
};

export type ScmSubmitBranchAlreadyExistsError = ScmBaseError & {
  __typename?: 'ScmSubmitBranchAlreadyExistsError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmTargetBranchMissingError = ScmBaseError & {
  __typename?: 'ScmTargetBranchMissingError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmUnsupportedScmTypeError = ScmBaseError & {
  __typename?: 'ScmUnsupportedScmTypeError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ScmUserInfo = {
  __typename?: 'ScmUserInfo';
  username?: Maybe<Scalars['String']['output']>;
};

export type ScmValidateTokenResponse = ScmError | ScmRepoNoTokenAccessError | ScmValidateTokenSuccess;

export type ScmValidateTokenSuccess = {
  __typename?: 'ScmValidateTokenSuccess';
  scmConfigId: Scalars['String']['output'];
  scmType: Scalars['String']['output'];
  status: Status;
  userInfo: ScmUserInfo;
};

export type SendInvitationError = InvitationBaseError & {
  __typename?: 'SendInvitationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type SendInvitationResponse = SendInvitationError | SendInvitationSuccess;

export type SendInvitationSuccess = {
  __typename?: 'SendInvitationSuccess';
  invitationId: Scalars['String']['output'];
  status: Status;
};

export type SetAnswersResponse = {
  __typename?: 'SetAnswersResponse';
  status: FixerStatus;
};

export type SplitFixData = {
  __typename?: 'SplitFixData';
  extraContext: FixExtraContextResponse;
  patches: Array<Scalars['String']['output']>;
  patchesOriginalEncodingBase64: Array<Scalars['String']['output']>;
  questions: Array<FixQuestion>;
};

export enum Status {
  Error = 'Error',
  Ok = 'OK'
}

export type StatusQueryResponse = {
  __typename?: 'StatusQueryResponse';
  status: Status;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitCheckmarxVulnerabilityReportError = {
  __typename?: 'SubmitCheckmarxVulnerabilityReportError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type SubmitCheckmarxVulnerabilityReportResponse = SubmitCheckmarxVulnerabilityReportError | SubmitCheckmarxVulnerabilityReportSuccess;

export type SubmitCheckmarxVulnerabilityReportSuccess = {
  __typename?: 'SubmitCheckmarxVulnerabilityReportSuccess';
  projectId: Scalars['String']['output'];
  reportId: Scalars['String']['output'];
};

export type SubmitToScmResponse = ScmAdminError | ScmCommitHashError | ScmError | ScmInvalidSubmitBranchNameError | ScmInvalidTargetBranchNameError | ScmNoFixesPermissionsError | ScmNoProjectPermissionsError | ScmNoScmTokenError | ScmRepoNoTokenAccessError | ScmSubmitBranchAlreadyExistsError | ScmTargetBranchMissingError | ScmUnsupportedScmTypeError | SubmitToScmSuccess;

export type SubmitToScmSuccess = {
  __typename?: 'SubmitToScmSuccess';
  status: Status;
  submitFixRequestIds: Array<Scalars['String']['output']>;
};

export type UnstructuredFixExtraContext = {
  __typename?: 'UnstructuredFixExtraContext';
  key: Scalars['String']['output'];
  value: Scalars['JSON']['output'];
};

export type UpdateGithubTokenFromAuth0 = {
  __typename?: 'UpdateGithubTokenFromAuth0';
  status: Status;
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  error?: Maybe<Scalars['String']['output']>;
  repoUploadInfo?: Maybe<UploadResult>;
  status: Status;
  uploadInfo?: Maybe<UploadResult>;
};

export type UploadResult = {
  __typename?: 'UploadResult';
  fileName: Scalars['String']['output'];
  fixReportId: Scalars['String']['output'];
  uploadFieldsJSON: Scalars['String']['output'];
  uploadKey: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type UrlNotConnectedToScmError = {
  __typename?: 'UrlNotConnectedToScmError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type UserAlreadyInProjectError = {
  __typename?: 'UserAlreadyInProjectError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type UserHasNoPermissionInProjectError = {
  __typename?: 'UserHasNoPermissionInProjectError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type UserInNotInTheOrganizationError = {
  __typename?: 'UserInNotInTheOrganizationError';
  error?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export type ValidateCheckmarxConnectionError = {
  __typename?: 'ValidateCheckmarxConnectionError';
  error: Scalars['String']['output'];
  status: Status;
};

export type ValidateCheckmarxConnectionResponse = ValidateCheckmarxConnectionError | ValidateCheckmarxConnectionSuccess;

export type ValidateCheckmarxConnectionSuccess = {
  __typename?: 'ValidateCheckmarxConnectionSuccess';
  status: Status;
};

export type ValidateScmTokenResponse = BadScmCredentials | InvalidScmTypeError | ValidateScmTokenSuccess;

export type ValidateScmTokenSuccess = {
  __typename?: 'ValidateScmTokenSuccess';
  status: Status;
};

export type ValidationSuccess = {
  __typename?: 'ValidationSuccess';
  status: Status;
};

export enum Vendors {
  Checkmarx = 'Checkmarx',
  CodeQl = 'CodeQL',
  Fortify = 'Fortify',
  Semgrep = 'Semgrep',
  Snyk = 'Snyk',
  SonarQube = 'SonarQube'
}

export type VoteOnFixResponse = {
  __typename?: 'VoteOnFixResponse';
  status: Status;
};

export type VulnerabilityReport = {
  __typename?: 'VulnerabilityReport';
  fixReport: FixReportSubmitReport;
  fixReportId: Scalars['String']['output'];
  status: Status;
  vendor?: Maybe<Scalars['String']['output']>;
  vulnerabilityReportId: Scalars['String']['output'];
};

export type VulnerabilityReportResponse = BadShaError | RabbitSendError | ReferenceNotFoundError | RepoValidationError | ReportValidationError | VulnerabilityReport;

export type AggregatedUnexpiredVulnerabilitiesState_Organization_Args = {
  linear_vul_count_limit?: InputMaybe<Scalars['Int']['input']>;
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

export type AggregatedVulnerabilitiesState_Organization_Args = {
  linear_vul_count_limit?: InputMaybe<Scalars['Int']['input']>;
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

export type AggregatedVulnerabilitySeverities_Project_Args = {
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "aggregated_fix_state" */
export type Aggregated_Fix_State = {
  __typename?: 'aggregated_fix_state';
  count?: Maybe<Scalars['bigint']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "aggregated_fix_state" */
export type Aggregated_Fix_State_Aggregate = {
  __typename?: 'aggregated_fix_state_aggregate';
  aggregate?: Maybe<Aggregated_Fix_State_Aggregate_Fields>;
  nodes: Array<Aggregated_Fix_State>;
};

/** aggregate fields of "aggregated_fix_state" */
export type Aggregated_Fix_State_Aggregate_Fields = {
  __typename?: 'aggregated_fix_state_aggregate_fields';
  avg?: Maybe<Aggregated_Fix_State_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Aggregated_Fix_State_Max_Fields>;
  min?: Maybe<Aggregated_Fix_State_Min_Fields>;
  stddev?: Maybe<Aggregated_Fix_State_Stddev_Fields>;
  stddev_pop?: Maybe<Aggregated_Fix_State_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Aggregated_Fix_State_Stddev_Samp_Fields>;
  sum?: Maybe<Aggregated_Fix_State_Sum_Fields>;
  var_pop?: Maybe<Aggregated_Fix_State_Var_Pop_Fields>;
  var_samp?: Maybe<Aggregated_Fix_State_Var_Samp_Fields>;
  variance?: Maybe<Aggregated_Fix_State_Variance_Fields>;
};


/** aggregate fields of "aggregated_fix_state" */
export type Aggregated_Fix_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Aggregated_Fix_State_Avg_Fields = {
  __typename?: 'aggregated_fix_state_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "aggregated_fix_state". All fields are combined with a logical 'AND'. */
export type Aggregated_Fix_State_Bool_Exp = {
  _and?: InputMaybe<Array<Aggregated_Fix_State_Bool_Exp>>;
  _not?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
  _or?: InputMaybe<Array<Aggregated_Fix_State_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Aggregated_Fix_State_Max_Fields = {
  __typename?: 'aggregated_fix_state_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Aggregated_Fix_State_Min_Fields = {
  __typename?: 'aggregated_fix_state_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "aggregated_fix_state". */
export type Aggregated_Fix_State_Order_By = {
  count?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** select columns of table "aggregated_fix_state" */
export enum Aggregated_Fix_State_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  State = 'state'
}

/** aggregate stddev on columns */
export type Aggregated_Fix_State_Stddev_Fields = {
  __typename?: 'aggregated_fix_state_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Aggregated_Fix_State_Stddev_Pop_Fields = {
  __typename?: 'aggregated_fix_state_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Aggregated_Fix_State_Stddev_Samp_Fields = {
  __typename?: 'aggregated_fix_state_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "aggregated_fix_state" */
export type Aggregated_Fix_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Aggregated_Fix_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Aggregated_Fix_State_Stream_Cursor_Value_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Aggregated_Fix_State_Sum_Fields = {
  __typename?: 'aggregated_fix_state_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Aggregated_Fix_State_Var_Pop_Fields = {
  __typename?: 'aggregated_fix_state_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Aggregated_Fix_State_Var_Samp_Fields = {
  __typename?: 'aggregated_fix_state_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Aggregated_Fix_State_Variance_Fields = {
  __typename?: 'aggregated_fix_state_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "aggregated_severities" */
export type Aggregated_Severities = {
  __typename?: 'aggregated_severities';
  count?: Maybe<Scalars['bigint']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "aggregated_severities" */
export type Aggregated_Severities_Aggregate = {
  __typename?: 'aggregated_severities_aggregate';
  aggregate?: Maybe<Aggregated_Severities_Aggregate_Fields>;
  nodes: Array<Aggregated_Severities>;
};

/** aggregate fields of "aggregated_severities" */
export type Aggregated_Severities_Aggregate_Fields = {
  __typename?: 'aggregated_severities_aggregate_fields';
  avg?: Maybe<Aggregated_Severities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Aggregated_Severities_Max_Fields>;
  min?: Maybe<Aggregated_Severities_Min_Fields>;
  stddev?: Maybe<Aggregated_Severities_Stddev_Fields>;
  stddev_pop?: Maybe<Aggregated_Severities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Aggregated_Severities_Stddev_Samp_Fields>;
  sum?: Maybe<Aggregated_Severities_Sum_Fields>;
  var_pop?: Maybe<Aggregated_Severities_Var_Pop_Fields>;
  var_samp?: Maybe<Aggregated_Severities_Var_Samp_Fields>;
  variance?: Maybe<Aggregated_Severities_Variance_Fields>;
};


/** aggregate fields of "aggregated_severities" */
export type Aggregated_Severities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "aggregated_severities" */
export type Aggregated_Severities_Aggregate_Order_By = {
  avg?: InputMaybe<Aggregated_Severities_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Aggregated_Severities_Max_Order_By>;
  min?: InputMaybe<Aggregated_Severities_Min_Order_By>;
  stddev?: InputMaybe<Aggregated_Severities_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Aggregated_Severities_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Aggregated_Severities_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Aggregated_Severities_Sum_Order_By>;
  var_pop?: InputMaybe<Aggregated_Severities_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Aggregated_Severities_Var_Samp_Order_By>;
  variance?: InputMaybe<Aggregated_Severities_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Aggregated_Severities_Avg_Fields = {
  __typename?: 'aggregated_severities_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Avg_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "aggregated_severities". All fields are combined with a logical 'AND'. */
export type Aggregated_Severities_Bool_Exp = {
  _and?: InputMaybe<Array<Aggregated_Severities_Bool_Exp>>;
  _not?: InputMaybe<Aggregated_Severities_Bool_Exp>;
  _or?: InputMaybe<Array<Aggregated_Severities_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  vulnerability_severity?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Aggregated_Severities_Max_Fields = {
  __typename?: 'aggregated_severities_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Max_Order_By = {
  count?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Aggregated_Severities_Min_Fields = {
  __typename?: 'aggregated_severities_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Min_Order_By = {
  count?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "aggregated_severities". */
export type Aggregated_Severities_Order_By = {
  count?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** select columns of table "aggregated_severities" */
export enum Aggregated_Severities_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  VulnerabilitySeverity = 'vulnerability_severity'
}

/** aggregate stddev on columns */
export type Aggregated_Severities_Stddev_Fields = {
  __typename?: 'aggregated_severities_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Stddev_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Aggregated_Severities_Stddev_Pop_Fields = {
  __typename?: 'aggregated_severities_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Stddev_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Aggregated_Severities_Stddev_Samp_Fields = {
  __typename?: 'aggregated_severities_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Stddev_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "aggregated_severities" */
export type Aggregated_Severities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Aggregated_Severities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Aggregated_Severities_Stream_Cursor_Value_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  vulnerability_severity?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Aggregated_Severities_Sum_Fields = {
  __typename?: 'aggregated_severities_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Sum_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Aggregated_Severities_Var_Pop_Fields = {
  __typename?: 'aggregated_severities_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Var_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Aggregated_Severities_Var_Samp_Fields = {
  __typename?: 'aggregated_severities_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Var_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Aggregated_Severities_Variance_Fields = {
  __typename?: 'aggregated_severities_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "aggregated_severities" */
export type Aggregated_Severities_Variance_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** columns and relationships of "api_token" */
export type Api_Token = {
  __typename?: 'api_token';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  name?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "api_token" */
export type Api_Token_Aggregate = {
  __typename?: 'api_token_aggregate';
  aggregate?: Maybe<Api_Token_Aggregate_Fields>;
  nodes: Array<Api_Token>;
};

export type Api_Token_Aggregate_Bool_Exp = {
  count?: InputMaybe<Api_Token_Aggregate_Bool_Exp_Count>;
};

export type Api_Token_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Api_Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Api_Token_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "api_token" */
export type Api_Token_Aggregate_Fields = {
  __typename?: 'api_token_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Api_Token_Max_Fields>;
  min?: Maybe<Api_Token_Min_Fields>;
};


/** aggregate fields of "api_token" */
export type Api_Token_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Api_Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "api_token" */
export type Api_Token_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Api_Token_Max_Order_By>;
  min?: InputMaybe<Api_Token_Min_Order_By>;
};

/** input type for inserting array relation for remote table "api_token" */
export type Api_Token_Arr_Rel_Insert_Input = {
  data: Array<Api_Token_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Api_Token_On_Conflict>;
};

/** Boolean expression to filter rows from the table "api_token". All fields are combined with a logical 'AND'. */
export type Api_Token_Bool_Exp = {
  _and?: InputMaybe<Array<Api_Token_Bool_Exp>>;
  _not?: InputMaybe<Api_Token_Bool_Exp>;
  _or?: InputMaybe<Array<Api_Token_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "api_token" */
export enum Api_Token_Constraint {
  /** unique or primary key constraint on columns "id" */
  ApiTokenPkey = 'api_token_pkey',
  /** unique or primary key constraint on columns "token" */
  ApiTokenTokenKey = 'api_token_token_key'
}

/** input type for inserting data into table "api_token" */
export type Api_Token_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Api_Token_Max_Fields = {
  __typename?: 'api_token_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "api_token" */
export type Api_Token_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Api_Token_Min_Fields = {
  __typename?: 'api_token_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "api_token" */
export type Api_Token_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "api_token" */
export type Api_Token_Mutation_Response = {
  __typename?: 'api_token_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Api_Token>;
};

/** on_conflict condition type for table "api_token" */
export type Api_Token_On_Conflict = {
  constraint: Api_Token_Constraint;
  update_columns?: Array<Api_Token_Update_Column>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};

/** Ordering options when selecting data from "api_token". */
export type Api_Token_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: api_token */
export type Api_Token_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "api_token" */
export enum Api_Token_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Token = 'token',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "api_token" */
export type Api_Token_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "api_token" */
export type Api_Token_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Api_Token_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Api_Token_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "api_token" */
export enum Api_Token_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Token = 'token',
  /** column name */
  UserId = 'user_id'
}

export type Api_Token_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Api_Token_Set_Input>;
  /** filter the rows which have to be updated */
  where: Api_Token_Bool_Exp;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "broker_host" */
export type Broker_Host = {
  __typename?: 'broker_host';
  /** An array relationship */
  brokerTokens: Array<Broker_Token>;
  /** An aggregate relationship */
  brokerTokens_aggregate: Broker_Token_Aggregate;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
  realDomain: Scalars['String']['output'];
  scmType?: Maybe<Submit_Fix_Request_Scm_Type_Enum>;
  virtualDomain: Scalars['uuid']['output'];
};


/** columns and relationships of "broker_host" */
export type Broker_HostBrokerTokensArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


/** columns and relationships of "broker_host" */
export type Broker_HostBrokerTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};

/** aggregated selection of "broker_host" */
export type Broker_Host_Aggregate = {
  __typename?: 'broker_host_aggregate';
  aggregate?: Maybe<Broker_Host_Aggregate_Fields>;
  nodes: Array<Broker_Host>;
};

export type Broker_Host_Aggregate_Bool_Exp = {
  count?: InputMaybe<Broker_Host_Aggregate_Bool_Exp_Count>;
};

export type Broker_Host_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Broker_Host_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Broker_Host_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "broker_host" */
export type Broker_Host_Aggregate_Fields = {
  __typename?: 'broker_host_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Broker_Host_Max_Fields>;
  min?: Maybe<Broker_Host_Min_Fields>;
};


/** aggregate fields of "broker_host" */
export type Broker_Host_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Broker_Host_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "broker_host" */
export type Broker_Host_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Broker_Host_Max_Order_By>;
  min?: InputMaybe<Broker_Host_Min_Order_By>;
};

/** input type for inserting array relation for remote table "broker_host" */
export type Broker_Host_Arr_Rel_Insert_Input = {
  data: Array<Broker_Host_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Broker_Host_On_Conflict>;
};

/** Boolean expression to filter rows from the table "broker_host". All fields are combined with a logical 'AND'. */
export type Broker_Host_Bool_Exp = {
  _and?: InputMaybe<Array<Broker_Host_Bool_Exp>>;
  _not?: InputMaybe<Broker_Host_Bool_Exp>;
  _or?: InputMaybe<Array<Broker_Host_Bool_Exp>>;
  brokerTokens?: InputMaybe<Broker_Token_Bool_Exp>;
  brokerTokens_aggregate?: InputMaybe<Broker_Token_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  realDomain?: InputMaybe<String_Comparison_Exp>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum_Comparison_Exp>;
  virtualDomain?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "broker_host" */
export enum Broker_Host_Constraint {
  /** unique or primary key constraint on columns "id" */
  BrokerHostIdKey = 'broker_host_id_key',
  /** unique or primary key constraint on columns "organization_id", "real_domain" */
  BrokerHostOrganizationIdRealDomainKey = 'broker_host_organization_id_real_domain_key',
  /** unique or primary key constraint on columns "id" */
  BrokerHostPkey = 'broker_host_pkey',
  /** unique or primary key constraint on columns "virtual_domain" */
  BrokerHostVirtualDomainKey = 'broker_host_virtual_domain_key'
}

/** input type for inserting data into table "broker_host" */
export type Broker_Host_Insert_Input = {
  brokerTokens?: InputMaybe<Broker_Token_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  realDomain?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  virtualDomain?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Broker_Host_Max_Fields = {
  __typename?: 'broker_host_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  realDomain?: Maybe<Scalars['String']['output']>;
  virtualDomain?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "broker_host" */
export type Broker_Host_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  realDomain?: InputMaybe<Order_By>;
  virtualDomain?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Broker_Host_Min_Fields = {
  __typename?: 'broker_host_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  realDomain?: Maybe<Scalars['String']['output']>;
  virtualDomain?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "broker_host" */
export type Broker_Host_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  realDomain?: InputMaybe<Order_By>;
  virtualDomain?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "broker_host" */
export type Broker_Host_Mutation_Response = {
  __typename?: 'broker_host_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Broker_Host>;
};

/** input type for inserting object relation for remote table "broker_host" */
export type Broker_Host_Obj_Rel_Insert_Input = {
  data: Broker_Host_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Broker_Host_On_Conflict>;
};

/** on_conflict condition type for table "broker_host" */
export type Broker_Host_On_Conflict = {
  constraint: Broker_Host_Constraint;
  update_columns?: Array<Broker_Host_Update_Column>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};

/** Ordering options when selecting data from "broker_host". */
export type Broker_Host_Order_By = {
  brokerTokens_aggregate?: InputMaybe<Broker_Token_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  realDomain?: InputMaybe<Order_By>;
  scmType?: InputMaybe<Order_By>;
  virtualDomain?: InputMaybe<Order_By>;
};

/** primary key columns input for table: broker_host */
export type Broker_Host_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "broker_host" */
export enum Broker_Host_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  RealDomain = 'realDomain',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  VirtualDomain = 'virtualDomain'
}

/** input type for updating data in table "broker_host" */
export type Broker_Host_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  realDomain?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  virtualDomain?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "broker_host" */
export type Broker_Host_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Broker_Host_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Broker_Host_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  realDomain?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  virtualDomain?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "broker_host" */
export enum Broker_Host_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  RealDomain = 'realDomain',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  VirtualDomain = 'virtualDomain'
}

export type Broker_Host_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Broker_Host_Set_Input>;
  /** filter the rows which have to be updated */
  where: Broker_Host_Bool_Exp;
};

/** columns and relationships of "broker_token" */
export type Broker_Token = {
  __typename?: 'broker_token';
  /** An object relationship */
  brokerHost: Broker_Host;
  brokerHostId: Scalars['uuid']['output'];
  createdOn: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  token: Scalars['String']['output'];
  tokenName: Scalars['String']['output'];
};

/** aggregated selection of "broker_token" */
export type Broker_Token_Aggregate = {
  __typename?: 'broker_token_aggregate';
  aggregate?: Maybe<Broker_Token_Aggregate_Fields>;
  nodes: Array<Broker_Token>;
};

export type Broker_Token_Aggregate_Bool_Exp = {
  count?: InputMaybe<Broker_Token_Aggregate_Bool_Exp_Count>;
};

export type Broker_Token_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Broker_Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Broker_Token_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "broker_token" */
export type Broker_Token_Aggregate_Fields = {
  __typename?: 'broker_token_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Broker_Token_Max_Fields>;
  min?: Maybe<Broker_Token_Min_Fields>;
};


/** aggregate fields of "broker_token" */
export type Broker_Token_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Broker_Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "broker_token" */
export type Broker_Token_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Broker_Token_Max_Order_By>;
  min?: InputMaybe<Broker_Token_Min_Order_By>;
};

/** input type for inserting array relation for remote table "broker_token" */
export type Broker_Token_Arr_Rel_Insert_Input = {
  data: Array<Broker_Token_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Broker_Token_On_Conflict>;
};

/** Boolean expression to filter rows from the table "broker_token". All fields are combined with a logical 'AND'. */
export type Broker_Token_Bool_Exp = {
  _and?: InputMaybe<Array<Broker_Token_Bool_Exp>>;
  _not?: InputMaybe<Broker_Token_Bool_Exp>;
  _or?: InputMaybe<Array<Broker_Token_Bool_Exp>>;
  brokerHost?: InputMaybe<Broker_Host_Bool_Exp>;
  brokerHostId?: InputMaybe<Uuid_Comparison_Exp>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  tokenName?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "broker_token" */
export enum Broker_Token_Constraint {
  /** unique or primary key constraint on columns "id" */
  BrokerTokenPkey = 'broker_token_pkey',
  /** unique or primary key constraint on columns "token" */
  BrokerTokenTokenKey = 'broker_token_token_key'
}

/** input type for inserting data into table "broker_token" */
export type Broker_Token_Insert_Input = {
  brokerHost?: InputMaybe<Broker_Host_Obj_Rel_Insert_Input>;
  brokerHostId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenName?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Broker_Token_Max_Fields = {
  __typename?: 'broker_token_max_fields';
  brokerHostId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenName?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "broker_token" */
export type Broker_Token_Max_Order_By = {
  brokerHostId?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenName?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Broker_Token_Min_Fields = {
  __typename?: 'broker_token_min_fields';
  brokerHostId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenName?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "broker_token" */
export type Broker_Token_Min_Order_By = {
  brokerHostId?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenName?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "broker_token" */
export type Broker_Token_Mutation_Response = {
  __typename?: 'broker_token_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Broker_Token>;
};

/** on_conflict condition type for table "broker_token" */
export type Broker_Token_On_Conflict = {
  constraint: Broker_Token_Constraint;
  update_columns?: Array<Broker_Token_Update_Column>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};

/** Ordering options when selecting data from "broker_token". */
export type Broker_Token_Order_By = {
  brokerHost?: InputMaybe<Broker_Host_Order_By>;
  brokerHostId?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenName?: InputMaybe<Order_By>;
};

/** primary key columns input for table: broker_token */
export type Broker_Token_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "broker_token" */
export enum Broker_Token_Select_Column {
  /** column name */
  BrokerHostId = 'brokerHostId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  Token = 'token',
  /** column name */
  TokenName = 'tokenName'
}

/** input type for updating data in table "broker_token" */
export type Broker_Token_Set_Input = {
  brokerHostId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenName?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "broker_token" */
export type Broker_Token_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Broker_Token_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Broker_Token_Stream_Cursor_Value_Input = {
  brokerHostId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenName?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "broker_token" */
export enum Broker_Token_Update_Column {
  /** column name */
  BrokerHostId = 'brokerHostId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  Token = 'token',
  /** column name */
  TokenName = 'tokenName'
}

export type Broker_Token_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Broker_Token_Set_Input>;
  /** filter the rows which have to be updated */
  where: Broker_Token_Bool_Exp;
};

/** columns and relationships of "cli_login" */
export type Cli_Login = {
  __typename?: 'cli_login';
  createdOn: Scalars['timestamptz']['output'];
  encryptedApiToken?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  publicKey: Scalars['String']['output'];
};

/** aggregated selection of "cli_login" */
export type Cli_Login_Aggregate = {
  __typename?: 'cli_login_aggregate';
  aggregate?: Maybe<Cli_Login_Aggregate_Fields>;
  nodes: Array<Cli_Login>;
};

/** aggregate fields of "cli_login" */
export type Cli_Login_Aggregate_Fields = {
  __typename?: 'cli_login_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Cli_Login_Max_Fields>;
  min?: Maybe<Cli_Login_Min_Fields>;
};


/** aggregate fields of "cli_login" */
export type Cli_Login_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cli_Login_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "cli_login". All fields are combined with a logical 'AND'. */
export type Cli_Login_Bool_Exp = {
  _and?: InputMaybe<Array<Cli_Login_Bool_Exp>>;
  _not?: InputMaybe<Cli_Login_Bool_Exp>;
  _or?: InputMaybe<Array<Cli_Login_Bool_Exp>>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  encryptedApiToken?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  publicKey?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "cli_login" */
export enum Cli_Login_Constraint {
  /** unique or primary key constraint on columns "id" */
  CliLoginPkey = 'cli_login_pkey'
}

/** input type for inserting data into table "cli_login" */
export type Cli_Login_Insert_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptedApiToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  publicKey?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Cli_Login_Max_Fields = {
  __typename?: 'cli_login_max_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  encryptedApiToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  publicKey?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Cli_Login_Min_Fields = {
  __typename?: 'cli_login_min_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  encryptedApiToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  publicKey?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "cli_login" */
export type Cli_Login_Mutation_Response = {
  __typename?: 'cli_login_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cli_Login>;
};

/** on_conflict condition type for table "cli_login" */
export type Cli_Login_On_Conflict = {
  constraint: Cli_Login_Constraint;
  update_columns?: Array<Cli_Login_Update_Column>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};

/** Ordering options when selecting data from "cli_login". */
export type Cli_Login_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  encryptedApiToken?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  publicKey?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cli_login */
export type Cli_Login_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "cli_login" */
export enum Cli_Login_Select_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  EncryptedApiToken = 'encryptedApiToken',
  /** column name */
  Id = 'id',
  /** column name */
  PublicKey = 'publicKey'
}

/** input type for updating data in table "cli_login" */
export type Cli_Login_Set_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptedApiToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  publicKey?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "cli_login" */
export type Cli_Login_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cli_Login_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cli_Login_Stream_Cursor_Value_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptedApiToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  publicKey?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "cli_login" */
export enum Cli_Login_Update_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  EncryptedApiToken = 'encryptedApiToken',
  /** column name */
  Id = 'id',
  /** column name */
  PublicKey = 'publicKey'
}

export type Cli_Login_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cli_Login_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cli_Login_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** columns and relationships of "effort_to_apply_fix" */
export type Effort_To_Apply_Fix = {
  __typename?: 'effort_to_apply_fix';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Aggregate = {
  __typename?: 'effort_to_apply_fix_aggregate';
  aggregate?: Maybe<Effort_To_Apply_Fix_Aggregate_Fields>;
  nodes: Array<Effort_To_Apply_Fix>;
};

/** aggregate fields of "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Aggregate_Fields = {
  __typename?: 'effort_to_apply_fix_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Effort_To_Apply_Fix_Max_Fields>;
  min?: Maybe<Effort_To_Apply_Fix_Min_Fields>;
};


/** aggregate fields of "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Effort_To_Apply_Fix_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "effort_to_apply_fix". All fields are combined with a logical 'AND'. */
export type Effort_To_Apply_Fix_Bool_Exp = {
  _and?: InputMaybe<Array<Effort_To_Apply_Fix_Bool_Exp>>;
  _not?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
  _or?: InputMaybe<Array<Effort_To_Apply_Fix_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "effort_to_apply_fix" */
export enum Effort_To_Apply_Fix_Constraint {
  /** unique or primary key constraint on columns "value" */
  EffortToApplyFixPkey = 'effort_to_apply_fix_pkey'
}

export enum Effort_To_Apply_Fix_Enum {
  /** Easy fix to be apply */
  Easy = 'EASY',
  /** Hard to apply fix */
  Hard = 'HARD',
  /** Moderate effort to apply fix */
  Moderate = 'MODERATE'
}

/** Boolean expression to compare columns of type "effort_to_apply_fix_enum". All fields are combined with logical 'AND'. */
export type Effort_To_Apply_Fix_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Effort_To_Apply_Fix_Enum>;
  _in?: InputMaybe<Array<Effort_To_Apply_Fix_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Effort_To_Apply_Fix_Enum>;
  _nin?: InputMaybe<Array<Effort_To_Apply_Fix_Enum>>;
};

/** input type for inserting data into table "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Effort_To_Apply_Fix_Max_Fields = {
  __typename?: 'effort_to_apply_fix_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Effort_To_Apply_Fix_Min_Fields = {
  __typename?: 'effort_to_apply_fix_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Mutation_Response = {
  __typename?: 'effort_to_apply_fix_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Effort_To_Apply_Fix>;
};

/** on_conflict condition type for table "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_On_Conflict = {
  constraint: Effort_To_Apply_Fix_Constraint;
  update_columns?: Array<Effort_To_Apply_Fix_Update_Column>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};

/** Ordering options when selecting data from "effort_to_apply_fix". */
export type Effort_To_Apply_Fix_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: effort_to_apply_fix */
export type Effort_To_Apply_Fix_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "effort_to_apply_fix" */
export enum Effort_To_Apply_Fix_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "effort_to_apply_fix" */
export type Effort_To_Apply_Fix_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Effort_To_Apply_Fix_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Effort_To_Apply_Fix_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "effort_to_apply_fix" */
export enum Effort_To_Apply_Fix_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Effort_To_Apply_Fix_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Effort_To_Apply_Fix_Set_Input>;
  /** filter the rows which have to be updated */
  where: Effort_To_Apply_Fix_Bool_Exp;
};

/** columns and relationships of "file" */
export type File = {
  __typename?: 'file';
  /** An object relationship */
  fixByFileInfoFile?: Maybe<Fix>;
  /** An object relationship */
  fixByPatchFile?: Maybe<Fix>;
  /** An object relationship */
  fixFileByOriginalFile?: Maybe<FixFile>;
  id: Scalars['uuid']['output'];
  path: Scalars['String']['output'];
  /** An object relationship */
  repoByArchiveFile?: Maybe<Repo>;
  signedFile?: Maybe<FilePayload>;
  /** An object relationship */
  vulnerabilityReport?: Maybe<Vulnerability_Report>;
};

/** aggregated selection of "file" */
export type File_Aggregate = {
  __typename?: 'file_aggregate';
  aggregate?: Maybe<File_Aggregate_Fields>;
  nodes: Array<File>;
};

/** aggregate fields of "file" */
export type File_Aggregate_Fields = {
  __typename?: 'file_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<File_Max_Fields>;
  min?: Maybe<File_Min_Fields>;
};


/** aggregate fields of "file" */
export type File_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<File_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "file". All fields are combined with a logical 'AND'. */
export type File_Bool_Exp = {
  _and?: InputMaybe<Array<File_Bool_Exp>>;
  _not?: InputMaybe<File_Bool_Exp>;
  _or?: InputMaybe<Array<File_Bool_Exp>>;
  fixByFileInfoFile?: InputMaybe<Fix_Bool_Exp>;
  fixByPatchFile?: InputMaybe<Fix_Bool_Exp>;
  fixFileByOriginalFile?: InputMaybe<FixFile_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  repoByArchiveFile?: InputMaybe<Repo_Bool_Exp>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};

/** unique or primary key constraints on table "file" */
export enum File_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "file" */
export type File_Insert_Input = {
  fixByFileInfoFile?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixByPatchFile?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixFileByOriginalFile?: InputMaybe<FixFile_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  repoByArchiveFile?: InputMaybe<Repo_Obj_Rel_Insert_Input>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type File_Max_Fields = {
  __typename?: 'file_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type File_Min_Fields = {
  __typename?: 'file_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "file" */
export type File_Mutation_Response = {
  __typename?: 'file_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<File>;
};

/** input type for inserting object relation for remote table "file" */
export type File_Obj_Rel_Insert_Input = {
  data: File_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<File_On_Conflict>;
};

/** on_conflict condition type for table "file" */
export type File_On_Conflict = {
  constraint: File_Constraint;
  update_columns?: Array<File_Update_Column>;
  where?: InputMaybe<File_Bool_Exp>;
};

/** Ordering options when selecting data from "file". */
export type File_Order_By = {
  fixByFileInfoFile?: InputMaybe<Fix_Order_By>;
  fixByPatchFile?: InputMaybe<Fix_Order_By>;
  fixFileByOriginalFile?: InputMaybe<FixFile_Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  repoByArchiveFile?: InputMaybe<Repo_Order_By>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Order_By>;
};

/** primary key columns input for table: file */
export type File_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "file" */
export enum File_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Path = 'path'
}

/** input type for updating data in table "file" */
export type File_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "file" */
export type File_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: File_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type File_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "file" */
export enum File_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Path = 'path'
}

export type File_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<File_Set_Input>;
  /** filter the rows which have to be updated */
  where: File_Bool_Exp;
};

/** columns and relationships of "fix" */
export type Fix = {
  __typename?: 'fix';
  confidence: Scalars['Int']['output'];
  created_on?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  downloadedBy?: Maybe<User>;
  downloadedByUserId?: Maybe<Scalars['uuid']['output']>;
  effortToApplyFix?: Maybe<Effort_To_Apply_Fix_Enum>;
  /** An array relationship */
  fixAnswers: Array<FixAnswer>;
  /** An aggregate relationship */
  fixAnswers_aggregate: FixAnswer_Aggregate;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  fixFiles: Array<FixFile>;
  /** An aggregate relationship */
  fixFiles_aggregate: FixFile_Aggregate;
  /** An object relationship */
  fixInfoFile?: Maybe<File>;
  fixInfoFileId?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  fixRatings: Array<Fix_Rating>;
  /** An aggregate relationship */
  fixRatings_aggregate: Fix_Rating_Aggregate;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  fixReport?: Maybe<FixReport>;
  fixReportId?: Maybe<Scalars['uuid']['output']>;
  gitBlameLogin?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  isExpired: Scalars['Boolean']['output'];
  issueLanguage?: Maybe<IssueLanguage_Enum>;
  issueType?: Maybe<IssueType_Enum>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  patchAndQuestions: RegisterUserResponse;
  /** An object relationship */
  patchFile?: Maybe<File>;
  /** this a deprecated relationship */
  patchFileId?: Maybe<Scalars['uuid']['output']>;
  /** A computed field, executes function "get_issue_language" */
  safeIssueLanguage?: Maybe<Scalars['String']['output']>;
  /** Returns the issue type for a given fix. If the issue_type is null in the fix, it fetches the issue_type from the related vulnerability_report_issue. */
  safeIssueType?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  scmSubmitFixRequests: Array<Fix_To_Scm_Submit_Fix_Request>;
  /** An aggregate relationship */
  scmSubmitFixRequests_aggregate: Fix_To_Scm_Submit_Fix_Request_Aggregate;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
  splitPatchAndQuestions: GetSplitFixResponseUnion;
  state: Fix_State_Enum;
  /** An array relationship */
  submitFixRequests: Array<Fix_To_Submit_Fix_Request>;
  /** An aggregate relationship */
  submitFixRequests_aggregate: Fix_To_Submit_Fix_Request_Aggregate;
  /** An array relationship */
  vulnerabilityReportIssues: Array<Vulnerability_Report_Issue>;
  /** An aggregate relationship */
  vulnerabilityReportIssues_aggregate: Vulnerability_Report_Issue_Aggregate;
  vulnerabilitySeverity?: Maybe<Vulnerability_Severity_Enum>;
};


/** columns and relationships of "fix" */
export type FixFixAnswersArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixFixAnswers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixFixFilesArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixFixFiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixFixRatingsArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixFixRatings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixPatchAndQuestionsArgs = {
  userInput?: InputMaybe<Array<QuestionAnswer>>;
};


/** columns and relationships of "fix" */
export type FixScmSubmitFixRequestsArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixScmSubmitFixRequests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixSplitPatchAndQuestionsArgs = {
  userInput?: InputMaybe<Array<QuestionAnswer>>;
};


/** columns and relationships of "fix" */
export type FixSubmitFixRequestsArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixSubmitFixRequests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixVulnerabilityReportIssuesArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


/** columns and relationships of "fix" */
export type FixVulnerabilityReportIssues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};

/** columns and relationships of "fix_answer" */
export type FixAnswer = {
  __typename?: 'fixAnswer';
  /** An object relationship */
  fix?: Maybe<Fix>;
  fixId: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "fix_answer" */
export type FixAnswer_Aggregate = {
  __typename?: 'fixAnswer_aggregate';
  aggregate?: Maybe<FixAnswer_Aggregate_Fields>;
  nodes: Array<FixAnswer>;
};

export type FixAnswer_Aggregate_Bool_Exp = {
  count?: InputMaybe<FixAnswer_Aggregate_Bool_Exp_Count>;
};

export type FixAnswer_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<FixAnswer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FixAnswer_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix_answer" */
export type FixAnswer_Aggregate_Fields = {
  __typename?: 'fixAnswer_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<FixAnswer_Max_Fields>;
  min?: Maybe<FixAnswer_Min_Fields>;
};


/** aggregate fields of "fix_answer" */
export type FixAnswer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<FixAnswer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix_answer" */
export type FixAnswer_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<FixAnswer_Max_Order_By>;
  min?: InputMaybe<FixAnswer_Min_Order_By>;
};

/** input type for inserting array relation for remote table "fix_answer" */
export type FixAnswer_Arr_Rel_Insert_Input = {
  data: Array<FixAnswer_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<FixAnswer_On_Conflict>;
};

/** Boolean expression to filter rows from the table "fix_answer". All fields are combined with a logical 'AND'. */
export type FixAnswer_Bool_Exp = {
  _and?: InputMaybe<Array<FixAnswer_Bool_Exp>>;
  _not?: InputMaybe<FixAnswer_Bool_Exp>;
  _or?: InputMaybe<Array<FixAnswer_Bool_Exp>>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  key?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_answer" */
export enum FixAnswer_Constraint {
  /** unique or primary key constraint on columns "fix_id", "key" */
  FixAnswerFixIdKeyKey = 'fix_answer_fixId_key_key',
  /** unique or primary key constraint on columns "id" */
  FixAnswerPkey = 'fix_answer_pkey'
}

/** input type for inserting data into table "fix_answer" */
export type FixAnswer_Insert_Input = {
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type FixAnswer_Max_Fields = {
  __typename?: 'fixAnswer_max_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "fix_answer" */
export type FixAnswer_Max_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type FixAnswer_Min_Fields = {
  __typename?: 'fixAnswer_min_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "fix_answer" */
export type FixAnswer_Min_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix_answer" */
export type FixAnswer_Mutation_Response = {
  __typename?: 'fixAnswer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FixAnswer>;
};

/** on_conflict condition type for table "fix_answer" */
export type FixAnswer_On_Conflict = {
  constraint: FixAnswer_Constraint;
  update_columns?: Array<FixAnswer_Update_Column>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_answer". */
export type FixAnswer_Order_By = {
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_answer */
export type FixAnswer_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_answer" */
export enum FixAnswer_Select_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "fix_answer" */
export type FixAnswer_Set_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "fixAnswer" */
export type FixAnswer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: FixAnswer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type FixAnswer_Stream_Cursor_Value_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "fix_answer" */
export enum FixAnswer_Update_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  Value = 'value'
}

export type FixAnswer_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FixAnswer_Set_Input>;
  /** filter the rows which have to be updated */
  where: FixAnswer_Bool_Exp;
};

/** columns and relationships of "fix_file" */
export type FixFile = {
  __typename?: 'fixFile';
  fileRepoRelativePath: Scalars['String']['output'];
  /** An object relationship */
  fix?: Maybe<Fix>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  isSecondary?: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  originalFile?: Maybe<File>;
  originalFileId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "fix_file" */
export type FixFile_Aggregate = {
  __typename?: 'fixFile_aggregate';
  aggregate?: Maybe<FixFile_Aggregate_Fields>;
  nodes: Array<FixFile>;
};

export type FixFile_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<FixFile_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<FixFile_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<FixFile_Aggregate_Bool_Exp_Count>;
};

export type FixFile_Aggregate_Bool_Exp_Bool_And = {
  arguments: FixFile_Select_Column_FixFile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FixFile_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type FixFile_Aggregate_Bool_Exp_Bool_Or = {
  arguments: FixFile_Select_Column_FixFile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FixFile_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type FixFile_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<FixFile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FixFile_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix_file" */
export type FixFile_Aggregate_Fields = {
  __typename?: 'fixFile_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<FixFile_Max_Fields>;
  min?: Maybe<FixFile_Min_Fields>;
};


/** aggregate fields of "fix_file" */
export type FixFile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<FixFile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix_file" */
export type FixFile_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<FixFile_Max_Order_By>;
  min?: InputMaybe<FixFile_Min_Order_By>;
};

/** input type for inserting array relation for remote table "fix_file" */
export type FixFile_Arr_Rel_Insert_Input = {
  data: Array<FixFile_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<FixFile_On_Conflict>;
};

/** Boolean expression to filter rows from the table "fix_file". All fields are combined with a logical 'AND'. */
export type FixFile_Bool_Exp = {
  _and?: InputMaybe<Array<FixFile_Bool_Exp>>;
  _not?: InputMaybe<FixFile_Bool_Exp>;
  _or?: InputMaybe<Array<FixFile_Bool_Exp>>;
  fileRepoRelativePath?: InputMaybe<String_Comparison_Exp>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isSecondary?: InputMaybe<Boolean_Comparison_Exp>;
  originalFile?: InputMaybe<File_Bool_Exp>;
  originalFileId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_file" */
export enum FixFile_Constraint {
  /** unique or primary key constraint on columns "id" */
  FixFilePkey = 'fix_file_pkey'
}

/** input type for inserting data into table "fix_file" */
export type FixFile_Insert_Input = {
  fileRepoRelativePath?: InputMaybe<Scalars['String']['input']>;
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSecondary?: InputMaybe<Scalars['Boolean']['input']>;
  originalFile?: InputMaybe<File_Obj_Rel_Insert_Input>;
  originalFileId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type FixFile_Max_Fields = {
  __typename?: 'fixFile_max_fields';
  fileRepoRelativePath?: Maybe<Scalars['String']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  originalFileId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "fix_file" */
export type FixFile_Max_Order_By = {
  fileRepoRelativePath?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  originalFileId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type FixFile_Min_Fields = {
  __typename?: 'fixFile_min_fields';
  fileRepoRelativePath?: Maybe<Scalars['String']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  originalFileId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "fix_file" */
export type FixFile_Min_Order_By = {
  fileRepoRelativePath?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  originalFileId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix_file" */
export type FixFile_Mutation_Response = {
  __typename?: 'fixFile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FixFile>;
};

/** input type for inserting object relation for remote table "fix_file" */
export type FixFile_Obj_Rel_Insert_Input = {
  data: FixFile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<FixFile_On_Conflict>;
};

/** on_conflict condition type for table "fix_file" */
export type FixFile_On_Conflict = {
  constraint: FixFile_Constraint;
  update_columns?: Array<FixFile_Update_Column>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_file". */
export type FixFile_Order_By = {
  fileRepoRelativePath?: InputMaybe<Order_By>;
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isSecondary?: InputMaybe<Order_By>;
  originalFile?: InputMaybe<File_Order_By>;
  originalFileId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_file */
export type FixFile_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_file" */
export enum FixFile_Select_Column {
  /** column name */
  FileRepoRelativePath = 'fileRepoRelativePath',
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  IsSecondary = 'isSecondary',
  /** column name */
  OriginalFileId = 'originalFileId'
}

/** select "fixFile_aggregate_bool_exp_bool_and_arguments_columns" columns of table "fix_file" */
export enum FixFile_Select_Column_FixFile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsSecondary = 'isSecondary'
}

/** select "fixFile_aggregate_bool_exp_bool_or_arguments_columns" columns of table "fix_file" */
export enum FixFile_Select_Column_FixFile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsSecondary = 'isSecondary'
}

/** input type for updating data in table "fix_file" */
export type FixFile_Set_Input = {
  fileRepoRelativePath?: InputMaybe<Scalars['String']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSecondary?: InputMaybe<Scalars['Boolean']['input']>;
  originalFileId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "fixFile" */
export type FixFile_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: FixFile_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type FixFile_Stream_Cursor_Value_Input = {
  fileRepoRelativePath?: InputMaybe<Scalars['String']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSecondary?: InputMaybe<Scalars['Boolean']['input']>;
  originalFileId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "fix_file" */
export enum FixFile_Update_Column {
  /** column name */
  FileRepoRelativePath = 'fileRepoRelativePath',
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  IsSecondary = 'isSecondary',
  /** column name */
  OriginalFileId = 'originalFileId'
}

export type FixFile_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FixFile_Set_Input>;
  /** filter the rows which have to be updated */
  where: FixFile_Bool_Exp;
};

/** columns and relationships of "fix_report" */
export type FixReport = {
  __typename?: 'fixReport';
  /** A computed field, executes function "get_git_blame_logins" */
  assignedTo?: Maybe<Scalars['json']['output']>;
  /** A computed field, executes function "get_fix_report_confidence" */
  confidences?: Maybe<Scalars['json']['output']>;
  /** An object relationship */
  createdByUser?: Maybe<User>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  createdOn: Scalars['timestamptz']['output'];
  expirationOn?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  fixes: Array<Fix>;
  /** A computed field, executes function "get_fix_efforts" */
  fixesCountByEffort?: Maybe<Scalars['json']['output']>;
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  /** An aggregate relationship */
  fixes_aggregate: Fix_Aggregate;
  /** A computed field, executes function "get_fresh_fixes" */
  freshFixes?: Maybe<Array<Fix>>;
  hybridFixes: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  isAiEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** A computed field, executes function "get_issue_languages" */
  issueLanguages?: Maybe<Scalars['json']['output']>;
  /** A computed field, executes function "get_issue_types" */
  issueTypes?: Maybe<Scalars['json']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  repo?: Maybe<Repo>;
  repoArchiveId?: Maybe<Scalars['uuid']['output']>;
  s3RefreshedOn?: Maybe<Scalars['timestamptz']['output']>;
  state: Fix_Report_State_Enum;
  /** An object relationship */
  vulnerabilityReport: Vulnerability_Report;
  vulnerabilityReportId: Scalars['uuid']['output'];
  /** A computed field, executes function "get_fix_report_vulnerability_severities" */
  vulnerabilitySeverities?: Maybe<Scalars['json']['output']>;
};


/** columns and relationships of "fix_report" */
export type FixReportAssignedToArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "fix_report" */
export type FixReportConfidencesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "fix_report" */
export type FixReportFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** columns and relationships of "fix_report" */
export type FixReportFixesCountByEffortArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "fix_report" */
export type FixReportFixes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** columns and relationships of "fix_report" */
export type FixReportFreshFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** columns and relationships of "fix_report" */
export type FixReportIssueLanguagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "fix_report" */
export type FixReportIssueTypesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "fix_report" */
export type FixReportVulnerabilitySeveritiesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "fix_report" */
export type FixReport_Aggregate = {
  __typename?: 'fixReport_aggregate';
  aggregate?: Maybe<FixReport_Aggregate_Fields>;
  nodes: Array<FixReport>;
};

/** aggregate fields of "fix_report" */
export type FixReport_Aggregate_Fields = {
  __typename?: 'fixReport_aggregate_fields';
  avg?: Maybe<FixReport_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<FixReport_Max_Fields>;
  min?: Maybe<FixReport_Min_Fields>;
  stddev?: Maybe<FixReport_Stddev_Fields>;
  stddev_pop?: Maybe<FixReport_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<FixReport_Stddev_Samp_Fields>;
  sum?: Maybe<FixReport_Sum_Fields>;
  var_pop?: Maybe<FixReport_Var_Pop_Fields>;
  var_samp?: Maybe<FixReport_Var_Samp_Fields>;
  variance?: Maybe<FixReport_Variance_Fields>;
};


/** aggregate fields of "fix_report" */
export type FixReport_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<FixReport_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type FixReport_Avg_Fields = {
  __typename?: 'fixReport_avg_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "fix_report". All fields are combined with a logical 'AND'. */
export type FixReport_Bool_Exp = {
  _and?: InputMaybe<Array<FixReport_Bool_Exp>>;
  _not?: InputMaybe<FixReport_Bool_Exp>;
  _or?: InputMaybe<Array<FixReport_Bool_Exp>>;
  assignedTo?: InputMaybe<Json_Comparison_Exp>;
  confidences?: InputMaybe<Json_Comparison_Exp>;
  createdByUser?: InputMaybe<User_Bool_Exp>;
  createdByUserId?: InputMaybe<Uuid_Comparison_Exp>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  expirationOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  fixes?: InputMaybe<Fix_Bool_Exp>;
  fixesCountByEffort?: InputMaybe<Json_Comparison_Exp>;
  fixesDoneCount?: InputMaybe<Int_Comparison_Exp>;
  fixesInprogressCount?: InputMaybe<Int_Comparison_Exp>;
  fixesReadyCount?: InputMaybe<Int_Comparison_Exp>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Bool_Exp>;
  freshFixes?: InputMaybe<Fix_Bool_Exp>;
  hybridFixes?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isAiEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  issueLanguages?: InputMaybe<Json_Comparison_Exp>;
  issueTypes?: InputMaybe<Json_Comparison_Exp>;
  remainingUnstableFixes?: InputMaybe<Int_Comparison_Exp>;
  repo?: InputMaybe<Repo_Bool_Exp>;
  repoArchiveId?: InputMaybe<Uuid_Comparison_Exp>;
  s3RefreshedOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  state?: InputMaybe<Fix_Report_State_Enum_Comparison_Exp>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  vulnerabilityReportId?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerabilitySeverities?: InputMaybe<Json_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_report" */
export enum FixReport_Constraint {
  /** unique or primary key constraint on columns "id" */
  FixReportPkey = 'fix_report_pkey'
}

/** input type for incrementing numeric columns in table "fix_report" */
export type FixReport_Inc_Input = {
  hybridFixes?: InputMaybe<Scalars['Int']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "fix_report" */
export type FixReport_Insert_Input = {
  createdByUser?: InputMaybe<User_Obj_Rel_Insert_Input>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  expirationOn?: InputMaybe<Scalars['timestamptz']['input']>;
  fixes?: InputMaybe<Fix_Arr_Rel_Insert_Input>;
  hybridFixes?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  repo?: InputMaybe<Repo_Obj_Rel_Insert_Input>;
  repoArchiveId?: InputMaybe<Scalars['uuid']['input']>;
  s3RefreshedOn?: InputMaybe<Scalars['timestamptz']['input']>;
  state?: InputMaybe<Fix_Report_State_Enum>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Obj_Rel_Insert_Input>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type FixReport_Max_Fields = {
  __typename?: 'fixReport_max_fields';
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  expirationOn?: Maybe<Scalars['timestamptz']['output']>;
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  repoArchiveId?: Maybe<Scalars['uuid']['output']>;
  s3RefreshedOn?: Maybe<Scalars['timestamptz']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type FixReport_Min_Fields = {
  __typename?: 'fixReport_min_fields';
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  expirationOn?: Maybe<Scalars['timestamptz']['output']>;
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  repoArchiveId?: Maybe<Scalars['uuid']['output']>;
  s3RefreshedOn?: Maybe<Scalars['timestamptz']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "fix_report" */
export type FixReport_Mutation_Response = {
  __typename?: 'fixReport_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FixReport>;
};

/** input type for inserting object relation for remote table "fix_report" */
export type FixReport_Obj_Rel_Insert_Input = {
  data: FixReport_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<FixReport_On_Conflict>;
};

/** on_conflict condition type for table "fix_report" */
export type FixReport_On_Conflict = {
  constraint: FixReport_Constraint;
  update_columns?: Array<FixReport_Update_Column>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_report". */
export type FixReport_Order_By = {
  assignedTo?: InputMaybe<Order_By>;
  confidences?: InputMaybe<Order_By>;
  createdByUser?: InputMaybe<User_Order_By>;
  createdByUserId?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  expirationOn?: InputMaybe<Order_By>;
  fixesCountByEffort?: InputMaybe<Order_By>;
  fixesDoneCount?: InputMaybe<Order_By>;
  fixesInprogressCount?: InputMaybe<Order_By>;
  fixesReadyCount?: InputMaybe<Order_By>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Order_By>;
  freshFixes_aggregate?: InputMaybe<Fix_Aggregate_Order_By>;
  hybridFixes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isAiEnabled?: InputMaybe<Order_By>;
  issueLanguages?: InputMaybe<Order_By>;
  issueTypes?: InputMaybe<Order_By>;
  remainingUnstableFixes?: InputMaybe<Order_By>;
  repo?: InputMaybe<Repo_Order_By>;
  repoArchiveId?: InputMaybe<Order_By>;
  s3RefreshedOn?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Order_By>;
  vulnerabilityReportId?: InputMaybe<Order_By>;
  vulnerabilitySeverities?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_report */
export type FixReport_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_report" */
export enum FixReport_Select_Column {
  /** column name */
  CreatedByUserId = 'createdByUserId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  ExpirationOn = 'expirationOn',
  /** column name */
  HybridFixes = 'hybridFixes',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiEnabled = 'isAiEnabled',
  /** column name */
  RemainingUnstableFixes = 'remainingUnstableFixes',
  /** column name */
  RepoArchiveId = 'repoArchiveId',
  /** column name */
  S3RefreshedOn = 's3RefreshedOn',
  /** column name */
  State = 'state',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

/** input type for updating data in table "fix_report" */
export type FixReport_Set_Input = {
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  expirationOn?: InputMaybe<Scalars['timestamptz']['input']>;
  hybridFixes?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  repoArchiveId?: InputMaybe<Scalars['uuid']['input']>;
  s3RefreshedOn?: InputMaybe<Scalars['timestamptz']['input']>;
  state?: InputMaybe<Fix_Report_State_Enum>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type FixReport_Stddev_Fields = {
  __typename?: 'fixReport_stddev_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type FixReport_Stddev_Pop_Fields = {
  __typename?: 'fixReport_stddev_pop_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type FixReport_Stddev_Samp_Fields = {
  __typename?: 'fixReport_stddev_samp_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "fixReport" */
export type FixReport_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: FixReport_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type FixReport_Stream_Cursor_Value_Input = {
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  expirationOn?: InputMaybe<Scalars['timestamptz']['input']>;
  hybridFixes?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  repoArchiveId?: InputMaybe<Scalars['uuid']['input']>;
  s3RefreshedOn?: InputMaybe<Scalars['timestamptz']['input']>;
  state?: InputMaybe<Fix_Report_State_Enum>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type FixReport_Sum_Fields = {
  __typename?: 'fixReport_sum_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Int']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "fix_report" */
export enum FixReport_Update_Column {
  /** column name */
  CreatedByUserId = 'createdByUserId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  ExpirationOn = 'expirationOn',
  /** column name */
  HybridFixes = 'hybridFixes',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiEnabled = 'isAiEnabled',
  /** column name */
  RemainingUnstableFixes = 'remainingUnstableFixes',
  /** column name */
  RepoArchiveId = 'repoArchiveId',
  /** column name */
  S3RefreshedOn = 's3RefreshedOn',
  /** column name */
  State = 'state',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

export type FixReport_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<FixReport_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FixReport_Set_Input>;
  /** filter the rows which have to be updated */
  where: FixReport_Bool_Exp;
};

/** aggregate var_pop on columns */
export type FixReport_Var_Pop_Fields = {
  __typename?: 'fixReport_var_pop_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type FixReport_Var_Samp_Fields = {
  __typename?: 'fixReport_var_samp_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type FixReport_Variance_Fields = {
  __typename?: 'fixReport_variance_fields';
  /** A computed field, executes function "count_fix_isdone" */
  fixesDoneCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isinprogress" */
  fixesInprogressCount?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "count_fix_isready" */
  fixesReadyCount?: Maybe<Scalars['Int']['output']>;
  hybridFixes?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
};

/** aggregated selection of "fix" */
export type Fix_Aggregate = {
  __typename?: 'fix_aggregate';
  aggregate?: Maybe<Fix_Aggregate_Fields>;
  nodes: Array<Fix>;
};

export type Fix_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Fix_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Fix_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Fix_Aggregate_Bool_Exp_Count>;
};

export type Fix_Aggregate_Bool_Exp_Bool_And = {
  arguments: Fix_Select_Column_Fix_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Fix_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Fix_Select_Column_Fix_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Fix_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Fix_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix" */
export type Fix_Aggregate_Fields = {
  __typename?: 'fix_aggregate_fields';
  avg?: Maybe<Fix_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_Max_Fields>;
  min?: Maybe<Fix_Min_Fields>;
  stddev?: Maybe<Fix_Stddev_Fields>;
  stddev_pop?: Maybe<Fix_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Fix_Stddev_Samp_Fields>;
  sum?: Maybe<Fix_Sum_Fields>;
  var_pop?: Maybe<Fix_Var_Pop_Fields>;
  var_samp?: Maybe<Fix_Var_Samp_Fields>;
  variance?: Maybe<Fix_Variance_Fields>;
};


/** aggregate fields of "fix" */
export type Fix_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix" */
export type Fix_Aggregate_Order_By = {
  avg?: InputMaybe<Fix_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Fix_Max_Order_By>;
  min?: InputMaybe<Fix_Min_Order_By>;
  stddev?: InputMaybe<Fix_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Fix_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Fix_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Fix_Sum_Order_By>;
  var_pop?: InputMaybe<Fix_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Fix_Var_Samp_Order_By>;
  variance?: InputMaybe<Fix_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "fix" */
export type Fix_Arr_Rel_Insert_Input = {
  data: Array<Fix_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Fix_On_Conflict>;
};

/** aggregate avg on columns */
export type Fix_Avg_Fields = {
  __typename?: 'fix_avg_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by avg() on columns of table "fix" */
export type Fix_Avg_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "fix". All fields are combined with a logical 'AND'. */
export type Fix_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_Bool_Exp>>;
  _not?: InputMaybe<Fix_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_Bool_Exp>>;
  confidence?: InputMaybe<Int_Comparison_Exp>;
  created_on?: InputMaybe<Timestamptz_Comparison_Exp>;
  downloadedBy?: InputMaybe<User_Bool_Exp>;
  downloadedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
  effortToApplyFix?: InputMaybe<Effort_To_Apply_Fix_Enum_Comparison_Exp>;
  fixAnswers?: InputMaybe<FixAnswer_Bool_Exp>;
  fixAnswers_aggregate?: InputMaybe<FixAnswer_Aggregate_Bool_Exp>;
  fixContentHashId?: InputMaybe<String_Comparison_Exp>;
  fixFiles?: InputMaybe<FixFile_Bool_Exp>;
  fixFiles_aggregate?: InputMaybe<FixFile_Aggregate_Bool_Exp>;
  fixInfoFile?: InputMaybe<File_Bool_Exp>;
  fixInfoFileId?: InputMaybe<Uuid_Comparison_Exp>;
  fixRatings?: InputMaybe<Fix_Rating_Bool_Exp>;
  fixRatings_aggregate?: InputMaybe<Fix_Rating_Aggregate_Bool_Exp>;
  fixRawContentHash?: InputMaybe<String_Comparison_Exp>;
  fixReport?: InputMaybe<FixReport_Bool_Exp>;
  fixReportId?: InputMaybe<Uuid_Comparison_Exp>;
  gitBlameLogin?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isArchived?: InputMaybe<Boolean_Comparison_Exp>;
  isExpired?: InputMaybe<Boolean_Comparison_Exp>;
  issueLanguage?: InputMaybe<IssueLanguage_Enum_Comparison_Exp>;
  issueType?: InputMaybe<IssueType_Enum_Comparison_Exp>;
  modifiedBy?: InputMaybe<String_Comparison_Exp>;
  numberOfVulnerabilityIssues?: InputMaybe<Int_Comparison_Exp>;
  patchFile?: InputMaybe<File_Bool_Exp>;
  patchFileId?: InputMaybe<Uuid_Comparison_Exp>;
  safeIssueLanguage?: InputMaybe<String_Comparison_Exp>;
  safeIssueType?: InputMaybe<String_Comparison_Exp>;
  scmSubmitFixRequests?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
  scmSubmitFixRequests_aggregate?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Bool_Exp>;
  severityValue?: InputMaybe<Int_Comparison_Exp>;
  state?: InputMaybe<Fix_State_Enum_Comparison_Exp>;
  submitFixRequests?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
  submitFixRequests_aggregate?: InputMaybe<Fix_To_Submit_Fix_Request_Aggregate_Bool_Exp>;
  vulnerabilityReportIssues?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  vulnerabilityReportIssues_aggregate?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Bool_Exp>;
  vulnerabilitySeverity?: InputMaybe<Vulnerability_Severity_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix" */
export enum Fix_Constraint {
  /** unique or primary key constraint on columns "fix_report_id", "fix_content_hash_id" */
  FixFixContentHashIdFixReportIdKey = 'fix_fix_content_hash_id_fix_report_id_key',
  /** unique or primary key constraint on columns "id" */
  FixPkey = 'fix_pkey'
}

/** input type for incrementing numeric columns in table "fix" */
export type Fix_Inc_Input = {
  confidence?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "fix" */
export type Fix_Insert_Input = {
  confidence?: InputMaybe<Scalars['Int']['input']>;
  created_on?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadedBy?: InputMaybe<User_Obj_Rel_Insert_Input>;
  downloadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  effortToApplyFix?: InputMaybe<Effort_To_Apply_Fix_Enum>;
  fixAnswers?: InputMaybe<FixAnswer_Arr_Rel_Insert_Input>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: InputMaybe<Scalars['String']['input']>;
  fixFiles?: InputMaybe<FixFile_Arr_Rel_Insert_Input>;
  fixInfoFile?: InputMaybe<File_Obj_Rel_Insert_Input>;
  fixInfoFileId?: InputMaybe<Scalars['uuid']['input']>;
  fixRatings?: InputMaybe<Fix_Rating_Arr_Rel_Insert_Input>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: InputMaybe<Scalars['String']['input']>;
  fixReport?: InputMaybe<FixReport_Obj_Rel_Insert_Input>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  gitBlameLogin?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  isExpired?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<IssueLanguage_Enum>;
  issueType?: InputMaybe<IssueType_Enum>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  patchFile?: InputMaybe<File_Obj_Rel_Insert_Input>;
  /** this a deprecated relationship */
  patchFileId?: InputMaybe<Scalars['uuid']['input']>;
  scmSubmitFixRequests?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Arr_Rel_Insert_Input>;
  state?: InputMaybe<Fix_State_Enum>;
  submitFixRequests?: InputMaybe<Fix_To_Submit_Fix_Request_Arr_Rel_Insert_Input>;
  vulnerabilityReportIssues?: InputMaybe<Vulnerability_Report_Issue_Arr_Rel_Insert_Input>;
  vulnerabilitySeverity?: InputMaybe<Vulnerability_Severity_Enum>;
};

/** aggregate max on columns */
export type Fix_Max_Fields = {
  __typename?: 'fix_max_fields';
  confidence?: Maybe<Scalars['Int']['output']>;
  created_on?: Maybe<Scalars['timestamptz']['output']>;
  downloadedByUserId?: Maybe<Scalars['uuid']['output']>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: Maybe<Scalars['String']['output']>;
  fixInfoFileId?: Maybe<Scalars['uuid']['output']>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: Maybe<Scalars['String']['output']>;
  fixReportId?: Maybe<Scalars['uuid']['output']>;
  gitBlameLogin?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** this a deprecated relationship */
  patchFileId?: Maybe<Scalars['uuid']['output']>;
  /** A computed field, executes function "get_issue_language" */
  safeIssueLanguage?: Maybe<Scalars['String']['output']>;
  /** Returns the issue type for a given fix. If the issue_type is null in the fix, it fetches the issue_type from the related vulnerability_report_issue. */
  safeIssueType?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "fix" */
export type Fix_Max_Order_By = {
  confidence?: InputMaybe<Order_By>;
  created_on?: InputMaybe<Order_By>;
  downloadedByUserId?: InputMaybe<Order_By>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: InputMaybe<Order_By>;
  fixInfoFileId?: InputMaybe<Order_By>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: InputMaybe<Order_By>;
  fixReportId?: InputMaybe<Order_By>;
  gitBlameLogin?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modifiedBy?: InputMaybe<Order_By>;
  /** this a deprecated relationship */
  patchFileId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Fix_Min_Fields = {
  __typename?: 'fix_min_fields';
  confidence?: Maybe<Scalars['Int']['output']>;
  created_on?: Maybe<Scalars['timestamptz']['output']>;
  downloadedByUserId?: Maybe<Scalars['uuid']['output']>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: Maybe<Scalars['String']['output']>;
  fixInfoFileId?: Maybe<Scalars['uuid']['output']>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: Maybe<Scalars['String']['output']>;
  fixReportId?: Maybe<Scalars['uuid']['output']>;
  gitBlameLogin?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** this a deprecated relationship */
  patchFileId?: Maybe<Scalars['uuid']['output']>;
  /** A computed field, executes function "get_issue_language" */
  safeIssueLanguage?: Maybe<Scalars['String']['output']>;
  /** Returns the issue type for a given fix. If the issue_type is null in the fix, it fetches the issue_type from the related vulnerability_report_issue. */
  safeIssueType?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "fix" */
export type Fix_Min_Order_By = {
  confidence?: InputMaybe<Order_By>;
  created_on?: InputMaybe<Order_By>;
  downloadedByUserId?: InputMaybe<Order_By>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: InputMaybe<Order_By>;
  fixInfoFileId?: InputMaybe<Order_By>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: InputMaybe<Order_By>;
  fixReportId?: InputMaybe<Order_By>;
  gitBlameLogin?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modifiedBy?: InputMaybe<Order_By>;
  /** this a deprecated relationship */
  patchFileId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix" */
export type Fix_Mutation_Response = {
  __typename?: 'fix_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix>;
};

/** input type for inserting object relation for remote table "fix" */
export type Fix_Obj_Rel_Insert_Input = {
  data: Fix_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Fix_On_Conflict>;
};

/** on_conflict condition type for table "fix" */
export type Fix_On_Conflict = {
  constraint: Fix_Constraint;
  update_columns?: Array<Fix_Update_Column>;
  where?: InputMaybe<Fix_Bool_Exp>;
};

/** Ordering options when selecting data from "fix". */
export type Fix_Order_By = {
  confidence?: InputMaybe<Order_By>;
  created_on?: InputMaybe<Order_By>;
  downloadedBy?: InputMaybe<User_Order_By>;
  downloadedByUserId?: InputMaybe<Order_By>;
  effortToApplyFix?: InputMaybe<Order_By>;
  fixAnswers_aggregate?: InputMaybe<FixAnswer_Aggregate_Order_By>;
  fixContentHashId?: InputMaybe<Order_By>;
  fixFiles_aggregate?: InputMaybe<FixFile_Aggregate_Order_By>;
  fixInfoFile?: InputMaybe<File_Order_By>;
  fixInfoFileId?: InputMaybe<Order_By>;
  fixRatings_aggregate?: InputMaybe<Fix_Rating_Aggregate_Order_By>;
  fixRawContentHash?: InputMaybe<Order_By>;
  fixReport?: InputMaybe<FixReport_Order_By>;
  fixReportId?: InputMaybe<Order_By>;
  gitBlameLogin?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isArchived?: InputMaybe<Order_By>;
  isExpired?: InputMaybe<Order_By>;
  issueLanguage?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  modifiedBy?: InputMaybe<Order_By>;
  numberOfVulnerabilityIssues?: InputMaybe<Order_By>;
  patchFile?: InputMaybe<File_Order_By>;
  patchFileId?: InputMaybe<Order_By>;
  safeIssueLanguage?: InputMaybe<Order_By>;
  safeIssueType?: InputMaybe<Order_By>;
  scmSubmitFixRequests_aggregate?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Order_By>;
  severityValue?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  submitFixRequests_aggregate?: InputMaybe<Fix_To_Submit_Fix_Request_Aggregate_Order_By>;
  vulnerabilityReportIssues_aggregate?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Order_By>;
  vulnerabilitySeverity?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix */
export type Fix_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "fix_rating" */
export type Fix_Rating = {
  __typename?: 'fix_rating';
  comment?: Maybe<Scalars['String']['output']>;
  excludedByUserId: Scalars['uuid']['output'];
  /** An object relationship */
  fix: Fix;
  fixId: Scalars['uuid']['output'];
  fixRatingTag?: Maybe<Fix_Rating_Tag_Enum>;
  id: Scalars['uuid']['output'];
  updatedDate: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: User;
  voteScore: Scalars['smallint']['output'];
};

/** aggregated selection of "fix_rating" */
export type Fix_Rating_Aggregate = {
  __typename?: 'fix_rating_aggregate';
  aggregate?: Maybe<Fix_Rating_Aggregate_Fields>;
  nodes: Array<Fix_Rating>;
};

export type Fix_Rating_Aggregate_Bool_Exp = {
  count?: InputMaybe<Fix_Rating_Aggregate_Bool_Exp_Count>;
};

export type Fix_Rating_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_Rating_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix_rating" */
export type Fix_Rating_Aggregate_Fields = {
  __typename?: 'fix_rating_aggregate_fields';
  avg?: Maybe<Fix_Rating_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_Rating_Max_Fields>;
  min?: Maybe<Fix_Rating_Min_Fields>;
  stddev?: Maybe<Fix_Rating_Stddev_Fields>;
  stddev_pop?: Maybe<Fix_Rating_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Fix_Rating_Stddev_Samp_Fields>;
  sum?: Maybe<Fix_Rating_Sum_Fields>;
  var_pop?: Maybe<Fix_Rating_Var_Pop_Fields>;
  var_samp?: Maybe<Fix_Rating_Var_Samp_Fields>;
  variance?: Maybe<Fix_Rating_Variance_Fields>;
};


/** aggregate fields of "fix_rating" */
export type Fix_Rating_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix_rating" */
export type Fix_Rating_Aggregate_Order_By = {
  avg?: InputMaybe<Fix_Rating_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Fix_Rating_Max_Order_By>;
  min?: InputMaybe<Fix_Rating_Min_Order_By>;
  stddev?: InputMaybe<Fix_Rating_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Fix_Rating_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Fix_Rating_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Fix_Rating_Sum_Order_By>;
  var_pop?: InputMaybe<Fix_Rating_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Fix_Rating_Var_Samp_Order_By>;
  variance?: InputMaybe<Fix_Rating_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "fix_rating" */
export type Fix_Rating_Arr_Rel_Insert_Input = {
  data: Array<Fix_Rating_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Fix_Rating_On_Conflict>;
};

/** aggregate avg on columns */
export type Fix_Rating_Avg_Fields = {
  __typename?: 'fix_rating_avg_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "fix_rating" */
export type Fix_Rating_Avg_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "fix_rating". All fields are combined with a logical 'AND'. */
export type Fix_Rating_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_Rating_Bool_Exp>>;
  _not?: InputMaybe<Fix_Rating_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_Rating_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  excludedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  fixRatingTag?: InputMaybe<Fix_Rating_Tag_Enum_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  voteScore?: InputMaybe<Smallint_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_rating" */
export enum Fix_Rating_Constraint {
  /** unique or primary key constraint on columns "fix_id", "excluded_by_user_id" */
  FixRatingExcludedByUserIdFixIdKey = 'fix_rating_excluded_by_user_id_fix_id_key',
  /** unique or primary key constraint on columns "id" */
  FixRatingPkey = 'fix_rating_pkey'
}

/** input type for incrementing numeric columns in table "fix_rating" */
export type Fix_Rating_Inc_Input = {
  voteScore?: InputMaybe<Scalars['smallint']['input']>;
};

/** input type for inserting data into table "fix_rating" */
export type Fix_Rating_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  excludedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  fixRatingTag?: InputMaybe<Fix_Rating_Tag_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  voteScore?: InputMaybe<Scalars['smallint']['input']>;
};

/** aggregate max on columns */
export type Fix_Rating_Max_Fields = {
  __typename?: 'fix_rating_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  excludedByUserId?: Maybe<Scalars['uuid']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updatedDate?: Maybe<Scalars['timestamptz']['output']>;
  voteScore?: Maybe<Scalars['smallint']['output']>;
};

/** order by max() on columns of table "fix_rating" */
export type Fix_Rating_Max_Order_By = {
  comment?: InputMaybe<Order_By>;
  excludedByUserId?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedDate?: InputMaybe<Order_By>;
  voteScore?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Fix_Rating_Min_Fields = {
  __typename?: 'fix_rating_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  excludedByUserId?: Maybe<Scalars['uuid']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updatedDate?: Maybe<Scalars['timestamptz']['output']>;
  voteScore?: Maybe<Scalars['smallint']['output']>;
};

/** order by min() on columns of table "fix_rating" */
export type Fix_Rating_Min_Order_By = {
  comment?: InputMaybe<Order_By>;
  excludedByUserId?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedDate?: InputMaybe<Order_By>;
  voteScore?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix_rating" */
export type Fix_Rating_Mutation_Response = {
  __typename?: 'fix_rating_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_Rating>;
};

/** on_conflict condition type for table "fix_rating" */
export type Fix_Rating_On_Conflict = {
  constraint: Fix_Rating_Constraint;
  update_columns?: Array<Fix_Rating_Update_Column>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_rating". */
export type Fix_Rating_Order_By = {
  comment?: InputMaybe<Order_By>;
  excludedByUserId?: InputMaybe<Order_By>;
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  fixRatingTag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedDate?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  voteScore?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_rating */
export type Fix_Rating_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_rating" */
export enum Fix_Rating_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  ExcludedByUserId = 'excludedByUserId',
  /** column name */
  FixId = 'fixId',
  /** column name */
  FixRatingTag = 'fixRatingTag',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedDate = 'updatedDate',
  /** column name */
  VoteScore = 'voteScore'
}

/** input type for updating data in table "fix_rating" */
export type Fix_Rating_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  excludedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  fixRatingTag?: InputMaybe<Fix_Rating_Tag_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  voteScore?: InputMaybe<Scalars['smallint']['input']>;
};

/** aggregate stddev on columns */
export type Fix_Rating_Stddev_Fields = {
  __typename?: 'fix_rating_stddev_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "fix_rating" */
export type Fix_Rating_Stddev_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Fix_Rating_Stddev_Pop_Fields = {
  __typename?: 'fix_rating_stddev_pop_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "fix_rating" */
export type Fix_Rating_Stddev_Pop_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Fix_Rating_Stddev_Samp_Fields = {
  __typename?: 'fix_rating_stddev_samp_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "fix_rating" */
export type Fix_Rating_Stddev_Samp_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "fix_rating" */
export type Fix_Rating_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_Rating_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_Rating_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  excludedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  fixRatingTag?: InputMaybe<Fix_Rating_Tag_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  voteScore?: InputMaybe<Scalars['smallint']['input']>;
};

/** aggregate sum on columns */
export type Fix_Rating_Sum_Fields = {
  __typename?: 'fix_rating_sum_fields';
  voteScore?: Maybe<Scalars['smallint']['output']>;
};

/** order by sum() on columns of table "fix_rating" */
export type Fix_Rating_Sum_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** columns and relationships of "fix_rating_tag" */
export type Fix_Rating_Tag = {
  __typename?: 'fix_rating_tag';
  reason: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "fix_rating_tag" */
export type Fix_Rating_Tag_Aggregate = {
  __typename?: 'fix_rating_tag_aggregate';
  aggregate?: Maybe<Fix_Rating_Tag_Aggregate_Fields>;
  nodes: Array<Fix_Rating_Tag>;
};

/** aggregate fields of "fix_rating_tag" */
export type Fix_Rating_Tag_Aggregate_Fields = {
  __typename?: 'fix_rating_tag_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_Rating_Tag_Max_Fields>;
  min?: Maybe<Fix_Rating_Tag_Min_Fields>;
};


/** aggregate fields of "fix_rating_tag" */
export type Fix_Rating_Tag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_Rating_Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "fix_rating_tag". All fields are combined with a logical 'AND'. */
export type Fix_Rating_Tag_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_Rating_Tag_Bool_Exp>>;
  _not?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_Rating_Tag_Bool_Exp>>;
  reason?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_rating_tag" */
export enum Fix_Rating_Tag_Constraint {
  /** unique or primary key constraint on columns "value" */
  FixRatingTagPkey = 'fix_rating_tag_pkey'
}

export enum Fix_Rating_Tag_Enum {
  /** Bad code pattern */
  BadPattern = 'BAD_PATTERN',
  /** Fix will break my code */
  BreakingFix = 'BREAKING_FIX',
  /** Issues is false positive */
  FalsePositive = 'FALSE_POSITIVE',
  /** Other */
  Other = 'OTHER',
  /** Fix does not resolve the issue */
  UnresolvedFix = 'UNRESOLVED_FIX'
}

/** Boolean expression to compare columns of type "fix_rating_tag_enum". All fields are combined with logical 'AND'. */
export type Fix_Rating_Tag_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Fix_Rating_Tag_Enum>;
  _in?: InputMaybe<Array<Fix_Rating_Tag_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Fix_Rating_Tag_Enum>;
  _nin?: InputMaybe<Array<Fix_Rating_Tag_Enum>>;
};

/** input type for inserting data into table "fix_rating_tag" */
export type Fix_Rating_Tag_Insert_Input = {
  reason?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Fix_Rating_Tag_Max_Fields = {
  __typename?: 'fix_rating_tag_max_fields';
  reason?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Fix_Rating_Tag_Min_Fields = {
  __typename?: 'fix_rating_tag_min_fields';
  reason?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "fix_rating_tag" */
export type Fix_Rating_Tag_Mutation_Response = {
  __typename?: 'fix_rating_tag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_Rating_Tag>;
};

/** on_conflict condition type for table "fix_rating_tag" */
export type Fix_Rating_Tag_On_Conflict = {
  constraint: Fix_Rating_Tag_Constraint;
  update_columns?: Array<Fix_Rating_Tag_Update_Column>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_rating_tag". */
export type Fix_Rating_Tag_Order_By = {
  reason?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_rating_tag */
export type Fix_Rating_Tag_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "fix_rating_tag" */
export enum Fix_Rating_Tag_Select_Column {
  /** column name */
  Reason = 'reason',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "fix_rating_tag" */
export type Fix_Rating_Tag_Set_Input = {
  reason?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "fix_rating_tag" */
export type Fix_Rating_Tag_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_Rating_Tag_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_Rating_Tag_Stream_Cursor_Value_Input = {
  reason?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "fix_rating_tag" */
export enum Fix_Rating_Tag_Update_Column {
  /** column name */
  Reason = 'reason',
  /** column name */
  Value = 'value'
}

export type Fix_Rating_Tag_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_Rating_Tag_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_Rating_Tag_Bool_Exp;
};

/** update columns of table "fix_rating" */
export enum Fix_Rating_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  ExcludedByUserId = 'excludedByUserId',
  /** column name */
  FixId = 'fixId',
  /** column name */
  FixRatingTag = 'fixRatingTag',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedDate = 'updatedDate',
  /** column name */
  VoteScore = 'voteScore'
}

export type Fix_Rating_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Fix_Rating_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_Rating_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_Rating_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Fix_Rating_Var_Pop_Fields = {
  __typename?: 'fix_rating_var_pop_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "fix_rating" */
export type Fix_Rating_Var_Pop_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Fix_Rating_Var_Samp_Fields = {
  __typename?: 'fix_rating_var_samp_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "fix_rating" */
export type Fix_Rating_Var_Samp_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Fix_Rating_Variance_Fields = {
  __typename?: 'fix_rating_variance_fields';
  voteScore?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "fix_rating" */
export type Fix_Rating_Variance_Order_By = {
  voteScore?: InputMaybe<Order_By>;
};

/** columns and relationships of "fix_report_state" */
export type Fix_Report_State = {
  __typename?: 'fix_report_state';
  comment?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "fix_report_state" */
export type Fix_Report_State_Aggregate = {
  __typename?: 'fix_report_state_aggregate';
  aggregate?: Maybe<Fix_Report_State_Aggregate_Fields>;
  nodes: Array<Fix_Report_State>;
};

/** aggregate fields of "fix_report_state" */
export type Fix_Report_State_Aggregate_Fields = {
  __typename?: 'fix_report_state_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_Report_State_Max_Fields>;
  min?: Maybe<Fix_Report_State_Min_Fields>;
};


/** aggregate fields of "fix_report_state" */
export type Fix_Report_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_Report_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "fix_report_state". All fields are combined with a logical 'AND'. */
export type Fix_Report_State_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_Report_State_Bool_Exp>>;
  _not?: InputMaybe<Fix_Report_State_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_Report_State_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_report_state" */
export enum Fix_Report_State_Constraint {
  /** unique or primary key constraint on columns "value" */
  FixReportStatePkey = 'fix_report_state_pkey'
}

export enum Fix_Report_State_Enum {
  /** The fix report was created in the database */
  Created = 'Created',
  /** A delete report - should not be seen in the UI */
  Deleted = 'Deleted',
  /** The report was digested */
  Digested = 'Digested',
  /** An expired report - the files are not available anymore */
  Expired = 'Expired',
  /** The report init failed during initialization */
  Failed = 'Failed',
  /** All the issues in the fix report were processed */
  Finished = 'Finished',
  /** The fix report was initialized, report init done */
  Initialized = 'Initialized',
  /** A request was sent to analyze the fix report */
  Requested = 'Requested'
}

/** Boolean expression to compare columns of type "fix_report_state_enum". All fields are combined with logical 'AND'. */
export type Fix_Report_State_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Fix_Report_State_Enum>;
  _in?: InputMaybe<Array<Fix_Report_State_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Fix_Report_State_Enum>;
  _nin?: InputMaybe<Array<Fix_Report_State_Enum>>;
};

/** input type for inserting data into table "fix_report_state" */
export type Fix_Report_State_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Fix_Report_State_Max_Fields = {
  __typename?: 'fix_report_state_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Fix_Report_State_Min_Fields = {
  __typename?: 'fix_report_state_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "fix_report_state" */
export type Fix_Report_State_Mutation_Response = {
  __typename?: 'fix_report_state_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_Report_State>;
};

/** on_conflict condition type for table "fix_report_state" */
export type Fix_Report_State_On_Conflict = {
  constraint: Fix_Report_State_Constraint;
  update_columns?: Array<Fix_Report_State_Update_Column>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_report_state". */
export type Fix_Report_State_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_report_state */
export type Fix_Report_State_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "fix_report_state" */
export enum Fix_Report_State_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "fix_report_state" */
export type Fix_Report_State_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "fix_report_state" */
export type Fix_Report_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_Report_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_Report_State_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "fix_report_state" */
export enum Fix_Report_State_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Fix_Report_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_Report_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_Report_State_Bool_Exp;
};

/** select columns of table "fix" */
export enum Fix_Select_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedOn = 'created_on',
  /** column name */
  DownloadedByUserId = 'downloadedByUserId',
  /** column name */
  EffortToApplyFix = 'effortToApplyFix',
  /** column name */
  FixContentHashId = 'fixContentHashId',
  /** column name */
  FixInfoFileId = 'fixInfoFileId',
  /** column name */
  FixRawContentHash = 'fixRawContentHash',
  /** column name */
  FixReportId = 'fixReportId',
  /** column name */
  GitBlameLogin = 'gitBlameLogin',
  /** column name */
  Id = 'id',
  /** column name */
  IsArchived = 'isArchived',
  /** column name */
  IsExpired = 'isExpired',
  /** column name */
  IssueLanguage = 'issueLanguage',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  ModifiedBy = 'modifiedBy',
  /** column name */
  PatchFileId = 'patchFileId',
  /** column name */
  State = 'state',
  /** column name */
  VulnerabilitySeverity = 'vulnerabilitySeverity'
}

/** select "fix_aggregate_bool_exp_bool_and_arguments_columns" columns of table "fix" */
export enum Fix_Select_Column_Fix_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsArchived = 'isArchived',
  /** column name */
  IsExpired = 'isExpired'
}

/** select "fix_aggregate_bool_exp_bool_or_arguments_columns" columns of table "fix" */
export enum Fix_Select_Column_Fix_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsArchived = 'isArchived',
  /** column name */
  IsExpired = 'isExpired'
}

/** input type for updating data in table "fix" */
export type Fix_Set_Input = {
  confidence?: InputMaybe<Scalars['Int']['input']>;
  created_on?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  effortToApplyFix?: InputMaybe<Effort_To_Apply_Fix_Enum>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: InputMaybe<Scalars['String']['input']>;
  fixInfoFileId?: InputMaybe<Scalars['uuid']['input']>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: InputMaybe<Scalars['String']['input']>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  gitBlameLogin?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  isExpired?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<IssueLanguage_Enum>;
  issueType?: InputMaybe<IssueType_Enum>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  /** this a deprecated relationship */
  patchFileId?: InputMaybe<Scalars['uuid']['input']>;
  state?: InputMaybe<Fix_State_Enum>;
  vulnerabilitySeverity?: InputMaybe<Vulnerability_Severity_Enum>;
};

/** columns and relationships of "fix_state" */
export type Fix_State = {
  __typename?: 'fix_state';
  comment?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "fix_state" */
export type Fix_State_Aggregate = {
  __typename?: 'fix_state_aggregate';
  aggregate?: Maybe<Fix_State_Aggregate_Fields>;
  nodes: Array<Fix_State>;
};

/** aggregate fields of "fix_state" */
export type Fix_State_Aggregate_Fields = {
  __typename?: 'fix_state_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_State_Max_Fields>;
  min?: Maybe<Fix_State_Min_Fields>;
};


/** aggregate fields of "fix_state" */
export type Fix_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "fix_state". All fields are combined with a logical 'AND'. */
export type Fix_State_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_State_Bool_Exp>>;
  _not?: InputMaybe<Fix_State_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_State_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_state" */
export enum Fix_State_Constraint {
  /** unique or primary key constraint on columns "value" */
  FixStatePkey = 'fix_state_pkey'
}

export enum Fix_State_Enum {
  /** The fix was committed to a PR */
  Committed = 'Committed',
  /** All questions are answered – the fix is ready to be applied */
  Done = 'Done',
  /** The patch for the fix was downloaded */
  Downloaded = 'Downloaded',
  /** The PR containing the fix was merged to his base branch  */
  Merged = 'Merged',
  /** The questions are ready to review */
  Ready = 'Ready'
}

/** Boolean expression to compare columns of type "fix_state_enum". All fields are combined with logical 'AND'. */
export type Fix_State_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Fix_State_Enum>;
  _in?: InputMaybe<Array<Fix_State_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Fix_State_Enum>;
  _nin?: InputMaybe<Array<Fix_State_Enum>>;
};

/** input type for inserting data into table "fix_state" */
export type Fix_State_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Fix_State_Max_Fields = {
  __typename?: 'fix_state_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Fix_State_Min_Fields = {
  __typename?: 'fix_state_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "fix_state" */
export type Fix_State_Mutation_Response = {
  __typename?: 'fix_state_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_State>;
};

/** on_conflict condition type for table "fix_state" */
export type Fix_State_On_Conflict = {
  constraint: Fix_State_Constraint;
  update_columns?: Array<Fix_State_Update_Column>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_state". */
export type Fix_State_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_state */
export type Fix_State_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "fix_state" */
export enum Fix_State_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "fix_state" */
export type Fix_State_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "fix_state" */
export type Fix_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_State_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "fix_state" */
export enum Fix_State_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Fix_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_State_Bool_Exp;
};

/** aggregate stddev on columns */
export type Fix_Stddev_Fields = {
  __typename?: 'fix_stddev_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by stddev() on columns of table "fix" */
export type Fix_Stddev_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Fix_Stddev_Pop_Fields = {
  __typename?: 'fix_stddev_pop_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by stddev_pop() on columns of table "fix" */
export type Fix_Stddev_Pop_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Fix_Stddev_Samp_Fields = {
  __typename?: 'fix_stddev_samp_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by stddev_samp() on columns of table "fix" */
export type Fix_Stddev_Samp_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "fix" */
export type Fix_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_Stream_Cursor_Value_Input = {
  confidence?: InputMaybe<Scalars['Int']['input']>;
  created_on?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  effortToApplyFix?: InputMaybe<Effort_To_Apply_Fix_Enum>;
  /** the hash is derived from 'vulnerability_report_issue_state', 'vendor', 'fix report id', 'is_ai',  'issue_type', 'language', 'patch', and the 'question_keys' */
  fixContentHashId?: InputMaybe<Scalars['String']['input']>;
  fixInfoFileId?: InputMaybe<Scalars['uuid']['input']>;
  /** This hash is derived from the 'patch', 'vendor' ,'issue_type', 'language', and the 'question_keys' */
  fixRawContentHash?: InputMaybe<Scalars['String']['input']>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  gitBlameLogin?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  isExpired?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<IssueLanguage_Enum>;
  issueType?: InputMaybe<IssueType_Enum>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  /** this a deprecated relationship */
  patchFileId?: InputMaybe<Scalars['uuid']['input']>;
  state?: InputMaybe<Fix_State_Enum>;
  vulnerabilitySeverity?: InputMaybe<Vulnerability_Severity_Enum>;
};

/** aggregate sum on columns */
export type Fix_Sum_Fields = {
  __typename?: 'fix_sum_fields';
  confidence?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "fix" */
export type Fix_Sum_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** columns and relationships of "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request = {
  __typename?: 'fix_to_scm_submit_fix_request';
  /** An object relationship */
  fix: Fix;
  fixId: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  scmSubmitFixRequest: Scm_Submit_Fix_Request;
  scmSubmitFixRequestId: Scalars['uuid']['output'];
};

/** aggregated selection of "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Aggregate = {
  __typename?: 'fix_to_scm_submit_fix_request_aggregate';
  aggregate?: Maybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Fields>;
  nodes: Array<Fix_To_Scm_Submit_Fix_Request>;
};

export type Fix_To_Scm_Submit_Fix_Request_Aggregate_Bool_Exp = {
  count?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Bool_Exp_Count>;
};

export type Fix_To_Scm_Submit_Fix_Request_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Aggregate_Fields = {
  __typename?: 'fix_to_scm_submit_fix_request_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_To_Scm_Submit_Fix_Request_Max_Fields>;
  min?: Maybe<Fix_To_Scm_Submit_Fix_Request_Min_Fields>;
};


/** aggregate fields of "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Max_Order_By>;
  min?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Min_Order_By>;
};

/** input type for inserting array relation for remote table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Arr_Rel_Insert_Input = {
  data: Array<Fix_To_Scm_Submit_Fix_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_On_Conflict>;
};

/** Boolean expression to filter rows from the table "fix_to_scm_submit_fix_request". All fields are combined with a logical 'AND'. */
export type Fix_To_Scm_Submit_Fix_Request_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>>;
  _not?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  scmSubmitFixRequest?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
  scmSubmitFixRequestId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_to_scm_submit_fix_request" */
export enum Fix_To_Scm_Submit_Fix_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  FixToScmSubmitFixRequestPkey = 'fix_to_scm_submit_fix_request_pkey'
}

/** input type for inserting data into table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Insert_Input = {
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  scmSubmitFixRequest?: InputMaybe<Scm_Submit_Fix_Request_Obj_Rel_Insert_Input>;
  scmSubmitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Fix_To_Scm_Submit_Fix_Request_Max_Fields = {
  __typename?: 'fix_to_scm_submit_fix_request_max_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  scmSubmitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Max_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  scmSubmitFixRequestId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Fix_To_Scm_Submit_Fix_Request_Min_Fields = {
  __typename?: 'fix_to_scm_submit_fix_request_min_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  scmSubmitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Min_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  scmSubmitFixRequestId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Mutation_Response = {
  __typename?: 'fix_to_scm_submit_fix_request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_To_Scm_Submit_Fix_Request>;
};

/** on_conflict condition type for table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_On_Conflict = {
  constraint: Fix_To_Scm_Submit_Fix_Request_Constraint;
  update_columns?: Array<Fix_To_Scm_Submit_Fix_Request_Update_Column>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_to_scm_submit_fix_request". */
export type Fix_To_Scm_Submit_Fix_Request_Order_By = {
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  scmSubmitFixRequest?: InputMaybe<Scm_Submit_Fix_Request_Order_By>;
  scmSubmitFixRequestId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_to_scm_submit_fix_request */
export type Fix_To_Scm_Submit_Fix_Request_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_to_scm_submit_fix_request" */
export enum Fix_To_Scm_Submit_Fix_Request_Select_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  ScmSubmitFixRequestId = 'scmSubmitFixRequestId'
}

/** input type for updating data in table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Set_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  scmSubmitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "fix_to_scm_submit_fix_request" */
export type Fix_To_Scm_Submit_Fix_Request_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_To_Scm_Submit_Fix_Request_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_To_Scm_Submit_Fix_Request_Stream_Cursor_Value_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  scmSubmitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "fix_to_scm_submit_fix_request" */
export enum Fix_To_Scm_Submit_Fix_Request_Update_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  ScmSubmitFixRequestId = 'scmSubmitFixRequestId'
}

export type Fix_To_Scm_Submit_Fix_Request_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_To_Scm_Submit_Fix_Request_Bool_Exp;
};

/** columns and relationships of "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request = {
  __typename?: 'fix_to_submit_fix_request';
  /** An object relationship */
  fix: Fix;
  fixId: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  submitFixRequest: Submit_Fix_Request;
  submitFixRequestId: Scalars['uuid']['output'];
};

/** aggregated selection of "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Aggregate = {
  __typename?: 'fix_to_submit_fix_request_aggregate';
  aggregate?: Maybe<Fix_To_Submit_Fix_Request_Aggregate_Fields>;
  nodes: Array<Fix_To_Submit_Fix_Request>;
};

export type Fix_To_Submit_Fix_Request_Aggregate_Bool_Exp = {
  count?: InputMaybe<Fix_To_Submit_Fix_Request_Aggregate_Bool_Exp_Count>;
};

export type Fix_To_Submit_Fix_Request_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Aggregate_Fields = {
  __typename?: 'fix_to_submit_fix_request_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Fix_To_Submit_Fix_Request_Max_Fields>;
  min?: Maybe<Fix_To_Submit_Fix_Request_Min_Fields>;
};


/** aggregate fields of "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Fix_To_Submit_Fix_Request_Max_Order_By>;
  min?: InputMaybe<Fix_To_Submit_Fix_Request_Min_Order_By>;
};

/** input type for inserting array relation for remote table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Arr_Rel_Insert_Input = {
  data: Array<Fix_To_Submit_Fix_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Fix_To_Submit_Fix_Request_On_Conflict>;
};

/** Boolean expression to filter rows from the table "fix_to_submit_fix_request". All fields are combined with a logical 'AND'. */
export type Fix_To_Submit_Fix_Request_Bool_Exp = {
  _and?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Bool_Exp>>;
  _not?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
  _or?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Bool_Exp>>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
  submitFixRequestId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "fix_to_submit_fix_request" */
export enum Fix_To_Submit_Fix_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  FixToSubmitFixRequestPkey = 'fix_to_submit_fix_request_pkey'
}

/** input type for inserting data into table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Insert_Input = {
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Obj_Rel_Insert_Input>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Fix_To_Submit_Fix_Request_Max_Fields = {
  __typename?: 'fix_to_submit_fix_request_max_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  submitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Max_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Fix_To_Submit_Fix_Request_Min_Fields = {
  __typename?: 'fix_to_submit_fix_request_min_fields';
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  submitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Min_Order_By = {
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Mutation_Response = {
  __typename?: 'fix_to_submit_fix_request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fix_To_Submit_Fix_Request>;
};

/** on_conflict condition type for table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_On_Conflict = {
  constraint: Fix_To_Submit_Fix_Request_Constraint;
  update_columns?: Array<Fix_To_Submit_Fix_Request_Update_Column>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};

/** Ordering options when selecting data from "fix_to_submit_fix_request". */
export type Fix_To_Submit_Fix_Request_Order_By = {
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fix_to_submit_fix_request */
export type Fix_To_Submit_Fix_Request_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fix_to_submit_fix_request" */
export enum Fix_To_Submit_Fix_Request_Select_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  SubmitFixRequestId = 'submitFixRequestId'
}

/** input type for updating data in table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Set_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "fix_to_submit_fix_request" */
export type Fix_To_Submit_Fix_Request_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fix_To_Submit_Fix_Request_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fix_To_Submit_Fix_Request_Stream_Cursor_Value_Input = {
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "fix_to_submit_fix_request" */
export enum Fix_To_Submit_Fix_Request_Update_Column {
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  SubmitFixRequestId = 'submitFixRequestId'
}

export type Fix_To_Submit_Fix_Request_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_To_Submit_Fix_Request_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_To_Submit_Fix_Request_Bool_Exp;
};

/** update columns of table "fix" */
export enum Fix_Update_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedOn = 'created_on',
  /** column name */
  DownloadedByUserId = 'downloadedByUserId',
  /** column name */
  EffortToApplyFix = 'effortToApplyFix',
  /** column name */
  FixContentHashId = 'fixContentHashId',
  /** column name */
  FixInfoFileId = 'fixInfoFileId',
  /** column name */
  FixRawContentHash = 'fixRawContentHash',
  /** column name */
  FixReportId = 'fixReportId',
  /** column name */
  GitBlameLogin = 'gitBlameLogin',
  /** column name */
  Id = 'id',
  /** column name */
  IsArchived = 'isArchived',
  /** column name */
  IsExpired = 'isExpired',
  /** column name */
  IssueLanguage = 'issueLanguage',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  ModifiedBy = 'modifiedBy',
  /** column name */
  PatchFileId = 'patchFileId',
  /** column name */
  State = 'state',
  /** column name */
  VulnerabilitySeverity = 'vulnerabilitySeverity'
}

export type Fix_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Fix_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fix_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fix_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Fix_Var_Pop_Fields = {
  __typename?: 'fix_var_pop_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by var_pop() on columns of table "fix" */
export type Fix_Var_Pop_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Fix_Var_Samp_Fields = {
  __typename?: 'fix_var_samp_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by var_samp() on columns of table "fix" */
export type Fix_Var_Samp_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Fix_Variance_Fields = {
  __typename?: 'fix_variance_fields';
  confidence?: Maybe<Scalars['Float']['output']>;
  /** A computed field, executes function "fix_number_of_vulnerability_issue" */
  numberOfVulnerabilityIssues?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "get_severity_value" */
  severityValue?: Maybe<Scalars['Int']['output']>;
};

/** order by variance() on columns of table "fix" */
export type Fix_Variance_Order_By = {
  confidence?: InputMaybe<Order_By>;
};

/** columns and relationships of "integration" */
export type Integration = {
  __typename?: 'integration';
  accessToken?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  organization?: Maybe<Organization>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  type: Integration_Type_Enum;
  /** An object relationship */
  user: User;
  userId: Scalars['uuid']['output'];
  values?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "integration" */
export type IntegrationValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "integration" */
export type Integration_Aggregate = {
  __typename?: 'integration_aggregate';
  aggregate?: Maybe<Integration_Aggregate_Fields>;
  nodes: Array<Integration>;
};

export type Integration_Aggregate_Bool_Exp = {
  count?: InputMaybe<Integration_Aggregate_Bool_Exp_Count>;
};

export type Integration_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Integration_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Integration_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "integration" */
export type Integration_Aggregate_Fields = {
  __typename?: 'integration_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Integration_Max_Fields>;
  min?: Maybe<Integration_Min_Fields>;
};


/** aggregate fields of "integration" */
export type Integration_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Integration_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "integration" */
export type Integration_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Integration_Max_Order_By>;
  min?: InputMaybe<Integration_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Integration_Append_Input = {
  values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "integration" */
export type Integration_Arr_Rel_Insert_Input = {
  data: Array<Integration_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Integration_On_Conflict>;
};

/** Boolean expression to filter rows from the table "integration". All fields are combined with a logical 'AND'. */
export type Integration_Bool_Exp = {
  _and?: InputMaybe<Array<Integration_Bool_Exp>>;
  _not?: InputMaybe<Integration_Bool_Exp>;
  _or?: InputMaybe<Array<Integration_Bool_Exp>>;
  accessToken?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  type?: InputMaybe<Integration_Type_Enum_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
  values?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "integration" */
export enum Integration_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntegrationPkey = 'integration_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Integration_Delete_At_Path_Input = {
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Integration_Delete_Elem_Input = {
  values?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Integration_Delete_Key_Input = {
  values?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "integration" */
export type Integration_Insert_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Integration_Type_Enum>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Integration_Max_Fields = {
  __typename?: 'integration_max_fields';
  accessToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "integration" */
export type Integration_Max_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Integration_Min_Fields = {
  __typename?: 'integration_min_fields';
  accessToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "integration" */
export type Integration_Min_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "integration" */
export type Integration_Mutation_Response = {
  __typename?: 'integration_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Integration>;
};

/** on_conflict condition type for table "integration" */
export type Integration_On_Conflict = {
  constraint: Integration_Constraint;
  update_columns?: Array<Integration_Update_Column>;
  where?: InputMaybe<Integration_Bool_Exp>;
};

/** Ordering options when selecting data from "integration". */
export type Integration_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  userId?: InputMaybe<Order_By>;
  values?: InputMaybe<Order_By>;
};

/** primary key columns input for table: integration */
export type Integration_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Integration_Prepend_Input = {
  values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "integration" */
export enum Integration_Select_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId',
  /** column name */
  Values = 'values'
}

/** input type for updating data in table "integration" */
export type Integration_Set_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Integration_Type_Enum>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "integration" */
export type Integration_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Integration_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Integration_Stream_Cursor_Value_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Integration_Type_Enum>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** columns and relationships of "integration_type" */
export type Integration_Type = {
  __typename?: 'integration_type';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "integration_type" */
export type Integration_Type_Aggregate = {
  __typename?: 'integration_type_aggregate';
  aggregate?: Maybe<Integration_Type_Aggregate_Fields>;
  nodes: Array<Integration_Type>;
};

/** aggregate fields of "integration_type" */
export type Integration_Type_Aggregate_Fields = {
  __typename?: 'integration_type_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Integration_Type_Max_Fields>;
  min?: Maybe<Integration_Type_Min_Fields>;
};


/** aggregate fields of "integration_type" */
export type Integration_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Integration_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "integration_type". All fields are combined with a logical 'AND'. */
export type Integration_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Integration_Type_Bool_Exp>>;
  _not?: InputMaybe<Integration_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Integration_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "integration_type" */
export enum Integration_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  IntegrationTypePkey = 'integration_type_pkey'
}

export enum Integration_Type_Enum {
  /** checkmarx */
  Checkmarx = 'checkmarx'
}

/** Boolean expression to compare columns of type "integration_type_enum". All fields are combined with logical 'AND'. */
export type Integration_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Integration_Type_Enum>;
  _in?: InputMaybe<Array<Integration_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Integration_Type_Enum>;
  _nin?: InputMaybe<Array<Integration_Type_Enum>>;
};

/** input type for inserting data into table "integration_type" */
export type Integration_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Integration_Type_Max_Fields = {
  __typename?: 'integration_type_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Integration_Type_Min_Fields = {
  __typename?: 'integration_type_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "integration_type" */
export type Integration_Type_Mutation_Response = {
  __typename?: 'integration_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Integration_Type>;
};

/** on_conflict condition type for table "integration_type" */
export type Integration_Type_On_Conflict = {
  constraint: Integration_Type_Constraint;
  update_columns?: Array<Integration_Type_Update_Column>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "integration_type". */
export type Integration_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: integration_type */
export type Integration_Type_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "integration_type" */
export enum Integration_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "integration_type" */
export type Integration_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "integration_type" */
export type Integration_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Integration_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Integration_Type_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "integration_type" */
export enum Integration_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Integration_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Integration_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Integration_Type_Bool_Exp;
};

/** update columns of table "integration" */
export enum Integration_Update_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId',
  /** column name */
  Values = 'values'
}

export type Integration_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Integration_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Integration_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Integration_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Integration_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Integration_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Integration_Set_Input>;
  /** filter the rows which have to be updated */
  where: Integration_Bool_Exp;
};

/** columns and relationships of "invitation" */
export type Invitation = {
  __typename?: 'invitation';
  id: Scalars['uuid']['output'];
  /** An array relationship */
  invitationToProjects: Array<Invitation_To_Projects>;
  /** An aggregate relationship */
  invitationToProjects_aggregate: Invitation_To_Projects_Aggregate;
  invitedAt: Scalars['date']['output'];
  invitedBy: Scalars['uuid']['output'];
  /** An object relationship */
  invitedByUserData: User;
  organization: Scalars['uuid']['output'];
  /** An object relationship */
  organizationData: Organization;
  role: Scalars['uuid']['output'];
  /** An object relationship */
  roleData: Organization_To_Organization_Role;
  status: Invitation_Status_Type_Enum;
  /** An object relationship */
  userData?: Maybe<User>;
  userEmail: Scalars['String']['output'];
};


/** columns and relationships of "invitation" */
export type InvitationInvitationToProjectsArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


/** columns and relationships of "invitation" */
export type InvitationInvitationToProjects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};

/** aggregated selection of "invitation" */
export type Invitation_Aggregate = {
  __typename?: 'invitation_aggregate';
  aggregate?: Maybe<Invitation_Aggregate_Fields>;
  nodes: Array<Invitation>;
};

/** aggregate fields of "invitation" */
export type Invitation_Aggregate_Fields = {
  __typename?: 'invitation_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Invitation_Max_Fields>;
  min?: Maybe<Invitation_Min_Fields>;
};


/** aggregate fields of "invitation" */
export type Invitation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invitation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "invitation". All fields are combined with a logical 'AND'. */
export type Invitation_Bool_Exp = {
  _and?: InputMaybe<Array<Invitation_Bool_Exp>>;
  _not?: InputMaybe<Invitation_Bool_Exp>;
  _or?: InputMaybe<Array<Invitation_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invitationToProjects?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
  invitationToProjects_aggregate?: InputMaybe<Invitation_To_Projects_Aggregate_Bool_Exp>;
  invitedAt?: InputMaybe<Date_Comparison_Exp>;
  invitedBy?: InputMaybe<Uuid_Comparison_Exp>;
  invitedByUserData?: InputMaybe<User_Bool_Exp>;
  organization?: InputMaybe<Uuid_Comparison_Exp>;
  organizationData?: InputMaybe<Organization_Bool_Exp>;
  role?: InputMaybe<Uuid_Comparison_Exp>;
  roleData?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  status?: InputMaybe<Invitation_Status_Type_Enum_Comparison_Exp>;
  userData?: InputMaybe<User_Bool_Exp>;
  userEmail?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invitation" */
export enum Invitation_Constraint {
  /** unique or primary key constraint on columns "id" */
  InvitationPkey = 'invitation_pkey'
}

/** input type for inserting data into table "invitation" */
export type Invitation_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationToProjects?: InputMaybe<Invitation_To_Projects_Arr_Rel_Insert_Input>;
  invitedAt?: InputMaybe<Scalars['date']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedByUserData?: InputMaybe<User_Obj_Rel_Insert_Input>;
  organization?: InputMaybe<Scalars['uuid']['input']>;
  organizationData?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  role?: InputMaybe<Scalars['uuid']['input']>;
  roleData?: InputMaybe<Organization_To_Organization_Role_Obj_Rel_Insert_Input>;
  status?: InputMaybe<Invitation_Status_Type_Enum>;
  userData?: InputMaybe<User_Obj_Rel_Insert_Input>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Invitation_Max_Fields = {
  __typename?: 'invitation_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  invitedAt?: Maybe<Scalars['date']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  organization?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['uuid']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Invitation_Min_Fields = {
  __typename?: 'invitation_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  invitedAt?: Maybe<Scalars['date']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  organization?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['uuid']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "invitation" */
export type Invitation_Mutation_Response = {
  __typename?: 'invitation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Invitation>;
};

/** on_conflict condition type for table "invitation" */
export type Invitation_On_Conflict = {
  constraint: Invitation_Constraint;
  update_columns?: Array<Invitation_Update_Column>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};

/** Ordering options when selecting data from "invitation". */
export type Invitation_Order_By = {
  id?: InputMaybe<Order_By>;
  invitationToProjects_aggregate?: InputMaybe<Invitation_To_Projects_Aggregate_Order_By>;
  invitedAt?: InputMaybe<Order_By>;
  invitedBy?: InputMaybe<Order_By>;
  invitedByUserData?: InputMaybe<User_Order_By>;
  organization?: InputMaybe<Order_By>;
  organizationData?: InputMaybe<Organization_Order_By>;
  role?: InputMaybe<Order_By>;
  roleData?: InputMaybe<Organization_To_Organization_Role_Order_By>;
  status?: InputMaybe<Order_By>;
  userData?: InputMaybe<User_Order_By>;
  userEmail?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invitation */
export type Invitation_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "invitation" */
export enum Invitation_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  InvitedAt = 'invitedAt',
  /** column name */
  InvitedBy = 'invitedBy',
  /** column name */
  Organization = 'organization',
  /** column name */
  Role = 'role',
  /** column name */
  Status = 'status',
  /** column name */
  UserEmail = 'userEmail'
}

/** input type for updating data in table "invitation" */
export type Invitation_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitedAt?: InputMaybe<Scalars['date']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Invitation_Status_Type_Enum>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "invitation_status_type" */
export type Invitation_Status_Type = {
  __typename?: 'invitation_status_type';
  comment?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "invitation_status_type" */
export type Invitation_Status_Type_Aggregate = {
  __typename?: 'invitation_status_type_aggregate';
  aggregate?: Maybe<Invitation_Status_Type_Aggregate_Fields>;
  nodes: Array<Invitation_Status_Type>;
};

/** aggregate fields of "invitation_status_type" */
export type Invitation_Status_Type_Aggregate_Fields = {
  __typename?: 'invitation_status_type_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Invitation_Status_Type_Max_Fields>;
  min?: Maybe<Invitation_Status_Type_Min_Fields>;
};


/** aggregate fields of "invitation_status_type" */
export type Invitation_Status_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invitation_Status_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "invitation_status_type". All fields are combined with a logical 'AND'. */
export type Invitation_Status_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Invitation_Status_Type_Bool_Exp>>;
  _not?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Invitation_Status_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invitation_status_type" */
export enum Invitation_Status_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  InvitationStatusTypePkey = 'invitation_status_type_pkey'
}

export enum Invitation_Status_Type_Enum {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

/** Boolean expression to compare columns of type "invitation_status_type_enum". All fields are combined with logical 'AND'. */
export type Invitation_Status_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Invitation_Status_Type_Enum>;
  _in?: InputMaybe<Array<Invitation_Status_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Invitation_Status_Type_Enum>;
  _nin?: InputMaybe<Array<Invitation_Status_Type_Enum>>;
};

/** input type for inserting data into table "invitation_status_type" */
export type Invitation_Status_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Invitation_Status_Type_Max_Fields = {
  __typename?: 'invitation_status_type_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Invitation_Status_Type_Min_Fields = {
  __typename?: 'invitation_status_type_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "invitation_status_type" */
export type Invitation_Status_Type_Mutation_Response = {
  __typename?: 'invitation_status_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Invitation_Status_Type>;
};

/** on_conflict condition type for table "invitation_status_type" */
export type Invitation_Status_Type_On_Conflict = {
  constraint: Invitation_Status_Type_Constraint;
  update_columns?: Array<Invitation_Status_Type_Update_Column>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "invitation_status_type". */
export type Invitation_Status_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invitation_status_type */
export type Invitation_Status_Type_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "invitation_status_type" */
export enum Invitation_Status_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "invitation_status_type" */
export type Invitation_Status_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "invitation_status_type" */
export type Invitation_Status_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invitation_Status_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invitation_Status_Type_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "invitation_status_type" */
export enum Invitation_Status_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Invitation_Status_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invitation_Status_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invitation_Status_Type_Bool_Exp;
};

/** Streaming cursor of the table "invitation" */
export type Invitation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invitation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invitation_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitedAt?: InputMaybe<Scalars['date']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Invitation_Status_Type_Enum>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};

/** This table creates many-to -any relationship between the the projects and the invitations */
export type Invitation_To_Projects = {
  __typename?: 'invitation_to_projects';
  id: Scalars['uuid']['output'];
  invitationId: Scalars['uuid']['output'];
  /** An object relationship */
  project: Project;
  projectId: Scalars['uuid']['output'];
};

/** aggregated selection of "invitation_to_projects" */
export type Invitation_To_Projects_Aggregate = {
  __typename?: 'invitation_to_projects_aggregate';
  aggregate?: Maybe<Invitation_To_Projects_Aggregate_Fields>;
  nodes: Array<Invitation_To_Projects>;
};

export type Invitation_To_Projects_Aggregate_Bool_Exp = {
  count?: InputMaybe<Invitation_To_Projects_Aggregate_Bool_Exp_Count>;
};

export type Invitation_To_Projects_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "invitation_to_projects" */
export type Invitation_To_Projects_Aggregate_Fields = {
  __typename?: 'invitation_to_projects_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Invitation_To_Projects_Max_Fields>;
  min?: Maybe<Invitation_To_Projects_Min_Fields>;
};


/** aggregate fields of "invitation_to_projects" */
export type Invitation_To_Projects_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "invitation_to_projects" */
export type Invitation_To_Projects_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invitation_To_Projects_Max_Order_By>;
  min?: InputMaybe<Invitation_To_Projects_Min_Order_By>;
};

/** input type for inserting array relation for remote table "invitation_to_projects" */
export type Invitation_To_Projects_Arr_Rel_Insert_Input = {
  data: Array<Invitation_To_Projects_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Invitation_To_Projects_On_Conflict>;
};

/** Boolean expression to filter rows from the table "invitation_to_projects". All fields are combined with a logical 'AND'. */
export type Invitation_To_Projects_Bool_Exp = {
  _and?: InputMaybe<Array<Invitation_To_Projects_Bool_Exp>>;
  _not?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
  _or?: InputMaybe<Array<Invitation_To_Projects_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invitationId?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "invitation_to_projects" */
export enum Invitation_To_Projects_Constraint {
  /** unique or primary key constraint on columns "project_id", "invitation_id" */
  InvitationToProjectsInvitationIdProjectIdKey = 'invitation_to_projects_invitation_id_project_id_key',
  /** unique or primary key constraint on columns "id" */
  InvitationToProjectsPkey = 'invitation_to_projects_pkey'
}

/** input type for inserting data into table "invitation_to_projects" */
export type Invitation_To_Projects_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationId?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Invitation_To_Projects_Max_Fields = {
  __typename?: 'invitation_to_projects_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  invitationId?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "invitation_to_projects" */
export type Invitation_To_Projects_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  invitationId?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invitation_To_Projects_Min_Fields = {
  __typename?: 'invitation_to_projects_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  invitationId?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "invitation_to_projects" */
export type Invitation_To_Projects_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  invitationId?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invitation_to_projects" */
export type Invitation_To_Projects_Mutation_Response = {
  __typename?: 'invitation_to_projects_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Invitation_To_Projects>;
};

/** on_conflict condition type for table "invitation_to_projects" */
export type Invitation_To_Projects_On_Conflict = {
  constraint: Invitation_To_Projects_Constraint;
  update_columns?: Array<Invitation_To_Projects_Update_Column>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};

/** Ordering options when selecting data from "invitation_to_projects". */
export type Invitation_To_Projects_Order_By = {
  id?: InputMaybe<Order_By>;
  invitationId?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invitation_to_projects */
export type Invitation_To_Projects_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "invitation_to_projects" */
export enum Invitation_To_Projects_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  InvitationId = 'invitationId',
  /** column name */
  ProjectId = 'projectId'
}

/** input type for updating data in table "invitation_to_projects" */
export type Invitation_To_Projects_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationId?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "invitation_to_projects" */
export type Invitation_To_Projects_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invitation_To_Projects_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invitation_To_Projects_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationId?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "invitation_to_projects" */
export enum Invitation_To_Projects_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  InvitationId = 'invitationId',
  /** column name */
  ProjectId = 'projectId'
}

export type Invitation_To_Projects_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invitation_To_Projects_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invitation_To_Projects_Bool_Exp;
};

/** update columns of table "invitation" */
export enum Invitation_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  InvitedAt = 'invitedAt',
  /** column name */
  InvitedBy = 'invitedBy',
  /** column name */
  Organization = 'organization',
  /** column name */
  Role = 'role',
  /** column name */
  Status = 'status',
  /** column name */
  UserEmail = 'userEmail'
}

export type Invitation_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invitation_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invitation_Bool_Exp;
};

/** enum table for issue langauges */
export type IssueLanguage = {
  __typename?: 'issueLanguage';
  comment?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  fixes: Array<Fix>;
  /** An aggregate relationship */
  fixes_aggregate: Fix_Aggregate;
  value: Scalars['String']['output'];
};


/** enum table for issue langauges */
export type IssueLanguageFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** enum table for issue langauges */
export type IssueLanguageFixes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};

/** aggregated selection of "issue_language" */
export type IssueLanguage_Aggregate = {
  __typename?: 'issueLanguage_aggregate';
  aggregate?: Maybe<IssueLanguage_Aggregate_Fields>;
  nodes: Array<IssueLanguage>;
};

/** aggregate fields of "issue_language" */
export type IssueLanguage_Aggregate_Fields = {
  __typename?: 'issueLanguage_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<IssueLanguage_Max_Fields>;
  min?: Maybe<IssueLanguage_Min_Fields>;
};


/** aggregate fields of "issue_language" */
export type IssueLanguage_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<IssueLanguage_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "issue_language". All fields are combined with a logical 'AND'. */
export type IssueLanguage_Bool_Exp = {
  _and?: InputMaybe<Array<IssueLanguage_Bool_Exp>>;
  _not?: InputMaybe<IssueLanguage_Bool_Exp>;
  _or?: InputMaybe<Array<IssueLanguage_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  fixes?: InputMaybe<Fix_Bool_Exp>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "issue_language" */
export enum IssueLanguage_Constraint {
  /** unique or primary key constraint on columns "value" */
  IssueLangaguePkey = 'issue_langague_pkey'
}

export enum IssueLanguage_Enum {
  /** C# */
  CSharp = 'CSharp',
  /** C++ */
  Cpp = 'Cpp',
  /** Java */
  Java = 'Java',
  /** JavaScript */
  JavaScript = 'JavaScript',
  /** Python */
  Python = 'Python',
  /** SQL */
  Sql = 'SQL',
  /** XML */
  Xml = 'XML'
}

/** Boolean expression to compare columns of type "issueLanguage_enum". All fields are combined with logical 'AND'. */
export type IssueLanguage_Enum_Comparison_Exp = {
  _eq?: InputMaybe<IssueLanguage_Enum>;
  _in?: InputMaybe<Array<IssueLanguage_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<IssueLanguage_Enum>;
  _nin?: InputMaybe<Array<IssueLanguage_Enum>>;
};

/** input type for inserting data into table "issue_language" */
export type IssueLanguage_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  fixes?: InputMaybe<Fix_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type IssueLanguage_Max_Fields = {
  __typename?: 'issueLanguage_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type IssueLanguage_Min_Fields = {
  __typename?: 'issueLanguage_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "issue_language" */
export type IssueLanguage_Mutation_Response = {
  __typename?: 'issueLanguage_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<IssueLanguage>;
};

/** on_conflict condition type for table "issue_language" */
export type IssueLanguage_On_Conflict = {
  constraint: IssueLanguage_Constraint;
  update_columns?: Array<IssueLanguage_Update_Column>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};

/** Ordering options when selecting data from "issue_language". */
export type IssueLanguage_Order_By = {
  comment?: InputMaybe<Order_By>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: issue_language */
export type IssueLanguage_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "issue_language" */
export enum IssueLanguage_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "issue_language" */
export type IssueLanguage_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "issueLanguage" */
export type IssueLanguage_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: IssueLanguage_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type IssueLanguage_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "issue_language" */
export enum IssueLanguage_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type IssueLanguage_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<IssueLanguage_Set_Input>;
  /** filter the rows which have to be updated */
  where: IssueLanguage_Bool_Exp;
};

/** columns and relationships of "issue_type" */
export type IssueType = {
  __typename?: 'issueType';
  comment: Scalars['String']['output'];
  /** An array relationship */
  fixes: Array<Fix>;
  /** An aggregate relationship */
  fixes_aggregate: Fix_Aggregate;
  value: Scalars['String']['output'];
};


/** columns and relationships of "issue_type" */
export type IssueTypeFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** columns and relationships of "issue_type" */
export type IssueTypeFixes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};

/** aggregated selection of "issue_type" */
export type IssueType_Aggregate = {
  __typename?: 'issueType_aggregate';
  aggregate?: Maybe<IssueType_Aggregate_Fields>;
  nodes: Array<IssueType>;
};

/** aggregate fields of "issue_type" */
export type IssueType_Aggregate_Fields = {
  __typename?: 'issueType_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<IssueType_Max_Fields>;
  min?: Maybe<IssueType_Min_Fields>;
};


/** aggregate fields of "issue_type" */
export type IssueType_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<IssueType_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "issue_type". All fields are combined with a logical 'AND'. */
export type IssueType_Bool_Exp = {
  _and?: InputMaybe<Array<IssueType_Bool_Exp>>;
  _not?: InputMaybe<IssueType_Bool_Exp>;
  _or?: InputMaybe<Array<IssueType_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  fixes?: InputMaybe<Fix_Bool_Exp>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "issue_type" */
export enum IssueType_Constraint {
  /** unique or primary key constraint on columns "value" */
  IssueTypePkey = 'issue_type_pkey'
}

export enum IssueType_Enum {
  /** Disabling auto-escaping makes the code more vulnerable to XSS */
  AutoEscapeFalse = 'AUTO_ESCAPE_FALSE',
  /** Client DOM Stored Code Injection */
  ClientDomStoredCodeInjection = 'CLIENT_DOM_STORED_CODE_INJECTION',
  /** Command Injection */
  CmDi = 'CMDi',
  /** Command Injection: relative path command */
  CmDiRelativePathCommand = 'CMDi_relative_path_command',
  /** A data member and a function have the same name which can be confusing to the developer */
  ConfusingNaming = 'CONFUSING_NAMING',
  /** Use of dangerous function */
  DangerousFunctionOverflow = 'DANGEROUS_FUNCTION_OVERFLOW',
  /** Dead Code: Unused Field */
  DeadCodeUnusedField = 'DEAD_CODE_UNUSED_FIELD',
  /** Running the application in debug mode */
  DebugEnabled = 'DEBUG_ENABLED',
  /** Default definer rights in package or object definition */
  DefaultRightsInObjDefinition = 'DEFAULT_RIGHTS_IN_OBJ_DEFINITION',
  /** Deprecated Function */
  DeprecatedFunction = 'DEPRECATED_FUNCTION',
  /** A denial of service by exploiting string builder */
  DosStringBuilder = 'DOS_STRING_BUILDER',
  /** Erroneous string compare */
  ErroneousStringCompare = 'ERRONEOUS_STRING_COMPARE',
  /** Error Condition Without Action */
  ErrorCondtionWithoutAction = 'ERROR_CONDTION_WITHOUT_ACTION',
  /** GraphQl Depth Limit */
  GraphqlDepthLimit = 'GRAPHQL_DEPTH_LIMIT',
  /** Hardcoded Domain in HTML */
  HardcodedDomainInHtml = 'HARDCODED_DOMAIN_IN_HTML',
  /** Hardcoded Secrets */
  HardcodedSecrets = 'HARDCODED_SECRETS',
  /** Header Manipulation */
  HeaderManipulation = 'HEADER_MANIPULATION',
  /** Heap Inspection by an attacker to discover secrets in memory */
  HeapInspection = 'HEAP_INSPECTION',
  /** System Information Leak: HTML Comment in JSP */
  HtmlCommentInJsp = 'HTML_COMMENT_IN_JSP',
  /** HTTP only cookie */
  HttpOnlyCookie = 'HTTP_ONLY_COOKIE',
  /** HTTP response splitting */
  HttpResponseSplitting = 'HTTP_RESPONSE_SPLITTING',
  /** Client use of iframe without sandbox */
  IframeWithoutSandbox = 'IFRAME_WITHOUT_SANDBOX',
  /** Improper Exception Handling */
  ImproperExceptionHandling = 'IMPROPER_EXCEPTION_HANDLING',
  /** A resource was defined without proper release */
  ImproperResourceShutdownOrRelease = 'IMPROPER_RESOURCE_SHUTDOWN_OR_RELEASE',
  /** Incomplete Hostname Regex */
  IncompleteHostnameRegex = 'INCOMPLETE_HOSTNAME_REGEX',
  /** A case where the validation on the url is partial */
  IncompleteUrlSanitization = 'INCOMPLETE_URL_SANITIZATION',
  /** Incomplete URL Scheme Check */
  IncompleteUrlSchemeCheck = 'INCOMPLETE_URL_SCHEME_CHECK',
  /** Information Exposure via Headers */
  InformationExposureViaHeaders = 'INFORMATION_EXPOSURE_VIA_HEADERS',
  /** Insecure Binder Configuration */
  InsecureBinderConfiguration = 'INSECURE_BINDER_CONFIGURATION',
  /** HTTP insecure cookie */
  InsecureCookie = 'INSECURE_COOKIE',
  /** Insecure Randomness */
  InsecureRandomness = 'INSECURE_RANDOMNESS',
  /** Insufficient Logging of Sensitive Operations */
  InsufficientLogging = 'INSUFFICIENT_LOGGING',
  /** Client jQuery deprecated symbols */
  JqueryDeprecatedSymbols = 'JQUERY_DEPRECATED_SYMBOLS',
  /** Leftover debug code */
  LeftoverDebugCode = 'LEFTOVER_DEBUG_CODE',
  /** A string is used in locale dependent comparison which can cause bugs */
  LocaleDependentComparison = 'LOCALE_DEPENDENT_COMPARISON',
  /** Log Forging / Injection */
  LogForging = 'LOG_FORGING',
  /** Missing Anti-Forgery Validation */
  MissingAntiforgeryValidation = 'MISSING_ANTIFORGERY_VALIDATION',
  /** The program might dereference a null-pointer because it does not check the return value of a function that might return null */
  MissingCheckAgainstNull = 'MISSING_CHECK_AGAINST_NULL',
  /** Missing CSP Header */
  MissingCspHeader = 'MISSING_CSP_HEADER',
  /** Missing equals or hashcode method */
  MissingEqualsOrHashcode = 'MISSING_EQUALS_OR_HASHCODE',
  /** Missing HSTS Header */
  MissingHstsHeader = 'MISSING_HSTS_HEADER',
  /** Non-final public static field */
  NonFinalPublicStaticField = 'NON_FINAL_PUBLIC_STATIC_FIELD',
  /** Fields that are only assigned in the constructor should be readonly */
  NonReadonlyField = 'NON_READONLY_FIELD',
  /** No equals method */
  NoEquivalenceMethod = 'NO_EQUIVALENCE_METHOD',
  /** Missing rate limiting */
  NoLimitsOrThrottling = 'NO_LIMITS_OR_THROTTLING',
  /** Null Dereference */
  NullDereference = 'NULL_DEREFERENCE',
  /** Open Redirect */
  OpenRedirect = 'OPEN_REDIRECT',
  /** The catch block handles a broad swath of exceptions, potentially trapping dissimilar issues or problems that should not be dealt with at this point in the program */
  OverlyBroadCatch = 'OVERLY_BROAD_CATCH',
  /** Overly Large Range */
  OverlyLargeRange = 'OVERLY_LARGE_RANGE',
  /** The code has a password stored in a comment */
  PasswordInComment = 'PASSWORD_IN_COMMENT',
  /** Catch blocks with nothing inside or just a comment. */
  PoorErrorHandlingEmptyCatchBlock = 'POOR_ERROR_HANDLING_EMPTY_CATCH_BLOCK',
  /** Privacy Violation */
  PrivacyViolation = 'PRIVACY_VIOLATION',
  /** Prototype Pollution */
  PrototypePollution = 'PROTOTYPE_POLLUTION',
  /** Path Traversal */
  Pt = 'PT',
  /** Race Condition: Format Flaw */
  RaceConditionFormatFlaw = 'RACE_CONDITION_FORMAT_FLAW',
  /** Regular Expression Injection */
  RegexInjection = 'REGEX_INJECTION',
  /** SQL Injection */
  SqlInjection = 'SQL_Injection',
  /** Server Side Request Forgery */
  Ssrf = 'SSRF',
  /** Composite format strings should be used correctly */
  StringFormatMisuse = 'STRING_FORMAT_MISUSE',
  /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
  SystemInformationLeak = 'SYSTEM_INFORMATION_LEAK',
  /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
  SystemInformationLeakExternal = 'SYSTEM_INFORMATION_LEAK_EXTERNAL',
  /** Trust Boundary Violation */
  TrustBoundaryViolation = 'TRUST_BOUNDARY_VIOLATION',
  /** HTTP request parameter may be either an array or a string */
  TypeConfusion = 'TYPE_CONFUSION',
  /** Unchecked loop condition */
  UncheckedLoopCondition = 'UNCHECKED_LOOP_CONDITION',
  /** Unsafe deserialization of untrusted data */
  UnsafeDeserialization = 'UNSAFE_DESERIALIZATION',
  /** Unsafe use of target blank */
  UnsafeTargetBlank = 'UNSAFE_TARGET_BLANK',
  /** A public method agument is not checked for null */
  UnvalidatedPublicMethodArgument = 'UNVALIDATED_PUBLIC_METHOD_ARGUMENT',
  /** Useless regular-expression character escape */
  UselessRegexpCharEscape = 'USELESS_REGEXP_CHAR_ESCAPE',
  /** Printing logs in assorted way to the sys out/err */
  UseOfSystemOutputStream = 'USE_OF_SYSTEM_OUTPUT_STREAM',
  /** A variable is assigned a value that is never read */
  ValueNeverRead = 'VALUE_NEVER_READ',
  /** Value Shadowing */
  ValueShadowing = 'VALUE_SHADOWING',
  /** WCF Misconfiguration: Insufficient Logging */
  WcfMisconfigurationInsufficientLogging = 'WCF_MISCONFIGURATION_INSUFFICIENT_LOGGING',
  /** WCF Misconfiguration: Throttling Not Enabled */
  WcfMisconfigurationThrottlingNotEnabled = 'WCF_MISCONFIGURATION_THROTTLING_NOT_ENABLED',
  /** Unbounded occurrences can lead to resources exhaustion and ultimately a denial of service */
  WeakXmlSchemaUnboundedOccurrences = 'WEAK_XML_SCHEMA_UNBOUNDED_OCCURRENCES',
  /** Cross Site Scripting */
  Xss = 'XSS',
  /** XXE */
  Xxe = 'XXE',
  /** Zip Slip is a form of directory traversal that can be exploited by extracting files from an archive */
  ZipSlip = 'ZIP_SLIP'
}

/** Boolean expression to compare columns of type "issueType_enum". All fields are combined with logical 'AND'. */
export type IssueType_Enum_Comparison_Exp = {
  _eq?: InputMaybe<IssueType_Enum>;
  _in?: InputMaybe<Array<IssueType_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<IssueType_Enum>;
  _nin?: InputMaybe<Array<IssueType_Enum>>;
};

/** input type for inserting data into table "issue_type" */
export type IssueType_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  fixes?: InputMaybe<Fix_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type IssueType_Max_Fields = {
  __typename?: 'issueType_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type IssueType_Min_Fields = {
  __typename?: 'issueType_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "issue_type" */
export type IssueType_Mutation_Response = {
  __typename?: 'issueType_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<IssueType>;
};

/** on_conflict condition type for table "issue_type" */
export type IssueType_On_Conflict = {
  constraint: IssueType_Constraint;
  update_columns?: Array<IssueType_Update_Column>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};

/** Ordering options when selecting data from "issue_type". */
export type IssueType_Order_By = {
  comment?: InputMaybe<Order_By>;
  fixes_aggregate?: InputMaybe<Fix_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: issue_type */
export type IssueType_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "issue_type" */
export enum IssueType_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "issue_type" */
export type IssueType_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "issueType" */
export type IssueType_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: IssueType_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type IssueType_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "issue_type" */
export enum IssueType_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type IssueType_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<IssueType_Set_Input>;
  /** filter the rows which have to be updated */
  where: IssueType_Bool_Exp;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  addUserToOrganization?: Maybe<AddUserToOrganizationResponse>;
  addUsersToProject?: Maybe<AddUsersToProjectResponse>;
  applySimilarAnswers?: Maybe<Scalars['Void']['output']>;
  autoPrAnalysis?: Maybe<AutoPrResponse>;
  changeUserOrgRole?: Maybe<StatusQueryResponse>;
  changeUserProjectRole?: Maybe<BaseResponse>;
  claimInvitation?: Maybe<ClaimInvitationResponse>;
  commitToDifferentBranch?: Maybe<SubmitToScmResponse>;
  commitToSameBranch?: Maybe<SubmitToScmResponse>;
  createBrokerApiToken?: Maybe<CreateBrokerApiTokenResponse>;
  createOrUpdateRepositorySecret?: Maybe<CreateOrUpdateRepositorySecretResponse>;
  createPr?: Maybe<CreatePrResponse>;
  createProject: CreateProjectResponse;
  createToken?: Maybe<CreateTokenResponse>;
  deleteProject?: Maybe<StatusQueryResponse>;
  deleteUserFromOrganization?: Maybe<StatusQueryResponse>;
  /** delete data from the table: "api_token" */
  delete_api_token?: Maybe<Api_Token_Mutation_Response>;
  /** delete single row from the table: "api_token" */
  delete_api_token_by_pk?: Maybe<Api_Token>;
  /** delete data from the table: "broker_host" */
  delete_broker_host?: Maybe<Broker_Host_Mutation_Response>;
  /** delete single row from the table: "broker_host" */
  delete_broker_host_by_pk?: Maybe<Broker_Host>;
  /** delete data from the table: "broker_token" */
  delete_broker_token?: Maybe<Broker_Token_Mutation_Response>;
  /** delete single row from the table: "broker_token" */
  delete_broker_token_by_pk?: Maybe<Broker_Token>;
  /** delete data from the table: "cli_login" */
  delete_cli_login?: Maybe<Cli_Login_Mutation_Response>;
  /** delete single row from the table: "cli_login" */
  delete_cli_login_by_pk?: Maybe<Cli_Login>;
  /** delete data from the table: "effort_to_apply_fix" */
  delete_effort_to_apply_fix?: Maybe<Effort_To_Apply_Fix_Mutation_Response>;
  /** delete single row from the table: "effort_to_apply_fix" */
  delete_effort_to_apply_fix_by_pk?: Maybe<Effort_To_Apply_Fix>;
  /** delete data from the table: "file" */
  delete_file?: Maybe<File_Mutation_Response>;
  /** delete single row from the table: "file" */
  delete_file_by_pk?: Maybe<File>;
  /** delete data from the table: "fix" */
  delete_fix?: Maybe<Fix_Mutation_Response>;
  /** delete data from the table: "fix_answer" */
  delete_fixAnswer?: Maybe<FixAnswer_Mutation_Response>;
  /** delete single row from the table: "fix_answer" */
  delete_fixAnswer_by_pk?: Maybe<FixAnswer>;
  /** delete data from the table: "fix_file" */
  delete_fixFile?: Maybe<FixFile_Mutation_Response>;
  /** delete single row from the table: "fix_file" */
  delete_fixFile_by_pk?: Maybe<FixFile>;
  /** delete data from the table: "fix_report" */
  delete_fixReport?: Maybe<FixReport_Mutation_Response>;
  /** delete single row from the table: "fix_report" */
  delete_fixReport_by_pk?: Maybe<FixReport>;
  /** delete single row from the table: "fix" */
  delete_fix_by_pk?: Maybe<Fix>;
  /** delete data from the table: "fix_rating" */
  delete_fix_rating?: Maybe<Fix_Rating_Mutation_Response>;
  /** delete single row from the table: "fix_rating" */
  delete_fix_rating_by_pk?: Maybe<Fix_Rating>;
  /** delete data from the table: "fix_rating_tag" */
  delete_fix_rating_tag?: Maybe<Fix_Rating_Tag_Mutation_Response>;
  /** delete single row from the table: "fix_rating_tag" */
  delete_fix_rating_tag_by_pk?: Maybe<Fix_Rating_Tag>;
  /** delete data from the table: "fix_report_state" */
  delete_fix_report_state?: Maybe<Fix_Report_State_Mutation_Response>;
  /** delete single row from the table: "fix_report_state" */
  delete_fix_report_state_by_pk?: Maybe<Fix_Report_State>;
  /** delete data from the table: "fix_state" */
  delete_fix_state?: Maybe<Fix_State_Mutation_Response>;
  /** delete single row from the table: "fix_state" */
  delete_fix_state_by_pk?: Maybe<Fix_State>;
  /** delete data from the table: "fix_to_scm_submit_fix_request" */
  delete_fix_to_scm_submit_fix_request?: Maybe<Fix_To_Scm_Submit_Fix_Request_Mutation_Response>;
  /** delete single row from the table: "fix_to_scm_submit_fix_request" */
  delete_fix_to_scm_submit_fix_request_by_pk?: Maybe<Fix_To_Scm_Submit_Fix_Request>;
  /** delete data from the table: "fix_to_submit_fix_request" */
  delete_fix_to_submit_fix_request?: Maybe<Fix_To_Submit_Fix_Request_Mutation_Response>;
  /** delete single row from the table: "fix_to_submit_fix_request" */
  delete_fix_to_submit_fix_request_by_pk?: Maybe<Fix_To_Submit_Fix_Request>;
  /** delete data from the table: "integration" */
  delete_integration?: Maybe<Integration_Mutation_Response>;
  /** delete single row from the table: "integration" */
  delete_integration_by_pk?: Maybe<Integration>;
  /** delete data from the table: "integration_type" */
  delete_integration_type?: Maybe<Integration_Type_Mutation_Response>;
  /** delete single row from the table: "integration_type" */
  delete_integration_type_by_pk?: Maybe<Integration_Type>;
  /** delete data from the table: "invitation" */
  delete_invitation?: Maybe<Invitation_Mutation_Response>;
  /** delete single row from the table: "invitation" */
  delete_invitation_by_pk?: Maybe<Invitation>;
  /** delete data from the table: "invitation_status_type" */
  delete_invitation_status_type?: Maybe<Invitation_Status_Type_Mutation_Response>;
  /** delete single row from the table: "invitation_status_type" */
  delete_invitation_status_type_by_pk?: Maybe<Invitation_Status_Type>;
  /** delete data from the table: "invitation_to_projects" */
  delete_invitation_to_projects?: Maybe<Invitation_To_Projects_Mutation_Response>;
  /** delete single row from the table: "invitation_to_projects" */
  delete_invitation_to_projects_by_pk?: Maybe<Invitation_To_Projects>;
  /** delete data from the table: "issue_language" */
  delete_issueLanguage?: Maybe<IssueLanguage_Mutation_Response>;
  /** delete single row from the table: "issue_language" */
  delete_issueLanguage_by_pk?: Maybe<IssueLanguage>;
  /** delete data from the table: "issue_type" */
  delete_issueType?: Maybe<IssueType_Mutation_Response>;
  /** delete single row from the table: "issue_type" */
  delete_issueType_by_pk?: Maybe<IssueType>;
  /** delete data from the table: "on_prem_scm_oauth_config" */
  delete_on_prem_scm_oauth_config?: Maybe<On_Prem_Scm_Oauth_Config_Mutation_Response>;
  /** delete single row from the table: "on_prem_scm_oauth_config" */
  delete_on_prem_scm_oauth_config_by_pk?: Maybe<On_Prem_Scm_Oauth_Config>;
  /** delete data from the table: "organization" */
  delete_organization?: Maybe<Organization_Mutation_Response>;
  /** delete single row from the table: "organization" */
  delete_organization_by_pk?: Maybe<Organization>;
  /** delete data from the table: "organization_files_matching_settings" */
  delete_organization_files_matching_settings?: Maybe<Organization_Files_Matching_Settings_Mutation_Response>;
  /** delete single row from the table: "organization_files_matching_settings" */
  delete_organization_files_matching_settings_by_pk?: Maybe<Organization_Files_Matching_Settings>;
  /** delete data from the table: "organization_issue_type_settings" */
  delete_organization_issue_type_settings?: Maybe<Organization_Issue_Type_Settings_Mutation_Response>;
  /** delete single row from the table: "organization_issue_type_settings" */
  delete_organization_issue_type_settings_by_pk?: Maybe<Organization_Issue_Type_Settings>;
  /** delete data from the table: "organization_role" */
  delete_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** delete single row from the table: "organization_role" */
  delete_organization_role_by_pk?: Maybe<Organization_Role>;
  /** delete data from the table: "organization_role_type" */
  delete_organization_role_type?: Maybe<Organization_Role_Type_Mutation_Response>;
  /** delete single row from the table: "organization_role_type" */
  delete_organization_role_type_by_pk?: Maybe<Organization_Role_Type>;
  /** delete data from the table: "organization_to_organization_role" */
  delete_organization_to_organization_role?: Maybe<Organization_To_Organization_Role_Mutation_Response>;
  /** delete single row from the table: "organization_to_organization_role" */
  delete_organization_to_organization_role_by_pk?: Maybe<Organization_To_Organization_Role>;
  /** delete data from the table: "organization_to_user" */
  delete_organization_to_user?: Maybe<Organization_To_User_Mutation_Response>;
  /** delete single row from the table: "organization_to_user" */
  delete_organization_to_user_by_pk?: Maybe<Organization_To_User>;
  /** delete data from the table: "project" */
  delete_project?: Maybe<Project_Mutation_Response>;
  /** delete single row from the table: "project" */
  delete_project_by_pk?: Maybe<Project>;
  /** delete data from the table: "project_issue_type_settings" */
  delete_project_issue_type_settings?: Maybe<Project_Issue_Type_Settings_Mutation_Response>;
  /** delete single row from the table: "project_issue_type_settings" */
  delete_project_issue_type_settings_by_pk?: Maybe<Project_Issue_Type_Settings>;
  /** delete data from the table: "project_role" */
  delete_project_role?: Maybe<Project_Role_Mutation_Response>;
  /** delete single row from the table: "project_role" */
  delete_project_role_by_pk?: Maybe<Project_Role>;
  /** delete data from the table: "project_role_type" */
  delete_project_role_type?: Maybe<Project_Role_Type_Mutation_Response>;
  /** delete single row from the table: "project_role_type" */
  delete_project_role_type_by_pk?: Maybe<Project_Role_Type>;
  /** delete data from the table: "project_to_project_role" */
  delete_project_to_project_role?: Maybe<Project_To_Project_Role_Mutation_Response>;
  /** delete single row from the table: "project_to_project_role" */
  delete_project_to_project_role_by_pk?: Maybe<Project_To_Project_Role>;
  /** delete data from the table: "project_to_user" */
  delete_project_to_user?: Maybe<Project_To_User_Mutation_Response>;
  /** delete single row from the table: "project_to_user" */
  delete_project_to_user_by_pk?: Maybe<Project_To_User>;
  /** delete data from the table: "repo" */
  delete_repo?: Maybe<Repo_Mutation_Response>;
  /** delete single row from the table: "repo" */
  delete_repo_by_pk?: Maybe<Repo>;
  /** delete data from the table: "scan_source" */
  delete_scan_source?: Maybe<Scan_Source_Mutation_Response>;
  /** delete single row from the table: "scan_source" */
  delete_scan_source_by_pk?: Maybe<Scan_Source>;
  /** delete data from the table: "scm_config" */
  delete_scm_config?: Maybe<Scm_Config_Mutation_Response>;
  /** delete single row from the table: "scm_config" */
  delete_scm_config_by_pk?: Maybe<Scm_Config>;
  /** delete data from the table: "scm_submit_fix_request" */
  delete_scm_submit_fix_request?: Maybe<Scm_Submit_Fix_Request_Mutation_Response>;
  /** delete single row from the table: "scm_submit_fix_request" */
  delete_scm_submit_fix_request_by_pk?: Maybe<Scm_Submit_Fix_Request>;
  /** delete data from the table: "submit_fix_request" */
  delete_submit_fix_request?: Maybe<Submit_Fix_Request_Mutation_Response>;
  /** delete single row from the table: "submit_fix_request" */
  delete_submit_fix_request_by_pk?: Maybe<Submit_Fix_Request>;
  /** delete data from the table: "submit_fix_request_scm_type" */
  delete_submit_fix_request_scm_type?: Maybe<Submit_Fix_Request_Scm_Type_Mutation_Response>;
  /** delete single row from the table: "submit_fix_request_scm_type" */
  delete_submit_fix_request_scm_type_by_pk?: Maybe<Submit_Fix_Request_Scm_Type>;
  /** delete data from the table: "submit_fix_request_state" */
  delete_submit_fix_request_state?: Maybe<Submit_Fix_Request_State_Mutation_Response>;
  /** delete single row from the table: "submit_fix_request_state" */
  delete_submit_fix_request_state_by_pk?: Maybe<Submit_Fix_Request_State>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "vulnerability_report" */
  delete_vulnerability_report?: Maybe<Vulnerability_Report_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report" */
  delete_vulnerability_report_by_pk?: Maybe<Vulnerability_Report>;
  /** delete data from the table: "vulnerability_report_issue" */
  delete_vulnerability_report_issue?: Maybe<Vulnerability_Report_Issue_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_issue" */
  delete_vulnerability_report_issue_by_pk?: Maybe<Vulnerability_Report_Issue>;
  /** delete data from the table: "vulnerability_report_issue_code_node" */
  delete_vulnerability_report_issue_code_node?: Maybe<Vulnerability_Report_Issue_Code_Node_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_issue_code_node" */
  delete_vulnerability_report_issue_code_node_by_pk?: Maybe<Vulnerability_Report_Issue_Code_Node>;
  /** delete data from the table: "vulnerability_report_issue_state" */
  delete_vulnerability_report_issue_state?: Maybe<Vulnerability_Report_Issue_State_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_issue_state" */
  delete_vulnerability_report_issue_state_by_pk?: Maybe<Vulnerability_Report_Issue_State>;
  /** delete data from the table: "vulnerability_report_issue_tag" */
  delete_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_issue_tag" */
  delete_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_Tag>;
  /** delete data from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  delete_vulnerability_report_issue_to_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  delete_vulnerability_report_issue_to_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** delete data from the table: "vulnerability_report_path" */
  delete_vulnerability_report_path?: Maybe<Vulnerability_Report_Path_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_path" */
  delete_vulnerability_report_path_by_pk?: Maybe<Vulnerability_Report_Path>;
  /** delete data from the table: "vulnerability_report_vendor" */
  delete_vulnerability_report_vendor?: Maybe<Vulnerability_Report_Vendor_Mutation_Response>;
  /** delete single row from the table: "vulnerability_report_vendor" */
  delete_vulnerability_report_vendor_by_pk?: Maybe<Vulnerability_Report_Vendor>;
  /** delete data from the table: "vulnerability_severity" */
  delete_vulnerability_severity?: Maybe<Vulnerability_Severity_Mutation_Response>;
  /** delete single row from the table: "vulnerability_severity" */
  delete_vulnerability_severity_by_pk?: Maybe<Vulnerability_Severity>;
  digestVulnerabilityReport: VulnerabilityReportResponse;
  forkRepo?: Maybe<ForkRepoResponse>;
  generateDiffsFile?: Maybe<FileDiffsResponse>;
  initOrganizationAndProject?: Maybe<InitOrganizationAndProjectResponse>;
  initOrganizationAndProjectAdmin?: Maybe<InitOrganizationAndProjectResponse>;
  /** insert data into the table: "api_token" */
  insert_api_token?: Maybe<Api_Token_Mutation_Response>;
  /** insert a single row into the table: "api_token" */
  insert_api_token_one?: Maybe<Api_Token>;
  /** insert data into the table: "broker_host" */
  insert_broker_host?: Maybe<Broker_Host_Mutation_Response>;
  /** insert a single row into the table: "broker_host" */
  insert_broker_host_one?: Maybe<Broker_Host>;
  /** insert data into the table: "broker_token" */
  insert_broker_token?: Maybe<Broker_Token_Mutation_Response>;
  /** insert a single row into the table: "broker_token" */
  insert_broker_token_one?: Maybe<Broker_Token>;
  /** insert data into the table: "cli_login" */
  insert_cli_login?: Maybe<Cli_Login_Mutation_Response>;
  /** insert a single row into the table: "cli_login" */
  insert_cli_login_one?: Maybe<Cli_Login>;
  /** insert data into the table: "effort_to_apply_fix" */
  insert_effort_to_apply_fix?: Maybe<Effort_To_Apply_Fix_Mutation_Response>;
  /** insert a single row into the table: "effort_to_apply_fix" */
  insert_effort_to_apply_fix_one?: Maybe<Effort_To_Apply_Fix>;
  /** insert data into the table: "file" */
  insert_file?: Maybe<File_Mutation_Response>;
  /** insert a single row into the table: "file" */
  insert_file_one?: Maybe<File>;
  /** insert data into the table: "fix" */
  insert_fix?: Maybe<Fix_Mutation_Response>;
  /** insert data into the table: "fix_answer" */
  insert_fixAnswer?: Maybe<FixAnswer_Mutation_Response>;
  /** insert a single row into the table: "fix_answer" */
  insert_fixAnswer_one?: Maybe<FixAnswer>;
  /** insert data into the table: "fix_file" */
  insert_fixFile?: Maybe<FixFile_Mutation_Response>;
  /** insert a single row into the table: "fix_file" */
  insert_fixFile_one?: Maybe<FixFile>;
  /** insert data into the table: "fix_report" */
  insert_fixReport?: Maybe<FixReport_Mutation_Response>;
  /** insert a single row into the table: "fix_report" */
  insert_fixReport_one?: Maybe<FixReport>;
  /** insert a single row into the table: "fix" */
  insert_fix_one?: Maybe<Fix>;
  /** insert data into the table: "fix_rating" */
  insert_fix_rating?: Maybe<Fix_Rating_Mutation_Response>;
  /** insert a single row into the table: "fix_rating" */
  insert_fix_rating_one?: Maybe<Fix_Rating>;
  /** insert data into the table: "fix_rating_tag" */
  insert_fix_rating_tag?: Maybe<Fix_Rating_Tag_Mutation_Response>;
  /** insert a single row into the table: "fix_rating_tag" */
  insert_fix_rating_tag_one?: Maybe<Fix_Rating_Tag>;
  /** insert data into the table: "fix_report_state" */
  insert_fix_report_state?: Maybe<Fix_Report_State_Mutation_Response>;
  /** insert a single row into the table: "fix_report_state" */
  insert_fix_report_state_one?: Maybe<Fix_Report_State>;
  /** insert data into the table: "fix_state" */
  insert_fix_state?: Maybe<Fix_State_Mutation_Response>;
  /** insert a single row into the table: "fix_state" */
  insert_fix_state_one?: Maybe<Fix_State>;
  /** insert data into the table: "fix_to_scm_submit_fix_request" */
  insert_fix_to_scm_submit_fix_request?: Maybe<Fix_To_Scm_Submit_Fix_Request_Mutation_Response>;
  /** insert a single row into the table: "fix_to_scm_submit_fix_request" */
  insert_fix_to_scm_submit_fix_request_one?: Maybe<Fix_To_Scm_Submit_Fix_Request>;
  /** insert data into the table: "fix_to_submit_fix_request" */
  insert_fix_to_submit_fix_request?: Maybe<Fix_To_Submit_Fix_Request_Mutation_Response>;
  /** insert a single row into the table: "fix_to_submit_fix_request" */
  insert_fix_to_submit_fix_request_one?: Maybe<Fix_To_Submit_Fix_Request>;
  /** insert data into the table: "integration" */
  insert_integration?: Maybe<Integration_Mutation_Response>;
  /** insert a single row into the table: "integration" */
  insert_integration_one?: Maybe<Integration>;
  /** insert data into the table: "integration_type" */
  insert_integration_type?: Maybe<Integration_Type_Mutation_Response>;
  /** insert a single row into the table: "integration_type" */
  insert_integration_type_one?: Maybe<Integration_Type>;
  /** insert data into the table: "invitation" */
  insert_invitation?: Maybe<Invitation_Mutation_Response>;
  /** insert a single row into the table: "invitation" */
  insert_invitation_one?: Maybe<Invitation>;
  /** insert data into the table: "invitation_status_type" */
  insert_invitation_status_type?: Maybe<Invitation_Status_Type_Mutation_Response>;
  /** insert a single row into the table: "invitation_status_type" */
  insert_invitation_status_type_one?: Maybe<Invitation_Status_Type>;
  /** insert data into the table: "invitation_to_projects" */
  insert_invitation_to_projects?: Maybe<Invitation_To_Projects_Mutation_Response>;
  /** insert a single row into the table: "invitation_to_projects" */
  insert_invitation_to_projects_one?: Maybe<Invitation_To_Projects>;
  /** insert data into the table: "issue_language" */
  insert_issueLanguage?: Maybe<IssueLanguage_Mutation_Response>;
  /** insert a single row into the table: "issue_language" */
  insert_issueLanguage_one?: Maybe<IssueLanguage>;
  /** insert data into the table: "issue_type" */
  insert_issueType?: Maybe<IssueType_Mutation_Response>;
  /** insert a single row into the table: "issue_type" */
  insert_issueType_one?: Maybe<IssueType>;
  /** insert data into the table: "on_prem_scm_oauth_config" */
  insert_on_prem_scm_oauth_config?: Maybe<On_Prem_Scm_Oauth_Config_Mutation_Response>;
  /** insert a single row into the table: "on_prem_scm_oauth_config" */
  insert_on_prem_scm_oauth_config_one?: Maybe<On_Prem_Scm_Oauth_Config>;
  /** insert data into the table: "organization" */
  insert_organization?: Maybe<Organization_Mutation_Response>;
  /** insert data into the table: "organization_files_matching_settings" */
  insert_organization_files_matching_settings?: Maybe<Organization_Files_Matching_Settings_Mutation_Response>;
  /** insert a single row into the table: "organization_files_matching_settings" */
  insert_organization_files_matching_settings_one?: Maybe<Organization_Files_Matching_Settings>;
  /** insert data into the table: "organization_issue_type_settings" */
  insert_organization_issue_type_settings?: Maybe<Organization_Issue_Type_Settings_Mutation_Response>;
  /** insert a single row into the table: "organization_issue_type_settings" */
  insert_organization_issue_type_settings_one?: Maybe<Organization_Issue_Type_Settings>;
  /** insert a single row into the table: "organization" */
  insert_organization_one?: Maybe<Organization>;
  /** insert data into the table: "organization_role" */
  insert_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** insert a single row into the table: "organization_role" */
  insert_organization_role_one?: Maybe<Organization_Role>;
  /** insert data into the table: "organization_role_type" */
  insert_organization_role_type?: Maybe<Organization_Role_Type_Mutation_Response>;
  /** insert a single row into the table: "organization_role_type" */
  insert_organization_role_type_one?: Maybe<Organization_Role_Type>;
  /** insert data into the table: "organization_to_organization_role" */
  insert_organization_to_organization_role?: Maybe<Organization_To_Organization_Role_Mutation_Response>;
  /** insert a single row into the table: "organization_to_organization_role" */
  insert_organization_to_organization_role_one?: Maybe<Organization_To_Organization_Role>;
  /** insert data into the table: "organization_to_user" */
  insert_organization_to_user?: Maybe<Organization_To_User_Mutation_Response>;
  /** insert a single row into the table: "organization_to_user" */
  insert_organization_to_user_one?: Maybe<Organization_To_User>;
  /** insert data into the table: "project" */
  insert_project?: Maybe<Project_Mutation_Response>;
  /** insert data into the table: "project_issue_type_settings" */
  insert_project_issue_type_settings?: Maybe<Project_Issue_Type_Settings_Mutation_Response>;
  /** insert a single row into the table: "project_issue_type_settings" */
  insert_project_issue_type_settings_one?: Maybe<Project_Issue_Type_Settings>;
  /** insert a single row into the table: "project" */
  insert_project_one?: Maybe<Project>;
  /** insert data into the table: "project_role" */
  insert_project_role?: Maybe<Project_Role_Mutation_Response>;
  /** insert a single row into the table: "project_role" */
  insert_project_role_one?: Maybe<Project_Role>;
  /** insert data into the table: "project_role_type" */
  insert_project_role_type?: Maybe<Project_Role_Type_Mutation_Response>;
  /** insert a single row into the table: "project_role_type" */
  insert_project_role_type_one?: Maybe<Project_Role_Type>;
  /** insert data into the table: "project_to_project_role" */
  insert_project_to_project_role?: Maybe<Project_To_Project_Role_Mutation_Response>;
  /** insert a single row into the table: "project_to_project_role" */
  insert_project_to_project_role_one?: Maybe<Project_To_Project_Role>;
  /** insert data into the table: "project_to_user" */
  insert_project_to_user?: Maybe<Project_To_User_Mutation_Response>;
  /** insert a single row into the table: "project_to_user" */
  insert_project_to_user_one?: Maybe<Project_To_User>;
  /** insert data into the table: "repo" */
  insert_repo?: Maybe<Repo_Mutation_Response>;
  /** insert a single row into the table: "repo" */
  insert_repo_one?: Maybe<Repo>;
  /** insert data into the table: "scan_source" */
  insert_scan_source?: Maybe<Scan_Source_Mutation_Response>;
  /** insert a single row into the table: "scan_source" */
  insert_scan_source_one?: Maybe<Scan_Source>;
  /** insert data into the table: "scm_config" */
  insert_scm_config?: Maybe<Scm_Config_Mutation_Response>;
  /** insert a single row into the table: "scm_config" */
  insert_scm_config_one?: Maybe<Scm_Config>;
  /** insert data into the table: "scm_submit_fix_request" */
  insert_scm_submit_fix_request?: Maybe<Scm_Submit_Fix_Request_Mutation_Response>;
  /** insert a single row into the table: "scm_submit_fix_request" */
  insert_scm_submit_fix_request_one?: Maybe<Scm_Submit_Fix_Request>;
  /** insert data into the table: "submit_fix_request" */
  insert_submit_fix_request?: Maybe<Submit_Fix_Request_Mutation_Response>;
  /** insert a single row into the table: "submit_fix_request" */
  insert_submit_fix_request_one?: Maybe<Submit_Fix_Request>;
  /** insert data into the table: "submit_fix_request_scm_type" */
  insert_submit_fix_request_scm_type?: Maybe<Submit_Fix_Request_Scm_Type_Mutation_Response>;
  /** insert a single row into the table: "submit_fix_request_scm_type" */
  insert_submit_fix_request_scm_type_one?: Maybe<Submit_Fix_Request_Scm_Type>;
  /** insert data into the table: "submit_fix_request_state" */
  insert_submit_fix_request_state?: Maybe<Submit_Fix_Request_State_Mutation_Response>;
  /** insert a single row into the table: "submit_fix_request_state" */
  insert_submit_fix_request_state_one?: Maybe<Submit_Fix_Request_State>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "vulnerability_report" */
  insert_vulnerability_report?: Maybe<Vulnerability_Report_Mutation_Response>;
  /** insert data into the table: "vulnerability_report_issue" */
  insert_vulnerability_report_issue?: Maybe<Vulnerability_Report_Issue_Mutation_Response>;
  /** insert data into the table: "vulnerability_report_issue_code_node" */
  insert_vulnerability_report_issue_code_node?: Maybe<Vulnerability_Report_Issue_Code_Node_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_issue_code_node" */
  insert_vulnerability_report_issue_code_node_one?: Maybe<Vulnerability_Report_Issue_Code_Node>;
  /** insert a single row into the table: "vulnerability_report_issue" */
  insert_vulnerability_report_issue_one?: Maybe<Vulnerability_Report_Issue>;
  /** insert data into the table: "vulnerability_report_issue_state" */
  insert_vulnerability_report_issue_state?: Maybe<Vulnerability_Report_Issue_State_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_issue_state" */
  insert_vulnerability_report_issue_state_one?: Maybe<Vulnerability_Report_Issue_State>;
  /** insert data into the table: "vulnerability_report_issue_tag" */
  insert_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_issue_tag" */
  insert_vulnerability_report_issue_tag_one?: Maybe<Vulnerability_Report_Issue_Tag>;
  /** insert data into the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  insert_vulnerability_report_issue_to_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  insert_vulnerability_report_issue_to_vulnerability_report_issue_tag_one?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** insert a single row into the table: "vulnerability_report" */
  insert_vulnerability_report_one?: Maybe<Vulnerability_Report>;
  /** insert data into the table: "vulnerability_report_path" */
  insert_vulnerability_report_path?: Maybe<Vulnerability_Report_Path_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_path" */
  insert_vulnerability_report_path_one?: Maybe<Vulnerability_Report_Path>;
  /** insert data into the table: "vulnerability_report_vendor" */
  insert_vulnerability_report_vendor?: Maybe<Vulnerability_Report_Vendor_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_report_vendor" */
  insert_vulnerability_report_vendor_one?: Maybe<Vulnerability_Report_Vendor>;
  /** insert data into the table: "vulnerability_severity" */
  insert_vulnerability_severity?: Maybe<Vulnerability_Severity_Mutation_Response>;
  /** insert a single row into the table: "vulnerability_severity" */
  insert_vulnerability_severity_one?: Maybe<Vulnerability_Severity>;
  performCliLogin?: Maybe<StatusQueryResponse>;
  removeToken?: Maybe<StatusQueryResponse>;
  removeUserFromProject?: Maybe<BaseResponse>;
  rerunAnalysis: VulnerabilityReportResponse;
  resendInvitation?: Maybe<ResendInvitationResponse>;
  resetAnswers?: Maybe<Scalars['Void']['output']>;
  saveCheckmarxIntegration?: Maybe<SaveCheckmarxIntegrationResponse>;
  sendInvitation?: Maybe<SendInvitationResponse>;
  setAnswers: SetAnswersResponse;
  submitCheckmarxVulnerabilityReport?: Maybe<SubmitCheckmarxVulnerabilityReportResponse>;
  submitVulnerabilityReport: VulnerabilityReportResponse;
  tryNow: VulnerabilityReportResponse;
  updateAdoToken: ScmAccessToken;
  updateBitbucketToken: ScmAccessToken;
  updateBitbucketTokenFromAuth0: UpdateGithubTokenFromAuth0;
  updateDownloadedFixData?: Maybe<StatusQueryResponse>;
  updateGithubToken: ScmAccessToken;
  updateGithubTokenFromAuth0: UpdateGithubTokenFromAuth0;
  updateGitlabToken: ScmAccessToken;
  updateScmToken?: Maybe<ScmAccessTokenUpdateResponse>;
  /** update data of the table: "api_token" */
  update_api_token?: Maybe<Api_Token_Mutation_Response>;
  /** update single row of the table: "api_token" */
  update_api_token_by_pk?: Maybe<Api_Token>;
  /** update multiples rows of table: "api_token" */
  update_api_token_many?: Maybe<Array<Maybe<Api_Token_Mutation_Response>>>;
  /** update data of the table: "broker_host" */
  update_broker_host?: Maybe<Broker_Host_Mutation_Response>;
  /** update single row of the table: "broker_host" */
  update_broker_host_by_pk?: Maybe<Broker_Host>;
  /** update multiples rows of table: "broker_host" */
  update_broker_host_many?: Maybe<Array<Maybe<Broker_Host_Mutation_Response>>>;
  /** update data of the table: "broker_token" */
  update_broker_token?: Maybe<Broker_Token_Mutation_Response>;
  /** update single row of the table: "broker_token" */
  update_broker_token_by_pk?: Maybe<Broker_Token>;
  /** update multiples rows of table: "broker_token" */
  update_broker_token_many?: Maybe<Array<Maybe<Broker_Token_Mutation_Response>>>;
  /** update data of the table: "cli_login" */
  update_cli_login?: Maybe<Cli_Login_Mutation_Response>;
  /** update single row of the table: "cli_login" */
  update_cli_login_by_pk?: Maybe<Cli_Login>;
  /** update multiples rows of table: "cli_login" */
  update_cli_login_many?: Maybe<Array<Maybe<Cli_Login_Mutation_Response>>>;
  /** update data of the table: "effort_to_apply_fix" */
  update_effort_to_apply_fix?: Maybe<Effort_To_Apply_Fix_Mutation_Response>;
  /** update single row of the table: "effort_to_apply_fix" */
  update_effort_to_apply_fix_by_pk?: Maybe<Effort_To_Apply_Fix>;
  /** update multiples rows of table: "effort_to_apply_fix" */
  update_effort_to_apply_fix_many?: Maybe<Array<Maybe<Effort_To_Apply_Fix_Mutation_Response>>>;
  /** update data of the table: "file" */
  update_file?: Maybe<File_Mutation_Response>;
  /** update single row of the table: "file" */
  update_file_by_pk?: Maybe<File>;
  /** update multiples rows of table: "file" */
  update_file_many?: Maybe<Array<Maybe<File_Mutation_Response>>>;
  /** update data of the table: "fix" */
  update_fix?: Maybe<Fix_Mutation_Response>;
  /** update data of the table: "fix_answer" */
  update_fixAnswer?: Maybe<FixAnswer_Mutation_Response>;
  /** update single row of the table: "fix_answer" */
  update_fixAnswer_by_pk?: Maybe<FixAnswer>;
  /** update multiples rows of table: "fix_answer" */
  update_fixAnswer_many?: Maybe<Array<Maybe<FixAnswer_Mutation_Response>>>;
  /** update data of the table: "fix_file" */
  update_fixFile?: Maybe<FixFile_Mutation_Response>;
  /** update single row of the table: "fix_file" */
  update_fixFile_by_pk?: Maybe<FixFile>;
  /** update multiples rows of table: "fix_file" */
  update_fixFile_many?: Maybe<Array<Maybe<FixFile_Mutation_Response>>>;
  /** update data of the table: "fix_report" */
  update_fixReport?: Maybe<FixReport_Mutation_Response>;
  /** update single row of the table: "fix_report" */
  update_fixReport_by_pk?: Maybe<FixReport>;
  /** update multiples rows of table: "fix_report" */
  update_fixReport_many?: Maybe<Array<Maybe<FixReport_Mutation_Response>>>;
  /** update single row of the table: "fix" */
  update_fix_by_pk?: Maybe<Fix>;
  /** update multiples rows of table: "fix" */
  update_fix_many?: Maybe<Array<Maybe<Fix_Mutation_Response>>>;
  /** update data of the table: "fix_rating" */
  update_fix_rating?: Maybe<Fix_Rating_Mutation_Response>;
  /** update single row of the table: "fix_rating" */
  update_fix_rating_by_pk?: Maybe<Fix_Rating>;
  /** update multiples rows of table: "fix_rating" */
  update_fix_rating_many?: Maybe<Array<Maybe<Fix_Rating_Mutation_Response>>>;
  /** update data of the table: "fix_rating_tag" */
  update_fix_rating_tag?: Maybe<Fix_Rating_Tag_Mutation_Response>;
  /** update single row of the table: "fix_rating_tag" */
  update_fix_rating_tag_by_pk?: Maybe<Fix_Rating_Tag>;
  /** update multiples rows of table: "fix_rating_tag" */
  update_fix_rating_tag_many?: Maybe<Array<Maybe<Fix_Rating_Tag_Mutation_Response>>>;
  /** update data of the table: "fix_report_state" */
  update_fix_report_state?: Maybe<Fix_Report_State_Mutation_Response>;
  /** update single row of the table: "fix_report_state" */
  update_fix_report_state_by_pk?: Maybe<Fix_Report_State>;
  /** update multiples rows of table: "fix_report_state" */
  update_fix_report_state_many?: Maybe<Array<Maybe<Fix_Report_State_Mutation_Response>>>;
  /** update data of the table: "fix_state" */
  update_fix_state?: Maybe<Fix_State_Mutation_Response>;
  /** update single row of the table: "fix_state" */
  update_fix_state_by_pk?: Maybe<Fix_State>;
  /** update multiples rows of table: "fix_state" */
  update_fix_state_many?: Maybe<Array<Maybe<Fix_State_Mutation_Response>>>;
  /** update data of the table: "fix_to_scm_submit_fix_request" */
  update_fix_to_scm_submit_fix_request?: Maybe<Fix_To_Scm_Submit_Fix_Request_Mutation_Response>;
  /** update single row of the table: "fix_to_scm_submit_fix_request" */
  update_fix_to_scm_submit_fix_request_by_pk?: Maybe<Fix_To_Scm_Submit_Fix_Request>;
  /** update multiples rows of table: "fix_to_scm_submit_fix_request" */
  update_fix_to_scm_submit_fix_request_many?: Maybe<Array<Maybe<Fix_To_Scm_Submit_Fix_Request_Mutation_Response>>>;
  /** update data of the table: "fix_to_submit_fix_request" */
  update_fix_to_submit_fix_request?: Maybe<Fix_To_Submit_Fix_Request_Mutation_Response>;
  /** update single row of the table: "fix_to_submit_fix_request" */
  update_fix_to_submit_fix_request_by_pk?: Maybe<Fix_To_Submit_Fix_Request>;
  /** update multiples rows of table: "fix_to_submit_fix_request" */
  update_fix_to_submit_fix_request_many?: Maybe<Array<Maybe<Fix_To_Submit_Fix_Request_Mutation_Response>>>;
  /** update data of the table: "integration" */
  update_integration?: Maybe<Integration_Mutation_Response>;
  /** update single row of the table: "integration" */
  update_integration_by_pk?: Maybe<Integration>;
  /** update multiples rows of table: "integration" */
  update_integration_many?: Maybe<Array<Maybe<Integration_Mutation_Response>>>;
  /** update data of the table: "integration_type" */
  update_integration_type?: Maybe<Integration_Type_Mutation_Response>;
  /** update single row of the table: "integration_type" */
  update_integration_type_by_pk?: Maybe<Integration_Type>;
  /** update multiples rows of table: "integration_type" */
  update_integration_type_many?: Maybe<Array<Maybe<Integration_Type_Mutation_Response>>>;
  /** update data of the table: "invitation" */
  update_invitation?: Maybe<Invitation_Mutation_Response>;
  /** update single row of the table: "invitation" */
  update_invitation_by_pk?: Maybe<Invitation>;
  /** update multiples rows of table: "invitation" */
  update_invitation_many?: Maybe<Array<Maybe<Invitation_Mutation_Response>>>;
  /** update data of the table: "invitation_status_type" */
  update_invitation_status_type?: Maybe<Invitation_Status_Type_Mutation_Response>;
  /** update single row of the table: "invitation_status_type" */
  update_invitation_status_type_by_pk?: Maybe<Invitation_Status_Type>;
  /** update multiples rows of table: "invitation_status_type" */
  update_invitation_status_type_many?: Maybe<Array<Maybe<Invitation_Status_Type_Mutation_Response>>>;
  /** update data of the table: "invitation_to_projects" */
  update_invitation_to_projects?: Maybe<Invitation_To_Projects_Mutation_Response>;
  /** update single row of the table: "invitation_to_projects" */
  update_invitation_to_projects_by_pk?: Maybe<Invitation_To_Projects>;
  /** update multiples rows of table: "invitation_to_projects" */
  update_invitation_to_projects_many?: Maybe<Array<Maybe<Invitation_To_Projects_Mutation_Response>>>;
  /** update data of the table: "issue_language" */
  update_issueLanguage?: Maybe<IssueLanguage_Mutation_Response>;
  /** update single row of the table: "issue_language" */
  update_issueLanguage_by_pk?: Maybe<IssueLanguage>;
  /** update multiples rows of table: "issue_language" */
  update_issueLanguage_many?: Maybe<Array<Maybe<IssueLanguage_Mutation_Response>>>;
  /** update data of the table: "issue_type" */
  update_issueType?: Maybe<IssueType_Mutation_Response>;
  /** update single row of the table: "issue_type" */
  update_issueType_by_pk?: Maybe<IssueType>;
  /** update multiples rows of table: "issue_type" */
  update_issueType_many?: Maybe<Array<Maybe<IssueType_Mutation_Response>>>;
  /** update data of the table: "on_prem_scm_oauth_config" */
  update_on_prem_scm_oauth_config?: Maybe<On_Prem_Scm_Oauth_Config_Mutation_Response>;
  /** update single row of the table: "on_prem_scm_oauth_config" */
  update_on_prem_scm_oauth_config_by_pk?: Maybe<On_Prem_Scm_Oauth_Config>;
  /** update multiples rows of table: "on_prem_scm_oauth_config" */
  update_on_prem_scm_oauth_config_many?: Maybe<Array<Maybe<On_Prem_Scm_Oauth_Config_Mutation_Response>>>;
  /** update data of the table: "organization" */
  update_organization?: Maybe<Organization_Mutation_Response>;
  /** update single row of the table: "organization" */
  update_organization_by_pk?: Maybe<Organization>;
  /** update data of the table: "organization_files_matching_settings" */
  update_organization_files_matching_settings?: Maybe<Organization_Files_Matching_Settings_Mutation_Response>;
  /** update single row of the table: "organization_files_matching_settings" */
  update_organization_files_matching_settings_by_pk?: Maybe<Organization_Files_Matching_Settings>;
  /** update multiples rows of table: "organization_files_matching_settings" */
  update_organization_files_matching_settings_many?: Maybe<Array<Maybe<Organization_Files_Matching_Settings_Mutation_Response>>>;
  /** update data of the table: "organization_issue_type_settings" */
  update_organization_issue_type_settings?: Maybe<Organization_Issue_Type_Settings_Mutation_Response>;
  /** update single row of the table: "organization_issue_type_settings" */
  update_organization_issue_type_settings_by_pk?: Maybe<Organization_Issue_Type_Settings>;
  /** update multiples rows of table: "organization_issue_type_settings" */
  update_organization_issue_type_settings_many?: Maybe<Array<Maybe<Organization_Issue_Type_Settings_Mutation_Response>>>;
  /** update multiples rows of table: "organization" */
  update_organization_many?: Maybe<Array<Maybe<Organization_Mutation_Response>>>;
  /** update data of the table: "organization_role" */
  update_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** update single row of the table: "organization_role" */
  update_organization_role_by_pk?: Maybe<Organization_Role>;
  /** update multiples rows of table: "organization_role" */
  update_organization_role_many?: Maybe<Array<Maybe<Organization_Role_Mutation_Response>>>;
  /** update data of the table: "organization_role_type" */
  update_organization_role_type?: Maybe<Organization_Role_Type_Mutation_Response>;
  /** update single row of the table: "organization_role_type" */
  update_organization_role_type_by_pk?: Maybe<Organization_Role_Type>;
  /** update multiples rows of table: "organization_role_type" */
  update_organization_role_type_many?: Maybe<Array<Maybe<Organization_Role_Type_Mutation_Response>>>;
  /** update data of the table: "organization_to_organization_role" */
  update_organization_to_organization_role?: Maybe<Organization_To_Organization_Role_Mutation_Response>;
  /** update single row of the table: "organization_to_organization_role" */
  update_organization_to_organization_role_by_pk?: Maybe<Organization_To_Organization_Role>;
  /** update multiples rows of table: "organization_to_organization_role" */
  update_organization_to_organization_role_many?: Maybe<Array<Maybe<Organization_To_Organization_Role_Mutation_Response>>>;
  /** update data of the table: "organization_to_user" */
  update_organization_to_user?: Maybe<Organization_To_User_Mutation_Response>;
  /** update single row of the table: "organization_to_user" */
  update_organization_to_user_by_pk?: Maybe<Organization_To_User>;
  /** update multiples rows of table: "organization_to_user" */
  update_organization_to_user_many?: Maybe<Array<Maybe<Organization_To_User_Mutation_Response>>>;
  /** update data of the table: "project" */
  update_project?: Maybe<Project_Mutation_Response>;
  /** update single row of the table: "project" */
  update_project_by_pk?: Maybe<Project>;
  /** update data of the table: "project_issue_type_settings" */
  update_project_issue_type_settings?: Maybe<Project_Issue_Type_Settings_Mutation_Response>;
  /** update single row of the table: "project_issue_type_settings" */
  update_project_issue_type_settings_by_pk?: Maybe<Project_Issue_Type_Settings>;
  /** update multiples rows of table: "project_issue_type_settings" */
  update_project_issue_type_settings_many?: Maybe<Array<Maybe<Project_Issue_Type_Settings_Mutation_Response>>>;
  /** update multiples rows of table: "project" */
  update_project_many?: Maybe<Array<Maybe<Project_Mutation_Response>>>;
  /** update data of the table: "project_role" */
  update_project_role?: Maybe<Project_Role_Mutation_Response>;
  /** update single row of the table: "project_role" */
  update_project_role_by_pk?: Maybe<Project_Role>;
  /** update multiples rows of table: "project_role" */
  update_project_role_many?: Maybe<Array<Maybe<Project_Role_Mutation_Response>>>;
  /** update data of the table: "project_role_type" */
  update_project_role_type?: Maybe<Project_Role_Type_Mutation_Response>;
  /** update single row of the table: "project_role_type" */
  update_project_role_type_by_pk?: Maybe<Project_Role_Type>;
  /** update multiples rows of table: "project_role_type" */
  update_project_role_type_many?: Maybe<Array<Maybe<Project_Role_Type_Mutation_Response>>>;
  /** update data of the table: "project_to_project_role" */
  update_project_to_project_role?: Maybe<Project_To_Project_Role_Mutation_Response>;
  /** update single row of the table: "project_to_project_role" */
  update_project_to_project_role_by_pk?: Maybe<Project_To_Project_Role>;
  /** update multiples rows of table: "project_to_project_role" */
  update_project_to_project_role_many?: Maybe<Array<Maybe<Project_To_Project_Role_Mutation_Response>>>;
  /** update data of the table: "project_to_user" */
  update_project_to_user?: Maybe<Project_To_User_Mutation_Response>;
  /** update single row of the table: "project_to_user" */
  update_project_to_user_by_pk?: Maybe<Project_To_User>;
  /** update multiples rows of table: "project_to_user" */
  update_project_to_user_many?: Maybe<Array<Maybe<Project_To_User_Mutation_Response>>>;
  /** update data of the table: "repo" */
  update_repo?: Maybe<Repo_Mutation_Response>;
  /** update single row of the table: "repo" */
  update_repo_by_pk?: Maybe<Repo>;
  /** update multiples rows of table: "repo" */
  update_repo_many?: Maybe<Array<Maybe<Repo_Mutation_Response>>>;
  /** update data of the table: "scan_source" */
  update_scan_source?: Maybe<Scan_Source_Mutation_Response>;
  /** update single row of the table: "scan_source" */
  update_scan_source_by_pk?: Maybe<Scan_Source>;
  /** update multiples rows of table: "scan_source" */
  update_scan_source_many?: Maybe<Array<Maybe<Scan_Source_Mutation_Response>>>;
  /** update data of the table: "scm_config" */
  update_scm_config?: Maybe<Scm_Config_Mutation_Response>;
  /** update single row of the table: "scm_config" */
  update_scm_config_by_pk?: Maybe<Scm_Config>;
  /** update multiples rows of table: "scm_config" */
  update_scm_config_many?: Maybe<Array<Maybe<Scm_Config_Mutation_Response>>>;
  /** update data of the table: "scm_submit_fix_request" */
  update_scm_submit_fix_request?: Maybe<Scm_Submit_Fix_Request_Mutation_Response>;
  /** update single row of the table: "scm_submit_fix_request" */
  update_scm_submit_fix_request_by_pk?: Maybe<Scm_Submit_Fix_Request>;
  /** update multiples rows of table: "scm_submit_fix_request" */
  update_scm_submit_fix_request_many?: Maybe<Array<Maybe<Scm_Submit_Fix_Request_Mutation_Response>>>;
  /** update data of the table: "submit_fix_request" */
  update_submit_fix_request?: Maybe<Submit_Fix_Request_Mutation_Response>;
  /** update single row of the table: "submit_fix_request" */
  update_submit_fix_request_by_pk?: Maybe<Submit_Fix_Request>;
  /** update multiples rows of table: "submit_fix_request" */
  update_submit_fix_request_many?: Maybe<Array<Maybe<Submit_Fix_Request_Mutation_Response>>>;
  /** update data of the table: "submit_fix_request_scm_type" */
  update_submit_fix_request_scm_type?: Maybe<Submit_Fix_Request_Scm_Type_Mutation_Response>;
  /** update single row of the table: "submit_fix_request_scm_type" */
  update_submit_fix_request_scm_type_by_pk?: Maybe<Submit_Fix_Request_Scm_Type>;
  /** update multiples rows of table: "submit_fix_request_scm_type" */
  update_submit_fix_request_scm_type_many?: Maybe<Array<Maybe<Submit_Fix_Request_Scm_Type_Mutation_Response>>>;
  /** update data of the table: "submit_fix_request_state" */
  update_submit_fix_request_state?: Maybe<Submit_Fix_Request_State_Mutation_Response>;
  /** update single row of the table: "submit_fix_request_state" */
  update_submit_fix_request_state_by_pk?: Maybe<Submit_Fix_Request_State>;
  /** update multiples rows of table: "submit_fix_request_state" */
  update_submit_fix_request_state_many?: Maybe<Array<Maybe<Submit_Fix_Request_State_Mutation_Response>>>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update multiples rows of table: "user" */
  update_user_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report" */
  update_vulnerability_report?: Maybe<Vulnerability_Report_Mutation_Response>;
  /** update single row of the table: "vulnerability_report" */
  update_vulnerability_report_by_pk?: Maybe<Vulnerability_Report>;
  /** update data of the table: "vulnerability_report_issue" */
  update_vulnerability_report_issue?: Maybe<Vulnerability_Report_Issue_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_issue" */
  update_vulnerability_report_issue_by_pk?: Maybe<Vulnerability_Report_Issue>;
  /** update data of the table: "vulnerability_report_issue_code_node" */
  update_vulnerability_report_issue_code_node?: Maybe<Vulnerability_Report_Issue_Code_Node_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_issue_code_node" */
  update_vulnerability_report_issue_code_node_by_pk?: Maybe<Vulnerability_Report_Issue_Code_Node>;
  /** update multiples rows of table: "vulnerability_report_issue_code_node" */
  update_vulnerability_report_issue_code_node_many?: Maybe<Array<Maybe<Vulnerability_Report_Issue_Code_Node_Mutation_Response>>>;
  /** update multiples rows of table: "vulnerability_report_issue" */
  update_vulnerability_report_issue_many?: Maybe<Array<Maybe<Vulnerability_Report_Issue_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report_issue_state" */
  update_vulnerability_report_issue_state?: Maybe<Vulnerability_Report_Issue_State_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_issue_state" */
  update_vulnerability_report_issue_state_by_pk?: Maybe<Vulnerability_Report_Issue_State>;
  /** update multiples rows of table: "vulnerability_report_issue_state" */
  update_vulnerability_report_issue_state_many?: Maybe<Array<Maybe<Vulnerability_Report_Issue_State_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_Tag>;
  /** update multiples rows of table: "vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_tag_many?: Maybe<Array<Maybe<Vulnerability_Report_Issue_Tag_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_to_vulnerability_report_issue_tag?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_to_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** update multiples rows of table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  update_vulnerability_report_issue_to_vulnerability_report_issue_tag_many?: Maybe<Array<Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Mutation_Response>>>;
  /** update multiples rows of table: "vulnerability_report" */
  update_vulnerability_report_many?: Maybe<Array<Maybe<Vulnerability_Report_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report_path" */
  update_vulnerability_report_path?: Maybe<Vulnerability_Report_Path_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_path" */
  update_vulnerability_report_path_by_pk?: Maybe<Vulnerability_Report_Path>;
  /** update multiples rows of table: "vulnerability_report_path" */
  update_vulnerability_report_path_many?: Maybe<Array<Maybe<Vulnerability_Report_Path_Mutation_Response>>>;
  /** update data of the table: "vulnerability_report_vendor" */
  update_vulnerability_report_vendor?: Maybe<Vulnerability_Report_Vendor_Mutation_Response>;
  /** update single row of the table: "vulnerability_report_vendor" */
  update_vulnerability_report_vendor_by_pk?: Maybe<Vulnerability_Report_Vendor>;
  /** update multiples rows of table: "vulnerability_report_vendor" */
  update_vulnerability_report_vendor_many?: Maybe<Array<Maybe<Vulnerability_Report_Vendor_Mutation_Response>>>;
  /** update data of the table: "vulnerability_severity" */
  update_vulnerability_severity?: Maybe<Vulnerability_Severity_Mutation_Response>;
  /** update single row of the table: "vulnerability_severity" */
  update_vulnerability_severity_by_pk?: Maybe<Vulnerability_Severity>;
  /** update multiples rows of table: "vulnerability_severity" */
  update_vulnerability_severity_many?: Maybe<Array<Maybe<Vulnerability_Severity_Mutation_Response>>>;
  uploadS3BucketInfo: UploadResponse;
  userSignedUp?: Maybe<StatusQueryResponse>;
  voteOnFix?: Maybe<VoteOnFixResponse>;
};


/** mutation root */
export type Mutation_RootAddUserToOrganizationArgs = {
  organizationId: Scalars['String']['input'];
  projectIds?: InputMaybe<Array<Scalars['String']['input']>>;
  role: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootAddUsersToProjectArgs = {
  projectId: Scalars['String']['input'];
  role: Scalars['String']['input'];
  userEmails: Array<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootApplySimilarAnswersArgs = {
  fixId: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootAutoPrAnalysisArgs = {
  analysisId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootChangeUserOrgRoleArgs = {
  organizationId: Scalars['String']['input'];
  role: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootChangeUserProjectRoleArgs = {
  newRole: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootClaimInvitationArgs = {
  token: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCommitToDifferentBranchArgs = {
  baseBranch: Scalars['String']['input'];
  fixIds: Array<Scalars['String']['input']>;
  fixReportId: Scalars['String']['input'];
  prStrategy?: InputMaybe<PrStrategy>;
  submitBranch: Scalars['String']['input'];
  submitDescription: Scalars['String']['input'];
  submitMessage: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCommitToSameBranchArgs = {
  commitDescription?: InputMaybe<Scalars['String']['input']>;
  commitMessage: Scalars['String']['input'];
  fixId: Scalars['String']['input'];
  prCommentId?: InputMaybe<Scalars['Int']['input']>;
  submitBranch?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootCreateBrokerApiTokenArgs = {
  brokerHostId: Scalars['String']['input'];
  tokenName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCreateOrUpdateRepositorySecretArgs = {
  encryptedValue: Scalars['String']['input'];
  repoUrl: Scalars['String']['input'];
  secretName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCreatePrArgs = {
  body: Scalars['String']['input'];
  filesPaths: Array<Scalars['String']['input']>;
  sourceRepoUrl: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userRepoUrl: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCreateProjectArgs = {
  organizationId: Scalars['String']['input'];
  projectName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootCreateTokenArgs = {
  tokenName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteProjectArgs = {
  projectId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUserFromOrganizationArgs = {
  organizationId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Api_TokenArgs = {
  where: Api_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Api_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Broker_HostArgs = {
  where: Broker_Host_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Broker_Host_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Broker_TokenArgs = {
  where: Broker_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Broker_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cli_LoginArgs = {
  where: Cli_Login_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cli_Login_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Effort_To_Apply_FixArgs = {
  where: Effort_To_Apply_Fix_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Effort_To_Apply_Fix_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_FileArgs = {
  where: File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_File_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_FixArgs = {
  where: Fix_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_FixAnswerArgs = {
  where: FixAnswer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_FixAnswer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_FixFileArgs = {
  where: FixFile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_FixFile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_FixReportArgs = {
  where: FixReport_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_FixReport_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_RatingArgs = {
  where: Fix_Rating_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_Rating_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_Rating_TagArgs = {
  where: Fix_Rating_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_Rating_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_Report_StateArgs = {
  where: Fix_Report_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_Report_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_StateArgs = {
  where: Fix_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_To_Scm_Submit_Fix_RequestArgs = {
  where: Fix_To_Scm_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_To_Scm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fix_To_Submit_Fix_RequestArgs = {
  where: Fix_To_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fix_To_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_IntegrationArgs = {
  where: Integration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Integration_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Integration_TypeArgs = {
  where: Integration_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Integration_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_InvitationArgs = {
  where: Invitation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invitation_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Invitation_Status_TypeArgs = {
  where: Invitation_Status_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invitation_Status_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Invitation_To_ProjectsArgs = {
  where: Invitation_To_Projects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invitation_To_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_IssueLanguageArgs = {
  where: IssueLanguage_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_IssueLanguage_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_IssueTypeArgs = {
  where: IssueType_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_IssueType_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_On_Prem_Scm_Oauth_ConfigArgs = {
  where: On_Prem_Scm_Oauth_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_On_Prem_Scm_Oauth_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_OrganizationArgs = {
  where: Organization_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_Files_Matching_SettingsArgs = {
  where: Organization_Files_Matching_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Files_Matching_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_Issue_Type_SettingsArgs = {
  where: Organization_Issue_Type_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_RoleArgs = {
  where: Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_Role_TypeArgs = {
  where: Organization_Role_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_To_Organization_RoleArgs = {
  where: Organization_To_Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_To_Organization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_To_UserArgs = {
  where: Organization_To_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_To_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ProjectArgs = {
  where: Project_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Project_Issue_Type_SettingsArgs = {
  where: Project_Issue_Type_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Project_RoleArgs = {
  where: Project_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Project_Role_TypeArgs = {
  where: Project_Role_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Project_To_Project_RoleArgs = {
  where: Project_To_Project_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_To_Project_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Project_To_UserArgs = {
  where: Project_To_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Project_To_User_By_PkArgs = {
  projectId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_RepoArgs = {
  where: Repo_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Repo_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Scan_SourceArgs = {
  where: Scan_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Scan_Source_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Scm_ConfigArgs = {
  where: Scm_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Scm_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Scm_Submit_Fix_RequestArgs = {
  where: Scm_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Scm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_RequestArgs = {
  where: Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_Request_Scm_TypeArgs = {
  where: Submit_Fix_Request_Scm_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_Request_Scm_Type_By_PkArgs = {
  name: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_Request_StateArgs = {
  where: Submit_Fix_Request_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Submit_Fix_Request_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_ReportArgs = {
  where: Vulnerability_Report_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_IssueArgs = {
  where: Vulnerability_Report_Issue_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_Code_NodeArgs = {
  where: Vulnerability_Report_Issue_Code_Node_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_Code_Node_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_StateArgs = {
  where: Vulnerability_Report_Issue_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_TagArgs = {
  where: Vulnerability_Report_Issue_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_TagArgs = {
  where: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_PathArgs = {
  where: Vulnerability_Report_Path_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Path_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_VendorArgs = {
  where: Vulnerability_Report_Vendor_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Report_Vendor_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_SeverityArgs = {
  where: Vulnerability_Severity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vulnerability_Severity_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDigestVulnerabilityReportArgs = {
  fixReportId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  scanSource: Scalars['String']['input'];
  vulnerabilityReportFileName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootForkRepoArgs = {
  repoUrl: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootGenerateDiffsFileArgs = {
  fixIds: Array<Scalars['String']['input']>;
  fixReportId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootInitOrganizationAndProjectAdminArgs = {
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  userEmail: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootInsert_Api_TokenArgs = {
  objects: Array<Api_Token_Insert_Input>;
  on_conflict?: InputMaybe<Api_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Api_Token_OneArgs = {
  object: Api_Token_Insert_Input;
  on_conflict?: InputMaybe<Api_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Broker_HostArgs = {
  objects: Array<Broker_Host_Insert_Input>;
  on_conflict?: InputMaybe<Broker_Host_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Broker_Host_OneArgs = {
  object: Broker_Host_Insert_Input;
  on_conflict?: InputMaybe<Broker_Host_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Broker_TokenArgs = {
  objects: Array<Broker_Token_Insert_Input>;
  on_conflict?: InputMaybe<Broker_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Broker_Token_OneArgs = {
  object: Broker_Token_Insert_Input;
  on_conflict?: InputMaybe<Broker_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cli_LoginArgs = {
  objects: Array<Cli_Login_Insert_Input>;
  on_conflict?: InputMaybe<Cli_Login_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cli_Login_OneArgs = {
  object: Cli_Login_Insert_Input;
  on_conflict?: InputMaybe<Cli_Login_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Effort_To_Apply_FixArgs = {
  objects: Array<Effort_To_Apply_Fix_Insert_Input>;
  on_conflict?: InputMaybe<Effort_To_Apply_Fix_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Effort_To_Apply_Fix_OneArgs = {
  object: Effort_To_Apply_Fix_Insert_Input;
  on_conflict?: InputMaybe<Effort_To_Apply_Fix_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FileArgs = {
  objects: Array<File_Insert_Input>;
  on_conflict?: InputMaybe<File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_File_OneArgs = {
  object: File_Insert_Input;
  on_conflict?: InputMaybe<File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixArgs = {
  objects: Array<Fix_Insert_Input>;
  on_conflict?: InputMaybe<Fix_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixAnswerArgs = {
  objects: Array<FixAnswer_Insert_Input>;
  on_conflict?: InputMaybe<FixAnswer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixAnswer_OneArgs = {
  object: FixAnswer_Insert_Input;
  on_conflict?: InputMaybe<FixAnswer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixFileArgs = {
  objects: Array<FixFile_Insert_Input>;
  on_conflict?: InputMaybe<FixFile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixFile_OneArgs = {
  object: FixFile_Insert_Input;
  on_conflict?: InputMaybe<FixFile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixReportArgs = {
  objects: Array<FixReport_Insert_Input>;
  on_conflict?: InputMaybe<FixReport_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FixReport_OneArgs = {
  object: FixReport_Insert_Input;
  on_conflict?: InputMaybe<FixReport_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_OneArgs = {
  object: Fix_Insert_Input;
  on_conflict?: InputMaybe<Fix_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_RatingArgs = {
  objects: Array<Fix_Rating_Insert_Input>;
  on_conflict?: InputMaybe<Fix_Rating_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_Rating_OneArgs = {
  object: Fix_Rating_Insert_Input;
  on_conflict?: InputMaybe<Fix_Rating_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_Rating_TagArgs = {
  objects: Array<Fix_Rating_Tag_Insert_Input>;
  on_conflict?: InputMaybe<Fix_Rating_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_Rating_Tag_OneArgs = {
  object: Fix_Rating_Tag_Insert_Input;
  on_conflict?: InputMaybe<Fix_Rating_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_Report_StateArgs = {
  objects: Array<Fix_Report_State_Insert_Input>;
  on_conflict?: InputMaybe<Fix_Report_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_Report_State_OneArgs = {
  object: Fix_Report_State_Insert_Input;
  on_conflict?: InputMaybe<Fix_Report_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_StateArgs = {
  objects: Array<Fix_State_Insert_Input>;
  on_conflict?: InputMaybe<Fix_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_State_OneArgs = {
  object: Fix_State_Insert_Input;
  on_conflict?: InputMaybe<Fix_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_To_Scm_Submit_Fix_RequestArgs = {
  objects: Array<Fix_To_Scm_Submit_Fix_Request_Insert_Input>;
  on_conflict?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_To_Scm_Submit_Fix_Request_OneArgs = {
  object: Fix_To_Scm_Submit_Fix_Request_Insert_Input;
  on_conflict?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_To_Submit_Fix_RequestArgs = {
  objects: Array<Fix_To_Submit_Fix_Request_Insert_Input>;
  on_conflict?: InputMaybe<Fix_To_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fix_To_Submit_Fix_Request_OneArgs = {
  object: Fix_To_Submit_Fix_Request_Insert_Input;
  on_conflict?: InputMaybe<Fix_To_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IntegrationArgs = {
  objects: Array<Integration_Insert_Input>;
  on_conflict?: InputMaybe<Integration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Integration_OneArgs = {
  object: Integration_Insert_Input;
  on_conflict?: InputMaybe<Integration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Integration_TypeArgs = {
  objects: Array<Integration_Type_Insert_Input>;
  on_conflict?: InputMaybe<Integration_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Integration_Type_OneArgs = {
  object: Integration_Type_Insert_Input;
  on_conflict?: InputMaybe<Integration_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_InvitationArgs = {
  objects: Array<Invitation_Insert_Input>;
  on_conflict?: InputMaybe<Invitation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invitation_OneArgs = {
  object: Invitation_Insert_Input;
  on_conflict?: InputMaybe<Invitation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invitation_Status_TypeArgs = {
  objects: Array<Invitation_Status_Type_Insert_Input>;
  on_conflict?: InputMaybe<Invitation_Status_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invitation_Status_Type_OneArgs = {
  object: Invitation_Status_Type_Insert_Input;
  on_conflict?: InputMaybe<Invitation_Status_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invitation_To_ProjectsArgs = {
  objects: Array<Invitation_To_Projects_Insert_Input>;
  on_conflict?: InputMaybe<Invitation_To_Projects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invitation_To_Projects_OneArgs = {
  object: Invitation_To_Projects_Insert_Input;
  on_conflict?: InputMaybe<Invitation_To_Projects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IssueLanguageArgs = {
  objects: Array<IssueLanguage_Insert_Input>;
  on_conflict?: InputMaybe<IssueLanguage_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IssueLanguage_OneArgs = {
  object: IssueLanguage_Insert_Input;
  on_conflict?: InputMaybe<IssueLanguage_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IssueTypeArgs = {
  objects: Array<IssueType_Insert_Input>;
  on_conflict?: InputMaybe<IssueType_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IssueType_OneArgs = {
  object: IssueType_Insert_Input;
  on_conflict?: InputMaybe<IssueType_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_On_Prem_Scm_Oauth_ConfigArgs = {
  objects: Array<On_Prem_Scm_Oauth_Config_Insert_Input>;
  on_conflict?: InputMaybe<On_Prem_Scm_Oauth_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_On_Prem_Scm_Oauth_Config_OneArgs = {
  object: On_Prem_Scm_Oauth_Config_Insert_Input;
  on_conflict?: InputMaybe<On_Prem_Scm_Oauth_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrganizationArgs = {
  objects: Array<Organization_Insert_Input>;
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Files_Matching_SettingsArgs = {
  objects: Array<Organization_Files_Matching_Settings_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Files_Matching_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Files_Matching_Settings_OneArgs = {
  object: Organization_Files_Matching_Settings_Insert_Input;
  on_conflict?: InputMaybe<Organization_Files_Matching_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Issue_Type_SettingsArgs = {
  objects: Array<Organization_Issue_Type_Settings_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Issue_Type_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Issue_Type_Settings_OneArgs = {
  object: Organization_Issue_Type_Settings_Insert_Input;
  on_conflict?: InputMaybe<Organization_Issue_Type_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_OneArgs = {
  object: Organization_Insert_Input;
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_RoleArgs = {
  objects: Array<Organization_Role_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Role_OneArgs = {
  object: Organization_Role_Insert_Input;
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Role_TypeArgs = {
  objects: Array<Organization_Role_Type_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Role_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Role_Type_OneArgs = {
  object: Organization_Role_Type_Insert_Input;
  on_conflict?: InputMaybe<Organization_Role_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_To_Organization_RoleArgs = {
  objects: Array<Organization_To_Organization_Role_Insert_Input>;
  on_conflict?: InputMaybe<Organization_To_Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_To_Organization_Role_OneArgs = {
  object: Organization_To_Organization_Role_Insert_Input;
  on_conflict?: InputMaybe<Organization_To_Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_To_UserArgs = {
  objects: Array<Organization_To_User_Insert_Input>;
  on_conflict?: InputMaybe<Organization_To_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_To_User_OneArgs = {
  object: Organization_To_User_Insert_Input;
  on_conflict?: InputMaybe<Organization_To_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProjectArgs = {
  objects: Array<Project_Insert_Input>;
  on_conflict?: InputMaybe<Project_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_Issue_Type_SettingsArgs = {
  objects: Array<Project_Issue_Type_Settings_Insert_Input>;
  on_conflict?: InputMaybe<Project_Issue_Type_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_Issue_Type_Settings_OneArgs = {
  object: Project_Issue_Type_Settings_Insert_Input;
  on_conflict?: InputMaybe<Project_Issue_Type_Settings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_OneArgs = {
  object: Project_Insert_Input;
  on_conflict?: InputMaybe<Project_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_RoleArgs = {
  objects: Array<Project_Role_Insert_Input>;
  on_conflict?: InputMaybe<Project_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_Role_OneArgs = {
  object: Project_Role_Insert_Input;
  on_conflict?: InputMaybe<Project_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_Role_TypeArgs = {
  objects: Array<Project_Role_Type_Insert_Input>;
  on_conflict?: InputMaybe<Project_Role_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_Role_Type_OneArgs = {
  object: Project_Role_Type_Insert_Input;
  on_conflict?: InputMaybe<Project_Role_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_To_Project_RoleArgs = {
  objects: Array<Project_To_Project_Role_Insert_Input>;
  on_conflict?: InputMaybe<Project_To_Project_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_To_Project_Role_OneArgs = {
  object: Project_To_Project_Role_Insert_Input;
  on_conflict?: InputMaybe<Project_To_Project_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_To_UserArgs = {
  objects: Array<Project_To_User_Insert_Input>;
  on_conflict?: InputMaybe<Project_To_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Project_To_User_OneArgs = {
  object: Project_To_User_Insert_Input;
  on_conflict?: InputMaybe<Project_To_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RepoArgs = {
  objects: Array<Repo_Insert_Input>;
  on_conflict?: InputMaybe<Repo_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Repo_OneArgs = {
  object: Repo_Insert_Input;
  on_conflict?: InputMaybe<Repo_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scan_SourceArgs = {
  objects: Array<Scan_Source_Insert_Input>;
  on_conflict?: InputMaybe<Scan_Source_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scan_Source_OneArgs = {
  object: Scan_Source_Insert_Input;
  on_conflict?: InputMaybe<Scan_Source_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scm_ConfigArgs = {
  objects: Array<Scm_Config_Insert_Input>;
  on_conflict?: InputMaybe<Scm_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scm_Config_OneArgs = {
  object: Scm_Config_Insert_Input;
  on_conflict?: InputMaybe<Scm_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scm_Submit_Fix_RequestArgs = {
  objects: Array<Scm_Submit_Fix_Request_Insert_Input>;
  on_conflict?: InputMaybe<Scm_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Scm_Submit_Fix_Request_OneArgs = {
  object: Scm_Submit_Fix_Request_Insert_Input;
  on_conflict?: InputMaybe<Scm_Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_RequestArgs = {
  objects: Array<Submit_Fix_Request_Insert_Input>;
  on_conflict?: InputMaybe<Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_Request_OneArgs = {
  object: Submit_Fix_Request_Insert_Input;
  on_conflict?: InputMaybe<Submit_Fix_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_Request_Scm_TypeArgs = {
  objects: Array<Submit_Fix_Request_Scm_Type_Insert_Input>;
  on_conflict?: InputMaybe<Submit_Fix_Request_Scm_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_Request_Scm_Type_OneArgs = {
  object: Submit_Fix_Request_Scm_Type_Insert_Input;
  on_conflict?: InputMaybe<Submit_Fix_Request_Scm_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_Request_StateArgs = {
  objects: Array<Submit_Fix_Request_State_Insert_Input>;
  on_conflict?: InputMaybe<Submit_Fix_Request_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Submit_Fix_Request_State_OneArgs = {
  object: Submit_Fix_Request_State_Insert_Input;
  on_conflict?: InputMaybe<Submit_Fix_Request_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_ReportArgs = {
  objects: Array<Vulnerability_Report_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_IssueArgs = {
  objects: Array<Vulnerability_Report_Issue_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_Code_NodeArgs = {
  objects: Array<Vulnerability_Report_Issue_Code_Node_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_Code_Node_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_Code_Node_OneArgs = {
  object: Vulnerability_Report_Issue_Code_Node_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_Code_Node_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_OneArgs = {
  object: Vulnerability_Report_Issue_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_StateArgs = {
  objects: Array<Vulnerability_Report_Issue_State_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_State_OneArgs = {
  object: Vulnerability_Report_Issue_State_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_TagArgs = {
  objects: Array<Vulnerability_Report_Issue_Tag_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_Tag_OneArgs = {
  object: Vulnerability_Report_Issue_Tag_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_TagArgs = {
  objects: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_OneArgs = {
  object: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_OneArgs = {
  object: Vulnerability_Report_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_PathArgs = {
  objects: Array<Vulnerability_Report_Path_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Path_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Path_OneArgs = {
  object: Vulnerability_Report_Path_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Path_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_VendorArgs = {
  objects: Array<Vulnerability_Report_Vendor_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Report_Vendor_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Report_Vendor_OneArgs = {
  object: Vulnerability_Report_Vendor_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Report_Vendor_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_SeverityArgs = {
  objects: Array<Vulnerability_Severity_Insert_Input>;
  on_conflict?: InputMaybe<Vulnerability_Severity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vulnerability_Severity_OneArgs = {
  object: Vulnerability_Severity_Insert_Input;
  on_conflict?: InputMaybe<Vulnerability_Severity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootPerformCliLoginArgs = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  loginId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootRemoveTokenArgs = {
  token: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootRemoveUserFromProjectArgs = {
  projectId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootRerunAnalysisArgs = {
  fixReportId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootResendInvitationArgs = {
  id: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootResetAnswersArgs = {
  fixId: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootSaveCheckmarxIntegrationArgs = {
  apiKey: Scalars['String']['input'];
  ast: Scalars['String']['input'];
  astBaseAuthUrl: Scalars['String']['input'];
  astBaseUrl: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootSendInvitationArgs = {
  organizationId: Scalars['String']['input'];
  projectIds?: InputMaybe<Array<Scalars['String']['input']>>;
  role: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootSetAnswersArgs = {
  fixId: Scalars['uuid']['input'];
  userInput: Array<QuestionAnswer>;
};


/** mutation root */
export type Mutation_RootSubmitCheckmarxVulnerabilityReportArgs = {
  checkmarxProjectId: Scalars['String']['input'];
  checkmarxProjectName: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootSubmitVulnerabilityReportArgs = {
  experimentalEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  fixReportId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
  reference: Scalars['String']['input'];
  repoUrl: Scalars['String']['input'];
  scanSource: Scalars['String']['input'];
  sha?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportFileName?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootTryNowArgs = {
  project: Projects;
  projectId: Scalars['String']['input'];
  vendor: Vendors;
};


/** mutation root */
export type Mutation_RootUpdateAdoTokenArgs = {
  code: Scalars['String']['input'];
  oauthConfId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootUpdateBitbucketTokenArgs = {
  code: Scalars['String']['input'];
  oauthConfId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootUpdateDownloadedFixDataArgs = {
  fixId: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootUpdateGithubTokenArgs = {
  code: Scalars['String']['input'];
  oauthConfId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootUpdateGitlabTokenArgs = {
  code: Scalars['String']['input'];
  oauthConfId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootUpdateScmTokenArgs = {
  org?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scmType: Scalars['String']['input'];
  token: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootUpdate_Api_TokenArgs = {
  _set?: InputMaybe<Api_Token_Set_Input>;
  where: Api_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Api_Token_By_PkArgs = {
  _set?: InputMaybe<Api_Token_Set_Input>;
  pk_columns: Api_Token_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Api_Token_ManyArgs = {
  updates: Array<Api_Token_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_HostArgs = {
  _set?: InputMaybe<Broker_Host_Set_Input>;
  where: Broker_Host_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_Host_By_PkArgs = {
  _set?: InputMaybe<Broker_Host_Set_Input>;
  pk_columns: Broker_Host_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_Host_ManyArgs = {
  updates: Array<Broker_Host_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_TokenArgs = {
  _set?: InputMaybe<Broker_Token_Set_Input>;
  where: Broker_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_Token_By_PkArgs = {
  _set?: InputMaybe<Broker_Token_Set_Input>;
  pk_columns: Broker_Token_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Broker_Token_ManyArgs = {
  updates: Array<Broker_Token_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cli_LoginArgs = {
  _set?: InputMaybe<Cli_Login_Set_Input>;
  where: Cli_Login_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cli_Login_By_PkArgs = {
  _set?: InputMaybe<Cli_Login_Set_Input>;
  pk_columns: Cli_Login_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cli_Login_ManyArgs = {
  updates: Array<Cli_Login_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Effort_To_Apply_FixArgs = {
  _set?: InputMaybe<Effort_To_Apply_Fix_Set_Input>;
  where: Effort_To_Apply_Fix_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Effort_To_Apply_Fix_By_PkArgs = {
  _set?: InputMaybe<Effort_To_Apply_Fix_Set_Input>;
  pk_columns: Effort_To_Apply_Fix_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Effort_To_Apply_Fix_ManyArgs = {
  updates: Array<Effort_To_Apply_Fix_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_FileArgs = {
  _set?: InputMaybe<File_Set_Input>;
  where: File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_File_By_PkArgs = {
  _set?: InputMaybe<File_Set_Input>;
  pk_columns: File_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_File_ManyArgs = {
  updates: Array<File_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_FixArgs = {
  _inc?: InputMaybe<Fix_Inc_Input>;
  _set?: InputMaybe<Fix_Set_Input>;
  where: Fix_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_FixAnswerArgs = {
  _set?: InputMaybe<FixAnswer_Set_Input>;
  where: FixAnswer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_FixAnswer_By_PkArgs = {
  _set?: InputMaybe<FixAnswer_Set_Input>;
  pk_columns: FixAnswer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FixAnswer_ManyArgs = {
  updates: Array<FixAnswer_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_FixFileArgs = {
  _set?: InputMaybe<FixFile_Set_Input>;
  where: FixFile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_FixFile_By_PkArgs = {
  _set?: InputMaybe<FixFile_Set_Input>;
  pk_columns: FixFile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FixFile_ManyArgs = {
  updates: Array<FixFile_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_FixReportArgs = {
  _inc?: InputMaybe<FixReport_Inc_Input>;
  _set?: InputMaybe<FixReport_Set_Input>;
  where: FixReport_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_FixReport_By_PkArgs = {
  _inc?: InputMaybe<FixReport_Inc_Input>;
  _set?: InputMaybe<FixReport_Set_Input>;
  pk_columns: FixReport_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FixReport_ManyArgs = {
  updates: Array<FixReport_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_By_PkArgs = {
  _inc?: InputMaybe<Fix_Inc_Input>;
  _set?: InputMaybe<Fix_Set_Input>;
  pk_columns: Fix_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_ManyArgs = {
  updates: Array<Fix_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_RatingArgs = {
  _inc?: InputMaybe<Fix_Rating_Inc_Input>;
  _set?: InputMaybe<Fix_Rating_Set_Input>;
  where: Fix_Rating_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Rating_By_PkArgs = {
  _inc?: InputMaybe<Fix_Rating_Inc_Input>;
  _set?: InputMaybe<Fix_Rating_Set_Input>;
  pk_columns: Fix_Rating_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Rating_ManyArgs = {
  updates: Array<Fix_Rating_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Rating_TagArgs = {
  _set?: InputMaybe<Fix_Rating_Tag_Set_Input>;
  where: Fix_Rating_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Rating_Tag_By_PkArgs = {
  _set?: InputMaybe<Fix_Rating_Tag_Set_Input>;
  pk_columns: Fix_Rating_Tag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Rating_Tag_ManyArgs = {
  updates: Array<Fix_Rating_Tag_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Report_StateArgs = {
  _set?: InputMaybe<Fix_Report_State_Set_Input>;
  where: Fix_Report_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Report_State_By_PkArgs = {
  _set?: InputMaybe<Fix_Report_State_Set_Input>;
  pk_columns: Fix_Report_State_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_Report_State_ManyArgs = {
  updates: Array<Fix_Report_State_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_StateArgs = {
  _set?: InputMaybe<Fix_State_Set_Input>;
  where: Fix_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_State_By_PkArgs = {
  _set?: InputMaybe<Fix_State_Set_Input>;
  pk_columns: Fix_State_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_State_ManyArgs = {
  updates: Array<Fix_State_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Scm_Submit_Fix_RequestArgs = {
  _set?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Set_Input>;
  where: Fix_To_Scm_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Scm_Submit_Fix_Request_By_PkArgs = {
  _set?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Set_Input>;
  pk_columns: Fix_To_Scm_Submit_Fix_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Scm_Submit_Fix_Request_ManyArgs = {
  updates: Array<Fix_To_Scm_Submit_Fix_Request_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Submit_Fix_RequestArgs = {
  _set?: InputMaybe<Fix_To_Submit_Fix_Request_Set_Input>;
  where: Fix_To_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Submit_Fix_Request_By_PkArgs = {
  _set?: InputMaybe<Fix_To_Submit_Fix_Request_Set_Input>;
  pk_columns: Fix_To_Submit_Fix_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fix_To_Submit_Fix_Request_ManyArgs = {
  updates: Array<Fix_To_Submit_Fix_Request_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IntegrationArgs = {
  _append?: InputMaybe<Integration_Append_Input>;
  _delete_at_path?: InputMaybe<Integration_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Integration_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Integration_Delete_Key_Input>;
  _prepend?: InputMaybe<Integration_Prepend_Input>;
  _set?: InputMaybe<Integration_Set_Input>;
  where: Integration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Integration_By_PkArgs = {
  _append?: InputMaybe<Integration_Append_Input>;
  _delete_at_path?: InputMaybe<Integration_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Integration_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Integration_Delete_Key_Input>;
  _prepend?: InputMaybe<Integration_Prepend_Input>;
  _set?: InputMaybe<Integration_Set_Input>;
  pk_columns: Integration_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Integration_ManyArgs = {
  updates: Array<Integration_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Integration_TypeArgs = {
  _set?: InputMaybe<Integration_Type_Set_Input>;
  where: Integration_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Integration_Type_By_PkArgs = {
  _set?: InputMaybe<Integration_Type_Set_Input>;
  pk_columns: Integration_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Integration_Type_ManyArgs = {
  updates: Array<Integration_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_InvitationArgs = {
  _set?: InputMaybe<Invitation_Set_Input>;
  where: Invitation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_By_PkArgs = {
  _set?: InputMaybe<Invitation_Set_Input>;
  pk_columns: Invitation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_ManyArgs = {
  updates: Array<Invitation_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_Status_TypeArgs = {
  _set?: InputMaybe<Invitation_Status_Type_Set_Input>;
  where: Invitation_Status_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_Status_Type_By_PkArgs = {
  _set?: InputMaybe<Invitation_Status_Type_Set_Input>;
  pk_columns: Invitation_Status_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_Status_Type_ManyArgs = {
  updates: Array<Invitation_Status_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_To_ProjectsArgs = {
  _set?: InputMaybe<Invitation_To_Projects_Set_Input>;
  where: Invitation_To_Projects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_To_Projects_By_PkArgs = {
  _set?: InputMaybe<Invitation_To_Projects_Set_Input>;
  pk_columns: Invitation_To_Projects_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invitation_To_Projects_ManyArgs = {
  updates: Array<Invitation_To_Projects_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IssueLanguageArgs = {
  _set?: InputMaybe<IssueLanguage_Set_Input>;
  where: IssueLanguage_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_IssueLanguage_By_PkArgs = {
  _set?: InputMaybe<IssueLanguage_Set_Input>;
  pk_columns: IssueLanguage_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_IssueLanguage_ManyArgs = {
  updates: Array<IssueLanguage_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IssueTypeArgs = {
  _set?: InputMaybe<IssueType_Set_Input>;
  where: IssueType_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_IssueType_By_PkArgs = {
  _set?: InputMaybe<IssueType_Set_Input>;
  pk_columns: IssueType_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_IssueType_ManyArgs = {
  updates: Array<IssueType_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_On_Prem_Scm_Oauth_ConfigArgs = {
  _set?: InputMaybe<On_Prem_Scm_Oauth_Config_Set_Input>;
  where: On_Prem_Scm_Oauth_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_On_Prem_Scm_Oauth_Config_By_PkArgs = {
  _set?: InputMaybe<On_Prem_Scm_Oauth_Config_Set_Input>;
  pk_columns: On_Prem_Scm_Oauth_Config_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_On_Prem_Scm_Oauth_Config_ManyArgs = {
  updates: Array<On_Prem_Scm_Oauth_Config_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_OrganizationArgs = {
  _append?: InputMaybe<Organization_Append_Input>;
  _delete_at_path?: InputMaybe<Organization_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Organization_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Organization_Delete_Key_Input>;
  _inc?: InputMaybe<Organization_Inc_Input>;
  _prepend?: InputMaybe<Organization_Prepend_Input>;
  _set?: InputMaybe<Organization_Set_Input>;
  where: Organization_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_By_PkArgs = {
  _append?: InputMaybe<Organization_Append_Input>;
  _delete_at_path?: InputMaybe<Organization_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Organization_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Organization_Delete_Key_Input>;
  _inc?: InputMaybe<Organization_Inc_Input>;
  _prepend?: InputMaybe<Organization_Prepend_Input>;
  _set?: InputMaybe<Organization_Set_Input>;
  pk_columns: Organization_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Files_Matching_SettingsArgs = {
  _set?: InputMaybe<Organization_Files_Matching_Settings_Set_Input>;
  where: Organization_Files_Matching_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Files_Matching_Settings_By_PkArgs = {
  _set?: InputMaybe<Organization_Files_Matching_Settings_Set_Input>;
  pk_columns: Organization_Files_Matching_Settings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Files_Matching_Settings_ManyArgs = {
  updates: Array<Organization_Files_Matching_Settings_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Issue_Type_SettingsArgs = {
  _set?: InputMaybe<Organization_Issue_Type_Settings_Set_Input>;
  where: Organization_Issue_Type_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Issue_Type_Settings_By_PkArgs = {
  _set?: InputMaybe<Organization_Issue_Type_Settings_Set_Input>;
  pk_columns: Organization_Issue_Type_Settings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Issue_Type_Settings_ManyArgs = {
  updates: Array<Organization_Issue_Type_Settings_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_ManyArgs = {
  updates: Array<Organization_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_RoleArgs = {
  _set?: InputMaybe<Organization_Role_Set_Input>;
  where: Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_By_PkArgs = {
  _set?: InputMaybe<Organization_Role_Set_Input>;
  pk_columns: Organization_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_ManyArgs = {
  updates: Array<Organization_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_TypeArgs = {
  _set?: InputMaybe<Organization_Role_Type_Set_Input>;
  where: Organization_Role_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_Type_By_PkArgs = {
  _set?: InputMaybe<Organization_Role_Type_Set_Input>;
  pk_columns: Organization_Role_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_Type_ManyArgs = {
  updates: Array<Organization_Role_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_Organization_RoleArgs = {
  _set?: InputMaybe<Organization_To_Organization_Role_Set_Input>;
  where: Organization_To_Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_Organization_Role_By_PkArgs = {
  _set?: InputMaybe<Organization_To_Organization_Role_Set_Input>;
  pk_columns: Organization_To_Organization_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_Organization_Role_ManyArgs = {
  updates: Array<Organization_To_Organization_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_UserArgs = {
  _set?: InputMaybe<Organization_To_User_Set_Input>;
  where: Organization_To_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_User_By_PkArgs = {
  _set?: InputMaybe<Organization_To_User_Set_Input>;
  pk_columns: Organization_To_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_To_User_ManyArgs = {
  updates: Array<Organization_To_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ProjectArgs = {
  _set?: InputMaybe<Project_Set_Input>;
  where: Project_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_By_PkArgs = {
  _set?: InputMaybe<Project_Set_Input>;
  pk_columns: Project_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Issue_Type_SettingsArgs = {
  _set?: InputMaybe<Project_Issue_Type_Settings_Set_Input>;
  where: Project_Issue_Type_Settings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Issue_Type_Settings_By_PkArgs = {
  _set?: InputMaybe<Project_Issue_Type_Settings_Set_Input>;
  pk_columns: Project_Issue_Type_Settings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Issue_Type_Settings_ManyArgs = {
  updates: Array<Project_Issue_Type_Settings_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Project_ManyArgs = {
  updates: Array<Project_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Project_RoleArgs = {
  _set?: InputMaybe<Project_Role_Set_Input>;
  where: Project_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Role_By_PkArgs = {
  _set?: InputMaybe<Project_Role_Set_Input>;
  pk_columns: Project_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Role_ManyArgs = {
  updates: Array<Project_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Role_TypeArgs = {
  _set?: InputMaybe<Project_Role_Type_Set_Input>;
  where: Project_Role_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Role_Type_By_PkArgs = {
  _set?: InputMaybe<Project_Role_Type_Set_Input>;
  pk_columns: Project_Role_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_Role_Type_ManyArgs = {
  updates: Array<Project_Role_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_Project_RoleArgs = {
  _set?: InputMaybe<Project_To_Project_Role_Set_Input>;
  where: Project_To_Project_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_Project_Role_By_PkArgs = {
  _set?: InputMaybe<Project_To_Project_Role_Set_Input>;
  pk_columns: Project_To_Project_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_Project_Role_ManyArgs = {
  updates: Array<Project_To_Project_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_UserArgs = {
  _set?: InputMaybe<Project_To_User_Set_Input>;
  where: Project_To_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_User_By_PkArgs = {
  _set?: InputMaybe<Project_To_User_Set_Input>;
  pk_columns: Project_To_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Project_To_User_ManyArgs = {
  updates: Array<Project_To_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RepoArgs = {
  _inc?: InputMaybe<Repo_Inc_Input>;
  _set?: InputMaybe<Repo_Set_Input>;
  where: Repo_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Repo_By_PkArgs = {
  _inc?: InputMaybe<Repo_Inc_Input>;
  _set?: InputMaybe<Repo_Set_Input>;
  pk_columns: Repo_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Repo_ManyArgs = {
  updates: Array<Repo_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Scan_SourceArgs = {
  _set?: InputMaybe<Scan_Source_Set_Input>;
  where: Scan_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Scan_Source_By_PkArgs = {
  _set?: InputMaybe<Scan_Source_Set_Input>;
  pk_columns: Scan_Source_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Scan_Source_ManyArgs = {
  updates: Array<Scan_Source_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_ConfigArgs = {
  _set?: InputMaybe<Scm_Config_Set_Input>;
  where: Scm_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_Config_By_PkArgs = {
  _set?: InputMaybe<Scm_Config_Set_Input>;
  pk_columns: Scm_Config_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_Config_ManyArgs = {
  updates: Array<Scm_Config_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_Submit_Fix_RequestArgs = {
  _set?: InputMaybe<Scm_Submit_Fix_Request_Set_Input>;
  where: Scm_Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_Submit_Fix_Request_By_PkArgs = {
  _set?: InputMaybe<Scm_Submit_Fix_Request_Set_Input>;
  pk_columns: Scm_Submit_Fix_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Scm_Submit_Fix_Request_ManyArgs = {
  updates: Array<Scm_Submit_Fix_Request_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_RequestArgs = {
  _set?: InputMaybe<Submit_Fix_Request_Set_Input>;
  where: Submit_Fix_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_By_PkArgs = {
  _set?: InputMaybe<Submit_Fix_Request_Set_Input>;
  pk_columns: Submit_Fix_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_ManyArgs = {
  updates: Array<Submit_Fix_Request_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_Scm_TypeArgs = {
  _set?: InputMaybe<Submit_Fix_Request_Scm_Type_Set_Input>;
  where: Submit_Fix_Request_Scm_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_Scm_Type_By_PkArgs = {
  _set?: InputMaybe<Submit_Fix_Request_Scm_Type_Set_Input>;
  pk_columns: Submit_Fix_Request_Scm_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_Scm_Type_ManyArgs = {
  updates: Array<Submit_Fix_Request_Scm_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_StateArgs = {
  _set?: InputMaybe<Submit_Fix_Request_State_Set_Input>;
  where: Submit_Fix_Request_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_State_By_PkArgs = {
  _set?: InputMaybe<Submit_Fix_Request_State_Set_Input>;
  pk_columns: Submit_Fix_Request_State_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Submit_Fix_Request_State_ManyArgs = {
  updates: Array<Submit_Fix_Request_State_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_ReportArgs = {
  _inc?: InputMaybe<Vulnerability_Report_Inc_Input>;
  _set?: InputMaybe<Vulnerability_Report_Set_Input>;
  where: Vulnerability_Report_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_By_PkArgs = {
  _inc?: InputMaybe<Vulnerability_Report_Inc_Input>;
  _set?: InputMaybe<Vulnerability_Report_Set_Input>;
  pk_columns: Vulnerability_Report_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_IssueArgs = {
  _append?: InputMaybe<Vulnerability_Report_Issue_Append_Input>;
  _delete_at_path?: InputMaybe<Vulnerability_Report_Issue_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Vulnerability_Report_Issue_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Vulnerability_Report_Issue_Delete_Key_Input>;
  _prepend?: InputMaybe<Vulnerability_Report_Issue_Prepend_Input>;
  _set?: InputMaybe<Vulnerability_Report_Issue_Set_Input>;
  where: Vulnerability_Report_Issue_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_By_PkArgs = {
  _append?: InputMaybe<Vulnerability_Report_Issue_Append_Input>;
  _delete_at_path?: InputMaybe<Vulnerability_Report_Issue_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Vulnerability_Report_Issue_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Vulnerability_Report_Issue_Delete_Key_Input>;
  _prepend?: InputMaybe<Vulnerability_Report_Issue_Prepend_Input>;
  _set?: InputMaybe<Vulnerability_Report_Issue_Set_Input>;
  pk_columns: Vulnerability_Report_Issue_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_Code_NodeArgs = {
  _inc?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Inc_Input>;
  _set?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Set_Input>;
  where: Vulnerability_Report_Issue_Code_Node_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_Code_Node_By_PkArgs = {
  _inc?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Inc_Input>;
  _set?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Set_Input>;
  pk_columns: Vulnerability_Report_Issue_Code_Node_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_Code_Node_ManyArgs = {
  updates: Array<Vulnerability_Report_Issue_Code_Node_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_ManyArgs = {
  updates: Array<Vulnerability_Report_Issue_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_StateArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_State_Set_Input>;
  where: Vulnerability_Report_Issue_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_State_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_State_Set_Input>;
  pk_columns: Vulnerability_Report_Issue_State_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_State_ManyArgs = {
  updates: Array<Vulnerability_Report_Issue_State_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_TagArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_Tag_Set_Input>;
  where: Vulnerability_Report_Issue_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_Tag_Set_Input>;
  pk_columns: Vulnerability_Report_Issue_Tag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_Tag_ManyArgs = {
  updates: Array<Vulnerability_Report_Issue_Tag_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_TagArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Set_Input>;
  where: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Set_Input>;
  pk_columns: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_ManyArgs = {
  updates: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_ManyArgs = {
  updates: Array<Vulnerability_Report_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_PathArgs = {
  _set?: InputMaybe<Vulnerability_Report_Path_Set_Input>;
  where: Vulnerability_Report_Path_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Path_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Report_Path_Set_Input>;
  pk_columns: Vulnerability_Report_Path_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Path_ManyArgs = {
  updates: Array<Vulnerability_Report_Path_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_VendorArgs = {
  _set?: InputMaybe<Vulnerability_Report_Vendor_Set_Input>;
  where: Vulnerability_Report_Vendor_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Vendor_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Report_Vendor_Set_Input>;
  pk_columns: Vulnerability_Report_Vendor_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Report_Vendor_ManyArgs = {
  updates: Array<Vulnerability_Report_Vendor_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_SeverityArgs = {
  _set?: InputMaybe<Vulnerability_Severity_Set_Input>;
  where: Vulnerability_Severity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Severity_By_PkArgs = {
  _set?: InputMaybe<Vulnerability_Severity_Set_Input>;
  pk_columns: Vulnerability_Severity_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vulnerability_Severity_ManyArgs = {
  updates: Array<Vulnerability_Severity_Updates>;
};


/** mutation root */
export type Mutation_RootUploadS3BucketInfoArgs = {
  fileName: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootVoteOnFixArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  fixId: Scalars['String']['input'];
  fixRatingTag?: InputMaybe<Scalars['String']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  projectId: Scalars['String']['input'];
  voteScore: Scalars['Int']['input'];
};

/** columns and relationships of "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config = {
  __typename?: 'on_prem_scm_oauth_config';
  id: Scalars['uuid']['output'];
  oauthClientId: Scalars['String']['output'];
  oauthClientSecret: Scalars['String']['output'];
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
  scmType: Submit_Fix_Request_Scm_Type_Enum;
  scmUrl: Scalars['String']['output'];
};

/** aggregated selection of "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Aggregate = {
  __typename?: 'on_prem_scm_oauth_config_aggregate';
  aggregate?: Maybe<On_Prem_Scm_Oauth_Config_Aggregate_Fields>;
  nodes: Array<On_Prem_Scm_Oauth_Config>;
};

export type On_Prem_Scm_Oauth_Config_Aggregate_Bool_Exp = {
  count?: InputMaybe<On_Prem_Scm_Oauth_Config_Aggregate_Bool_Exp_Count>;
};

export type On_Prem_Scm_Oauth_Config_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Aggregate_Fields = {
  __typename?: 'on_prem_scm_oauth_config_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<On_Prem_Scm_Oauth_Config_Max_Fields>;
  min?: Maybe<On_Prem_Scm_Oauth_Config_Min_Fields>;
};


/** aggregate fields of "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<On_Prem_Scm_Oauth_Config_Max_Order_By>;
  min?: InputMaybe<On_Prem_Scm_Oauth_Config_Min_Order_By>;
};

/** input type for inserting array relation for remote table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Arr_Rel_Insert_Input = {
  data: Array<On_Prem_Scm_Oauth_Config_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<On_Prem_Scm_Oauth_Config_On_Conflict>;
};

/** Boolean expression to filter rows from the table "on_prem_scm_oauth_config". All fields are combined with a logical 'AND'. */
export type On_Prem_Scm_Oauth_Config_Bool_Exp = {
  _and?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Bool_Exp>>;
  _not?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
  _or?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  oauthClientId?: InputMaybe<String_Comparison_Exp>;
  oauthClientSecret?: InputMaybe<String_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum_Comparison_Exp>;
  scmUrl?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "on_prem_scm_oauth_config" */
export enum On_Prem_Scm_Oauth_Config_Constraint {
  /** unique or primary key constraint on columns "id" */
  OnPremScmOauthConfigPkey = 'on_prem_scm_oauth_config_pkey'
}

/** input type for inserting data into table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauthClientId?: InputMaybe<Scalars['String']['input']>;
  oauthClientSecret?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type On_Prem_Scm_Oauth_Config_Max_Fields = {
  __typename?: 'on_prem_scm_oauth_config_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  oauthClientId?: Maybe<Scalars['String']['output']>;
  oauthClientSecret?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  scmUrl?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  oauthClientId?: InputMaybe<Order_By>;
  oauthClientSecret?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type On_Prem_Scm_Oauth_Config_Min_Fields = {
  __typename?: 'on_prem_scm_oauth_config_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  oauthClientId?: Maybe<Scalars['String']['output']>;
  oauthClientSecret?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  scmUrl?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  oauthClientId?: InputMaybe<Order_By>;
  oauthClientSecret?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Mutation_Response = {
  __typename?: 'on_prem_scm_oauth_config_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<On_Prem_Scm_Oauth_Config>;
};

/** on_conflict condition type for table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_On_Conflict = {
  constraint: On_Prem_Scm_Oauth_Config_Constraint;
  update_columns?: Array<On_Prem_Scm_Oauth_Config_Update_Column>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};

/** Ordering options when selecting data from "on_prem_scm_oauth_config". */
export type On_Prem_Scm_Oauth_Config_Order_By = {
  id?: InputMaybe<Order_By>;
  oauthClientId?: InputMaybe<Order_By>;
  oauthClientSecret?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  scmType?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
};

/** primary key columns input for table: on_prem_scm_oauth_config */
export type On_Prem_Scm_Oauth_Config_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "on_prem_scm_oauth_config" */
export enum On_Prem_Scm_Oauth_Config_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OauthClientId = 'oauthClientId',
  /** column name */
  OauthClientSecret = 'oauthClientSecret',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  ScmUrl = 'scmUrl'
}

/** input type for updating data in table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauthClientId?: InputMaybe<Scalars['String']['input']>;
  oauthClientSecret?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "on_prem_scm_oauth_config" */
export type On_Prem_Scm_Oauth_Config_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: On_Prem_Scm_Oauth_Config_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type On_Prem_Scm_Oauth_Config_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauthClientId?: InputMaybe<Scalars['String']['input']>;
  oauthClientSecret?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "on_prem_scm_oauth_config" */
export enum On_Prem_Scm_Oauth_Config_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OauthClientId = 'oauthClientId',
  /** column name */
  OauthClientSecret = 'oauthClientSecret',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  ScmUrl = 'scmUrl'
}

export type On_Prem_Scm_Oauth_Config_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<On_Prem_Scm_Oauth_Config_Set_Input>;
  /** filter the rows which have to be updated */
  where: On_Prem_Scm_Oauth_Config_Bool_Exp;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "organization" */
export type Organization = {
  __typename?: 'organization';
  /** A computed field, executes function "organization_aggregated_unexpired_vulnerabilities_v2" */
  aggregatedUnexpiredVulnerabilitiesState?: Maybe<Array<Aggregated_Fix_State>>;
  /** A computed field, executes function "organization_aggregated_vulnerabilities_v2" */
  aggregatedVulnerabilitiesState?: Maybe<Array<Aggregated_Fix_State>>;
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: Maybe<Scalars['jsonb']['output']>;
  /** A computed field, executes function "top_available_fixes" */
  availableUniqueFixes?: Maybe<Array<Fix>>;
  /** An array relationship */
  brokerHosts: Array<Broker_Host>;
  /** An aggregate relationship */
  brokerHosts_aggregate: Broker_Host_Aggregate;
  brokerTokenExpiryInDays: Scalars['Int']['output'];
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  /** This is a deprecated field it should be deleted */
  enableIssueFilter: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  includeSuppressed: Scalars['Boolean']['output'];
  isAiEnabled: Scalars['Boolean']['output'];
  isPrivateRepoEnabled: Scalars['Boolean']['output'];
  /** An array relationship */
  issueTypeSettings: Array<Organization_Issue_Type_Settings>;
  /** An aggregate relationship */
  issueTypeSettings_aggregate: Organization_Issue_Type_Settings_Aggregate;
  name: Scalars['String']['output'];
  /** An array relationship */
  onPremScmOauthConfigs: Array<On_Prem_Scm_Oauth_Config>;
  /** An aggregate relationship */
  onPremScmOauthConfigs_aggregate: On_Prem_Scm_Oauth_Config_Aggregate;
  /** An array relationship */
  organizationFilesMatchingSettings: Array<Organization_Files_Matching_Settings>;
  /** An aggregate relationship */
  organizationFilesMatchingSettings_aggregate: Organization_Files_Matching_Settings_Aggregate;
  /** An array relationship */
  organizationRoles: Array<Organization_To_Organization_Role>;
  /** An aggregate relationship */
  organizationRoles_aggregate: Organization_To_Organization_Role_Aggregate;
  /** An array relationship */
  organizationUsers: Array<Organization_To_User>;
  /** An aggregate relationship */
  organizationUsers_aggregate: Organization_To_User_Aggregate;
  /** An array relationship */
  projects: Array<Project>;
  /** An aggregate relationship */
  projects_aggregate: Project_Aggregate;
  remainingUnstableFixes: Scalars['Int']['output'];
  /** A computed field, executes function "organization_resolved_aggregated_vulnerability_severities" */
  resolvedAggregatedVulnerabilitySeverities?: Maybe<Array<Aggregated_Severities>>;
  roiDevHourlyRate?: Maybe<Scalars['Int']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  scmConfigs: Array<Scm_Config>;
  /** An aggregate relationship */
  scmConfigs_aggregate: Scm_Config_Aggregate;
  /** A computed field, executes function "organization_unresolved_aggregated_vulnerability_severities" */
  unresolvedAggregatedVulnerabilitySeverities?: Maybe<Array<Aggregated_Severities>>;
};


/** columns and relationships of "organization" */
export type OrganizationAggregatedUnexpiredVulnerabilitiesStateArgs = {
  args: AggregatedUnexpiredVulnerabilitiesState_Organization_Args;
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationAggregatedVulnerabilitiesStateArgs = {
  args: AggregatedVulnerabilitiesState_Organization_Args;
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationAllowedIssueTypesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "organization" */
export type OrganizationAvailableUniqueFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationBrokerHostsArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationBrokerHosts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationIssueTypeSettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationIssueTypeSettings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOnPremScmOauthConfigsArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOnPremScmOauthConfigs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationFilesMatchingSettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationFilesMatchingSettings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationRolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationUsersArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationProjectsArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationProjects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationResolvedAggregatedVulnerabilitySeveritiesArgs = {
  args: ResolvedAggregatedVulnerabilitySeverities_Organization_Args;
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationScmConfigsArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationScmConfigs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationUnresolvedAggregatedVulnerabilitySeveritiesArgs = {
  args: UnresolvedAggregatedVulnerabilitySeverities_Organization_Args;
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};

/** aggregated selection of "organization" */
export type Organization_Aggregate = {
  __typename?: 'organization_aggregate';
  aggregate?: Maybe<Organization_Aggregate_Fields>;
  nodes: Array<Organization>;
};

/** aggregate fields of "organization" */
export type Organization_Aggregate_Fields = {
  __typename?: 'organization_aggregate_fields';
  avg?: Maybe<Organization_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_Max_Fields>;
  min?: Maybe<Organization_Min_Fields>;
  stddev?: Maybe<Organization_Stddev_Fields>;
  stddev_pop?: Maybe<Organization_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Organization_Stddev_Samp_Fields>;
  sum?: Maybe<Organization_Sum_Fields>;
  var_pop?: Maybe<Organization_Var_Pop_Fields>;
  var_samp?: Maybe<Organization_Var_Samp_Fields>;
  variance?: Maybe<Organization_Variance_Fields>;
};


/** aggregate fields of "organization" */
export type Organization_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Organization_Append_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Organization_Avg_Fields = {
  __typename?: 'organization_avg_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "organization". All fields are combined with a logical 'AND'. */
export type Organization_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Bool_Exp>>;
  _not?: InputMaybe<Organization_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Bool_Exp>>;
  allowedIssueTypes?: InputMaybe<Jsonb_Comparison_Exp>;
  availableUniqueFixes?: InputMaybe<Fix_Bool_Exp>;
  brokerHosts?: InputMaybe<Broker_Host_Bool_Exp>;
  brokerHosts_aggregate?: InputMaybe<Broker_Host_Aggregate_Bool_Exp>;
  brokerTokenExpiryInDays?: InputMaybe<Int_Comparison_Exp>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  enableIssueFilter?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  includeSuppressed?: InputMaybe<Boolean_Comparison_Exp>;
  isAiEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  isPrivateRepoEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  issueTypeSettings?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
  issueTypeSettings_aggregate?: InputMaybe<Organization_Issue_Type_Settings_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  onPremScmOauthConfigs?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
  onPremScmOauthConfigs_aggregate?: InputMaybe<On_Prem_Scm_Oauth_Config_Aggregate_Bool_Exp>;
  organizationFilesMatchingSettings?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
  organizationFilesMatchingSettings_aggregate?: InputMaybe<Organization_Files_Matching_Settings_Aggregate_Bool_Exp>;
  organizationRoles?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  organizationRoles_aggregate?: InputMaybe<Organization_To_Organization_Role_Aggregate_Bool_Exp>;
  organizationUsers?: InputMaybe<Organization_To_User_Bool_Exp>;
  organizationUsers_aggregate?: InputMaybe<Organization_To_User_Aggregate_Bool_Exp>;
  projects?: InputMaybe<Project_Bool_Exp>;
  projects_aggregate?: InputMaybe<Project_Aggregate_Bool_Exp>;
  remainingUnstableFixes?: InputMaybe<Int_Comparison_Exp>;
  roiDevHourlyRate?: InputMaybe<Int_Comparison_Exp>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Int_Comparison_Exp>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Int_Comparison_Exp>;
  scmConfigs?: InputMaybe<Scm_Config_Bool_Exp>;
  scmConfigs_aggregate?: InputMaybe<Scm_Config_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "organization" */
export enum Organization_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrganizationPkey = 'organization_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Organization_Delete_At_Path_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Organization_Delete_Elem_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Organization_Delete_Key_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings = {
  __typename?: 'organization_files_matching_settings';
  autogenerated_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  auxiliary_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  organization_id: Scalars['uuid']['output'];
  testing_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  vendor_code_glob_pattern?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Aggregate = {
  __typename?: 'organization_files_matching_settings_aggregate';
  aggregate?: Maybe<Organization_Files_Matching_Settings_Aggregate_Fields>;
  nodes: Array<Organization_Files_Matching_Settings>;
};

export type Organization_Files_Matching_Settings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Organization_Files_Matching_Settings_Aggregate_Bool_Exp_Count>;
};

export type Organization_Files_Matching_Settings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Aggregate_Fields = {
  __typename?: 'organization_files_matching_settings_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_Files_Matching_Settings_Max_Fields>;
  min?: Maybe<Organization_Files_Matching_Settings_Min_Fields>;
};


/** aggregate fields of "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Files_Matching_Settings_Max_Order_By>;
  min?: InputMaybe<Organization_Files_Matching_Settings_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Arr_Rel_Insert_Input = {
  data: Array<Organization_Files_Matching_Settings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Files_Matching_Settings_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_files_matching_settings". All fields are combined with a logical 'AND'. */
export type Organization_Files_Matching_Settings_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Files_Matching_Settings_Bool_Exp>>;
  _not?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Files_Matching_Settings_Bool_Exp>>;
  autogenerated_code_glob_pattern?: InputMaybe<String_Comparison_Exp>;
  auxiliary_code_glob_pattern?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  testing_code_glob_pattern?: InputMaybe<String_Comparison_Exp>;
  vendor_code_glob_pattern?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_files_matching_settings" */
export enum Organization_Files_Matching_Settings_Constraint {
  /** unique or primary key constraint on columns "organization_id" */
  OrganizationFilesMatchingSettingsOrganizationIdKey = 'organization_files_matching_settings_organization_id_key',
  /** unique or primary key constraint on columns "id" */
  OrganizationFilesMatchingSettingsPkey = 'organization_files_matching_settings_pkey'
}

/** input type for inserting data into table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Insert_Input = {
  autogenerated_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  auxiliary_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  testing_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  vendor_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Organization_Files_Matching_Settings_Max_Fields = {
  __typename?: 'organization_files_matching_settings_max_fields';
  autogenerated_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  auxiliary_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  testing_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  vendor_code_glob_pattern?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Max_Order_By = {
  autogenerated_code_glob_pattern?: InputMaybe<Order_By>;
  auxiliary_code_glob_pattern?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  testing_code_glob_pattern?: InputMaybe<Order_By>;
  vendor_code_glob_pattern?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Files_Matching_Settings_Min_Fields = {
  __typename?: 'organization_files_matching_settings_min_fields';
  autogenerated_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  auxiliary_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  testing_code_glob_pattern?: Maybe<Scalars['String']['output']>;
  vendor_code_glob_pattern?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Min_Order_By = {
  autogenerated_code_glob_pattern?: InputMaybe<Order_By>;
  auxiliary_code_glob_pattern?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  testing_code_glob_pattern?: InputMaybe<Order_By>;
  vendor_code_glob_pattern?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Mutation_Response = {
  __typename?: 'organization_files_matching_settings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Files_Matching_Settings>;
};

/** on_conflict condition type for table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_On_Conflict = {
  constraint: Organization_Files_Matching_Settings_Constraint;
  update_columns?: Array<Organization_Files_Matching_Settings_Update_Column>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_files_matching_settings". */
export type Organization_Files_Matching_Settings_Order_By = {
  autogenerated_code_glob_pattern?: InputMaybe<Order_By>;
  auxiliary_code_glob_pattern?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  testing_code_glob_pattern?: InputMaybe<Order_By>;
  vendor_code_glob_pattern?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_files_matching_settings */
export type Organization_Files_Matching_Settings_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "organization_files_matching_settings" */
export enum Organization_Files_Matching_Settings_Select_Column {
  /** column name */
  AutogeneratedCodeGlobPattern = 'autogenerated_code_glob_pattern',
  /** column name */
  AuxiliaryCodeGlobPattern = 'auxiliary_code_glob_pattern',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  TestingCodeGlobPattern = 'testing_code_glob_pattern',
  /** column name */
  VendorCodeGlobPattern = 'vendor_code_glob_pattern'
}

/** input type for updating data in table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Set_Input = {
  autogenerated_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  auxiliary_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  testing_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  vendor_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "organization_files_matching_settings" */
export type Organization_Files_Matching_Settings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Files_Matching_Settings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_Files_Matching_Settings_Stream_Cursor_Value_Input = {
  autogenerated_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  auxiliary_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  testing_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
  vendor_code_glob_pattern?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "organization_files_matching_settings" */
export enum Organization_Files_Matching_Settings_Update_Column {
  /** column name */
  AutogeneratedCodeGlobPattern = 'autogenerated_code_glob_pattern',
  /** column name */
  AuxiliaryCodeGlobPattern = 'auxiliary_code_glob_pattern',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  TestingCodeGlobPattern = 'testing_code_glob_pattern',
  /** column name */
  VendorCodeGlobPattern = 'vendor_code_glob_pattern'
}

export type Organization_Files_Matching_Settings_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Files_Matching_Settings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_Files_Matching_Settings_Bool_Exp;
};

/** input type for incrementing numeric columns in table "organization" */
export type Organization_Inc_Input = {
  brokerTokenExpiryInDays?: InputMaybe<Scalars['Int']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  roiDevHourlyRate?: InputMaybe<Scalars['Int']['input']>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "organization" */
export type Organization_Insert_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['jsonb']['input']>;
  brokerHosts?: InputMaybe<Broker_Host_Arr_Rel_Insert_Input>;
  brokerTokenExpiryInDays?: InputMaybe<Scalars['Int']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This is a deprecated field it should be deleted */
  enableIssueFilter?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  includeSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivateRepoEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  issueTypeSettings?: InputMaybe<Organization_Issue_Type_Settings_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']['input']>;
  onPremScmOauthConfigs?: InputMaybe<On_Prem_Scm_Oauth_Config_Arr_Rel_Insert_Input>;
  organizationFilesMatchingSettings?: InputMaybe<Organization_Files_Matching_Settings_Arr_Rel_Insert_Input>;
  organizationRoles?: InputMaybe<Organization_To_Organization_Role_Arr_Rel_Insert_Input>;
  organizationUsers?: InputMaybe<Organization_To_User_Arr_Rel_Insert_Input>;
  projects?: InputMaybe<Project_Arr_Rel_Insert_Input>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  roiDevHourlyRate?: InputMaybe<Scalars['Int']['input']>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
  scmConfigs?: InputMaybe<Scm_Config_Arr_Rel_Insert_Input>;
};

/** Many-to-many table for managing issue type setting inside the organization  */
export type Organization_Issue_Type_Settings = {
  __typename?: 'organization_issue_type_settings';
  autoPrEnabled: Scalars['Boolean']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  issueType: IssueType_Enum;
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
};

/** aggregated selection of "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Aggregate = {
  __typename?: 'organization_issue_type_settings_aggregate';
  aggregate?: Maybe<Organization_Issue_Type_Settings_Aggregate_Fields>;
  nodes: Array<Organization_Issue_Type_Settings>;
};

export type Organization_Issue_Type_Settings_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Count>;
};

export type Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And = {
  arguments: Organization_Issue_Type_Settings_Select_Column_Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Organization_Issue_Type_Settings_Select_Column_Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Aggregate_Fields = {
  __typename?: 'organization_issue_type_settings_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_Issue_Type_Settings_Max_Fields>;
  min?: Maybe<Organization_Issue_Type_Settings_Min_Fields>;
};


/** aggregate fields of "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Issue_Type_Settings_Max_Order_By>;
  min?: InputMaybe<Organization_Issue_Type_Settings_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Arr_Rel_Insert_Input = {
  data: Array<Organization_Issue_Type_Settings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Issue_Type_Settings_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_issue_type_settings". All fields are combined with a logical 'AND'. */
export type Organization_Issue_Type_Settings_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Issue_Type_Settings_Bool_Exp>>;
  _not?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Issue_Type_Settings_Bool_Exp>>;
  autoPrEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  enabled?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  issueType?: InputMaybe<IssueType_Enum_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_issue_type_settings" */
export enum Organization_Issue_Type_Settings_Constraint {
  /** unique or primary key constraint on columns "organization_id", "issue_type" */
  OrganizationIssueTypeSettingsOrganizationIdIssueTypeKey = 'organization_issue_type_settings_organization_id_issue_type_key',
  /** unique or primary key constraint on columns "id" */
  OrganizationIssueTypeSettingsPkey = 'organization_issue_type_settings_pkey'
}

/** input type for inserting data into table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Insert_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Organization_Issue_Type_Settings_Max_Fields = {
  __typename?: 'organization_issue_type_settings_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Issue_Type_Settings_Min_Fields = {
  __typename?: 'organization_issue_type_settings_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Mutation_Response = {
  __typename?: 'organization_issue_type_settings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Issue_Type_Settings>;
};

/** on_conflict condition type for table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_On_Conflict = {
  constraint: Organization_Issue_Type_Settings_Constraint;
  update_columns?: Array<Organization_Issue_Type_Settings_Update_Column>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_issue_type_settings". */
export type Organization_Issue_Type_Settings_Order_By = {
  autoPrEnabled?: InputMaybe<Order_By>;
  enabled?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_issue_type_settings */
export type Organization_Issue_Type_Settings_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "organization_issue_type_settings" */
export enum Organization_Issue_Type_Settings_Select_Column {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  OrganizationId = 'organizationId'
}

/** select "organization_issue_type_settings_aggregate_bool_exp_bool_and_arguments_columns" columns of table "organization_issue_type_settings" */
export enum Organization_Issue_Type_Settings_Select_Column_Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled'
}

/** select "organization_issue_type_settings_aggregate_bool_exp_bool_or_arguments_columns" columns of table "organization_issue_type_settings" */
export enum Organization_Issue_Type_Settings_Select_Column_Organization_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled'
}

/** input type for updating data in table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Set_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "organization_issue_type_settings" */
export type Organization_Issue_Type_Settings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Issue_Type_Settings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_Issue_Type_Settings_Stream_Cursor_Value_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "organization_issue_type_settings" */
export enum Organization_Issue_Type_Settings_Update_Column {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  OrganizationId = 'organizationId'
}

export type Organization_Issue_Type_Settings_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Issue_Type_Settings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_Issue_Type_Settings_Bool_Exp;
};

/** aggregate max on columns */
export type Organization_Max_Fields = {
  __typename?: 'organization_max_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Int']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Int']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Organization_Min_Fields = {
  __typename?: 'organization_min_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Int']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Int']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "organization" */
export type Organization_Mutation_Response = {
  __typename?: 'organization_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization>;
};

/** input type for inserting object relation for remote table "organization" */
export type Organization_Obj_Rel_Insert_Input = {
  data: Organization_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};

/** on_conflict condition type for table "organization" */
export type Organization_On_Conflict = {
  constraint: Organization_Constraint;
  update_columns?: Array<Organization_Update_Column>;
  where?: InputMaybe<Organization_Bool_Exp>;
};

/** Ordering options when selecting data from "organization". */
export type Organization_Order_By = {
  allowedIssueTypes?: InputMaybe<Order_By>;
  availableUniqueFixes_aggregate?: InputMaybe<Fix_Aggregate_Order_By>;
  brokerHosts_aggregate?: InputMaybe<Broker_Host_Aggregate_Order_By>;
  brokerTokenExpiryInDays?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  enableIssueFilter?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  includeSuppressed?: InputMaybe<Order_By>;
  isAiEnabled?: InputMaybe<Order_By>;
  isPrivateRepoEnabled?: InputMaybe<Order_By>;
  issueTypeSettings_aggregate?: InputMaybe<Organization_Issue_Type_Settings_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  onPremScmOauthConfigs_aggregate?: InputMaybe<On_Prem_Scm_Oauth_Config_Aggregate_Order_By>;
  organizationFilesMatchingSettings_aggregate?: InputMaybe<Organization_Files_Matching_Settings_Aggregate_Order_By>;
  organizationRoles_aggregate?: InputMaybe<Organization_To_Organization_Role_Aggregate_Order_By>;
  organizationUsers_aggregate?: InputMaybe<Organization_To_User_Aggregate_Order_By>;
  projects_aggregate?: InputMaybe<Project_Aggregate_Order_By>;
  remainingUnstableFixes?: InputMaybe<Order_By>;
  roiDevHourlyRate?: InputMaybe<Order_By>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Order_By>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Order_By>;
  scmConfigs_aggregate?: InputMaybe<Scm_Config_Aggregate_Order_By>;
};

/** primary key columns input for table: organization */
export type Organization_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Organization_Prepend_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['jsonb']['input']>;
};

/** columns and relationships of "organization_role" */
export type Organization_Role = {
  __typename?: 'organization_role';
  canChangeRole: Scalars['Boolean']['output'];
  canCreateProject: Scalars['Boolean']['output'];
  canDeleteUserFromOrganization: Scalars['Boolean']['output'];
  canEditBrokerSettings: Scalars['Boolean']['output'];
  canInviteToOrganization: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  /** An array relationship */
  organizationTorganizationRole: Array<Organization_To_Organization_Role>;
  /** An aggregate relationship */
  organizationTorganizationRole_aggregate: Organization_To_Organization_Role_Aggregate;
  type: Organization_Role_Type_Enum;
};


/** columns and relationships of "organization_role" */
export type Organization_RoleOrganizationTorganizationRoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


/** columns and relationships of "organization_role" */
export type Organization_RoleOrganizationTorganizationRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};

/** aggregated selection of "organization_role" */
export type Organization_Role_Aggregate = {
  __typename?: 'organization_role_aggregate';
  aggregate?: Maybe<Organization_Role_Aggregate_Fields>;
  nodes: Array<Organization_Role>;
};

/** aggregate fields of "organization_role" */
export type Organization_Role_Aggregate_Fields = {
  __typename?: 'organization_role_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_Role_Max_Fields>;
  min?: Maybe<Organization_Role_Min_Fields>;
};


/** aggregate fields of "organization_role" */
export type Organization_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "organization_role". All fields are combined with a logical 'AND'. */
export type Organization_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Role_Bool_Exp>>;
  _not?: InputMaybe<Organization_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Role_Bool_Exp>>;
  canChangeRole?: InputMaybe<Boolean_Comparison_Exp>;
  canCreateProject?: InputMaybe<Boolean_Comparison_Exp>;
  canDeleteUserFromOrganization?: InputMaybe<Boolean_Comparison_Exp>;
  canEditBrokerSettings?: InputMaybe<Boolean_Comparison_Exp>;
  canInviteToOrganization?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organizationTorganizationRole?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  organizationTorganizationRole_aggregate?: InputMaybe<Organization_To_Organization_Role_Aggregate_Bool_Exp>;
  type?: InputMaybe<Organization_Role_Type_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_role" */
export enum Organization_Role_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrganizationRolePkey1 = 'organization_role_pkey1'
}

/** input type for inserting data into table "organization_role" */
export type Organization_Role_Insert_Input = {
  canChangeRole?: InputMaybe<Scalars['Boolean']['input']>;
  canCreateProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteUserFromOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  canEditBrokerSettings?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteToOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationTorganizationRole?: InputMaybe<Organization_To_Organization_Role_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Organization_Role_Type_Enum>;
};

/** aggregate max on columns */
export type Organization_Role_Max_Fields = {
  __typename?: 'organization_role_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Organization_Role_Min_Fields = {
  __typename?: 'organization_role_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "organization_role" */
export type Organization_Role_Mutation_Response = {
  __typename?: 'organization_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Role>;
};

/** input type for inserting object relation for remote table "organization_role" */
export type Organization_Role_Obj_Rel_Insert_Input = {
  data: Organization_Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};

/** on_conflict condition type for table "organization_role" */
export type Organization_Role_On_Conflict = {
  constraint: Organization_Role_Constraint;
  update_columns?: Array<Organization_Role_Update_Column>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_role". */
export type Organization_Role_Order_By = {
  canChangeRole?: InputMaybe<Order_By>;
  canCreateProject?: InputMaybe<Order_By>;
  canDeleteUserFromOrganization?: InputMaybe<Order_By>;
  canEditBrokerSettings?: InputMaybe<Order_By>;
  canInviteToOrganization?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationTorganizationRole_aggregate?: InputMaybe<Organization_To_Organization_Role_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_role */
export type Organization_Role_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "organization_role" */
export enum Organization_Role_Select_Column {
  /** column name */
  CanChangeRole = 'canChangeRole',
  /** column name */
  CanCreateProject = 'canCreateProject',
  /** column name */
  CanDeleteUserFromOrganization = 'canDeleteUserFromOrganization',
  /** column name */
  CanEditBrokerSettings = 'canEditBrokerSettings',
  /** column name */
  CanInviteToOrganization = 'canInviteToOrganization',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "organization_role" */
export type Organization_Role_Set_Input = {
  canChangeRole?: InputMaybe<Scalars['Boolean']['input']>;
  canCreateProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteUserFromOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  canEditBrokerSettings?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteToOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Organization_Role_Type_Enum>;
};

/** Streaming cursor of the table "organization_role" */
export type Organization_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_Role_Stream_Cursor_Value_Input = {
  canChangeRole?: InputMaybe<Scalars['Boolean']['input']>;
  canCreateProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteUserFromOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  canEditBrokerSettings?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteToOrganization?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Organization_Role_Type_Enum>;
};

/** columns and relationships of "organization_role_type" */
export type Organization_Role_Type = {
  __typename?: 'organization_role_type';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "organization_role_type" */
export type Organization_Role_Type_Aggregate = {
  __typename?: 'organization_role_type_aggregate';
  aggregate?: Maybe<Organization_Role_Type_Aggregate_Fields>;
  nodes: Array<Organization_Role_Type>;
};

/** aggregate fields of "organization_role_type" */
export type Organization_Role_Type_Aggregate_Fields = {
  __typename?: 'organization_role_type_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_Role_Type_Max_Fields>;
  min?: Maybe<Organization_Role_Type_Min_Fields>;
};


/** aggregate fields of "organization_role_type" */
export type Organization_Role_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Role_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "organization_role_type". All fields are combined with a logical 'AND'. */
export type Organization_Role_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Role_Type_Bool_Exp>>;
  _not?: InputMaybe<Organization_Role_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Role_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_role_type" */
export enum Organization_Role_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  OrganizationRolePkey = 'organization_role_pkey'
}

export enum Organization_Role_Type_Enum {
  /** manager */
  Manager = 'manager',
  /** member role */
  Member = 'member',
  /** owner */
  Owner = 'owner'
}

/** Boolean expression to compare columns of type "organization_role_type_enum". All fields are combined with logical 'AND'. */
export type Organization_Role_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Organization_Role_Type_Enum>;
  _in?: InputMaybe<Array<Organization_Role_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Organization_Role_Type_Enum>;
  _nin?: InputMaybe<Array<Organization_Role_Type_Enum>>;
};

/** input type for inserting data into table "organization_role_type" */
export type Organization_Role_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Organization_Role_Type_Max_Fields = {
  __typename?: 'organization_role_type_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Organization_Role_Type_Min_Fields = {
  __typename?: 'organization_role_type_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "organization_role_type" */
export type Organization_Role_Type_Mutation_Response = {
  __typename?: 'organization_role_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Role_Type>;
};

/** on_conflict condition type for table "organization_role_type" */
export type Organization_Role_Type_On_Conflict = {
  constraint: Organization_Role_Type_Constraint;
  update_columns?: Array<Organization_Role_Type_Update_Column>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_role_type". */
export type Organization_Role_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_role_type */
export type Organization_Role_Type_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "organization_role_type" */
export enum Organization_Role_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "organization_role_type" */
export type Organization_Role_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "organization_role_type" */
export type Organization_Role_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Role_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_Role_Type_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "organization_role_type" */
export enum Organization_Role_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Organization_Role_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Role_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_Role_Type_Bool_Exp;
};

/** update columns of table "organization_role" */
export enum Organization_Role_Update_Column {
  /** column name */
  CanChangeRole = 'canChangeRole',
  /** column name */
  CanCreateProject = 'canCreateProject',
  /** column name */
  CanDeleteUserFromOrganization = 'canDeleteUserFromOrganization',
  /** column name */
  CanEditBrokerSettings = 'canEditBrokerSettings',
  /** column name */
  CanInviteToOrganization = 'canInviteToOrganization',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type'
}

export type Organization_Role_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_Role_Bool_Exp;
};

/** select columns of table "organization" */
export enum Organization_Select_Column {
  /** column name */
  AllowedIssueTypes = 'allowedIssueTypes',
  /** column name */
  BrokerTokenExpiryInDays = 'brokerTokenExpiryInDays',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  EnableIssueFilter = 'enableIssueFilter',
  /** column name */
  Id = 'id',
  /** column name */
  IncludeSuppressed = 'includeSuppressed',
  /** column name */
  IsAiEnabled = 'isAiEnabled',
  /** column name */
  IsPrivateRepoEnabled = 'isPrivateRepoEnabled',
  /** column name */
  Name = 'name',
  /** column name */
  RemainingUnstableFixes = 'remainingUnstableFixes',
  /** column name */
  RoiDevHourlyRate = 'roiDevHourlyRate',
  /** column name */
  RoiIndustryFixingTimeInMinutes = 'roiIndustryFixingTimeInMinutes',
  /** column name */
  RoiMobbFixingTimeInMinutes = 'roiMobbFixingTimeInMinutes'
}

/** input type for updating data in table "organization" */
export type Organization_Set_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['jsonb']['input']>;
  brokerTokenExpiryInDays?: InputMaybe<Scalars['Int']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This is a deprecated field it should be deleted */
  enableIssueFilter?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  includeSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivateRepoEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  roiDevHourlyRate?: InputMaybe<Scalars['Int']['input']>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Organization_Stddev_Fields = {
  __typename?: 'organization_stddev_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Organization_Stddev_Pop_Fields = {
  __typename?: 'organization_stddev_pop_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Organization_Stddev_Samp_Fields = {
  __typename?: 'organization_stddev_samp_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "organization" */
export type Organization_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_Stream_Cursor_Value_Input = {
  /** This is a deprecated field it should be deleted */
  allowedIssueTypes?: InputMaybe<Scalars['jsonb']['input']>;
  brokerTokenExpiryInDays?: InputMaybe<Scalars['Int']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This is a deprecated field it should be deleted */
  enableIssueFilter?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  includeSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  isAiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivateRepoEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remainingUnstableFixes?: InputMaybe<Scalars['Int']['input']>;
  roiDevHourlyRate?: InputMaybe<Scalars['Int']['input']>;
  roiIndustryFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
  roiMobbFixingTimeInMinutes?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Organization_Sum_Fields = {
  __typename?: 'organization_sum_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Int']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Int']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Int']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Int']['output']>;
};

/** columns and relationships of "organization_to_organization_role" */
export type Organization_To_Organization_Role = {
  __typename?: 'organization_to_organization_role';
  id: Scalars['uuid']['output'];
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
  /** An object relationship */
  organizationRole: Organization_Role;
  organizationRoleId: Scalars['uuid']['output'];
  /** An array relationship */
  organizationToUsers: Array<Organization_To_User>;
  /** An aggregate relationship */
  organizationToUsers_aggregate: Organization_To_User_Aggregate;
};


/** columns and relationships of "organization_to_organization_role" */
export type Organization_To_Organization_RoleOrganizationToUsersArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


/** columns and relationships of "organization_to_organization_role" */
export type Organization_To_Organization_RoleOrganizationToUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};

/** aggregated selection of "organization_to_organization_role" */
export type Organization_To_Organization_Role_Aggregate = {
  __typename?: 'organization_to_organization_role_aggregate';
  aggregate?: Maybe<Organization_To_Organization_Role_Aggregate_Fields>;
  nodes: Array<Organization_To_Organization_Role>;
};

export type Organization_To_Organization_Role_Aggregate_Bool_Exp = {
  count?: InputMaybe<Organization_To_Organization_Role_Aggregate_Bool_Exp_Count>;
};

export type Organization_To_Organization_Role_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "organization_to_organization_role" */
export type Organization_To_Organization_Role_Aggregate_Fields = {
  __typename?: 'organization_to_organization_role_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_To_Organization_Role_Max_Fields>;
  min?: Maybe<Organization_To_Organization_Role_Min_Fields>;
};


/** aggregate fields of "organization_to_organization_role" */
export type Organization_To_Organization_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_To_Organization_Role_Max_Order_By>;
  min?: InputMaybe<Organization_To_Organization_Role_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Arr_Rel_Insert_Input = {
  data: Array<Organization_To_Organization_Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_To_Organization_Role_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_to_organization_role". All fields are combined with a logical 'AND'. */
export type Organization_To_Organization_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_To_Organization_Role_Bool_Exp>>;
  _not?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_To_Organization_Role_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  organizationRole?: InputMaybe<Organization_Role_Bool_Exp>;
  organizationRoleId?: InputMaybe<Uuid_Comparison_Exp>;
  organizationToUsers?: InputMaybe<Organization_To_User_Bool_Exp>;
  organizationToUsers_aggregate?: InputMaybe<Organization_To_User_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "organization_to_organization_role" */
export enum Organization_To_Organization_Role_Constraint {
  /** unique or primary key constraint on columns "organization_role_id", "organization_id" */
  OrganizationToOrganizationRoleOrganizationIdOrganization = 'organization_to_organization_role_organization_id_organization_',
  /** unique or primary key constraint on columns "id" */
  OrganizationToOrganizationRolePkey = 'organization_to_organization_role_pkey'
}

/** input type for inserting data into table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationRole?: InputMaybe<Organization_Role_Obj_Rel_Insert_Input>;
  organizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
  organizationToUsers?: InputMaybe<Organization_To_User_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Organization_To_Organization_Role_Max_Fields = {
  __typename?: 'organization_to_organization_role_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  organizationRoleId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationRoleId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_To_Organization_Role_Min_Fields = {
  __typename?: 'organization_to_organization_role_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  organizationRoleId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationRoleId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Mutation_Response = {
  __typename?: 'organization_to_organization_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_To_Organization_Role>;
};

/** input type for inserting object relation for remote table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Obj_Rel_Insert_Input = {
  data: Organization_To_Organization_Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_To_Organization_Role_On_Conflict>;
};

/** on_conflict condition type for table "organization_to_organization_role" */
export type Organization_To_Organization_Role_On_Conflict = {
  constraint: Organization_To_Organization_Role_Constraint;
  update_columns?: Array<Organization_To_Organization_Role_Update_Column>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_to_organization_role". */
export type Organization_To_Organization_Role_Order_By = {
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationRole?: InputMaybe<Organization_Role_Order_By>;
  organizationRoleId?: InputMaybe<Order_By>;
  organizationToUsers_aggregate?: InputMaybe<Organization_To_User_Aggregate_Order_By>;
};

/** primary key columns input for table: organization_to_organization_role */
export type Organization_To_Organization_Role_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "organization_to_organization_role" */
export enum Organization_To_Organization_Role_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  OrganizationRoleId = 'organizationRoleId'
}

/** input type for updating data in table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "organization_to_organization_role" */
export type Organization_To_Organization_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_To_Organization_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_To_Organization_Role_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "organization_to_organization_role" */
export enum Organization_To_Organization_Role_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  OrganizationRoleId = 'organizationRoleId'
}

export type Organization_To_Organization_Role_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_To_Organization_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_To_Organization_Role_Bool_Exp;
};

/** columns and relationships of "organization_to_user" */
export type Organization_To_User = {
  __typename?: 'organization_to_user';
  createdOn: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
  organizationToOrganizationRoleId: Scalars['uuid']['output'];
  /** An object relationship */
  organizationToRole: Organization_To_Organization_Role;
  /** An object relationship */
  user: User;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "organization_to_user" */
export type Organization_To_User_Aggregate = {
  __typename?: 'organization_to_user_aggregate';
  aggregate?: Maybe<Organization_To_User_Aggregate_Fields>;
  nodes: Array<Organization_To_User>;
};

export type Organization_To_User_Aggregate_Bool_Exp = {
  count?: InputMaybe<Organization_To_User_Aggregate_Bool_Exp_Count>;
};

export type Organization_To_User_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Organization_To_User_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "organization_to_user" */
export type Organization_To_User_Aggregate_Fields = {
  __typename?: 'organization_to_user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Organization_To_User_Max_Fields>;
  min?: Maybe<Organization_To_User_Min_Fields>;
};


/** aggregate fields of "organization_to_user" */
export type Organization_To_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "organization_to_user" */
export type Organization_To_User_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_To_User_Max_Order_By>;
  min?: InputMaybe<Organization_To_User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_to_user" */
export type Organization_To_User_Arr_Rel_Insert_Input = {
  data: Array<Organization_To_User_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_To_User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_to_user". All fields are combined with a logical 'AND'. */
export type Organization_To_User_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_To_User_Bool_Exp>>;
  _not?: InputMaybe<Organization_To_User_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_To_User_Bool_Exp>>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  organizationToOrganizationRoleId?: InputMaybe<Uuid_Comparison_Exp>;
  organizationToRole?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_to_user" */
export enum Organization_To_User_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrganizationToUserPkey = 'organization_to_user_pkey',
  /** unique or primary key constraint on columns "user_id", "organization_id" */
  OrganizationToUserUserIdOrganizationIdKey = 'organization_to_user_user_id_organization_id_key'
}

/** input type for inserting data into table "organization_to_user" */
export type Organization_To_User_Insert_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationToOrganizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
  organizationToRole?: InputMaybe<Organization_To_Organization_Role_Obj_Rel_Insert_Input>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Organization_To_User_Max_Fields = {
  __typename?: 'organization_to_user_max_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  organizationToOrganizationRoleId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "organization_to_user" */
export type Organization_To_User_Max_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationToOrganizationRoleId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_To_User_Min_Fields = {
  __typename?: 'organization_to_user_min_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  organizationToOrganizationRoleId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "organization_to_user" */
export type Organization_To_User_Min_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationToOrganizationRoleId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_to_user" */
export type Organization_To_User_Mutation_Response = {
  __typename?: 'organization_to_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_To_User>;
};

/** on_conflict condition type for table "organization_to_user" */
export type Organization_To_User_On_Conflict = {
  constraint: Organization_To_User_Constraint;
  update_columns?: Array<Organization_To_User_Update_Column>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_to_user". */
export type Organization_To_User_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  organizationToOrganizationRoleId?: InputMaybe<Order_By>;
  organizationToRole?: InputMaybe<Organization_To_Organization_Role_Order_By>;
  user?: InputMaybe<User_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_to_user */
export type Organization_To_User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "organization_to_user" */
export enum Organization_To_User_Select_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  OrganizationToOrganizationRoleId = 'organizationToOrganizationRoleId',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "organization_to_user" */
export type Organization_To_User_Set_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationToOrganizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "organization_to_user" */
export type Organization_To_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_To_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Organization_To_User_Stream_Cursor_Value_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  organizationToOrganizationRoleId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "organization_to_user" */
export enum Organization_To_User_Update_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  OrganizationToOrganizationRoleId = 'organizationToOrganizationRoleId',
  /** column name */
  UserId = 'userId'
}

export type Organization_To_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_To_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_To_User_Bool_Exp;
};

/** update columns of table "organization" */
export enum Organization_Update_Column {
  /** column name */
  AllowedIssueTypes = 'allowedIssueTypes',
  /** column name */
  BrokerTokenExpiryInDays = 'brokerTokenExpiryInDays',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  EnableIssueFilter = 'enableIssueFilter',
  /** column name */
  Id = 'id',
  /** column name */
  IncludeSuppressed = 'includeSuppressed',
  /** column name */
  IsAiEnabled = 'isAiEnabled',
  /** column name */
  IsPrivateRepoEnabled = 'isPrivateRepoEnabled',
  /** column name */
  Name = 'name',
  /** column name */
  RemainingUnstableFixes = 'remainingUnstableFixes',
  /** column name */
  RoiDevHourlyRate = 'roiDevHourlyRate',
  /** column name */
  RoiIndustryFixingTimeInMinutes = 'roiIndustryFixingTimeInMinutes',
  /** column name */
  RoiMobbFixingTimeInMinutes = 'roiMobbFixingTimeInMinutes'
}

export type Organization_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Organization_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Organization_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Organization_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Organization_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Organization_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Organization_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Set_Input>;
  /** filter the rows which have to be updated */
  where: Organization_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Organization_Var_Pop_Fields = {
  __typename?: 'organization_var_pop_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Organization_Var_Samp_Fields = {
  __typename?: 'organization_var_samp_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Organization_Variance_Fields = {
  __typename?: 'organization_variance_fields';
  brokerTokenExpiryInDays?: Maybe<Scalars['Float']['output']>;
  remainingUnstableFixes?: Maybe<Scalars['Float']['output']>;
  roiDevHourlyRate?: Maybe<Scalars['Float']['output']>;
  roiIndustryFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
  roiMobbFixingTimeInMinutes?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "project" */
export type Project = {
  __typename?: 'project';
  /** A computed field, executes function "project_aggregated_resolved_vulnerability_severities" */
  aggregatedResolvedVulnerabilities?: Maybe<Array<Aggregated_Severities>>;
  /** An array relationship */
  aggregatedResolvedVulnerabilitiesView: Array<View_Project_Resolved_Vulnerabilities>;
  /** An aggregate relationship */
  aggregatedResolvedVulnerabilitiesView_aggregate: View_Project_Resolved_Vulnerabilities_Aggregate;
  /** A computed field, executes function "project_aggregated_vulnerability_severities" */
  aggregatedVulnerabilitySeverities?: Maybe<Array<Aggregated_Severities>>;
  /** An array relationship */
  aggregatedVulnerabilitySeveritiesView: Array<View_Project_Vulnerability_Severities>;
  /** An aggregate relationship */
  aggregatedVulnerabilitySeveritiesView_aggregate: View_Project_Vulnerability_Severities_Aggregate;
  createdOn: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  /** fetches the latest vul report for  repo-url, reference, vendor tuple */
  lastAnalysedVulReports?: Maybe<Array<Vulnerability_Report>>;
  name: Scalars['String']['output'];
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid']['output'];
  /** An array relationship */
  projectIssueTypeSettings: Array<Project_Issue_Type_Settings>;
  /** An aggregate relationship */
  projectIssueTypeSettings_aggregate: Project_Issue_Type_Settings_Aggregate;
  /** An array relationship */
  projectRoles: Array<Project_To_Project_Role>;
  /** An aggregate relationship */
  projectRoles_aggregate: Project_To_Project_Role_Aggregate;
  /** An array relationship */
  projectUsers: Array<Project_To_User>;
  /** An aggregate relationship */
  projectUsers_aggregate: Project_To_User_Aggregate;
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  totalResolvedVulnerabilitiesView?: Maybe<View_Project_Total_Resolved_Vulnerabilities>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  totalUniqueUnresolvedVulnerabilitiesView?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities>;
  updatedAt: Scalars['timestamptz']['output'];
  /** An array relationship */
  vulnerabilityReports: Array<Vulnerability_Report>;
  /** An aggregate relationship */
  vulnerabilityReports_aggregate: Vulnerability_Report_Aggregate;
};


/** columns and relationships of "project" */
export type ProjectAggregatedResolvedVulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectAggregatedResolvedVulnerabilitiesViewArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectAggregatedResolvedVulnerabilitiesView_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectAggregatedVulnerabilitySeveritiesArgs = {
  args: AggregatedVulnerabilitySeverities_Project_Args;
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectAggregatedVulnerabilitySeveritiesViewArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectAggregatedVulnerabilitySeveritiesView_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectLastAnalysedVulReportsArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectIssueTypeSettingsArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectIssueTypeSettings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectRolesArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectUsersArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectProjectUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};


/** columns and relationships of "project" */
export type ProjectVulnerabilityReportsArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


/** columns and relationships of "project" */
export type ProjectVulnerabilityReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};

/** aggregated selection of "project" */
export type Project_Aggregate = {
  __typename?: 'project_aggregate';
  aggregate?: Maybe<Project_Aggregate_Fields>;
  nodes: Array<Project>;
};

export type Project_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Project_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Project_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Project_Aggregate_Bool_Exp_Count>;
};

export type Project_Aggregate_Bool_Exp_Bool_And = {
  arguments: Project_Select_Column_Project_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Project_Select_Column_Project_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Project_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "project" */
export type Project_Aggregate_Fields = {
  __typename?: 'project_aggregate_fields';
  avg?: Maybe<Project_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Project_Max_Fields>;
  min?: Maybe<Project_Min_Fields>;
  stddev?: Maybe<Project_Stddev_Fields>;
  stddev_pop?: Maybe<Project_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Project_Stddev_Samp_Fields>;
  sum?: Maybe<Project_Sum_Fields>;
  var_pop?: Maybe<Project_Var_Pop_Fields>;
  var_samp?: Maybe<Project_Var_Samp_Fields>;
  variance?: Maybe<Project_Variance_Fields>;
};


/** aggregate fields of "project" */
export type Project_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "project" */
export type Project_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Project_Max_Order_By>;
  min?: InputMaybe<Project_Min_Order_By>;
};

/** input type for inserting array relation for remote table "project" */
export type Project_Arr_Rel_Insert_Input = {
  data: Array<Project_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_On_Conflict>;
};

/** aggregate avg on columns */
export type Project_Avg_Fields = {
  __typename?: 'project_avg_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate avg on columns */
export type Project_Avg_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** Boolean expression to filter rows from the table "project". All fields are combined with a logical 'AND'. */
export type Project_Bool_Exp = {
  _and?: InputMaybe<Array<Project_Bool_Exp>>;
  _not?: InputMaybe<Project_Bool_Exp>;
  _or?: InputMaybe<Array<Project_Bool_Exp>>;
  aggregatedResolvedVulnerabilities?: InputMaybe<Aggregated_Severities_Bool_Exp>;
  aggregatedResolvedVulnerabilitiesView?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
  aggregatedResolvedVulnerabilitiesView_aggregate?: InputMaybe<View_Project_Resolved_Vulnerabilities_Aggregate_Bool_Exp>;
  aggregatedVulnerabilitySeveritiesView?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
  aggregatedVulnerabilitySeveritiesView_aggregate?: InputMaybe<View_Project_Vulnerability_Severities_Aggregate_Bool_Exp>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isDefault?: InputMaybe<Boolean_Comparison_Exp>;
  isDeleted?: InputMaybe<Boolean_Comparison_Exp>;
  lastAnalysedVulReports?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  projectIssueTypeSettings?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
  projectIssueTypeSettings_aggregate?: InputMaybe<Project_Issue_Type_Settings_Aggregate_Bool_Exp>;
  projectRoles?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
  projectRoles_aggregate?: InputMaybe<Project_To_Project_Role_Aggregate_Bool_Exp>;
  projectUsers?: InputMaybe<Project_To_User_Bool_Exp>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
  totalResolvedVulnerabilities?: InputMaybe<Int_Comparison_Exp>;
  totalResolvedVulnerabilitiesView?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
  totalUniqueUnresolvedVulnerabilitiesView?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  vulnerabilityReports?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  vulnerabilityReports_aggregate?: InputMaybe<Vulnerability_Report_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "project" */
export enum Project_Constraint {
  /** unique or primary key constraint on columns "organization_id", "name" */
  ProjectNameOrganizationIdKey = 'project_name_organization_id_key',
  /** unique or primary key constraint on columns "id" */
  ProjectPkey = 'project_pkey'
}

/** input type for inserting data into table "project" */
export type Project_Insert_Input = {
  aggregatedResolvedVulnerabilitiesView?: InputMaybe<View_Project_Resolved_Vulnerabilities_Arr_Rel_Insert_Input>;
  aggregatedVulnerabilitySeveritiesView?: InputMaybe<View_Project_Vulnerability_Severities_Arr_Rel_Insert_Input>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  projectIssueTypeSettings?: InputMaybe<Project_Issue_Type_Settings_Arr_Rel_Insert_Input>;
  projectRoles?: InputMaybe<Project_To_Project_Role_Arr_Rel_Insert_Input>;
  projectUsers?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
  totalResolvedVulnerabilitiesView?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Obj_Rel_Insert_Input>;
  totalUniqueUnresolvedVulnerabilitiesView?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Obj_Rel_Insert_Input>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  vulnerabilityReports?: InputMaybe<Vulnerability_Report_Arr_Rel_Insert_Input>;
};

/** Many-to-many table for managing issue type setting inside the project */
export type Project_Issue_Type_Settings = {
  __typename?: 'project_issue_type_settings';
  autoPrEnabled: Scalars['Boolean']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  issueType: IssueType_Enum;
  /** An object relationship */
  project: Project;
  projectId: Scalars['uuid']['output'];
};

/** aggregated selection of "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Aggregate = {
  __typename?: 'project_issue_type_settings_aggregate';
  aggregate?: Maybe<Project_Issue_Type_Settings_Aggregate_Fields>;
  nodes: Array<Project_Issue_Type_Settings>;
};

export type Project_Issue_Type_Settings_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Project_Issue_Type_Settings_Aggregate_Bool_Exp_Count>;
};

export type Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And = {
  arguments: Project_Issue_Type_Settings_Select_Column_Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Project_Issue_Type_Settings_Select_Column_Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Issue_Type_Settings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Aggregate_Fields = {
  __typename?: 'project_issue_type_settings_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Project_Issue_Type_Settings_Max_Fields>;
  min?: Maybe<Project_Issue_Type_Settings_Min_Fields>;
};


/** aggregate fields of "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Project_Issue_Type_Settings_Max_Order_By>;
  min?: InputMaybe<Project_Issue_Type_Settings_Min_Order_By>;
};

/** input type for inserting array relation for remote table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Arr_Rel_Insert_Input = {
  data: Array<Project_Issue_Type_Settings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_Issue_Type_Settings_On_Conflict>;
};

/** Boolean expression to filter rows from the table "project_issue_type_settings". All fields are combined with a logical 'AND'. */
export type Project_Issue_Type_Settings_Bool_Exp = {
  _and?: InputMaybe<Array<Project_Issue_Type_Settings_Bool_Exp>>;
  _not?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
  _or?: InputMaybe<Array<Project_Issue_Type_Settings_Bool_Exp>>;
  autoPrEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  enabled?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  issueType?: InputMaybe<IssueType_Enum_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "project_issue_type_settings" */
export enum Project_Issue_Type_Settings_Constraint {
  /** unique or primary key constraint on columns "project_id", "issue_type" */
  ProjectIssueTypeSettingsIssueTypeProjectIdKey = 'project_issue_type_settings_issue_type_project_id_key',
  /** unique or primary key constraint on columns "id" */
  ProjectIssueTypeSettingsPkey = 'project_issue_type_settings_pkey'
}

/** input type for inserting data into table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Insert_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Project_Issue_Type_Settings_Max_Fields = {
  __typename?: 'project_issue_type_settings_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Project_Issue_Type_Settings_Min_Fields = {
  __typename?: 'project_issue_type_settings_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Mutation_Response = {
  __typename?: 'project_issue_type_settings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project_Issue_Type_Settings>;
};

/** on_conflict condition type for table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_On_Conflict = {
  constraint: Project_Issue_Type_Settings_Constraint;
  update_columns?: Array<Project_Issue_Type_Settings_Update_Column>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};

/** Ordering options when selecting data from "project_issue_type_settings". */
export type Project_Issue_Type_Settings_Order_By = {
  autoPrEnabled?: InputMaybe<Order_By>;
  enabled?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: project_issue_type_settings */
export type Project_Issue_Type_Settings_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "project_issue_type_settings" */
export enum Project_Issue_Type_Settings_Select_Column {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  ProjectId = 'projectId'
}

/** select "project_issue_type_settings_aggregate_bool_exp_bool_and_arguments_columns" columns of table "project_issue_type_settings" */
export enum Project_Issue_Type_Settings_Select_Column_Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled'
}

/** select "project_issue_type_settings_aggregate_bool_exp_bool_or_arguments_columns" columns of table "project_issue_type_settings" */
export enum Project_Issue_Type_Settings_Select_Column_Project_Issue_Type_Settings_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled'
}

/** input type for updating data in table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Set_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "project_issue_type_settings" */
export type Project_Issue_Type_Settings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_Issue_Type_Settings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_Issue_Type_Settings_Stream_Cursor_Value_Input = {
  autoPrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issueType?: InputMaybe<IssueType_Enum>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "project_issue_type_settings" */
export enum Project_Issue_Type_Settings_Update_Column {
  /** column name */
  AutoPrEnabled = 'autoPrEnabled',
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  ProjectId = 'projectId'
}

export type Project_Issue_Type_Settings_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_Issue_Type_Settings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_Issue_Type_Settings_Bool_Exp;
};

/** aggregate max on columns */
export type Project_Max_Fields = {
  __typename?: 'project_max_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** aggregate max on columns */
export type Project_Max_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** order by max() on columns of table "project" */
export type Project_Max_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Project_Min_Fields = {
  __typename?: 'project_min_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['uuid']['output']>;
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** aggregate min on columns */
export type Project_Min_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** order by min() on columns of table "project" */
export type Project_Min_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "project" */
export type Project_Mutation_Response = {
  __typename?: 'project_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project>;
};

/** input type for inserting object relation for remote table "project" */
export type Project_Obj_Rel_Insert_Input = {
  data: Project_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_On_Conflict>;
};

/** on_conflict condition type for table "project" */
export type Project_On_Conflict = {
  constraint: Project_Constraint;
  update_columns?: Array<Project_Update_Column>;
  where?: InputMaybe<Project_Bool_Exp>;
};

/** Ordering options when selecting data from "project". */
export type Project_Order_By = {
  aggregatedResolvedVulnerabilitiesView_aggregate?: InputMaybe<View_Project_Resolved_Vulnerabilities_Aggregate_Order_By>;
  aggregatedResolvedVulnerabilities_aggregate?: InputMaybe<Aggregated_Severities_Aggregate_Order_By>;
  aggregatedVulnerabilitySeveritiesView_aggregate?: InputMaybe<View_Project_Vulnerability_Severities_Aggregate_Order_By>;
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isDefault?: InputMaybe<Order_By>;
  isDeleted?: InputMaybe<Order_By>;
  lastAnalysedVulReports_aggregate?: InputMaybe<Vulnerability_Report_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  projectIssueTypeSettings_aggregate?: InputMaybe<Project_Issue_Type_Settings_Aggregate_Order_By>;
  projectRoles_aggregate?: InputMaybe<Project_To_Project_Role_Aggregate_Order_By>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
  totalResolvedVulnerabilities?: InputMaybe<Order_By>;
  totalResolvedVulnerabilitiesView?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Order_By>;
  totalUniqueUnresolvedVulnerabilitiesView?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  vulnerabilityReports_aggregate?: InputMaybe<Vulnerability_Report_Aggregate_Order_By>;
};

/** primary key columns input for table: project */
export type Project_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "project_role" */
export type Project_Role = {
  __typename?: 'project_role';
  canCreateAnalysis: Scalars['Boolean']['output'];
  canDeleteProject: Scalars['Boolean']['output'];
  canDoScmActions: Scalars['Boolean']['output'];
  canFixVulnerability: Scalars['Boolean']['output'];
  canInviteNewUser: Scalars['Boolean']['output'];
  canQueryScmData: Scalars['Boolean']['output'];
  canUpdateProject: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  /** An array relationship */
  projectToProjectRoles: Array<Project_To_Project_Role>;
  /** An aggregate relationship */
  projectToProjectRoles_aggregate: Project_To_Project_Role_Aggregate;
  type: Project_Role_Type_Enum;
};


/** columns and relationships of "project_role" */
export type Project_RoleProjectToProjectRolesArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


/** columns and relationships of "project_role" */
export type Project_RoleProjectToProjectRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};

/** aggregated selection of "project_role" */
export type Project_Role_Aggregate = {
  __typename?: 'project_role_aggregate';
  aggregate?: Maybe<Project_Role_Aggregate_Fields>;
  nodes: Array<Project_Role>;
};

/** aggregate fields of "project_role" */
export type Project_Role_Aggregate_Fields = {
  __typename?: 'project_role_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Project_Role_Max_Fields>;
  min?: Maybe<Project_Role_Min_Fields>;
};


/** aggregate fields of "project_role" */
export type Project_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "project_role". All fields are combined with a logical 'AND'. */
export type Project_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Project_Role_Bool_Exp>>;
  _not?: InputMaybe<Project_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Project_Role_Bool_Exp>>;
  canCreateAnalysis?: InputMaybe<Boolean_Comparison_Exp>;
  canDeleteProject?: InputMaybe<Boolean_Comparison_Exp>;
  canDoScmActions?: InputMaybe<Boolean_Comparison_Exp>;
  canFixVulnerability?: InputMaybe<Boolean_Comparison_Exp>;
  canInviteNewUser?: InputMaybe<Boolean_Comparison_Exp>;
  canQueryScmData?: InputMaybe<Boolean_Comparison_Exp>;
  canUpdateProject?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  projectToProjectRoles?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
  projectToProjectRoles_aggregate?: InputMaybe<Project_To_Project_Role_Aggregate_Bool_Exp>;
  type?: InputMaybe<Project_Role_Type_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "project_role" */
export enum Project_Role_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProjectRolePkey1 = 'project_role_pkey1'
}

/** input type for inserting data into table "project_role" */
export type Project_Role_Insert_Input = {
  canCreateAnalysis?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDoScmActions?: InputMaybe<Scalars['Boolean']['input']>;
  canFixVulnerability?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteNewUser?: InputMaybe<Scalars['Boolean']['input']>;
  canQueryScmData?: InputMaybe<Scalars['Boolean']['input']>;
  canUpdateProject?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  projectToProjectRoles?: InputMaybe<Project_To_Project_Role_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Project_Role_Type_Enum>;
};

/** aggregate max on columns */
export type Project_Role_Max_Fields = {
  __typename?: 'project_role_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Project_Role_Min_Fields = {
  __typename?: 'project_role_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "project_role" */
export type Project_Role_Mutation_Response = {
  __typename?: 'project_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project_Role>;
};

/** input type for inserting object relation for remote table "project_role" */
export type Project_Role_Obj_Rel_Insert_Input = {
  data: Project_Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_Role_On_Conflict>;
};

/** on_conflict condition type for table "project_role" */
export type Project_Role_On_Conflict = {
  constraint: Project_Role_Constraint;
  update_columns?: Array<Project_Role_Update_Column>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "project_role". */
export type Project_Role_Order_By = {
  canCreateAnalysis?: InputMaybe<Order_By>;
  canDeleteProject?: InputMaybe<Order_By>;
  canDoScmActions?: InputMaybe<Order_By>;
  canFixVulnerability?: InputMaybe<Order_By>;
  canInviteNewUser?: InputMaybe<Order_By>;
  canQueryScmData?: InputMaybe<Order_By>;
  canUpdateProject?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  projectToProjectRoles_aggregate?: InputMaybe<Project_To_Project_Role_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: project_role */
export type Project_Role_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "project_role" */
export enum Project_Role_Select_Column {
  /** column name */
  CanCreateAnalysis = 'canCreateAnalysis',
  /** column name */
  CanDeleteProject = 'canDeleteProject',
  /** column name */
  CanDoScmActions = 'canDoScmActions',
  /** column name */
  CanFixVulnerability = 'canFixVulnerability',
  /** column name */
  CanInviteNewUser = 'canInviteNewUser',
  /** column name */
  CanQueryScmData = 'canQueryScmData',
  /** column name */
  CanUpdateProject = 'canUpdateProject',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "project_role" */
export type Project_Role_Set_Input = {
  canCreateAnalysis?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDoScmActions?: InputMaybe<Scalars['Boolean']['input']>;
  canFixVulnerability?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteNewUser?: InputMaybe<Scalars['Boolean']['input']>;
  canQueryScmData?: InputMaybe<Scalars['Boolean']['input']>;
  canUpdateProject?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Project_Role_Type_Enum>;
};

/** Streaming cursor of the table "project_role" */
export type Project_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_Role_Stream_Cursor_Value_Input = {
  canCreateAnalysis?: InputMaybe<Scalars['Boolean']['input']>;
  canDeleteProject?: InputMaybe<Scalars['Boolean']['input']>;
  canDoScmActions?: InputMaybe<Scalars['Boolean']['input']>;
  canFixVulnerability?: InputMaybe<Scalars['Boolean']['input']>;
  canInviteNewUser?: InputMaybe<Scalars['Boolean']['input']>;
  canQueryScmData?: InputMaybe<Scalars['Boolean']['input']>;
  canUpdateProject?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Project_Role_Type_Enum>;
};

/** columns and relationships of "project_role_type" */
export type Project_Role_Type = {
  __typename?: 'project_role_type';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "project_role_type" */
export type Project_Role_Type_Aggregate = {
  __typename?: 'project_role_type_aggregate';
  aggregate?: Maybe<Project_Role_Type_Aggregate_Fields>;
  nodes: Array<Project_Role_Type>;
};

/** aggregate fields of "project_role_type" */
export type Project_Role_Type_Aggregate_Fields = {
  __typename?: 'project_role_type_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Project_Role_Type_Max_Fields>;
  min?: Maybe<Project_Role_Type_Min_Fields>;
};


/** aggregate fields of "project_role_type" */
export type Project_Role_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_Role_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "project_role_type". All fields are combined with a logical 'AND'. */
export type Project_Role_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Project_Role_Type_Bool_Exp>>;
  _not?: InputMaybe<Project_Role_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Project_Role_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "project_role_type" */
export enum Project_Role_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  ProjectRolePkey = 'project_role_pkey'
}

export enum Project_Role_Type_Enum {
  /** admin role */
  Admin = 'admin',
  /** Read Role */
  Read = 'read',
  /** Writer Role */
  Writer = 'writer'
}

/** Boolean expression to compare columns of type "project_role_type_enum". All fields are combined with logical 'AND'. */
export type Project_Role_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Project_Role_Type_Enum>;
  _in?: InputMaybe<Array<Project_Role_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Project_Role_Type_Enum>;
  _nin?: InputMaybe<Array<Project_Role_Type_Enum>>;
};

/** input type for inserting data into table "project_role_type" */
export type Project_Role_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Project_Role_Type_Max_Fields = {
  __typename?: 'project_role_type_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Project_Role_Type_Min_Fields = {
  __typename?: 'project_role_type_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "project_role_type" */
export type Project_Role_Type_Mutation_Response = {
  __typename?: 'project_role_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project_Role_Type>;
};

/** on_conflict condition type for table "project_role_type" */
export type Project_Role_Type_On_Conflict = {
  constraint: Project_Role_Type_Constraint;
  update_columns?: Array<Project_Role_Type_Update_Column>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "project_role_type". */
export type Project_Role_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: project_role_type */
export type Project_Role_Type_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "project_role_type" */
export enum Project_Role_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "project_role_type" */
export type Project_Role_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "project_role_type" */
export type Project_Role_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_Role_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_Role_Type_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "project_role_type" */
export enum Project_Role_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Project_Role_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_Role_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_Role_Type_Bool_Exp;
};

/** update columns of table "project_role" */
export enum Project_Role_Update_Column {
  /** column name */
  CanCreateAnalysis = 'canCreateAnalysis',
  /** column name */
  CanDeleteProject = 'canDeleteProject',
  /** column name */
  CanDoScmActions = 'canDoScmActions',
  /** column name */
  CanFixVulnerability = 'canFixVulnerability',
  /** column name */
  CanInviteNewUser = 'canInviteNewUser',
  /** column name */
  CanQueryScmData = 'canQueryScmData',
  /** column name */
  CanUpdateProject = 'canUpdateProject',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type'
}

export type Project_Role_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_Role_Bool_Exp;
};

/** select columns of table "project" */
export enum Project_Select_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'isDefault',
  /** column name */
  IsDeleted = 'isDeleted',
  /** column name */
  Name = 'name',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** select "project_aggregate_bool_exp_bool_and_arguments_columns" columns of table "project" */
export enum Project_Select_Column_Project_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = 'isDefault',
  /** column name */
  IsDeleted = 'isDeleted'
}

/** select "project_aggregate_bool_exp_bool_or_arguments_columns" columns of table "project" */
export enum Project_Select_Column_Project_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = 'isDefault',
  /** column name */
  IsDeleted = 'isDeleted'
}

/** input type for updating data in table "project" */
export type Project_Set_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Project_Stddev_Fields = {
  __typename?: 'project_stddev_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate stddev on columns */
export type Project_Stddev_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** aggregate stddev_pop on columns */
export type Project_Stddev_Pop_Fields = {
  __typename?: 'project_stddev_pop_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate stddev_pop on columns */
export type Project_Stddev_Pop_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** aggregate stddev_samp on columns */
export type Project_Stddev_Samp_Fields = {
  __typename?: 'project_stddev_samp_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate stddev_samp on columns */
export type Project_Stddev_Samp_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** Streaming cursor of the table "project" */
export type Project_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_Stream_Cursor_Value_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Project_Sum_Fields = {
  __typename?: 'project_sum_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate sum on columns */
export type Project_Sum_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** columns and relationships of "project_to_project_role" */
export type Project_To_Project_Role = {
  __typename?: 'project_to_project_role';
  id: Scalars['uuid']['output'];
  /** An object relationship */
  project: Project;
  projectId: Scalars['uuid']['output'];
  /** An object relationship */
  projectRole: Project_Role;
  projectRoleId: Scalars['uuid']['output'];
};

/** aggregated selection of "project_to_project_role" */
export type Project_To_Project_Role_Aggregate = {
  __typename?: 'project_to_project_role_aggregate';
  aggregate?: Maybe<Project_To_Project_Role_Aggregate_Fields>;
  nodes: Array<Project_To_Project_Role>;
};

export type Project_To_Project_Role_Aggregate_Bool_Exp = {
  count?: InputMaybe<Project_To_Project_Role_Aggregate_Bool_Exp_Count>;
};

export type Project_To_Project_Role_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "project_to_project_role" */
export type Project_To_Project_Role_Aggregate_Fields = {
  __typename?: 'project_to_project_role_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Project_To_Project_Role_Max_Fields>;
  min?: Maybe<Project_To_Project_Role_Min_Fields>;
};


/** aggregate fields of "project_to_project_role" */
export type Project_To_Project_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "project_to_project_role" */
export type Project_To_Project_Role_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Project_To_Project_Role_Max_Order_By>;
  min?: InputMaybe<Project_To_Project_Role_Min_Order_By>;
};

/** input type for inserting array relation for remote table "project_to_project_role" */
export type Project_To_Project_Role_Arr_Rel_Insert_Input = {
  data: Array<Project_To_Project_Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_To_Project_Role_On_Conflict>;
};

/** Boolean expression to filter rows from the table "project_to_project_role". All fields are combined with a logical 'AND'. */
export type Project_To_Project_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Project_To_Project_Role_Bool_Exp>>;
  _not?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Project_To_Project_Role_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectId?: InputMaybe<Uuid_Comparison_Exp>;
  projectRole?: InputMaybe<Project_Role_Bool_Exp>;
  projectRoleId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "project_to_project_role" */
export enum Project_To_Project_Role_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProjectToProjectRolePkey = 'project_to_project_role_pkey',
  /** unique or primary key constraint on columns "project_id", "project_role_id" */
  ProjectToProjectRoleProjectIdProjectRoleIdKey = 'project_to_project_role_project_id_project_role_id_key'
}

/** input type for inserting data into table "project_to_project_role" */
export type Project_To_Project_Role_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRole?: InputMaybe<Project_Role_Obj_Rel_Insert_Input>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Project_To_Project_Role_Max_Fields = {
  __typename?: 'project_to_project_role_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  projectRoleId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "project_to_project_role" */
export type Project_To_Project_Role_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Project_To_Project_Role_Min_Fields = {
  __typename?: 'project_to_project_role_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  projectRoleId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "project_to_project_role" */
export type Project_To_Project_Role_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "project_to_project_role" */
export type Project_To_Project_Role_Mutation_Response = {
  __typename?: 'project_to_project_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project_To_Project_Role>;
};

/** input type for inserting object relation for remote table "project_to_project_role" */
export type Project_To_Project_Role_Obj_Rel_Insert_Input = {
  data: Project_To_Project_Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_To_Project_Role_On_Conflict>;
};

/** on_conflict condition type for table "project_to_project_role" */
export type Project_To_Project_Role_On_Conflict = {
  constraint: Project_To_Project_Role_Constraint;
  update_columns?: Array<Project_To_Project_Role_Update_Column>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "project_to_project_role". */
export type Project_To_Project_Role_Order_By = {
  id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRole?: InputMaybe<Project_Role_Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: project_to_project_role */
export type Project_To_Project_Role_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "project_to_project_role" */
export enum Project_To_Project_Role_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ProjectRoleId = 'projectRoleId'
}

/** input type for updating data in table "project_to_project_role" */
export type Project_To_Project_Role_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "project_to_project_role" */
export type Project_To_Project_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_To_Project_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_To_Project_Role_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "project_to_project_role" */
export enum Project_To_Project_Role_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ProjectRoleId = 'projectRoleId'
}

export type Project_To_Project_Role_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_To_Project_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_To_Project_Role_Bool_Exp;
};

/** columns and relationships of "project_to_user" */
export type Project_To_User = {
  __typename?: 'project_to_user';
  createdOn: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  project: Project;
  projectId: Scalars['uuid']['output'];
  projectRoleId: Scalars['uuid']['output'];
  /** An object relationship */
  projectToRole: Project_To_Project_Role;
  /** An object relationship */
  user: User;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "project_to_user" */
export type Project_To_User_Aggregate = {
  __typename?: 'project_to_user_aggregate';
  aggregate?: Maybe<Project_To_User_Aggregate_Fields>;
  nodes: Array<Project_To_User>;
};

export type Project_To_User_Aggregate_Bool_Exp = {
  count?: InputMaybe<Project_To_User_Aggregate_Bool_Exp_Count>;
};

export type Project_To_User_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Project_To_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Project_To_User_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "project_to_user" */
export type Project_To_User_Aggregate_Fields = {
  __typename?: 'project_to_user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Project_To_User_Max_Fields>;
  min?: Maybe<Project_To_User_Min_Fields>;
};


/** aggregate fields of "project_to_user" */
export type Project_To_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Project_To_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "project_to_user" */
export type Project_To_User_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Project_To_User_Max_Order_By>;
  min?: InputMaybe<Project_To_User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "project_to_user" */
export type Project_To_User_Arr_Rel_Insert_Input = {
  data: Array<Project_To_User_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Project_To_User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "project_to_user". All fields are combined with a logical 'AND'. */
export type Project_To_User_Bool_Exp = {
  _and?: InputMaybe<Array<Project_To_User_Bool_Exp>>;
  _not?: InputMaybe<Project_To_User_Bool_Exp>;
  _or?: InputMaybe<Array<Project_To_User_Bool_Exp>>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectId?: InputMaybe<Uuid_Comparison_Exp>;
  projectRoleId?: InputMaybe<Uuid_Comparison_Exp>;
  projectToRole?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "project_to_user" */
export enum Project_To_User_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProjectToUserIdKey = 'project_to_user_id_key',
  /** unique or primary key constraint on columns "user_id", "project_id" */
  ProjectUserPkey = 'project_user_pkey',
  /** unique or primary key constraint on columns "user_id", "project_id" */
  ProjectUserUserIdProjectIdKey = 'project_user_user_id_project_id_key'
}

/** input type for inserting data into table "project_to_user" */
export type Project_To_User_Insert_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
  projectToRole?: InputMaybe<Project_To_Project_Role_Obj_Rel_Insert_Input>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Project_To_User_Max_Fields = {
  __typename?: 'project_to_user_max_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  projectRoleId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "project_to_user" */
export type Project_To_User_Max_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Project_To_User_Min_Fields = {
  __typename?: 'project_to_user_min_fields';
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  projectRoleId?: Maybe<Scalars['uuid']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "project_to_user" */
export type Project_To_User_Min_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "project_to_user" */
export type Project_To_User_Mutation_Response = {
  __typename?: 'project_to_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Project_To_User>;
};

/** on_conflict condition type for table "project_to_user" */
export type Project_To_User_On_Conflict = {
  constraint: Project_To_User_Constraint;
  update_columns?: Array<Project_To_User_Update_Column>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** Ordering options when selecting data from "project_to_user". */
export type Project_To_User_Order_By = {
  createdOn?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectId?: InputMaybe<Order_By>;
  projectRoleId?: InputMaybe<Order_By>;
  projectToRole?: InputMaybe<Project_To_Project_Role_Order_By>;
  user?: InputMaybe<User_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: project_to_user */
export type Project_To_User_Pk_Columns_Input = {
  projectId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
};

/** select columns of table "project_to_user" */
export enum Project_To_User_Select_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ProjectRoleId = 'projectRoleId',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "project_to_user" */
export type Project_To_User_Set_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "project_to_user" */
export type Project_To_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Project_To_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Project_To_User_Stream_Cursor_Value_Input = {
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  projectRoleId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "project_to_user" */
export enum Project_To_User_Update_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ProjectRoleId = 'projectRoleId',
  /** column name */
  UserId = 'userId'
}

export type Project_To_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_To_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_To_User_Bool_Exp;
};

/** update columns of table "project" */
export enum Project_Update_Column {
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'isDefault',
  /** column name */
  IsDeleted = 'isDeleted',
  /** column name */
  Name = 'name',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Project_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Project_Set_Input>;
  /** filter the rows which have to be updated */
  where: Project_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Project_Var_Pop_Fields = {
  __typename?: 'project_var_pop_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate var_pop on columns */
export type Project_Var_Pop_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** aggregate var_samp on columns */
export type Project_Var_Samp_Fields = {
  __typename?: 'project_var_samp_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate var_samp on columns */
export type Project_Var_Samp_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

/** aggregate variance on columns */
export type Project_Variance_Fields = {
  __typename?: 'project_variance_fields';
  /** A computed field, executes function "total_resolved_vulnerabilities" */
  totalResolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
  /** A computed field, executes function "total_project_unique_unresolved_vulnerabilities" */
  totalUniqueUnresolvedVulnerabilities?: Maybe<Scalars['Int']['output']>;
};


/** aggregate variance on columns */
export type Project_Variance_FieldsTotalUniqueUnresolvedVulnerabilitiesArgs = {
  args: TotalUniqueUnresolvedVulnerabilities_Project_Args;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "aggregated_fix_state" */
  aggregated_fix_state: Array<Aggregated_Fix_State>;
  /** fetch aggregated fields from the table: "aggregated_fix_state" */
  aggregated_fix_state_aggregate: Aggregated_Fix_State_Aggregate;
  /** fetch data from the table: "aggregated_severities" */
  aggregated_severities: Array<Aggregated_Severities>;
  /** fetch aggregated fields from the table: "aggregated_severities" */
  aggregated_severities_aggregate: Aggregated_Severities_Aggregate;
  /** fetch data from the table: "api_token" */
  api_token: Array<Api_Token>;
  /** fetch aggregated fields from the table: "api_token" */
  api_token_aggregate: Api_Token_Aggregate;
  /** fetch data from the table: "api_token" using primary key columns */
  api_token_by_pk?: Maybe<Api_Token>;
  /** fetch data from the table: "broker_host" */
  broker_host: Array<Broker_Host>;
  /** fetch aggregated fields from the table: "broker_host" */
  broker_host_aggregate: Broker_Host_Aggregate;
  /** fetch data from the table: "broker_host" using primary key columns */
  broker_host_by_pk?: Maybe<Broker_Host>;
  /** fetch data from the table: "broker_token" */
  broker_token: Array<Broker_Token>;
  /** fetch aggregated fields from the table: "broker_token" */
  broker_token_aggregate: Broker_Token_Aggregate;
  /** fetch data from the table: "broker_token" using primary key columns */
  broker_token_by_pk?: Maybe<Broker_Token>;
  checkScmConnectionStatus?: Maybe<ValidationSuccess>;
  checkScmConnectionStatusAdmin?: Maybe<ValidationSuccess>;
  /** fetch data from the table: "cli_login" */
  cli_login: Array<Cli_Login>;
  /** fetch aggregated fields from the table: "cli_login" */
  cli_login_aggregate: Cli_Login_Aggregate;
  /** fetch data from the table: "cli_login" using primary key columns */
  cli_login_by_pk?: Maybe<Cli_Login>;
  /** fetch data from the table: "effort_to_apply_fix" */
  effort_to_apply_fix: Array<Effort_To_Apply_Fix>;
  /** fetch aggregated fields from the table: "effort_to_apply_fix" */
  effort_to_apply_fix_aggregate: Effort_To_Apply_Fix_Aggregate;
  /** fetch data from the table: "effort_to_apply_fix" using primary key columns */
  effort_to_apply_fix_by_pk?: Maybe<Effort_To_Apply_Fix>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch aggregated fields from the table: "file" */
  file_aggregate: File_Aggregate;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table: "fix" */
  fix: Array<Fix>;
  /** fetch data from the table: "fix_answer" */
  fixAnswer: Array<FixAnswer>;
  /** fetch aggregated fields from the table: "fix_answer" */
  fixAnswer_aggregate: FixAnswer_Aggregate;
  /** fetch data from the table: "fix_answer" using primary key columns */
  fixAnswer_by_pk?: Maybe<FixAnswer>;
  /** fetch data from the table: "fix_file" */
  fixFile: Array<FixFile>;
  /** fetch aggregated fields from the table: "fix_file" */
  fixFile_aggregate: FixFile_Aggregate;
  /** fetch data from the table: "fix_file" using primary key columns */
  fixFile_by_pk?: Maybe<FixFile>;
  /** fetch data from the table: "fix_report" */
  fixReport: Array<FixReport>;
  /** fetch aggregated fields from the table: "fix_report" */
  fixReport_aggregate: FixReport_Aggregate;
  /** fetch data from the table: "fix_report" using primary key columns */
  fixReport_by_pk?: Maybe<FixReport>;
  /** fetch aggregated fields from the table: "fix" */
  fix_aggregate: Fix_Aggregate;
  /** fetch data from the table: "fix" using primary key columns */
  fix_by_pk?: Maybe<Fix>;
  /** fetch data from the table: "fix_rating" */
  fix_rating: Array<Fix_Rating>;
  /** fetch aggregated fields from the table: "fix_rating" */
  fix_rating_aggregate: Fix_Rating_Aggregate;
  /** fetch data from the table: "fix_rating" using primary key columns */
  fix_rating_by_pk?: Maybe<Fix_Rating>;
  /** fetch data from the table: "fix_rating_tag" */
  fix_rating_tag: Array<Fix_Rating_Tag>;
  /** fetch aggregated fields from the table: "fix_rating_tag" */
  fix_rating_tag_aggregate: Fix_Rating_Tag_Aggregate;
  /** fetch data from the table: "fix_rating_tag" using primary key columns */
  fix_rating_tag_by_pk?: Maybe<Fix_Rating_Tag>;
  /** fetch data from the table: "fix_report_state" */
  fix_report_state: Array<Fix_Report_State>;
  /** fetch aggregated fields from the table: "fix_report_state" */
  fix_report_state_aggregate: Fix_Report_State_Aggregate;
  /** fetch data from the table: "fix_report_state" using primary key columns */
  fix_report_state_by_pk?: Maybe<Fix_Report_State>;
  /** fetch data from the table: "fix_state" */
  fix_state: Array<Fix_State>;
  /** fetch aggregated fields from the table: "fix_state" */
  fix_state_aggregate: Fix_State_Aggregate;
  /** fetch data from the table: "fix_state" using primary key columns */
  fix_state_by_pk?: Maybe<Fix_State>;
  /** fetch data from the table: "fix_to_scm_submit_fix_request" */
  fix_to_scm_submit_fix_request: Array<Fix_To_Scm_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "fix_to_scm_submit_fix_request" */
  fix_to_scm_submit_fix_request_aggregate: Fix_To_Scm_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "fix_to_scm_submit_fix_request" using primary key columns */
  fix_to_scm_submit_fix_request_by_pk?: Maybe<Fix_To_Scm_Submit_Fix_Request>;
  /** fetch data from the table: "fix_to_submit_fix_request" */
  fix_to_submit_fix_request: Array<Fix_To_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "fix_to_submit_fix_request" */
  fix_to_submit_fix_request_aggregate: Fix_To_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "fix_to_submit_fix_request" using primary key columns */
  fix_to_submit_fix_request_by_pk?: Maybe<Fix_To_Submit_Fix_Request>;
  getCheckmarxIntegrationData?: Maybe<GetCheckmarxIntegrationDataResponse>;
  getCheckmarxProjects?: Maybe<GetCheckmarxProjectsResponse>;
  getFile?: Maybe<FilePayload>;
  getFix: RegisterUserResponse;
  getGitBlame: GetGitBlameResponse;
  getScmRepos?: Maybe<GetScmReposResponse>;
  getScmUserInformation?: Maybe<ScmValidateTokenResponse>;
  getSplitFix: GetSplitFixResponseUnion;
  gitReference?: Maybe<GitReferenceResponse>;
  /** fetch data from the table: "integration" */
  integration: Array<Integration>;
  /** fetch aggregated fields from the table: "integration" */
  integration_aggregate: Integration_Aggregate;
  /** fetch data from the table: "integration" using primary key columns */
  integration_by_pk?: Maybe<Integration>;
  /** fetch data from the table: "integration_type" */
  integration_type: Array<Integration_Type>;
  /** fetch aggregated fields from the table: "integration_type" */
  integration_type_aggregate: Integration_Type_Aggregate;
  /** fetch data from the table: "integration_type" using primary key columns */
  integration_type_by_pk?: Maybe<Integration_Type>;
  /** fetch data from the table: "invitation" */
  invitation: Array<Invitation>;
  /** fetch aggregated fields from the table: "invitation" */
  invitation_aggregate: Invitation_Aggregate;
  /** fetch data from the table: "invitation" using primary key columns */
  invitation_by_pk?: Maybe<Invitation>;
  /** fetch data from the table: "invitation_status_type" */
  invitation_status_type: Array<Invitation_Status_Type>;
  /** fetch aggregated fields from the table: "invitation_status_type" */
  invitation_status_type_aggregate: Invitation_Status_Type_Aggregate;
  /** fetch data from the table: "invitation_status_type" using primary key columns */
  invitation_status_type_by_pk?: Maybe<Invitation_Status_Type>;
  /** fetch data from the table: "invitation_to_projects" */
  invitation_to_projects: Array<Invitation_To_Projects>;
  /** fetch aggregated fields from the table: "invitation_to_projects" */
  invitation_to_projects_aggregate: Invitation_To_Projects_Aggregate;
  /** fetch data from the table: "invitation_to_projects" using primary key columns */
  invitation_to_projects_by_pk?: Maybe<Invitation_To_Projects>;
  /** fetch data from the table: "issue_language" */
  issueLanguage: Array<IssueLanguage>;
  /** fetch aggregated fields from the table: "issue_language" */
  issueLanguage_aggregate: IssueLanguage_Aggregate;
  /** fetch data from the table: "issue_language" using primary key columns */
  issueLanguage_by_pk?: Maybe<IssueLanguage>;
  /** fetch data from the table: "issue_type" */
  issueType: Array<IssueType>;
  /** fetch aggregated fields from the table: "issue_type" */
  issueType_aggregate: IssueType_Aggregate;
  /** fetch data from the table: "issue_type" using primary key columns */
  issueType_by_pk?: Maybe<IssueType>;
  listTokens?: Maybe<Array<Maybe<ListTokenResponse>>>;
  me?: Maybe<MeResponse>;
  meAdmin?: Maybe<MeResponse>;
  meContext?: Maybe<MeContextResponse>;
  /** fetch data from the table: "on_prem_scm_oauth_config" */
  on_prem_scm_oauth_config: Array<On_Prem_Scm_Oauth_Config>;
  /** fetch aggregated fields from the table: "on_prem_scm_oauth_config" */
  on_prem_scm_oauth_config_aggregate: On_Prem_Scm_Oauth_Config_Aggregate;
  /** fetch data from the table: "on_prem_scm_oauth_config" using primary key columns */
  on_prem_scm_oauth_config_by_pk?: Maybe<On_Prem_Scm_Oauth_Config>;
  /** fetch data from the table: "organization" */
  organization: Array<Organization>;
  /** fetch aggregated fields from the table: "organization" */
  organization_aggregate: Organization_Aggregate;
  /** fetch data from the table: "organization" using primary key columns */
  organization_by_pk?: Maybe<Organization>;
  /** fetch data from the table: "organization_files_matching_settings" */
  organization_files_matching_settings: Array<Organization_Files_Matching_Settings>;
  /** fetch aggregated fields from the table: "organization_files_matching_settings" */
  organization_files_matching_settings_aggregate: Organization_Files_Matching_Settings_Aggregate;
  /** fetch data from the table: "organization_files_matching_settings" using primary key columns */
  organization_files_matching_settings_by_pk?: Maybe<Organization_Files_Matching_Settings>;
  /** fetch data from the table: "organization_issue_type_settings" */
  organization_issue_type_settings: Array<Organization_Issue_Type_Settings>;
  /** fetch aggregated fields from the table: "organization_issue_type_settings" */
  organization_issue_type_settings_aggregate: Organization_Issue_Type_Settings_Aggregate;
  /** fetch data from the table: "organization_issue_type_settings" using primary key columns */
  organization_issue_type_settings_by_pk?: Maybe<Organization_Issue_Type_Settings>;
  /** fetch data from the table: "organization_role" */
  organization_role: Array<Organization_Role>;
  /** fetch aggregated fields from the table: "organization_role" */
  organization_role_aggregate: Organization_Role_Aggregate;
  /** fetch data from the table: "organization_role" using primary key columns */
  organization_role_by_pk?: Maybe<Organization_Role>;
  /** fetch data from the table: "organization_role_type" */
  organization_role_type: Array<Organization_Role_Type>;
  /** fetch aggregated fields from the table: "organization_role_type" */
  organization_role_type_aggregate: Organization_Role_Type_Aggregate;
  /** fetch data from the table: "organization_role_type" using primary key columns */
  organization_role_type_by_pk?: Maybe<Organization_Role_Type>;
  /** fetch data from the table: "organization_to_organization_role" */
  organization_to_organization_role: Array<Organization_To_Organization_Role>;
  /** fetch aggregated fields from the table: "organization_to_organization_role" */
  organization_to_organization_role_aggregate: Organization_To_Organization_Role_Aggregate;
  /** fetch data from the table: "organization_to_organization_role" using primary key columns */
  organization_to_organization_role_by_pk?: Maybe<Organization_To_Organization_Role>;
  /** fetch data from the table: "organization_to_user" */
  organization_to_user: Array<Organization_To_User>;
  /** fetch aggregated fields from the table: "organization_to_user" */
  organization_to_user_aggregate: Organization_To_User_Aggregate;
  /** fetch data from the table: "organization_to_user" using primary key columns */
  organization_to_user_by_pk?: Maybe<Organization_To_User>;
  /** fetch data from the table: "project" */
  project: Array<Project>;
  /** fetch aggregated fields from the table: "project" */
  project_aggregate: Project_Aggregate;
  /** fetch data from the table: "project" using primary key columns */
  project_by_pk?: Maybe<Project>;
  /** fetch data from the table: "project_issue_type_settings" */
  project_issue_type_settings: Array<Project_Issue_Type_Settings>;
  /** fetch aggregated fields from the table: "project_issue_type_settings" */
  project_issue_type_settings_aggregate: Project_Issue_Type_Settings_Aggregate;
  /** fetch data from the table: "project_issue_type_settings" using primary key columns */
  project_issue_type_settings_by_pk?: Maybe<Project_Issue_Type_Settings>;
  /** fetch data from the table: "project_role" */
  project_role: Array<Project_Role>;
  /** fetch aggregated fields from the table: "project_role" */
  project_role_aggregate: Project_Role_Aggregate;
  /** fetch data from the table: "project_role" using primary key columns */
  project_role_by_pk?: Maybe<Project_Role>;
  /** fetch data from the table: "project_role_type" */
  project_role_type: Array<Project_Role_Type>;
  /** fetch aggregated fields from the table: "project_role_type" */
  project_role_type_aggregate: Project_Role_Type_Aggregate;
  /** fetch data from the table: "project_role_type" using primary key columns */
  project_role_type_by_pk?: Maybe<Project_Role_Type>;
  /** fetch data from the table: "project_to_project_role" */
  project_to_project_role: Array<Project_To_Project_Role>;
  /** fetch aggregated fields from the table: "project_to_project_role" */
  project_to_project_role_aggregate: Project_To_Project_Role_Aggregate;
  /** fetch data from the table: "project_to_project_role" using primary key columns */
  project_to_project_role_by_pk?: Maybe<Project_To_Project_Role>;
  /** fetch data from the table: "project_to_user" */
  project_to_user: Array<Project_To_User>;
  /** fetch aggregated fields from the table: "project_to_user" */
  project_to_user_aggregate: Project_To_User_Aggregate;
  /** fetch data from the table: "project_to_user" using primary key columns */
  project_to_user_by_pk?: Maybe<Project_To_User>;
  /** fetch data from the table: "repo" */
  repo: Array<Repo>;
  /** fetch aggregated fields from the table: "repo" */
  repo_aggregate: Repo_Aggregate;
  /** fetch data from the table: "repo" using primary key columns */
  repo_by_pk?: Maybe<Repo>;
  /** fetch data from the table: "scan_source" */
  scan_source: Array<Scan_Source>;
  /** fetch aggregated fields from the table: "scan_source" */
  scan_source_aggregate: Scan_Source_Aggregate;
  /** fetch data from the table: "scan_source" using primary key columns */
  scan_source_by_pk?: Maybe<Scan_Source>;
  scmGetSubmitRequestStatus?: Maybe<ScmGetSubmitRequestStatusResponse>;
  scmHasRepoPermissions?: Maybe<ScmHasRepoPermissionsResponse>;
  scmIsBranchExists?: Maybe<ScmIsBranchExistsResponse>;
  scmIsBranchValidName?: Maybe<ScmIsBranchValidNameResponse>;
  scmListBranches?: Maybe<ScmListBranchesResponse>;
  /** fetch data from the table: "scm_config" */
  scm_config: Array<Scm_Config>;
  /** fetch aggregated fields from the table: "scm_config" */
  scm_config_aggregate: Scm_Config_Aggregate;
  /** fetch data from the table: "scm_config" using primary key columns */
  scm_config_by_pk?: Maybe<Scm_Config>;
  /** fetch data from the table: "scm_submit_fix_request" */
  scm_submit_fix_request: Array<Scm_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "scm_submit_fix_request" */
  scm_submit_fix_request_aggregate: Scm_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "scm_submit_fix_request" using primary key columns */
  scm_submit_fix_request_by_pk?: Maybe<Scm_Submit_Fix_Request>;
  /** fetch data from the table: "submit_fix_request" */
  submit_fix_request: Array<Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "submit_fix_request" */
  submit_fix_request_aggregate: Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "submit_fix_request" using primary key columns */
  submit_fix_request_by_pk?: Maybe<Submit_Fix_Request>;
  /** fetch data from the table: "submit_fix_request_scm_type" */
  submit_fix_request_scm_type: Array<Submit_Fix_Request_Scm_Type>;
  /** fetch aggregated fields from the table: "submit_fix_request_scm_type" */
  submit_fix_request_scm_type_aggregate: Submit_Fix_Request_Scm_Type_Aggregate;
  /** fetch data from the table: "submit_fix_request_scm_type" using primary key columns */
  submit_fix_request_scm_type_by_pk?: Maybe<Submit_Fix_Request_Scm_Type>;
  /** fetch data from the table: "submit_fix_request_state" */
  submit_fix_request_state: Array<Submit_Fix_Request_State>;
  /** fetch aggregated fields from the table: "submit_fix_request_state" */
  submit_fix_request_state_aggregate: Submit_Fix_Request_State_Aggregate;
  /** fetch data from the table: "submit_fix_request_state" using primary key columns */
  submit_fix_request_state_by_pk?: Maybe<Submit_Fix_Request_State>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  validateCheckmarxConnection?: Maybe<ValidateCheckmarxConnectionResponse>;
  validateExistingCheckmarxConnection?: Maybe<ValidateCheckmarxConnectionResponse>;
  validateRepoUrl?: Maybe<RepoValidationResponse>;
  validateScmToken: ValidateScmTokenResponse;
  /** fetch data from the table: "view_project_resolved_vulnerabilities" */
  view_project_resolved_vulnerabilities: Array<View_Project_Resolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_project_resolved_vulnerabilities" */
  view_project_resolved_vulnerabilities_aggregate: View_Project_Resolved_Vulnerabilities_Aggregate;
  /** fetch data from the table: "view_project_total_resolved_vulnerabilities" */
  view_project_total_resolved_vulnerabilities: Array<View_Project_Total_Resolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_project_total_resolved_vulnerabilities" */
  view_project_total_resolved_vulnerabilities_aggregate: View_Project_Total_Resolved_Vulnerabilities_Aggregate;
  /** fetch data from the table: "view_project_vulnerability_severities" */
  view_project_vulnerability_severities: Array<View_Project_Vulnerability_Severities>;
  /** fetch aggregated fields from the table: "view_project_vulnerability_severities" */
  view_project_vulnerability_severities_aggregate: View_Project_Vulnerability_Severities_Aggregate;
  /** fetch data from the table: "view_total_unique_unresolved_vulnerabilities" */
  view_total_unique_unresolved_vulnerabilities: Array<View_Total_Unique_Unresolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_total_unique_unresolved_vulnerabilities" */
  view_total_unique_unresolved_vulnerabilities_aggregate: View_Total_Unique_Unresolved_Vulnerabilities_Aggregate;
  /** fetch data from the table: "vulnerability_report" */
  vulnerability_report: Array<Vulnerability_Report>;
  /** fetch aggregated fields from the table: "vulnerability_report" */
  vulnerability_report_aggregate: Vulnerability_Report_Aggregate;
  /** fetch data from the table: "vulnerability_report" using primary key columns */
  vulnerability_report_by_pk?: Maybe<Vulnerability_Report>;
  /** fetch data from the table: "vulnerability_report_issue" */
  vulnerability_report_issue: Array<Vulnerability_Report_Issue>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue" */
  vulnerability_report_issue_aggregate: Vulnerability_Report_Issue_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue" using primary key columns */
  vulnerability_report_issue_by_pk?: Maybe<Vulnerability_Report_Issue>;
  /** fetch data from the table: "vulnerability_report_issue_code_node" */
  vulnerability_report_issue_code_node: Array<Vulnerability_Report_Issue_Code_Node>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_code_node" */
  vulnerability_report_issue_code_node_aggregate: Vulnerability_Report_Issue_Code_Node_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_code_node" using primary key columns */
  vulnerability_report_issue_code_node_by_pk?: Maybe<Vulnerability_Report_Issue_Code_Node>;
  /** fetch data from the table: "vulnerability_report_issue_state" */
  vulnerability_report_issue_state: Array<Vulnerability_Report_Issue_State>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_state" */
  vulnerability_report_issue_state_aggregate: Vulnerability_Report_Issue_State_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_state" using primary key columns */
  vulnerability_report_issue_state_by_pk?: Maybe<Vulnerability_Report_Issue_State>;
  /** fetch data from the table: "vulnerability_report_issue_tag" */
  vulnerability_report_issue_tag: Array<Vulnerability_Report_Issue_Tag>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_tag" */
  vulnerability_report_issue_tag_aggregate: Vulnerability_Report_Issue_Tag_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_tag" using primary key columns */
  vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  vulnerability_report_issue_to_vulnerability_report_issue_tag: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  vulnerability_report_issue_to_vulnerability_report_issue_tag_aggregate: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" using primary key columns */
  vulnerability_report_issue_to_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table: "vulnerability_report_path" */
  vulnerability_report_path: Array<Vulnerability_Report_Path>;
  /** fetch aggregated fields from the table: "vulnerability_report_path" */
  vulnerability_report_path_aggregate: Vulnerability_Report_Path_Aggregate;
  /** fetch data from the table: "vulnerability_report_path" using primary key columns */
  vulnerability_report_path_by_pk?: Maybe<Vulnerability_Report_Path>;
  /** fetch data from the table: "vulnerability_report_vendor" */
  vulnerability_report_vendor: Array<Vulnerability_Report_Vendor>;
  /** fetch aggregated fields from the table: "vulnerability_report_vendor" */
  vulnerability_report_vendor_aggregate: Vulnerability_Report_Vendor_Aggregate;
  /** fetch data from the table: "vulnerability_report_vendor" using primary key columns */
  vulnerability_report_vendor_by_pk?: Maybe<Vulnerability_Report_Vendor>;
  /** fetch data from the table: "vulnerability_severity" */
  vulnerability_severity: Array<Vulnerability_Severity>;
  /** fetch aggregated fields from the table: "vulnerability_severity" */
  vulnerability_severity_aggregate: Vulnerability_Severity_Aggregate;
  /** fetch data from the table: "vulnerability_severity" using primary key columns */
  vulnerability_severity_by_pk?: Maybe<Vulnerability_Severity>;
};


export type Query_RootAggregated_Fix_StateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


export type Query_RootAggregated_Fix_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


export type Query_RootAggregated_SeveritiesArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


export type Query_RootAggregated_Severities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


export type Query_RootApi_TokenArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


export type Query_RootApi_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


export type Query_RootApi_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBroker_HostArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


export type Query_RootBroker_Host_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


export type Query_RootBroker_Host_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBroker_TokenArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


export type Query_RootBroker_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


export type Query_RootBroker_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootCheckScmConnectionStatusArgs = {
  scmUrl: Scalars['String']['input'];
};


export type Query_RootCheckScmConnectionStatusAdminArgs = {
  scmUuid: Scalars['String']['input'];
};


export type Query_RootCli_LoginArgs = {
  distinct_on?: InputMaybe<Array<Cli_Login_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cli_Login_Order_By>>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};


export type Query_RootCli_Login_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cli_Login_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cli_Login_Order_By>>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};


export type Query_RootCli_Login_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootEffort_To_Apply_FixArgs = {
  distinct_on?: InputMaybe<Array<Effort_To_Apply_Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Effort_To_Apply_Fix_Order_By>>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};


export type Query_RootEffort_To_Apply_Fix_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Effort_To_Apply_Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Effort_To_Apply_Fix_Order_By>>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};


export type Query_RootEffort_To_Apply_Fix_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Query_RootFile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Query_RootFile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFixArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


export type Query_RootFixAnswerArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


export type Query_RootFixAnswer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


export type Query_RootFixAnswer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFixFileArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


export type Query_RootFixFile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


export type Query_RootFixFile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFixReportArgs = {
  distinct_on?: InputMaybe<Array<FixReport_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixReport_Order_By>>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};


export type Query_RootFixReport_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixReport_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixReport_Order_By>>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};


export type Query_RootFixReport_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFix_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


export type Query_RootFix_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFix_RatingArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


export type Query_RootFix_Rating_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


export type Query_RootFix_Rating_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFix_Rating_TagArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Tag_Order_By>>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};


export type Query_RootFix_Rating_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Tag_Order_By>>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};


export type Query_RootFix_Rating_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootFix_Report_StateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Report_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Report_State_Order_By>>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};


export type Query_RootFix_Report_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Report_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Report_State_Order_By>>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};


export type Query_RootFix_Report_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootFix_StateArgs = {
  distinct_on?: InputMaybe<Array<Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_State_Order_By>>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};


export type Query_RootFix_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_State_Order_By>>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};


export type Query_RootFix_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootFix_To_Scm_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootFix_To_Scm_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootFix_To_Scm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFix_To_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootFix_To_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootFix_To_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootGetCheckmarxIntegrationDataArgs = {
  organizationId: Scalars['String']['input'];
};


export type Query_RootGetCheckmarxProjectsArgs = {
  organizationId: Scalars['String']['input'];
};


export type Query_RootGetFileArgs = {
  filePath: Scalars['String']['input'];
};


export type Query_RootGetFixArgs = {
  fixId: Scalars['uuid']['input'];
  loadAnswers: Scalars['Boolean']['input'];
  userInput?: InputMaybe<Array<QuestionAnswer>>;
};


export type Query_RootGetGitBlameArgs = {
  diffString: Scalars['String']['input'];
  fixReportId: Scalars['String']['input'];
};


export type Query_RootGetScmReposArgs = {
  url: Scalars['String']['input'];
};


export type Query_RootGetScmUserInformationArgs = {
  scmType: Scalars['String']['input'];
  scmUrl?: InputMaybe<Scalars['String']['input']>;
};


export type Query_RootGetSplitFixArgs = {
  fixId: Scalars['uuid']['input'];
  loadAnswers: Scalars['Boolean']['input'];
  userInput?: InputMaybe<Array<QuestionAnswer>>;
};


export type Query_RootGitReferenceArgs = {
  reference: Scalars['String']['input'];
  repoUrl: Scalars['String']['input'];
};


export type Query_RootIntegrationArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


export type Query_RootIntegration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


export type Query_RootIntegration_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootIntegration_TypeArgs = {
  distinct_on?: InputMaybe<Array<Integration_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Type_Order_By>>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};


export type Query_RootIntegration_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integration_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Type_Order_By>>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};


export type Query_RootIntegration_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootInvitationArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Order_By>>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};


export type Query_RootInvitation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Order_By>>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};


export type Query_RootInvitation_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootInvitation_Status_TypeArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Status_Type_Order_By>>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};


export type Query_RootInvitation_Status_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Status_Type_Order_By>>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};


export type Query_RootInvitation_Status_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootInvitation_To_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


export type Query_RootInvitation_To_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


export type Query_RootInvitation_To_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootIssueLanguageArgs = {
  distinct_on?: InputMaybe<Array<IssueLanguage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueLanguage_Order_By>>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};


export type Query_RootIssueLanguage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IssueLanguage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueLanguage_Order_By>>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};


export type Query_RootIssueLanguage_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootIssueTypeArgs = {
  distinct_on?: InputMaybe<Array<IssueType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueType_Order_By>>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};


export type Query_RootIssueType_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IssueType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueType_Order_By>>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};


export type Query_RootIssueType_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootMeAdminArgs = {
  email: Scalars['String']['input'];
};


export type Query_RootOn_Prem_Scm_Oauth_ConfigArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


export type Query_RootOn_Prem_Scm_Oauth_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


export type Query_RootOn_Prem_Scm_Oauth_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganizationArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Query_RootOrganization_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Query_RootOrganization_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganization_Files_Matching_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


export type Query_RootOrganization_Files_Matching_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


export type Query_RootOrganization_Files_Matching_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganization_Issue_Type_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


export type Query_RootOrganization_Issue_Type_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


export type Query_RootOrganization_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganization_Role_TypeArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Type_Order_By>>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};


export type Query_RootOrganization_Role_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Type_Order_By>>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};


export type Query_RootOrganization_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootOrganization_To_Organization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_To_Organization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_To_Organization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOrganization_To_UserArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


export type Query_RootOrganization_To_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


export type Query_RootOrganization_To_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProjectArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


export type Query_RootProject_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


export type Query_RootProject_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProject_Issue_Type_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


export type Query_RootProject_Issue_Type_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


export type Query_RootProject_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProject_RoleArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Order_By>>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};


export type Query_RootProject_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Order_By>>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};


export type Query_RootProject_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProject_Role_TypeArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Type_Order_By>>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};


export type Query_RootProject_Role_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Type_Order_By>>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};


export type Query_RootProject_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootProject_To_Project_RoleArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


export type Query_RootProject_To_Project_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


export type Query_RootProject_To_Project_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProject_To_UserArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


export type Query_RootProject_To_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


export type Query_RootProject_To_User_By_PkArgs = {
  projectId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
};


export type Query_RootRepoArgs = {
  distinct_on?: InputMaybe<Array<Repo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Repo_Order_By>>;
  where?: InputMaybe<Repo_Bool_Exp>;
};


export type Query_RootRepo_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Repo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Repo_Order_By>>;
  where?: InputMaybe<Repo_Bool_Exp>;
};


export type Query_RootRepo_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootScan_SourceArgs = {
  distinct_on?: InputMaybe<Array<Scan_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scan_Source_Order_By>>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};


export type Query_RootScan_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scan_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scan_Source_Order_By>>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};


export type Query_RootScan_Source_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootScmGetSubmitRequestStatusArgs = {
  fixReportId: Scalars['String']['input'];
  submitRequestId: Scalars['String']['input'];
};


export type Query_RootScmHasRepoPermissionsArgs = {
  fixReportId: Scalars['String']['input'];
};


export type Query_RootScmIsBranchExistsArgs = {
  branch: Scalars['String']['input'];
  fixReportId: Scalars['String']['input'];
};


export type Query_RootScmIsBranchValidNameArgs = {
  branch: Scalars['String']['input'];
};


export type Query_RootScmListBranchesArgs = {
  fixReportId: Scalars['String']['input'];
};


export type Query_RootScm_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


export type Query_RootScm_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


export type Query_RootScm_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootScm_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootScm_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootScm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootSubmit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootSubmit_Fix_Request_Scm_TypeArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_Scm_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_Scm_Type_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Query_RootSubmit_Fix_Request_StateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_State_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_State_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};


export type Query_RootSubmit_Fix_Request_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootValidateCheckmarxConnectionArgs = {
  apiKey: Scalars['String']['input'];
  ast: Scalars['String']['input'];
  astBaseAuthUrl: Scalars['String']['input'];
  astBaseUrl: Scalars['String']['input'];
};


export type Query_RootValidateExistingCheckmarxConnectionArgs = {
  organizationId: Scalars['String']['input'];
};


export type Query_RootValidateRepoUrlArgs = {
  repoUrl: Scalars['String']['input'];
};


export type Query_RootValidateScmTokenArgs = {
  scmOrg?: InputMaybe<Scalars['String']['input']>;
  scmType: Scalars['String']['input'];
  token: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type Query_RootView_Project_Resolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootView_Project_Resolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootView_Project_Total_Resolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootView_Project_Total_Resolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootView_Project_Vulnerability_SeveritiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


export type Query_RootView_Project_Vulnerability_Severities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


export type Query_RootView_Total_Unique_Unresolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootView_Total_Unique_Unresolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
};


export type Query_RootVulnerability_ReportArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


export type Query_RootVulnerability_Report_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


export type Query_RootVulnerability_Report_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVulnerability_Report_IssueArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVulnerability_Report_Issue_Code_NodeArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_Code_Node_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_Code_Node_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVulnerability_Report_Issue_StateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_State_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_State_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootVulnerability_Report_Issue_TagArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_TagArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVulnerability_Report_PathArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Path_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Path_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Path_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Path_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Path_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Path_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVulnerability_Report_VendorArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Vendor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Vendor_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Vendor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Vendor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Vendor_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};


export type Query_RootVulnerability_Report_Vendor_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootVulnerability_SeverityArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Severity_Order_By>>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};


export type Query_RootVulnerability_Severity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Severity_Order_By>>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};


export type Query_RootVulnerability_Severity_By_PkArgs = {
  value: Scalars['String']['input'];
};

/** columns and relationships of "repo" */
export type Repo = {
  __typename?: 'repo';
  /** An object relationship */
  archiveFile?: Maybe<File>;
  archiveFileId?: Maybe<Scalars['uuid']['output']>;
  commitSha: Scalars['String']['output'];
  /** An object relationship */
  fixReport?: Maybe<FixReport>;
  id: Scalars['uuid']['output'];
  isKnownBranch?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  originalUrl: Scalars['String']['output'];
  pathPrefix: Scalars['String']['output'];
  pullRequest?: Maybe<Scalars['Int']['output']>;
  reference: Scalars['String']['output'];
};

/** aggregated selection of "repo" */
export type Repo_Aggregate = {
  __typename?: 'repo_aggregate';
  aggregate?: Maybe<Repo_Aggregate_Fields>;
  nodes: Array<Repo>;
};

/** aggregate fields of "repo" */
export type Repo_Aggregate_Fields = {
  __typename?: 'repo_aggregate_fields';
  avg?: Maybe<Repo_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Repo_Max_Fields>;
  min?: Maybe<Repo_Min_Fields>;
  stddev?: Maybe<Repo_Stddev_Fields>;
  stddev_pop?: Maybe<Repo_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Repo_Stddev_Samp_Fields>;
  sum?: Maybe<Repo_Sum_Fields>;
  var_pop?: Maybe<Repo_Var_Pop_Fields>;
  var_samp?: Maybe<Repo_Var_Samp_Fields>;
  variance?: Maybe<Repo_Variance_Fields>;
};


/** aggregate fields of "repo" */
export type Repo_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Repo_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Repo_Avg_Fields = {
  __typename?: 'repo_avg_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "repo". All fields are combined with a logical 'AND'. */
export type Repo_Bool_Exp = {
  _and?: InputMaybe<Array<Repo_Bool_Exp>>;
  _not?: InputMaybe<Repo_Bool_Exp>;
  _or?: InputMaybe<Array<Repo_Bool_Exp>>;
  archiveFile?: InputMaybe<File_Bool_Exp>;
  archiveFileId?: InputMaybe<Uuid_Comparison_Exp>;
  commitSha?: InputMaybe<String_Comparison_Exp>;
  fixReport?: InputMaybe<FixReport_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isKnownBranch?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  originalUrl?: InputMaybe<String_Comparison_Exp>;
  pathPrefix?: InputMaybe<String_Comparison_Exp>;
  pullRequest?: InputMaybe<Int_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "repo" */
export enum Repo_Constraint {
  /** unique or primary key constraint on columns "id" */
  RepoPkey = 'repo_pkey'
}

/** input type for incrementing numeric columns in table "repo" */
export type Repo_Inc_Input = {
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "repo" */
export type Repo_Insert_Input = {
  archiveFile?: InputMaybe<File_Obj_Rel_Insert_Input>;
  archiveFileId?: InputMaybe<Scalars['uuid']['input']>;
  commitSha?: InputMaybe<Scalars['String']['input']>;
  fixReport?: InputMaybe<FixReport_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isKnownBranch?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  originalUrl?: InputMaybe<Scalars['String']['input']>;
  pathPrefix?: InputMaybe<Scalars['String']['input']>;
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Repo_Max_Fields = {
  __typename?: 'repo_max_fields';
  archiveFileId?: Maybe<Scalars['uuid']['output']>;
  commitSha?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  originalUrl?: Maybe<Scalars['String']['output']>;
  pathPrefix?: Maybe<Scalars['String']['output']>;
  pullRequest?: Maybe<Scalars['Int']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Repo_Min_Fields = {
  __typename?: 'repo_min_fields';
  archiveFileId?: Maybe<Scalars['uuid']['output']>;
  commitSha?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  originalUrl?: Maybe<Scalars['String']['output']>;
  pathPrefix?: Maybe<Scalars['String']['output']>;
  pullRequest?: Maybe<Scalars['Int']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "repo" */
export type Repo_Mutation_Response = {
  __typename?: 'repo_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Repo>;
};

/** input type for inserting object relation for remote table "repo" */
export type Repo_Obj_Rel_Insert_Input = {
  data: Repo_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Repo_On_Conflict>;
};

/** on_conflict condition type for table "repo" */
export type Repo_On_Conflict = {
  constraint: Repo_Constraint;
  update_columns?: Array<Repo_Update_Column>;
  where?: InputMaybe<Repo_Bool_Exp>;
};

/** Ordering options when selecting data from "repo". */
export type Repo_Order_By = {
  archiveFile?: InputMaybe<File_Order_By>;
  archiveFileId?: InputMaybe<Order_By>;
  commitSha?: InputMaybe<Order_By>;
  fixReport?: InputMaybe<FixReport_Order_By>;
  id?: InputMaybe<Order_By>;
  isKnownBranch?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  originalUrl?: InputMaybe<Order_By>;
  pathPrefix?: InputMaybe<Order_By>;
  pullRequest?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
};

/** primary key columns input for table: repo */
export type Repo_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "repo" */
export enum Repo_Select_Column {
  /** column name */
  ArchiveFileId = 'archiveFileId',
  /** column name */
  CommitSha = 'commitSha',
  /** column name */
  Id = 'id',
  /** column name */
  IsKnownBranch = 'isKnownBranch',
  /** column name */
  Name = 'name',
  /** column name */
  OriginalUrl = 'originalUrl',
  /** column name */
  PathPrefix = 'pathPrefix',
  /** column name */
  PullRequest = 'pullRequest',
  /** column name */
  Reference = 'reference'
}

/** input type for updating data in table "repo" */
export type Repo_Set_Input = {
  archiveFileId?: InputMaybe<Scalars['uuid']['input']>;
  commitSha?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isKnownBranch?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  originalUrl?: InputMaybe<Scalars['String']['input']>;
  pathPrefix?: InputMaybe<Scalars['String']['input']>;
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Repo_Stddev_Fields = {
  __typename?: 'repo_stddev_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Repo_Stddev_Pop_Fields = {
  __typename?: 'repo_stddev_pop_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Repo_Stddev_Samp_Fields = {
  __typename?: 'repo_stddev_samp_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "repo" */
export type Repo_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Repo_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Repo_Stream_Cursor_Value_Input = {
  archiveFileId?: InputMaybe<Scalars['uuid']['input']>;
  commitSha?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isKnownBranch?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  originalUrl?: InputMaybe<Scalars['String']['input']>;
  pathPrefix?: InputMaybe<Scalars['String']['input']>;
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Repo_Sum_Fields = {
  __typename?: 'repo_sum_fields';
  pullRequest?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "repo" */
export enum Repo_Update_Column {
  /** column name */
  ArchiveFileId = 'archiveFileId',
  /** column name */
  CommitSha = 'commitSha',
  /** column name */
  Id = 'id',
  /** column name */
  IsKnownBranch = 'isKnownBranch',
  /** column name */
  Name = 'name',
  /** column name */
  OriginalUrl = 'originalUrl',
  /** column name */
  PathPrefix = 'pathPrefix',
  /** column name */
  PullRequest = 'pullRequest',
  /** column name */
  Reference = 'reference'
}

export type Repo_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Repo_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Repo_Set_Input>;
  /** filter the rows which have to be updated */
  where: Repo_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Repo_Var_Pop_Fields = {
  __typename?: 'repo_var_pop_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Repo_Var_Samp_Fields = {
  __typename?: 'repo_var_samp_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Repo_Variance_Fields = {
  __typename?: 'repo_variance_fields';
  pullRequest?: Maybe<Scalars['Float']['output']>;
};

export type ResolvedAggregatedVulnerabilitySeverities_Organization_Args = {
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "scan_source" */
export type Scan_Source = {
  __typename?: 'scan_source';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "scan_source" */
export type Scan_Source_Aggregate = {
  __typename?: 'scan_source_aggregate';
  aggregate?: Maybe<Scan_Source_Aggregate_Fields>;
  nodes: Array<Scan_Source>;
};

/** aggregate fields of "scan_source" */
export type Scan_Source_Aggregate_Fields = {
  __typename?: 'scan_source_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Scan_Source_Max_Fields>;
  min?: Maybe<Scan_Source_Min_Fields>;
};


/** aggregate fields of "scan_source" */
export type Scan_Source_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Scan_Source_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "scan_source". All fields are combined with a logical 'AND'. */
export type Scan_Source_Bool_Exp = {
  _and?: InputMaybe<Array<Scan_Source_Bool_Exp>>;
  _not?: InputMaybe<Scan_Source_Bool_Exp>;
  _or?: InputMaybe<Array<Scan_Source_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "scan_source" */
export enum Scan_Source_Constraint {
  /** unique or primary key constraint on columns "value" */
  ScanSourcePkey = 'scan_source_pkey'
}

export enum Scan_Source_Enum {
  /** The auto-fixer */
  AutoFixer = 'AUTO_FIXER',
  /** Azure CI */
  CiAzure = 'CI_AZURE',
  /** Bamboo CI */
  CiBamboo = 'CI_BAMBOO',
  /** CircleCI CI */
  CiCircleci = 'CI_CIRCLECI',
  /** GitHub CI */
  CiGithub = 'CI_GITHUB',
  /** GitLab CI */
  CiGitlab = 'CI_GITLAB',
  /** Jenkins CI */
  CiJenkins = 'CI_JENKINS',
  /** This is Bugsy executed from a command line */
  Cli = 'CLI',
  /** Web App from the Checkmarx integration */
  WebUiCheckmarxIntegration = 'WEB_UI_CHECKMARX_INTEGRATION',
  /** Web App, when the user uploads the vulnerability report */
  WebUiFixOwnCode = 'WEB_UI_FIX_OWN_CODE',
  /** Web App from the on-boarding process */
  WebUiOnboarding = 'WEB_UI_ONBOARDING',
  /** Web App, when the fix expired, the user re-ran the analysis */
  WebUiRerunAnalysis = 'WEB_UI_RERUN_ANALYSIS',
  /** Web App when the user requested the scan from the try now option */
  WebUiTryNow = 'WEB_UI_TRY_NOW'
}

/** Boolean expression to compare columns of type "scan_source_enum". All fields are combined with logical 'AND'. */
export type Scan_Source_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Scan_Source_Enum>;
  _in?: InputMaybe<Array<Scan_Source_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scan_Source_Enum>;
  _nin?: InputMaybe<Array<Scan_Source_Enum>>;
};

/** input type for inserting data into table "scan_source" */
export type Scan_Source_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Scan_Source_Max_Fields = {
  __typename?: 'scan_source_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Scan_Source_Min_Fields = {
  __typename?: 'scan_source_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "scan_source" */
export type Scan_Source_Mutation_Response = {
  __typename?: 'scan_source_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Scan_Source>;
};

/** on_conflict condition type for table "scan_source" */
export type Scan_Source_On_Conflict = {
  constraint: Scan_Source_Constraint;
  update_columns?: Array<Scan_Source_Update_Column>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};

/** Ordering options when selecting data from "scan_source". */
export type Scan_Source_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: scan_source */
export type Scan_Source_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "scan_source" */
export enum Scan_Source_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "scan_source" */
export type Scan_Source_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "scan_source" */
export type Scan_Source_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Scan_Source_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Scan_Source_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "scan_source" */
export enum Scan_Source_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Scan_Source_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Scan_Source_Set_Input>;
  /** filter the rows which have to be updated */
  where: Scan_Source_Bool_Exp;
};

/** columns and relationships of "scm_config" */
export type Scm_Config = {
  __typename?: 'scm_config';
  id: Scalars['uuid']['output'];
  isTokenOauth: Scalars['Boolean']['output'];
  orgId?: Maybe<Scalars['uuid']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  scmOrg?: Maybe<Scalars['String']['output']>;
  scmType: Submit_Fix_Request_Scm_Type_Enum;
  scmUrl: Scalars['String']['output'];
  scmUsername?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenLastUpdate?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  user?: Maybe<User>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "scm_config" */
export type Scm_Config_Aggregate = {
  __typename?: 'scm_config_aggregate';
  aggregate?: Maybe<Scm_Config_Aggregate_Fields>;
  nodes: Array<Scm_Config>;
};

export type Scm_Config_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Scm_Config_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Scm_Config_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Scm_Config_Aggregate_Bool_Exp_Count>;
};

export type Scm_Config_Aggregate_Bool_Exp_Bool_And = {
  arguments: Scm_Config_Select_Column_Scm_Config_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scm_Config_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Scm_Config_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Scm_Config_Select_Column_Scm_Config_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scm_Config_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Scm_Config_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Scm_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scm_Config_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "scm_config" */
export type Scm_Config_Aggregate_Fields = {
  __typename?: 'scm_config_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Scm_Config_Max_Fields>;
  min?: Maybe<Scm_Config_Min_Fields>;
};


/** aggregate fields of "scm_config" */
export type Scm_Config_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Scm_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "scm_config" */
export type Scm_Config_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Scm_Config_Max_Order_By>;
  min?: InputMaybe<Scm_Config_Min_Order_By>;
};

/** input type for inserting array relation for remote table "scm_config" */
export type Scm_Config_Arr_Rel_Insert_Input = {
  data: Array<Scm_Config_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Scm_Config_On_Conflict>;
};

/** Boolean expression to filter rows from the table "scm_config". All fields are combined with a logical 'AND'. */
export type Scm_Config_Bool_Exp = {
  _and?: InputMaybe<Array<Scm_Config_Bool_Exp>>;
  _not?: InputMaybe<Scm_Config_Bool_Exp>;
  _or?: InputMaybe<Array<Scm_Config_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isTokenOauth?: InputMaybe<Boolean_Comparison_Exp>;
  orgId?: InputMaybe<Uuid_Comparison_Exp>;
  refreshToken?: InputMaybe<String_Comparison_Exp>;
  scmOrg?: InputMaybe<String_Comparison_Exp>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum_Comparison_Exp>;
  scmUrl?: InputMaybe<String_Comparison_Exp>;
  scmUsername?: InputMaybe<String_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  tokenLastUpdate?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "scm_config" */
export enum Scm_Config_Constraint {
  /** unique or primary key constraint on columns "id" */
  ScmConfigPkey = 'scm_config_pkey'
}

/** input type for inserting data into table "scm_config" */
export type Scm_Config_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  isTokenOauth?: InputMaybe<Scalars['Boolean']['input']>;
  orgId?: InputMaybe<Scalars['uuid']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scmOrg?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
  scmUsername?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenLastUpdate?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Scm_Config_Max_Fields = {
  __typename?: 'scm_config_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  orgId?: Maybe<Scalars['uuid']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  scmOrg?: Maybe<Scalars['String']['output']>;
  scmUrl?: Maybe<Scalars['String']['output']>;
  scmUsername?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenLastUpdate?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "scm_config" */
export type Scm_Config_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  orgId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  scmOrg?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
  scmUsername?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenLastUpdate?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Scm_Config_Min_Fields = {
  __typename?: 'scm_config_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  orgId?: Maybe<Scalars['uuid']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  scmOrg?: Maybe<Scalars['String']['output']>;
  scmUrl?: Maybe<Scalars['String']['output']>;
  scmUsername?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  tokenLastUpdate?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "scm_config" */
export type Scm_Config_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  orgId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  scmOrg?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
  scmUsername?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenLastUpdate?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "scm_config" */
export type Scm_Config_Mutation_Response = {
  __typename?: 'scm_config_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Scm_Config>;
};

/** on_conflict condition type for table "scm_config" */
export type Scm_Config_On_Conflict = {
  constraint: Scm_Config_Constraint;
  update_columns?: Array<Scm_Config_Update_Column>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};

/** Ordering options when selecting data from "scm_config". */
export type Scm_Config_Order_By = {
  id?: InputMaybe<Order_By>;
  isTokenOauth?: InputMaybe<Order_By>;
  orgId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  scmOrg?: InputMaybe<Order_By>;
  scmType?: InputMaybe<Order_By>;
  scmUrl?: InputMaybe<Order_By>;
  scmUsername?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  tokenLastUpdate?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: scm_config */
export type Scm_Config_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "scm_config" */
export enum Scm_Config_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsTokenOauth = 'isTokenOauth',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  ScmOrg = 'scmOrg',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  ScmUrl = 'scmUrl',
  /** column name */
  ScmUsername = 'scmUsername',
  /** column name */
  Token = 'token',
  /** column name */
  TokenLastUpdate = 'tokenLastUpdate',
  /** column name */
  UserId = 'userId'
}

/** select "scm_config_aggregate_bool_exp_bool_and_arguments_columns" columns of table "scm_config" */
export enum Scm_Config_Select_Column_Scm_Config_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsTokenOauth = 'isTokenOauth'
}

/** select "scm_config_aggregate_bool_exp_bool_or_arguments_columns" columns of table "scm_config" */
export enum Scm_Config_Select_Column_Scm_Config_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsTokenOauth = 'isTokenOauth'
}

/** input type for updating data in table "scm_config" */
export type Scm_Config_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  isTokenOauth?: InputMaybe<Scalars['Boolean']['input']>;
  orgId?: InputMaybe<Scalars['uuid']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scmOrg?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
  scmUsername?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenLastUpdate?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "scm_config" */
export type Scm_Config_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Scm_Config_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Scm_Config_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  isTokenOauth?: InputMaybe<Scalars['Boolean']['input']>;
  orgId?: InputMaybe<Scalars['uuid']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scmOrg?: InputMaybe<Scalars['String']['input']>;
  scmType?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  scmUrl?: InputMaybe<Scalars['String']['input']>;
  scmUsername?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenLastUpdate?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "scm_config" */
export enum Scm_Config_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsTokenOauth = 'isTokenOauth',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  ScmOrg = 'scmOrg',
  /** column name */
  ScmType = 'scmType',
  /** column name */
  ScmUrl = 'scmUrl',
  /** column name */
  ScmUsername = 'scmUsername',
  /** column name */
  Token = 'token',
  /** column name */
  TokenLastUpdate = 'tokenLastUpdate',
  /** column name */
  UserId = 'userId'
}

export type Scm_Config_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Scm_Config_Set_Input>;
  /** filter the rows which have to be updated */
  where: Scm_Config_Bool_Exp;
};

/** columns and relationships of "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request = {
  __typename?: 'scm_submit_fix_request';
  commitUrl?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  fixes: Array<Fix_To_Scm_Submit_Fix_Request>;
  /** An aggregate relationship */
  fixes_aggregate: Fix_To_Scm_Submit_Fix_Request_Aggregate;
  id: Scalars['uuid']['output'];
  prUrl?: Maybe<Scalars['String']['output']>;
  scmId: Scalars['String']['output'];
  submitBranchName: Scalars['String']['output'];
  /** An object relationship */
  submitFixRequest: Submit_Fix_Request;
  submitFixRequestId: Scalars['uuid']['output'];
};


/** columns and relationships of "scm_submit_fix_request" */
export type Scm_Submit_Fix_RequestFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


/** columns and relationships of "scm_submit_fix_request" */
export type Scm_Submit_Fix_RequestFixes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};

/** aggregated selection of "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Aggregate = {
  __typename?: 'scm_submit_fix_request_aggregate';
  aggregate?: Maybe<Scm_Submit_Fix_Request_Aggregate_Fields>;
  nodes: Array<Scm_Submit_Fix_Request>;
};

export type Scm_Submit_Fix_Request_Aggregate_Bool_Exp = {
  count?: InputMaybe<Scm_Submit_Fix_Request_Aggregate_Bool_Exp_Count>;
};

export type Scm_Submit_Fix_Request_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Aggregate_Fields = {
  __typename?: 'scm_submit_fix_request_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Scm_Submit_Fix_Request_Max_Fields>;
  min?: Maybe<Scm_Submit_Fix_Request_Min_Fields>;
};


/** aggregate fields of "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Scm_Submit_Fix_Request_Max_Order_By>;
  min?: InputMaybe<Scm_Submit_Fix_Request_Min_Order_By>;
};

/** input type for inserting array relation for remote table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Arr_Rel_Insert_Input = {
  data: Array<Scm_Submit_Fix_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Scm_Submit_Fix_Request_On_Conflict>;
};

/** Boolean expression to filter rows from the table "scm_submit_fix_request". All fields are combined with a logical 'AND'. */
export type Scm_Submit_Fix_Request_Bool_Exp = {
  _and?: InputMaybe<Array<Scm_Submit_Fix_Request_Bool_Exp>>;
  _not?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
  _or?: InputMaybe<Array<Scm_Submit_Fix_Request_Bool_Exp>>;
  commitUrl?: InputMaybe<String_Comparison_Exp>;
  fixes?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
  fixes_aggregate?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  prUrl?: InputMaybe<String_Comparison_Exp>;
  scmId?: InputMaybe<String_Comparison_Exp>;
  submitBranchName?: InputMaybe<String_Comparison_Exp>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
  submitFixRequestId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "scm_submit_fix_request" */
export enum Scm_Submit_Fix_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  ScmSubmitFixRequestPkey = 'scm_submit_fix_request_pkey'
}

/** input type for inserting data into table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Insert_Input = {
  commitUrl?: InputMaybe<Scalars['String']['input']>;
  fixes?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  prUrl?: InputMaybe<Scalars['String']['input']>;
  scmId?: InputMaybe<Scalars['String']['input']>;
  submitBranchName?: InputMaybe<Scalars['String']['input']>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Obj_Rel_Insert_Input>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Scm_Submit_Fix_Request_Max_Fields = {
  __typename?: 'scm_submit_fix_request_max_fields';
  commitUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  prUrl?: Maybe<Scalars['String']['output']>;
  scmId?: Maybe<Scalars['String']['output']>;
  submitBranchName?: Maybe<Scalars['String']['output']>;
  submitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Max_Order_By = {
  commitUrl?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  prUrl?: InputMaybe<Order_By>;
  scmId?: InputMaybe<Order_By>;
  submitBranchName?: InputMaybe<Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Scm_Submit_Fix_Request_Min_Fields = {
  __typename?: 'scm_submit_fix_request_min_fields';
  commitUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  prUrl?: Maybe<Scalars['String']['output']>;
  scmId?: Maybe<Scalars['String']['output']>;
  submitBranchName?: Maybe<Scalars['String']['output']>;
  submitFixRequestId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Min_Order_By = {
  commitUrl?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  prUrl?: InputMaybe<Order_By>;
  scmId?: InputMaybe<Order_By>;
  submitBranchName?: InputMaybe<Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Mutation_Response = {
  __typename?: 'scm_submit_fix_request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Scm_Submit_Fix_Request>;
};

/** input type for inserting object relation for remote table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Obj_Rel_Insert_Input = {
  data: Scm_Submit_Fix_Request_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Scm_Submit_Fix_Request_On_Conflict>;
};

/** on_conflict condition type for table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_On_Conflict = {
  constraint: Scm_Submit_Fix_Request_Constraint;
  update_columns?: Array<Scm_Submit_Fix_Request_Update_Column>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};

/** Ordering options when selecting data from "scm_submit_fix_request". */
export type Scm_Submit_Fix_Request_Order_By = {
  commitUrl?: InputMaybe<Order_By>;
  fixes_aggregate?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  prUrl?: InputMaybe<Order_By>;
  scmId?: InputMaybe<Order_By>;
  submitBranchName?: InputMaybe<Order_By>;
  submitFixRequest?: InputMaybe<Submit_Fix_Request_Order_By>;
  submitFixRequestId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: scm_submit_fix_request */
export type Scm_Submit_Fix_Request_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "scm_submit_fix_request" */
export enum Scm_Submit_Fix_Request_Select_Column {
  /** column name */
  CommitUrl = 'commitUrl',
  /** column name */
  Id = 'id',
  /** column name */
  PrUrl = 'prUrl',
  /** column name */
  ScmId = 'scmId',
  /** column name */
  SubmitBranchName = 'submitBranchName',
  /** column name */
  SubmitFixRequestId = 'submitFixRequestId'
}

/** input type for updating data in table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Set_Input = {
  commitUrl?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  prUrl?: InputMaybe<Scalars['String']['input']>;
  scmId?: InputMaybe<Scalars['String']['input']>;
  submitBranchName?: InputMaybe<Scalars['String']['input']>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "scm_submit_fix_request" */
export type Scm_Submit_Fix_Request_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Scm_Submit_Fix_Request_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Scm_Submit_Fix_Request_Stream_Cursor_Value_Input = {
  commitUrl?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  prUrl?: InputMaybe<Scalars['String']['input']>;
  scmId?: InputMaybe<Scalars['String']['input']>;
  submitBranchName?: InputMaybe<Scalars['String']['input']>;
  submitFixRequestId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "scm_submit_fix_request" */
export enum Scm_Submit_Fix_Request_Update_Column {
  /** column name */
  CommitUrl = 'commitUrl',
  /** column name */
  Id = 'id',
  /** column name */
  PrUrl = 'prUrl',
  /** column name */
  ScmId = 'scmId',
  /** column name */
  SubmitBranchName = 'submitBranchName',
  /** column name */
  SubmitFixRequestId = 'submitFixRequestId'
}

export type Scm_Submit_Fix_Request_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Scm_Submit_Fix_Request_Set_Input>;
  /** filter the rows which have to be updated */
  where: Scm_Submit_Fix_Request_Bool_Exp;
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['smallint']['input']>;
  _gt?: InputMaybe<Scalars['smallint']['input']>;
  _gte?: InputMaybe<Scalars['smallint']['input']>;
  _in?: InputMaybe<Array<Scalars['smallint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['smallint']['input']>;
  _lte?: InputMaybe<Scalars['smallint']['input']>;
  _neq?: InputMaybe<Scalars['smallint']['input']>;
  _nin?: InputMaybe<Array<Scalars['smallint']['input']>>;
};

/** Table that represents requests by the user to open PRs on GitHub or MRs on Gitlab or other requests on other SCM types for one or multiple Mobb fixes */
export type Submit_Fix_Request = {
  __typename?: 'submit_fix_request';
  /** An object relationship */
  createdByUser: User;
  createdByUserId: Scalars['uuid']['output'];
  createdOn: Scalars['timestamptz']['output'];
  description: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  fixReport: FixReport;
  fixReportId: Scalars['uuid']['output'];
  /** An array relationship */
  fixes: Array<Fix_To_Submit_Fix_Request>;
  /** An aggregate relationship */
  fixes_aggregate: Fix_To_Submit_Fix_Request_Aggregate;
  id: Scalars['uuid']['output'];
  /** An array relationship */
  scmSubmitFixRequests: Array<Scm_Submit_Fix_Request>;
  /** An aggregate relationship */
  scmSubmitFixRequests_aggregate: Scm_Submit_Fix_Request_Aggregate;
  state: Submit_Fix_Request_State_Enum;
  targetBranchName: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Submit_Fix_Request_Scm_Type_Enum;
  updatedAt: Scalars['timestamptz']['output'];
};


/** Table that represents requests by the user to open PRs on GitHub or MRs on Gitlab or other requests on other SCM types for one or multiple Mobb fixes */
export type Submit_Fix_RequestFixesArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


/** Table that represents requests by the user to open PRs on GitHub or MRs on Gitlab or other requests on other SCM types for one or multiple Mobb fixes */
export type Submit_Fix_RequestFixes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


/** Table that represents requests by the user to open PRs on GitHub or MRs on Gitlab or other requests on other SCM types for one or multiple Mobb fixes */
export type Submit_Fix_RequestScmSubmitFixRequestsArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


/** Table that represents requests by the user to open PRs on GitHub or MRs on Gitlab or other requests on other SCM types for one or multiple Mobb fixes */
export type Submit_Fix_RequestScmSubmitFixRequests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};

/** aggregated selection of "submit_fix_request" */
export type Submit_Fix_Request_Aggregate = {
  __typename?: 'submit_fix_request_aggregate';
  aggregate?: Maybe<Submit_Fix_Request_Aggregate_Fields>;
  nodes: Array<Submit_Fix_Request>;
};

/** aggregate fields of "submit_fix_request" */
export type Submit_Fix_Request_Aggregate_Fields = {
  __typename?: 'submit_fix_request_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Submit_Fix_Request_Max_Fields>;
  min?: Maybe<Submit_Fix_Request_Min_Fields>;
};


/** aggregate fields of "submit_fix_request" */
export type Submit_Fix_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Submit_Fix_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "submit_fix_request". All fields are combined with a logical 'AND'. */
export type Submit_Fix_Request_Bool_Exp = {
  _and?: InputMaybe<Array<Submit_Fix_Request_Bool_Exp>>;
  _not?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
  _or?: InputMaybe<Array<Submit_Fix_Request_Bool_Exp>>;
  createdByUser?: InputMaybe<User_Bool_Exp>;
  createdByUserId?: InputMaybe<Uuid_Comparison_Exp>;
  createdOn?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  fixReport?: InputMaybe<FixReport_Bool_Exp>;
  fixReportId?: InputMaybe<Uuid_Comparison_Exp>;
  fixes?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
  fixes_aggregate?: InputMaybe<Fix_To_Submit_Fix_Request_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  scmSubmitFixRequests?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
  scmSubmitFixRequests_aggregate?: InputMaybe<Scm_Submit_Fix_Request_Aggregate_Bool_Exp>;
  state?: InputMaybe<Submit_Fix_Request_State_Enum_Comparison_Exp>;
  targetBranchName?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "submit_fix_request" */
export enum Submit_Fix_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  SubmitFixRequestPkey = 'submit_fix_request_pkey'
}

/** input type for inserting data into table "submit_fix_request" */
export type Submit_Fix_Request_Insert_Input = {
  createdByUser?: InputMaybe<User_Obj_Rel_Insert_Input>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  fixReport?: InputMaybe<FixReport_Obj_Rel_Insert_Input>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  fixes?: InputMaybe<Fix_To_Submit_Fix_Request_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  scmSubmitFixRequests?: InputMaybe<Scm_Submit_Fix_Request_Arr_Rel_Insert_Input>;
  state?: InputMaybe<Submit_Fix_Request_State_Enum>;
  targetBranchName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Submit_Fix_Request_Max_Fields = {
  __typename?: 'submit_fix_request_max_fields';
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  fixReportId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  targetBranchName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Submit_Fix_Request_Min_Fields = {
  __typename?: 'submit_fix_request_min_fields';
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  createdOn?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  fixReportId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  targetBranchName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "submit_fix_request" */
export type Submit_Fix_Request_Mutation_Response = {
  __typename?: 'submit_fix_request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Submit_Fix_Request>;
};

/** input type for inserting object relation for remote table "submit_fix_request" */
export type Submit_Fix_Request_Obj_Rel_Insert_Input = {
  data: Submit_Fix_Request_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Submit_Fix_Request_On_Conflict>;
};

/** on_conflict condition type for table "submit_fix_request" */
export type Submit_Fix_Request_On_Conflict = {
  constraint: Submit_Fix_Request_Constraint;
  update_columns?: Array<Submit_Fix_Request_Update_Column>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};

/** Ordering options when selecting data from "submit_fix_request". */
export type Submit_Fix_Request_Order_By = {
  createdByUser?: InputMaybe<User_Order_By>;
  createdByUserId?: InputMaybe<Order_By>;
  createdOn?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  fixReport?: InputMaybe<FixReport_Order_By>;
  fixReportId?: InputMaybe<Order_By>;
  fixes_aggregate?: InputMaybe<Fix_To_Submit_Fix_Request_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  scmSubmitFixRequests_aggregate?: InputMaybe<Scm_Submit_Fix_Request_Aggregate_Order_By>;
  state?: InputMaybe<Order_By>;
  targetBranchName?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: submit_fix_request */
export type Submit_Fix_Request_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type = {
  __typename?: 'submit_fix_request_scm_type';
  comment?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

/** aggregated selection of "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Aggregate = {
  __typename?: 'submit_fix_request_scm_type_aggregate';
  aggregate?: Maybe<Submit_Fix_Request_Scm_Type_Aggregate_Fields>;
  nodes: Array<Submit_Fix_Request_Scm_Type>;
};

/** aggregate fields of "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Aggregate_Fields = {
  __typename?: 'submit_fix_request_scm_type_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Submit_Fix_Request_Scm_Type_Max_Fields>;
  min?: Maybe<Submit_Fix_Request_Scm_Type_Min_Fields>;
};


/** aggregate fields of "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "submit_fix_request_scm_type". All fields are combined with a logical 'AND'. */
export type Submit_Fix_Request_Scm_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Bool_Exp>>;
  _not?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "submit_fix_request_scm_type" */
export enum Submit_Fix_Request_Scm_Type_Constraint {
  /** unique or primary key constraint on columns "name" */
  SubmitFixRequestScmTypePkey = 'submit_fix_request_scm_type_pkey'
}

export enum Submit_Fix_Request_Scm_Type_Enum {
  /** Azure DevOps SCM */
  Ado = 'Ado',
  /** Bitbucket SCM */
  Bitbucket = 'Bitbucket',
  /** GitHub SCM */
  GitHub = 'GitHub',
  /** GitLab SCM */
  GitLab = 'GitLab'
}

/** Boolean expression to compare columns of type "submit_fix_request_scm_type_enum". All fields are combined with logical 'AND'. */
export type Submit_Fix_Request_Scm_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  _in?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  _nin?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Enum>>;
};

/** input type for inserting data into table "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Submit_Fix_Request_Scm_Type_Max_Fields = {
  __typename?: 'submit_fix_request_scm_type_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Submit_Fix_Request_Scm_Type_Min_Fields = {
  __typename?: 'submit_fix_request_scm_type_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Mutation_Response = {
  __typename?: 'submit_fix_request_scm_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Submit_Fix_Request_Scm_Type>;
};

/** on_conflict condition type for table "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_On_Conflict = {
  constraint: Submit_Fix_Request_Scm_Type_Constraint;
  update_columns?: Array<Submit_Fix_Request_Scm_Type_Update_Column>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "submit_fix_request_scm_type". */
export type Submit_Fix_Request_Scm_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: submit_fix_request_scm_type */
export type Submit_Fix_Request_Scm_Type_Pk_Columns_Input = {
  name: Scalars['String']['input'];
};

/** select columns of table "submit_fix_request_scm_type" */
export enum Submit_Fix_Request_Scm_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "submit_fix_request_scm_type" */
export type Submit_Fix_Request_Scm_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Submit_Fix_Request_Scm_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Submit_Fix_Request_Scm_Type_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "submit_fix_request_scm_type" */
export enum Submit_Fix_Request_Scm_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Name = 'name'
}

export type Submit_Fix_Request_Scm_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Submit_Fix_Request_Scm_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Submit_Fix_Request_Scm_Type_Bool_Exp;
};

/** select columns of table "submit_fix_request" */
export enum Submit_Fix_Request_Select_Column {
  /** column name */
  CreatedByUserId = 'createdByUserId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Description = 'description',
  /** column name */
  Error = 'error',
  /** column name */
  FixReportId = 'fixReportId',
  /** column name */
  Id = 'id',
  /** column name */
  State = 'state',
  /** column name */
  TargetBranchName = 'targetBranchName',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "submit_fix_request" */
export type Submit_Fix_Request_Set_Input = {
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  state?: InputMaybe<Submit_Fix_Request_State_Enum>;
  targetBranchName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** columns and relationships of "submit_fix_request_state" */
export type Submit_Fix_Request_State = {
  __typename?: 'submit_fix_request_state';
  comment?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "submit_fix_request_state" */
export type Submit_Fix_Request_State_Aggregate = {
  __typename?: 'submit_fix_request_state_aggregate';
  aggregate?: Maybe<Submit_Fix_Request_State_Aggregate_Fields>;
  nodes: Array<Submit_Fix_Request_State>;
};

/** aggregate fields of "submit_fix_request_state" */
export type Submit_Fix_Request_State_Aggregate_Fields = {
  __typename?: 'submit_fix_request_state_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Submit_Fix_Request_State_Max_Fields>;
  min?: Maybe<Submit_Fix_Request_State_Min_Fields>;
};


/** aggregate fields of "submit_fix_request_state" */
export type Submit_Fix_Request_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Submit_Fix_Request_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "submit_fix_request_state". All fields are combined with a logical 'AND'. */
export type Submit_Fix_Request_State_Bool_Exp = {
  _and?: InputMaybe<Array<Submit_Fix_Request_State_Bool_Exp>>;
  _not?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
  _or?: InputMaybe<Array<Submit_Fix_Request_State_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "submit_fix_request_state" */
export enum Submit_Fix_Request_State_Constraint {
  /** unique or primary key constraint on columns "value" */
  SubmitFixRequestStatePkey = 'submit_fix_request_state_pkey'
}

export enum Submit_Fix_Request_State_Enum {
  /** The submit fix request was sent to the scm agent and the scm agent returned an error */
  Error = 'Error',
  /** The submit fix request was created and sent to the scm agent */
  Requested = 'Requested',
  /** The submit fix request was completed successfully */
  Succeeded = 'Succeeded',
  /** The submit fix request was sent to the scm agent but a response was never returned */
  TimedOut = 'TimedOut'
}

/** Boolean expression to compare columns of type "submit_fix_request_state_enum". All fields are combined with logical 'AND'. */
export type Submit_Fix_Request_State_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Submit_Fix_Request_State_Enum>;
  _in?: InputMaybe<Array<Submit_Fix_Request_State_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Submit_Fix_Request_State_Enum>;
  _nin?: InputMaybe<Array<Submit_Fix_Request_State_Enum>>;
};

/** input type for inserting data into table "submit_fix_request_state" */
export type Submit_Fix_Request_State_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Submit_Fix_Request_State_Max_Fields = {
  __typename?: 'submit_fix_request_state_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Submit_Fix_Request_State_Min_Fields = {
  __typename?: 'submit_fix_request_state_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "submit_fix_request_state" */
export type Submit_Fix_Request_State_Mutation_Response = {
  __typename?: 'submit_fix_request_state_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Submit_Fix_Request_State>;
};

/** on_conflict condition type for table "submit_fix_request_state" */
export type Submit_Fix_Request_State_On_Conflict = {
  constraint: Submit_Fix_Request_State_Constraint;
  update_columns?: Array<Submit_Fix_Request_State_Update_Column>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};

/** Ordering options when selecting data from "submit_fix_request_state". */
export type Submit_Fix_Request_State_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: submit_fix_request_state */
export type Submit_Fix_Request_State_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "submit_fix_request_state" */
export enum Submit_Fix_Request_State_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "submit_fix_request_state" */
export type Submit_Fix_Request_State_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "submit_fix_request_state" */
export type Submit_Fix_Request_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Submit_Fix_Request_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Submit_Fix_Request_State_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "submit_fix_request_state" */
export enum Submit_Fix_Request_State_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Submit_Fix_Request_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Submit_Fix_Request_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Submit_Fix_Request_State_Bool_Exp;
};

/** Streaming cursor of the table "submit_fix_request" */
export type Submit_Fix_Request_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Submit_Fix_Request_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Submit_Fix_Request_Stream_Cursor_Value_Input = {
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  createdOn?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  fixReportId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  state?: InputMaybe<Submit_Fix_Request_State_Enum>;
  targetBranchName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Submit_Fix_Request_Scm_Type_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "submit_fix_request" */
export enum Submit_Fix_Request_Update_Column {
  /** column name */
  CreatedByUserId = 'createdByUserId',
  /** column name */
  CreatedOn = 'createdOn',
  /** column name */
  Description = 'description',
  /** column name */
  Error = 'error',
  /** column name */
  FixReportId = 'fixReportId',
  /** column name */
  Id = 'id',
  /** column name */
  State = 'state',
  /** column name */
  TargetBranchName = 'targetBranchName',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Submit_Fix_Request_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Submit_Fix_Request_Set_Input>;
  /** filter the rows which have to be updated */
  where: Submit_Fix_Request_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "aggregated_fix_state" */
  aggregated_fix_state: Array<Aggregated_Fix_State>;
  /** fetch aggregated fields from the table: "aggregated_fix_state" */
  aggregated_fix_state_aggregate: Aggregated_Fix_State_Aggregate;
  /** fetch data from the table in a streaming manner: "aggregated_fix_state" */
  aggregated_fix_state_stream: Array<Aggregated_Fix_State>;
  /** fetch data from the table: "aggregated_severities" */
  aggregated_severities: Array<Aggregated_Severities>;
  /** fetch aggregated fields from the table: "aggregated_severities" */
  aggregated_severities_aggregate: Aggregated_Severities_Aggregate;
  /** fetch data from the table in a streaming manner: "aggregated_severities" */
  aggregated_severities_stream: Array<Aggregated_Severities>;
  /** fetch data from the table: "api_token" */
  api_token: Array<Api_Token>;
  /** fetch aggregated fields from the table: "api_token" */
  api_token_aggregate: Api_Token_Aggregate;
  /** fetch data from the table: "api_token" using primary key columns */
  api_token_by_pk?: Maybe<Api_Token>;
  /** fetch data from the table in a streaming manner: "api_token" */
  api_token_stream: Array<Api_Token>;
  /** fetch data from the table: "broker_host" */
  broker_host: Array<Broker_Host>;
  /** fetch aggregated fields from the table: "broker_host" */
  broker_host_aggregate: Broker_Host_Aggregate;
  /** fetch data from the table: "broker_host" using primary key columns */
  broker_host_by_pk?: Maybe<Broker_Host>;
  /** fetch data from the table in a streaming manner: "broker_host" */
  broker_host_stream: Array<Broker_Host>;
  /** fetch data from the table: "broker_token" */
  broker_token: Array<Broker_Token>;
  /** fetch aggregated fields from the table: "broker_token" */
  broker_token_aggregate: Broker_Token_Aggregate;
  /** fetch data from the table: "broker_token" using primary key columns */
  broker_token_by_pk?: Maybe<Broker_Token>;
  /** fetch data from the table in a streaming manner: "broker_token" */
  broker_token_stream: Array<Broker_Token>;
  /** fetch data from the table: "cli_login" */
  cli_login: Array<Cli_Login>;
  /** fetch aggregated fields from the table: "cli_login" */
  cli_login_aggregate: Cli_Login_Aggregate;
  /** fetch data from the table: "cli_login" using primary key columns */
  cli_login_by_pk?: Maybe<Cli_Login>;
  /** fetch data from the table in a streaming manner: "cli_login" */
  cli_login_stream: Array<Cli_Login>;
  /** fetch data from the table: "effort_to_apply_fix" */
  effort_to_apply_fix: Array<Effort_To_Apply_Fix>;
  /** fetch aggregated fields from the table: "effort_to_apply_fix" */
  effort_to_apply_fix_aggregate: Effort_To_Apply_Fix_Aggregate;
  /** fetch data from the table: "effort_to_apply_fix" using primary key columns */
  effort_to_apply_fix_by_pk?: Maybe<Effort_To_Apply_Fix>;
  /** fetch data from the table in a streaming manner: "effort_to_apply_fix" */
  effort_to_apply_fix_stream: Array<Effort_To_Apply_Fix>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch aggregated fields from the table: "file" */
  file_aggregate: File_Aggregate;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table in a streaming manner: "file" */
  file_stream: Array<File>;
  /** fetch data from the table: "fix" */
  fix: Array<Fix>;
  /** fetch data from the table: "fix_answer" */
  fixAnswer: Array<FixAnswer>;
  /** fetch aggregated fields from the table: "fix_answer" */
  fixAnswer_aggregate: FixAnswer_Aggregate;
  /** fetch data from the table: "fix_answer" using primary key columns */
  fixAnswer_by_pk?: Maybe<FixAnswer>;
  /** fetch data from the table in a streaming manner: "fix_answer" */
  fixAnswer_stream: Array<FixAnswer>;
  /** fetch data from the table: "fix_file" */
  fixFile: Array<FixFile>;
  /** fetch aggregated fields from the table: "fix_file" */
  fixFile_aggregate: FixFile_Aggregate;
  /** fetch data from the table: "fix_file" using primary key columns */
  fixFile_by_pk?: Maybe<FixFile>;
  /** fetch data from the table in a streaming manner: "fix_file" */
  fixFile_stream: Array<FixFile>;
  /** fetch data from the table: "fix_report" */
  fixReport: Array<FixReport>;
  /** fetch aggregated fields from the table: "fix_report" */
  fixReport_aggregate: FixReport_Aggregate;
  /** fetch data from the table: "fix_report" using primary key columns */
  fixReport_by_pk?: Maybe<FixReport>;
  /** fetch data from the table in a streaming manner: "fix_report" */
  fixReport_stream: Array<FixReport>;
  /** fetch aggregated fields from the table: "fix" */
  fix_aggregate: Fix_Aggregate;
  /** fetch data from the table: "fix" using primary key columns */
  fix_by_pk?: Maybe<Fix>;
  /** fetch data from the table: "fix_rating" */
  fix_rating: Array<Fix_Rating>;
  /** fetch aggregated fields from the table: "fix_rating" */
  fix_rating_aggregate: Fix_Rating_Aggregate;
  /** fetch data from the table: "fix_rating" using primary key columns */
  fix_rating_by_pk?: Maybe<Fix_Rating>;
  /** fetch data from the table in a streaming manner: "fix_rating" */
  fix_rating_stream: Array<Fix_Rating>;
  /** fetch data from the table: "fix_rating_tag" */
  fix_rating_tag: Array<Fix_Rating_Tag>;
  /** fetch aggregated fields from the table: "fix_rating_tag" */
  fix_rating_tag_aggregate: Fix_Rating_Tag_Aggregate;
  /** fetch data from the table: "fix_rating_tag" using primary key columns */
  fix_rating_tag_by_pk?: Maybe<Fix_Rating_Tag>;
  /** fetch data from the table in a streaming manner: "fix_rating_tag" */
  fix_rating_tag_stream: Array<Fix_Rating_Tag>;
  /** fetch data from the table: "fix_report_state" */
  fix_report_state: Array<Fix_Report_State>;
  /** fetch aggregated fields from the table: "fix_report_state" */
  fix_report_state_aggregate: Fix_Report_State_Aggregate;
  /** fetch data from the table: "fix_report_state" using primary key columns */
  fix_report_state_by_pk?: Maybe<Fix_Report_State>;
  /** fetch data from the table in a streaming manner: "fix_report_state" */
  fix_report_state_stream: Array<Fix_Report_State>;
  /** fetch data from the table: "fix_state" */
  fix_state: Array<Fix_State>;
  /** fetch aggregated fields from the table: "fix_state" */
  fix_state_aggregate: Fix_State_Aggregate;
  /** fetch data from the table: "fix_state" using primary key columns */
  fix_state_by_pk?: Maybe<Fix_State>;
  /** fetch data from the table in a streaming manner: "fix_state" */
  fix_state_stream: Array<Fix_State>;
  /** fetch data from the table in a streaming manner: "fix" */
  fix_stream: Array<Fix>;
  /** fetch data from the table: "fix_to_scm_submit_fix_request" */
  fix_to_scm_submit_fix_request: Array<Fix_To_Scm_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "fix_to_scm_submit_fix_request" */
  fix_to_scm_submit_fix_request_aggregate: Fix_To_Scm_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "fix_to_scm_submit_fix_request" using primary key columns */
  fix_to_scm_submit_fix_request_by_pk?: Maybe<Fix_To_Scm_Submit_Fix_Request>;
  /** fetch data from the table in a streaming manner: "fix_to_scm_submit_fix_request" */
  fix_to_scm_submit_fix_request_stream: Array<Fix_To_Scm_Submit_Fix_Request>;
  /** fetch data from the table: "fix_to_submit_fix_request" */
  fix_to_submit_fix_request: Array<Fix_To_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "fix_to_submit_fix_request" */
  fix_to_submit_fix_request_aggregate: Fix_To_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "fix_to_submit_fix_request" using primary key columns */
  fix_to_submit_fix_request_by_pk?: Maybe<Fix_To_Submit_Fix_Request>;
  /** fetch data from the table in a streaming manner: "fix_to_submit_fix_request" */
  fix_to_submit_fix_request_stream: Array<Fix_To_Submit_Fix_Request>;
  /** fetch data from the table: "integration" */
  integration: Array<Integration>;
  /** fetch aggregated fields from the table: "integration" */
  integration_aggregate: Integration_Aggregate;
  /** fetch data from the table: "integration" using primary key columns */
  integration_by_pk?: Maybe<Integration>;
  /** fetch data from the table in a streaming manner: "integration" */
  integration_stream: Array<Integration>;
  /** fetch data from the table: "integration_type" */
  integration_type: Array<Integration_Type>;
  /** fetch aggregated fields from the table: "integration_type" */
  integration_type_aggregate: Integration_Type_Aggregate;
  /** fetch data from the table: "integration_type" using primary key columns */
  integration_type_by_pk?: Maybe<Integration_Type>;
  /** fetch data from the table in a streaming manner: "integration_type" */
  integration_type_stream: Array<Integration_Type>;
  /** fetch data from the table: "invitation" */
  invitation: Array<Invitation>;
  /** fetch aggregated fields from the table: "invitation" */
  invitation_aggregate: Invitation_Aggregate;
  /** fetch data from the table: "invitation" using primary key columns */
  invitation_by_pk?: Maybe<Invitation>;
  /** fetch data from the table: "invitation_status_type" */
  invitation_status_type: Array<Invitation_Status_Type>;
  /** fetch aggregated fields from the table: "invitation_status_type" */
  invitation_status_type_aggregate: Invitation_Status_Type_Aggregate;
  /** fetch data from the table: "invitation_status_type" using primary key columns */
  invitation_status_type_by_pk?: Maybe<Invitation_Status_Type>;
  /** fetch data from the table in a streaming manner: "invitation_status_type" */
  invitation_status_type_stream: Array<Invitation_Status_Type>;
  /** fetch data from the table in a streaming manner: "invitation" */
  invitation_stream: Array<Invitation>;
  /** fetch data from the table: "invitation_to_projects" */
  invitation_to_projects: Array<Invitation_To_Projects>;
  /** fetch aggregated fields from the table: "invitation_to_projects" */
  invitation_to_projects_aggregate: Invitation_To_Projects_Aggregate;
  /** fetch data from the table: "invitation_to_projects" using primary key columns */
  invitation_to_projects_by_pk?: Maybe<Invitation_To_Projects>;
  /** fetch data from the table in a streaming manner: "invitation_to_projects" */
  invitation_to_projects_stream: Array<Invitation_To_Projects>;
  /** fetch data from the table: "issue_language" */
  issueLanguage: Array<IssueLanguage>;
  /** fetch aggregated fields from the table: "issue_language" */
  issueLanguage_aggregate: IssueLanguage_Aggregate;
  /** fetch data from the table: "issue_language" using primary key columns */
  issueLanguage_by_pk?: Maybe<IssueLanguage>;
  /** fetch data from the table in a streaming manner: "issue_language" */
  issueLanguage_stream: Array<IssueLanguage>;
  /** fetch data from the table: "issue_type" */
  issueType: Array<IssueType>;
  /** fetch aggregated fields from the table: "issue_type" */
  issueType_aggregate: IssueType_Aggregate;
  /** fetch data from the table: "issue_type" using primary key columns */
  issueType_by_pk?: Maybe<IssueType>;
  /** fetch data from the table in a streaming manner: "issue_type" */
  issueType_stream: Array<IssueType>;
  /** fetch data from the table: "on_prem_scm_oauth_config" */
  on_prem_scm_oauth_config: Array<On_Prem_Scm_Oauth_Config>;
  /** fetch aggregated fields from the table: "on_prem_scm_oauth_config" */
  on_prem_scm_oauth_config_aggregate: On_Prem_Scm_Oauth_Config_Aggregate;
  /** fetch data from the table: "on_prem_scm_oauth_config" using primary key columns */
  on_prem_scm_oauth_config_by_pk?: Maybe<On_Prem_Scm_Oauth_Config>;
  /** fetch data from the table in a streaming manner: "on_prem_scm_oauth_config" */
  on_prem_scm_oauth_config_stream: Array<On_Prem_Scm_Oauth_Config>;
  /** fetch data from the table: "organization" */
  organization: Array<Organization>;
  /** fetch aggregated fields from the table: "organization" */
  organization_aggregate: Organization_Aggregate;
  /** fetch data from the table: "organization" using primary key columns */
  organization_by_pk?: Maybe<Organization>;
  /** fetch data from the table: "organization_files_matching_settings" */
  organization_files_matching_settings: Array<Organization_Files_Matching_Settings>;
  /** fetch aggregated fields from the table: "organization_files_matching_settings" */
  organization_files_matching_settings_aggregate: Organization_Files_Matching_Settings_Aggregate;
  /** fetch data from the table: "organization_files_matching_settings" using primary key columns */
  organization_files_matching_settings_by_pk?: Maybe<Organization_Files_Matching_Settings>;
  /** fetch data from the table in a streaming manner: "organization_files_matching_settings" */
  organization_files_matching_settings_stream: Array<Organization_Files_Matching_Settings>;
  /** fetch data from the table: "organization_issue_type_settings" */
  organization_issue_type_settings: Array<Organization_Issue_Type_Settings>;
  /** fetch aggregated fields from the table: "organization_issue_type_settings" */
  organization_issue_type_settings_aggregate: Organization_Issue_Type_Settings_Aggregate;
  /** fetch data from the table: "organization_issue_type_settings" using primary key columns */
  organization_issue_type_settings_by_pk?: Maybe<Organization_Issue_Type_Settings>;
  /** fetch data from the table in a streaming manner: "organization_issue_type_settings" */
  organization_issue_type_settings_stream: Array<Organization_Issue_Type_Settings>;
  /** fetch data from the table: "organization_role" */
  organization_role: Array<Organization_Role>;
  /** fetch aggregated fields from the table: "organization_role" */
  organization_role_aggregate: Organization_Role_Aggregate;
  /** fetch data from the table: "organization_role" using primary key columns */
  organization_role_by_pk?: Maybe<Organization_Role>;
  /** fetch data from the table in a streaming manner: "organization_role" */
  organization_role_stream: Array<Organization_Role>;
  /** fetch data from the table: "organization_role_type" */
  organization_role_type: Array<Organization_Role_Type>;
  /** fetch aggregated fields from the table: "organization_role_type" */
  organization_role_type_aggregate: Organization_Role_Type_Aggregate;
  /** fetch data from the table: "organization_role_type" using primary key columns */
  organization_role_type_by_pk?: Maybe<Organization_Role_Type>;
  /** fetch data from the table in a streaming manner: "organization_role_type" */
  organization_role_type_stream: Array<Organization_Role_Type>;
  /** fetch data from the table in a streaming manner: "organization" */
  organization_stream: Array<Organization>;
  /** fetch data from the table: "organization_to_organization_role" */
  organization_to_organization_role: Array<Organization_To_Organization_Role>;
  /** fetch aggregated fields from the table: "organization_to_organization_role" */
  organization_to_organization_role_aggregate: Organization_To_Organization_Role_Aggregate;
  /** fetch data from the table: "organization_to_organization_role" using primary key columns */
  organization_to_organization_role_by_pk?: Maybe<Organization_To_Organization_Role>;
  /** fetch data from the table in a streaming manner: "organization_to_organization_role" */
  organization_to_organization_role_stream: Array<Organization_To_Organization_Role>;
  /** fetch data from the table: "organization_to_user" */
  organization_to_user: Array<Organization_To_User>;
  /** fetch aggregated fields from the table: "organization_to_user" */
  organization_to_user_aggregate: Organization_To_User_Aggregate;
  /** fetch data from the table: "organization_to_user" using primary key columns */
  organization_to_user_by_pk?: Maybe<Organization_To_User>;
  /** fetch data from the table in a streaming manner: "organization_to_user" */
  organization_to_user_stream: Array<Organization_To_User>;
  /** fetch data from the table: "project" */
  project: Array<Project>;
  /** fetch aggregated fields from the table: "project" */
  project_aggregate: Project_Aggregate;
  /** fetch data from the table: "project" using primary key columns */
  project_by_pk?: Maybe<Project>;
  /** fetch data from the table: "project_issue_type_settings" */
  project_issue_type_settings: Array<Project_Issue_Type_Settings>;
  /** fetch aggregated fields from the table: "project_issue_type_settings" */
  project_issue_type_settings_aggregate: Project_Issue_Type_Settings_Aggregate;
  /** fetch data from the table: "project_issue_type_settings" using primary key columns */
  project_issue_type_settings_by_pk?: Maybe<Project_Issue_Type_Settings>;
  /** fetch data from the table in a streaming manner: "project_issue_type_settings" */
  project_issue_type_settings_stream: Array<Project_Issue_Type_Settings>;
  /** fetch data from the table: "project_role" */
  project_role: Array<Project_Role>;
  /** fetch aggregated fields from the table: "project_role" */
  project_role_aggregate: Project_Role_Aggregate;
  /** fetch data from the table: "project_role" using primary key columns */
  project_role_by_pk?: Maybe<Project_Role>;
  /** fetch data from the table in a streaming manner: "project_role" */
  project_role_stream: Array<Project_Role>;
  /** fetch data from the table: "project_role_type" */
  project_role_type: Array<Project_Role_Type>;
  /** fetch aggregated fields from the table: "project_role_type" */
  project_role_type_aggregate: Project_Role_Type_Aggregate;
  /** fetch data from the table: "project_role_type" using primary key columns */
  project_role_type_by_pk?: Maybe<Project_Role_Type>;
  /** fetch data from the table in a streaming manner: "project_role_type" */
  project_role_type_stream: Array<Project_Role_Type>;
  /** fetch data from the table in a streaming manner: "project" */
  project_stream: Array<Project>;
  /** fetch data from the table: "project_to_project_role" */
  project_to_project_role: Array<Project_To_Project_Role>;
  /** fetch aggregated fields from the table: "project_to_project_role" */
  project_to_project_role_aggregate: Project_To_Project_Role_Aggregate;
  /** fetch data from the table: "project_to_project_role" using primary key columns */
  project_to_project_role_by_pk?: Maybe<Project_To_Project_Role>;
  /** fetch data from the table in a streaming manner: "project_to_project_role" */
  project_to_project_role_stream: Array<Project_To_Project_Role>;
  /** fetch data from the table: "project_to_user" */
  project_to_user: Array<Project_To_User>;
  /** fetch aggregated fields from the table: "project_to_user" */
  project_to_user_aggregate: Project_To_User_Aggregate;
  /** fetch data from the table: "project_to_user" using primary key columns */
  project_to_user_by_pk?: Maybe<Project_To_User>;
  /** fetch data from the table in a streaming manner: "project_to_user" */
  project_to_user_stream: Array<Project_To_User>;
  /** fetch data from the table: "repo" */
  repo: Array<Repo>;
  /** fetch aggregated fields from the table: "repo" */
  repo_aggregate: Repo_Aggregate;
  /** fetch data from the table: "repo" using primary key columns */
  repo_by_pk?: Maybe<Repo>;
  /** fetch data from the table in a streaming manner: "repo" */
  repo_stream: Array<Repo>;
  /** fetch data from the table: "scan_source" */
  scan_source: Array<Scan_Source>;
  /** fetch aggregated fields from the table: "scan_source" */
  scan_source_aggregate: Scan_Source_Aggregate;
  /** fetch data from the table: "scan_source" using primary key columns */
  scan_source_by_pk?: Maybe<Scan_Source>;
  /** fetch data from the table in a streaming manner: "scan_source" */
  scan_source_stream: Array<Scan_Source>;
  /** fetch data from the table: "scm_config" */
  scm_config: Array<Scm_Config>;
  /** fetch aggregated fields from the table: "scm_config" */
  scm_config_aggregate: Scm_Config_Aggregate;
  /** fetch data from the table: "scm_config" using primary key columns */
  scm_config_by_pk?: Maybe<Scm_Config>;
  /** fetch data from the table in a streaming manner: "scm_config" */
  scm_config_stream: Array<Scm_Config>;
  /** fetch data from the table: "scm_submit_fix_request" */
  scm_submit_fix_request: Array<Scm_Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "scm_submit_fix_request" */
  scm_submit_fix_request_aggregate: Scm_Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "scm_submit_fix_request" using primary key columns */
  scm_submit_fix_request_by_pk?: Maybe<Scm_Submit_Fix_Request>;
  /** fetch data from the table in a streaming manner: "scm_submit_fix_request" */
  scm_submit_fix_request_stream: Array<Scm_Submit_Fix_Request>;
  /** fetch data from the table: "submit_fix_request" */
  submit_fix_request: Array<Submit_Fix_Request>;
  /** fetch aggregated fields from the table: "submit_fix_request" */
  submit_fix_request_aggregate: Submit_Fix_Request_Aggregate;
  /** fetch data from the table: "submit_fix_request" using primary key columns */
  submit_fix_request_by_pk?: Maybe<Submit_Fix_Request>;
  /** fetch data from the table: "submit_fix_request_scm_type" */
  submit_fix_request_scm_type: Array<Submit_Fix_Request_Scm_Type>;
  /** fetch aggregated fields from the table: "submit_fix_request_scm_type" */
  submit_fix_request_scm_type_aggregate: Submit_Fix_Request_Scm_Type_Aggregate;
  /** fetch data from the table: "submit_fix_request_scm_type" using primary key columns */
  submit_fix_request_scm_type_by_pk?: Maybe<Submit_Fix_Request_Scm_Type>;
  /** fetch data from the table in a streaming manner: "submit_fix_request_scm_type" */
  submit_fix_request_scm_type_stream: Array<Submit_Fix_Request_Scm_Type>;
  /** fetch data from the table: "submit_fix_request_state" */
  submit_fix_request_state: Array<Submit_Fix_Request_State>;
  /** fetch aggregated fields from the table: "submit_fix_request_state" */
  submit_fix_request_state_aggregate: Submit_Fix_Request_State_Aggregate;
  /** fetch data from the table: "submit_fix_request_state" using primary key columns */
  submit_fix_request_state_by_pk?: Maybe<Submit_Fix_Request_State>;
  /** fetch data from the table in a streaming manner: "submit_fix_request_state" */
  submit_fix_request_state_stream: Array<Submit_Fix_Request_State>;
  /** fetch data from the table in a streaming manner: "submit_fix_request" */
  submit_fix_request_stream: Array<Submit_Fix_Request>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
  /** fetch data from the table: "view_project_resolved_vulnerabilities" */
  view_project_resolved_vulnerabilities: Array<View_Project_Resolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_project_resolved_vulnerabilities" */
  view_project_resolved_vulnerabilities_aggregate: View_Project_Resolved_Vulnerabilities_Aggregate;
  /** fetch data from the table in a streaming manner: "view_project_resolved_vulnerabilities" */
  view_project_resolved_vulnerabilities_stream: Array<View_Project_Resolved_Vulnerabilities>;
  /** fetch data from the table: "view_project_total_resolved_vulnerabilities" */
  view_project_total_resolved_vulnerabilities: Array<View_Project_Total_Resolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_project_total_resolved_vulnerabilities" */
  view_project_total_resolved_vulnerabilities_aggregate: View_Project_Total_Resolved_Vulnerabilities_Aggregate;
  /** fetch data from the table in a streaming manner: "view_project_total_resolved_vulnerabilities" */
  view_project_total_resolved_vulnerabilities_stream: Array<View_Project_Total_Resolved_Vulnerabilities>;
  /** fetch data from the table: "view_project_vulnerability_severities" */
  view_project_vulnerability_severities: Array<View_Project_Vulnerability_Severities>;
  /** fetch aggregated fields from the table: "view_project_vulnerability_severities" */
  view_project_vulnerability_severities_aggregate: View_Project_Vulnerability_Severities_Aggregate;
  /** fetch data from the table in a streaming manner: "view_project_vulnerability_severities" */
  view_project_vulnerability_severities_stream: Array<View_Project_Vulnerability_Severities>;
  /** fetch data from the table: "view_total_unique_unresolved_vulnerabilities" */
  view_total_unique_unresolved_vulnerabilities: Array<View_Total_Unique_Unresolved_Vulnerabilities>;
  /** fetch aggregated fields from the table: "view_total_unique_unresolved_vulnerabilities" */
  view_total_unique_unresolved_vulnerabilities_aggregate: View_Total_Unique_Unresolved_Vulnerabilities_Aggregate;
  /** fetch data from the table in a streaming manner: "view_total_unique_unresolved_vulnerabilities" */
  view_total_unique_unresolved_vulnerabilities_stream: Array<View_Total_Unique_Unresolved_Vulnerabilities>;
  /** fetch data from the table: "vulnerability_report" */
  vulnerability_report: Array<Vulnerability_Report>;
  /** fetch aggregated fields from the table: "vulnerability_report" */
  vulnerability_report_aggregate: Vulnerability_Report_Aggregate;
  /** fetch data from the table: "vulnerability_report" using primary key columns */
  vulnerability_report_by_pk?: Maybe<Vulnerability_Report>;
  /** fetch data from the table: "vulnerability_report_issue" */
  vulnerability_report_issue: Array<Vulnerability_Report_Issue>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue" */
  vulnerability_report_issue_aggregate: Vulnerability_Report_Issue_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue" using primary key columns */
  vulnerability_report_issue_by_pk?: Maybe<Vulnerability_Report_Issue>;
  /** fetch data from the table: "vulnerability_report_issue_code_node" */
  vulnerability_report_issue_code_node: Array<Vulnerability_Report_Issue_Code_Node>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_code_node" */
  vulnerability_report_issue_code_node_aggregate: Vulnerability_Report_Issue_Code_Node_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_code_node" using primary key columns */
  vulnerability_report_issue_code_node_by_pk?: Maybe<Vulnerability_Report_Issue_Code_Node>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_issue_code_node" */
  vulnerability_report_issue_code_node_stream: Array<Vulnerability_Report_Issue_Code_Node>;
  /** fetch data from the table: "vulnerability_report_issue_state" */
  vulnerability_report_issue_state: Array<Vulnerability_Report_Issue_State>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_state" */
  vulnerability_report_issue_state_aggregate: Vulnerability_Report_Issue_State_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_state" using primary key columns */
  vulnerability_report_issue_state_by_pk?: Maybe<Vulnerability_Report_Issue_State>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_issue_state" */
  vulnerability_report_issue_state_stream: Array<Vulnerability_Report_Issue_State>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_issue" */
  vulnerability_report_issue_stream: Array<Vulnerability_Report_Issue>;
  /** fetch data from the table: "vulnerability_report_issue_tag" */
  vulnerability_report_issue_tag: Array<Vulnerability_Report_Issue_Tag>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_tag" */
  vulnerability_report_issue_tag_aggregate: Vulnerability_Report_Issue_Tag_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_tag" using primary key columns */
  vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_issue_tag" */
  vulnerability_report_issue_tag_stream: Array<Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  vulnerability_report_issue_to_vulnerability_report_issue_tag: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** fetch aggregated fields from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  vulnerability_report_issue_to_vulnerability_report_issue_tag_aggregate: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate;
  /** fetch data from the table: "vulnerability_report_issue_to_vulnerability_report_issue_tag" using primary key columns */
  vulnerability_report_issue_to_vulnerability_report_issue_tag_by_pk?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
  vulnerability_report_issue_to_vulnerability_report_issue_tag_stream: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** fetch data from the table: "vulnerability_report_path" */
  vulnerability_report_path: Array<Vulnerability_Report_Path>;
  /** fetch aggregated fields from the table: "vulnerability_report_path" */
  vulnerability_report_path_aggregate: Vulnerability_Report_Path_Aggregate;
  /** fetch data from the table: "vulnerability_report_path" using primary key columns */
  vulnerability_report_path_by_pk?: Maybe<Vulnerability_Report_Path>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_path" */
  vulnerability_report_path_stream: Array<Vulnerability_Report_Path>;
  /** fetch data from the table in a streaming manner: "vulnerability_report" */
  vulnerability_report_stream: Array<Vulnerability_Report>;
  /** fetch data from the table: "vulnerability_report_vendor" */
  vulnerability_report_vendor: Array<Vulnerability_Report_Vendor>;
  /** fetch aggregated fields from the table: "vulnerability_report_vendor" */
  vulnerability_report_vendor_aggregate: Vulnerability_Report_Vendor_Aggregate;
  /** fetch data from the table: "vulnerability_report_vendor" using primary key columns */
  vulnerability_report_vendor_by_pk?: Maybe<Vulnerability_Report_Vendor>;
  /** fetch data from the table in a streaming manner: "vulnerability_report_vendor" */
  vulnerability_report_vendor_stream: Array<Vulnerability_Report_Vendor>;
  /** fetch data from the table: "vulnerability_severity" */
  vulnerability_severity: Array<Vulnerability_Severity>;
  /** fetch aggregated fields from the table: "vulnerability_severity" */
  vulnerability_severity_aggregate: Vulnerability_Severity_Aggregate;
  /** fetch data from the table: "vulnerability_severity" using primary key columns */
  vulnerability_severity_by_pk?: Maybe<Vulnerability_Severity>;
  /** fetch data from the table in a streaming manner: "vulnerability_severity" */
  vulnerability_severity_stream: Array<Vulnerability_Severity>;
};


export type Subscription_RootAggregated_Fix_StateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


export type Subscription_RootAggregated_Fix_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Fix_State_Order_By>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


export type Subscription_RootAggregated_Fix_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Aggregated_Fix_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Aggregated_Fix_State_Bool_Exp>;
};


export type Subscription_RootAggregated_SeveritiesArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


export type Subscription_RootAggregated_Severities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Aggregated_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Aggregated_Severities_Order_By>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


export type Subscription_RootAggregated_Severities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Aggregated_Severities_Stream_Cursor_Input>>;
  where?: InputMaybe<Aggregated_Severities_Bool_Exp>;
};


export type Subscription_RootApi_TokenArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


export type Subscription_RootApi_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


export type Subscription_RootApi_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootApi_Token_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Api_Token_Stream_Cursor_Input>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


export type Subscription_RootBroker_HostArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


export type Subscription_RootBroker_Host_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Host_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Host_Order_By>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


export type Subscription_RootBroker_Host_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBroker_Host_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Broker_Host_Stream_Cursor_Input>>;
  where?: InputMaybe<Broker_Host_Bool_Exp>;
};


export type Subscription_RootBroker_TokenArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


export type Subscription_RootBroker_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Broker_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Broker_Token_Order_By>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


export type Subscription_RootBroker_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBroker_Token_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Broker_Token_Stream_Cursor_Input>>;
  where?: InputMaybe<Broker_Token_Bool_Exp>;
};


export type Subscription_RootCli_LoginArgs = {
  distinct_on?: InputMaybe<Array<Cli_Login_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cli_Login_Order_By>>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};


export type Subscription_RootCli_Login_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cli_Login_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cli_Login_Order_By>>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};


export type Subscription_RootCli_Login_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootCli_Login_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cli_Login_Stream_Cursor_Input>>;
  where?: InputMaybe<Cli_Login_Bool_Exp>;
};


export type Subscription_RootEffort_To_Apply_FixArgs = {
  distinct_on?: InputMaybe<Array<Effort_To_Apply_Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Effort_To_Apply_Fix_Order_By>>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};


export type Subscription_RootEffort_To_Apply_Fix_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Effort_To_Apply_Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Effort_To_Apply_Fix_Order_By>>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};


export type Subscription_RootEffort_To_Apply_Fix_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootEffort_To_Apply_Fix_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Effort_To_Apply_Fix_Stream_Cursor_Input>>;
  where?: InputMaybe<Effort_To_Apply_Fix_Bool_Exp>;
};


export type Subscription_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFile_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<File_Stream_Cursor_Input>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFixArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


export type Subscription_RootFixAnswerArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


export type Subscription_RootFixAnswer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixAnswer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixAnswer_Order_By>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


export type Subscription_RootFixAnswer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFixAnswer_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FixAnswer_Stream_Cursor_Input>>;
  where?: InputMaybe<FixAnswer_Bool_Exp>;
};


export type Subscription_RootFixFileArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


export type Subscription_RootFixFile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixFile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixFile_Order_By>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


export type Subscription_RootFixFile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFixFile_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FixFile_Stream_Cursor_Input>>;
  where?: InputMaybe<FixFile_Bool_Exp>;
};


export type Subscription_RootFixReportArgs = {
  distinct_on?: InputMaybe<Array<FixReport_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixReport_Order_By>>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};


export type Subscription_RootFixReport_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FixReport_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FixReport_Order_By>>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};


export type Subscription_RootFixReport_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFixReport_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FixReport_Stream_Cursor_Input>>;
  where?: InputMaybe<FixReport_Bool_Exp>;
};


export type Subscription_RootFix_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Order_By>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


export type Subscription_RootFix_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFix_RatingArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


export type Subscription_RootFix_Rating_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Order_By>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


export type Subscription_RootFix_Rating_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFix_Rating_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_Rating_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_Rating_Bool_Exp>;
};


export type Subscription_RootFix_Rating_TagArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Tag_Order_By>>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};


export type Subscription_RootFix_Rating_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Rating_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Rating_Tag_Order_By>>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};


export type Subscription_RootFix_Rating_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootFix_Rating_Tag_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_Rating_Tag_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_Rating_Tag_Bool_Exp>;
};


export type Subscription_RootFix_Report_StateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Report_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Report_State_Order_By>>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};


export type Subscription_RootFix_Report_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_Report_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_Report_State_Order_By>>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};


export type Subscription_RootFix_Report_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootFix_Report_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_Report_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_Report_State_Bool_Exp>;
};


export type Subscription_RootFix_StateArgs = {
  distinct_on?: InputMaybe<Array<Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_State_Order_By>>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};


export type Subscription_RootFix_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_State_Order_By>>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};


export type Subscription_RootFix_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootFix_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_State_Bool_Exp>;
};


export type Subscription_RootFix_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_Bool_Exp>;
};


export type Subscription_RootFix_To_Scm_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootFix_To_Scm_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootFix_To_Scm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFix_To_Scm_Submit_Fix_Request_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_To_Scm_Submit_Fix_Request_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_To_Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootFix_To_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootFix_To_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fix_To_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootFix_To_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFix_To_Submit_Fix_Request_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fix_To_Submit_Fix_Request_Stream_Cursor_Input>>;
  where?: InputMaybe<Fix_To_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootIntegrationArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


export type Subscription_RootIntegration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


export type Subscription_RootIntegration_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootIntegration_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Integration_Stream_Cursor_Input>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


export type Subscription_RootIntegration_TypeArgs = {
  distinct_on?: InputMaybe<Array<Integration_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Type_Order_By>>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};


export type Subscription_RootIntegration_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integration_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Type_Order_By>>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};


export type Subscription_RootIntegration_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootIntegration_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Integration_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Integration_Type_Bool_Exp>;
};


export type Subscription_RootInvitationArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Order_By>>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};


export type Subscription_RootInvitation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Order_By>>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};


export type Subscription_RootInvitation_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootInvitation_Status_TypeArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Status_Type_Order_By>>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};


export type Subscription_RootInvitation_Status_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_Status_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_Status_Type_Order_By>>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};


export type Subscription_RootInvitation_Status_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootInvitation_Status_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Invitation_Status_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Invitation_Status_Type_Bool_Exp>;
};


export type Subscription_RootInvitation_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Invitation_Stream_Cursor_Input>>;
  where?: InputMaybe<Invitation_Bool_Exp>;
};


export type Subscription_RootInvitation_To_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


export type Subscription_RootInvitation_To_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitation_To_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Invitation_To_Projects_Order_By>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


export type Subscription_RootInvitation_To_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootInvitation_To_Projects_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Invitation_To_Projects_Stream_Cursor_Input>>;
  where?: InputMaybe<Invitation_To_Projects_Bool_Exp>;
};


export type Subscription_RootIssueLanguageArgs = {
  distinct_on?: InputMaybe<Array<IssueLanguage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueLanguage_Order_By>>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};


export type Subscription_RootIssueLanguage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IssueLanguage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueLanguage_Order_By>>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};


export type Subscription_RootIssueLanguage_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootIssueLanguage_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<IssueLanguage_Stream_Cursor_Input>>;
  where?: InputMaybe<IssueLanguage_Bool_Exp>;
};


export type Subscription_RootIssueTypeArgs = {
  distinct_on?: InputMaybe<Array<IssueType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueType_Order_By>>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};


export type Subscription_RootIssueType_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IssueType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<IssueType_Order_By>>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};


export type Subscription_RootIssueType_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootIssueType_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<IssueType_Stream_Cursor_Input>>;
  where?: InputMaybe<IssueType_Bool_Exp>;
};


export type Subscription_RootOn_Prem_Scm_Oauth_ConfigArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


export type Subscription_RootOn_Prem_Scm_Oauth_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<On_Prem_Scm_Oauth_Config_Order_By>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


export type Subscription_RootOn_Prem_Scm_Oauth_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOn_Prem_Scm_Oauth_Config_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<On_Prem_Scm_Oauth_Config_Stream_Cursor_Input>>;
  where?: InputMaybe<On_Prem_Scm_Oauth_Config_Bool_Exp>;
};


export type Subscription_RootOrganizationArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Subscription_RootOrganization_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Subscription_RootOrganization_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_Files_Matching_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_Files_Matching_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Files_Matching_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Files_Matching_Settings_Order_By>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_Files_Matching_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_Files_Matching_Settings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_Files_Matching_Settings_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_Files_Matching_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_Issue_Type_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_Issue_Type_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_Issue_Type_Settings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_Issue_Type_Settings_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootOrganization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_TypeArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Type_Order_By>>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_Role_Type_Order_By>>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootOrganization_Role_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_Role_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_Role_Type_Bool_Exp>;
};


export type Subscription_RootOrganization_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Subscription_RootOrganization_To_Organization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_To_Organization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_To_Organization_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_To_Organization_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_To_Organization_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_To_UserArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


export type Subscription_RootOrganization_To_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


export type Subscription_RootOrganization_To_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOrganization_To_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Organization_To_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


export type Subscription_RootProjectArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


export type Subscription_RootProject_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Order_By>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


export type Subscription_RootProject_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProject_Issue_Type_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootProject_Issue_Type_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Issue_Type_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Issue_Type_Settings_Order_By>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootProject_Issue_Type_Settings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProject_Issue_Type_Settings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_Issue_Type_Settings_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_Issue_Type_Settings_Bool_Exp>;
};


export type Subscription_RootProject_RoleArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Order_By>>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Order_By>>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProject_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_Role_TypeArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Type_Order_By>>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};


export type Subscription_RootProject_Role_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_Role_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_Role_Type_Order_By>>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};


export type Subscription_RootProject_Role_Type_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootProject_Role_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_Role_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_Role_Type_Bool_Exp>;
};


export type Subscription_RootProject_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_Bool_Exp>;
};


export type Subscription_RootProject_To_Project_RoleArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_To_Project_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_Project_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_Project_Role_Order_By>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_To_Project_Role_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProject_To_Project_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_To_Project_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_To_Project_Role_Bool_Exp>;
};


export type Subscription_RootProject_To_UserArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


export type Subscription_RootProject_To_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


export type Subscription_RootProject_To_User_By_PkArgs = {
  projectId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
};


export type Subscription_RootProject_To_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Project_To_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


export type Subscription_RootRepoArgs = {
  distinct_on?: InputMaybe<Array<Repo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Repo_Order_By>>;
  where?: InputMaybe<Repo_Bool_Exp>;
};


export type Subscription_RootRepo_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Repo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Repo_Order_By>>;
  where?: InputMaybe<Repo_Bool_Exp>;
};


export type Subscription_RootRepo_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRepo_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Repo_Stream_Cursor_Input>>;
  where?: InputMaybe<Repo_Bool_Exp>;
};


export type Subscription_RootScan_SourceArgs = {
  distinct_on?: InputMaybe<Array<Scan_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scan_Source_Order_By>>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};


export type Subscription_RootScan_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scan_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scan_Source_Order_By>>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};


export type Subscription_RootScan_Source_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootScan_Source_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Scan_Source_Stream_Cursor_Input>>;
  where?: InputMaybe<Scan_Source_Bool_Exp>;
};


export type Subscription_RootScm_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


export type Subscription_RootScm_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


export type Subscription_RootScm_Config_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootScm_Config_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Scm_Config_Stream_Cursor_Input>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


export type Subscription_RootScm_Submit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootScm_Submit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootScm_Submit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootScm_Submit_Fix_Request_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Scm_Submit_Fix_Request_Stream_Cursor_Input>>;
  where?: InputMaybe<Scm_Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_RequestArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootSubmit_Fix_Request_Scm_TypeArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_Scm_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_Scm_Type_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_Scm_Type_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Subscription_RootSubmit_Fix_Request_Scm_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Submit_Fix_Request_Scm_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Submit_Fix_Request_Scm_Type_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_StateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_State_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Submit_Fix_Request_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submit_Fix_Request_State_Order_By>>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootSubmit_Fix_Request_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Submit_Fix_Request_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Submit_Fix_Request_State_Bool_Exp>;
};


export type Subscription_RootSubmit_Fix_Request_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Submit_Fix_Request_Stream_Cursor_Input>>;
  where?: InputMaybe<Submit_Fix_Request_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootView_Project_Resolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Resolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Resolved_Vulnerabilities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<View_Project_Resolved_Vulnerabilities_Stream_Cursor_Input>>;
  where?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Total_Resolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Total_Resolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Total_Resolved_Vulnerabilities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Stream_Cursor_Input>>;
  where?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Project_Vulnerability_SeveritiesArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


export type Subscription_RootView_Project_Vulnerability_Severities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Project_Vulnerability_Severities_Order_By>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


export type Subscription_RootView_Project_Vulnerability_Severities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<View_Project_Vulnerability_Severities_Stream_Cursor_Input>>;
  where?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
};


export type Subscription_RootView_Total_Unique_Unresolved_VulnerabilitiesArgs = {
  distinct_on?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Total_Unique_Unresolved_Vulnerabilities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Order_By>>;
  where?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootView_Total_Unique_Unresolved_Vulnerabilities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Stream_Cursor_Input>>;
  where?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
};


export type Subscription_RootVulnerability_ReportArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVulnerability_Report_IssueArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVulnerability_Report_Issue_Code_NodeArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_Code_Node_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_Code_Node_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVulnerability_Report_Issue_Code_Node_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Issue_Code_Node_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_StateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_State_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_State_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_State_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootVulnerability_Report_Issue_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Issue_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Issue_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_TagArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_Tag_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootVulnerability_Report_Issue_Tag_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Issue_Tag_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_TagArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_PathArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Path_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Path_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Path_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Path_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Path_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Path_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVulnerability_Report_Path_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Path_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_VendorArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Vendor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Vendor_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Vendor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Vendor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Vendor_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};


export type Subscription_RootVulnerability_Report_Vendor_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootVulnerability_Report_Vendor_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Report_Vendor_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};


export type Subscription_RootVulnerability_SeverityArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Severity_Order_By>>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};


export type Subscription_RootVulnerability_Severity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Severity_Order_By>>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};


export type Subscription_RootVulnerability_Severity_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootVulnerability_Severity_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vulnerability_Severity_Stream_Cursor_Input>>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type TotalUniqueUnresolvedVulnerabilities_Project_Args = {
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

export type UnresolvedAggregatedVulnerabilitySeverities_Organization_Args = {
  min_confidence?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  /** An array relationship */
  api_tokens: Array<Api_Token>;
  /** An aggregate relationship */
  api_tokens_aggregate: Api_Token_Aggregate;
  email: Scalars['String']['output'];
  githubToken?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  impersonatedUserEmail?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  integrations: Array<Integration>;
  /** An aggregate relationship */
  integrations_aggregate: Integration_Aggregate;
  isImpersonationAllowed: Scalars['Boolean']['output'];
  isSignedUp: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  scmConfigs: Array<Scm_Config>;
  /** An aggregate relationship */
  scmConfigs_aggregate: Scm_Config_Aggregate;
  /** An array relationship */
  userOrganizationsAndUserOrganizationRoles: Array<Organization_To_User>;
  /** An aggregate relationship */
  userOrganizationsAndUserOrganizationRoles_aggregate: Organization_To_User_Aggregate;
  /** An array relationship */
  userProjectsAndProjectRoles: Array<Project_To_User>;
  /** An aggregate relationship */
  userProjectsAndProjectRoles_aggregate: Project_To_User_Aggregate;
};


/** columns and relationships of "user" */
export type UserApi_TokensArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserApi_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Api_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Token_Order_By>>;
  where?: InputMaybe<Api_Token_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Integration_Order_By>>;
  where?: InputMaybe<Integration_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserScmConfigsArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserScmConfigs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Scm_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Scm_Config_Order_By>>;
  where?: InputMaybe<Scm_Config_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUserOrganizationsAndUserOrganizationRolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUserOrganizationsAndUserOrganizationRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Organization_To_User_Order_By>>;
  where?: InputMaybe<Organization_To_User_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUserProjectsAndProjectRolesArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUserProjectsAndProjectRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  api_tokens?: InputMaybe<Api_Token_Bool_Exp>;
  api_tokens_aggregate?: InputMaybe<Api_Token_Aggregate_Bool_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  githubToken?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  impersonatedUserEmail?: InputMaybe<String_Comparison_Exp>;
  integrations?: InputMaybe<Integration_Bool_Exp>;
  integrations_aggregate?: InputMaybe<Integration_Aggregate_Bool_Exp>;
  isImpersonationAllowed?: InputMaybe<Boolean_Comparison_Exp>;
  isSignedUp?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  picture?: InputMaybe<String_Comparison_Exp>;
  scmConfigs?: InputMaybe<Scm_Config_Bool_Exp>;
  scmConfigs_aggregate?: InputMaybe<Scm_Config_Aggregate_Bool_Exp>;
  userOrganizationsAndUserOrganizationRoles?: InputMaybe<Organization_To_User_Bool_Exp>;
  userOrganizationsAndUserOrganizationRoles_aggregate?: InputMaybe<Organization_To_User_Aggregate_Bool_Exp>;
  userProjectsAndProjectRoles?: InputMaybe<Project_To_User_Bool_Exp>;
  userProjectsAndProjectRoles_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint on columns "email" */
  UserEmailKey = 'user_email_key',
  /** unique or primary key constraint on columns "id" */
  UserIdKey = 'user_id_key',
  /** unique or primary key constraint on columns "id" */
  UserPkey = 'user_pkey'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  api_tokens?: InputMaybe<Api_Token_Arr_Rel_Insert_Input>;
  email?: InputMaybe<Scalars['String']['input']>;
  githubToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  impersonatedUserEmail?: InputMaybe<Scalars['String']['input']>;
  integrations?: InputMaybe<Integration_Arr_Rel_Insert_Input>;
  isImpersonationAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isSignedUp?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  scmConfigs?: InputMaybe<Scm_Config_Arr_Rel_Insert_Input>;
  userOrganizationsAndUserOrganizationRoles?: InputMaybe<Organization_To_User_Arr_Rel_Insert_Input>;
  userProjectsAndProjectRoles?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  githubToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  impersonatedUserEmail?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  githubToken?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  impersonatedUserEmail?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  api_tokens_aggregate?: InputMaybe<Api_Token_Aggregate_Order_By>;
  email?: InputMaybe<Order_By>;
  githubToken?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  impersonatedUserEmail?: InputMaybe<Order_By>;
  integrations_aggregate?: InputMaybe<Integration_Aggregate_Order_By>;
  isImpersonationAllowed?: InputMaybe<Order_By>;
  isSignedUp?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  picture?: InputMaybe<Order_By>;
  scmConfigs_aggregate?: InputMaybe<Scm_Config_Aggregate_Order_By>;
  userOrganizationsAndUserOrganizationRoles_aggregate?: InputMaybe<Organization_To_User_Aggregate_Order_By>;
  userProjectsAndProjectRoles_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  GithubToken = 'githubToken',
  /** column name */
  Id = 'id',
  /** column name */
  ImpersonatedUserEmail = 'impersonatedUserEmail',
  /** column name */
  IsImpersonationAllowed = 'isImpersonationAllowed',
  /** column name */
  IsSignedUp = 'isSignedUp',
  /** column name */
  Name = 'name',
  /** column name */
  Picture = 'picture'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  githubToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  impersonatedUserEmail?: InputMaybe<Scalars['String']['input']>;
  isImpersonationAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isSignedUp?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  githubToken?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  impersonatedUserEmail?: InputMaybe<Scalars['String']['input']>;
  isImpersonationAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isSignedUp?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  GithubToken = 'githubToken',
  /** column name */
  Id = 'id',
  /** column name */
  ImpersonatedUserEmail = 'impersonatedUserEmail',
  /** column name */
  IsImpersonationAllowed = 'isImpersonationAllowed',
  /** column name */
  IsSignedUp = 'isSignedUp',
  /** column name */
  Name = 'name',
  /** column name */
  Picture = 'picture'
}

export type User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** columns and relationships of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities = {
  __typename?: 'view_project_resolved_vulnerabilities';
  count?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  organization?: Maybe<Organization>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  project?: Maybe<Project>;
  /** An array relationship */
  projectUsers: Array<Project_To_User>;
  /** An aggregate relationship */
  projectUsers_aggregate: Project_To_User_Aggregate;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_VulnerabilitiesProjectUsersArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_VulnerabilitiesProjectUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** aggregated selection of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Aggregate = {
  __typename?: 'view_project_resolved_vulnerabilities_aggregate';
  aggregate?: Maybe<View_Project_Resolved_Vulnerabilities_Aggregate_Fields>;
  nodes: Array<View_Project_Resolved_Vulnerabilities>;
};

export type View_Project_Resolved_Vulnerabilities_Aggregate_Bool_Exp = {
  count?: InputMaybe<View_Project_Resolved_Vulnerabilities_Aggregate_Bool_Exp_Count>;
};

export type View_Project_Resolved_Vulnerabilities_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Aggregate_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_aggregate_fields';
  avg?: Maybe<View_Project_Resolved_Vulnerabilities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<View_Project_Resolved_Vulnerabilities_Max_Fields>;
  min?: Maybe<View_Project_Resolved_Vulnerabilities_Min_Fields>;
  stddev?: Maybe<View_Project_Resolved_Vulnerabilities_Stddev_Fields>;
  stddev_pop?: Maybe<View_Project_Resolved_Vulnerabilities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<View_Project_Resolved_Vulnerabilities_Stddev_Samp_Fields>;
  sum?: Maybe<View_Project_Resolved_Vulnerabilities_Sum_Fields>;
  var_pop?: Maybe<View_Project_Resolved_Vulnerabilities_Var_Pop_Fields>;
  var_samp?: Maybe<View_Project_Resolved_Vulnerabilities_Var_Samp_Fields>;
  variance?: Maybe<View_Project_Resolved_Vulnerabilities_Variance_Fields>;
};


/** aggregate fields of "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Aggregate_Order_By = {
  avg?: InputMaybe<View_Project_Resolved_Vulnerabilities_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<View_Project_Resolved_Vulnerabilities_Max_Order_By>;
  min?: InputMaybe<View_Project_Resolved_Vulnerabilities_Min_Order_By>;
  stddev?: InputMaybe<View_Project_Resolved_Vulnerabilities_Stddev_Order_By>;
  stddev_pop?: InputMaybe<View_Project_Resolved_Vulnerabilities_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<View_Project_Resolved_Vulnerabilities_Stddev_Samp_Order_By>;
  sum?: InputMaybe<View_Project_Resolved_Vulnerabilities_Sum_Order_By>;
  var_pop?: InputMaybe<View_Project_Resolved_Vulnerabilities_Var_Pop_Order_By>;
  var_samp?: InputMaybe<View_Project_Resolved_Vulnerabilities_Var_Samp_Order_By>;
  variance?: InputMaybe<View_Project_Resolved_Vulnerabilities_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Arr_Rel_Insert_Input = {
  data: Array<View_Project_Resolved_Vulnerabilities_Insert_Input>;
};

/** aggregate avg on columns */
export type View_Project_Resolved_Vulnerabilities_Avg_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Avg_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "view_project_resolved_vulnerabilities". All fields are combined with a logical 'AND'. */
export type View_Project_Resolved_Vulnerabilities_Bool_Exp = {
  _and?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Bool_Exp>>;
  _not?: InputMaybe<View_Project_Resolved_Vulnerabilities_Bool_Exp>;
  _or?: InputMaybe<Array<View_Project_Resolved_Vulnerabilities_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectUsers?: InputMaybe<Project_To_User_Bool_Exp>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerability_severity?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Insert_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectUsers?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_severity?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type View_Project_Resolved_Vulnerabilities_Max_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Max_Order_By = {
  count?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type View_Project_Resolved_Vulnerabilities_Min_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Min_Order_By = {
  count?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "view_project_resolved_vulnerabilities". */
export type View_Project_Resolved_Vulnerabilities_Order_By = {
  count?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** select columns of table "view_project_resolved_vulnerabilities" */
export enum View_Project_Resolved_Vulnerabilities_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  VulnerabilitySeverity = 'vulnerability_severity'
}

/** aggregate stddev on columns */
export type View_Project_Resolved_Vulnerabilities_Stddev_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Stddev_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type View_Project_Resolved_Vulnerabilities_Stddev_Pop_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Stddev_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type View_Project_Resolved_Vulnerabilities_Stddev_Samp_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Stddev_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: View_Project_Resolved_Vulnerabilities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type View_Project_Resolved_Vulnerabilities_Stream_Cursor_Value_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_severity?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type View_Project_Resolved_Vulnerabilities_Sum_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Sum_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type View_Project_Resolved_Vulnerabilities_Var_Pop_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Var_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type View_Project_Resolved_Vulnerabilities_Var_Samp_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Var_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type View_Project_Resolved_Vulnerabilities_Variance_Fields = {
  __typename?: 'view_project_resolved_vulnerabilities_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "view_project_resolved_vulnerabilities" */
export type View_Project_Resolved_Vulnerabilities_Variance_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** columns and relationships of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities = {
  __typename?: 'view_project_total_resolved_vulnerabilities';
  /** An object relationship */
  organization?: Maybe<Organization>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  project?: Maybe<Project>;
  /** An array relationship */
  projectUsers: Array<Project_To_User>;
  /** An aggregate relationship */
  projectUsers_aggregate: Project_To_User_Aggregate;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_resolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};


/** columns and relationships of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_VulnerabilitiesProjectUsersArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_VulnerabilitiesProjectUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** aggregated selection of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Aggregate = {
  __typename?: 'view_project_total_resolved_vulnerabilities_aggregate';
  aggregate?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Aggregate_Fields>;
  nodes: Array<View_Project_Total_Resolved_Vulnerabilities>;
};

/** aggregate fields of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Aggregate_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_aggregate_fields';
  avg?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Max_Fields>;
  min?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Min_Fields>;
  stddev?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Stddev_Fields>;
  stddev_pop?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Stddev_Samp_Fields>;
  sum?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Sum_Fields>;
  var_pop?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Var_Pop_Fields>;
  var_samp?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Var_Samp_Fields>;
  variance?: Maybe<View_Project_Total_Resolved_Vulnerabilities_Variance_Fields>;
};


/** aggregate fields of "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Avg_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_avg_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "view_project_total_resolved_vulnerabilities". All fields are combined with a logical 'AND'. */
export type View_Project_Total_Resolved_Vulnerabilities_Bool_Exp = {
  _and?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>>;
  _not?: InputMaybe<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>;
  _or?: InputMaybe<Array<View_Project_Total_Resolved_Vulnerabilities_Bool_Exp>>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectUsers?: InputMaybe<Project_To_User_Bool_Exp>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  total_resolved_vulnerabilities?: InputMaybe<Bigint_Comparison_Exp>;
};

/** input type for inserting data into table "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Insert_Input = {
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectUsers?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  total_resolved_vulnerabilities?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Max_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_max_fields';
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_resolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Min_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_min_fields';
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_resolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** input type for inserting object relation for remote table "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Obj_Rel_Insert_Input = {
  data: View_Project_Total_Resolved_Vulnerabilities_Insert_Input;
};

/** Ordering options when selecting data from "view_project_total_resolved_vulnerabilities". */
export type View_Project_Total_Resolved_Vulnerabilities_Order_By = {
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
  project_id?: InputMaybe<Order_By>;
  total_resolved_vulnerabilities?: InputMaybe<Order_By>;
};

/** select columns of table "view_project_total_resolved_vulnerabilities" */
export enum View_Project_Total_Resolved_Vulnerabilities_Select_Column {
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  TotalResolvedVulnerabilities = 'total_resolved_vulnerabilities'
}

/** aggregate stddev on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Stddev_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_stddev_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Stddev_Pop_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_stddev_pop_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Stddev_Samp_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_stddev_samp_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "view_project_total_resolved_vulnerabilities" */
export type View_Project_Total_Resolved_Vulnerabilities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: View_Project_Total_Resolved_Vulnerabilities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type View_Project_Total_Resolved_Vulnerabilities_Stream_Cursor_Value_Input = {
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  total_resolved_vulnerabilities?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Sum_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_sum_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Var_Pop_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_var_pop_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Var_Samp_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_var_samp_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type View_Project_Total_Resolved_Vulnerabilities_Variance_Fields = {
  __typename?: 'view_project_total_resolved_vulnerabilities_variance_fields';
  total_resolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities = {
  __typename?: 'view_project_vulnerability_severities';
  count?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  organization?: Maybe<Organization>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  project?: Maybe<Project>;
  /** An array relationship */
  projectUsers: Array<Project_To_User>;
  /** An aggregate relationship */
  projectUsers_aggregate: Project_To_User_Aggregate;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_SeveritiesProjectUsersArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_SeveritiesProjectUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** aggregated selection of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Aggregate = {
  __typename?: 'view_project_vulnerability_severities_aggregate';
  aggregate?: Maybe<View_Project_Vulnerability_Severities_Aggregate_Fields>;
  nodes: Array<View_Project_Vulnerability_Severities>;
};

export type View_Project_Vulnerability_Severities_Aggregate_Bool_Exp = {
  count?: InputMaybe<View_Project_Vulnerability_Severities_Aggregate_Bool_Exp_Count>;
};

export type View_Project_Vulnerability_Severities_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Aggregate_Fields = {
  __typename?: 'view_project_vulnerability_severities_aggregate_fields';
  avg?: Maybe<View_Project_Vulnerability_Severities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<View_Project_Vulnerability_Severities_Max_Fields>;
  min?: Maybe<View_Project_Vulnerability_Severities_Min_Fields>;
  stddev?: Maybe<View_Project_Vulnerability_Severities_Stddev_Fields>;
  stddev_pop?: Maybe<View_Project_Vulnerability_Severities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<View_Project_Vulnerability_Severities_Stddev_Samp_Fields>;
  sum?: Maybe<View_Project_Vulnerability_Severities_Sum_Fields>;
  var_pop?: Maybe<View_Project_Vulnerability_Severities_Var_Pop_Fields>;
  var_samp?: Maybe<View_Project_Vulnerability_Severities_Var_Samp_Fields>;
  variance?: Maybe<View_Project_Vulnerability_Severities_Variance_Fields>;
};


/** aggregate fields of "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<View_Project_Vulnerability_Severities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Aggregate_Order_By = {
  avg?: InputMaybe<View_Project_Vulnerability_Severities_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<View_Project_Vulnerability_Severities_Max_Order_By>;
  min?: InputMaybe<View_Project_Vulnerability_Severities_Min_Order_By>;
  stddev?: InputMaybe<View_Project_Vulnerability_Severities_Stddev_Order_By>;
  stddev_pop?: InputMaybe<View_Project_Vulnerability_Severities_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<View_Project_Vulnerability_Severities_Stddev_Samp_Order_By>;
  sum?: InputMaybe<View_Project_Vulnerability_Severities_Sum_Order_By>;
  var_pop?: InputMaybe<View_Project_Vulnerability_Severities_Var_Pop_Order_By>;
  var_samp?: InputMaybe<View_Project_Vulnerability_Severities_Var_Samp_Order_By>;
  variance?: InputMaybe<View_Project_Vulnerability_Severities_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Arr_Rel_Insert_Input = {
  data: Array<View_Project_Vulnerability_Severities_Insert_Input>;
};

/** aggregate avg on columns */
export type View_Project_Vulnerability_Severities_Avg_Fields = {
  __typename?: 'view_project_vulnerability_severities_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Avg_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "view_project_vulnerability_severities". All fields are combined with a logical 'AND'. */
export type View_Project_Vulnerability_Severities_Bool_Exp = {
  _and?: InputMaybe<Array<View_Project_Vulnerability_Severities_Bool_Exp>>;
  _not?: InputMaybe<View_Project_Vulnerability_Severities_Bool_Exp>;
  _or?: InputMaybe<Array<View_Project_Vulnerability_Severities_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectUsers?: InputMaybe<Project_To_User_Bool_Exp>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerability_severity?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Insert_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectUsers?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_severity?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type View_Project_Vulnerability_Severities_Max_Fields = {
  __typename?: 'view_project_vulnerability_severities_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Max_Order_By = {
  count?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type View_Project_Vulnerability_Severities_Min_Fields = {
  __typename?: 'view_project_vulnerability_severities_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_severity?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Min_Order_By = {
  count?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "view_project_vulnerability_severities". */
export type View_Project_Vulnerability_Severities_Order_By = {
  count?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
  project_id?: InputMaybe<Order_By>;
  vulnerability_severity?: InputMaybe<Order_By>;
};

/** select columns of table "view_project_vulnerability_severities" */
export enum View_Project_Vulnerability_Severities_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  VulnerabilitySeverity = 'vulnerability_severity'
}

/** aggregate stddev on columns */
export type View_Project_Vulnerability_Severities_Stddev_Fields = {
  __typename?: 'view_project_vulnerability_severities_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Stddev_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type View_Project_Vulnerability_Severities_Stddev_Pop_Fields = {
  __typename?: 'view_project_vulnerability_severities_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Stddev_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type View_Project_Vulnerability_Severities_Stddev_Samp_Fields = {
  __typename?: 'view_project_vulnerability_severities_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Stddev_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: View_Project_Vulnerability_Severities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type View_Project_Vulnerability_Severities_Stream_Cursor_Value_Input = {
  count?: InputMaybe<Scalars['bigint']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_severity?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type View_Project_Vulnerability_Severities_Sum_Fields = {
  __typename?: 'view_project_vulnerability_severities_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Sum_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type View_Project_Vulnerability_Severities_Var_Pop_Fields = {
  __typename?: 'view_project_vulnerability_severities_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Var_Pop_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type View_Project_Vulnerability_Severities_Var_Samp_Fields = {
  __typename?: 'view_project_vulnerability_severities_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Var_Samp_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type View_Project_Vulnerability_Severities_Variance_Fields = {
  __typename?: 'view_project_vulnerability_severities_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "view_project_vulnerability_severities" */
export type View_Project_Vulnerability_Severities_Variance_Order_By = {
  count?: InputMaybe<Order_By>;
};

/** columns and relationships of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities';
  /** An object relationship */
  organization?: Maybe<Organization>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  project?: Maybe<Project>;
  /** An array relationship */
  projectUsers: Array<Project_To_User>;
  /** An aggregate relationship */
  projectUsers_aggregate: Project_To_User_Aggregate;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};


/** columns and relationships of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_VulnerabilitiesProjectUsersArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};


/** columns and relationships of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_VulnerabilitiesProjectUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Project_To_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Project_To_User_Order_By>>;
  where?: InputMaybe<Project_To_User_Bool_Exp>;
};

/** aggregated selection of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Aggregate = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_aggregate';
  aggregate?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Aggregate_Fields>;
  nodes: Array<View_Total_Unique_Unresolved_Vulnerabilities>;
};

/** aggregate fields of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Aggregate_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_aggregate_fields';
  avg?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Max_Fields>;
  min?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Min_Fields>;
  stddev?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Fields>;
  stddev_pop?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Samp_Fields>;
  sum?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Sum_Fields>;
  var_pop?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Var_Pop_Fields>;
  var_samp?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Var_Samp_Fields>;
  variance?: Maybe<View_Total_Unique_Unresolved_Vulnerabilities_Variance_Fields>;
};


/** aggregate fields of "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Avg_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_avg_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "view_total_unique_unresolved_vulnerabilities". All fields are combined with a logical 'AND'. */
export type View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp = {
  _and?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>>;
  _not?: InputMaybe<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>;
  _or?: InputMaybe<Array<View_Total_Unique_Unresolved_Vulnerabilities_Bool_Exp>>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectUsers?: InputMaybe<Project_To_User_Bool_Exp>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Bool_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  total_unique_unresolved_vulnerabilities?: InputMaybe<Bigint_Comparison_Exp>;
};

/** input type for inserting data into table "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Insert_Input = {
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectUsers?: InputMaybe<Project_To_User_Arr_Rel_Insert_Input>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  total_unique_unresolved_vulnerabilities?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Max_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_max_fields';
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Min_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_min_fields';
  organization_id?: Maybe<Scalars['uuid']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** input type for inserting object relation for remote table "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Obj_Rel_Insert_Input = {
  data: View_Total_Unique_Unresolved_Vulnerabilities_Insert_Input;
};

/** Ordering options when selecting data from "view_total_unique_unresolved_vulnerabilities". */
export type View_Total_Unique_Unresolved_Vulnerabilities_Order_By = {
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectUsers_aggregate?: InputMaybe<Project_To_User_Aggregate_Order_By>;
  project_id?: InputMaybe<Order_By>;
  total_unique_unresolved_vulnerabilities?: InputMaybe<Order_By>;
};

/** select columns of table "view_total_unique_unresolved_vulnerabilities" */
export enum View_Total_Unique_Unresolved_Vulnerabilities_Select_Column {
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  TotalUniqueUnresolvedVulnerabilities = 'total_unique_unresolved_vulnerabilities'
}

/** aggregate stddev on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_stddev_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Pop_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_stddev_pop_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Stddev_Samp_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_stddev_samp_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "view_total_unique_unresolved_vulnerabilities" */
export type View_Total_Unique_Unresolved_Vulnerabilities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: View_Total_Unique_Unresolved_Vulnerabilities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type View_Total_Unique_Unresolved_Vulnerabilities_Stream_Cursor_Value_Input = {
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  total_unique_unresolved_vulnerabilities?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Sum_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_sum_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Var_Pop_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_var_pop_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Var_Samp_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_var_samp_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type View_Total_Unique_Unresolved_Vulnerabilities_Variance_Fields = {
  __typename?: 'view_total_unique_unresolved_vulnerabilities_variance_fields';
  total_unique_unresolved_vulnerabilities?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "vulnerability_report" */
export type Vulnerability_Report = {
  __typename?: 'vulnerability_report';
  commonPathPrefix?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  file?: Maybe<File>;
  fileId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  fixReport?: Maybe<FixReport>;
  id: Scalars['uuid']['output'];
  isDeleted: Scalars['Boolean']['output'];
  issuesWithKnownLanguage?: Maybe<Scalars['Int']['output']>;
  lastIssueUpdatedAt: Scalars['timestamptz']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  project: Project;
  projectId: Scalars['uuid']['output'];
  reportSummaryUrl?: Maybe<Scalars['String']['output']>;
  scanDate?: Maybe<Scalars['timestamptz']['output']>;
  scanSource?: Maybe<Scan_Source_Enum>;
  type?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vulnerability_Report_Vendor_Enum>;
  vendorReportId?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  vulnerabilityReportIssues: Array<Vulnerability_Report_Issue>;
  /** An aggregate relationship */
  vulnerabilityReportIssues_aggregate: Vulnerability_Report_Issue_Aggregate;
};


/** columns and relationships of "vulnerability_report" */
export type Vulnerability_ReportVulnerabilityReportIssuesArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};


/** columns and relationships of "vulnerability_report" */
export type Vulnerability_ReportVulnerabilityReportIssues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};

/** aggregated selection of "vulnerability_report" */
export type Vulnerability_Report_Aggregate = {
  __typename?: 'vulnerability_report_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report>;
};

export type Vulnerability_Report_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Vulnerability_Report_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Vulnerability_Report_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Vulnerability_Report_Aggregate_Bool_Exp_Count>;
};

export type Vulnerability_Report_Aggregate_Bool_Exp_Bool_And = {
  arguments: Vulnerability_Report_Select_Column_Vulnerability_Report_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Vulnerability_Report_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Vulnerability_Report_Select_Column_Vulnerability_Report_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Vulnerability_Report_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "vulnerability_report" */
export type Vulnerability_Report_Aggregate_Fields = {
  __typename?: 'vulnerability_report_aggregate_fields';
  avg?: Maybe<Vulnerability_Report_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Min_Fields>;
  stddev?: Maybe<Vulnerability_Report_Stddev_Fields>;
  stddev_pop?: Maybe<Vulnerability_Report_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Vulnerability_Report_Stddev_Samp_Fields>;
  sum?: Maybe<Vulnerability_Report_Sum_Fields>;
  var_pop?: Maybe<Vulnerability_Report_Var_Pop_Fields>;
  var_samp?: Maybe<Vulnerability_Report_Var_Samp_Fields>;
  variance?: Maybe<Vulnerability_Report_Variance_Fields>;
};


/** aggregate fields of "vulnerability_report" */
export type Vulnerability_Report_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "vulnerability_report" */
export type Vulnerability_Report_Aggregate_Order_By = {
  avg?: InputMaybe<Vulnerability_Report_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vulnerability_Report_Max_Order_By>;
  min?: InputMaybe<Vulnerability_Report_Min_Order_By>;
  stddev?: InputMaybe<Vulnerability_Report_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Vulnerability_Report_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Vulnerability_Report_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Vulnerability_Report_Sum_Order_By>;
  var_pop?: InputMaybe<Vulnerability_Report_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Vulnerability_Report_Var_Samp_Order_By>;
  variance?: InputMaybe<Vulnerability_Report_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "vulnerability_report" */
export type Vulnerability_Report_Arr_Rel_Insert_Input = {
  data: Array<Vulnerability_Report_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_On_Conflict>;
};

/** aggregate avg on columns */
export type Vulnerability_Report_Avg_Fields = {
  __typename?: 'vulnerability_report_avg_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Avg_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "vulnerability_report". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Bool_Exp>>;
  commonPathPrefix?: InputMaybe<String_Comparison_Exp>;
  file?: InputMaybe<File_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  fixReport?: InputMaybe<FixReport_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isDeleted?: InputMaybe<Boolean_Comparison_Exp>;
  issuesWithKnownLanguage?: InputMaybe<Int_Comparison_Exp>;
  lastIssueUpdatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project?: InputMaybe<Project_Bool_Exp>;
  projectId?: InputMaybe<Uuid_Comparison_Exp>;
  reportSummaryUrl?: InputMaybe<String_Comparison_Exp>;
  scanDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  scanSource?: InputMaybe<Scan_Source_Enum_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  vendor?: InputMaybe<Vulnerability_Report_Vendor_Enum_Comparison_Exp>;
  vendorReportId?: InputMaybe<String_Comparison_Exp>;
  vulnerabilityReportIssues?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  vulnerabilityReportIssues_aggregate?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report" */
export enum Vulnerability_Report_Constraint {
  /** unique or primary key constraint on columns "id" */
  VulnerabilityReportPkey = 'vulnerability_report_pkey'
}

/** input type for incrementing numeric columns in table "vulnerability_report" */
export type Vulnerability_Report_Inc_Input = {
  issuesWithKnownLanguage?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "vulnerability_report" */
export type Vulnerability_Report_Insert_Input = {
  commonPathPrefix?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<File_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  fixReport?: InputMaybe<FixReport_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  issuesWithKnownLanguage?: InputMaybe<Scalars['Int']['input']>;
  lastIssueUpdatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Project_Obj_Rel_Insert_Input>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  reportSummaryUrl?: InputMaybe<Scalars['String']['input']>;
  scanDate?: InputMaybe<Scalars['timestamptz']['input']>;
  scanSource?: InputMaybe<Scan_Source_Enum>;
  type?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Vulnerability_Report_Vendor_Enum>;
  vendorReportId?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportIssues?: InputMaybe<Vulnerability_Report_Issue_Arr_Rel_Insert_Input>;
};

/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_Issue = {
  __typename?: 'vulnerability_report_issue';
  /** An array relationship */
  codeNodes: Array<Vulnerability_Report_Issue_Code_Node>;
  /** An aggregate relationship */
  codeNodes_aggregate: Vulnerability_Report_Issue_Code_Node_Aggregate;
  createdAt: Scalars['timestamptz']['output'];
  extraData?: Maybe<Scalars['jsonb']['output']>;
  /** An object relationship */
  fix?: Maybe<Fix>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  isSuppressed: Scalars['Boolean']['output'];
  issueLanguage: Scalars['String']['output'];
  issueType: Scalars['String']['output'];
  severity?: Maybe<Scalars['String']['output']>;
  state: Vulnerability_Report_Issue_State_Enum;
  vendorInstanceId?: Maybe<Scalars['String']['output']>;
  vendorIssueId: Scalars['String']['output'];
  /** An object relationship */
  vulnerabilityReport: Vulnerability_Report;
  vulnerabilityReportId: Scalars['uuid']['output'];
  /** An array relationship */
  vulnerabilityReportIssueTags: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
  /** An aggregate relationship */
  vulnerabilityReportIssueTags_aggregate: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate;
};


/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_IssueCodeNodesArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_IssueCodeNodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};


/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_IssueExtraDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_IssueVulnerabilityReportIssueTagsArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};


/** columns and relationships of "vulnerability_report_issue" */
export type Vulnerability_Report_IssueVulnerabilityReportIssueTags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By>>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};

/** aggregated selection of "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Aggregate = {
  __typename?: 'vulnerability_report_issue_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Issue_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Issue>;
};

export type Vulnerability_Report_Issue_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Bool_Exp_Count>;
};

export type Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_And = {
  arguments: Vulnerability_Report_Issue_Select_Column_Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Vulnerability_Report_Issue_Select_Column_Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Vulnerability_Report_Issue_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Aggregate_Fields = {
  __typename?: 'vulnerability_report_issue_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Issue_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Issue_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Issue_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vulnerability_Report_Issue_Max_Order_By>;
  min?: InputMaybe<Vulnerability_Report_Issue_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Vulnerability_Report_Issue_Append_Input = {
  extraData?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Arr_Rel_Insert_Input = {
  data: Array<Vulnerability_Report_Issue_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_On_Conflict>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_issue". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Issue_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Issue_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Issue_Bool_Exp>>;
  codeNodes?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
  codeNodes_aggregate?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Aggregate_Bool_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  extraData?: InputMaybe<Jsonb_Comparison_Exp>;
  fix?: InputMaybe<Fix_Bool_Exp>;
  fixId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isSuppressed?: InputMaybe<Boolean_Comparison_Exp>;
  issueLanguage?: InputMaybe<String_Comparison_Exp>;
  issueType?: InputMaybe<String_Comparison_Exp>;
  severity?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<Vulnerability_Report_Issue_State_Enum_Comparison_Exp>;
  vendorInstanceId?: InputMaybe<String_Comparison_Exp>;
  vendorIssueId?: InputMaybe<String_Comparison_Exp>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  vulnerabilityReportId?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerabilityReportIssueTags?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
  vulnerabilityReportIssueTags_aggregate?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Bool_Exp>;
};

/** columns and relationships of "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node = {
  __typename?: 'vulnerability_report_issue_code_node';
  endCol: Scalars['Int']['output'];
  endLine: Scalars['Int']['output'];
  endOffset: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  index: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  startCol: Scalars['Int']['output'];
  startLine: Scalars['Int']['output'];
  startOffset: Scalars['Int']['output'];
  /** An object relationship */
  vulnerabilityReportIssue: Vulnerability_Report_Issue;
  vulnerabilityReportIssueId: Scalars['uuid']['output'];
};

/** aggregated selection of "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Aggregate = {
  __typename?: 'vulnerability_report_issue_code_node_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Issue_Code_Node_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Issue_Code_Node>;
};

export type Vulnerability_Report_Issue_Code_Node_Aggregate_Bool_Exp = {
  count?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Aggregate_Bool_Exp_Count>;
};

export type Vulnerability_Report_Issue_Code_Node_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Aggregate_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_aggregate_fields';
  avg?: Maybe<Vulnerability_Report_Issue_Code_Node_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Issue_Code_Node_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Issue_Code_Node_Min_Fields>;
  stddev?: Maybe<Vulnerability_Report_Issue_Code_Node_Stddev_Fields>;
  stddev_pop?: Maybe<Vulnerability_Report_Issue_Code_Node_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Vulnerability_Report_Issue_Code_Node_Stddev_Samp_Fields>;
  sum?: Maybe<Vulnerability_Report_Issue_Code_Node_Sum_Fields>;
  var_pop?: Maybe<Vulnerability_Report_Issue_Code_Node_Var_Pop_Fields>;
  var_samp?: Maybe<Vulnerability_Report_Issue_Code_Node_Var_Samp_Fields>;
  variance?: Maybe<Vulnerability_Report_Issue_Code_Node_Variance_Fields>;
};


/** aggregate fields of "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Aggregate_Order_By = {
  avg?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Max_Order_By>;
  min?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Min_Order_By>;
  stddev?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Sum_Order_By>;
  var_pop?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Var_Samp_Order_By>;
  variance?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Arr_Rel_Insert_Input = {
  data: Array<Vulnerability_Report_Issue_Code_Node_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_Code_Node_On_Conflict>;
};

/** aggregate avg on columns */
export type Vulnerability_Report_Issue_Code_Node_Avg_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_avg_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Avg_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_issue_code_node". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Issue_Code_Node_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Bool_Exp>>;
  endCol?: InputMaybe<Int_Comparison_Exp>;
  endLine?: InputMaybe<Int_Comparison_Exp>;
  endOffset?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  index?: InputMaybe<Int_Comparison_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  startCol?: InputMaybe<Int_Comparison_Exp>;
  startLine?: InputMaybe<Int_Comparison_Exp>;
  startOffset?: InputMaybe<Int_Comparison_Exp>;
  vulnerabilityReportIssue?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
  vulnerabilityReportIssueId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_issue_code_node" */
export enum Vulnerability_Report_Issue_Code_Node_Constraint {
  /** unique or primary key constraint on columns "id" */
  VulnerabilityReportIssueCodeNodePkey = 'vulnerability_report_issue_code_node_pkey'
}

/** input type for incrementing numeric columns in table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Inc_Input = {
  endCol?: InputMaybe<Scalars['Int']['input']>;
  endLine?: InputMaybe<Scalars['Int']['input']>;
  endOffset?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  startCol?: InputMaybe<Scalars['Int']['input']>;
  startLine?: InputMaybe<Scalars['Int']['input']>;
  startOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Insert_Input = {
  endCol?: InputMaybe<Scalars['Int']['input']>;
  endLine?: InputMaybe<Scalars['Int']['input']>;
  endOffset?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  startCol?: InputMaybe<Scalars['Int']['input']>;
  startLine?: InputMaybe<Scalars['Int']['input']>;
  startOffset?: InputMaybe<Scalars['Int']['input']>;
  vulnerabilityReportIssue?: InputMaybe<Vulnerability_Report_Issue_Obj_Rel_Insert_Input>;
  vulnerabilityReportIssueId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Issue_Code_Node_Max_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_max_fields';
  endCol?: Maybe<Scalars['Int']['output']>;
  endLine?: Maybe<Scalars['Int']['output']>;
  endOffset?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  index?: Maybe<Scalars['Int']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  startCol?: Maybe<Scalars['Int']['output']>;
  startLine?: Maybe<Scalars['Int']['output']>;
  startOffset?: Maybe<Scalars['Int']['output']>;
  vulnerabilityReportIssueId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Max_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
  vulnerabilityReportIssueId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Issue_Code_Node_Min_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_min_fields';
  endCol?: Maybe<Scalars['Int']['output']>;
  endLine?: Maybe<Scalars['Int']['output']>;
  endOffset?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  index?: Maybe<Scalars['Int']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  startCol?: Maybe<Scalars['Int']['output']>;
  startLine?: Maybe<Scalars['Int']['output']>;
  startOffset?: Maybe<Scalars['Int']['output']>;
  vulnerabilityReportIssueId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Min_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
  vulnerabilityReportIssueId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Mutation_Response = {
  __typename?: 'vulnerability_report_issue_code_node_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Issue_Code_Node>;
};

/** on_conflict condition type for table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_On_Conflict = {
  constraint: Vulnerability_Report_Issue_Code_Node_Constraint;
  update_columns?: Array<Vulnerability_Report_Issue_Code_Node_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_issue_code_node". */
export type Vulnerability_Report_Issue_Code_Node_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
  vulnerabilityReportIssue?: InputMaybe<Vulnerability_Report_Issue_Order_By>;
  vulnerabilityReportIssueId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_issue_code_node */
export type Vulnerability_Report_Issue_Code_Node_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vulnerability_report_issue_code_node" */
export enum Vulnerability_Report_Issue_Code_Node_Select_Column {
  /** column name */
  EndCol = 'endCol',
  /** column name */
  EndLine = 'endLine',
  /** column name */
  EndOffset = 'endOffset',
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Path = 'path',
  /** column name */
  StartCol = 'startCol',
  /** column name */
  StartLine = 'startLine',
  /** column name */
  StartOffset = 'startOffset',
  /** column name */
  VulnerabilityReportIssueId = 'vulnerabilityReportIssueId'
}

/** input type for updating data in table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Set_Input = {
  endCol?: InputMaybe<Scalars['Int']['input']>;
  endLine?: InputMaybe<Scalars['Int']['input']>;
  endOffset?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  startCol?: InputMaybe<Scalars['Int']['input']>;
  startLine?: InputMaybe<Scalars['Int']['input']>;
  startOffset?: InputMaybe<Scalars['Int']['input']>;
  vulnerabilityReportIssueId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_stddev_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Pop_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_stddev_pop_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Pop_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Samp_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_stddev_samp_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Stddev_Samp_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Issue_Code_Node_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Issue_Code_Node_Stream_Cursor_Value_Input = {
  endCol?: InputMaybe<Scalars['Int']['input']>;
  endLine?: InputMaybe<Scalars['Int']['input']>;
  endOffset?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  startCol?: InputMaybe<Scalars['Int']['input']>;
  startLine?: InputMaybe<Scalars['Int']['input']>;
  startOffset?: InputMaybe<Scalars['Int']['input']>;
  vulnerabilityReportIssueId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Vulnerability_Report_Issue_Code_Node_Sum_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_sum_fields';
  endCol?: Maybe<Scalars['Int']['output']>;
  endLine?: Maybe<Scalars['Int']['output']>;
  endOffset?: Maybe<Scalars['Int']['output']>;
  index?: Maybe<Scalars['Int']['output']>;
  startCol?: Maybe<Scalars['Int']['output']>;
  startLine?: Maybe<Scalars['Int']['output']>;
  startOffset?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Sum_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** update columns of table "vulnerability_report_issue_code_node" */
export enum Vulnerability_Report_Issue_Code_Node_Update_Column {
  /** column name */
  EndCol = 'endCol',
  /** column name */
  EndLine = 'endLine',
  /** column name */
  EndOffset = 'endOffset',
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Path = 'path',
  /** column name */
  StartCol = 'startCol',
  /** column name */
  StartLine = 'startLine',
  /** column name */
  StartOffset = 'startOffset',
  /** column name */
  VulnerabilityReportIssueId = 'vulnerabilityReportIssueId'
}

export type Vulnerability_Report_Issue_Code_Node_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Issue_Code_Node_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Vulnerability_Report_Issue_Code_Node_Var_Pop_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_var_pop_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Var_Pop_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Vulnerability_Report_Issue_Code_Node_Var_Samp_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_var_samp_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Var_Samp_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Vulnerability_Report_Issue_Code_Node_Variance_Fields = {
  __typename?: 'vulnerability_report_issue_code_node_variance_fields';
  endCol?: Maybe<Scalars['Float']['output']>;
  endLine?: Maybe<Scalars['Float']['output']>;
  endOffset?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
  startCol?: Maybe<Scalars['Float']['output']>;
  startLine?: Maybe<Scalars['Float']['output']>;
  startOffset?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "vulnerability_report_issue_code_node" */
export type Vulnerability_Report_Issue_Code_Node_Variance_Order_By = {
  endCol?: InputMaybe<Order_By>;
  endLine?: InputMaybe<Order_By>;
  endOffset?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  startCol?: InputMaybe<Order_By>;
  startLine?: InputMaybe<Order_By>;
  startOffset?: InputMaybe<Order_By>;
};

/** unique or primary key constraints on table "vulnerability_report_issue" */
export enum Vulnerability_Report_Issue_Constraint {
  /** unique or primary key constraint on columns "id" */
  VulnerabilityReportIssuePkey = 'vulnerability_report_issue_pkey',
  /** unique or primary key constraint on columns "vulnerability_report_id", "vendor_issue_id" */
  VulnerabilityReportIssueVulnerabilityReportIdVendorIssue = 'vulnerability_report_issue_vulnerability_report_id_vendor_issue'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Vulnerability_Report_Issue_Delete_At_Path_Input = {
  extraData?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Vulnerability_Report_Issue_Delete_Elem_Input = {
  extraData?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Vulnerability_Report_Issue_Delete_Key_Input = {
  extraData?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Insert_Input = {
  codeNodes?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  extraData?: InputMaybe<Scalars['jsonb']['input']>;
  fix?: InputMaybe<Fix_Obj_Rel_Insert_Input>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<Scalars['String']['input']>;
  issueType?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Vulnerability_Report_Issue_State_Enum>;
  vendorInstanceId?: InputMaybe<Scalars['String']['input']>;
  vendorIssueId?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Obj_Rel_Insert_Input>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
  vulnerabilityReportIssueTags?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Issue_Max_Fields = {
  __typename?: 'vulnerability_report_issue_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issueLanguage?: Maybe<Scalars['String']['output']>;
  issueType?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['String']['output']>;
  vendorInstanceId?: Maybe<Scalars['String']['output']>;
  vendorIssueId?: Maybe<Scalars['String']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issueLanguage?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  severity?: InputMaybe<Order_By>;
  vendorInstanceId?: InputMaybe<Order_By>;
  vendorIssueId?: InputMaybe<Order_By>;
  vulnerabilityReportId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Issue_Min_Fields = {
  __typename?: 'vulnerability_report_issue_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fixId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issueLanguage?: Maybe<Scalars['String']['output']>;
  issueType?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['String']['output']>;
  vendorInstanceId?: Maybe<Scalars['String']['output']>;
  vendorIssueId?: Maybe<Scalars['String']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issueLanguage?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  severity?: InputMaybe<Order_By>;
  vendorInstanceId?: InputMaybe<Order_By>;
  vendorIssueId?: InputMaybe<Order_By>;
  vulnerabilityReportId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Mutation_Response = {
  __typename?: 'vulnerability_report_issue_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Issue>;
};

/** input type for inserting object relation for remote table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Obj_Rel_Insert_Input = {
  data: Vulnerability_Report_Issue_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_On_Conflict>;
};

/** on_conflict condition type for table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_On_Conflict = {
  constraint: Vulnerability_Report_Issue_Constraint;
  update_columns?: Array<Vulnerability_Report_Issue_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Issue_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_issue". */
export type Vulnerability_Report_Issue_Order_By = {
  codeNodes_aggregate?: InputMaybe<Vulnerability_Report_Issue_Code_Node_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  extraData?: InputMaybe<Order_By>;
  fix?: InputMaybe<Fix_Order_By>;
  fixId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isSuppressed?: InputMaybe<Order_By>;
  issueLanguage?: InputMaybe<Order_By>;
  issueType?: InputMaybe<Order_By>;
  severity?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  vendorInstanceId?: InputMaybe<Order_By>;
  vendorIssueId?: InputMaybe<Order_By>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Order_By>;
  vulnerabilityReportId?: InputMaybe<Order_By>;
  vulnerabilityReportIssueTags_aggregate?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Order_By>;
};

/** primary key columns input for table: vulnerability_report_issue */
export type Vulnerability_Report_Issue_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Vulnerability_Report_Issue_Prepend_Input = {
  extraData?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "vulnerability_report_issue" */
export enum Vulnerability_Report_Issue_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExtraData = 'extraData',
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  IsSuppressed = 'isSuppressed',
  /** column name */
  IssueLanguage = 'issueLanguage',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  Severity = 'severity',
  /** column name */
  State = 'state',
  /** column name */
  VendorInstanceId = 'vendorInstanceId',
  /** column name */
  VendorIssueId = 'vendorIssueId',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

/** select "vulnerability_report_issue_aggregate_bool_exp_bool_and_arguments_columns" columns of table "vulnerability_report_issue" */
export enum Vulnerability_Report_Issue_Select_Column_Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsSuppressed = 'isSuppressed'
}

/** select "vulnerability_report_issue_aggregate_bool_exp_bool_or_arguments_columns" columns of table "vulnerability_report_issue" */
export enum Vulnerability_Report_Issue_Select_Column_Vulnerability_Report_Issue_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsSuppressed = 'isSuppressed'
}

/** input type for updating data in table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  extraData?: InputMaybe<Scalars['jsonb']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<Scalars['String']['input']>;
  issueType?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Vulnerability_Report_Issue_State_Enum>;
  vendorInstanceId?: InputMaybe<Scalars['String']['input']>;
  vendorIssueId?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State = {
  __typename?: 'vulnerability_report_issue_state';
  comment?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Aggregate = {
  __typename?: 'vulnerability_report_issue_state_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Issue_State_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Issue_State>;
};

/** aggregate fields of "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Aggregate_Fields = {
  __typename?: 'vulnerability_report_issue_state_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Issue_State_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Issue_State_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Issue_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_issue_state". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Issue_State_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Issue_State_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Issue_State_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_issue_state" */
export enum Vulnerability_Report_Issue_State_Constraint {
  /** unique or primary key constraint on columns "value" */
  VulnerabilityReportIssueStatePkey = 'vulnerability_report_issue_state_pkey'
}

export enum Vulnerability_Report_Issue_State_Enum {
  /** This vulnerability was inserted to the database */
  Digested = 'Digested',
  /** Encountered an error while generating the fix */
  Error = 'Error',
  /** This vulnerability was filtered and not analyzed */
  Filtered = 'Filtered',
  /** This vulnerability was filtered due to ai quota */
  FilteredAiQuota = 'FilteredAiQuota',
  /** This vulnerability has a fix */
  Fixed = 'Fixed',
  /** This vulnerability couldn't be fixed */
  NoFix = 'NoFix',
  /** This vulnerability is about to be analyzed */
  Pending = 'Pending',
  /** We don't support this vulnerability type/language */
  Unsupported = 'Unsupported'
}

/** Boolean expression to compare columns of type "vulnerability_report_issue_state_enum". All fields are combined with logical 'AND'. */
export type Vulnerability_Report_Issue_State_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Vulnerability_Report_Issue_State_Enum>;
  _in?: InputMaybe<Array<Vulnerability_Report_Issue_State_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Vulnerability_Report_Issue_State_Enum>;
  _nin?: InputMaybe<Array<Vulnerability_Report_Issue_State_Enum>>;
};

/** input type for inserting data into table "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Issue_State_Max_Fields = {
  __typename?: 'vulnerability_report_issue_state_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Issue_State_Min_Fields = {
  __typename?: 'vulnerability_report_issue_state_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Mutation_Response = {
  __typename?: 'vulnerability_report_issue_state_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Issue_State>;
};

/** on_conflict condition type for table "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_On_Conflict = {
  constraint: Vulnerability_Report_Issue_State_Constraint;
  update_columns?: Array<Vulnerability_Report_Issue_State_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Issue_State_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_issue_state". */
export type Vulnerability_Report_Issue_State_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_issue_state */
export type Vulnerability_Report_Issue_State_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "vulnerability_report_issue_state" */
export enum Vulnerability_Report_Issue_State_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "vulnerability_report_issue_state" */
export type Vulnerability_Report_Issue_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Issue_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Issue_State_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "vulnerability_report_issue_state" */
export enum Vulnerability_Report_Issue_State_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Vulnerability_Report_Issue_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Issue_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Issue_State_Bool_Exp;
};

/** Streaming cursor of the table "vulnerability_report_issue" */
export type Vulnerability_Report_Issue_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Issue_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Issue_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  extraData?: InputMaybe<Scalars['jsonb']['input']>;
  fixId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSuppressed?: InputMaybe<Scalars['Boolean']['input']>;
  issueLanguage?: InputMaybe<Scalars['String']['input']>;
  issueType?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Vulnerability_Report_Issue_State_Enum>;
  vendorInstanceId?: InputMaybe<Scalars['String']['input']>;
  vendorIssueId?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag = {
  __typename?: 'vulnerability_report_issue_tag';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Aggregate = {
  __typename?: 'vulnerability_report_issue_tag_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Issue_Tag_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Issue_Tag>;
};

/** aggregate fields of "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Aggregate_Fields = {
  __typename?: 'vulnerability_report_issue_tag_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Issue_Tag_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Issue_Tag_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_issue_tag". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Issue_Tag_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_Tag_Constraint {
  /** unique or primary key constraint on columns "value" */
  VulnerabilityReportIssueTagPkey = 'vulnerability_report_issue_tag_pkey'
}

export enum Vulnerability_Report_Issue_Tag_Enum {
  /** Autogenerated code */
  AutogeneratedCode = 'AUTOGENERATED_CODE',
  /** Auxiliary code */
  AuxiliaryCode = 'AUXILIARY_CODE',
  /** False positive */
  FalsePositive = 'FALSE_POSITIVE',
  /** Test code */
  TestCode = 'TEST_CODE',
  /** Vendor code */
  VendorCode = 'VENDOR_CODE'
}

/** Boolean expression to compare columns of type "vulnerability_report_issue_tag_enum". All fields are combined with logical 'AND'. */
export type Vulnerability_Report_Issue_Tag_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum>;
  _in?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum>;
  _nin?: InputMaybe<Array<Vulnerability_Report_Issue_Tag_Enum>>;
};

/** input type for inserting data into table "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Issue_Tag_Max_Fields = {
  __typename?: 'vulnerability_report_issue_tag_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Issue_Tag_Min_Fields = {
  __typename?: 'vulnerability_report_issue_tag_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Mutation_Response = {
  __typename?: 'vulnerability_report_issue_tag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Issue_Tag>;
};

/** on_conflict condition type for table "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_On_Conflict = {
  constraint: Vulnerability_Report_Issue_Tag_Constraint;
  update_columns?: Array<Vulnerability_Report_Issue_Tag_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Issue_Tag_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_issue_tag". */
export type Vulnerability_Report_Issue_Tag_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_issue_tag */
export type Vulnerability_Report_Issue_Tag_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_Tag_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_Tag_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Issue_Tag_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Issue_Tag_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_Tag_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Vulnerability_Report_Issue_Tag_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Issue_Tag_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Issue_Tag_Bool_Exp;
};

/** columns and relationships of "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag';
  id: Scalars['uuid']['output'];
  vulnerability_report_issue_id: Scalars['uuid']['output'];
  vulnerability_report_issue_tag_value: Vulnerability_Report_Issue_Tag_Enum;
};

/** aggregated selection of "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
};

export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Bool_Exp = {
  count?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Bool_Exp_Count>;
};

export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Fields = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Max_Order_By>;
  min?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Min_Order_By>;
};

/** input type for inserting array relation for remote table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Arr_Rel_Insert_Input = {
  data: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_On_Conflict>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_issue_to_vulnerability_report_issue_tag". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerability_report_issue_id?: InputMaybe<Uuid_Comparison_Exp>;
  vulnerability_report_issue_tag_value?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Constraint {
  /** unique or primary key constraint on columns "id" */
  VulnerabilityReportIssueToVulnerabilityReportIssueTPkey = 'vulnerability_report_issue_to_vulnerability_report_issue_t_pkey',
  /** unique or primary key constraint on columns "vulnerability_report_issue_tag_value", "vulnerability_report_issue_id" */
  VulnerabilityReportIssueToVulnerabilityReportIssueTagVu = 'vulnerability_report_issue_to_vulnerability_report_issue_tag_vu'
}

/** input type for inserting data into table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_tag_value?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Max_Fields = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_report_issue_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  vulnerability_report_issue_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Min_Fields = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  vulnerability_report_issue_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  vulnerability_report_issue_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Mutation_Response = {
  __typename?: 'vulnerability_report_issue_to_vulnerability_report_issue_tag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag>;
};

/** on_conflict condition type for table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_On_Conflict = {
  constraint: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Constraint;
  update_columns?: Array<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_issue_to_vulnerability_report_issue_tag". */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Order_By = {
  id?: InputMaybe<Order_By>;
  vulnerability_report_issue_id?: InputMaybe<Order_By>;
  vulnerability_report_issue_tag_value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_issue_to_vulnerability_report_issue_tag */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  VulnerabilityReportIssueId = 'vulnerability_report_issue_id',
  /** column name */
  VulnerabilityReportIssueTagValue = 'vulnerability_report_issue_tag_value'
}

/** input type for updating data in table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_tag_value?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum>;
};

/** Streaming cursor of the table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_id?: InputMaybe<Scalars['uuid']['input']>;
  vulnerability_report_issue_tag_value?: InputMaybe<Vulnerability_Report_Issue_Tag_Enum>;
};

/** update columns of table "vulnerability_report_issue_to_vulnerability_report_issue_tag" */
export enum Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  VulnerabilityReportIssueId = 'vulnerability_report_issue_id',
  /** column name */
  VulnerabilityReportIssueTagValue = 'vulnerability_report_issue_tag_value'
}

export type Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Issue_To_Vulnerability_Report_Issue_Tag_Bool_Exp;
};

/** update columns of table "vulnerability_report_issue" */
export enum Vulnerability_Report_Issue_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExtraData = 'extraData',
  /** column name */
  FixId = 'fixId',
  /** column name */
  Id = 'id',
  /** column name */
  IsSuppressed = 'isSuppressed',
  /** column name */
  IssueLanguage = 'issueLanguage',
  /** column name */
  IssueType = 'issueType',
  /** column name */
  Severity = 'severity',
  /** column name */
  State = 'state',
  /** column name */
  VendorInstanceId = 'vendorInstanceId',
  /** column name */
  VendorIssueId = 'vendorIssueId',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

export type Vulnerability_Report_Issue_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Vulnerability_Report_Issue_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Vulnerability_Report_Issue_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Vulnerability_Report_Issue_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Vulnerability_Report_Issue_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Vulnerability_Report_Issue_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Issue_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Issue_Bool_Exp;
};

/** aggregate max on columns */
export type Vulnerability_Report_Max_Fields = {
  __typename?: 'vulnerability_report_max_fields';
  commonPathPrefix?: Maybe<Scalars['String']['output']>;
  fileId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issuesWithKnownLanguage?: Maybe<Scalars['Int']['output']>;
  lastIssueUpdatedAt?: Maybe<Scalars['timestamptz']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  reportSummaryUrl?: Maybe<Scalars['String']['output']>;
  scanDate?: Maybe<Scalars['timestamptz']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  vendorReportId?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Max_Order_By = {
  commonPathPrefix?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
  lastIssueUpdatedAt?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  reportSummaryUrl?: InputMaybe<Order_By>;
  scanDate?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  vendorReportId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Min_Fields = {
  __typename?: 'vulnerability_report_min_fields';
  commonPathPrefix?: Maybe<Scalars['String']['output']>;
  fileId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issuesWithKnownLanguage?: Maybe<Scalars['Int']['output']>;
  lastIssueUpdatedAt?: Maybe<Scalars['timestamptz']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['uuid']['output']>;
  reportSummaryUrl?: Maybe<Scalars['String']['output']>;
  scanDate?: Maybe<Scalars['timestamptz']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  vendorReportId?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Min_Order_By = {
  commonPathPrefix?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
  lastIssueUpdatedAt?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  projectId?: InputMaybe<Order_By>;
  reportSummaryUrl?: InputMaybe<Order_By>;
  scanDate?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  vendorReportId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "vulnerability_report" */
export type Vulnerability_Report_Mutation_Response = {
  __typename?: 'vulnerability_report_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report>;
};

/** input type for inserting object relation for remote table "vulnerability_report" */
export type Vulnerability_Report_Obj_Rel_Insert_Input = {
  data: Vulnerability_Report_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Vulnerability_Report_On_Conflict>;
};

/** on_conflict condition type for table "vulnerability_report" */
export type Vulnerability_Report_On_Conflict = {
  constraint: Vulnerability_Report_Constraint;
  update_columns?: Array<Vulnerability_Report_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report". */
export type Vulnerability_Report_Order_By = {
  commonPathPrefix?: InputMaybe<Order_By>;
  file?: InputMaybe<File_Order_By>;
  fileId?: InputMaybe<Order_By>;
  fixReport?: InputMaybe<FixReport_Order_By>;
  id?: InputMaybe<Order_By>;
  isDeleted?: InputMaybe<Order_By>;
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
  lastIssueUpdatedAt?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project?: InputMaybe<Project_Order_By>;
  projectId?: InputMaybe<Order_By>;
  reportSummaryUrl?: InputMaybe<Order_By>;
  scanDate?: InputMaybe<Order_By>;
  scanSource?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  vendor?: InputMaybe<Order_By>;
  vendorReportId?: InputMaybe<Order_By>;
  vulnerabilityReportIssues_aggregate?: InputMaybe<Vulnerability_Report_Issue_Aggregate_Order_By>;
};

/** columns and relationships of "vulnerability_report_path" */
export type Vulnerability_Report_Path = {
  __typename?: 'vulnerability_report_path';
  id: Scalars['uuid']['output'];
  path: Scalars['String']['output'];
  /** An object relationship */
  vulnerabilityReport: Vulnerability_Report;
  vulnerabilityReportId: Scalars['uuid']['output'];
};

/** aggregated selection of "vulnerability_report_path" */
export type Vulnerability_Report_Path_Aggregate = {
  __typename?: 'vulnerability_report_path_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Path_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Path>;
};

/** aggregate fields of "vulnerability_report_path" */
export type Vulnerability_Report_Path_Aggregate_Fields = {
  __typename?: 'vulnerability_report_path_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Path_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Path_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_path" */
export type Vulnerability_Report_Path_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Path_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_path". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Path_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Path_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Path_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Bool_Exp>;
  vulnerabilityReportId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_path" */
export enum Vulnerability_Report_Path_Constraint {
  /** unique or primary key constraint on columns "id" */
  VulnerabilityReportPathPkey = 'vulnerability_report_path_pkey'
}

/** input type for inserting data into table "vulnerability_report_path" */
export type Vulnerability_Report_Path_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Obj_Rel_Insert_Input>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Path_Max_Fields = {
  __typename?: 'vulnerability_report_path_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Path_Min_Fields = {
  __typename?: 'vulnerability_report_path_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  vulnerabilityReportId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "vulnerability_report_path" */
export type Vulnerability_Report_Path_Mutation_Response = {
  __typename?: 'vulnerability_report_path_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Path>;
};

/** on_conflict condition type for table "vulnerability_report_path" */
export type Vulnerability_Report_Path_On_Conflict = {
  constraint: Vulnerability_Report_Path_Constraint;
  update_columns?: Array<Vulnerability_Report_Path_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Path_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_path". */
export type Vulnerability_Report_Path_Order_By = {
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  vulnerabilityReport?: InputMaybe<Vulnerability_Report_Order_By>;
  vulnerabilityReportId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_path */
export type Vulnerability_Report_Path_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vulnerability_report_path" */
export enum Vulnerability_Report_Path_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Path = 'path',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

/** input type for updating data in table "vulnerability_report_path" */
export type Vulnerability_Report_Path_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "vulnerability_report_path" */
export type Vulnerability_Report_Path_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Path_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Path_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  vulnerabilityReportId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "vulnerability_report_path" */
export enum Vulnerability_Report_Path_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Path = 'path',
  /** column name */
  VulnerabilityReportId = 'vulnerabilityReportId'
}

export type Vulnerability_Report_Path_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Path_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Path_Bool_Exp;
};

/** primary key columns input for table: vulnerability_report */
export type Vulnerability_Report_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vulnerability_report" */
export enum Vulnerability_Report_Select_Column {
  /** column name */
  CommonPathPrefix = 'commonPathPrefix',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'isDeleted',
  /** column name */
  IssuesWithKnownLanguage = 'issuesWithKnownLanguage',
  /** column name */
  LastIssueUpdatedAt = 'lastIssueUpdatedAt',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ReportSummaryUrl = 'reportSummaryUrl',
  /** column name */
  ScanDate = 'scanDate',
  /** column name */
  ScanSource = 'scanSource',
  /** column name */
  Type = 'type',
  /** column name */
  Vendor = 'vendor',
  /** column name */
  VendorReportId = 'vendorReportId'
}

/** select "vulnerability_report_aggregate_bool_exp_bool_and_arguments_columns" columns of table "vulnerability_report" */
export enum Vulnerability_Report_Select_Column_Vulnerability_Report_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'isDeleted'
}

/** select "vulnerability_report_aggregate_bool_exp_bool_or_arguments_columns" columns of table "vulnerability_report" */
export enum Vulnerability_Report_Select_Column_Vulnerability_Report_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'isDeleted'
}

/** input type for updating data in table "vulnerability_report" */
export type Vulnerability_Report_Set_Input = {
  commonPathPrefix?: InputMaybe<Scalars['String']['input']>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  issuesWithKnownLanguage?: InputMaybe<Scalars['Int']['input']>;
  lastIssueUpdatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  reportSummaryUrl?: InputMaybe<Scalars['String']['input']>;
  scanDate?: InputMaybe<Scalars['timestamptz']['input']>;
  scanSource?: InputMaybe<Scan_Source_Enum>;
  type?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Vulnerability_Report_Vendor_Enum>;
  vendorReportId?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Vulnerability_Report_Stddev_Fields = {
  __typename?: 'vulnerability_report_stddev_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Stddev_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Vulnerability_Report_Stddev_Pop_Fields = {
  __typename?: 'vulnerability_report_stddev_pop_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Stddev_Pop_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Vulnerability_Report_Stddev_Samp_Fields = {
  __typename?: 'vulnerability_report_stddev_samp_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Stddev_Samp_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "vulnerability_report" */
export type Vulnerability_Report_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Stream_Cursor_Value_Input = {
  commonPathPrefix?: InputMaybe<Scalars['String']['input']>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  issuesWithKnownLanguage?: InputMaybe<Scalars['Int']['input']>;
  lastIssueUpdatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['uuid']['input']>;
  reportSummaryUrl?: InputMaybe<Scalars['String']['input']>;
  scanDate?: InputMaybe<Scalars['timestamptz']['input']>;
  scanSource?: InputMaybe<Scan_Source_Enum>;
  type?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Vulnerability_Report_Vendor_Enum>;
  vendorReportId?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Vulnerability_Report_Sum_Fields = {
  __typename?: 'vulnerability_report_sum_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Sum_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** update columns of table "vulnerability_report" */
export enum Vulnerability_Report_Update_Column {
  /** column name */
  CommonPathPrefix = 'commonPathPrefix',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'isDeleted',
  /** column name */
  IssuesWithKnownLanguage = 'issuesWithKnownLanguage',
  /** column name */
  LastIssueUpdatedAt = 'lastIssueUpdatedAt',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'projectId',
  /** column name */
  ReportSummaryUrl = 'reportSummaryUrl',
  /** column name */
  ScanDate = 'scanDate',
  /** column name */
  ScanSource = 'scanSource',
  /** column name */
  Type = 'type',
  /** column name */
  Vendor = 'vendor',
  /** column name */
  VendorReportId = 'vendorReportId'
}

export type Vulnerability_Report_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Vulnerability_Report_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Vulnerability_Report_Var_Pop_Fields = {
  __typename?: 'vulnerability_report_var_pop_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Var_Pop_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Vulnerability_Report_Var_Samp_Fields = {
  __typename?: 'vulnerability_report_var_samp_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Var_Samp_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Vulnerability_Report_Variance_Fields = {
  __typename?: 'vulnerability_report_variance_fields';
  issuesWithKnownLanguage?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "vulnerability_report" */
export type Vulnerability_Report_Variance_Order_By = {
  issuesWithKnownLanguage?: InputMaybe<Order_By>;
};

/** columns and relationships of "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor = {
  __typename?: 'vulnerability_report_vendor';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Aggregate = {
  __typename?: 'vulnerability_report_vendor_aggregate';
  aggregate?: Maybe<Vulnerability_Report_Vendor_Aggregate_Fields>;
  nodes: Array<Vulnerability_Report_Vendor>;
};

/** aggregate fields of "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Aggregate_Fields = {
  __typename?: 'vulnerability_report_vendor_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Report_Vendor_Max_Fields>;
  min?: Maybe<Vulnerability_Report_Vendor_Min_Fields>;
};


/** aggregate fields of "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Report_Vendor_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vulnerability_report_vendor". All fields are combined with a logical 'AND'. */
export type Vulnerability_Report_Vendor_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Report_Vendor_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Report_Vendor_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_report_vendor" */
export enum Vulnerability_Report_Vendor_Constraint {
  /** unique or primary key constraint on columns "value" */
  VulnerabilityReportVendorPkey = 'vulnerability_report_vendor_pkey'
}

export enum Vulnerability_Report_Vendor_Enum {
  /** checkmarx */
  Checkmarx = 'checkmarx',
  /** checkmarxXml */
  CheckmarxXml = 'checkmarxXml',
  /** codeql */
  Codeql = 'codeql',
  /** fortify */
  Fortify = 'fortify',
  /** semgrep */
  Semgrep = 'semgrep',
  /** snyk */
  Snyk = 'snyk',
  /** sonarqube */
  Sonarqube = 'sonarqube'
}

/** Boolean expression to compare columns of type "vulnerability_report_vendor_enum". All fields are combined with logical 'AND'. */
export type Vulnerability_Report_Vendor_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Vulnerability_Report_Vendor_Enum>;
  _in?: InputMaybe<Array<Vulnerability_Report_Vendor_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Vulnerability_Report_Vendor_Enum>;
  _nin?: InputMaybe<Array<Vulnerability_Report_Vendor_Enum>>;
};

/** input type for inserting data into table "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Report_Vendor_Max_Fields = {
  __typename?: 'vulnerability_report_vendor_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Vulnerability_Report_Vendor_Min_Fields = {
  __typename?: 'vulnerability_report_vendor_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Mutation_Response = {
  __typename?: 'vulnerability_report_vendor_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Report_Vendor>;
};

/** on_conflict condition type for table "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_On_Conflict = {
  constraint: Vulnerability_Report_Vendor_Constraint;
  update_columns?: Array<Vulnerability_Report_Vendor_Update_Column>;
  where?: InputMaybe<Vulnerability_Report_Vendor_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_report_vendor". */
export type Vulnerability_Report_Vendor_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_report_vendor */
export type Vulnerability_Report_Vendor_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "vulnerability_report_vendor" */
export enum Vulnerability_Report_Vendor_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "vulnerability_report_vendor" */
export type Vulnerability_Report_Vendor_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Report_Vendor_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Report_Vendor_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "vulnerability_report_vendor" */
export enum Vulnerability_Report_Vendor_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Vulnerability_Report_Vendor_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Report_Vendor_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Report_Vendor_Bool_Exp;
};

/** columns and relationships of "vulnerability_severity" */
export type Vulnerability_Severity = {
  __typename?: 'vulnerability_severity';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "vulnerability_severity" */
export type Vulnerability_Severity_Aggregate = {
  __typename?: 'vulnerability_severity_aggregate';
  aggregate?: Maybe<Vulnerability_Severity_Aggregate_Fields>;
  nodes: Array<Vulnerability_Severity>;
};

/** aggregate fields of "vulnerability_severity" */
export type Vulnerability_Severity_Aggregate_Fields = {
  __typename?: 'vulnerability_severity_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vulnerability_Severity_Max_Fields>;
  min?: Maybe<Vulnerability_Severity_Min_Fields>;
};


/** aggregate fields of "vulnerability_severity" */
export type Vulnerability_Severity_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vulnerability_Severity_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vulnerability_severity". All fields are combined with a logical 'AND'. */
export type Vulnerability_Severity_Bool_Exp = {
  _and?: InputMaybe<Array<Vulnerability_Severity_Bool_Exp>>;
  _not?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
  _or?: InputMaybe<Array<Vulnerability_Severity_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vulnerability_severity" */
export enum Vulnerability_Severity_Constraint {
  /** unique or primary key constraint on columns "value" */
  VulnerabilitySeverityPkey = 'vulnerability_severity_pkey'
}

export enum Vulnerability_Severity_Enum {
  /** critical */
  Critical = 'critical',
  /** high */
  High = 'high',
  /** low */
  Low = 'low',
  /** medium */
  Medium = 'medium'
}

/** Boolean expression to compare columns of type "vulnerability_severity_enum". All fields are combined with logical 'AND'. */
export type Vulnerability_Severity_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Vulnerability_Severity_Enum>;
  _in?: InputMaybe<Array<Vulnerability_Severity_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Vulnerability_Severity_Enum>;
  _nin?: InputMaybe<Array<Vulnerability_Severity_Enum>>;
};

/** input type for inserting data into table "vulnerability_severity" */
export type Vulnerability_Severity_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Vulnerability_Severity_Max_Fields = {
  __typename?: 'vulnerability_severity_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Vulnerability_Severity_Min_Fields = {
  __typename?: 'vulnerability_severity_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "vulnerability_severity" */
export type Vulnerability_Severity_Mutation_Response = {
  __typename?: 'vulnerability_severity_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vulnerability_Severity>;
};

/** on_conflict condition type for table "vulnerability_severity" */
export type Vulnerability_Severity_On_Conflict = {
  constraint: Vulnerability_Severity_Constraint;
  update_columns?: Array<Vulnerability_Severity_Update_Column>;
  where?: InputMaybe<Vulnerability_Severity_Bool_Exp>;
};

/** Ordering options when selecting data from "vulnerability_severity". */
export type Vulnerability_Severity_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vulnerability_severity */
export type Vulnerability_Severity_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "vulnerability_severity" */
export enum Vulnerability_Severity_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "vulnerability_severity" */
export type Vulnerability_Severity_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "vulnerability_severity" */
export type Vulnerability_Severity_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vulnerability_Severity_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vulnerability_Severity_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "vulnerability_severity" */
export enum Vulnerability_Severity_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Vulnerability_Severity_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vulnerability_Severity_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vulnerability_Severity_Bool_Exp;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'query_root', me?: { __typename?: 'MeResponse', id: string, email: string, userOrganizationsAndUserOrganizationRoles: Array<{ __typename?: 'OrganizationToRoleType', organization?: { __typename?: 'OrganizationType', brokerHosts: Array<{ __typename?: 'BrokerHostsType', realDomain: string, virtualDomain: string } | null> } | null } | null>, scmConfigs: Array<{ __typename?: 'ScmConfig', id: string, orgId?: string | null, refreshToken?: string | null, scmType: string, scmUrl: string, scmUsername?: string | null, token?: string | null, tokenLastUpdate?: string | null, userId?: string | null, scmOrg?: string | null, isTokenAvailable: boolean } | null> } | null };

export type GetOrgAndProjectIdQueryVariables = Exact<{
  filters?: InputMaybe<Organization_To_Organization_Role_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOrgAndProjectIdQuery = { __typename?: 'query_root', organization_to_organization_role: Array<{ __typename?: 'organization_to_organization_role', organization: { __typename?: 'organization', id: any, projects: Array<{ __typename?: 'project', id: any, name: string }> } }> };

export type GetEncryptedApiTokenQueryVariables = Exact<{
  loginId: Scalars['uuid']['input'];
}>;


export type GetEncryptedApiTokenQuery = { __typename?: 'query_root', cli_login_by_pk?: { __typename?: 'cli_login', encryptedApiToken?: string | null } | null };

export type FixReportStateQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type FixReportStateQuery = { __typename?: 'query_root', fixReport_by_pk?: { __typename?: 'fixReport', state: Fix_Report_State_Enum } | null };

export type GetVulnerabilityReportPathsQueryVariables = Exact<{
  vulnerabilityReportId: Scalars['uuid']['input'];
}>;


export type GetVulnerabilityReportPathsQuery = { __typename?: 'query_root', vulnerability_report_path: Array<{ __typename?: 'vulnerability_report_path', path: string }> };

export type GetAnalysisSubscriptionVariables = Exact<{
  analysisId: Scalars['uuid']['input'];
}>;


export type GetAnalysisSubscription = { __typename?: 'subscription_root', analysis?: { __typename?: 'fixReport', id: any, state: Fix_Report_State_Enum } | null };

export type GetAnalsyisQueryVariables = Exact<{
  analysisId: Scalars['uuid']['input'];
}>;


export type GetAnalsyisQuery = { __typename?: 'query_root', analysis?: { __typename?: 'fixReport', id: any, state: Fix_Report_State_Enum, vulnerabilityReportId: any, repo?: { __typename?: 'repo', commitSha: string, pullRequest?: number | null } | null, vulnerabilityReport: { __typename?: 'vulnerability_report', projectId: any, project: { __typename?: 'project', organizationId: any }, file?: { __typename?: 'file', signedFile?: { __typename?: 'FilePayload', url: string } | null } | null } } | null };

export type GetFixesQueryVariables = Exact<{
  filters: Fix_Bool_Exp;
}>;


export type GetFixesQuery = { __typename?: 'query_root', fixes: Array<{ __typename?: 'fix', safeIssueType?: string | null, id: any, vulnerabilitySeverity?: Vulnerability_Severity_Enum | null, safeIssueLanguage?: string | null, patchAndQuestions: { __typename: 'FixData', patch: string, patchOriginalEncodingBase64: string, questions: Array<{ __typename: 'FixQuestion', defaultValue: string, index: number, inputType: FixQuestionInputType, key: string, name: string, options: Array<string>, value?: string | null, extraContext: Array<{ __typename?: 'UnstructuredFixExtraContext', key: string, value: any }> }>, extraContext: { __typename: 'FixExtraContextResponse', fixDescription: string, extraContext: Array<{ __typename: 'UnstructuredFixExtraContext', key: string, value: any }>, manifestActionsRequired: Array<{ __typename: 'FixExtraContextManifestActionRequiredResponse', action: ManifestAction, language: Language, lib: { __typename?: 'PackageInfoResponse', name: string, version: string }, typesLib?: { __typename?: 'PackageInfoResponse', envName?: string | null, name: string, version: string } | null }> } } | { __typename: 'GetFixNoFixError' } }> };

export type GetVulByNodesMetadataQueryVariables = Exact<{
  filters?: InputMaybe<Array<Vulnerability_Report_Issue_Code_Node_Bool_Exp> | Vulnerability_Report_Issue_Code_Node_Bool_Exp>;
  vulnerabilityReportId: Scalars['uuid']['input'];
}>;


export type GetVulByNodesMetadataQuery = { __typename?: 'query_root', vulnerabilityReportIssueCodeNodes: Array<{ __typename?: 'vulnerability_report_issue_code_node', vulnerabilityReportIssueId: any, path: string, startLine: number, vulnerabilityReportIssue: { __typename?: 'vulnerability_report_issue', issueType: string, fixId?: any | null } }>, fixablePrVuls: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null }, nonFixablePrVuls: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null }, totalScanVulnerabilities: { __typename?: 'vulnerability_report_issue_aggregate', aggregate?: { __typename?: 'vulnerability_report_issue_aggregate_fields', count: number } | null } };

export type UpdateScmTokenMutationVariables = Exact<{
  scmType: Scalars['String']['input'];
  url: Scalars['String']['input'];
  token: Scalars['String']['input'];
  org?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateScmTokenMutation = { __typename?: 'mutation_root', updateScmToken?: { __typename: 'BadScmCredentials', status: Status, error?: string | null } | { __typename: 'InvalidScmTypeError', status: Status, error?: string | null } | { __typename: 'RepoUnreachableError', status: Status } | { __typename: 'ScmAccessTokenUpdateSuccess', token: string } | null };

export type UploadS3BucketInfoMutationVariables = Exact<{
  fileName: Scalars['String']['input'];
}>;


export type UploadS3BucketInfoMutation = { __typename?: 'mutation_root', uploadS3BucketInfo: { __typename?: 'UploadResponse', status: Status, error?: string | null, reportUploadInfo?: { __typename?: 'UploadResult', url: string, fixReportId: string, uploadFieldsJSON: string, uploadKey: string } | null, repoUploadInfo?: { __typename?: 'UploadResult', url: string, fixReportId: string, uploadFieldsJSON: string, uploadKey: string } | null } };

export type DigestVulnerabilityReportMutationVariables = Exact<{
  vulnerabilityReportFileName: Scalars['String']['input'];
  fixReportId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  scanSource: Scalars['String']['input'];
}>;


export type DigestVulnerabilityReportMutation = { __typename?: 'mutation_root', digestVulnerabilityReport: { __typename: 'BadShaError' } | { __typename: 'RabbitSendError', status: Status, error?: string | null } | { __typename: 'ReferenceNotFoundError', status: Status, error?: string | null } | { __typename: 'RepoValidationError' } | { __typename: 'ReportValidationError', status: Status, error?: string | null } | { __typename: 'VulnerabilityReport', vulnerabilityReportId: string, fixReportId: string } };

export type SubmitVulnerabilityReportMutationVariables = Exact<{
  fixReportId: Scalars['String']['input'];
  repoUrl: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  scanSource: Scalars['String']['input'];
  sha?: InputMaybe<Scalars['String']['input']>;
  experimentalEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  vulnerabilityReportFileName?: InputMaybe<Scalars['String']['input']>;
  pullRequest?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubmitVulnerabilityReportMutation = { __typename?: 'mutation_root', submitVulnerabilityReport: { __typename: 'BadShaError' } | { __typename: 'RabbitSendError' } | { __typename: 'ReferenceNotFoundError' } | { __typename: 'RepoValidationError' } | { __typename: 'ReportValidationError' } | { __typename: 'VulnerabilityReport', vulnerabilityReportId: string, fixReportId: string } };

export type CreateCommunityUserMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateCommunityUserMutation = { __typename?: 'mutation_root', initOrganizationAndProject?: { __typename: 'InitOrganizationAndProjectGoodResponse', projectId: string, userId: string, organizationId: string } | { __typename: 'UserAlreadyInProjectError', error?: string | null, status: Status } | { __typename: 'UserHasNoPermissionInProjectError', error?: string | null, status: Status } | null };

export type CreateCliLoginMutationVariables = Exact<{
  publicKey: Scalars['String']['input'];
}>;


export type CreateCliLoginMutation = { __typename?: 'mutation_root', insert_cli_login_one?: { __typename?: 'cli_login', id: any } | null };

export type PerformCliLoginMutationVariables = Exact<{
  loginId: Scalars['String']['input'];
}>;


export type PerformCliLoginMutation = { __typename?: 'mutation_root', performCliLogin?: { __typename?: 'StatusQueryResponse', status: Status } | null };

export type CreateProjectMutationVariables = Exact<{
  organizationId: Scalars['String']['input'];
  projectName: Scalars['String']['input'];
}>;


export type CreateProjectMutation = { __typename?: 'mutation_root', createProject: { __typename?: 'CreateProjectResponse', projectId: string } };

export type ValidateRepoUrlQueryVariables = Exact<{
  repoUrl: Scalars['String']['input'];
}>;


export type ValidateRepoUrlQuery = { __typename?: 'query_root', validateRepoUrl?: { __typename: 'BadScmCredentials', status: Status, error?: string | null, scmType?: string | null } | { __typename: 'InvalidRepoUrlError' } | { __typename: 'RepoUnreachableError', status: Status, error?: string | null, scmType?: string | null } | { __typename: 'RepoValidationSuccess', status: Status, defaultBranch: string, defaultBranchLastModified: string, defaultBranchSha: string, scmType?: string | null } | null };

export type GitReferenceQueryVariables = Exact<{
  repoUrl: Scalars['String']['input'];
  reference: Scalars['String']['input'];
}>;


export type GitReferenceQuery = { __typename?: 'query_root', gitReference?: { __typename: 'GitReferenceData', status: Status, sha: string, date: string } | { __typename: 'ReferenceNotFoundError', status: Status, error?: string | null } | { __typename: 'RepoUnreachableError' } | null };

export type AutoPrAnalysisMutationVariables = Exact<{
  analysisId: Scalars['String']['input'];
}>;


export type AutoPrAnalysisMutation = { __typename?: 'mutation_root', autoPrAnalysis?: { __typename: 'AutoPrError', status: Status, error: string } | { __typename: 'AutoPrSuccess', status: Status, appliedAutoPrIssueTypes: Array<string> } | null };


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
export const GetOrgAndProjectIdDocument = `
    query getOrgAndProjectId($filters: organization_to_organization_role_bool_exp, $limit: Int) {
  organization_to_organization_role(
    where: $filters
    order_by: {organization: {createdOn: desc}}
    limit: $limit
  ) {
    organization {
      id
      projects(order_by: {updatedAt: desc}) {
        id
        name
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
export const GetAnalysisDocument = `
    subscription getAnalysis($analysisId: uuid!) {
  analysis: fixReport_by_pk(id: $analysisId) {
    id
    state
  }
}
    `;
export const GetAnalsyisDocument = `
    query getAnalsyis($analysisId: uuid!) {
  analysis: fixReport_by_pk(id: $analysisId) {
    id
    state
    repo {
      commitSha
      pullRequest
    }
    vulnerabilityReportId
    vulnerabilityReport {
      projectId
      project {
        organizationId
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
    vulnerabilitySeverity
    safeIssueLanguage
    patchAndQuestions {
      __typename
      ... on FixData {
        patch
        patchOriginalEncodingBase64
        questions {
          defaultValue
          extraContext {
            key
            value
          }
          index
          inputType
          key
          name
          options
          value
          __typename
        }
        extraContext {
          extraContext {
            key
            value
            __typename
          }
          fixDescription
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
    query getVulByNodesMetadata($filters: [vulnerability_report_issue_code_node_bool_exp!], $vulnerabilityReportId: uuid!) {
  vulnerabilityReportIssueCodeNodes: vulnerability_report_issue_code_node(
    order_by: {index: desc}
    where: {_or: $filters, vulnerabilityReportIssue: {fixId: {_is_null: false}, vulnerabilityReportId: {_eq: $vulnerabilityReportId}}}
  ) {
    vulnerabilityReportIssueId
    path
    startLine
    vulnerabilityReportIssue {
      issueType
      fixId
    }
  }
  fixablePrVuls: vulnerability_report_issue_aggregate(
    where: {fixId: {_is_null: false}, vulnerabilityReportId: {_eq: $vulnerabilityReportId}, codeNodes: {_or: $filters}}
  ) {
    aggregate {
      count
    }
  }
  nonFixablePrVuls: vulnerability_report_issue_aggregate(
    where: {fixId: {_is_null: true}, vulnerabilityReportId: {_eq: $vulnerabilityReportId}, codeNodes: {_or: $filters}}
  ) {
    aggregate {
      count
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
export const DigestVulnerabilityReportDocument = `
    mutation DigestVulnerabilityReport($vulnerabilityReportFileName: String!, $fixReportId: String!, $projectId: String!, $scanSource: String!) {
  digestVulnerabilityReport(
    fixReportId: $fixReportId
    vulnerabilityReportFileName: $vulnerabilityReportFileName
    projectId: $projectId
    scanSource: $scanSource
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
    mutation SubmitVulnerabilityReport($fixReportId: String!, $repoUrl: String!, $reference: String!, $projectId: String!, $scanSource: String!, $sha: String, $experimentalEnabled: Boolean, $vulnerabilityReportFileName: String, $pullRequest: Int) {
  submitVulnerabilityReport(
    fixReportId: $fixReportId
    repoUrl: $repoUrl
    reference: $reference
    sha: $sha
    experimentalEnabled: $experimentalEnabled
    pullRequest: $pullRequest
    projectId: $projectId
    vulnerabilityReportFileName: $vulnerabilityReportFileName
    scanSource: $scanSource
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
    mutation autoPrAnalysis($analysisId: String!) {
  autoPrAnalysis(analysisId: $analysisId) {
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Me(variables?: MeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeQuery>(MeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Me', 'query', variables);
    },
    getOrgAndProjectId(variables?: GetOrgAndProjectIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetOrgAndProjectIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOrgAndProjectIdQuery>(GetOrgAndProjectIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOrgAndProjectId', 'query', variables);
    },
    GetEncryptedApiToken(variables: GetEncryptedApiTokenQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetEncryptedApiTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEncryptedApiTokenQuery>(GetEncryptedApiTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEncryptedApiToken', 'query', variables);
    },
    FixReportState(variables: FixReportStateQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FixReportStateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FixReportStateQuery>(FixReportStateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FixReportState', 'query', variables);
    },
    GetVulnerabilityReportPaths(variables: GetVulnerabilityReportPathsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetVulnerabilityReportPathsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVulnerabilityReportPathsQuery>(GetVulnerabilityReportPathsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetVulnerabilityReportPaths', 'query', variables);
    },
    getAnalysis(variables: GetAnalysisSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAnalysisSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAnalysisSubscription>(GetAnalysisDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAnalysis', 'subscription', variables);
    },
    getAnalsyis(variables: GetAnalsyisQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAnalsyisQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAnalsyisQuery>(GetAnalsyisDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAnalsyis', 'query', variables);
    },
    getFixes(variables: GetFixesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetFixesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFixesQuery>(GetFixesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getFixes', 'query', variables);
    },
    getVulByNodesMetadata(variables: GetVulByNodesMetadataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetVulByNodesMetadataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVulByNodesMetadataQuery>(GetVulByNodesMetadataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getVulByNodesMetadata', 'query', variables);
    },
    updateScmToken(variables: UpdateScmTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateScmTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateScmTokenMutation>(UpdateScmTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateScmToken', 'mutation', variables);
    },
    uploadS3BucketInfo(variables: UploadS3BucketInfoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UploadS3BucketInfoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadS3BucketInfoMutation>(UploadS3BucketInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'uploadS3BucketInfo', 'mutation', variables);
    },
    DigestVulnerabilityReport(variables: DigestVulnerabilityReportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DigestVulnerabilityReportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DigestVulnerabilityReportMutation>(DigestVulnerabilityReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DigestVulnerabilityReport', 'mutation', variables);
    },
    SubmitVulnerabilityReport(variables: SubmitVulnerabilityReportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SubmitVulnerabilityReportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmitVulnerabilityReportMutation>(SubmitVulnerabilityReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SubmitVulnerabilityReport', 'mutation', variables);
    },
    CreateCommunityUser(variables?: CreateCommunityUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCommunityUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCommunityUserMutation>(CreateCommunityUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCommunityUser', 'mutation', variables);
    },
    CreateCliLogin(variables: CreateCliLoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCliLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCliLoginMutation>(CreateCliLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCliLogin', 'mutation', variables);
    },
    performCliLogin(variables: PerformCliLoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PerformCliLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PerformCliLoginMutation>(PerformCliLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'performCliLogin', 'mutation', variables);
    },
    CreateProject(variables: CreateProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProjectMutation>(CreateProjectDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateProject', 'mutation', variables);
    },
    validateRepoUrl(variables: ValidateRepoUrlQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ValidateRepoUrlQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateRepoUrlQuery>(ValidateRepoUrlDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'validateRepoUrl', 'query', variables);
    },
    gitReference(variables: GitReferenceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GitReferenceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GitReferenceQuery>(GitReferenceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'gitReference', 'query', variables);
    },
    autoPrAnalysis(variables: AutoPrAnalysisMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AutoPrAnalysisMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AutoPrAnalysisMutation>(AutoPrAnalysisDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'autoPrAnalysis', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;