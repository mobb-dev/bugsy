import { Octokit } from '@octokit/core';
import { getUserInfo } from './github/github';
import { DeleteCommentParams, DeleteGeneralPrCommentResponse, GetGeneralPrCommentResponse, GetPrCommentResponse, GetPrCommentsParams, GetPrParams, PostCommentParams, PostGeneralPrCommentResponse, UpdateCommentParams, UpdateCommentResponse } from './github/types';
export type ScmConfig = {
    id: string;
    orgId?: string | null;
    refreshToken?: string | null;
    scmOrg?: string | null | undefined;
    scmType: string;
    scmUrl: string;
    scmUsername?: string | null;
    token?: string | null;
    tokenLastUpdate?: string | null;
    userId?: string | null;
    isTokenAvailable: boolean;
};
export declare const ghGetUserInfo: typeof getUserInfo;
export declare function getCloudScmLibTypeFromUrl(url: string | undefined): ScmLibScmType | undefined;
export declare enum ScmType {
    GitLab = "GitLab",
    GitHub = "GitHub",
    Ado = "Ado"
}
export declare enum ScmCloudUrl {
    GitLab = "https://gitlab.com",
    GitHub = "https://github.com",
    Ado = "https://dev.azure.com"
}
export declare function getScmTypeFromScmLibType(scmLibType: string | null | undefined): ScmType;
export declare function getScmLibTypeFromScmType(scmType: string | null | undefined): ScmLibScmType;
export declare function getScmConfig({ url, scmConfigs, includeOrgTokens, }: {
    url: string;
    scmConfigs: ScmConfig[];
    includeOrgTokens?: boolean;
}): {
    id: string;
    accessToken: string | undefined;
    scmLibType: ScmLibScmType;
    scmOrg: string | undefined;
} | {
    id: undefined;
    accessToken: undefined;
    scmLibType: ScmLibScmType;
    scmOrg: undefined;
} | {
    id: undefined;
    accessToken: undefined;
    scmLibType: undefined;
    scmOrg: undefined;
};
export declare function scmCanReachRepo({ repoUrl, scmType, accessToken, scmOrg, }: {
    repoUrl: string;
    scmType: ScmType;
    accessToken: string | undefined;
    scmOrg: string | undefined;
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
    GITLAB = "GITLAB",
    ADO = "ADO"
}
export type ScmRepoInfo = {
    repoName: string;
    repoUrl: string;
    repoOwner: string;
    repoLanguages: string[];
    repoIsPublic: boolean;
    repoUpdatedAt: string;
};
type PostPRReviewCommentParams = {
    prNumber: number;
    body: string;
};
type SCMGetPrReviewCommentsParams = {
    prNumber: number;
};
type SCMGetPrReviewCommentsResponse = Promise<GetGeneralPrCommentResponse>;
type SCMPostGeneralPrCommentsResponse = Promise<PostGeneralPrCommentResponse>;
type SCMDeleteGeneralPrCommentParams = {
    commentId: number;
};
type SCMDeleteGeneralPrReviewResponse = Promise<DeleteGeneralPrCommentResponse>;
export declare class InvalidRepoUrlError extends Error {
    constructor(m: string);
}
export declare class InvalidAccessTokenError extends Error {
    constructor(m: string);
}
export declare class InvalidUrlPatternError extends Error {
    constructor(m: string);
}
export declare class BadShaError extends Error {
    constructor(m: string);
}
export declare class RefNotFoundError extends Error {
    constructor(m: string);
}
export declare class RepoNoTokenAccessError extends Error {
    constructor(m: string);
}
export declare class RebaseFailedError extends Error {
}
export declare abstract class SCMLib {
    protected readonly url?: string;
    protected readonly accessToken?: string;
    protected readonly scmOrg?: string;
    protected constructor(url: string | undefined, accessToken: string | undefined, scmOrg: string | undefined);
    getUrlWithCredentials(): Promise<string>;
    abstract getScmLibType(): ScmLibScmType;
    abstract getAuthHeaders(): Record<string, string>;
    abstract getDownloadUrl(sha: string): string;
    abstract _getUsernameForAuthUrl(): Promise<string>;
    abstract getIsRemoteBranch(_branch: string): Promise<boolean>;
    abstract validateParams(): Promise<void>;
    abstract getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]>;
    abstract getBranchList(): Promise<string[]>;
    abstract getUserHasAccessToRepo(): Promise<boolean>;
    abstract getUsername(): Promise<string>;
    abstract forkRepo(repoUrl: string): Promise<{
        url: string | null;
    }>;
    abstract createOrUpdateRepositorySecret(params: {
        value: string;
        name: string;
    }, _oktokit?: Octokit): Promise<{
        url: string | null;
    }>;
    abstract createPullRequestWithNewFile(sourceRepoUrl: string, filesPaths: string[], userRepoUrl: string, title: string, body: string): Promise<{
        pull_request_url: string;
    }>;
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
    abstract getPrComment(commentId: number): Promise<GetPrCommentResponse>;
    abstract getPrUrl(prNumber: number): Promise<string>;
    abstract updatePrComment(params: Pick<UpdateCommentParams, 'body' | 'comment_id'>, _oktokit?: Octokit): Promise<UpdateCommentResponse>;
    abstract getRepoDefaultBranch(): Promise<string>;
    getAccessToken(): string;
    getUrl(): string | undefined;
    getName(): string;
    static getIsValidBranchName(branchName: string): Promise<boolean>;
    static init({ url, accessToken, scmType, scmOrg, }: {
        url: string | undefined;
        accessToken: string | undefined;
        scmType: ScmLibScmType | undefined;
        scmOrg: string | undefined;
    }): Promise<SCMLib>;
    abstract postGeneralPrComment(params: PostPRReviewCommentParams, auth?: {
        authToken: string;
    }): SCMPostGeneralPrCommentsResponse;
    abstract getGeneralPrComments(params: SCMGetPrReviewCommentsParams, auth?: {
        authToken: string;
    }): SCMGetPrReviewCommentsResponse;
    abstract deleteGeneralPrComment(params: SCMDeleteGeneralPrCommentParams, auth?: {
        authToken: string;
    }): SCMDeleteGeneralPrReviewResponse;
    protected _validateAccessTokenAndUrl(): asserts this is this & {
        accessToken: string;
        url: string;
    };
}
export declare class AdoSCMLib extends SCMLib {
    updatePrComment(_params: Pick<UpdateCommentParams, 'body' | 'comment_id'>, _oktokit?: Octokit): Promise<UpdateCommentResponse>;
    getPrComment(_commentId: number): Promise<GetPrCommentResponse>;
    forkRepo(): Promise<{
        url: string | null;
    }>;
    createOrUpdateRepositorySecret(): Promise<{
        url: string | null;
    }>;
    createPullRequestWithNewFile(_sourceRepoUrl: string, _filesPaths: string[], _userRepoUrl: string, _title: string, _body: string): Promise<{
        pull_request_url: string;
    }>;
    createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    validateParams(): Promise<void>;
    getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getScmLibType(): ScmLibScmType;
    getAuthHeaders(): Record<string, string>;
    getDownloadUrl(sha: string): string;
    _getUsernameForAuthUrl(): Promise<string>;
    getIsRemoteBranch(branch: string): Promise<boolean>;
    getUserHasAccessToRepo(): Promise<boolean>;
    getUsername(): Promise<string>;
    getSubmitRequestStatus(scmSubmitRequestId: string): Promise<ScmSubmitRequestStatus>;
    getRepoBlameRanges(_ref: string, _path: string): Promise<{
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
    getPrUrl(prNumber: number): Promise<string>;
    postGeneralPrComment(): SCMPostGeneralPrCommentsResponse;
    getGeneralPrComments(): SCMGetPrReviewCommentsResponse;
    deleteGeneralPrComment(): SCMDeleteGeneralPrReviewResponse;
}
export declare class GitlabSCMLib extends SCMLib {
    createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    validateParams(): Promise<void>;
    forkRepo(): Promise<{
        url: string | null;
    }>;
    createOrUpdateRepositorySecret(): Promise<{
        url: string | null;
    }>;
    createPullRequestWithNewFile(_sourceRepoUrl: string, _filesPaths: string[], _userRepoUrl: string, _title: string, _body: string): Promise<{
        pull_request_url: string;
    }>;
    getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getScmLibType(): ScmLibScmType;
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
    getPrComment(_commentId: number): Promise<GetPrCommentResponse>;
    updatePrComment(_params: Pick<UpdateCommentParams, 'body' | 'comment_id'>, _oktokit?: Octokit): Promise<UpdateCommentResponse>;
    getPrUrl(prNumber: number): Promise<string>;
    postGeneralPrComment(): SCMPostGeneralPrCommentsResponse;
    getGeneralPrComments(): SCMGetPrReviewCommentsResponse;
    deleteGeneralPrComment(): SCMDeleteGeneralPrReviewResponse;
}
export declare class GithubSCMLib extends SCMLib {
    readonly oktokit: Octokit;
    constructor(url: string | undefined, accessToken: string | undefined, scmOrg: string | undefined);
    createSubmitRequest(targetBranchName: string, sourceBranchName: string, title: string, body: string): Promise<string>;
    forkRepo(repoUrl: string): Promise<{
        url: string | null;
    }>;
    createOrUpdateRepositorySecret(params: {
        value: string;
        name: string;
    }, _oktokit?: Octokit): Promise<import("@octokit/types").OctokitResponse<Record<string, never>, 201>>;
    createPullRequestWithNewFile(sourceRepoUrl: string, filesPaths: string[], userRepoUrl: string, title: string, body: string): Promise<{
        pull_request_url: string;
    }>;
    validateParams(): Promise<void>;
    postPrComment(params: Pick<PostCommentParams, 'body' | 'commit_id' | 'pull_number' | 'path' | 'line'>, _oktokit?: Octokit): Promise<import("@octokit/types").OctokitResponse<{
        url: string;
        pull_request_review_id: number | null;
        id: number;
        node_id: string;
        diff_hunk: string;
        path: string;
        position?: number | undefined;
        original_position?: number | undefined;
        commit_id: string;
        original_commit_id: string;
        in_reply_to_id?: number | undefined;
        user: {
            name?: string | null | undefined;
            email?: string | null | undefined;
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string | null;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
            starred_at?: string | undefined;
        };
        body: string;
        created_at: string;
        updated_at: string;
        html_url: string;
        pull_request_url: string;
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        _links: {
            self: {
                href: string;
            };
            html: {
                href: string;
            };
            pull_request: {
                href: string;
            };
        };
        start_line?: number | null | undefined;
        original_start_line?: number | null | undefined;
        start_side?: "LEFT" | "RIGHT" | null | undefined;
        line?: number | undefined;
        original_line?: number | undefined;
        side?: "LEFT" | "RIGHT" | undefined;
        subject_type?: "line" | "file" | undefined;
        reactions?: {
            url: string;
            total_count: number;
            "+1": number;
            "-1": number;
            laugh: number;
            confused: number;
            heart: number;
            hooray: number;
            eyes: number;
            rocket: number;
        } | undefined;
        body_html?: string | undefined;
        body_text?: string | undefined;
    }, 201>>;
    updatePrComment(params: Pick<UpdateCommentParams, 'body' | 'comment_id'>, _oktokit?: Octokit): Promise<UpdateCommentResponse>;
    deleteComment(params: Pick<DeleteCommentParams, 'comment_id'>, _oktokit?: Octokit): Promise<import("@octokit/types").OctokitResponse<never, 204>>;
    getPrComments(params: Omit<GetPrCommentsParams, 'owner' | 'repo'>, _oktokit?: Octokit): Promise<import("@octokit/types").OctokitResponse<{
        url: string;
        pull_request_review_id: number | null;
        id: number;
        node_id: string;
        diff_hunk: string;
        path: string;
        position?: number | undefined;
        original_position?: number | undefined;
        commit_id: string;
        original_commit_id: string;
        in_reply_to_id?: number | undefined;
        user: {
            name?: string | null | undefined;
            email?: string | null | undefined;
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string | null;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
            starred_at?: string | undefined;
        };
        body: string;
        created_at: string;
        updated_at: string;
        html_url: string;
        pull_request_url: string;
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        _links: {
            self: {
                href: string;
            };
            html: {
                href: string;
            };
            pull_request: {
                href: string;
            };
        };
        start_line?: number | null | undefined;
        original_start_line?: number | null | undefined;
        start_side?: "LEFT" | "RIGHT" | null | undefined;
        line?: number | undefined;
        original_line?: number | undefined;
        side?: "LEFT" | "RIGHT" | undefined;
        subject_type?: "line" | "file" | undefined;
        reactions?: {
            url: string;
            total_count: number;
            "+1": number;
            "-1": number;
            laugh: number;
            confused: number;
            heart: number;
            hooray: number;
            eyes: number;
            rocket: number;
        } | undefined;
        body_html?: string | undefined;
        body_text?: string | undefined;
    }[], 200>>;
    getPrDiff(params: Omit<GetPrParams, 'owner' | 'repo'>): Promise<string>;
    getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]>;
    getBranchList(): Promise<string[]>;
    getScmLibType(): ScmLibScmType;
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
    getPrComment(commentId: number): Promise<GetPrCommentResponse>;
    getRepoDefaultBranch(): Promise<string>;
    getPrUrl(prNumber: number): Promise<string>;
    postGeneralPrComment(params: PostPRReviewCommentParams, auth?: {
        authToken: string;
    }): SCMPostGeneralPrCommentsResponse;
    getGeneralPrComments(params: SCMGetPrReviewCommentsParams, auth?: {
        authToken: string;
    }): SCMGetPrReviewCommentsResponse;
    deleteGeneralPrComment({ commentId }: SCMDeleteGeneralPrCommentParams, auth?: {
        authToken: string;
    }): SCMDeleteGeneralPrReviewResponse;
}
export declare class StubSCMLib extends SCMLib {
    createSubmitRequest(_targetBranchName: string, _sourceBranchName: string, _title: string, _body: string): Promise<string>;
    getScmLibType(): ScmLibScmType;
    getAuthHeaders(): Record<string, string>;
    getDownloadUrl(_sha: string): string;
    _getUsernameForAuthUrl(): Promise<string>;
    getIsRemoteBranch(_branch: string): Promise<boolean>;
    validateParams(): Promise<void>;
    forkRepo(): Promise<{
        url: string | null;
    }>;
    createOrUpdateRepositorySecret(): Promise<{
        url: string | null;
    }>;
    createPullRequestWithNewFile(_sourceRepoUrl: string, _filesPaths: string[], _userRepoUrl: string, _title: string, _body: string): Promise<{
        pull_request_url: string;
    }>;
    getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]>;
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
    getPrComment(_commentId: number): Promise<GetPrCommentResponse>;
    updatePrComment(): Promise<UpdateCommentResponse>;
    getPrUrl(_prNumber: number): Promise<string>;
    postGeneralPrComment(): SCMPostGeneralPrCommentsResponse;
    getGeneralPrComments(): SCMGetPrReviewCommentsResponse;
    deleteGeneralPrComment(): SCMDeleteGeneralPrReviewResponse;
}
export {};
//# sourceMappingURL=scm.d.ts.map