"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitlabToken = exports.getGitlabBlameRanges = exports.parseGitlabOwnerAndRepo = exports.getGitlabReferenceData = exports.getGitlabRepoDefaultBranch = exports.getGitlabMergeRequest = exports.createMergeRequest = exports.getGitlabBranchList = exports.getGitlabRepoList = exports.getGitlabIsRemoteBranch = exports.getGitlabMergeRequestStatus = exports.GitlabMergeRequestStatusEnum = exports.getGitlabIsUserCollaborator = exports.getGitlabUsername = exports.gitlabValidateParams = void 0;
const node_querystring_1 = __importDefault(require("node:querystring"));
const rest_1 = require("@gitbeaker/rest");
const undici_1 = require("undici");
const zod_1 = require("zod");
const scm_1 = require("../scm");
const urlParser_1 = require("../urlParser");
const types_1 = require("./types");
const GITLAB_ACCESS_TOKEN_URL = 'https://gitlab.com/oauth/token';
const EnvVariablesZod = zod_1.z.object({
    GITLAB_API_TOKEN: zod_1.z.string().optional(),
    BROKERED_HOSTS: zod_1.z
        .string()
        .toLowerCase()
        .transform((x) => x
        .split(',')
        .map((url) => url.trim(), [])
        .filter(Boolean))
        .default(''),
});
const { GITLAB_API_TOKEN, BROKERED_HOSTS } = EnvVariablesZod.parse(process.env);
function removeTrailingSlash(str) {
    return str.trim().replace(/\/+$/, '');
}
function getGitBeaker(options) {
    const token = options?.gitlabAuthToken ?? GITLAB_API_TOKEN ?? '';
    const url = options.url;
    const host = url ? new URL(url).origin : 'https://gitlab.com';
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
async function getGitlabMergeRequest({ url, prNumber, accessToken, }) {
    const { projectPath } = parseGitlabOwnerAndRepo(url);
    const api = getGitBeaker({
        url,
        gitlabAuthToken: accessToken,
    });
    return await api.MergeRequests.show(projectPath, prNumber);
}
exports.getGitlabMergeRequest = getGitlabMergeRequest;
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
            grant_type: tokenType === types_1.GitlabTokenRequestTypeEnum.CODE
                ? 'authorization_code'
                : 'refresh_token',
            redirect_uri: callbackUrl,
        }),
    });
    const authResult = await res.json();
    return types_1.GitlabAuthResultZ.parse(authResult);
}
exports.getGitlabToken = getGitlabToken;
function initGitlabFetchMock() {
    const globalFetch = global.fetch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function myFetch(input, init) {
        let urlParsed = null;
        // this block is used for unit tests only. URL starts from local directory
        try {
            urlParsed = input?.url ? new URL(input?.url) : null;
        }
        catch (err) {
            console.log(`this block is used for unit tests only. URL ${input?.url} starts from local directory`);
        }
        if (urlParsed &&
            BROKERED_HOSTS.includes(`${urlParsed.protocol?.toLowerCase()}//${urlParsed.host?.toLowerCase()}`)) {
            const dispatcher = new undici_1.ProxyAgent({
                uri: process.env['GIT_PROXY_HOST'] || 'http://tinyproxy:8888',
                requestTls: {
                    rejectUnauthorized: false,
                },
            });
            return globalFetch(input, { dispatcher });
        }
        return globalFetch(input, init);
    }
    global.fetch = myFetch;
}
initGitlabFetchMock();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0bGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9naXRsYWIvZ2l0bGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdFQUEwQztBQUUxQywwQ0FJd0I7QUFDeEIsbUNBQW1DO0FBQ25DLDZCQUF1QjtBQUV2QixnQ0FPZTtBQUNmLDRDQUEwQztBQUMxQyxtQ0FBdUU7QUFFdkUsTUFBTSx1QkFBdUIsR0FBRyxnQ0FBZ0MsQ0FBQTtBQUVoRSxNQUFNLGVBQWUsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQy9CLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDdkMsY0FBYyxFQUFFLE9BQUM7U0FDZCxNQUFNLEVBQUU7U0FDUixXQUFXLEVBQUU7U0FDYixTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNmLENBQUM7U0FDRSxLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDbkI7U0FDQSxPQUFPLENBQUMsRUFBRSxDQUFDO0NBQ2YsQ0FBQyxDQUFBO0FBRUYsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBRS9FLFNBQVMsbUJBQW1CLENBQUMsR0FBVztJQUN0QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUM7QUFPRCxTQUFTLFlBQVksQ0FBQyxPQUF1QjtJQUMzQyxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsZUFBZSxJQUFJ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RSxFQUNEO1lBQ0EsTUFBTSxVQUFVLEdBQUcsSUFBSSxtQkFBVSxDQUFDO2dCQUNoQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLHVCQUF1QjtnQkFDN0QsVUFBVSxFQUFFO29CQUNWLGtCQUFrQixFQUFFLEtBQUs7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFpQixDQUFDLENBQUE7U0FDekQ7UUFDRCxPQUFPLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ3hCLENBQUM7QUFFRCxtQkFBbUIsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ25vZGU6cXVlcnlzdHJpbmcnXG5cbmltcG9ydCB7XG4gIEV4cGFuZGVkTWVyZ2VSZXF1ZXN0U2NoZW1hLFxuICBHaXRsYWIsXG4gIEdpdGxhYkFQSVJlc3BvbnNlLFxufSBmcm9tICdAZ2l0YmVha2VyL3Jlc3QnXG5pbXBvcnQgeyBQcm94eUFnZW50IH0gZnJvbSAndW5kaWNpJ1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcblxuaW1wb3J0IHtcbiAgSW52YWxpZEFjY2Vzc1Rva2VuRXJyb3IsXG4gIEludmFsaWRSZXBvVXJsRXJyb3IsXG4gIEludmFsaWRVcmxQYXR0ZXJuRXJyb3IsXG4gIFJlZmVyZW5jZVR5cGUsXG4gIFJlZk5vdEZvdW5kRXJyb3IsXG4gIFNjbVR5cGUsXG59IGZyb20gJy4uL3NjbSdcbmltcG9ydCB7IHBhcnNlU2NtVVJMIH0gZnJvbSAnLi4vdXJsUGFyc2VyJ1xuaW1wb3J0IHsgR2l0bGFiQXV0aFJlc3VsdFosIEdpdGxhYlRva2VuUmVxdWVzdFR5cGVFbnVtIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgR0lUTEFCX0FDQ0VTU19UT0tFTl9VUkwgPSAnaHR0cHM6Ly9naXRsYWIuY29tL29hdXRoL3Rva2VuJ1xuXG5jb25zdCBFbnZWYXJpYWJsZXNab2QgPSB6Lm9iamVjdCh7XG4gIEdJVExBQl9BUElfVE9LRU46IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgQlJPS0VSRURfSE9TVFM6IHpcbiAgICAuc3RyaW5nKClcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmFuc2Zvcm0oKHgpID0+XG4gICAgICB4XG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoKHVybCkgPT4gdXJsLnRyaW0oKSwgW10pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICApXG4gICAgLmRlZmF1bHQoJycpLFxufSlcblxuY29uc3QgeyBHSVRMQUJfQVBJX1RPS0VOLCBCUk9LRVJFRF9IT1NUUyB9ID0gRW52VmFyaWFibGVzWm9kLnBhcnNlKHByb2Nlc3MuZW52KVxuXG5mdW5jdGlvbiByZW1vdmVUcmFpbGluZ1NsYXNoKHN0cjogc3RyaW5nKSB7XG4gIHJldHVybiBzdHIudHJpbSgpLnJlcGxhY2UoL1xcLyskLywgJycpXG59XG5cbnR5cGUgQXBpQXV0aE9wdGlvbnMgPSB7XG4gIHVybDogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIGdpdGxhYkF1dGhUb2tlbj86IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBnZXRHaXRCZWFrZXIob3B0aW9uczogQXBpQXV0aE9wdGlvbnMpIHtcbiAgY29uc3QgdG9rZW4gPSBvcHRpb25zPy5naXRsYWJBdXRoVG9rZW4gPz8gR0lUTEFCX0FQSV9UT0tFTiA/PyAnJ1xuICBjb25zdCB1cmwgPSBvcHRpb25zLnVybFxuICBjb25zdCBob3N0ID0gdXJsID8gbmV3IFVSTCh1cmwpLm9yaWdpbiA6ICdodHRwczovL2dpdGxhYi5jb20nXG4gIGlmICh0b2tlbj8uc3RhcnRzV2l0aCgnZ2xwYXQtJykgfHwgdG9rZW4gPT09ICcnKSB7XG4gICAgcmV0dXJuIG5ldyBHaXRsYWIoeyB0b2tlbiwgaG9zdCB9KVxuICB9XG4gIHJldHVybiBuZXcgR2l0bGFiKHsgb2F1dGhUb2tlbjogdG9rZW4sIGhvc3QgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdpdGxhYlZhbGlkYXRlUGFyYW1zKHtcbiAgdXJsLFxuICBhY2Nlc3NUb2tlbixcbn06IHtcbiAgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgYWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZFxufSkge1xuICB0cnkge1xuICAgIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7IHVybCwgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICAgIGlmIChhY2Nlc3NUb2tlbikge1xuICAgICAgYXdhaXQgYXBpLlVzZXJzLnNob3dDdXJyZW50VXNlcigpXG4gICAgfVxuICAgIGlmICh1cmwpIHtcbiAgICAgIGNvbnN0IHsgcHJvamVjdFBhdGggfSA9IHBhcnNlR2l0bGFiT3duZXJBbmRSZXBvKHVybClcbiAgICAgIGF3YWl0IGFwaS5Qcm9qZWN0cy5zaG93KHByb2plY3RQYXRoKVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IGVycm9yID0gZSBhcyB7XG4gICAgICBjb2RlPzogc3RyaW5nXG4gICAgICBzdGF0dXM/OiBudW1iZXJcbiAgICAgIHN0YXR1c0NvZGU/OiBudW1iZXJcbiAgICAgIHJlc3BvbnNlPzogeyBzdGF0dXM/OiBudW1iZXI7IHN0YXR1c0NvZGU/OiBudW1iZXI7IGNvZGU/OiBzdHJpbmcgfVxuICAgICAgZGVzY3JpcHRpb24/OiBzdHJpbmdcbiAgICB9XG4gICAgY29uc3QgY29kZSA9XG4gICAgICBlcnJvci5jb2RlIHx8XG4gICAgICBlcnJvci5zdGF0dXMgfHxcbiAgICAgIGVycm9yLnN0YXR1c0NvZGUgfHxcbiAgICAgIGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHxcbiAgICAgIGVycm9yLnJlc3BvbnNlPy5zdGF0dXNDb2RlIHx8XG4gICAgICBlcnJvci5yZXNwb25zZT8uY29kZVxuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBlcnJvci5kZXNjcmlwdGlvbiB8fCBgJHtlfWBcbiAgICBpZiAoXG4gICAgICBjb2RlID09PSA0MDEgfHxcbiAgICAgIGNvZGUgPT09IDQwMyB8fFxuICAgICAgZGVzY3JpcHRpb24uaW5jbHVkZXMoJzQwMScpIHx8XG4gICAgICBkZXNjcmlwdGlvbi5pbmNsdWRlcygnNDAzJylcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkQWNjZXNzVG9rZW5FcnJvcihgaW52YWxpZCBnaXRsYWIgYWNjZXNzIHRva2VuYClcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY29kZSA9PT0gNDA0IHx8XG4gICAgICBkZXNjcmlwdGlvbi5pbmNsdWRlcygnNDA0JykgfHxcbiAgICAgIGRlc2NyaXB0aW9uLmluY2x1ZGVzKCdOb3QgRm91bmQnKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRSZXBvVXJsRXJyb3IoYGludmFsaWQgZ2l0bGFiIHJlcG8gVVJMOiAke3VybH1gKVxuICAgIH1cbiAgICB0aHJvdyBlXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGxhYlVzZXJuYW1lKFxuICB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuKSB7XG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7IHVybCwgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICBjb25zdCByZXMgPSBhd2FpdCBhcGkuVXNlcnMuc2hvd0N1cnJlbnRVc2VyKClcbiAgcmV0dXJuIHJlcy51c2VybmFtZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiSXNVc2VyQ29sbGFib3JhdG9yKHtcbiAgdXNlcm5hbWUsXG4gIGFjY2Vzc1Rva2VuLFxuICByZXBvVXJsLFxufToge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG59KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoeyB1cmw6IHJlcG9VcmwsIGdpdGxhYkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5Qcm9qZWN0cy5zaG93KHByb2plY3RQYXRoKVxuICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBhcGkuUHJvamVjdE1lbWJlcnMuYWxsKHJlcy5pZCwge1xuICAgICAgaW5jbHVkZUluaGVyaXRlZDogdHJ1ZSxcbiAgICB9KVxuICAgIHJldHVybiAhIW1lbWJlcnMuZmluZCgobWVtYmVyKSA9PiBtZW1iZXIudXNlcm5hbWUgPT09IHVzZXJuYW1lKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGVudW0gR2l0bGFiTWVyZ2VSZXF1ZXN0U3RhdHVzRW51bSB7XG4gIG1lcmdlZCA9ICdtZXJnZWQnLFxuICBvcGVuZWQgPSAnb3BlbmVkJyxcbiAgY2xvc2VkID0gJ2Nsb3NlZCcsXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXMoe1xuICBhY2Nlc3NUb2tlbixcbiAgcmVwb1VybCxcbiAgbXJOdW1iZXIsXG59OiB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG4gIG1yTnVtYmVyOiBudW1iZXJcbn0pIHtcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHsgdXJsOiByZXBvVXJsLCBnaXRsYWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5NZXJnZVJlcXVlc3RzLnNob3cocHJvamVjdFBhdGgsIG1yTnVtYmVyKVxuICBzd2l0Y2ggKHJlcy5zdGF0ZSkge1xuICAgIGNhc2UgR2l0bGFiTWVyZ2VSZXF1ZXN0U3RhdHVzRW51bS5tZXJnZWQ6XG4gICAgY2FzZSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLm9wZW5lZDpcbiAgICBjYXNlIEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1c0VudW0uY2xvc2VkOlxuICAgICAgcmV0dXJuIHJlcy5zdGF0ZVxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gbWVyZ2UgcmVxdWVzdCBzdGF0ZSAke3Jlcy5zdGF0ZX1gKVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRsYWJJc1JlbW90ZUJyYW5jaCh7XG4gIGFjY2Vzc1Rva2VuLFxuICByZXBvVXJsLFxuICBicmFuY2gsXG59OiB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG4gIGJyYW5jaDogc3RyaW5nXG59KSB7XG4gIGNvbnN0IHsgcHJvamVjdFBhdGggfSA9IHBhcnNlR2l0bGFiT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7IHVybDogcmVwb1VybCwgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5CcmFuY2hlcy5zaG93KHByb2plY3RQYXRoLCBicmFuY2gpXG4gICAgcmV0dXJuIHJlcy5uYW1lID09PSBicmFuY2hcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRsYWJSZXBvTGlzdChcbiAgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbikge1xuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoeyB1cmwsIGdpdGxhYkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgYXBpLlByb2plY3RzLmFsbCh7XG4gICAgbWVtYmVyc2hpcDogdHJ1ZSxcbiAgICAvL1RPRE86IGEgYnVnIGluIHRoZSBzb3J0aW5nIG1lY2hhbmlzbSBvZiB0aGlzIGFwaSBjYWxsXG4gICAgLy9kaXNhbGxvd3MgdXMgdG8gc29ydCBieSB1cGRhdGVkX2F0IGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgICAvL3NvIHdlIGhhdmUgdG8gc29ydCBieSB1cGRhdGVkX2F0IGluIGFzY2VuZGluZyBvcmRlci5cbiAgICAvL1dlIGNhbiB3YWl0IGZvciB0aGUgYnVnIHRvIGJlIGZpeGVkIG9yIGNhbGwgdGhlIGFwaVxuICAgIC8vZGlyZWN0bHkgd2l0aCBmZXRjaCgpXG4gICAgc29ydDogJ2FzYycsXG4gICAgb3JkZXJCeTogJ3VwZGF0ZWRfYXQnLFxuICAgIHBlclBhZ2U6IDEwMCxcbiAgfSlcbiAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgIHJlcy5tYXAoYXN5bmMgKHByb2plY3QpID0+IHtcbiAgICAgIGNvbnN0IHByb2ogPSBhd2FpdCBhcGkuUHJvamVjdHMuc2hvdyhwcm9qZWN0LmlkKVxuICAgICAgY29uc3Qgb3duZXIgPSBwcm9qLm5hbWVzcGFjZS5uYW1lXG4gICAgICBjb25zdCByZXBvTGFuZ3VhZ2VzID0gYXdhaXQgYXBpLlByb2plY3RzLnNob3dMYW5ndWFnZXMocHJvamVjdC5pZClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlcG9OYW1lOiBwcm9qZWN0LnBhdGgsXG4gICAgICAgIHJlcG9Vcmw6IHByb2plY3Qud2ViX3VybCxcbiAgICAgICAgcmVwb093bmVyOiBvd25lcixcbiAgICAgICAgcmVwb0xhbmd1YWdlczogT2JqZWN0LmtleXMocmVwb0xhbmd1YWdlcyksXG4gICAgICAgIHJlcG9Jc1B1YmxpYzogcHJvamVjdC52aXNpYmlsaXR5ID09PSAncHVibGljJyxcbiAgICAgICAgcmVwb1VwZGF0ZWRBdDogcHJvamVjdC5sYXN0X2FjdGl2aXR5X2F0LFxuICAgICAgfVxuICAgIH0pXG4gIClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGxhYkJyYW5jaExpc3Qoe1xuICBhY2Nlc3NUb2tlbixcbiAgcmVwb1VybCxcbn06IHtcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbn0pIHtcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHsgdXJsOiByZXBvVXJsLCBnaXRsYWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gIHRyeSB7XG4gICAgLy9UT0RPOiBKT05BVEhBTkEgbmVlZCB0byBwbGF5IHdpdGggdGhlIHBhcmFtZXRlcnMgaGVyZSB0byBnZXQgYWxsIGJyYW5jaGVzIGFzIGl0IGlzIHNvbWV0aW1lcyBzdHVja1xuICAgIC8vZGVwZW5kaW5nIG9uIHRoZSBwYXJhbWV0ZXJzIGFuZCB0aGUgbnVtYmVyIG9mIGJyYW5jaGVzLiBJdCBzb21ldGltZXMganVzdCBoYW5ncy4uLlxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5CcmFuY2hlcy5hbGwocHJvamVjdFBhdGgsIHtcbiAgICAgIHBlclBhZ2U6IDEwMCxcbiAgICAgIHBhZ2luYXRpb246ICdrZXlzZXQnLFxuICAgICAgb3JkZXJCeTogJ3VwZGF0ZWRfYXQnLFxuICAgICAgc29ydDogJ2RlYycsXG4gICAgfSlcbiAgICByZXR1cm4gcmVzLm1hcCgoYnJhbmNoKSA9PiBicmFuY2gubmFtZSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVNZXJnZVJlcXVlc3Qob3B0aW9uczoge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gIHRhcmdldEJyYW5jaE5hbWU6IHN0cmluZ1xuICBzb3VyY2VCcmFuY2hOYW1lOiBzdHJpbmdcbiAgdGl0bGU6IHN0cmluZ1xuICBib2R5OiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG59KSB7XG4gIGNvbnN0IHsgcHJvamVjdFBhdGggfSA9IHBhcnNlR2l0bGFiT3duZXJBbmRSZXBvKG9wdGlvbnMucmVwb1VybClcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHtcbiAgICB1cmw6IG9wdGlvbnMucmVwb1VybCxcbiAgICBnaXRsYWJBdXRoVG9rZW46IG9wdGlvbnMuYWNjZXNzVG9rZW4sXG4gIH0pXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5NZXJnZVJlcXVlc3RzLmNyZWF0ZShcbiAgICBwcm9qZWN0UGF0aCxcbiAgICBvcHRpb25zLnNvdXJjZUJyYW5jaE5hbWUsXG4gICAgb3B0aW9ucy50YXJnZXRCcmFuY2hOYW1lLFxuICAgIG9wdGlvbnMudGl0bGUsXG4gICAge1xuICAgICAgZGVzY3JpcHRpb246IG9wdGlvbnMuYm9keSxcbiAgICB9XG4gIClcbiAgcmV0dXJuIHJlcy5paWRcbn1cbnR5cGUgR2V0R2l0bGFiTWVyZ2VSZXF1ZXN0UGFyYW1zID0ge1xuICB1cmw6IHN0cmluZ1xuICBwck51bWJlcjogbnVtYmVyXG4gIGFjY2Vzc1Rva2VuPzogc3RyaW5nXG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiTWVyZ2VSZXF1ZXN0KHtcbiAgdXJsLFxuICBwck51bWJlcixcbiAgYWNjZXNzVG9rZW4sXG59OiBHZXRHaXRsYWJNZXJnZVJlcXVlc3RQYXJhbXMpOiBQcm9taXNlPFxuICBHaXRsYWJBUElSZXNwb25zZTxFeHBhbmRlZE1lcmdlUmVxdWVzdFNjaGVtYSwgZmFsc2UsIGZhbHNlLCB2b2lkPlxuPiB7XG4gIGNvbnN0IHsgcHJvamVjdFBhdGggfSA9IHBhcnNlR2l0bGFiT3duZXJBbmRSZXBvKHVybClcbiAgY29uc3QgYXBpID0gZ2V0R2l0QmVha2VyKHtcbiAgICB1cmwsXG4gICAgZ2l0bGFiQXV0aFRva2VuOiBhY2Nlc3NUb2tlbixcbiAgfSlcbiAgcmV0dXJuIGF3YWl0IGFwaS5NZXJnZVJlcXVlc3RzLnNob3cocHJvamVjdFBhdGgsIHByTnVtYmVyKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiUmVwb0RlZmF1bHRCcmFuY2goXG4gIHJlcG9Vcmw6IHN0cmluZyxcbiAgb3B0aW9ucz86IEFwaUF1dGhPcHRpb25zXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBhcGkgPSBnZXRHaXRCZWFrZXIoe1xuICAgIHVybDogcmVwb1VybCxcbiAgICBnaXRsYWJBdXRoVG9rZW46IG9wdGlvbnM/LmdpdGxhYkF1dGhUb2tlbixcbiAgfSlcbiAgY29uc3QgeyBwcm9qZWN0UGF0aCB9ID0gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8ocmVwb1VybClcbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IGFwaS5Qcm9qZWN0cy5zaG93KHByb2plY3RQYXRoKVxuICBpZiAoIXByb2plY3QuZGVmYXVsdF9icmFuY2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRlZmF1bHQgYnJhbmNoJylcbiAgfVxuICByZXR1cm4gcHJvamVjdC5kZWZhdWx0X2JyYW5jaFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YShcbiAgeyByZWYsIGdpdGxhYlVybCB9OiB7IHJlZjogc3RyaW5nOyBnaXRsYWJVcmw6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhnaXRsYWJVcmwpXG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7XG4gICAgdXJsOiBnaXRsYWJVcmwsXG4gICAgZ2l0bGFiQXV0aFRva2VuOiBvcHRpb25zPy5naXRsYWJBdXRoVG9rZW4sXG4gIH0pXG4gIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQoW1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkuQnJhbmNoZXMuc2hvdyhwcm9qZWN0UGF0aCwgcmVmKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhOiByZXMuY29tbWl0LmlkIGFzIHN0cmluZyxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5CUkFOQ0gsXG4gICAgICAgIGRhdGU6IHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGVcbiAgICAgICAgICA/IG5ldyBEYXRlKHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGUpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLkNvbW1pdHMuc2hvdyhwcm9qZWN0UGF0aCwgcmVmKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhOiByZXMuaWQsXG4gICAgICAgIHR5cGU6IFJlZmVyZW5jZVR5cGUuQ09NTUlULFxuICAgICAgICBkYXRlOiByZXMuY29tbWl0dGVkX2RhdGUgPyBuZXcgRGF0ZShyZXMuY29tbWl0dGVkX2RhdGUpIDogdW5kZWZpbmVkLFxuICAgICAgfVxuICAgIH0pKCksXG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5UYWdzLnNob3cocHJvamVjdFBhdGgsIHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNoYTogcmVzLmNvbW1pdC5pZCxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5UQUcsXG4gICAgICAgIGRhdGU6IHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGVcbiAgICAgICAgICA/IG5ldyBEYXRlKHJlcy5jb21taXQuY29tbWl0dGVkX2RhdGUpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgfSkoKSxcbiAgXSlcbiAgY29uc3QgW2JyYW5jaFJlcywgY29tbWl0UmVzLCB0YWdSZXNdID0gcmVzdWx0c1xuICBpZiAodGFnUmVzLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcpIHtcbiAgICByZXR1cm4gdGFnUmVzLnZhbHVlXG4gIH1cbiAgaWYgKGJyYW5jaFJlcy5zdGF0dXMgPT09ICdmdWxmaWxsZWQnKSB7XG4gICAgcmV0dXJuIGJyYW5jaFJlcy52YWx1ZVxuICB9XG4gIGlmIChjb21taXRSZXMuc3RhdHVzID09PSAnZnVsZmlsbGVkJykge1xuICAgIHJldHVybiBjb21taXRSZXMudmFsdWVcbiAgfVxuICB0aHJvdyBuZXcgUmVmTm90Rm91bmRFcnJvcihgcmVmOiAke3JlZn0gZG9lcyBub3QgZXhpc3RgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHaXRsYWJPd25lckFuZFJlcG8oZ2l0bGFiVXJsOiBzdHJpbmcpIHtcbiAgZ2l0bGFiVXJsID0gcmVtb3ZlVHJhaWxpbmdTbGFzaChnaXRsYWJVcmwpXG4gIGNvbnN0IHBhcnNpbmdSZXN1bHQgPSBwYXJzZVNjbVVSTChnaXRsYWJVcmwsIFNjbVR5cGUuR2l0TGFiKVxuXG4gIGlmICghcGFyc2luZ1Jlc3VsdCB8fCAhcGFyc2luZ1Jlc3VsdC5yZXBvTmFtZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVXJsUGF0dGVybkVycm9yKGBpbnZhbGlkIGdpdGxhYiByZXBvIFVybCAke2dpdGxhYlVybH1gKVxuICB9XG5cbiAgY29uc3QgeyBvcmdhbml6YXRpb24sIHJlcG9OYW1lLCBwcm9qZWN0UGF0aCB9ID0gcGFyc2luZ1Jlc3VsdFxuICByZXR1cm4geyBvd25lcjogb3JnYW5pemF0aW9uLCByZXBvOiByZXBvTmFtZSwgcHJvamVjdFBhdGggfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiQmxhbWVSYW5nZXMoXG4gIHsgcmVmLCBnaXRsYWJVcmwsIHBhdGggfTogeyByZWY6IHN0cmluZzsgZ2l0bGFiVXJsOiBzdHJpbmc7IHBhdGg6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IHByb2plY3RQYXRoIH0gPSBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhnaXRsYWJVcmwpXG4gIGNvbnN0IGFwaSA9IGdldEdpdEJlYWtlcih7XG4gICAgdXJsOiBnaXRsYWJVcmwsXG4gICAgZ2l0bGFiQXV0aFRva2VuOiBvcHRpb25zPy5naXRsYWJBdXRoVG9rZW4sXG4gIH0pXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBhcGkuUmVwb3NpdG9yeUZpbGVzLmFsbEZpbGVCbGFtZXMocHJvamVjdFBhdGgsIHBhdGgsIHJlZilcbiAgbGV0IGxpbmVOdW1iZXIgPSAxXG4gIHJldHVybiByZXNwXG4gICAgLmZpbHRlcigocmFuZ2UpID0+IHJhbmdlLmxpbmVzKVxuICAgIC5tYXAoKHJhbmdlKSA9PiB7XG4gICAgICBjb25zdCBvbGRMaW5lTnVtYmVyID0gbGluZU51bWJlclxuICAgICAgaWYgKCFyYW5nZS5saW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JhbmdlLmxpbmVzIHNob3VsZCBub3QgYmUgdW5kZWZpbmVkJylcbiAgICAgIH1cbiAgICAgIGxpbmVOdW1iZXIgKz0gcmFuZ2UubGluZXMubGVuZ3RoXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0xpbmU6IG9sZExpbmVOdW1iZXIsXG4gICAgICAgIGVuZGluZ0xpbmU6IGxpbmVOdW1iZXIgLSAxLFxuICAgICAgICBsb2dpbjogcmFuZ2UuY29tbWl0LmF1dGhvcl9lbWFpbCxcbiAgICAgICAgZW1haWw6IHJhbmdlLmNvbW1pdC5hdXRob3JfZW1haWwsXG4gICAgICAgIG5hbWU6IHJhbmdlLmNvbW1pdC5hdXRob3JfbmFtZSxcbiAgICAgIH1cbiAgICB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0bGFiVG9rZW4oe1xuICB0b2tlbixcbiAgZ2l0bGFiQ2xpZW50SWQsXG4gIGdpdGxhYkNsaWVudFNlY3JldCxcbiAgY2FsbGJhY2tVcmwsXG4gIHRva2VuVHlwZSxcbn06IHtcbiAgdG9rZW46IHN0cmluZ1xuICBnaXRsYWJDbGllbnRJZDogc3RyaW5nXG4gIGdpdGxhYkNsaWVudFNlY3JldDogc3RyaW5nXG4gIGNhbGxiYWNrVXJsOiBzdHJpbmdcbiAgdG9rZW5UeXBlOiBHaXRsYWJUb2tlblJlcXVlc3RUeXBlRW51bVxufSkge1xuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChHSVRMQUJfQUNDRVNTX1RPS0VOX1VSTCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgIH0sXG4gICAgYm9keTogcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHtcbiAgICAgIGNsaWVudF9pZDogZ2l0bGFiQ2xpZW50SWQsXG4gICAgICBjbGllbnRfc2VjcmV0OiBnaXRsYWJDbGllbnRTZWNyZXQsXG4gICAgICBbdG9rZW5UeXBlXTogdG9rZW4sXG4gICAgICBncmFudF90eXBlOlxuICAgICAgICB0b2tlblR5cGUgPT09IEdpdGxhYlRva2VuUmVxdWVzdFR5cGVFbnVtLkNPREVcbiAgICAgICAgICA/ICdhdXRob3JpemF0aW9uX2NvZGUnXG4gICAgICAgICAgOiAncmVmcmVzaF90b2tlbicsXG4gICAgICByZWRpcmVjdF91cmk6IGNhbGxiYWNrVXJsLFxuICAgIH0pLFxuICB9KVxuICBjb25zdCBhdXRoUmVzdWx0ID0gYXdhaXQgcmVzLmpzb24oKVxuICByZXR1cm4gR2l0bGFiQXV0aFJlc3VsdFoucGFyc2UoYXV0aFJlc3VsdClcbn1cblxuZnVuY3Rpb24gaW5pdEdpdGxhYkZldGNoTW9jaygpIHtcbiAgY29uc3QgZ2xvYmFsRmV0Y2ggPSBnbG9iYWwuZmV0Y2hcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgZnVuY3Rpb24gbXlGZXRjaChpbnB1dDogYW55LCBpbml0PzogYW55KTogYW55IHtcbiAgICBsZXQgdXJsUGFyc2VkID0gbnVsbFxuICAgIC8vIHRoaXMgYmxvY2sgaXMgdXNlZCBmb3IgdW5pdCB0ZXN0cyBvbmx5LiBVUkwgc3RhcnRzIGZyb20gbG9jYWwgZGlyZWN0b3J5XG4gICAgdHJ5IHtcbiAgICAgIHVybFBhcnNlZCA9IGlucHV0Py51cmwgPyBuZXcgVVJMKGlucHV0Py51cmwpIDogbnVsbFxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGB0aGlzIGJsb2NrIGlzIHVzZWQgZm9yIHVuaXQgdGVzdHMgb25seS4gVVJMICR7aW5wdXQ/LnVybH0gc3RhcnRzIGZyb20gbG9jYWwgZGlyZWN0b3J5YFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHVybFBhcnNlZCAmJlxuICAgICAgQlJPS0VSRURfSE9TVFMuaW5jbHVkZXMoXG4gICAgICAgIGAke3VybFBhcnNlZC5wcm90b2NvbD8udG9Mb3dlckNhc2UoKX0vLyR7dXJsUGFyc2VkLmhvc3Q/LnRvTG93ZXJDYXNlKCl9YFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3QgZGlzcGF0Y2hlciA9IG5ldyBQcm94eUFnZW50KHtcbiAgICAgICAgdXJpOiBwcm9jZXNzLmVudlsnR0lUX1BST1hZX0hPU1QnXSB8fCAnaHR0cDovL3Rpbnlwcm94eTo4ODg4JyxcbiAgICAgICAgcmVxdWVzdFRsczoge1xuICAgICAgICAgIHJlamVjdFVuYXV0aG9yaXplZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGdsb2JhbEZldGNoKGlucHV0LCB7IGRpc3BhdGNoZXIgfSBhcyBSZXF1ZXN0SW5pdClcbiAgICB9XG4gICAgcmV0dXJuIGdsb2JhbEZldGNoKGlucHV0LCBpbml0KVxuICB9XG4gIGdsb2JhbC5mZXRjaCA9IG15RmV0Y2hcbn1cblxuaW5pdEdpdGxhYkZldGNoTW9jaygpXG4iXX0=