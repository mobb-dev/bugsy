import * as api from 'azure-devops-node-api';
import { ReferenceType, ScmRepoInfo } from './scm';
export declare enum AdoTokenTypeEnum {
    PAT = "PAT",
    OAUTH = "OAUTH"
}
export declare function getAdoTokenType(token: string): AdoTokenTypeEnum;
export declare function getAdoApiClient({ accessToken, tokenOrg, orgName, }: {
    accessToken: string | undefined;
    tokenOrg: string | undefined;
    orgName: string;
}): Promise<api.WebApi>;
export declare function adoValidateParams({ url, accessToken, tokenOrg, }: {
    url: string | undefined;
    accessToken: string | undefined;
    tokenOrg: string | undefined;
}): Promise<void>;
export declare function getAdoIsUserCollaborator({ accessToken, tokenOrg, repoUrl, }: {
    accessToken: string;
    tokenOrg: string | undefined;
    repoUrl: string;
}): Promise<boolean>;
export declare enum AdoPullRequestStatusEnum {
    completed = "completed",
    active = "active",
    all = "all",
    abandoned = "abandoned"
}
export declare const adoStatusNumberToEnumMap: {
    1: AdoPullRequestStatusEnum;
    2: AdoPullRequestStatusEnum;
    3: AdoPullRequestStatusEnum;
    4: AdoPullRequestStatusEnum;
};
export declare function getAdoPullRequestStatus({ accessToken, tokenOrg, repoUrl, prNumber, }: {
    accessToken: string;
    tokenOrg: string | undefined;
    repoUrl: string;
    prNumber: number;
}): Promise<AdoPullRequestStatusEnum>;
export declare function getAdoIsRemoteBranch({ accessToken, tokenOrg, repoUrl, branch, }: {
    accessToken: string;
    tokenOrg: string | undefined;
    repoUrl: string;
    branch: string;
}): Promise<boolean>;
export declare function getAdoRepoList({ orgName, tokenOrg, accessToken, }: {
    orgName: string | undefined;
    tokenOrg: string | undefined;
    accessToken: string;
}): Promise<ScmRepoInfo[]>;
export declare function getAdoPrUrl({ url, prNumber, }: {
    url: string;
    prNumber: number;
}): string;
export declare function getAdoDownloadUrl({ repoUrl, branch, }: {
    repoUrl: string;
    branch: string;
}): string;
export declare function getAdoBranchList({ accessToken, tokenOrg, repoUrl, }: {
    accessToken: string;
    tokenOrg: string | undefined;
    repoUrl: string;
}): Promise<string[]>;
export declare function createAdoPullRequest(options: {
    accessToken: string;
    tokenOrg: string | undefined;
    targetBranchName: string;
    sourceBranchName: string;
    title: string;
    body: string;
    repoUrl: string;
}): Promise<number | undefined>;
export declare function getAdoRepoDefaultBranch({ repoUrl, tokenOrg, accessToken, }: {
    repoUrl: string;
    tokenOrg: string | undefined;
    accessToken: string | undefined;
}): Promise<string>;
export declare function getAdoReferenceData({ ref, repoUrl, accessToken, tokenOrg, }: {
    ref: string;
    repoUrl: string;
    accessToken: string | undefined;
    tokenOrg: string | undefined;
}): Promise<{
    sha: string;
    type: ReferenceType;
    date: Date;
}>;
export declare function parseAdoOwnerAndRepo(adoUrl: string): {
    owner: string;
    repo: string;
    projectName: string | undefined;
    projectPath: string;
    pathElements: string[];
};
export declare function getAdoBlameRanges(): Promise<never[]>;
export declare enum AdoTokenRequestTypeEnum {
    CODE = "code",
    REFRESH_TOKEN = "refresh_token"
}
export declare function getAdoToken({ token, adoClientSecret, tokenType, redirectUri, }: {
    token: string;
    adoClientSecret: string;
    tokenType: AdoTokenRequestTypeEnum;
    redirectUri: string;
}): Promise<{
    access_token: string;
    token_type: string;
    refresh_token: string;
}>;
//# sourceMappingURL=ado.d.ts.map