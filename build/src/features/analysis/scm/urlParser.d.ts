import { ScmType } from './scm';
export declare const parseScmURL: (scmURL: string, scmType?: ScmType) => {
    hostname: string;
    organization: string;
    projectPath: string;
    repoName: string;
    projectName: string | undefined;
    pathElements: string[];
} | null;
export declare const sanityRepoURL: (scmURL: string) => boolean | null;
//# sourceMappingURL=urlParser.d.ts.map