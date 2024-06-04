import { ReferenceType } from './scm';
type ApiAuthOptions = {
    url: string | undefined;
    gitlabAuthToken?: string | undefined;
};
export declare function gitlabValidateParams({ url, accessToken, }: {
    url: string | undefined;
    accessToken: string | undefined;
}): Promise<void>;
export declare function getGitlabUsername(url: string | undefined, accessToken: string): Promise<string>;
export declare function getGitlabIsUserCollaborator({ username, accessToken, repoUrl, }: {
    username: string;
    accessToken: string;
    repoUrl: string;
}): Promise<boolean>;
export declare enum GitlabMergeRequestStatusEnum {
    merged = "merged",
    opened = "opened",
    closed = "closed"
}
export declare function getGitlabMergeRequestStatus({ accessToken, repoUrl, mrNumber, }: {
    accessToken: string;
    repoUrl: string;
    mrNumber: number;
}): Promise<GitlabMergeRequestStatusEnum>;
export declare function getGitlabIsRemoteBranch({ accessToken, repoUrl, branch, }: {
    accessToken: string;
    repoUrl: string;
    branch: string;
}): Promise<boolean>;
export declare function getGitlabRepoList(url: string | undefined, accessToken: string): Promise<{
    repoName: string;
    repoUrl: string;
    repoOwner: string;
    repoLanguages: string[];
    repoIsPublic: boolean;
    repoUpdatedAt: string;
}[]>;
export declare function getGitlabBranchList({ accessToken, repoUrl, }: {
    accessToken: string;
    repoUrl: string;
}): Promise<string[]>;
export declare function createMergeRequest(options: {
    accessToken: string;
    targetBranchName: string;
    sourceBranchName: string;
    title: string;
    body: string;
    repoUrl: string;
}): Promise<number>;
export declare function getGitlabRepoDefaultBranch(repoUrl: string, options?: ApiAuthOptions): Promise<string>;
export declare function getGitlabReferenceData({ ref, gitlabUrl }: {
    ref: string;
    gitlabUrl: string;
}, options?: ApiAuthOptions): Promise<{
    sha: string;
    type: ReferenceType;
    date: Date | undefined;
}>;
export declare function parseGitlabOwnerAndRepo(gitlabUrl: string): {
    owner: string;
    repo: string;
    projectPath: string;
};
export declare function getGitlabBlameRanges({ ref, gitlabUrl, path }: {
    ref: string;
    gitlabUrl: string;
    path: string;
}, options?: ApiAuthOptions): Promise<{
    startingLine: number;
    endingLine: number;
    login: string;
    email: string;
    name: string;
}[]>;
export declare enum GitlabTokenRequestTypeEnum {
    CODE = "code",
    REFRESH_TOKEN = "refresh_token"
}
export declare function getGitlabToken({ token, gitlabClientId, gitlabClientSecret, callbackUrl, tokenType, }: {
    token: string;
    gitlabClientId: string;
    gitlabClientSecret: string;
    callbackUrl: string;
    tokenType: GitlabTokenRequestTypeEnum;
}): Promise<{
    access_token: string;
    token_type: string;
    refresh_token: string;
}>;
export {};
//# sourceMappingURL=gitlab.d.ts.map