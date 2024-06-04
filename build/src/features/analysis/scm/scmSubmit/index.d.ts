import { CommitToSameBranchParams, SubmitFixesResponseMessage, SubmitFixesToDifferentBranchParams } from './types';
export * from './types';
export declare const isValidBranchName: (branchName: string) => Promise<boolean>;
export declare function submitFixesToSameBranch(msg: Omit<CommitToSameBranchParams, 'type'>): Promise<SubmitFixesResponseMessage>;
export declare const submitFixesToDifferentBranch: (msg: Omit<SubmitFixesToDifferentBranchParams, 'type'>) => Promise<{
    type: "submitFixesForDifferentBranch";
    submitFixRequestId: string;
    submitBranches: {
        branchName: string;
        fixes: {
            fixId: string;
        }[];
    }[];
    githubCommentId?: number | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>;
//# sourceMappingURL=index.d.ts.map