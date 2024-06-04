export * from './get_issue_type';
type GetFixUrlParam = {
    appBaseUrl: string;
    fixId: string;
    projectId: string;
    organizationId: string;
    analysisId: string;
};
export declare function getFixUrlWithRedirect(params: GetCommitUrlParam): string;
export declare function getFixUrl({ appBaseUrl, fixId, projectId, organizationId, analysisId, }: GetFixUrlParam): string;
type GetCommitUrlParam = GetFixUrlParam & {
    redirectUrl: string;
    commentId: number;
};
export declare function getCommitUrl(params: GetCommitUrlParam): string;
//# sourceMappingURL=index.d.ts.map