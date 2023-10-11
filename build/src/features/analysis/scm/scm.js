"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubSCMLib = exports.GithubSCMLib = exports.GitlabSCMLib = exports.SCMLib = exports.RepoNoTokenAccessError = exports.RefNotFoundError = exports.InvalidUrlPatternError = exports.InvalidAccessTokenError = exports.InvalidRepoUrlError = exports.ScmLibScmType = exports.ScmSubmitRequestStatus = exports.ReferenceType = exports.scmCanReachRepo = exports.getScmLibTypeFromUrl = void 0;
const github_1 = require("./github");
const gitlab_1 = require("./gitlab");
const scmSubmit_1 = require("./scmSubmit");
function getScmLibTypeFromUrl(url) {
    if (!url) {
        return undefined;
    }
    if (url.toLowerCase().startsWith('https://gitlab.com/')) {
        return ScmLibScmType.GITLAB;
    }
    if (url.toLowerCase().startsWith('https://github.com/')) {
        return ScmLibScmType.GITHUB;
    }
    return undefined;
}
exports.getScmLibTypeFromUrl = getScmLibTypeFromUrl;
async function scmCanReachRepo({ repoUrl, githubToken, gitlabToken, }) {
    try {
        const scmLibType = getScmLibTypeFromUrl(repoUrl);
        await SCMLib.init({
            url: repoUrl,
            accessToken: scmLibType === ScmLibScmType.GITHUB
                ? githubToken
                : scmLibType === ScmLibScmType.GITLAB
                    ? gitlabToken
                    : '',
            scmType: scmLibType,
        });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.scmCanReachRepo = scmCanReachRepo;
var ReferenceType;
(function (ReferenceType) {
    ReferenceType["BRANCH"] = "BRANCH";
    ReferenceType["COMMIT"] = "COMMIT";
    ReferenceType["TAG"] = "TAG";
})(ReferenceType = exports.ReferenceType || (exports.ReferenceType = {}));
var ScmSubmitRequestStatus;
(function (ScmSubmitRequestStatus) {
    ScmSubmitRequestStatus["MERGED"] = "MERGED";
    ScmSubmitRequestStatus["OPEN"] = "OPEN";
    ScmSubmitRequestStatus["CLOSED"] = "CLOSED";
    ScmSubmitRequestStatus["DRAFT"] = "DRAFT";
})(ScmSubmitRequestStatus = exports.ScmSubmitRequestStatus || (exports.ScmSubmitRequestStatus = {}));
var ScmLibScmType;
(function (ScmLibScmType) {
    ScmLibScmType["GITHUB"] = "GITHUB";
    ScmLibScmType["GITLAB"] = "GITLAB";
})(ScmLibScmType = exports.ScmLibScmType || (exports.ScmLibScmType = {}));
class InvalidRepoUrlError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.InvalidRepoUrlError = InvalidRepoUrlError;
class InvalidAccessTokenError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.InvalidAccessTokenError = InvalidAccessTokenError;
class InvalidUrlPatternError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.InvalidUrlPatternError = InvalidUrlPatternError;
class RefNotFoundError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.RefNotFoundError = RefNotFoundError;
class RepoNoTokenAccessError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.RepoNoTokenAccessError = RepoNoTokenAccessError;
class SCMLib {
    url;
    accessToken;
    constructor(url, accessToken) {
        this.accessToken = accessToken;
        this.url = url;
    }
    async getUrlWithCredentials() {
        if (!this.url) {
            console.error('no url for getUrlWithCredentials()');
            throw new Error('no url');
        }
        const trimmedUrl = this.url.trim().replace(/\/$/, '');
        if (!this.accessToken) {
            return trimmedUrl;
        }
        const username = await this._getUsernameForAuthUrl();
        const is_http = trimmedUrl.toLowerCase().startsWith('http://');
        const is_https = trimmedUrl.toLowerCase().startsWith('https://');
        if (is_http) {
            return `http://${username}:${this.accessToken}@${trimmedUrl
                .toLowerCase()
                .replace('http://', '')}`;
        }
        else if (is_https) {
            return `https://${username}:${this.accessToken}@${trimmedUrl
                .toLowerCase()
                .replace('https://', '')}`;
        }
        else {
            console.error(`invalid scm url ${trimmedUrl}`);
            throw new Error(`invalid scm url ${trimmedUrl}`);
        }
    }
    getAccessToken() {
        return this.accessToken || '';
    }
    getUrl() {
        return this.url;
    }
    getName() {
        if (!this.url) {
            return '';
        }
        return this.url.split('/').at(-1) || '';
    }
    static async getIsValidBranchName(branchName) {
        return (0, scmSubmit_1.isValidBranchName)(branchName);
    }
    static async init({ url, accessToken, scmType, }) {
        let trimmedUrl = undefined;
        if (url) {
            trimmedUrl = url.trim().replace(/\/$/, '');
        }
        try {
            if (ScmLibScmType.GITHUB === scmType) {
                const scm = new GithubSCMLib(trimmedUrl, accessToken);
                await scm.validateParams();
                return scm;
            }
            if (ScmLibScmType.GITLAB === scmType) {
                const scm = new GitlabSCMLib(trimmedUrl, accessToken);
                await scm.validateParams();
                return scm;
            }
        }
        catch (e) {
            if (e instanceof InvalidRepoUrlError && url) {
                throw new RepoNoTokenAccessError('no access to repo');
            }
        }
        return new StubSCMLib(trimmedUrl);
    }
}
exports.SCMLib = SCMLib;
class GitlabSCMLib extends SCMLib {
    async createSubmitRequest(targetBranchName, sourceBranchName, title, body) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return String(await (0, gitlab_1.createMergeRequest)({
            title,
            body,
            targetBranchName,
            sourceBranchName,
            repoUrl: this.url,
            accessToken: this.accessToken,
        }));
    }
    async validateParams() {
        return (0, gitlab_1.gitlabValidateParams)({
            url: this.url,
            accessToken: this.accessToken,
        });
    }
    async getRepoList() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, gitlab_1.getGitlabRepoList)(this.accessToken);
    }
    async getBranchList() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, gitlab_1.getGitlabBranchList)({
            accessToken: this.accessToken,
            repoUrl: this.url,
        });
    }
    getAuthHeaders() {
        if (this?.accessToken?.startsWith('glpat-')) {
            return {
                'Private-Token': this.accessToken,
            };
        }
        else {
            return { authorization: `Bearer ${this.accessToken}` };
        }
    }
    getDownloadUrl(sha) {
        const repoName = this.url?.split('/')[-1];
        return `${this.url}/-/archive/${sha}/${repoName}-${sha}.zip`;
    }
    async _getUsernameForAuthUrl() {
        if (this?.accessToken?.startsWith('glpat-')) {
            return this.getUsername();
        }
        else {
            return 'oauth2';
        }
    }
    async getIsRemoteBranch(branch) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, gitlab_1.getGitlabIsRemoteBranch)({
            accessToken: this.accessToken,
            repoUrl: this.url,
            branch,
        });
    }
    async getUserHasAccessToRepo() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        const username = await this.getUsername();
        return (0, gitlab_1.getGitlabIsUserCollaborator)({
            username,
            accessToken: this.accessToken,
            repoUrl: this.url,
        });
    }
    async getUsername() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, gitlab_1.getGitlabUsername)(this.accessToken);
    }
    async getSubmitRequestStatus(scmSubmitRequestId) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        const state = await (0, gitlab_1.getGitlabMergeRequestStatus)({
            accessToken: this.accessToken,
            repoUrl: this.url,
            mrNumber: Number(scmSubmitRequestId),
        });
        switch (state) {
            case gitlab_1.GitlabMergeRequestStatusEnum.merged:
                return ScmSubmitRequestStatus.MERGED;
            case gitlab_1.GitlabMergeRequestStatusEnum.opened:
                return ScmSubmitRequestStatus.OPEN;
            case gitlab_1.GitlabMergeRequestStatusEnum.closed:
                return ScmSubmitRequestStatus.CLOSED;
            default:
                throw new Error(`unknown state ${state}`);
        }
    }
    async getRepoBlameRanges(ref, path) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, gitlab_1.getGitlabBlameRanges)({ ref, path, gitlabUrl: this.url }, {
            gitlabAuthToken: this.accessToken,
        });
    }
    async getReferenceData(ref) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, gitlab_1.getGitlabReferenceData)({ ref, gitlabUrl: this.url }, {
            gitlabAuthToken: this.accessToken,
        });
    }
    async getRepoDefaultBranch() {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, gitlab_1.getGitlabRepoDefaultBranch)(this.url, {
            gitlabAuthToken: this.accessToken,
        });
    }
}
exports.GitlabSCMLib = GitlabSCMLib;
class GithubSCMLib extends SCMLib {
    async createSubmitRequest(targetBranchName, sourceBranchName, title, body) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return String(await (0, github_1.createPullRequest)({
            title,
            body,
            targetBranchName,
            sourceBranchName,
            repoUrl: this.url,
            accessToken: this.accessToken,
        }));
    }
    async validateParams() {
        return (0, github_1.githubValidateParams)(this.url, this.accessToken);
    }
    async getRepoList() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, github_1.getGithubRepoList)(this.accessToken);
    }
    async getBranchList() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, github_1.getGithubBranchList)(this.accessToken, this.url);
    }
    getAuthHeaders() {
        if (this.accessToken) {
            return { authorization: `Bearer ${this.accessToken}` };
        }
        return {};
    }
    getDownloadUrl(sha) {
        return `${this.url}/zipball/${sha}`;
    }
    async _getUsernameForAuthUrl() {
        return this.getUsername();
    }
    async getIsRemoteBranch(branch) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, github_1.getGithubIsRemoteBranch)(this.accessToken, this.url, branch);
    }
    async getUserHasAccessToRepo() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        const username = await this.getUsername();
        return (0, github_1.getGithubIsUserCollaborator)(username, this.accessToken, this.url);
    }
    async getUsername() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, github_1.getGithubUsername)(this.accessToken);
    }
    async getSubmitRequestStatus(scmSubmitRequestId) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        const state = await (0, github_1.getGithubPullRequestStatus)(this.accessToken, this.url, Number(scmSubmitRequestId));
        if (state === 'merged') {
            return ScmSubmitRequestStatus.MERGED;
        }
        if (state === 'open') {
            return ScmSubmitRequestStatus.OPEN;
        }
        if (state === 'draft') {
            return ScmSubmitRequestStatus.DRAFT;
        }
        if (state === 'closed') {
            return ScmSubmitRequestStatus.CLOSED;
        }
        throw new Error(`unknown state ${state}`);
    }
    async getRepoBlameRanges(ref, path) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, github_1.getGithubBlameRanges)({ ref, path, gitHubUrl: this.url }, {
            githubAuthToken: this.accessToken,
        });
    }
    async getReferenceData(ref) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, github_1.getGithubReferenceData)({ ref, gitHubUrl: this.url }, {
            githubAuthToken: this.accessToken,
        });
    }
    async getRepoDefaultBranch() {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, github_1.getGithubRepoDefaultBranch)(this.url, {
            githubAuthToken: this.accessToken,
        });
    }
}
exports.GithubSCMLib = GithubSCMLib;
class StubSCMLib extends SCMLib {
    async createSubmitRequest(_targetBranchName, _sourceBranchName, _title, _body) {
        console.error('createSubmitRequest() not implemented');
        throw new Error('createSubmitRequest() not implemented');
    }
    getAuthHeaders() {
        console.error('getAuthHeaders() not implemented');
        throw new Error('getAuthHeaders() not implemented');
    }
    getDownloadUrl(_sha) {
        console.error('getDownloadUrl() not implemented');
        throw new Error('getDownloadUrl() not implemented');
    }
    async _getUsernameForAuthUrl() {
        console.error('_getUsernameForAuthUrl() not implemented');
        throw new Error('_getUsernameForAuthUrl() not implemented');
    }
    async getIsRemoteBranch(_branch) {
        console.error('getIsRemoteBranch() not implemented');
        throw new Error('getIsRemoteBranch() not implemented');
    }
    async validateParams() {
        console.error('validateParams() not implemented');
        throw new Error('validateParams() not implemented');
    }
    async getRepoList() {
        console.error('getBranchList() not implemented');
        throw new Error('getBranchList() not implemented');
    }
    async getBranchList() {
        console.error('getBranchList() not implemented');
        throw new Error('getBranchList() not implemented');
    }
    async getUsername() {
        console.error('getUsername() not implemented');
        throw new Error('getUsername() not implemented');
    }
    async getSubmitRequestStatus(_scmSubmitRequestId) {
        console.error('getSubmitRequestStatus() not implemented');
        throw new Error('getSubmitRequestStatus() not implemented');
    }
    async getUserHasAccessToRepo() {
        console.error('getUserHasAccessToRepo() not implemented');
        throw new Error('getUserHasAccessToRepo() not implemented');
    }
    async getRepoBlameRanges(_ref, _path) {
        console.error('getRepoBlameRanges() not implemented');
        throw new Error('getRepoBlameRanges() not implemented');
    }
    async getReferenceData(_ref) {
        console.error('getReferenceData() not implemented');
        throw new Error('getReferenceData() not implemented');
    }
    async getRepoDefaultBranch() {
        console.error('getRepoDefaultBranch() not implemented');
        throw new Error('getRepoDefaultBranch() not implemented');
    }
}
exports.StubSCMLib = StubSCMLib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9zY20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBWWlCO0FBQ2pCLHFDQWFpQjtBQUNqQiwyQ0FBK0M7QUFFL0MsU0FBZ0Isb0JBQW9CLENBQUMsR0FBdUI7SUFDMUQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE9BQU8sU0FBUyxDQUFBO0tBQ2pCO0lBQ0QsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7UUFDdkQsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFBO0tBQzVCO0lBQ0QsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7UUFDdkQsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFBO0tBQzVCO0lBQ0QsT0FBTyxTQUFTLENBQUE7QUFDbEIsQ0FBQztBQVhELG9EQVdDO0FBRU0sS0FBSyxVQUFVLGVBQWUsQ0FBQyxFQUNwQyxPQUFPLEVBQ1AsV0FBVyxFQUNYLFdBQVcsR0FLWjtJQUNDLElBQUk7UUFDRixNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNoRCxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsR0FBRyxFQUFFLE9BQU87WUFDWixXQUFXLEVBQ1QsVUFBVSxLQUFLLGFBQWEsQ0FBQyxNQUFNO2dCQUNqQyxDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsVUFBVSxLQUFLLGFBQWEsQ0FBQyxNQUFNO29CQUNyQyxDQUFDLENBQUMsV0FBVztvQkFDYixDQUFDLENBQUMsRUFBRTtZQUNSLE9BQU8sRUFBRSxVQUFVO1NBQ3BCLENBQUMsQ0FBQTtRQUNGLE9BQU8sSUFBSSxDQUFBO0tBQ1o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8s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TUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxzQkFBc0IsQ0FDMUIsbUJBQTJCO1FBRTNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUVELEtBQUssQ0FBQyxzQkFBc0I7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0lBRUQsS0FBSyxDQUFDLGtCQUFrQixDQUN0QixJQUFZLEVBQ1osS0FBYTtRQVViLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtRQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7SUFDekQsQ0FBQztJQUVELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFZO1FBS2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtRQUNuRCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0I7UUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0NBQ0Y7QUE1RkQsZ0NBNEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgY3JlYXRlUHVsbFJlcXVlc3QsXG4gIGdldEdpdGh1YkJsYW1lUmFuZ2VzLFxuICBnZXRHaXRodWJCcmFuY2hMaXN0LFxuICBnZXRHaXRodWJJc1JlbW90ZUJyYW5jaCxcbiAgZ2V0R2l0aHViSXNVc2VyQ29sbGFib3JhdG9yLFxuICBnZXRHaXRodWJQdWxsUmVxdWVzdFN0YXR1cyxcbiAgZ2V0R2l0aHViUmVmZXJlbmNlRGF0YSxcbiAgZ2V0R2l0aHViUmVwb0RlZmF1bHRCcmFuY2gsXG4gIGdldEdpdGh1YlJlcG9MaXN0LFxuICBnZXRHaXRodWJVc2VybmFtZSxcbiAgZ2l0aHViVmFsaWRhdGVQYXJhbXMsXG59IGZyb20gJy4vZ2l0aHViJ1xuaW1wb3J0IHtcbiAgY3JlYXRlTWVyZ2VSZXF1ZXN0LFxuICBnZXRHaXRsYWJCbGFtZVJhbmdlcyxcbiAgZ2V0R2l0bGFiQnJhbmNoTGlzdCxcbiAgZ2V0R2l0bGFiSXNSZW1vdGVCcmFuY2gsXG4gIGdldEdpdGxhYklzVXNlckNvbGxhYm9yYXRvcixcbiAgZ2V0R2l0bGFiTWVyZ2VSZXF1ZXN0U3RhdHVzLFxuICBnZXRHaXRsYWJSZWZlcmVuY2VEYXRhLFxuICBnZXRHaXRsYWJSZXBvRGVmYXVsdEJyYW5jaCxcbiAgZ2V0R2l0bGFiUmVwb0xpc3QsXG4gIGdldEdpdGxhYlVzZXJuYW1lLFxuICBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLFxuICBnaXRsYWJWYWxpZGF0ZVBhcmFtcyxcbn0gZnJvbSAnLi9naXRsYWInXG5pbXBvcnQgeyBpc1ZhbGlkQnJhbmNoTmFtZSB9IGZyb20gJy4vc2NtU3VibWl0J1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NtTGliVHlwZUZyb21VcmwodXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cbiAgaWYgKHVybC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vZ2l0bGFiLmNvbS8nKSkge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkdJVExBQlxuICB9XG4gIGlmICh1cmwudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdodHRwczovL2dpdGh1Yi5jb20vJykpIHtcbiAgICByZXR1cm4gU2NtTGliU2NtVHlwZS5HSVRIVUJcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzY21DYW5SZWFjaFJlcG8oe1xuICByZXBvVXJsLFxuICBnaXRodWJUb2tlbixcbiAgZ2l0bGFiVG9rZW4sXG59OiB7XG4gIHJlcG9Vcmw6IHN0cmluZ1xuICBnaXRodWJUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIGdpdGxhYlRva2VuOiBzdHJpbmcgfCB1bmRlZmluZWRcbn0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzY21MaWJUeXBlID0gZ2V0U2NtTGliVHlwZUZyb21VcmwocmVwb1VybClcbiAgICBhd2FpdCBTQ01MaWIuaW5pdCh7XG4gICAgICB1cmw6IHJlcG9VcmwsXG4gICAgICBhY2Nlc3NUb2tlbjpcbiAgICAgICAgc2NtTGliVHlwZSA9PT0gU2NtTGliU2NtVHlwZS5HSVRIVUJcbiAgICAgICAgICA/IGdpdGh1YlRva2VuXG4gICAgICAgICAgOiBzY21MaWJUeXBlID09PSBTY21MaWJTY21UeXBlLkdJVExBQlxuICAgICAgICAgID8gZ2l0bGFiVG9rZW5cbiAgICAgICAgICA6ICcnLFxuICAgICAgc2NtVHlwZTogc2NtTGliVHlwZSxcbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZW51bSBSZWZlcmVuY2VUeXBlIHtcbiAgQlJBTkNIID0gJ0JSQU5DSCcsXG4gIENPTU1JVCA9ICdDT01NSVQnLFxuICBUQUcgPSAnVEFHJyxcbn1cblxuZXhwb3J0IGVudW0gU2NtU3VibWl0UmVxdWVzdFN0YXR1cyB7XG4gIE1FUkdFRCA9ICdNRVJHRUQnLFxuICBPUEVOID0gJ09QRU4nLFxuICBDTE9TRUQgPSAnQ0xPU0VEJyxcbiAgRFJBRlQgPSAnRFJBRlQnLFxufVxuXG5leHBvcnQgZW51bSBTY21MaWJTY21UeXBlIHtcbiAgR0lUSFVCID0gJ0dJVEhVQicsXG4gIEdJVExBQiA9ICdHSVRMQUInLFxufVxuXG5leHBvcnQgdHlwZSBTY21SZXBvSW5mbyA9IHtcbiAgcmVwb05hbWU6IHN0cmluZ1xuICByZXBvVXJsOiBzdHJpbmdcbiAgcmVwb093bmVyOiBzdHJpbmdcbiAgcmVwb0xhbmd1YWdlczogc3RyaW5nW11cbiAgcmVwb0lzUHVibGljOiBib29sZWFuXG4gIHJlcG9VcGRhdGVkQXQ6IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgSW52YWxpZFJlcG9VcmxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobTogc3RyaW5nKSB7XG4gICAgc3VwZXIobSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW52YWxpZEFjY2Vzc1Rva2VuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG06IHN0cmluZykge1xuICAgIHN1cGVyKG0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRVcmxQYXR0ZXJuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG06IHN0cmluZykge1xuICAgIHN1cGVyKG0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZk5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG06IHN0cmluZykge1xuICAgIHN1cGVyKG0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlcG9Ob1Rva2VuQWNjZXNzRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG06IHN0cmluZykge1xuICAgIHN1cGVyKG0pXG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNDTUxpYiB7XG4gIHByb3RlY3RlZCByZWFkb25seSB1cmw/OiBzdHJpbmdcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGFjY2Vzc1Rva2VuPzogc3RyaW5nXG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHVybD86IHN0cmluZywgYWNjZXNzVG9rZW4/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW5cbiAgICB0aGlzLnVybCA9IHVybFxuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFVybFdpdGhDcmVkZW50aWFscygpIHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwgZm9yIGdldFVybFdpdGhDcmVkZW50aWFscygpJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3QgdHJpbW1lZFVybCA9IHRoaXMudXJsLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gdHJpbW1lZFVybFxuICAgIH1cbiAgICBjb25zdCB1c2VybmFtZSA9IGF3YWl0IHRoaXMuX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpXG4gICAgY29uc3QgaXNfaHR0cCA9IHRyaW1tZWRVcmwudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdodHRwOi8vJylcbiAgICBjb25zdCBpc19odHRwcyA9IHRyaW1tZWRVcmwudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdodHRwczovLycpXG4gICAgaWYgKGlzX2h0dHApIHtcbiAgICAgIHJldHVybiBgaHR0cDovLyR7dXNlcm5hbWV9OiR7dGhpcy5hY2Nlc3NUb2tlbn1AJHt0cmltbWVkVXJsXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKCdodHRwOi8vJywgJycpfWBcbiAgICB9IGVsc2UgaWYgKGlzX2h0dHBzKSB7XG4gICAgICByZXR1cm4gYGh0dHBzOi8vJHt1c2VybmFtZX06JHt0aGlzLmFjY2Vzc1Rva2VufUAke3RyaW1tZWRVcmxcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnJlcGxhY2UoJ2h0dHBzOi8vJywgJycpfWBcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgaW52YWxpZCBzY20gdXJsICR7dHJpbW1lZFVybH1gKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHNjbSB1cmwgJHt0cmltbWVkVXJsfWApXG4gICAgfVxuICB9XG5cbiAgYWJzdHJhY3QgZ2V0QXV0aEhlYWRlcnMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXG4gIGFic3RyYWN0IGdldERvd25sb2FkVXJsKHNoYTogc3RyaW5nKTogc3RyaW5nXG5cbiAgYWJzdHJhY3QgX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpOiBQcm9taXNlPHN0cmluZz5cblxuICBhYnN0cmFjdCBnZXRJc1JlbW90ZUJyYW5jaChfYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+XG5cbiAgYWJzdHJhY3QgdmFsaWRhdGVQYXJhbXMoKTogUHJvbWlzZTx2b2lkPlxuXG4gIGFic3RyYWN0IGdldFJlcG9MaXN0KCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT5cblxuICBhYnN0cmFjdCBnZXRCcmFuY2hMaXN0KCk6IFByb21pc2U8c3RyaW5nW10+XG5cbiAgYWJzdHJhY3QgZ2V0VXNlckhhc0FjY2Vzc1RvUmVwbygpOiBQcm9taXNlPGJvb2xlYW4+XG5cbiAgYWJzdHJhY3QgZ2V0VXNlcm5hbWUoKTogUHJvbWlzZTxzdHJpbmc+XG5cbiAgYWJzdHJhY3QgZ2V0U3VibWl0UmVxdWVzdFN0YXR1cyhcbiAgICBfc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPlxuXG4gIGFic3RyYWN0IGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz5cblxuICBhYnN0cmFjdCBnZXRSZXBvQmxhbWVSYW5nZXMoXG4gICAgcmVmOiBzdHJpbmcsXG4gICAgcGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8XG4gICAge1xuICAgICAgc3RhcnRpbmdMaW5lOiBudW1iZXJcbiAgICAgIGVuZGluZ0xpbmU6IG51bWJlclxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgICBsb2dpbjogc3RyaW5nXG4gICAgICBlbWFpbDogc3RyaW5nXG4gICAgfVtdXG4gID5cblxuICBhYnN0cmFjdCBnZXRSZWZlcmVuY2VEYXRhKHJlZjogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgdHlwZTogUmVmZXJlbmNlVHlwZVxuICAgIHNoYTogc3RyaW5nXG4gICAgZGF0ZTogRGF0ZSB8IHVuZGVmaW5lZFxuICB9PlxuXG4gIGFic3RyYWN0IGdldFJlcG9EZWZhdWx0QnJhbmNoKCk6IFByb21pc2U8c3RyaW5nPlxuXG4gIHB1YmxpYyBnZXRBY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuIHx8ICcnXG4gIH1cblxuICBwdWJsaWMgZ2V0VXJsKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMudXJsXG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51cmwuc3BsaXQoJy8nKS5hdCgtMSkgfHwgJydcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0SXNWYWxpZEJyYW5jaE5hbWUoXG4gICAgYnJhbmNoTmFtZTogc3RyaW5nXG4gICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBpc1ZhbGlkQnJhbmNoTmFtZShicmFuY2hOYW1lKVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBhc3luYyBpbml0KHtcbiAgICB1cmwsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgc2NtVHlwZSxcbiAgfToge1xuICAgIHVybDogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICAgYWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZFxuICAgIHNjbVR5cGU6IFNjbUxpYlNjbVR5cGUgfCB1bmRlZmluZWRcbiAgfSk6IFByb21pc2U8U0NNTGliPiB7XG4gICAgbGV0IHRyaW1tZWRVcmwgPSB1bmRlZmluZWRcbiAgICBpZiAodXJsKSB7XG4gICAgICB0cmltbWVkVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZiAoU2NtTGliU2NtVHlwZS5HSVRIVUIgPT09IHNjbVR5cGUpIHtcbiAgICAgICAgY29uc3Qgc2NtID0gbmV3IEdpdGh1YlNDTUxpYih0cmltbWVkVXJsLCBhY2Nlc3NUb2tlbilcbiAgICAgICAgYXdhaXQgc2NtLnZhbGlkYXRlUGFyYW1zKClcbiAgICAgICAgcmV0dXJuIHNjbVxuICAgICAgfVxuICAgICAgaWYgKFNjbUxpYlNjbVR5cGUuR0lUTEFCID09PSBzY21UeXBlKSB7XG4gICAgICAgIGNvbnN0IHNjbSA9IG5ldyBHaXRsYWJTQ01MaWIodHJpbW1lZFVybCwgYWNjZXNzVG9rZW4pXG4gICAgICAgIGF3YWl0IHNjbS52YWxpZGF0ZVBhcmFtcygpXG4gICAgICAgIHJldHVybiBzY21cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEludmFsaWRSZXBvVXJsRXJyb3IgJiYgdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXBvTm9Ub2tlbkFjY2Vzc0Vycm9yKCdubyBhY2Nlc3MgdG8gcmVwbycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTdHViU0NNTGliKHRyaW1tZWRVcmwpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdpdGxhYlNDTUxpYiBleHRlbmRzIFNDTUxpYiB7XG4gIGFzeW5jIGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhcbiAgICAgIGF3YWl0IGNyZWF0ZU1lcmdlUmVxdWVzdCh7XG4gICAgICAgIHRpdGxlLFxuICAgICAgICBib2R5LFxuICAgICAgICB0YXJnZXRCcmFuY2hOYW1lLFxuICAgICAgICBzb3VyY2VCcmFuY2hOYW1lLFxuICAgICAgICByZXBvVXJsOiB0aGlzLnVybCxcbiAgICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGFzeW5jIHZhbGlkYXRlUGFyYW1zKCkge1xuICAgIHJldHVybiBnaXRsYWJWYWxpZGF0ZVBhcmFtcyh7XG4gICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9MaXN0KCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGxhYlJlcG9MaXN0KHRoaXMuYWNjZXNzVG9rZW4pXG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hMaXN0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBnZXRHaXRsYWJCcmFuY2hMaXN0KHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgfSlcbiAgfVxuXG4gIGdldEF1dGhIZWFkZXJzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGlmICh0aGlzPy5hY2Nlc3NUb2tlbj8uc3RhcnRzV2l0aCgnZ2xwYXQtJykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdQcml2YXRlLVRva2VuJzogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgYXV0aG9yaXphdGlvbjogYEJlYXJlciAke3RoaXMuYWNjZXNzVG9rZW59YCB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RG93bmxvYWRVcmwoc2hhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlcG9OYW1lID0gdGhpcy51cmw/LnNwbGl0KCcvJylbLTFdXG4gICAgcmV0dXJuIGAke3RoaXMudXJsfS8tL2FyY2hpdmUvJHtzaGF9LyR7cmVwb05hbWV9LSR7c2hhfS56aXBgXG4gIH1cblxuICBhc3luYyBfZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKHRoaXM/LmFjY2Vzc1Rva2VuPy5zdGFydHNXaXRoKCdnbHBhdC0nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlcm5hbWUoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ29hdXRoMidcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRJc1JlbW90ZUJyYW5jaChicmFuY2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGxhYklzUmVtb3RlQnJhbmNoKHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgICBicmFuY2gsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJIYXNBY2Nlc3NUb1JlcG8oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICBjb25zdCB1c2VybmFtZSA9IGF3YWl0IHRoaXMuZ2V0VXNlcm5hbWUoKVxuICAgIHJldHVybiBnZXRHaXRsYWJJc1VzZXJDb2xsYWJvcmF0b3Ioe1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRVc2VybmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGxhYlVzZXJuYW1lKHRoaXMuYWNjZXNzVG9rZW4pXG4gIH1cblxuICBhc3luYyBnZXRTdWJtaXRSZXF1ZXN0U3RhdHVzKFxuICAgIHNjbVN1Ym1pdFJlcXVlc3RJZDogc3RyaW5nXG4gICk6IFByb21pc2U8U2NtU3VibWl0UmVxdWVzdFN0YXR1cz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCBnZXRHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXMoe1xuICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICByZXBvVXJsOiB0aGlzLnVybCxcbiAgICAgIG1yTnVtYmVyOiBOdW1iZXIoc2NtU3VibWl0UmVxdWVzdElkKSxcbiAgICB9KVxuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgR2l0bGFiTWVyZ2VSZXF1ZXN0U3RhdHVzRW51bS5tZXJnZWQ6XG4gICAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLk1FUkdFRFxuICAgICAgY2FzZSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLm9wZW5lZDpcbiAgICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuT1BFTlxuICAgICAgY2FzZSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLmNsb3NlZDpcbiAgICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuQ0xPU0VEXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gc3RhdGUgJHtzdGF0ZX1gKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9CbGFtZVJhbmdlcyhcbiAgICByZWY6IHN0cmluZyxcbiAgICBwYXRoOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxcbiAgICB7XG4gICAgICBzdGFydGluZ0xpbmU6IG51bWJlclxuICAgICAgZW5kaW5nTGluZTogbnVtYmVyXG4gICAgICBuYW1lOiBzdHJpbmdcbiAgICAgIGxvZ2luOiBzdHJpbmdcbiAgICAgIGVtYWlsOiBzdHJpbmdcbiAgICB9W11cbiAgPiB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGdldEdpdGxhYkJsYW1lUmFuZ2VzKFxuICAgICAgeyByZWYsIHBhdGgsIGdpdGxhYlVybDogdGhpcy51cmwgfSxcbiAgICAgIHtcbiAgICAgICAgZ2l0bGFiQXV0aFRva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIGFzeW5jIGdldFJlZmVyZW5jZURhdGEocmVmOiBzdHJpbmcpOiBQcm9taXNlPHtcbiAgICB0eXBlOiBSZWZlcmVuY2VUeXBlXG4gICAgc2hhOiBzdHJpbmdcbiAgICBkYXRlOiBEYXRlIHwgdW5kZWZpbmVkXG4gIH0+IHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YShcbiAgICAgIHsgcmVmLCBnaXRsYWJVcmw6IHRoaXMudXJsIH0sXG4gICAgICB7XG4gICAgICAgIGdpdGxhYkF1dGhUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBhc3luYyBnZXRSZXBvRGVmYXVsdEJyYW5jaCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBnZXRHaXRsYWJSZXBvRGVmYXVsdEJyYW5jaCh0aGlzLnVybCwge1xuICAgICAgZ2l0bGFiQXV0aFRva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdpdGh1YlNDTUxpYiBleHRlbmRzIFNDTUxpYiB7XG4gIGFzeW5jIGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhcbiAgICAgIGF3YWl0IGNyZWF0ZVB1bGxSZXF1ZXN0KHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHRhcmdldEJyYW5jaE5hbWUsXG4gICAgICAgIHNvdXJjZUJyYW5jaE5hbWUsXG4gICAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgYXN5bmMgdmFsaWRhdGVQYXJhbXMoKSB7XG4gICAgcmV0dXJuIGdpdGh1YlZhbGlkYXRlUGFyYW1zKHRoaXMudXJsLCB0aGlzLmFjY2Vzc1Rva2VuKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0xpc3QoKTogUHJvbWlzZTxTY21SZXBvSW5mb1tdPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0R2l0aHViUmVwb0xpc3QodGhpcy5hY2Nlc3NUb2tlbilcbiAgfVxuXG4gIGFzeW5jIGdldEJyYW5jaExpc3QoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGh1YkJyYW5jaExpc3QodGhpcy5hY2Nlc3NUb2tlbiwgdGhpcy51cmwpXG4gIH1cblxuICBnZXRBdXRoSGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgcmV0dXJuIHsgYXV0aG9yaXphdGlvbjogYEJlYXJlciAke3RoaXMuYWNjZXNzVG9rZW59YCB9XG4gICAgfVxuICAgIHJldHVybiB7fVxuICB9XG5cbiAgZ2V0RG93bmxvYWRVcmwoc2hhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLnVybH0vemlwYmFsbC8ke3NoYX1gXG4gIH1cblxuICBhc3luYyBfZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlcm5hbWUoKVxuICB9XG5cbiAgYXN5bmMgZ2V0SXNSZW1vdGVCcmFuY2goYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBnZXRHaXRodWJJc1JlbW90ZUJyYW5jaCh0aGlzLmFjY2Vzc1Rva2VuLCB0aGlzLnVybCwgYnJhbmNoKVxuICB9XG5cbiAgYXN5bmMgZ2V0VXNlckhhc0FjY2Vzc1RvUmVwbygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIGNvbnN0IHVzZXJuYW1lID0gYXdhaXQgdGhpcy5nZXRVc2VybmFtZSgpXG4gICAgcmV0dXJuIGdldEdpdGh1YklzVXNlckNvbGxhYm9yYXRvcih1c2VybmFtZSwgdGhpcy5hY2Nlc3NUb2tlbiwgdGhpcy51cmwpXG4gIH1cblxuICBhc3luYyBnZXRVc2VybmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGh1YlVzZXJuYW1lKHRoaXMuYWNjZXNzVG9rZW4pXG4gIH1cblxuICBhc3luYyBnZXRTdWJtaXRSZXF1ZXN0U3RhdHVzKFxuICAgIHNjbVN1Ym1pdFJlcXVlc3RJZDogc3RyaW5nXG4gICk6IFByb21pc2U8U2NtU3VibWl0UmVxdWVzdFN0YXR1cz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCBnZXRHaXRodWJQdWxsUmVxdWVzdFN0YXR1cyhcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB0aGlzLnVybCxcbiAgICAgIE51bWJlcihzY21TdWJtaXRSZXF1ZXN0SWQpXG4gICAgKVxuICAgIGlmIChzdGF0ZSA9PT0gJ21lcmdlZCcpIHtcbiAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLk1FUkdFRFxuICAgIH1cbiAgICBpZiAoc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuT1BFTlxuICAgIH1cbiAgICBpZiAoc3RhdGUgPT09ICdkcmFmdCcpIHtcbiAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLkRSQUZUXG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLkNMT1NFRFxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gc3RhdGUgJHtzdGF0ZX1gKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0JsYW1lUmFuZ2VzKFxuICAgIHJlZjogc3RyaW5nLFxuICAgIHBhdGg6IHN0cmluZ1xuICApOiBQcm9taXNlPFxuICAgIHtcbiAgICAgIHN0YXJ0aW5nTGluZTogbnVtYmVyXG4gICAgICBlbmRpbmdMaW5lOiBudW1iZXJcbiAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgbG9naW46IHN0cmluZ1xuICAgICAgZW1haWw6IHN0cmluZ1xuICAgIH1bXVxuICA+IHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZ2V0R2l0aHViQmxhbWVSYW5nZXMoXG4gICAgICB7IHJlZiwgcGF0aCwgZ2l0SHViVXJsOiB0aGlzLnVybCB9LFxuICAgICAge1xuICAgICAgICBnaXRodWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVmZXJlbmNlRGF0YShyZWY6IHN0cmluZyk6IFByb21pc2U8e1xuICAgIHR5cGU6IFJlZmVyZW5jZVR5cGVcbiAgICBzaGE6IHN0cmluZ1xuICAgIGRhdGU6IERhdGUgfCB1bmRlZmluZWRcbiAgfT4ge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBnZXRHaXRodWJSZWZlcmVuY2VEYXRhKFxuICAgICAgeyByZWYsIGdpdEh1YlVybDogdGhpcy51cmwgfSxcbiAgICAgIHtcbiAgICAgICAgZ2l0aHViQXV0aFRva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9EZWZhdWx0QnJhbmNoKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGdldEdpdGh1YlJlcG9EZWZhdWx0QnJhbmNoKHRoaXMudXJsLCB7XG4gICAgICBnaXRodWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3R1YlNDTUxpYiBleHRlbmRzIFNDTUxpYiB7XG4gIGFzeW5jIGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgX3RhcmdldEJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICBfc291cmNlQnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIF90aXRsZTogc3RyaW5nLFxuICAgIF9ib2R5OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zb2xlLmVycm9yKCdjcmVhdGVTdWJtaXRSZXF1ZXN0KCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZVN1Ym1pdFJlcXVlc3QoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgZ2V0QXV0aEhlYWRlcnMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0QXV0aEhlYWRlcnMoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0QXV0aEhlYWRlcnMoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgZ2V0RG93bmxvYWRVcmwoX3NoYTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXREb3dubG9hZFVybCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXREb3dubG9hZFVybCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyBfZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc29sZS5lcnJvcignX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdfZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldElzUmVtb3RlQnJhbmNoKF9icmFuY2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldElzUmVtb3RlQnJhbmNoKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldElzUmVtb3RlQnJhbmNoKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIHZhbGlkYXRlUGFyYW1zKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3ZhbGlkYXRlUGFyYW1zKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbGlkYXRlUGFyYW1zKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9MaXN0KCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldEJyYW5jaExpc3QoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0QnJhbmNoTGlzdCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hMaXN0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRCcmFuY2hMaXN0KCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldEJyYW5jaExpc3QoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0VXNlcm5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRVc2VybmFtZSgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRVc2VybmFtZSgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyBnZXRTdWJtaXRSZXF1ZXN0U3RhdHVzKFxuICAgIF9zY21TdWJtaXRSZXF1ZXN0SWQ6IHN0cmluZ1xuICApOiBQcm9taXNlPFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXM+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRTdWJtaXRSZXF1ZXN0U3RhdHVzKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFN1Ym1pdFJlcXVlc3RTdGF0dXMoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0VXNlckhhc0FjY2Vzc1RvUmVwbygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRVc2VySGFzQWNjZXNzVG9SZXBvKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFVzZXJIYXNBY2Nlc3NUb1JlcG8oKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0JsYW1lUmFuZ2VzKFxuICAgIF9yZWY6IHN0cmluZyxcbiAgICBfcGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8XG4gICAge1xuICAgICAgc3RhcnRpbmdMaW5lOiBudW1iZXJcbiAgICAgIGVuZGluZ0xpbmU6IG51bWJlclxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgICBsb2dpbjogc3RyaW5nXG4gICAgICBlbWFpbDogc3RyaW5nXG4gICAgfVtdXG4gID4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldFJlcG9CbGFtZVJhbmdlcygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRSZXBvQmxhbWVSYW5nZXMoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVmZXJlbmNlRGF0YShfcmVmOiBzdHJpbmcpOiBQcm9taXNlPHtcbiAgICB0eXBlOiBSZWZlcmVuY2VUeXBlXG4gICAgc2hhOiBzdHJpbmdcbiAgICBkYXRlOiBEYXRlIHwgdW5kZWZpbmVkXG4gIH0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRSZWZlcmVuY2VEYXRhKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFJlZmVyZW5jZURhdGEoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0RlZmF1bHRCcmFuY2goKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRSZXBvRGVmYXVsdEJyYW5jaCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRSZXBvRGVmYXVsdEJyYW5jaCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cbn1cbiJdfQ==