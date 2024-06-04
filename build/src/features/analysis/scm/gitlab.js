"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitlabToken = exports.GitlabTokenRequestTypeEnum = exports.getGitlabBlameRanges = exports.parseGitlabOwnerAndRepo = exports.getGitlabReferenceData = exports.getGitlabRepoDefaultBranch = exports.createMergeRequest = exports.getGitlabBranchList = exports.getGitlabRepoList = exports.getGitlabIsRemoteBranch = exports.getGitlabMergeRequestStatus = exports.GitlabMergeRequestStatusEnum = exports.getGitlabIsUserCollaborator = exports.getGitlabUsername = exports.gitlabValidateParams = void 0;
const node_querystring_1 = __importDefault(require("node:querystring"));
const rest_1 = require("@gitbeaker/rest");
const undici_1 = require("undici");
const zod_1 = require("zod");
const scm_1 = require("./scm");
const urlParser_1 = require("./urlParser");
function removeTrailingSlash(str) {
    return str.trim().replace(/\/+$/, '');
}
const EnvVariablesZod = zod_1.z.object({
    GITLAB_API_TOKEN: zod_1.z.string().optional(),
});
const { GITLAB_API_TOKEN } = EnvVariablesZod.parse(process.env);
function getGitBeaker(options) {
    const token = options?.gitlabAuthToken ?? GITLAB_API_TOKEN ?? '';
    const url = options.url;
    let host = 'https://gitlab.com';
    if (url) {
        const urlObj = new URL(url);
        host = urlObj.origin;
    }
    if (token?.startsWith('glpat-') || token === '') {
        return new rest_1.Gitlab({ token, host });
    }
    return new rest_1.Gitlab({ oauthToken: token, host });
}
async function gitlabValidateParams({ url, accessToken, }) {
    try {
        const api = getGitBeaker({ url, gitlabAuthToken: accessToken });
        if (accessToken) {
            await api.Users.showCurrentUser();
        }
        if (url) {
            const { projectPath } = parseGitlabOwnerAndRepo(url);
            await api.Projects.show(projectPath);
        }
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
            throw new scm_1.InvalidAccessTokenError(`invalid gitlab access token`);
        }
        if (code === 404 ||
            description.includes('404') ||
            description.includes('Not Found')) {
            throw new scm_1.InvalidRepoUrlError(`invalid gitlab repo URL: ${url}`);
        }
        throw e;
    }
}
exports.gitlabValidateParams = gitlabValidateParams;
async function getGitlabUsername(url, accessToken) {
    const api = getGitBeaker({ url, gitlabAuthToken: accessToken });
    const res = await api.Users.showCurrentUser();
    return res.username;
}
exports.getGitlabUsername = getGitlabUsername;
async function getGitlabIsUserCollaborator({ username, accessToken, repoUrl, }) {
    try {
        const { projectPath } = parseGitlabOwnerAndRepo(repoUrl);
        const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken });
        const res = await api.Projects.show(projectPath);
        const members = await api.ProjectMembers.all(res.id, {
            includeInherited: true,
        });
        return !!members.find((member) => member.username === username);
    }
    catch (e) {
        return false;
    }
}
exports.getGitlabIsUserCollaborator = getGitlabIsUserCollaborator;
var GitlabMergeRequestStatusEnum;
(function (GitlabMergeRequestStatusEnum) {
    GitlabMergeRequestStatusEnum["merged"] = "merged";
    GitlabMergeRequestStatusEnum["opened"] = "opened";
    GitlabMergeRequestStatusEnum["closed"] = "closed";
})(GitlabMergeRequestStatusEnum = exports.GitlabMergeRequestStatusEnum || (exports.GitlabMergeRequestStatusEnum = {}));
async function getGitlabMergeRequestStatus({ accessToken, repoUrl, mrNumber, }) {
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl);
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken });
    const res = await api.MergeRequests.show(projectPath, mrNumber);
    switch (res.state) {
        case GitlabMergeRequestStatusEnum.merged:
        case GitlabMergeRequestStatusEnum.opened:
        case GitlabMergeRequestStatusEnum.closed:
            return res.state;
        default:
            throw new Error(`unknown merge request state ${res.state}`);
    }
}
exports.getGitlabMergeRequestStatus = getGitlabMergeRequestStatus;
async function getGitlabIsRemoteBranch({ accessToken, repoUrl, branch, }) {
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl);
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken });
    try {
        const res = await api.Branches.show(projectPath, branch);
        return res.name === branch;
    }
    catch (e) {
        return false;
    }
}
exports.getGitlabIsRemoteBranch = getGitlabIsRemoteBranch;
async function getGitlabRepoList(url, accessToken) {
    const api = getGitBeaker({ url, gitlabAuthToken: accessToken });
    const res = await api.Projects.all({
        membership: true,
        //TODO: a bug in the sorting mechanism of this api call
        //disallows us to sort by updated_at in descending order
        //so we have to sort by updated_at in ascending order.
        //We can wait for the bug to be fixed or call the api
        //directly with fetch()
        sort: 'asc',
        orderBy: 'updated_at',
        perPage: 100,
    });
    return Promise.all(res.map(async (project) => {
        const proj = await api.Projects.show(project.id);
        const owner = proj.namespace.name;
        const repoLanguages = await api.Projects.showLanguages(project.id);
        return {
            repoName: project.path,
            repoUrl: project.web_url,
            repoOwner: owner,
            repoLanguages: Object.keys(repoLanguages),
            repoIsPublic: project.visibility === 'public',
            repoUpdatedAt: project.last_activity_at,
        };
    }));
}
exports.getGitlabRepoList = getGitlabRepoList;
async function getGitlabBranchList({ accessToken, repoUrl, }) {
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl);
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken });
    try {
        //TODO: JONATHANA need to play with the parameters here to get all branches as it is sometimes stuck
        //depending on the parameters and the number of branches. It sometimes just hangs...
        const res = await api.Branches.all(projectPath, {
            perPage: 100,
            pagination: 'keyset',
            orderBy: 'updated_at',
            sort: 'dec',
        });
        return res.map((branch) => branch.name);
    }
    catch (e) {
        return [];
    }
}
exports.getGitlabBranchList = getGitlabBranchList;
async function createMergeRequest(options) {
    const { projectPath } = parseGitlabOwnerAndRepo(options.repoUrl);
    const api = getGitBeaker({
        url: options.repoUrl,
        gitlabAuthToken: options.accessToken,
    });
    const res = await api.MergeRequests.create(projectPath, options.sourceBranchName, options.targetBranchName, options.title, {
        description: options.body,
    });
    return res.iid;
}
exports.createMergeRequest = createMergeRequest;
async function getGitlabRepoDefaultBranch(repoUrl, options) {
    const api = getGitBeaker({
        url: repoUrl,
        gitlabAuthToken: options?.gitlabAuthToken,
    });
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl);
    const project = await api.Projects.show(projectPath);
    if (!project.default_branch) {
        throw new Error('no default branch');
    }
    return project.default_branch;
}
exports.getGitlabRepoDefaultBranch = getGitlabRepoDefaultBranch;
async function getGitlabReferenceData({ ref, gitlabUrl }, options) {
    const { projectPath } = parseGitlabOwnerAndRepo(gitlabUrl);
    const api = getGitBeaker({
        url: gitlabUrl,
        gitlabAuthToken: options?.gitlabAuthToken,
    });
    const results = await Promise.allSettled([
        (async () => {
            const res = await api.Branches.show(projectPath, ref);
            return {
                sha: res.commit.id,
                type: scm_1.ReferenceType.BRANCH,
                date: res.commit.committed_date
                    ? new Date(res.commit.committed_date)
                    : undefined,
            };
        })(),
        (async () => {
            const res = await api.Commits.show(projectPath, ref);
            return {
                sha: res.id,
                type: scm_1.ReferenceType.COMMIT,
                date: res.committed_date ? new Date(res.committed_date) : undefined,
            };
        })(),
        (async () => {
            const res = await api.Tags.show(projectPath, ref);
            return {
                sha: res.commit.id,
                type: scm_1.ReferenceType.TAG,
                date: res.commit.committed_date
                    ? new Date(res.commit.committed_date)
                    : undefined,
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
exports.getGitlabReferenceData = getGitlabReferenceData;
function parseGitlabOwnerAndRepo(gitlabUrl) {
    gitlabUrl = removeTrailingSlash(gitlabUrl);
    const parsingResult = (0, urlParser_1.parseScmURL)(gitlabUrl, scm_1.ScmType.GitLab);
    if (!parsingResult || !parsingResult.repoName) {
        throw new scm_1.InvalidUrlPatternError(`invalid gitlab repo Url ${gitlabUrl}`);
    }
    const { organization, repoName, projectPath } = parsingResult;
    return { owner: organization, repo: repoName, projectPath };
}
exports.parseGitlabOwnerAndRepo = parseGitlabOwnerAndRepo;
async function getGitlabBlameRanges({ ref, gitlabUrl, path }, options) {
    const { projectPath } = parseGitlabOwnerAndRepo(gitlabUrl);
    const api = getGitBeaker({
        url: gitlabUrl,
        gitlabAuthToken: options?.gitlabAuthToken,
    });
    const resp = await api.RepositoryFiles.allFileBlames(projectPath, path, ref);
    let lineNumber = 1;
    return resp
        .filter((range) => range.lines)
        .map((range) => {
        const oldLineNumber = lineNumber;
        if (!range.lines) {
            throw new Error('range.lines should not be undefined');
        }
        lineNumber += range.lines.length;
        return {
            startingLine: oldLineNumber,
            endingLine: lineNumber - 1,
            login: range.commit.author_email,
            email: range.commit.author_email,
            name: range.commit.author_name,
        };
    });
}
exports.getGitlabBlameRanges = getGitlabBlameRanges;
const GITLAB_ACCESS_TOKEN_URL = 'https://gitlab.com/oauth/token';
const GitlabAuthResultZ = zod_1.z.object({
    access_token: zod_1.z.string(),
    token_type: zod_1.z.string(),
    refresh_token: zod_1.z.string(),
});
var GitlabTokenRequestTypeEnum;
(function (GitlabTokenRequestTypeEnum) {
    GitlabTokenRequestTypeEnum["CODE"] = "code";
    GitlabTokenRequestTypeEnum["REFRESH_TOKEN"] = "refresh_token";
})(GitlabTokenRequestTypeEnum = exports.GitlabTokenRequestTypeEnum || (exports.GitlabTokenRequestTypeEnum = {}));
async function getGitlabToken({ token, gitlabClientId, gitlabClientSecret, callbackUrl, tokenType, }) {
    const res = await fetch(GITLAB_ACCESS_TOKEN_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: node_querystring_1.default.stringify({
            client_id: gitlabClientId,
            client_secret: gitlabClientSecret,
            [tokenType]: token,
            grant_type: tokenType === GitlabTokenRequestTypeEnum.CODE
                ? 'authorization_code'
                : 'refresh_token',
            redirect_uri: callbackUrl,
        }),
    });
    const authResult = await res.json();
    return GitlabAuthResultZ.parse(authResult);
}
exports.getGitlabToken = getGitlabToken;
function initGitlabFetchMock() {
    const globalFetch = global.fetch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function myFetch(input, init) {
        const stack = new Error().stack;
        const parts = stack?.split('at ');
        try {
            if (parts?.length &&
                parts?.length >= 2 &&
                parts[2]?.startsWith('defaultRequestHandler (') &&
                parts[2]?.includes('/@gitbeaker/rest/dist/index.js') &&
                (/^https?:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\//i.test(input?.url) ||
                    ('GITLAB_INTERNAL_DEV_HOST' in process.env &&
                        process.env['GITLAB_INTERNAL_DEV_HOST'] &&
                        input?.url?.startsWith(process.env['GITLAB_INTERNAL_DEV_HOST'])))) {
                const dispatcher = new undici_1.ProxyAgent(process.env['GIT_PROXY_HOST'] || 'http://tinyproxy:8888');
                return globalFetch(input, { dispatcher });
            }
        }
        catch (e) {
            /* empty */
        }
        return globalFetch(input, init);
    }
    global.fetch = myFetch;
}
initGitlabFetchMock();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0bGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9naXRsYWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0VBQTBDO0FBRTFDLDBDQUF3QztBQUN4QyxtQ0FBbUM7QUFDbkMsNkJBQXVCO0FBRXZCLCtCQU9jO0FBQ2QsMkNBQXlDO0FBRXpDLFNBQVMsbUJBQW1CLENBQUMsR0FBVztJQUN0QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQy9CLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDeEMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFPL0QsU0FBUyxZQUFZLENBQUMsT0FBdUI7SUFDM0MsTUFBTSxLQUFLLEdBQUcsT0FBTyxFQUFFLGVBQWUsSUFBSSxnQkFBZ0IsSUFBSSxFQUFFLENBQUE7SUFDaEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQTtJQUN2QixJQUFJLElBQUksR0FBRyxvQkFBb0IsQ0FBQTtJQUMvQixJQUFJLEdBQUcsRUFBRTtRQUNQLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO0tBQ3JCO0lBQ0QsSUFBSSxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7UUFDL0MsT0FBTyxJQUFJLGFBQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJ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RUFBRSxFQUFFLFVBQVUsRUFBaUIsQ0FBQyxDQUFBO2FBQ3pEO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLFdBQVc7U0FDWjtRQUNELE9BQU8sV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUE7QUFDeEIsQ0FBQztBQUVELG1CQUFtQixFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAnbm9kZTpxdWVyeXN0cmluZydcblxuaW1wb3J0IHsgR2l0bGFiIH0gZnJvbSAnQGdpdGJlYWtlci9yZXN0J1xuaW1wb3J0IHsgUHJveHlBZ2VudCB9IGZyb20gJ3VuZGljaSdcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnXG5cbmltcG9ydCB7XG4gIEludmFsaWRBY2Nlc3NUb2tlbkVycm9yLFxuICBJbnZhbGlkUmVwb1VybEVycm9yLFxuICBJbnZhbGlkVXJsUGF0dGVybkVycm9yLFxuICBSZWZlcmVuY2VUeXBlLFxuICBSZWZOb3RGb3VuZEVycm9yLFxuICBTY21UeXBlLFxufSBmcm9tICcuL3NjbSdcbmltcG9ydCB7IHBhcnNlU2NtVVJMIH0gZnJvbSAnLi91cmxQYXJzZXInXG5cbmZ1bmN0aW9uIHJlbW92ZVRyYWlsaW5nU2xhc2goc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHN0ci50cmltKCkucmVwbGFjZSgvXFwvKyQvLCAnJylcbn1cblxuY29uc3QgRW52VmFyaWFibGVzWm9kID0gei5vYmplY3Qoe1xuICBHSVRMQUJfQVBJX1RPS0VOOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KVxuXG5jb25zdCB7IEdJVExBQl9BUElfVE9LRU4gfSA9IEVudlZhcmlhYmxlc1pvZC5wYXJzZShwcm9jZXNzLmVudilcblxudHlwZSBBcGlBdXRoT3B0aW9ucyA9IHtcbiAgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgZ2l0bGFiQXV0aFRva2VuPzogc3RyaW5nIHwgdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIGdldEdpdEJlYWtlcihvcHRpb25zOiBBcGlBdXRoT3B0aW9ucykge1xuICBjb25zdCB0b2tlbiA9IG9wdGlvbnM/LmdpdGxhYkF1dGhUb2tlbiA/PyBHSVRMQUJfQVBJX1RPS0VOID8/ICcnXG4gIGNvbnN0IHVybCA9IG9wdGlvbnMudXJsXG4gIGxldCBob3N0ID0gJ2h0dHBzOi8vZ2l0bGFiLmNvbSdcbiAgaWYgKHVybCkge1xuICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwodXJsKVxuICAgIGhvc3QgPSB1cmxPYmoub3JpZ2luXG4gIH1cbiAgaWYgKHRva2VuPy5zdGFydHNXaXRoKCdnbHBhdC0nKSB8fCB0b2tlbiA9PT0gJycpIHtcbiAgICByZXR1cm4gbmV3IEdpdGxhYih7IHRva2VuLCBob3N0IH0pXG4gIH1cbiAgcmV0dXJuIG5ldyBHaXRsYWIoeyBvYXV0aFRva2VuOiB0b2tlbiwgaG9zdCB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2l0bGFiVmFsaWRhdGVQYXJhbXMoe1xuICB1cmwsXG4gIGFjY2Vzc1Rva2VuLFxufToge1xuICB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG59KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHsgdXJsLCBnaXRsYWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gICAgaWYgKGFjY2Vzc1Rva2VuKSB7XG4gICAgICBhd2FpdCBhcGkuVXNlcnMuc2hvd0N1cnJlbnRVc2VyKClcbiAgICB9XG4gICAgaWYgKHVybCkge1xuICAgICAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8odXJsKVxuICAgICAgYXdhaXQgYXBpLlByb2plY3RzLnNob3cocHJvamVjdFBhdGgpXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgZXJyb3IgPSBlIGFzIHtcbiAgICAgIGNvZGU/OiBzdHJpbmdcbiAgICAgIHN0YXR1cz86IG51bWJlclxuICAgICAgc3RhdHVzQ29kZT86IG51bWJlclxuICAgICAgcmVzcG9uc2U/OiB7IHN0YXR1cz86IG51bWJlcjsgc3RhdHVzQ29kZT86IG51bWJlcjsgY29kZT86IHN0cmluZyB9XG4gICAgICBkZXNjcmlwdGlvbj86IHN0cmluZ1xuICAgIH1cbiAgICBjb25zdCBjb2RlID1cbiAgICAgIGVycm9yLmNvZGUgfHxcbiAgICAgIGVycm9yLnN0YXR1cyB8fFxuICAgICAgZXJyb3Iuc3RhdHVzQ29kZSB8fFxuICAgICAgZXJyb3IucmVzcG9uc2U/LnN0YXR1cyB8fFxuICAgICAgZXJyb3IucmVzcG9uc2U/LnN0YXR1c0NvZGUgfHxcbiAgICAgIGVycm9yLnJlc3BvbnNlPy5jb2RlXG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGVycm9yLmRlc2NyaXB0aW9uIHx8IGAke2V9YFxuICAgIGlmIChcbiAgICAgIGNvZGUgPT09IDQwMSB8fFxuICAgICAgY29kZSA9PT0gNDAzIHx8XG4gICAgICBkZXNjcmlwdGlvbi5pbmNsdWRlcygnNDAxJykgfHxcbiAgICAgIGRlc2NyaXB0aW9uLmluY2x1ZGVzKCc0MDMnKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRBY2Nlc3NUb2tlbkVycm9yKGBpbnZhbGlkIGdpdGxhYiBhY2Nlc3MgdG9rZW5gKVxuICAgIH1cbiAgICBpZiAoXG4gICAgICBjb2RlID09PSA0MDQgfHxcbiAgICAgIGRlc2NyaXB0aW9uLmluY2x1ZGVzKCc0MDQnKSB8fFxuICAgICAgZGVzY3JpcHRpb24uaW5jbHVkZXMoJ05vdCBGb3VuZCcpXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcihgaW52YWxpZCBnaXRsYWIgcmVwbyBVUkw6ICR7dXJsfWApXG4gICAgfVxuICAgIHRocm93IGVcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiVXNlcm5hbWUoXG4gIHVybDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4pIHtcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHsgdXJsLCBnaXRsYWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5Vc2Vycy5zaG93Q3VycmVudFVzZXIoKVxuICByZXR1cm4gcmVzLnVzZXJuYW1lXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRsYWJJc1VzZXJDb2xsYWJvcmF0b3Ioe1xuICB1c2VybmFtZSxcbiAgYWNjZXNzVG9rZW4sXG4gIHJlcG9VcmwsXG59OiB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbn0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICAgIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7IHVybDogcmVwb1VybCwgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLlByb2plY3RzLnNob3cocHJvamVjdFBhdGgpXG4gICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGFwaS5Qcm9qZWN0TWVtYmVycy5hbGwocmVzLmlkLCB7XG4gICAgICBpbmNsdWRlSW5oZXJpdGVkOiB0cnVlLFxuICAgIH0pXG4gICAgcmV0dXJuICEhbWVtYmVycy5maW5kKChtZW1iZXIpID0+IG1lbWJlci51c2VybmFtZSA9PT0gdXNlcm5hbWUpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZW51bSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtIHtcbiAgbWVyZ2VkID0gJ21lcmdlZCcsXG4gIG9wZW5lZCA9ICdvcGVuZWQnLFxuICBjbG9zZWQgPSAnY2xvc2VkJyxcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1cyh7XG4gIGFjY2Vzc1Rva2VuLFxuICByZXBvVXJsLFxuICBtck51bWJlcixcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbiAgbXJOdW1iZXI6IG51bWJlclxufSkge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoeyB1cmw6IHJlcG9VcmwsIGdpdGxhYkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgYXBpLk1lcmdlUmVxdWVzdHMuc2hvdyhwcm9qZWN0UGF0aCwgbXJOdW1iZXIpXG4gIHN3aXRjaCAocmVzLnN0YXRlKSB7XG4gICAgY2FzZSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLm1lcmdlZDpcbiAgICBjYXNlIEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1c0VudW0ub3BlbmVkOlxuICAgIGNhc2UgR2l0bGFiTWVyZ2VSZXF1ZXN0U3RhdHVzRW51bS5jbG9zZWQ6XG4gICAgICByZXR1cm4gcmVzLnN0YXRlXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBtZXJnZSByZXF1ZXN0IHN0YXRlICR7cmVzLnN0YXRlfWApXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGxhYklzUmVtb3RlQnJhbmNoKHtcbiAgYWNjZXNzVG9rZW4sXG4gIHJlcG9VcmwsXG4gIGJyYW5jaCxcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbiAgYnJhbmNoOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHsgdXJsOiByZXBvVXJsLCBnaXRsYWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLkJyYW5jaGVzLnNob3cocHJvamVjdFBhdGgsIGJyYW5jaClcbiAgICByZXR1cm4gcmVzLm5hbWUgPT09IGJyYW5jaFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGxhYlJlcG9MaXN0KFxuICB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuKSB7XG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7IHVybCwgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICBjb25zdCByZXMgPSBhd2FpdCBhcGkuUHJvamVjdHMuYWxsKHtcbiAgICBtZW1iZXJzaGlwOiB0cnVlLFxuICAgIC8vVE9ETzogYSBidWcgaW4gdGhlIHNvcnRpbmcgbWVjaGFuaXNtIG9mIHRoaXMgYXBpIGNhbGxcbiAgICAvL2Rpc2FsbG93cyB1cyB0byBzb3J0IGJ5IHVwZGF0ZWRfYXQgaW4gZGVzY2VuZGluZyBvcmRlclxuICAgIC8vc28gd2UgaGF2ZSB0byBzb3J0IGJ5IHVwZGF0ZWRfYXQgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgIC8vV2UgY2FuIHdhaXQgZm9yIHRoZSBidWcgdG8gYmUgZml4ZWQgb3IgY2FsbCB0aGUgYXBpXG4gICAgLy9kaXJlY3RseSB3aXRoIGZldGNoKClcbiAgICBzb3J0OiAnYXNjJyxcbiAgICBvcmRlckJ5OiAndXBkYXRlZF9hdCcsXG4gICAgcGVyUGFnZTogMTAwLFxuICB9KVxuICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgcmVzLm1hcChhc3luYyAocHJvamVjdCkgPT4ge1xuICAgICAgY29uc3QgcHJvaiA9IGF3YWl0IGFwaS5Qcm9qZWN0cy5zaG93KHByb2plY3QuaWQpXG4gICAgICBjb25zdCBvd25lciA9IHByb2oubmFtZXNwYWNlLm5hbWVcbiAgICAgIGNvbnN0IHJlcG9MYW5ndWFnZXMgPSBhd2FpdCBhcGkuUHJvamVjdHMuc2hvd0xhbmd1YWdlcyhwcm9qZWN0LmlkKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVwb05hbWU6IHByb2plY3QucGF0aCxcbiAgICAgICAgcmVwb1VybDogcHJvamVjdC53ZWJfdXJsLFxuICAgICAgICByZXBvT3duZXI6IG93bmVyLFxuICAgICAgICByZXBvTGFuZ3VhZ2VzOiBPYmplY3Qua2V5cyhyZXBvTGFuZ3VhZ2VzKSxcbiAgICAgICAgcmVwb0lzUHVibGljOiBwcm9qZWN0LnZpc2liaWxpdHkgPT09ICdwdWJsaWMnLFxuICAgICAgICByZXBvVXBkYXRlZEF0OiBwcm9qZWN0Lmxhc3RfYWN0aXZpdHlfYXQsXG4gICAgICB9XG4gICAgfSlcbiAgKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiQnJhbmNoTGlzdCh7XG4gIGFjY2Vzc1Rva2VuLFxuICByZXBvVXJsLFxufToge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gIHJlcG9Vcmw6IHN0cmluZ1xufSkge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoeyB1cmw6IHJlcG9VcmwsIGdpdGxhYkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgdHJ5IHtcbiAgICAvL1RPRE86IEpPTkFUSEFOQSBuZWVkIHRvIHBsYXkgd2l0aCB0aGUgcGFyYW1ldGVycyBoZXJlIHRvIGdldCBhbGwgYnJhbmNoZXMgYXMgaXQgaXMgc29tZXRpbWVzIHN0dWNrXG4gICAgLy9kZXBlbmRpbmcgb24gdGhlIHBhcmFtZXRlcnMgYW5kIHRoZSBudW1iZXIgb2YgYnJhbmNoZXMuIEl0IHNvbWV0aW1lcyBqdXN0IGhhbmdzLi4uXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLkJyYW5jaGVzLmFsbChwcm9qZWN0UGF0aCwge1xuICAgICAgcGVyUGFnZTogMTAwLFxuICAgICAgcGFnaW5hdGlvbjogJ2tleXNldCcsXG4gICAgICBvcmRlckJ5OiAndXBkYXRlZF9hdCcsXG4gICAgICBzb3J0OiAnZGVjJyxcbiAgICB9KVxuICAgIHJldHVybiByZXMubWFwKChicmFuY2gpID0+IGJyYW5jaC5uYW1lKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1lcmdlUmVxdWVzdChvcHRpb25zOiB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nXG4gIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZ1xuICB0aXRsZTogc3RyaW5nXG4gIGJvZHk6IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ob3B0aW9ucy5yZXBvVXJsKVxuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoe1xuICAgIHVybDogb3B0aW9ucy5yZXBvVXJsLFxuICAgIGdpdGxhYkF1dGhUb2tlbjogb3B0aW9ucy5hY2Nlc3NUb2tlbixcbiAgfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgYXBpLk1lcmdlUmVxdWVzdHMuY3JlYXRlKFxuICAgIHByb2plY3RQYXRoLFxuICAgIG9wdGlvbnMuc291cmNlQnJhbmNoTmFtZSxcbiAgICBvcHRpb25zLnRhcmdldEJyYW5jaE5hbWUsXG4gICAgb3B0aW9ucy50aXRsZSxcbiAgICB7XG4gICAgICBkZXNjcmlwdGlvbjogb3B0aW9ucy5ib2R5LFxuICAgIH1cbiAgKVxuICByZXR1cm4gcmVzLmlpZFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiUmVwb0RlZmF1bHRCcmFuY2goXG4gIHJlcG9Vcmw6IHN0cmluZyxcbiAgb3B0aW9ucz86IEFwaUF1dGhPcHRpb25zXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoe1xuICAgIHVybDogcmVwb1VybCxcbiAgICBnaXRsYWJBdXRoVG9rZW46IG9wdGlvbnM/LmdpdGxhYkF1dGhUb2tlbixcbiAgfSlcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IGFwaS5Qcm9qZWN0cy5zaG93KHByb2plY3RQYXRoKVxuICBpZiAoIXByb2plY3QuZGVmYXVsdF9icmFuY2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRlZmF1bHQgYnJhbmNoJylcbiAgfVxuICByZXR1cm4gcHJvamVjdC5kZWZhdWx0X2JyYW5jaFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YShcbiAgeyByZWYsIGdpdGxhYlVybCB9OiB7IHJlZjogc3RyaW5nOyBnaXRsYWJVcmw6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhnaXRsYWJVcmwpXG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7XG4gICAgdXJsOiBnaXRsYWJVcmwsXG4gICAgZ2l0bGFiQXV0aFRva2VuOiBvcHRpb25zPy5naXRsYWJBdXRoVG9rZW4sXG4gIH0pXG4gIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQoW1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkuQnJhbmNoZXMuc2hvdyhwcm9qZWN0UGF0aCwgcmVmKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhOiByZXMuY29tbWl0LmlkIGFzIHN0cmluZyxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5CUkFOQ0gsXG4gICAgICAgIGRhdGU6IHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGVcbiAgICAgICAgICA/IG5ldyBEYXRlKHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGUpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLkNvbW1pdHMuc2hvdyhwcm9qZWN0UGF0aCwgcmVmKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhOiByZXMuaWQsXG4gICAgICAgIHR5cGU6IFJlZmVyZW5jZVR5cGUuQ09NTUlULFxuICAgICAgICBkYXRlOiByZXMuY29tbWl0dGVkX2RhdGUgPyBuZXcgRGF0ZShyZXMuY29tbWl0dGVkX2RhdGUpIDogdW5kZWZpbmVkLFxuICAgICAgfVxuICAgIH0pKCksXG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5UYWdzLnNob3cocHJvamVjdFBhdGgsIHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNoYTogcmVzLmNvbW1pdC5pZCxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5UQUcsXG4gICAgICAgIGRhdGU6IHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGVcbiAgICAgICAgICA/IG5ldyBEYXRlKHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGUpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgfSkoKSxcbiAgXSlcbiAgY29uc3QgW2JyYW5jaFJlcywgY29tbWl0UmVzLCB0YWdSZXNdID0gcmVzdWx0c1xuICBpZiAodGFnUmVzLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcpIHtcbiAgICByZXR1cm4gdGFnUmVzLnZhbHVlXG4gIH1cbiAgaWYgKGJyYW5jaFJlcy5zdGF0dXMgPT09ICdmdWxmaWxsZWQnKSB7XG4gICAgcmV0dXJuIGJyYW5jaFJlcy52YWx1ZVxuICB9XG4gIGlmIChjb21taXRSZXMuc3RhdHVzID09PSAnZnVsZmlsbGVkJykge1xuICAgIHJldHVybiBjb21taXRSZXMudmFsdWVcbiAgfVxuICB0aHJvdyBuZXcgUmVmTm90Rm91bmRFcnJvcihgcmVmOiAke3JlZn0gZG9lcyBub3QgZXhpc3RgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8oZ2l0bGFiVXJsOiBzdHJpbmcpIHtcbiAgZ2l0bGFiVXJsID0gcmVtb3ZlVHJhaWxpbmdTbGFzaChnaXRsYWJVcmwpXG4gIGNvbnN0IHBhcnNpbmdSZXN1bHQgPSBwYXJzZVNjbVVSTChnaXRsYWJVcmwsIFNjbVR5cGUuR2l0TGFiKVxuXG4gIGlmICghcGFyc2luZ1Jlc3VsdCB8fCAhcGFyc2luZ1Jlc3VsdC5yZXBvTmFtZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVXJsUGF0dGVybkVycm9yKGBpbnZhbGlkIGdpdGxhYiByZXBvIFVybCAke2dpdGxhYlVybH1gKVxuICB9XG5cbiAgY29uc3QgeyBvcmdhbml6YXRpb24sIHJlcG9OYW1lLCBwcm9qZWN0UGF0aCB9ID0gcGFyc2luZ1Jlc3VsdFxuICByZXR1cm4geyBvd25lcjogb3JnYW5pemF0aW9uLCByZXBvOiByZXBvTmFtZSwgcHJvamVjdFBhdGggfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiQmxhbWVSYW5nZXMoXG4gIHsgcmVmLCBnaXRsYWJVcmwsIHBhdGggfTogeyByZWY6IHN0cmluZzsgZ2l0bGFiVXJsOiBzdHJpbmc7IHBhdGg6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhnaXRsYWJVcmwpXG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7XG4gICAgdXJsOiBnaXRsYWJVcmwsXG4gICAgZ2l0bGFiQXV0aFRva2VuOiBvcHRpb25zPy5naXRsYWJBdXRoVG9rZW4sXG4gIH0pXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBhcGkuUmVwb3NpdG9yeUZpbGVzLmFsbEZpbGVCbGFtZXMocHJvamVjdFBhdGgsIHBhdGgsIHJlZilcbiAgbGV0IGxpbmVOdW1iZXIgPSAxXG4gIHJldHVybiByZXNwXG4gICAgLmZpbHRlcigocmFuZ2UpID0+IHJhbmdlLmxpbmVzKVxuICAgIC5tYXAoKHJhbmdlKSA9PiB7XG4gICAgICBjb25zdCBvbGRMaW5lTnVtYmVyID0gbGluZU51bWJlclxuICAgICAgaWYgKCFyYW5nZS5saW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JhbmdlLmxpbmVzIHNob3VsZCBub3QgYmUgdW5kZWZpbmVkJylcbiAgICAgIH1cbiAgICAgIGxpbmVOdW1iZXIgKz0gcmFuZ2UubGluZXMubGVuZ3RoXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0xpbmU6IG9sZExpbmVOdW1iZXIsXG4gICAgICAgIGVuZGluZ0xpbmU6IGxpbmVOdW1iZXIgLSAxLFxuICAgICAgICBsb2dpbjogcmFuZ2UuY29tbWl0LmF1dGhvcl9lbWFpbCxcbiAgICAgICAgZW1haWw6IHJhbmdlLmNvbW1pdC5hdXRob3JfZW1haWwsXG4gICAgICAgIG5hbWU6IHJhbmdlLmNvbW1pdC5hdXRob3JfbmFtZSxcbiAgICAgIH1cbiAgICB9KVxufVxuXG5jb25zdCBHSVRMQUJfQUNDRVNTX1RPS0VOX1VSTCA9ICdodHRwczovL2dpdGxhYi5jb20vb2F1dGgvdG9rZW4nXG5cbmNvbnN0IEdpdGxhYkF1dGhSZXN1bHRaID0gei5vYmplY3Qoe1xuICBhY2Nlc3NfdG9rZW46IHouc3RyaW5nKCksXG4gIHRva2VuX3R5cGU6IHouc3RyaW5nKCksXG4gIHJlZnJlc2hfdG9rZW46IHouc3RyaW5nKCksXG59KVxuXG5leHBvcnQgZW51bSBHaXRsYWJUb2tlblJlcXVlc3RUeXBlRW51bSB7XG4gIENPREUgPSAnY29kZScsXG4gIFJFRlJFU0hfVE9LRU4gPSAncmVmcmVzaF90b2tlbicsXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRsYWJUb2tlbih7XG4gIHRva2VuLFxuICBnaXRsYWJDbGllbnRJZCxcbiAgZ2l0bGFiQ2xpZW50U2VjcmV0LFxuICBjYWxsYmFja1VybCxcbiAgdG9rZW5UeXBlLFxufToge1xuICB0b2tlbjogc3RyaW5nXG4gIGdpdGxhYkNsaWVudElkOiBzdHJpbmdcbiAgZ2l0bGFiQ2xpZW50U2VjcmV0OiBzdHJpbmdcbiAgY2FsbGJhY2tVcmw6IHN0cmluZ1xuICB0b2tlblR5cGU6IEdpdGxhYlRva2VuUmVxdWVzdFR5cGVFbnVtXG59KSB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKEdJVExBQl9BQ0NFU1NfVE9LRU5fVVJMLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgfSxcbiAgICBib2R5OiBxdWVyeXN0cmluZy5zdHJpbmdpZnkoe1xuICAgICAgY2xpZW50X2lkOiBnaXRsYWJDbGllbnRJZCxcbiAgICAgIGNsaWVudF9zZWNyZXQ6IGdpdGxhYkNsaWVudFNlY3JldCxcbiAgICAgIFt0b2tlblR5cGVdOiB0b2tlbixcbiAgICAgIGdyYW50X3R5cGU6XG4gICAgICAgIHRva2VuVHlwZSA9PT0gR2l0bGFiVG9rZW5SZXF1ZXN0VHlwZUVudW0uQ09ERVxuICAgICAgICAgID8gJ2F1dGhvcml6YXRpb25fY29kZSdcbiAgICAgICAgICA6ICdyZWZyZXNoX3Rva2VuJyxcbiAgICAgIHJlZGlyZWN0X3VyaTogY2FsbGJhY2tVcmwsXG4gICAgfSksXG4gIH0pXG4gIGNvbnN0IGF1dGhSZXN1bHQgPSBhd2FpdCByZXMuanNvbigpXG4gIHJldHVybiBHaXRsYWJBdXRoUmVzdWx0Wi5wYXJzZShhdXRoUmVzdWx0KVxufVxuXG5mdW5jdGlvbiBpbml0R2l0bGFiRmV0Y2hNb2NrKCkge1xuICBjb25zdCBnbG9iYWxGZXRjaCA9IGdsb2JhbC5mZXRjaFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBmdW5jdGlvbiBteUZldGNoKGlucHV0OiBhbnksIGluaXQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2tcbiAgICBjb25zdCBwYXJ0cyA9IHN0YWNrPy5zcGxpdCgnYXQgJylcbiAgICB0cnkge1xuICAgICAgaWYgKFxuICAgICAgICBwYXJ0cz8ubGVuZ3RoICYmXG4gICAgICAgIHBhcnRzPy5sZW5ndGggPj0gMiAmJlxuICAgICAgICBwYXJ0c1syXT8uc3RhcnRzV2l0aCgnZGVmYXVsdFJlcXVlc3RIYW5kbGVyICgnKSAmJlxuICAgICAgICBwYXJ0c1syXT8uaW5jbHVkZXMoJy9AZ2l0YmVha2VyL3Jlc3QvZGlzdC9pbmRleC5qcycpICYmXG4gICAgICAgICgvXmh0dHBzPzpcXC9cXC9bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfVxcLy9pLnRlc3QoXG4gICAgICAgICAgaW5wdXQ/LnVybFxuICAgICAgICApIHx8XG4gICAgICAgICAgKCdHSVRMQUJfSU5URVJOQUxfREVWX0hPU1QnIGluIHByb2Nlc3MuZW52ICYmXG4gICAgICAgICAgICBwcm9jZXNzLmVudlsnR0lUTEFCX0lOVEVSTkFMX0RFVl9IT1NUJ10gJiZcbiAgICAgICAgICAgIGlucHV0Py51cmw/LnN0YXJ0c1dpdGgocHJvY2Vzcy5lbnZbJ0dJVExBQl9JTlRFUk5BTF9ERVZfSE9TVCddKSkpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZGlzcGF0Y2hlciA9IG5ldyBQcm94eUFnZW50KFxuICAgICAgICAgIHByb2Nlc3MuZW52WydHSVRfUFJPWFlfSE9TVCddIHx8ICdodHRwOi8vdGlueXByb3h5Ojg4ODgnXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIGdsb2JhbEZldGNoKGlucHV0LCB7IGRpc3BhdGNoZXIgfSBhcyBSZXF1ZXN0SW5pdClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBlbXB0eSAqL1xuICAgIH1cbiAgICByZXR1cm4gZ2xvYmFsRmV0Y2goaW5wdXQsIGluaXQpXG4gIH1cbiAgZ2xvYmFsLmZldGNoID0gbXlGZXRjaFxufVxuXG5pbml0R2l0bGFiRmV0Y2hNb2NrKClcbiJdfQ==