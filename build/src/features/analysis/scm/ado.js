"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdoToken = exports.AdoTokenRequestTypeEnum = exports.getAdoBlameRanges = exports.parseAdoOwnerAndRepo = exports.getAdoReferenceData = exports.getAdoRepoDefaultBranch = exports.createAdoPullRequest = exports.getAdoBranchList = exports.getAdoDownloadUrl = exports.getAdoPrUrl = exports.getAdoRepoList = exports.getAdoIsRemoteBranch = exports.getAdoPullRequestStatus = exports.adoStatusNumberToEnumMap = exports.AdoPullRequestStatusEnum = exports.getAdoIsUserCollaborator = exports.adoValidateParams = exports.getAdoApiClient = exports.getAdoTokenType = exports.AdoTokenTypeEnum = void 0;
const node_querystring_1 = __importDefault(require("node:querystring"));
const api = __importStar(require("azure-devops-node-api"));
const zod_1 = require("zod");
const scm_1 = require("./scm");
const urlParser_1 = require("./urlParser");
function removeTrailingSlash(str) {
    return str.trim().replace(/\/+$/, '');
}
async function _getOrgsForOauthToken({ oauthToken }) {
    const profileZ = zod_1.z.object({
        displayName: zod_1.z.string(),
        publicAlias: zod_1.z.string().min(1),
        emailAddress: zod_1.z.string(),
        coreRevision: zod_1.z.number(),
        timeStamp: zod_1.z.string(),
        id: zod_1.z.string(),
        revision: zod_1.z.number(),
    });
    const accountsZ = zod_1.z.object({
        count: zod_1.z.number(),
        value: zod_1.z.array(zod_1.z.object({
            accountId: zod_1.z.string(),
            accountUri: zod_1.z.string(),
            accountName: zod_1.z.string(),
        })),
    });
    const profileRes = await fetch('https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${oauthToken}`,
        },
    });
    const profileJson = await profileRes.json();
    const profile = profileZ.parse(profileJson);
    const accountsRes = await fetch(`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${profile.publicAlias}&api-version=6.0`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${oauthToken}`,
        },
    });
    const accountsJson = await accountsRes.json();
    const accounts = accountsZ.parse(accountsJson);
    const orgs = accounts.value
        .map((account) => account.accountName)
        .filter((value, index, array) => array.indexOf(value) === index);
    return orgs;
}
function _getPublicAdoClient({ orgName }) {
    const orgUrl = `https://dev.azure.com/${orgName}`;
    const authHandler = api.getPersonalAccessTokenHandler('');
    authHandler.canHandleAuthentication = () => false;
    authHandler.prepareRequest = (_options) => {
        return;
    };
    const connection = new api.WebApi(orgUrl, authHandler);
    return connection;
}
var AdoTokenTypeEnum;
(function (AdoTokenTypeEnum) {
    AdoTokenTypeEnum["PAT"] = "PAT";
    AdoTokenTypeEnum["OAUTH"] = "OAUTH";
})(AdoTokenTypeEnum = exports.AdoTokenTypeEnum || (exports.AdoTokenTypeEnum = {}));
function getAdoTokenType(token) {
    if (token.includes('.')) {
        return AdoTokenTypeEnum.OAUTH;
    }
    return AdoTokenTypeEnum.PAT;
}
exports.getAdoTokenType = getAdoTokenType;
async function getAdoApiClient({ accessToken, tokenOrg, orgName, }) {
    if (!accessToken || (tokenOrg && tokenOrg !== orgName)) {
        return _getPublicAdoClient({ orgName });
    }
    const orgUrl = `https://dev.azure.com/${orgName}`;
    if (getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH) {
        const connection = new api.WebApi(orgUrl, api.getBearerHandler(accessToken));
        return connection;
    }
    const authHandler = api.getPersonalAccessTokenHandler(accessToken);
    const connection = new api.WebApi(orgUrl, authHandler);
    return connection;
}
exports.getAdoApiClient = getAdoApiClient;
async function adoValidateParams({ url, accessToken, tokenOrg, }) {
    try {
        if (!url &&
            accessToken &&
            getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH) {
            await _getOrgsForOauthToken({ oauthToken: accessToken });
            return;
        }
        let org = tokenOrg;
        if (url) {
            const { owner } = parseAdoOwnerAndRepo(url);
            org = owner;
        }
        if (!org) {
            throw new scm_1.InvalidRepoUrlError(`invalid ADO ORG ${org}`);
        }
        const api = await getAdoApiClient({
            accessToken,
            tokenOrg,
            orgName: org,
        });
        await api.connect();
    }
    catch (e) {
        const error = e;
        const code = error.code ||
            error.status ||
            error.statusCode ||
            error.response?.status ||
            error.response?.statusCode ||
            error.response?.code;
        const description = error.description || `${e}`;
        if (code === 401 ||
            code === 403 ||
            description.includes('401') ||
            description.includes('403')) {
            throw new scm_1.InvalidAccessTokenError(`invalid ADO access token`);
        }
        if (code === 404 ||
            description.includes('404') ||
            description.includes('Not Found')) {
            throw new scm_1.InvalidRepoUrlError(`invalid ADO repo URL ${url}`);
        }
        throw e;
    }
}
exports.adoValidateParams = adoValidateParams;
async function getAdoIsUserCollaborator({ accessToken, tokenOrg, repoUrl, }) {
    try {
        const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
        const api = await getAdoApiClient({
            accessToken,
            tokenOrg,
            orgName: owner,
        });
        const git = await api.getGitApi();
        const branches = await git.getBranches(repo, projectName);
        if (!branches || branches.length === 0) {
            throw new scm_1.InvalidRepoUrlError('no branches');
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.getAdoIsUserCollaborator = getAdoIsUserCollaborator;
var AdoPullRequestStatusEnum;
(function (AdoPullRequestStatusEnum) {
    AdoPullRequestStatusEnum["completed"] = "completed";
    AdoPullRequestStatusEnum["active"] = "active";
    AdoPullRequestStatusEnum["all"] = "all";
    AdoPullRequestStatusEnum["abandoned"] = "abandoned";
})(AdoPullRequestStatusEnum = exports.AdoPullRequestStatusEnum || (exports.AdoPullRequestStatusEnum = {}));
exports.adoStatusNumberToEnumMap = {
    1: AdoPullRequestStatusEnum.active,
    2: AdoPullRequestStatusEnum.abandoned,
    3: AdoPullRequestStatusEnum.completed,
    4: AdoPullRequestStatusEnum.all,
};
async function getAdoPullRequestStatus({ accessToken, tokenOrg, repoUrl, prNumber, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const api = await getAdoApiClient({
        accessToken,
        tokenOrg,
        orgName: owner,
    });
    const git = await api.getGitApi();
    const res = await git.getPullRequest(repo, prNumber, projectName);
    if (!res.status || res.status < 1 || res.status > 3) {
        throw new Error('bad pr status for ADO');
    }
    return exports.adoStatusNumberToEnumMap[res.status];
}
exports.getAdoPullRequestStatus = getAdoPullRequestStatus;
async function getAdoIsRemoteBranch({ accessToken, tokenOrg, repoUrl, branch, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const api = await getAdoApiClient({
        accessToken,
        tokenOrg,
        orgName: owner,
    });
    const git = await api.getGitApi();
    try {
        const branchStatus = await git.getBranch(repo, branch, projectName);
        if (!branchStatus || !branchStatus.commit) {
            throw new scm_1.InvalidRepoUrlError('no branch status');
        }
        return branchStatus.name === branch;
    }
    catch (e) {
        return false;
    }
}
exports.getAdoIsRemoteBranch = getAdoIsRemoteBranch;
async function getAdoRepoList({ orgName, tokenOrg, accessToken, }) {
    let orgs = [];
    if (getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH) {
        orgs = await _getOrgsForOauthToken({ oauthToken: accessToken });
    }
    if (orgs.length === 0 && !orgName) {
        throw new Error(`no orgs for ADO`);
    }
    else if (orgs.length === 0 && orgName) {
        orgs = [orgName];
    }
    const repos = (await Promise.allSettled(orgs.map(async (org) => {
        const orgApi = await getAdoApiClient({
            accessToken,
            tokenOrg,
            orgName: org,
        });
        const gitOrg = await orgApi.getGitApi();
        const orgRepos = await gitOrg.getRepositories();
        const repoInfoList = (await Promise.allSettled(orgRepos.map(async (repo) => {
            if (!repo.name || !repo.remoteUrl || !repo.defaultBranch) {
                throw new scm_1.InvalidRepoUrlError('bad repo');
            }
            const branch = await gitOrg.getBranch(repo.name, repo.defaultBranch.replace(/^refs\/heads\//, ''), repo.project?.name);
            return {
                repoName: repo.name,
                repoUrl: repo.remoteUrl.replace(/^[hH][tT][tT][pP][sS]:\/\/[^/]+@/, 'https://'),
                repoOwner: org,
                repoIsPublic: repo.project?.visibility === 2,
                repoLanguages: [],
                repoUpdatedAt: branch.commit?.committer?.date?.toDateString() ||
                    repo.project?.lastUpdateTime?.toDateString() ||
                    new Date().toDateString(),
            };
        }))).reduce((acc, res) => {
            if (res.status === 'fulfilled') {
                acc.push(res.value);
            }
            return acc;
        }, []);
        return repoInfoList;
    }))).reduce((acc, res) => {
        if (res.status === 'fulfilled') {
            return acc.concat(res.value);
        }
        return acc;
    }, []);
    return repos;
}
exports.getAdoRepoList = getAdoRepoList;
// todo integrate this url creation through the sdk
function getAdoPrUrl({ url, prNumber, }) {
    return `${url}/pullrequest/${prNumber}`;
}
exports.getAdoPrUrl = getAdoPrUrl;
function getAdoDownloadUrl({ repoUrl, branch, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const url = new URL(repoUrl);
    const origin = url.origin.toLowerCase().endsWith('.visualstudio.com')
        ? 'https://dev.azure.com'
        : url.origin.toLowerCase();
    return `${origin}/${owner}/${projectName}/_apis/git/repositories/${repo}/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=${branch}&resolveLfs=true&$format=zip&api-version=5.0&download=true`;
}
exports.getAdoDownloadUrl = getAdoDownloadUrl;
async function getAdoBranchList({ accessToken, tokenOrg, repoUrl, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const api = await getAdoApiClient({
        accessToken,
        tokenOrg,
        orgName: owner,
    });
    const git = await api.getGitApi();
    try {
        const res = await git.getBranches(repo, projectName);
        res.sort((a, b) => {
            if (!a.commit?.committer?.date || !b.commit?.committer?.date) {
                return 0;
            }
            return (b.commit?.committer?.date.getTime() -
                a.commit?.committer?.date.getTime());
        });
        return res.reduce((acc, branch) => {
            if (!branch.name) {
                return acc;
            }
            acc.push(branch.name);
            return acc;
        }, []);
    }
    catch (e) {
        return [];
    }
}
exports.getAdoBranchList = getAdoBranchList;
async function createAdoPullRequest(options) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(options.repoUrl);
    const api = await getAdoApiClient({
        accessToken: options.accessToken,
        tokenOrg: options.tokenOrg,
        orgName: owner,
    });
    const git = await api.getGitApi();
    const res = await git.createPullRequest({
        sourceRefName: `refs/heads/${options.sourceBranchName}`,
        targetRefName: `refs/heads/${options.targetBranchName}`,
        title: options.title,
        description: options.body,
    }, repo, projectName);
    return res.pullRequestId;
}
exports.createAdoPullRequest = createAdoPullRequest;
async function getAdoRepoDefaultBranch({ repoUrl, tokenOrg, accessToken, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const api = await getAdoApiClient({
        accessToken,
        tokenOrg,
        orgName: owner,
    });
    const git = await api.getGitApi();
    const branches = await git.getBranches(repo, projectName);
    if (!branches || branches.length === 0) {
        throw new scm_1.InvalidRepoUrlError('no branches');
    }
    const res = branches.find((branch) => branch.isBaseVersion);
    if (!res || !res.name) {
        throw new scm_1.InvalidRepoUrlError('no default branch');
    }
    return res.name;
}
exports.getAdoRepoDefaultBranch = getAdoRepoDefaultBranch;
async function getAdoReferenceData({ ref, repoUrl, accessToken, tokenOrg, }) {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl);
    const api = await getAdoApiClient({
        accessToken,
        tokenOrg,
        orgName: owner,
    });
    if (!projectName) {
        throw new scm_1.InvalidUrlPatternError('no project name');
    }
    const git = await api.getGitApi();
    const results = await Promise.allSettled([
        (async () => {
            const res = await git.getBranch(repo, ref, projectName);
            if (!res.commit || !res.commit.commitId) {
                throw new scm_1.InvalidRepoUrlError('no commit on branch');
            }
            return {
                sha: res.commit.commitId,
                type: scm_1.ReferenceType.BRANCH,
                date: res.commit.committer?.date || new Date(),
            };
        })(),
        (async () => {
            const res = await git.getCommits(repo, {
                fromCommitId: ref,
                toCommitId: ref,
                $top: 1,
            }, projectName);
            const commit = res[0];
            if (!commit || !commit.commitId) {
                throw new Error('no commit');
            }
            return {
                sha: commit.commitId,
                type: scm_1.ReferenceType.COMMIT,
                date: commit.committer?.date || new Date(),
            };
        })(),
        (async () => {
            const res = await git.getRefs(repo, projectName, `tags/${ref}`);
            if (!res[0] || !res[0].objectId) {
                throw new Error('no tag ref');
            }
            let objectId = res[0].objectId;
            try {
                //in some cases the call to git.getRefs() returns the sha of the commit in the objectId and in some cases
                //it returns the tag object ID which we then need to call git.getAnnotatedTag() on it
                const tag = await git.getAnnotatedTag(projectName, repo, objectId);
                if (tag.taggedObject?.objectId) {
                    objectId = tag.taggedObject.objectId;
                }
            }
            catch (e) {
                /* empty */
            }
            const commitRes = await git.getCommits(repo, {
                fromCommitId: objectId,
                toCommitId: objectId,
                $top: 1,
            }, projectName);
            const commit = commitRes[0];
            if (!commit) {
                throw new Error('no commit');
            }
            return {
                sha: objectId,
                type: scm_1.ReferenceType.TAG,
                date: commit.committer?.date || new Date(),
            };
        })(),
    ]);
    const [branchRes, commitRes, tagRes] = results;
    if (tagRes.status === 'fulfilled') {
        return tagRes.value;
    }
    if (branchRes.status === 'fulfilled') {
        return branchRes.value;
    }
    if (commitRes.status === 'fulfilled') {
        return commitRes.value;
    }
    throw new scm_1.RefNotFoundError(`ref: ${ref} does not exist`);
}
exports.getAdoReferenceData = getAdoReferenceData;
function parseAdoOwnerAndRepo(adoUrl) {
    adoUrl = removeTrailingSlash(adoUrl);
    const parsingResult = (0, urlParser_1.parseScmURL)(adoUrl, scm_1.ScmType.Ado);
    if (!parsingResult ||
        (parsingResult.hostname !== 'dev.azure.com' &&
            !parsingResult.hostname.endsWith('.visualstudio.com'))) {
        throw new scm_1.InvalidUrlPatternError(`invalid ADO repo URL: ${adoUrl}`);
    }
    const { organization, repoName, projectName, projectPath, pathElements } = parsingResult;
    return {
        owner: organization,
        repo: repoName,
        projectName,
        projectPath,
        pathElements,
    };
}
exports.parseAdoOwnerAndRepo = parseAdoOwnerAndRepo;
async function getAdoBlameRanges() {
    return [];
}
exports.getAdoBlameRanges = getAdoBlameRanges;
const ADO_ACCESS_TOKEN_URL = 'https://app.vssps.visualstudio.com/oauth2/token';
var AdoTokenRequestTypeEnum;
(function (AdoTokenRequestTypeEnum) {
    AdoTokenRequestTypeEnum["CODE"] = "code";
    AdoTokenRequestTypeEnum["REFRESH_TOKEN"] = "refresh_token";
})(AdoTokenRequestTypeEnum = exports.AdoTokenRequestTypeEnum || (exports.AdoTokenRequestTypeEnum = {}));
const AdoAuthResultZ = zod_1.z.object({
    access_token: zod_1.z.string().min(1),
    token_type: zod_1.z.string().min(1),
    refresh_token: zod_1.z.string().min(1),
});
async function getAdoToken({ token, adoClientSecret, tokenType, redirectUri, }) {
    const res = await fetch(ADO_ACCESS_TOKEN_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: node_querystring_1.default.stringify({
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: adoClientSecret,
            redirect_uri: redirectUri,
            assertion: token,
            grant_type: tokenType === AdoTokenRequestTypeEnum.CODE
                ? 'urn:ietf:params:oauth:grant-type:jwt-bearer'
                : 'refresh_token',
        }),
    });
    const authResult = await res.json();
    return AdoAuthResultZ.parse(authResult);
}
exports.getAdoToken = getAdoToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9hZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3RUFBMEM7QUFFMUMsMkRBQTRDO0FBQzVDLDZCQUF1QjtBQUV2QiwrQkFRYztBQUNkLDJDQUF5QztBQUV6QyxTQUFTLG1CQUFtQixDQUFDLEdBQVc7SUFDdEMsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN2QyxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsVUFBVSxFQUEwQjtJQUN6RSxNQUFNLFFBQVEsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hCLFdBQVcsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLFdBQVcsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QixZQUFZLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUN4QixZQUFZLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUN4QixTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNyQixFQUFFLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNkLFFBQVEsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0tBQ3JCLENBQUMsQ0FBQTtJQUNGLE1BQU0sU0FBUyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7UUFDekIsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDakIsS0FBSyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQ1osT0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNQLFNBQVMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JCLFVBQVUsRUFBRSxPQUFDLENBQUMs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QUFDO0FBL0JELGtDQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdub2RlOnF1ZXJ5c3RyaW5nJ1xuXG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnYXp1cmUtZGV2b3BzLW5vZGUtYXBpJ1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcblxuaW1wb3J0IHtcbiAgSW52YWxpZEFjY2Vzc1Rva2VuRXJyb3IsXG4gIEludmFsaWRSZXBvVXJsRXJyb3IsXG4gIEludmFsaWRVcmxQYXR0ZXJuRXJyb3IsXG4gIFJlZmVyZW5jZVR5cGUsXG4gIFJlZk5vdEZvdW5kRXJyb3IsXG4gIFNjbVJlcG9JbmZvLFxuICBTY21UeXBlLFxufSBmcm9tICcuL3NjbSdcbmltcG9ydCB7IHBhcnNlU2NtVVJMIH0gZnJvbSAnLi91cmxQYXJzZXInXG5cbmZ1bmN0aW9uIHJlbW92ZVRyYWlsaW5nU2xhc2goc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHN0ci50cmltKCkucmVwbGFjZSgvXFwvKyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2dldE9yZ3NGb3JPYXV0aFRva2VuKHsgb2F1dGhUb2tlbiB9OiB7IG9hdXRoVG9rZW46IHN0cmluZyB9KSB7XG4gIGNvbnN0IHByb2ZpbGVaID0gei5vYmplY3Qoe1xuICAgIGRpc3BsYXlOYW1lOiB6LnN0cmluZygpLFxuICAgIHB1YmxpY0FsaWFzOiB6LnN0cmluZygpLm1pbigxKSxcbiAgICBlbWFpbEFkZHJlc3M6IHouc3RyaW5nKCksXG4gICAgY29yZVJldmlzaW9uOiB6Lm51bWJlcigpLFxuICAgIHRpbWVTdGFtcDogei5zdHJpbmcoKSxcbiAgICBpZDogei5zdHJpbmcoKSxcbiAgICByZXZpc2lvbjogei5udW1iZXIoKSxcbiAgfSlcbiAgY29uc3QgYWNjb3VudHNaID0gei5vYmplY3Qoe1xuICAgIGNvdW50OiB6Lm51bWJlcigpLFxuICAgIHZhbHVlOiB6LmFycmF5KFxuICAgICAgei5vYmplY3Qoe1xuICAgICAgICBhY2NvdW50SWQ6IHouc3RyaW5nKCksXG4gICAgICAgIGFjY291bnRVcmk6IHouc3RyaW5nKCksXG4gICAgICAgIGFjY291bnROYW1lOiB6LnN0cmluZygpLFxuICAgICAgfSlcbiAgICApLFxuICB9KVxuXG4gIGNvbnN0IHByb2ZpbGVSZXMgPSBhd2FpdCBmZXRjaChcbiAgICAnaHR0cHM6Ly9hcHAudnNzcHMudmlzdWFsc3R1ZGlvLmNvbS9fYXBpcy9wcm9maWxlL3Byb2ZpbGVzL21lP2FwaS12ZXJzaW9uPTYuMCcsXG4gICAge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke29hdXRoVG9rZW59YCxcbiAgICAgIH0sXG4gICAgfVxuICApXG4gIGNvbnN0IHByb2ZpbGVKc29uID0gYXdhaXQgcHJvZmlsZVJlcy5qc29uKClcbiAgY29uc3QgcHJvZmlsZSA9IHByb2ZpbGVaLnBhcnNlKHByb2ZpbGVKc29uKVxuICBjb25zdCBhY2NvdW50c1JlcyA9IGF3YWl0IGZldGNoKFxuICAgIGBodHRwczovL2FwcC52c3Nwcy52aXN1YWxzdHVkaW8uY29tL19hcGlzL2FjY291bnRzP21lbWJlcklkPSR7cHJvZmlsZS5wdWJsaWNBbGlhc30mYXBpLXZlcnNpb249Ni4wYCxcbiAgICB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7b2F1dGhUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9XG4gIClcbiAgY29uc3QgYWNjb3VudHNKc29uID0gYXdhaXQgYWNjb3VudHNSZXMuanNvbigpXG4gIGNvbnN0IGFjY291bnRzID0gYWNjb3VudHNaLnBhcnNlKGFjY291bnRzSnNvbilcbiAgY29uc3Qgb3JncyA9IGFjY291bnRzLnZhbHVlXG4gICAgLm1hcCgoYWNjb3VudCkgPT4gYWNjb3VudC5hY2NvdW50TmFtZSlcbiAgICAuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiBhcnJheS5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpXG4gIHJldHVybiBvcmdzXG59XG5cbmZ1bmN0aW9uIF9nZXRQdWJsaWNBZG9DbGllbnQoeyBvcmdOYW1lIH06IHsgb3JnTmFtZTogc3RyaW5nIH0pIHtcbiAgY29uc3Qgb3JnVXJsID0gYGh0dHBzOi8vZGV2LmF6dXJlLmNvbS8ke29yZ05hbWV9YFxuICBjb25zdCBhdXRoSGFuZGxlciA9IGFwaS5nZXRQZXJzb25hbEFjY2Vzc1Rva2VuSGFuZGxlcignJylcbiAgYXV0aEhhbmRsZXIuY2FuSGFuZGxlQXV0aGVudGljYXRpb24gPSAoKSA9PiBmYWxzZVxuICBhdXRoSGFuZGxlci5wcmVwYXJlUmVxdWVzdCA9IChfb3B0aW9ucykgPT4ge1xuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgYXBpLldlYkFwaShvcmdVcmwsIGF1dGhIYW5kbGVyKVxuICByZXR1cm4gY29ubmVjdGlvblxufVxuXG5leHBvcnQgZW51bSBBZG9Ub2tlblR5cGVFbnVtIHtcbiAgUEFUID0gJ1BBVCcsXG4gIE9BVVRIID0gJ09BVVRIJyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkb1Rva2VuVHlwZSh0b2tlbjogc3RyaW5nKSB7XG4gIGlmICh0b2tlbi5pbmNsdWRlcygnLicpKSB7XG4gICAgcmV0dXJuIEFkb1Rva2VuVHlwZUVudW0uT0FVVEhcbiAgfVxuICByZXR1cm4gQWRvVG9rZW5UeXBlRW51bS5QQVRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFkb0FwaUNsaWVudCh7XG4gIGFjY2Vzc1Rva2VuLFxuICB0b2tlbk9yZyxcbiAgb3JnTmFtZSxcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZFxuICB0b2tlbk9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIG9yZ05hbWU6IHN0cmluZ1xufSkge1xuICBpZiAoIWFjY2Vzc1Rva2VuIHx8ICh0b2tlbk9yZyAmJiB0b2tlbk9yZyAhPT0gb3JnTmFtZSkpIHtcbiAgICByZXR1cm4gX2dldFB1YmxpY0Fkb0NsaWVudCh7IG9yZ05hbWUgfSlcbiAgfVxuICBjb25zdCBvcmdVcmwgPSBgaHR0cHM6Ly9kZXYuYXp1cmUuY29tLyR7b3JnTmFtZX1gXG4gIGlmIChnZXRBZG9Ub2tlblR5cGUoYWNjZXNzVG9rZW4pID09PSBBZG9Ub2tlblR5cGVFbnVtLk9BVVRIKSB7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IG5ldyBhcGkuV2ViQXBpKG9yZ1VybCwgYXBpLmdldEJlYXJlckhhbmRsZXIoYWNjZXNzVG9rZW4pKVxuICAgIHJldHVybiBjb25uZWN0aW9uXG4gIH1cbiAgY29uc3QgYXV0aEhhbmRsZXIgPSBhcGkuZ2V0UGVyc29uYWxBY2Nlc3NUb2tlbkhhbmRsZXIoYWNjZXNzVG9rZW4pXG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgYXBpLldlYkFwaShvcmdVcmwsIGF1dGhIYW5kbGVyKVxuICByZXR1cm4gY29ubmVjdGlvblxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRvVmFsaWRhdGVQYXJhbXMoe1xuICB1cmwsXG4gIGFjY2Vzc1Rva2VuLFxuICB0b2tlbk9yZyxcbn06IHtcbiAgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgYWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZFxuICB0b2tlbk9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG59KSB7XG4gIHRyeSB7XG4gICAgaWYgKFxuICAgICAgIXVybCAmJlxuICAgICAgYWNjZXNzVG9rZW4gJiZcbiAgICAgIGdldEFkb1Rva2VuVHlwZShhY2Nlc3NUb2tlbikgPT09IEFkb1Rva2VuVHlwZUVudW0uT0FVVEhcbiAgICApIHtcbiAgICAgIGF3YWl0IF9nZXRPcmdzRm9yT2F1dGhUb2tlbih7IG9hdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IG9yZyA9IHRva2VuT3JnXG4gICAgaWYgKHVybCkge1xuICAgICAgY29uc3QgeyBvd25lciB9ID0gcGFyc2VBZG9Pd25lckFuZFJlcG8odXJsKVxuICAgICAgb3JnID0gb3duZXJcbiAgICB9XG4gICAgaWYgKCFvcmcpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUmVwb1VybEVycm9yKGBpbnZhbGlkIEFETyBPUkcgJHtvcmd9YClcbiAgICB9XG4gICAgY29uc3QgYXBpID0gYXdhaXQgZ2V0QWRvQXBpQ2xpZW50KHtcbiAgICAgIGFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5PcmcsXG4gICAgICBvcmdOYW1lOiBvcmcsXG4gICAgfSlcbiAgICBhd2FpdCBhcGkuY29ubmVjdCgpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCBlcnJvciA9IGUgYXMge1xuICAgICAgY29kZT86IHN0cmluZ1xuICAgICAgc3RhdHVzPzogbnVtYmVyXG4gICAgICBzdGF0dXNDb2RlPzogbnVtYmVyXG4gICAgICByZXNwb25zZT86IHsgc3RhdHVzPzogbnVtYmVyOyBzdGF0dXNDb2RlPzogbnVtYmVyOyBjb2RlPzogc3RyaW5nIH1cbiAgICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nXG4gICAgfVxuICAgIGNvbnN0IGNvZGUgPVxuICAgICAgZXJyb3IuY29kZSB8fFxuICAgICAgZXJyb3Iuc3RhdHVzIHx8XG4gICAgICBlcnJvci5zdGF0dXNDb2RlIHx8XG4gICAgICBlcnJvci5yZXNwb25zZT8uc3RhdHVzIHx8XG4gICAgICBlcnJvci5yZXNwb25zZT8uc3RhdHVzQ29kZSB8fFxuICAgICAgZXJyb3IucmVzcG9uc2U/LmNvZGVcblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZXJyb3IuZGVzY3JpcHRpb24gfHwgYCR7ZX1gXG4gICAgaWYgKFxuICAgICAgY29kZSA9PT0gNDAxIHx8XG4gICAgICBjb2RlID09PSA0MDMgfHxcbiAgICAgIGRlc2NyaXB0aW9uLmluY2x1ZGVzKCc0MDEnKSB8fFxuICAgICAgZGVzY3JpcHRpb24uaW5jbHVkZXMoJzQwMycpXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEFjY2Vzc1Rva2VuRXJyb3IoYGludmFsaWQgQURPIGFjY2VzcyB0b2tlbmApXG4gICAgfVxuICAgIGlmIChcbiAgICAgIGNvZGUgPT09IDQwNCB8fFxuICAgICAgZGVzY3JpcHRpb24uaW5jbHVkZXMoJzQwNCcpIHx8XG4gICAgICBkZXNjcmlwdGlvbi5pbmNsdWRlcygnTm90IEZvdW5kJylcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUmVwb1VybEVycm9yKGBpbnZhbGlkIEFETyByZXBvIFVSTCAke3VybH1gKVxuICAgIH1cbiAgICB0aHJvdyBlXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFkb0lzVXNlckNvbGxhYm9yYXRvcih7XG4gIGFjY2Vzc1Rva2VuLFxuICB0b2tlbk9yZyxcbiAgcmVwb1VybCxcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICB0b2tlbk9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHJlcG9Vcmw6IHN0cmluZ1xufSkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8sIHByb2plY3ROYW1lIH0gPSBwYXJzZUFkb093bmVyQW5kUmVwbyhyZXBvVXJsKVxuICAgIGNvbnN0IGFwaSA9IGF3YWl0IGdldEFkb0FwaUNsaWVudCh7XG4gICAgICBhY2Nlc3NUb2tlbixcbiAgICAgIHRva2VuT3JnLFxuICAgICAgb3JnTmFtZTogb3duZXIsXG4gICAgfSlcbiAgICBjb25zdCBnaXQgPSBhd2FpdCBhcGkuZ2V0R2l0QXBpKClcbiAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IGdpdC5nZXRCcmFuY2hlcyhyZXBvLCBwcm9qZWN0TmFtZSlcbiAgICBpZiAoIWJyYW5jaGVzIHx8IGJyYW5jaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRSZXBvVXJsRXJyb3IoJ25vIGJyYW5jaGVzJylcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBlbnVtIEFkb1B1bGxSZXF1ZXN0U3RhdHVzRW51bSB7XG4gIGNvbXBsZXRlZCA9ICdjb21wbGV0ZWQnLFxuICBhY3RpdmUgPSAnYWN0aXZlJyxcbiAgYWxsID0gJ2FsbCcsXG4gIGFiYW5kb25lZCA9ICdhYmFuZG9uZWQnLFxufVxuXG5leHBvcnQgY29uc3QgYWRvU3RhdHVzTnVtYmVyVG9FbnVtTWFwID0ge1xuICAxOiBBZG9QdWxsUmVxdWVzdFN0YXR1c0VudW0uYWN0aXZlLFxuICAyOiBBZG9QdWxsUmVxdWVzdFN0YXR1c0VudW0uYWJhbmRvbmVkLFxuICAzOiBBZG9QdWxsUmVxdWVzdFN0YXR1c0VudW0uY29tcGxldGVkLFxuICA0OiBBZG9QdWxsUmVxdWVzdFN0YXR1c0VudW0uYWxsLFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWRvUHVsbFJlcXVlc3RTdGF0dXMoe1xuICBhY2Nlc3NUb2tlbixcbiAgdG9rZW5PcmcsXG4gIHJlcG9VcmwsXG4gIHByTnVtYmVyLFxufToge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gIHRva2VuT3JnOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgcmVwb1VybDogc3RyaW5nXG4gIHByTnVtYmVyOiBudW1iZXJcbn0pIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcHJvamVjdE5hbWUgfSA9IHBhcnNlQWRvT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gIGNvbnN0IGFwaSA9IGF3YWl0IGdldEFkb0FwaUNsaWVudCh7XG4gICAgYWNjZXNzVG9rZW4sXG4gICAgdG9rZW5PcmcsXG4gICAgb3JnTmFtZTogb3duZXIsXG4gIH0pXG4gIGNvbnN0IGdpdCA9IGF3YWl0IGFwaS5nZXRHaXRBcGkoKVxuICBjb25zdCByZXMgPSBhd2FpdCBnaXQuZ2V0UHVsbFJlcXVlc3QocmVwbywgcHJOdW1iZXIsIHByb2plY3ROYW1lKVxuICBpZiAoIXJlcy5zdGF0dXMgfHwgcmVzLnN0YXR1cyA8IDEgfHwgcmVzLnN0YXR1cyA+IDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwciBzdGF0dXMgZm9yIEFETycpXG4gIH1cbiAgcmV0dXJuIGFkb1N0YXR1c051bWJlclRvRW51bU1hcFtyZXMuc3RhdHVzXVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWRvSXNSZW1vdGVCcmFuY2goe1xuICBhY2Nlc3NUb2tlbixcbiAgdG9rZW5PcmcsXG4gIHJlcG9VcmwsXG4gIGJyYW5jaCxcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICB0b2tlbk9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHJlcG9Vcmw6IHN0cmluZ1xuICBicmFuY2g6IHN0cmluZ1xufSkge1xuICBjb25zdCB7IG93bmVyLCByZXBvLCBwcm9qZWN0TmFtZSB9ID0gcGFyc2VBZG9Pd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgYXBpID0gYXdhaXQgZ2V0QWRvQXBpQ2xpZW50KHtcbiAgICBhY2Nlc3NUb2tlbixcbiAgICB0b2tlbk9yZyxcbiAgICBvcmdOYW1lOiBvd25lcixcbiAgfSlcbiAgY29uc3QgZ2l0ID0gYXdhaXQgYXBpLmdldEdpdEFwaSgpXG4gIHRyeSB7XG4gICAgY29uc3QgYnJhbmNoU3RhdHVzID0gYXdhaXQgZ2l0LmdldEJyYW5jaChyZXBvLCBicmFuY2gsIHByb2plY3ROYW1lKVxuICAgIGlmICghYnJhbmNoU3RhdHVzIHx8ICFicmFuY2hTdGF0dXMuY29tbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcignbm8gYnJhbmNoIHN0YXR1cycpXG4gICAgfVxuICAgIHJldHVybiBicmFuY2hTdGF0dXMubmFtZSA9PT0gYnJhbmNoXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWRvUmVwb0xpc3Qoe1xuICBvcmdOYW1lLFxuICB0b2tlbk9yZyxcbiAgYWNjZXNzVG9rZW4sXG59OiB7XG4gIG9yZ05hbWU6IHN0cmluZyB8IHVuZGVmaW5lZFxuICB0b2tlbk9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbn0pIHtcbiAgbGV0IG9yZ3M6IHN0cmluZ1tdID0gW11cbiAgaWYgKGdldEFkb1Rva2VuVHlwZShhY2Nlc3NUb2tlbikgPT09IEFkb1Rva2VuVHlwZUVudW0uT0FVVEgpIHtcbiAgICBvcmdzID0gYXdhaXQgX2dldE9yZ3NGb3JPYXV0aFRva2VuKHsgb2F1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgfVxuICBpZiAob3Jncy5sZW5ndGggPT09IDAgJiYgIW9yZ05hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIG9yZ3MgZm9yIEFET2ApXG4gIH0gZWxzZSBpZiAob3Jncy5sZW5ndGggPT09IDAgJiYgb3JnTmFtZSkge1xuICAgIG9yZ3MgPSBbb3JnTmFtZSBhcyBzdHJpbmddXG4gIH1cbiAgY29uc3QgcmVwb3MgPSAoXG4gICAgYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKFxuICAgICAgb3Jncy5tYXAoYXN5bmMgKG9yZykgPT4ge1xuICAgICAgICBjb25zdCBvcmdBcGkgPSBhd2FpdCBnZXRBZG9BcGlDbGllbnQoe1xuICAgICAgICAgIGFjY2Vzc1Rva2VuLFxuICAgICAgICAgIHRva2VuT3JnLFxuICAgICAgICAgIG9yZ05hbWU6IG9yZyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgZ2l0T3JnID0gYXdhaXQgb3JnQXBpLmdldEdpdEFwaSgpXG4gICAgICAgIGNvbnN0IG9yZ1JlcG9zID0gYXdhaXQgZ2l0T3JnLmdldFJlcG9zaXRvcmllcygpXG4gICAgICAgIGNvbnN0IHJlcG9JbmZvTGlzdCA9IChcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQoXG4gICAgICAgICAgICBvcmdSZXBvcy5tYXAoYXN5bmMgKHJlcG8pID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFyZXBvLm5hbWUgfHwgIXJlcG8ucmVtb3RlVXJsIHx8ICFyZXBvLmRlZmF1bHRCcmFuY2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcignYmFkIHJlcG8nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IGJyYW5jaCA9IGF3YWl0IGdpdE9yZy5nZXRCcmFuY2goXG4gICAgICAgICAgICAgICAgcmVwby5uYW1lLFxuICAgICAgICAgICAgICAgIHJlcG8uZGVmYXVsdEJyYW5jaC5yZXBsYWNlKC9ecmVmc1xcL2hlYWRzXFwvLywgJycpLFxuICAgICAgICAgICAgICAgIHJlcG8ucHJvamVjdD8ubmFtZVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVwb05hbWU6IHJlcG8ubmFtZSxcbiAgICAgICAgICAgICAgICByZXBvVXJsOiByZXBvLnJlbW90ZVVybC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgL15baEhdW3RUXVt0VF1bcFBdW3NTXTpcXC9cXC9bXi9dK0AvLFxuICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vJ1xuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgcmVwb093bmVyOiBvcmcsXG4gICAgICAgICAgICAgICAgcmVwb0lzUHVibGljOiByZXBvLnByb2plY3Q/LnZpc2liaWxpdHkgPT09IDIsIC8vMiBpcyBwdWJsaWMgaW4gdGhlIEFETyBBUElcbiAgICAgICAgICAgICAgICByZXBvTGFuZ3VhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICByZXBvVXBkYXRlZEF0OlxuICAgICAgICAgICAgICAgICAgYnJhbmNoLmNvbW1pdD8uY29tbWl0dGVyPy5kYXRlPy50b0RhdGVTdHJpbmcoKSB8fFxuICAgICAgICAgICAgICAgICAgcmVwby5wcm9qZWN0Py5sYXN0VXBkYXRlVGltZT8udG9EYXRlU3RyaW5nKCkgfHxcbiAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKVxuICAgICAgICApLnJlZHVjZSgoYWNjLCByZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcpIHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHJlcy52YWx1ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICB9LCBbXSBhcyBTY21SZXBvSW5mb1tdKVxuICAgICAgICByZXR1cm4gcmVwb0luZm9MaXN0XG4gICAgICB9KVxuICAgIClcbiAgKS5yZWR1Y2UoKGFjYywgcmVzKSA9PiB7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09ICdmdWxmaWxsZWQnKSB7XG4gICAgICByZXR1cm4gYWNjLmNvbmNhdChyZXMudmFsdWUpXG4gICAgfVxuICAgIHJldHVybiBhY2NcbiAgfSwgW10gYXMgU2NtUmVwb0luZm9bXSlcbiAgcmV0dXJuIHJlcG9zXG59XG4vLyB0b2RvIGludGVncmF0ZSB0aGlzIHVybCBjcmVhdGlvbiB0aHJvdWdoIHRoZSBzZGtcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZG9QclVybCh7XG4gIHVybCxcbiAgcHJOdW1iZXIsXG59OiB7XG4gIHVybDogc3RyaW5nXG4gIHByTnVtYmVyOiBudW1iZXJcbn0pIHtcbiAgcmV0dXJuIGAke3VybH0vcHVsbHJlcXVlc3QvJHtwck51bWJlcn1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZG9Eb3dubG9hZFVybCh7XG4gIHJlcG9VcmwsXG4gIGJyYW5jaCxcbn06IHtcbiAgcmVwb1VybDogc3RyaW5nXG4gIGJyYW5jaDogc3RyaW5nXG59KSB7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG8sIHByb2plY3ROYW1lIH0gPSBwYXJzZUFkb093bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcG9VcmwpXG4gIGNvbnN0IG9yaWdpbiA9IHVybC5vcmlnaW4udG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnLnZpc3VhbHN0dWRpby5jb20nKVxuICAgID8gJ2h0dHBzOi8vZGV2LmF6dXJlLmNvbSdcbiAgICA6IHVybC5vcmlnaW4udG9Mb3dlckNhc2UoKVxuICByZXR1cm4gYCR7b3JpZ2lufS8ke293bmVyfS8ke3Byb2plY3ROYW1lfS9fYXBpcy9naXQvcmVwb3NpdG9yaWVzLyR7cmVwb30vaXRlbXMvaXRlbXM/cGF0aD0vJnZlcnNpb25EZXNjcmlwdG9yW3ZlcnNpb25PcHRpb25zXT0wJnZlcnNpb25EZXNjcmlwdG9yW3ZlcnNpb25UeXBlXT1jb21taXQmdmVyc2lvbkRlc2NyaXB0b3JbdmVyc2lvbl09JHticmFuY2h9JnJlc29sdmVMZnM9dHJ1ZSYkZm9ybWF0PXppcCZhcGktdmVyc2lvbj01LjAmZG93bmxvYWQ9dHJ1ZWBcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFkb0JyYW5jaExpc3Qoe1xuICBhY2Nlc3NUb2tlbixcbiAgdG9rZW5PcmcsXG4gIHJlcG9VcmwsXG59OiB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgdG9rZW5Pcmc6IHN0cmluZyB8IHVuZGVmaW5lZFxuICByZXBvVXJsOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcHJvamVjdE5hbWUgfSA9IHBhcnNlQWRvT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gIGNvbnN0IGFwaSA9IGF3YWl0IGdldEFkb0FwaUNsaWVudCh7XG4gICAgYWNjZXNzVG9rZW4sXG4gICAgdG9rZW5PcmcsXG4gICAgb3JnTmFtZTogb3duZXIsXG4gIH0pXG4gIGNvbnN0IGdpdCA9IGF3YWl0IGFwaS5nZXRHaXRBcGkoKVxuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdpdC5nZXRCcmFuY2hlcyhyZXBvLCBwcm9qZWN0TmFtZSlcbiAgICByZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKCFhLmNvbW1pdD8uY29tbWl0dGVyPy5kYXRlIHx8ICFiLmNvbW1pdD8uY29tbWl0dGVyPy5kYXRlKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICBiLmNvbW1pdD8uY29tbWl0dGVyPy5kYXRlLmdldFRpbWUoKSAtXG4gICAgICAgIGEuY29tbWl0Py5jb21taXR0ZXI/LmRhdGUuZ2V0VGltZSgpXG4gICAgICApXG4gICAgfSlcbiAgICByZXR1cm4gcmVzLnJlZHVjZSgoYWNjLCBicmFuY2gpID0+IHtcbiAgICAgIGlmICghYnJhbmNoLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfVxuICAgICAgYWNjLnB1c2goYnJhbmNoLm5hbWUpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwgW10gYXMgc3RyaW5nW10pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQWRvUHVsbFJlcXVlc3Qob3B0aW9uczoge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gIHRva2VuT3JnOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nXG4gIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZ1xuICB0aXRsZTogc3RyaW5nXG4gIGJvZHk6IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcHJvamVjdE5hbWUgfSA9IHBhcnNlQWRvT3duZXJBbmRSZXBvKG9wdGlvbnMucmVwb1VybClcbiAgY29uc3QgYXBpID0gYXdhaXQgZ2V0QWRvQXBpQ2xpZW50KHtcbiAgICBhY2Nlc3NUb2tlbjogb3B0aW9ucy5hY2Nlc3NUb2tlbixcbiAgICB0b2tlbk9yZzogb3B0aW9ucy50b2tlbk9yZyxcbiAgICBvcmdOYW1lOiBvd25lcixcbiAgfSlcbiAgY29uc3QgZ2l0ID0gYXdhaXQgYXBpLmdldEdpdEFwaSgpXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdpdC5jcmVhdGVQdWxsUmVxdWVzdChcbiAgICB7XG4gICAgICBzb3VyY2VSZWZOYW1lOiBgcmVmcy9oZWFkcy8ke29wdGlvbnMuc291cmNlQnJhbmNoTmFtZX1gLFxuICAgICAgdGFyZ2V0UmVmTmFtZTogYHJlZnMvaGVhZHMvJHtvcHRpb25zLnRhcmdldEJyYW5jaE5hbWV9YCxcbiAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlLFxuICAgICAgZGVzY3JpcHRpb246IG9wdGlvbnMuYm9keSxcbiAgICB9LFxuICAgIHJlcG8sXG4gICAgcHJvamVjdE5hbWVcbiAgKVxuICByZXR1cm4gcmVzLnB1bGxSZXF1ZXN0SWRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFkb1JlcG9EZWZhdWx0QnJhbmNoKHtcbiAgcmVwb1VybCxcbiAgdG9rZW5PcmcsXG4gIGFjY2Vzc1Rva2VuLFxufToge1xuICByZXBvVXJsOiBzdHJpbmdcbiAgdG9rZW5Pcmc6IHN0cmluZyB8IHVuZGVmaW5lZFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG59KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcHJvamVjdE5hbWUgfSA9IHBhcnNlQWRvT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gIGNvbnN0IGFwaSA9IGF3YWl0IGdldEFkb0FwaUNsaWVudCh7XG4gICAgYWNjZXNzVG9rZW4sXG4gICAgdG9rZW5PcmcsXG4gICAgb3JnTmFtZTogb3duZXIsXG4gIH0pXG4gIGNvbnN0IGdpdCA9IGF3YWl0IGFwaS5nZXRHaXRBcGkoKVxuICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IGdpdC5nZXRCcmFuY2hlcyhyZXBvLCBwcm9qZWN0TmFtZSlcbiAgaWYgKCFicmFuY2hlcyB8fCBicmFuY2hlcy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcignbm8gYnJhbmNoZXMnKVxuICB9XG4gIGNvbnN0IHJlcyA9IGJyYW5jaGVzLmZpbmQoKGJyYW5jaCkgPT4gYnJhbmNoLmlzQmFzZVZlcnNpb24pXG4gIGlmICghcmVzIHx8ICFyZXMubmFtZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkUmVwb1VybEVycm9yKCdubyBkZWZhdWx0IGJyYW5jaCcpXG4gIH1cbiAgcmV0dXJuIHJlcy5uYW1lXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBZG9SZWZlcmVuY2VEYXRhKHtcbiAgcmVmLFxuICByZXBvVXJsLFxuICBhY2Nlc3NUb2tlbixcbiAgdG9rZW5PcmcsXG59OiB7XG4gIHJlZjogc3RyaW5nXG4gIHJlcG9Vcmw6IHN0cmluZ1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHRva2VuT3JnOiBzdHJpbmcgfCB1bmRlZmluZWRcbn0pIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcHJvamVjdE5hbWUgfSA9IHBhcnNlQWRvT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gIGNvbnN0IGFwaSA9IGF3YWl0IGdldEFkb0FwaUNsaWVudCh7XG4gICAgYWNjZXNzVG9rZW4sXG4gICAgdG9rZW5PcmcsXG4gICAgb3JnTmFtZTogb3duZXIsXG4gIH0pXG4gIGlmICghcHJvamVjdE5hbWUpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFVybFBhdHRlcm5FcnJvcignbm8gcHJvamVjdCBuYW1lJylcbiAgfVxuICBjb25zdCBnaXQgPSBhd2FpdCBhcGkuZ2V0R2l0QXBpKClcbiAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChbXG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdpdC5nZXRCcmFuY2gocmVwbywgcmVmLCBwcm9qZWN0TmFtZSlcbiAgICAgIGlmICghcmVzLmNvbW1pdCB8fCAhcmVzLmNvbW1pdC5jb21taXRJZCkge1xuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcignbm8gY29tbWl0IG9uIGJyYW5jaCcpXG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzaGE6IHJlcy5jb21taXQuY29tbWl0SWQsXG4gICAgICAgIHR5cGU6IFJlZmVyZW5jZVR5cGUuQlJBTkNILFxuICAgICAgICBkYXRlOiByZXMuY29tbWl0LmNvbW1pdHRlcj8uZGF0ZSB8fCBuZXcgRGF0ZSgpLFxuICAgICAgfVxuICAgIH0pKCksXG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdpdC5nZXRDb21taXRzKFxuICAgICAgICByZXBvLFxuICAgICAgICB7XG4gICAgICAgICAgZnJvbUNvbW1pdElkOiByZWYsXG4gICAgICAgICAgdG9Db21taXRJZDogcmVmLFxuICAgICAgICAgICR0b3A6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHByb2plY3ROYW1lXG4gICAgICApXG4gICAgICBjb25zdCBjb21taXQgPSByZXNbMF1cbiAgICAgIGlmICghY29tbWl0IHx8ICFjb21taXQuY29tbWl0SWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBjb21taXQnKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhOiBjb21taXQuY29tbWl0SWQsXG4gICAgICAgIHR5cGU6IFJlZmVyZW5jZVR5cGUuQ09NTUlULFxuICAgICAgICBkYXRlOiBjb21taXQuY29tbWl0dGVyPy5kYXRlIHx8IG5ldyBEYXRlKCksXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZ2l0LmdldFJlZnMocmVwbywgcHJvamVjdE5hbWUsIGB0YWdzLyR7cmVmfWApXG4gICAgICBpZiAoIXJlc1swXSB8fCAhcmVzWzBdLm9iamVjdElkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdGFnIHJlZicpXG4gICAgICB9XG4gICAgICBsZXQgb2JqZWN0SWQgPSByZXNbMF0ub2JqZWN0SWRcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vaW4gc29tZSBjYXNlcyB0aGUgY2FsbCB0byBnaXQuZ2V0UmVmcygpIHJldHVybnMgdGhlIHNoYSBvZiB0aGUgY29tbWl0IGluIHRoZSBvYmplY3RJZCBhbmQgaW4gc29tZSBjYXNlc1xuICAgICAgICAvL2l0IHJldHVybnMgdGhlIHRhZyBvYmplY3QgSUQgd2hpY2ggd2UgdGhlbiBuZWVkIHRvIGNhbGwgZ2l0LmdldEFubm90YXRlZFRhZygpIG9uIGl0XG4gICAgICAgIGNvbnN0IHRhZyA9IGF3YWl0IGdpdC5nZXRBbm5vdGF0ZWRUYWcocHJvamVjdE5hbWUsIHJlcG8sIG9iamVjdElkKVxuICAgICAgICBpZiAodGFnLnRhZ2dlZE9iamVjdD8ub2JqZWN0SWQpIHtcbiAgICAgICAgICBvYmplY3RJZCA9IHRhZy50YWdnZWRPYmplY3Qub2JqZWN0SWRcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfVxuICAgICAgY29uc3QgY29tbWl0UmVzID0gYXdhaXQgZ2l0LmdldENvbW1pdHMoXG4gICAgICAgIHJlcG8sXG4gICAgICAgIHtcbiAgICAgICAgICBmcm9tQ29tbWl0SWQ6IG9iamVjdElkLFxuICAgICAgICAgIHRvQ29tbWl0SWQ6IG9iamVjdElkLFxuICAgICAgICAgICR0b3A6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHByb2plY3ROYW1lXG4gICAgICApXG4gICAgICBjb25zdCBjb21taXQgPSBjb21taXRSZXNbMF1cbiAgICAgIGlmICghY29tbWl0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gY29tbWl0JylcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNoYTogb2JqZWN0SWQsXG4gICAgICAgIHR5cGU6IFJlZmVyZW5jZVR5cGUuVEFHLFxuICAgICAgICBkYXRlOiBjb21taXQuY29tbWl0dGVyPy5kYXRlIHx8IG5ldyBEYXRlKCksXG4gICAgICB9XG4gICAgfSkoKSxcbiAgXSlcbiAgY29uc3QgW2JyYW5jaFJlcywgY29tbWl0UmVzLCB0YWdSZXNdID0gcmVzdWx0c1xuICBpZiAodGFnUmVzLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcpIHtcbiAgICByZXR1cm4gdGFnUmVzLnZhbHVlXG4gIH1cbiAgaWYgKGJyYW5jaFJlcy5zdGF0dXMgPT09ICdmdWxmaWxsZWQnKSB7XG4gICAgcmV0dXJuIGJyYW5jaFJlcy52YWx1ZVxuICB9XG4gIGlmIChjb21taXRSZXMuc3RhdHVzID09PSAnZnVsZmlsbGVkJykge1xuICAgIHJldHVybiBjb21taXRSZXMudmFsdWVcbiAgfVxuICB0aHJvdyBuZXcgUmVmTm90Rm91bmRFcnJvcihgcmVmOiAke3JlZn0gZG9lcyBub3QgZXhpc3RgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBZG9Pd25lckFuZFJlcG8oYWRvVXJsOiBzdHJpbmcpIHtcbiAgYWRvVXJsID0gcmVtb3ZlVHJhaWxpbmdTbGFzaChhZG9VcmwpXG4gIGNvbnN0IHBhcnNpbmdSZXN1bHQgPSBwYXJzZVNjbVVSTChhZG9VcmwsIFNjbVR5cGUuQWRvKVxuXG4gIGlmIChcbiAgICAhcGFyc2luZ1Jlc3VsdCB8fFxuICAgIChwYXJzaW5nUmVzdWx0Lmhvc3RuYW1lICE9PSAnZGV2LmF6dXJlLmNvbScgJiZcbiAgICAgICFwYXJzaW5nUmVzdWx0Lmhvc3RuYW1lLmVuZHNXaXRoKCcudmlzdWFsc3R1ZGlvLmNvbScpKVxuICApIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFVybFBhdHRlcm5FcnJvcihgaW52YWxpZCBBRE8gcmVwbyBVUkw6ICR7YWRvVXJsfWApXG4gIH1cblxuICBjb25zdCB7IG9yZ2FuaXphdGlvbiwgcmVwb05hbWUsIHByb2plY3ROYW1lLCBwcm9qZWN0UGF0aCwgcGF0aEVsZW1lbnRzIH0gPVxuICAgIHBhcnNpbmdSZXN1bHRcbiAgcmV0dXJuIHtcbiAgICBvd25lcjogb3JnYW5pemF0aW9uLFxuICAgIHJlcG86IHJlcG9OYW1lLFxuICAgIHByb2plY3ROYW1lLFxuICAgIHByb2plY3RQYXRoLFxuICAgIHBhdGhFbGVtZW50cyxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWRvQmxhbWVSYW5nZXMoKSB7XG4gIHJldHVybiBbXVxufVxuXG5jb25zdCBBRE9fQUNDRVNTX1RPS0VOX1VSTCA9ICdodHRwczovL2FwcC52c3Nwcy52aXN1YWxzdHVkaW8uY29tL29hdXRoMi90b2tlbidcblxuZXhwb3J0IGVudW0gQWRvVG9rZW5SZXF1ZXN0VHlwZUVudW0ge1xuICBDT0RFID0gJ2NvZGUnLFxuICBSRUZSRVNIX1RPS0VOID0gJ3JlZnJlc2hfdG9rZW4nLFxufVxuXG5jb25zdCBBZG9BdXRoUmVzdWx0WiA9IHoub2JqZWN0KHtcbiAgYWNjZXNzX3Rva2VuOiB6LnN0cmluZygpLm1pbigxKSxcbiAgdG9rZW5fdHlwZTogei5zdHJpbmcoKS5taW4oMSksXG4gIHJlZnJlc2hfdG9rZW46IHouc3RyaW5nKCkubWluKDEpLFxufSlcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFkb1Rva2VuKHtcbiAgdG9rZW4sXG4gIGFkb0NsaWVudFNlY3JldCxcbiAgdG9rZW5UeXBlLFxuICByZWRpcmVjdFVyaSxcbn06IHtcbiAgdG9rZW46IHN0cmluZ1xuICBhZG9DbGllbnRTZWNyZXQ6IHN0cmluZ1xuICB0b2tlblR5cGU6IEFkb1Rva2VuUmVxdWVzdFR5cGVFbnVtXG4gIHJlZGlyZWN0VXJpOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goQURPX0FDQ0VTU19UT0tFTl9VUkwsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICB9LFxuICAgIGJvZHk6IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh7XG4gICAgICBjbGllbnRfYXNzZXJ0aW9uX3R5cGU6XG4gICAgICAgICd1cm46aWV0ZjpwYXJhbXM6b2F1dGg6Y2xpZW50LWFzc2VydGlvbi10eXBlOmp3dC1iZWFyZXInLFxuICAgICAgY2xpZW50X2Fzc2VydGlvbjogYWRvQ2xpZW50U2VjcmV0LFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdFVyaSxcbiAgICAgIGFzc2VydGlvbjogdG9rZW4sXG4gICAgICBncmFudF90eXBlOlxuICAgICAgICB0b2tlblR5cGUgPT09IEFkb1Rva2VuUmVxdWVzdFR5cGVFbnVtLkNPREVcbiAgICAgICAgICA/ICd1cm46aWV0ZjpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTpqd3QtYmVhcmVyJ1xuICAgICAgICAgIDogJ3JlZnJlc2hfdG9rZW4nLFxuICAgIH0pLFxuICB9KVxuICBjb25zdCBhdXRoUmVzdWx0ID0gYXdhaXQgcmVzLmpzb24oKVxuICByZXR1cm4gQWRvQXV0aFJlc3VsdFoucGFyc2UoYXV0aFJlc3VsdClcbn1cbiJdfQ==