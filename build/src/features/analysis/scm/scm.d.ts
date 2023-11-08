export declare function getScmLibTypeFromUrl(url: string | undefined): ScmLibScmType | undefined;
export declare function scmCanReachRepo({ repoUrl, githubToken, gitlabToken, }: {
    repoUrl: string;
    githubToken: string | undefined;
    gitlabToken: string | undefined;
}): Promise<boolean>;
export declare enum ReferenceType {
    BRANCH = "BRANCH",
    COMMIT = "COMMIT",
    TAG = "TAG"
}
export declare enum ScmSubmitRequestStatus {
    MERGED = "MERGED",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT"
}
export declare enum ScmLibScmType {
    GITHUB = "GITHUB",
    GITLAB = "GITLAB"
}
export declare type ScmRepoInfo = {
    repoName: string;
    repoUrl: string;
    repoOwner: string;
    repoLanguages: string[];
    repoIsPublic: boolean;
    repoUpdatedAt: string;
};
export declare class InvalidRepoUrlError extends Error {
    constructor(m: string);
}
export declare class InvalidAccessTokenError extends Error {
    constructor(m: string);
}
export declare class InvalidUrlPatternError extends Error {
    constructor(m: string);
}
export declare class RefNotFoundError extends Error {
    constructor(m: string);
}
export declare class RepoNoTokenAccessError extends Error {
    constructor(m: string);
}
export declare abstract class SCMLib {
    protected readonly url?: string;
    protected readonly accessToken?: string;
    protected constructor(url?: string, accessToken?: string);
    getUrlWithCredentials(): Promise<string>;
    abstract getAuthHeaders(): Record<string, string>;
    abstract getDownloadUrl(sha: string): string;
    abstract _getUsernameForAuthUrl(): Promise<string>;
    abstract getIsRemoteBranch(_branch: string): Promise<boolean>;
    abstract validateParams(): Promise<void>;
    abstract getRepoList(): Promise<ScmRepoInfo[]>;
    abstract getBranchList(): Promise<string[]>;
    abstract getUserHasAccessToRepo(): Promise<boolean>;
    abstract getUsername(): Promise<string>;
    abstract getSubmitRequestStatus(_scmSubmitRequestId: string): Promise<ScmSubmitRequestStatus>;
    abstract createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    abstract getRepoBlameRanges(ref: string, path: string): Promise<{
        startingLine: number;
        endingLine: number;
        name: string;
        login: string;
        email: string;
    }[]>;
    abstract getReferenceData(ref: string): Promise<{
        type: ReferenceType;
        sha: string;
        date: Date | undefined;
    }>;
    abstract getRepoDefaultBranch(): Promise<string>;
    getAccessToken(): string;
    getUrl(): string | undefined;
    getName(): string;
    static getIsValidBranchName(branchName: string): Promise<boolean>;
    static init({ url, accessToken, scmType, }: {
        url: string | undefined;
        accessToken: string | undefined;
        scmType: ScmLibScmType | undefined;
    }): Promise<SCMLib>;
}
export declare class GitlabSCMLib extends SCMLib {
    createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    validateParams(): Promise<void>;
    getRepoList(): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getAuthHeaders(): Record<string, string>;
    getDownloadUrl(sha: string): string;
    _getUsernameForAuthUrl(): Promise<string>;
    getIsRemoteBranch(branch: string): Promise<boolean>;
    getUserHasAccessToRepo(): Promise<boolean>;
    getUsername(): Promise<string>;
    getSubmitRequestStatus(scmSubmitRequestId: string): Promise<ScmSubmitRequestStatus>;
    getRepoBlameRanges(ref: string, path: string): Promise<{
        startingLine: number;
        endingLine: number;
        name: string;
        login: string;
        email: string;
    }[]>;
    getReferenceData(ref: string): Promise<{
        type: ReferenceType;
        sha: string;
        date: Date | undefined;
    }>;
    getRepoDefaultBranch(): Promise<string>;
}
export declare class GithubSCMLib extends SCMLib {
    createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    validateParams(): Promise<void>;
    getRepoList(): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getAuthHeaders(): Record<string, string>;
    getDownloadUrl(sha: string): string;
    _getUsernameForAuthUrl(): Promise<string>;
    getIsRemoteBranch(branch: string): Promise<boolean>;
    getUserHasAccessToRepo(): Promise<boolean>;
    getUsername(): Promise<string>;
    getSubmitRequestStatus(scmSubmitRequestId: string): Promise<ScmSubmitRequestStatus>;
    getRepoBlameRanges(ref: string, path: string): Promise<{
        startingLine: number;
        endingLine: number;
        name: string;
        login: string;
        email: string;
    }[]>;
    getReferenceData(ref: string): Promise<{
        type: ReferenceType;
        sha: string;
        date: Date | undefined;
    }>;
    getRepoDefaultBranch(): Promise<string>;
}
export declare class StubSCMLib extends SCMLib {
    createSubmitRequest(_targetBranchName: string, _sourceBranchName: string, _title: string, _body: string): Promise<string>;
    getAuthHeaders(): Record<string, string>;
    getDownloadUrl(_sha: string): string;
    _getUsernameForAuthUrl(): Promise<string>;
    getIsRemoteBranch(_branch: string): Promise<boolean>;
    validateParams(): Promise<void>;
    getRepoList(): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getUsername(): Promise<string>;
    getSubmitRequestStatus(_scmSubmitRequestId: string): Promise<ScmSubmitRequestStatus>;
    getUserHasAccessToRepo(): Promise<boolean>;
    getRepoBlameRanges(_ref: string, _path: string): Promise<{
        startingLine: number;
        endingLine: number;
        name: string;
        login: string;
        email: string;
    }[]>;
    getReferenceData(_ref: string): Promise<{
        type: ReferenceType;
        sha: string;
        date: Date | undefined;
    }>;
    getRepoDefaultBranch(): Promise<string>;
}
//# sourceMappingURL=scm.d.ts.map