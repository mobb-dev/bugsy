import { ReferenceType } from './scm';
declare type ApiAuthOptions = {
    githubAuthToken?: string | null;
};
export declare type GithubBlameResponse = {
    repository: {
        object: {
            blame: {
                ranges: Array<{
                    age: number;
                    endingLine: number;
                    startingLine: number;
                    commit: {
                        author: {
                            user: {
                                email: string;
                                name: string;
                                login: string;
                            };
                        };
                    };
                }>;
            };
        };
    };
};
export declare function githubValidateParams(url: string | undefined, accessToken: string | undefined): Promise<void>;
export declare function getGithubUsername(accessToken: string): Promise<string>;
export declare function getGithubIsUserCollaborator(username: string, accessToken: string, repoUrl: string): Promise<boolean>;
export declare function getGithubPullRequestStatus(accessToken: string, repoUrl: string, prNumber: number): Promise<"merged" | "draft" | "open" | "closed">;
export declare function getGithubIsRemoteBranch(accessToken: string, repoUrl: string, branch: string): Promise<boolean>;
export declare function getGithubRepoList(accessToken: string): Promise<any>;
export declare function getGithubBranchList(accessToken: string, repoUrl: string): Promise<string[]>;
export declare function createPullRequest(options: {
    accessToken: string;
    targetBranchName: string;
    sourceBranchName: string;
    title: string;
    body: string;
    repoUrl: string;
}): Promise<number>;
export declare function getGithubRepoDefaultBranch(repoUrl: string, options?: ApiAuthOptions): Promise<string>;
export declare function getGithubReferenceData({ ref, gitHubUrl }: {
    ref: string;
    gitHubUrl: string;
}, options?: ApiAuthOptions): Promise<{
    date: Date | undefined;
    type: ReferenceType;
    sha: string;
} | {
    date: Date;
    type: ReferenceType;
    sha: string;
} | {
    date: Date;
    type: ReferenceType;
    sha: string;
}>;
export declare function parseOwnerAndRepo(gitHubUrl: string): {
    owner: string;
    repo: string;
};
export declare function queryGithubGraphql<T>(query: string, variables?: Record<string, unknown>, options?: ApiAuthOptions): Promise<T | null>;
export declare function getGithubBlameRanges({ ref, gitHubUrl, path }: {
    ref: string;
    gitHubUrl: string;
    path: string;
}, options?: ApiAuthOptions): Promise<{
    startingLine: number;
    endingLine: number;
    email: string;
    name: string;
    login: string;
}[]>;
export {};
//# sourceMappingURL=github.d.ts.map