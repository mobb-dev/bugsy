"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubSCMLib = exports.GithubSCMLib = exports.GitlabSCMLib = exports.AdoSCMLib = exports.SCMLib = exports.RebaseFailedError = exports.RepoNoTokenAccessError = exports.RefNotFoundError = exports.BadShaError = exports.InvalidUrlPatternError = exports.InvalidAccessTokenError = exports.InvalidRepoUrlError = exports.ScmLibScmType = exports.ScmSubmitRequestStatus = exports.ReferenceType = exports.scmCanReachRepo = exports.getScmConfig = exports.getScmLibTypeFromScmType = exports.getScmTypeFromScmLibType = exports.ScmCloudUrl = exports.ScmType = exports.getCloudScmLibTypeFromUrl = exports.ghGetUserInfo = void 0;
const core_1 = require("@octokit/core");
const zod_1 = require("zod");
const ado_1 = require("./ado");
const encryptSecret_1 = require("./github/encryptSecret");
const github_1 = require("./github/github");
const github_v2_1 = require("./github/github-v2");
const gitlab_1 = require("./gitlab/gitlab");
const scmSubmit_1 = require("./scmSubmit");
exports.ghGetUserInfo = github_1.getUserInfo;
function getCloudScmLibTypeFromUrl(url) {
    if (!url) {
        return undefined;
    }
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.toLowerCase();
    if (hostname === 'gitlab.com') {
        return ScmLibScmType.GITLAB;
    }
    if (hostname === 'github.com') {
        return ScmLibScmType.GITHUB;
    }
    if (hostname === 'dev.azure.com' || hostname.endsWith('.visualstudio.com')) {
        return ScmLibScmType.ADO;
    }
    return undefined;
}
exports.getCloudScmLibTypeFromUrl = getCloudScmLibTypeFromUrl;
var ScmType;
(function (ScmType) {
    ScmType["GitLab"] = "GitLab";
    ScmType["GitHub"] = "GitHub";
    ScmType["Ado"] = "Ado";
})(ScmType = exports.ScmType || (exports.ScmType = {}));
var ScmCloudUrl;
(function (ScmCloudUrl) {
    ScmCloudUrl["GitLab"] = "https://gitlab.com";
    ScmCloudUrl["GitHub"] = "https://github.com";
    ScmCloudUrl["Ado"] = "https://dev.azure.com";
})(ScmCloudUrl = exports.ScmCloudUrl || (exports.ScmCloudUrl = {}));
function getScmTypeFromScmLibType(scmLibType) {
    if (scmLibType === ScmLibScmType.GITLAB) {
        return ScmType.GitLab;
    }
    if (scmLibType === ScmLibScmType.GITHUB) {
        return ScmType.GitHub;
    }
    if (scmLibType === ScmLibScmType.ADO) {
        return ScmType.Ado;
    }
    throw new Error(`unknown scm lib type: ${scmLibType}`);
}
exports.getScmTypeFromScmLibType = getScmTypeFromScmLibType;
function getScmLibTypeFromScmType(scmType) {
    if (scmType === ScmType.GitLab) {
        return ScmLibScmType.GITLAB;
    }
    if (scmType === ScmType.GitHub) {
        return ScmLibScmType.GITHUB;
    }
    if (scmType === ScmType.Ado) {
        return ScmLibScmType.ADO;
    }
    throw new Error(`unknown scm type: ${scmType}`);
}
exports.getScmLibTypeFromScmType = getScmLibTypeFromScmType;
function getScmConfig({ url, scmConfigs, includeOrgTokens = true, }) {
    const filteredScmConfigs = scmConfigs.filter((scm) => {
        const urlObject = new URL(url);
        const configUrl = new URL(scm.scmUrl);
        return (
        //if we the user does an ADO oauth flow then the token is saved for dev.azure.com but
        //sometimes the user uses the url dev.azure.com and sometimes the url visualstudio.com
        //so we need to check both
        (urlObject.hostname.toLowerCase() === configUrl.hostname.toLowerCase() ||
            (urlObject.hostname.toLowerCase().endsWith('.visualstudio.com') &&
                configUrl.hostname.toLowerCase() === 'dev.azure.com')) &&
            urlObject.protocol === configUrl.protocol &&
            urlObject.port === configUrl.port);
    });
    const scmOrgConfig = filteredScmConfigs.find((scm) => scm.orgId && scm.token);
    if (scmOrgConfig && includeOrgTokens) {
        return {
            id: scmOrgConfig.id,
            accessToken: scmOrgConfig.token || undefined,
            scmLibType: getScmLibTypeFromScmType(scmOrgConfig.scmType),
            scmOrg: scmOrgConfig.scmOrg || undefined,
        };
    }
    const scmUserConfig = filteredScmConfigs.find((scm) => scm.userId && scm.token);
    if (scmUserConfig) {
        return {
            id: scmUserConfig.id,
            accessToken: scmUserConfig.token || undefined,
            scmLibType: getScmLibTypeFromScmType(scmUserConfig.scmType),
            scmOrg: scmUserConfig.scmOrg || undefined,
        };
    }
    const type = getCloudScmLibTypeFromUrl(url);
    if (type) {
        return {
            id: undefined,
            accessToken: undefined,
            scmLibType: type,
            scmOrg: undefined,
        };
    }
    return {
        id: undefined,
        accessToken: undefined,
        scmLibType: undefined,
        scmOrg: undefined,
    };
}
exports.getScmConfig = getScmConfig;
async function scmCanReachRepo({ repoUrl, scmType, accessToken, scmOrg, }) {
    try {
        await SCMLib.init({
            url: repoUrl,
            accessToken,
            scmType: getScmLibTypeFromScmType(scmType),
            scmOrg,
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
    ScmLibScmType["ADO"] = "ADO";
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
class BadShaError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.BadShaError = BadShaError;
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
class RebaseFailedError extends Error {
}
exports.RebaseFailedError = RebaseFailedError;
class SCMLib {
    url;
    accessToken;
    scmOrg;
    constructor(url, accessToken, scmOrg) {
        this.accessToken = accessToken;
        this.url = url;
        this.scmOrg = scmOrg;
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
        const scmLibType = this.getScmLibType();
        if (scmLibType === ScmLibScmType.ADO) {
            return `https://${this.accessToken}@${trimmedUrl
                .toLowerCase()
                .replace('https://', '')}`;
        }
        const is_http = trimmedUrl.toLowerCase().startsWith('http://');
        const is_https = trimmedUrl.toLowerCase().startsWith('https://');
        const username = await this._getUsernameForAuthUrl();
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
    static async init({ url, accessToken, scmType, scmOrg, }) {
        let trimmedUrl = undefined;
        if (url) {
            trimmedUrl = url.trim().replace(/\/$/, '').replace(/.git$/i, '');
        }
        try {
            if (ScmLibScmType.GITHUB === scmType) {
                const scm = new GithubSCMLib(trimmedUrl, accessToken, scmOrg);
                await scm.validateParams();
                return scm;
            }
            if (ScmLibScmType.GITLAB === scmType) {
                const scm = new GitlabSCMLib(trimmedUrl, accessToken, scmOrg);
                await scm.validateParams();
                return scm;
            }
            if (ScmLibScmType.ADO === scmType) {
                const scm = new AdoSCMLib(trimmedUrl, accessToken, scmOrg);
                await scm.validateParams();
                return scm;
            }
        }
        catch (e) {
            if (e instanceof InvalidRepoUrlError && url) {
                throw new RepoNoTokenAccessError('no access to repo');
            }
        }
        return new StubSCMLib(trimmedUrl, undefined, undefined);
    }
    _validateAccessTokenAndUrl() {
        if (!this.accessToken) {
            throw new InvalidAccessTokenError('no access token');
        }
        if (!this.url) {
            throw new InvalidRepoUrlError('no url');
        }
    }
}
exports.SCMLib = SCMLib;
class AdoSCMLib extends SCMLib {
    updatePrComment(_params, _oktokit) {
        throw new Error('updatePrComment not implemented.');
    }
    getPrComment(_commentId) {
        throw new Error('getPrComment not implemented.');
    }
    async forkRepo() {
        throw new Error('forkRepo not supported yet');
    }
    async createOrUpdateRepositorySecret() {
        throw new Error('createOrUpdateRepositorySecret not supported yet');
    }
    async createPullRequestWithNewFile(_sourceRepoUrl, _filesPaths, _userRepoUrl, _title, _body) {
        throw new Error('createPullRequestWithNewFile not supported yet');
    }
    async createSubmitRequest(targetBranchName, sourceBranchName, title, body) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return String(await (0, ado_1.createAdoPullRequest)({
            title,
            body,
            targetBranchName,
            sourceBranchName,
            repoUrl: this.url,
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
        }));
    }
    async validateParams() {
        return (0, ado_1.adoValidateParams)({
            url: this.url,
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
        });
    }
    async getRepoList(scmOrg) {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, ado_1.getAdoRepoList)({
            orgName: scmOrg,
            tokenOrg: this.scmOrg,
            accessToken: this.accessToken,
        });
    }
    async getBranchList() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, ado_1.getAdoBranchList)({
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
            repoUrl: this.url,
        });
    }
    getScmLibType() {
        return ScmLibScmType.ADO;
    }
    getAuthHeaders() {
        if (this.accessToken) {
            if ((0, ado_1.getAdoTokenType)(this.accessToken) === ado_1.AdoTokenTypeEnum.OAUTH) {
                return {
                    authorization: `Bearer ${this.accessToken}`,
                };
            }
            else {
                return {
                    authorization: `Basic ${Buffer.from(':' + this.accessToken).toString('base64')}`,
                };
            }
        }
        return {};
    }
    getDownloadUrl(sha) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return (0, ado_1.getAdoDownloadUrl)({ repoUrl: this.url, branch: sha });
    }
    async _getUsernameForAuthUrl() {
        throw new Error('_getUsernameForAuthUrl() is not relevant for ADO');
    }
    async getIsRemoteBranch(branch) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, ado_1.getAdoIsRemoteBranch)({
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
            repoUrl: this.url,
            branch,
        });
    }
    async getUserHasAccessToRepo() {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        return (0, ado_1.getAdoIsUserCollaborator)({
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
            repoUrl: this.url,
        });
    }
    async getUsername() {
        throw new Error('getUsername() is not relevant for ADO');
    }
    async getSubmitRequestStatus(scmSubmitRequestId) {
        if (!this.accessToken || !this.url) {
            console.error('no access token or no url');
            throw new Error('no access token or no url');
        }
        const state = await (0, ado_1.getAdoPullRequestStatus)({
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
            repoUrl: this.url,
            prNumber: Number(scmSubmitRequestId),
        });
        switch (state) {
            case ado_1.AdoPullRequestStatusEnum.completed:
                return ScmSubmitRequestStatus.MERGED;
            case ado_1.AdoPullRequestStatusEnum.active:
                return ScmSubmitRequestStatus.OPEN;
            case ado_1.AdoPullRequestStatusEnum.abandoned:
                return ScmSubmitRequestStatus.CLOSED;
            default:
                throw new Error(`unknown state ${state}`);
        }
    }
    async getRepoBlameRanges(_ref, _path) {
        return await (0, ado_1.getAdoBlameRanges)();
    }
    async getReferenceData(ref) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, ado_1.getAdoReferenceData)({
            ref,
            repoUrl: this.url,
            accessToken: this.accessToken,
            tokenOrg: this.scmOrg,
        });
    }
    async getRepoDefaultBranch() {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, ado_1.getAdoRepoDefaultBranch)({
            repoUrl: this.url,
            tokenOrg: this.scmOrg,
            accessToken: this.accessToken,
        });
    }
    getPrUrl(prNumber) {
        this._validateAccessTokenAndUrl();
        return Promise.resolve((0, ado_1.getAdoPrUrl)({ prNumber, url: this.url }));
    }
    postGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
    getGeneralPrComments() {
        throw new Error('Method not implemented.');
    }
    deleteGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
}
exports.AdoSCMLib = AdoSCMLib;
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
    async forkRepo() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        throw new Error('not supported yet');
    }
    async createOrUpdateRepositorySecret() {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        throw new Error('not supported yet');
    }
    async createPullRequestWithNewFile(_sourceRepoUrl, _filesPaths, _userRepoUrl, _title, _body) {
        throw new Error('not implemented');
    }
    async getRepoList(_scmOrg) {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, gitlab_1.getGitlabRepoList)(this.url, this.accessToken);
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
    getScmLibType() {
        return ScmLibScmType.GITLAB;
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
        const urlSplit = this.url?.split('/') || [];
        const repoName = urlSplit[urlSplit?.length - 1];
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
        return (0, gitlab_1.getGitlabUsername)(this.url, this.accessToken);
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
            url: this.url,
            gitlabAuthToken: this.accessToken,
        });
    }
    async getReferenceData(ref) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, gitlab_1.getGitlabReferenceData)({ ref, gitlabUrl: this.url }, {
            url: this.url,
            gitlabAuthToken: this.accessToken,
        });
    }
    async getRepoDefaultBranch() {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        return await (0, gitlab_1.getGitlabRepoDefaultBranch)(this.url, {
            url: this.url,
            gitlabAuthToken: this.accessToken,
        });
    }
    getPrComment(_commentId) {
        throw new Error('getPrComment not implemented.');
    }
    updatePrComment(_params, _oktokit) {
        throw new Error('updatePrComment not implemented.');
    }
    async getPrUrl(prNumber) {
        this._validateAccessTokenAndUrl();
        const res = await (0, gitlab_1.getGitlabMergeRequest)({
            url: this.url,
            prNumber: prNumber,
            accessToken: this.accessToken,
        });
        return res.web_url;
    }
    postGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
    getGeneralPrComments() {
        throw new Error('Method not implemented.');
    }
    deleteGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
}
exports.GitlabSCMLib = GitlabSCMLib;
class GithubSCMLib extends SCMLib {
    oktokit;
    // we don't always need a url, what's important is that we have an access token
    constructor(url, accessToken, scmOrg) {
        super(url, accessToken, scmOrg);
        this.oktokit = new core_1.Octokit({ auth: accessToken });
    }
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
    async forkRepo(repoUrl) {
        if (!this.accessToken) {
            console.error('no access token');
            throw new Error('no access token');
        }
        return (0, github_1.forkRepo)({
            repoUrl: repoUrl,
            accessToken: this.accessToken,
        });
    }
    async createOrUpdateRepositorySecret(params, _oktokit) {
        if ((!_oktokit && !this.accessToken) || !this.url) {
            throw new Error('cannot delete comment without access token or url');
        }
        const oktokit = _oktokit || this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        const { data: repositoryPublicKeyResponse } = await (0, github_v2_1.getARepositoryPublicKey)(oktokit, {
            owner,
            repo,
        });
        const { key_id, key } = repositoryPublicKeyResponse;
        const encryptedValue = await (0, encryptSecret_1.encryptSecret)(params.value, key);
        return (0, github_v2_1.createOrUpdateRepositorySecret)(oktokit, {
            encrypted_value: encryptedValue,
            secret_name: params.name,
            key_id,
            owner,
            repo,
        });
    }
    async createPullRequestWithNewFile(sourceRepoUrl, filesPaths, userRepoUrl, title, body) {
        const { pull_request_url } = await (0, github_1.createPr)({
            sourceRepoUrl,
            filesPaths,
            userRepoUrl,
            title,
            body,
        }, {
            githubAuthToken: this.accessToken,
        });
        return { pull_request_url: pull_request_url };
    }
    async validateParams() {
        return (0, github_1.githubValidateParams)(this.url, this.accessToken);
    }
    async postPrComment(params, _oktokit) {
        if ((!_oktokit && !this.accessToken) || !this.url) {
            throw new Error('cannot post on PR without access token or url');
        }
        const oktokit = _oktokit || this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return (0, github_v2_1.postPrComment)(oktokit, {
            ...params,
            owner,
            repo,
        });
    }
    async updatePrComment(params, _oktokit) {
        if ((!_oktokit && !this.accessToken) || !this.url) {
            throw new Error('cannot update on PR without access token or url');
        }
        const oktokit = _oktokit || this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return (0, github_v2_1.updatePrComment)(oktokit, {
            ...params,
            owner,
            repo,
        });
    }
    async deleteComment(params, _oktokit) {
        if ((!_oktokit && !this.accessToken) || !this.url) {
            throw new Error('cannot delete comment without access token or url');
        }
        const oktokit = _oktokit || this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return (0, github_v2_1.deleteComment)(oktokit, {
            ...params,
            owner,
            repo,
        });
    }
    async getPrComments(params, _oktokit) {
        if ((!_oktokit && !this.accessToken) || !this.url) {
            throw new Error('cannot get Pr Comments without access token or url');
        }
        const oktokit = _oktokit || this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return (0, github_v2_1.getPrComments)(oktokit, {
            per_page: 100,
            ...params,
            owner,
            repo,
        });
    }
    async getPrDiff(params) {
        if (!this.accessToken || !this.url) {
            throw new Error('cannot get Pr Comments without access token or url');
        }
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        const prRes = await (0, github_v2_1.getPrDiff)(this.oktokit, {
            ...params,
            owner,
            repo,
        });
        // note: for some reason ocktokit does not know to return response as string
        // look at  'getPrDiff' implementation
        return zod_1.z.string().parse(prRes.data);
    }
    async getRepoList(_scmOrg) {
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
    getScmLibType() {
        return ScmLibScmType.GITHUB;
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
    async getPrComment(commentId) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return await (0, github_v2_1.getPrComment)(this.oktokit, {
            repo,
            owner,
            comment_id: commentId,
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
    async getPrUrl(prNumber) {
        if (!this.url || !this.oktokit) {
            console.error('no url');
            throw new Error('no url');
        }
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        const getPrRes = await (0, github_v2_1.getPr)(this.oktokit, {
            owner,
            repo,
            pull_number: prNumber,
        });
        return getPrRes.data.html_url;
    }
    async postGeneralPrComment(params, auth) {
        const { prNumber, body } = params;
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        const oktoKit = auth ? new core_1.Octokit({ auth: auth.authToken }) : this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return await (0, github_v2_1.postGeneralPrComment)(oktoKit, {
            issue_number: prNumber,
            owner,
            repo,
            body,
        });
    }
    async getGeneralPrComments(params, auth) {
        const { prNumber } = params;
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        const oktoKit = auth ? new core_1.Octokit({ auth: auth.authToken }) : this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return await (0, github_v2_1.getGeneralPrComments)(oktoKit, {
            issue_number: prNumber,
            owner,
            repo,
        });
    }
    async deleteGeneralPrComment({ commentId }, auth) {
        if (!this.url) {
            console.error('no url');
            throw new Error('no url');
        }
        const oktoKit = auth ? new core_1.Octokit({ auth: auth.authToken }) : this.oktokit;
        const { owner, repo } = (0, github_1.parseGithubOwnerAndRepo)(this.url);
        return (0, github_v2_1.deleteGeneralPrComment)(oktoKit, {
            owner,
            repo,
            comment_id: commentId,
        });
    }
}
exports.GithubSCMLib = GithubSCMLib;
class StubSCMLib extends SCMLib {
    async createSubmitRequest(_targetBranchName, _sourceBranchName, _title, _body) {
        console.error('createSubmitRequest() not implemented');
        throw new Error('createSubmitRequest() not implemented');
    }
    getScmLibType() {
        console.error('getScmLibType() not implemented');
        throw new Error('getScmLibType() not implemented');
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
    async forkRepo() {
        console.error('forkRepo() not implemented');
        throw new Error('forkRepo() not implemented');
    }
    async createOrUpdateRepositorySecret() {
        console.error('forkRepo() not implemented');
        throw new Error('forkRepo() not implemented');
    }
    async createPullRequestWithNewFile(_sourceRepoUrl, _filesPaths, _userRepoUrl, _title, _body) {
        console.error('createPullRequestWithNewFile() not implemented');
        throw new Error('createPullRequestWithNewFile() not implemented');
    }
    async getRepoList(_scmOrg) {
        console.error('getRepoList() not implemented');
        throw new Error('getRepoList() not implemented');
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
    async getPrComment(_commentId) {
        console.error('getPrComment() not implemented');
        throw new Error('getPrComment() not implemented');
    }
    async updatePrComment() {
        console.error('updatePrComment() not implemented');
        throw new Error('updatePrComment() not implemented');
    }
    async getPrUrl(_prNumber) {
        console.error('getPr() not implemented');
        throw new Error('getPr() not implemented');
    }
    postGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
    getGeneralPrComments() {
        throw new Error('Method not implemented.');
    }
    deleteGeneralPrComment() {
        throw new Error('Method not implemented.');
    }
}
exports.StubSCMLib = StubSCMLib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9zY20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXVDO0FBQ3ZDLDZCQUF1QjtBQUV2QiwrQkFnQmM7QUFDZCwwREFBc0Q7QUFDdEQsNENBZ0J3QjtBQUN4QixrREFhMkI7QUFhM0IsNENBY3dCO0FBQ3hCLDJDQUErQztBQWdCbEMsUUFBQSxhQUFhLEdBQUcsb0JBQVcsQ0FBQTtBQUN4QyxTQUFnQix5QkFBeUIsQ0FBQyxHQUF1QjtJQUMvRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsT0FBTyxTQUFTLENBQUE7S0FDakI7SUFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM5QixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2pELElBQUksUUFBUSxLQUFLLFlBQVksRUFBRTtRQUM3QixPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUE7S0FDNUI7SUFDRCxJQUFJLFFBQVEsS0FBSyxZQUFZLEVBQUU7UUFDN0IsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFBO0tBQzVCO0lBQ0QsSUFBSSxRQUFRLEtBQUssZUFBZSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUMxRSxPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUE7S0FDekI7SUFDRCxPQUFPLFNBQVMsQ0FBQTtBQUNsQixDQUFDO0FBaEJELDhEQWdCQztBQUVELElBQVksT0FJWDtBQUpELFdBQVksT0FBTztJQUNqQiw0QkFBaUIsQ0FBQTtJQUNqQiw0QkFBaUIsQ0FBQTtJQUNqQixzQkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQUpXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQUlsQjtBQUVELElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJ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VUFBa0I7UUFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBQ0QsS0FBSyxDQUFDLGVBQWU7UUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFpQjtRQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFDRCxvQkFBb0I7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFDRCxvQkFBb0I7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFDRCxzQkFBc0I7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7Q0FDRjtBQTFJRCxnQ0EwSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPY3Rva2l0IH0gZnJvbSAnQG9jdG9raXQvY29yZSdcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnXG5cbmltcG9ydCB7XG4gIEFkb1B1bGxSZXF1ZXN0U3RhdHVzRW51bSxcbiAgQWRvVG9rZW5UeXBlRW51bSxcbiAgYWRvVmFsaWRhdGVQYXJhbXMsXG4gIGNyZWF0ZUFkb1B1bGxSZXF1ZXN0LFxuICBnZXRBZG9CbGFtZVJhbmdlcyxcbiAgZ2V0QWRvQnJhbmNoTGlzdCxcbiAgZ2V0QWRvRG93bmxvYWRVcmwsXG4gIGdldEFkb0lzUmVtb3RlQnJhbmNoLFxuICBnZXRBZG9Jc1VzZXJDb2xsYWJvcmF0b3IsXG4gIGdldEFkb1ByVXJsLFxuICBnZXRBZG9QdWxsUmVxdWVzdFN0YXR1cyxcbiAgZ2V0QWRvUmVmZXJlbmNlRGF0YSxcbiAgZ2V0QWRvUmVwb0RlZmF1bHRCcmFuY2gsXG4gIGdldEFkb1JlcG9MaXN0LFxuICBnZXRBZG9Ub2tlblR5cGUsXG59IGZyb20gJy4vYWRvJ1xuaW1wb3J0IHsgZW5jcnlwdFNlY3JldCB9IGZyb20gJy4vZ2l0aHViL2VuY3J5cHRTZWNyZXQnXG5pbXBvcnQge1xuICBjcmVhdGVQcixcbiAgY3JlYXRlUHVsbFJlcXVlc3QsXG4gIGZvcmtSZXBvLFxuICBnZXRHaXRodWJCbGFtZVJhbmdlcyxcbiAgZ2V0R2l0aHViQnJhbmNoTGlzdCxcbiAgZ2V0R2l0aHViSXNSZW1vdGVCcmFuY2gsXG4gIGdldEdpdGh1YklzVXNlckNvbGxhYm9yYXRvcixcbiAgZ2V0R2l0aHViUHVsbFJlcXVlc3RTdGF0dXMsXG4gIGdldEdpdGh1YlJlZmVyZW5jZURhdGEsXG4gIGdldEdpdGh1YlJlcG9EZWZhdWx0QnJhbmNoLFxuICBnZXRHaXRodWJSZXBvTGlzdCxcbiAgZ2V0R2l0aHViVXNlcm5hbWUsXG4gIGdldFVzZXJJbmZvLFxuICBnaXRodWJWYWxpZGF0ZVBhcmFtcyxcbiAgcGFyc2VHaXRodWJPd25lckFuZFJlcG8sXG59IGZyb20gJy4vZ2l0aHViL2dpdGh1YidcbmltcG9ydCB7XG4gIGNyZWF0ZU9yVXBkYXRlUmVwb3NpdG9yeVNlY3JldCxcbiAgZGVsZXRlQ29tbWVudCxcbiAgZGVsZXRlR2VuZXJhbFByQ29tbWVudCxcbiAgZ2V0QVJlcG9zaXRvcnlQdWJsaWNLZXksXG4gIGdldEdlbmVyYWxQckNvbW1lbnRzLFxuICBnZXRQcixcbiAgZ2V0UHJDb21tZW50LFxuICBnZXRQckNvbW1lbnRzLFxuICBnZXRQckRpZmYsXG4gIHBvc3RHZW5lcmFsUHJDb21tZW50LFxuICBwb3N0UHJDb21tZW50LFxuICB1cGRhdGVQckNvbW1lbnQsXG59IGZyb20gJy4vZ2l0aHViL2dpdGh1Yi12MidcbmltcG9ydCB7XG4gIERlbGV0ZUNvbW1lbnRQYXJhbXMsXG4gIERlbGV0ZUdlbmVyYWxQckNvbW1lbnRSZXNwb25zZSxcbiAgR2V0R2VuZXJhbFByQ29tbWVudFJlc3BvbnNlLFxuICBHZXRQckNvbW1lbnRSZXNwb25zZSxcbiAgR2V0UHJDb21tZW50c1BhcmFtcyxcbiAgR2V0UHJQYXJhbXMsXG4gIFBvc3RDb21tZW50UGFyYW1zLFxuICBQb3N0R2VuZXJhbFByQ29tbWVudFJlc3BvbnNlLFxuICBVcGRhdGVDb21tZW50UGFyYW1zLFxuICBVcGRhdGVDb21tZW50UmVzcG9uc2UsXG59IGZyb20gJy4vZ2l0aHViL3R5cGVzJ1xuaW1wb3J0IHtcbiAgY3JlYXRlTWVyZ2VSZXF1ZXN0LFxuICBnZXRHaXRsYWJCbGFtZVJhbmdlcyxcbiAgZ2V0R2l0bGFiQnJhbmNoTGlzdCxcbiAgZ2V0R2l0bGFiSXNSZW1vdGVCcmFuY2gsXG4gIGdldEdpdGxhYklzVXNlckNvbGxhYm9yYXRvcixcbiAgZ2V0R2l0bGFiTWVyZ2VSZXF1ZXN0LFxuICBnZXRHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXMsXG4gIGdldEdpdGxhYlJlZmVyZW5jZURhdGEsXG4gIGdldEdpdGxhYlJlcG9EZWZhdWx0QnJhbmNoLFxuICBnZXRHaXRsYWJSZXBvTGlzdCxcbiAgZ2V0R2l0bGFiVXNlcm5hbWUsXG4gIEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1c0VudW0sXG4gIGdpdGxhYlZhbGlkYXRlUGFyYW1zLFxufSBmcm9tICcuL2dpdGxhYi9naXRsYWInXG5pbXBvcnQgeyBpc1ZhbGlkQnJhbmNoTmFtZSB9IGZyb20gJy4vc2NtU3VibWl0J1xuXG5leHBvcnQgdHlwZSBTY21Db25maWcgPSB7XG4gIGlkOiBzdHJpbmdcbiAgb3JnSWQ/OiBzdHJpbmcgfCBudWxsXG4gIHJlZnJlc2hUb2tlbj86IHN0cmluZyB8IG51bGxcbiAgc2NtT3JnPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZFxuICBzY21UeXBlOiBzdHJpbmdcbiAgc2NtVXJsOiBzdHJpbmdcbiAgc2NtVXNlcm5hbWU/OiBzdHJpbmcgfCBudWxsXG4gIHRva2VuPzogc3RyaW5nIHwgbnVsbFxuICB0b2tlbkxhc3RVcGRhdGU/OiBzdHJpbmcgfCBudWxsXG4gIHVzZXJJZD86IHN0cmluZyB8IG51bGxcbiAgaXNUb2tlbkF2YWlsYWJsZTogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3QgZ2hHZXRVc2VySW5mbyA9IGdldFVzZXJJbmZvXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xvdWRTY21MaWJUeXBlRnJvbVVybCh1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybClcbiAgY29uc3QgaG9zdG5hbWUgPSB1cmxPYmplY3QuaG9zdG5hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoaG9zdG5hbWUgPT09ICdnaXRsYWIuY29tJykge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkdJVExBQlxuICB9XG4gIGlmIChob3N0bmFtZSA9PT0gJ2dpdGh1Yi5jb20nKSB7XG4gICAgcmV0dXJuIFNjbUxpYlNjbVR5cGUuR0lUSFVCXG4gIH1cbiAgaWYgKGhvc3RuYW1lID09PSAnZGV2LmF6dXJlLmNvbScgfHwgaG9zdG5hbWUuZW5kc1dpdGgoJy52aXN1YWxzdHVkaW8uY29tJykpIHtcbiAgICByZXR1cm4gU2NtTGliU2NtVHlwZS5BRE9cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBlbnVtIFNjbVR5cGUge1xuICBHaXRMYWIgPSAnR2l0TGFiJyxcbiAgR2l0SHViID0gJ0dpdEh1YicsXG4gIEFkbyA9ICdBZG8nLFxufVxuXG5leHBvcnQgZW51bSBTY21DbG91ZFVybCB7XG4gIEdpdExhYiA9ICdodHRwczovL2dpdGxhYi5jb20nLFxuICBHaXRIdWIgPSAnaHR0cHM6Ly9naXRodWIuY29tJyxcbiAgQWRvID0gJ2h0dHBzOi8vZGV2LmF6dXJlLmNvbScsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY21UeXBlRnJvbVNjbUxpYlR5cGUoXG4gIHNjbUxpYlR5cGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWRcbikge1xuICBpZiAoc2NtTGliVHlwZSA9PT0gU2NtTGliU2NtVHlwZS5HSVRMQUIpIHtcbiAgICByZXR1cm4gU2NtVHlwZS5HaXRMYWJcbiAgfVxuICBpZiAoc2NtTGliVHlwZSA9PT0gU2NtTGliU2NtVHlwZS5HSVRIVUIpIHtcbiAgICByZXR1cm4gU2NtVHlwZS5HaXRIdWJcbiAgfVxuICBpZiAoc2NtTGliVHlwZSA9PT0gU2NtTGliU2NtVHlwZS5BRE8pIHtcbiAgICByZXR1cm4gU2NtVHlwZS5BZG9cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gc2NtIGxpYiB0eXBlOiAke3NjbUxpYlR5cGV9YClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjbUxpYlR5cGVGcm9tU2NtVHlwZShzY21UeXBlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSB7XG4gIGlmIChzY21UeXBlID09PSBTY21UeXBlLkdpdExhYikge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkdJVExBQlxuICB9XG4gIGlmIChzY21UeXBlID09PSBTY21UeXBlLkdpdEh1Yikge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkdJVEhVQlxuICB9XG4gIGlmIChzY21UeXBlID09PSBTY21UeXBlLkFkbykge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkFET1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBzY20gdHlwZTogJHtzY21UeXBlfWApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY21Db25maWcoe1xuICB1cmwsXG4gIHNjbUNvbmZpZ3MsXG4gIGluY2x1ZGVPcmdUb2tlbnMgPSB0cnVlLFxufToge1xuICB1cmw6IHN0cmluZ1xuICBzY21Db25maWdzOiBTY21Db25maWdbXVxuICBpbmNsdWRlT3JnVG9rZW5zPzogYm9vbGVhblxufSkge1xuICBjb25zdCBmaWx0ZXJlZFNjbUNvbmZpZ3MgPSBzY21Db25maWdzLmZpbHRlcigoc2NtKSA9PiB7XG4gICAgY29uc3QgdXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpXG4gICAgY29uc3QgY29uZmlnVXJsID0gbmV3IFVSTChzY20uc2NtVXJsKVxuICAgIHJldHVybiAoXG4gICAgICAvL2lmIHdlIHRoZSB1c2VyIGRvZXMgYW4gQURPIG9hdXRoIGZsb3cgdGhlbiB0aGUgdG9rZW4gaXMgc2F2ZWQgZm9yIGRldi5henVyZS5jb20gYnV0XG4gICAgICAvL3NvbWV0aW1lcyB0aGUgdXNlciB1c2VzIHRoZSB1cmwgZGV2LmF6dXJlLmNvbSBhbmQgc29tZXRpbWVzIHRoZSB1cmwgdmlzdWFsc3R1ZGlvLmNvbVxuICAgICAgLy9zbyB3ZSBuZWVkIHRvIGNoZWNrIGJvdGhcbiAgICAgICh1cmxPYmplY3QuaG9zdG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gY29uZmlnVXJsLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCkgfHxcbiAgICAgICAgKHVybE9iamVjdC5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKCcudmlzdWFsc3R1ZGlvLmNvbScpICYmXG4gICAgICAgICAgY29uZmlnVXJsLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdkZXYuYXp1cmUuY29tJykpICYmXG4gICAgICB1cmxPYmplY3QucHJvdG9jb2wgPT09IGNvbmZpZ1VybC5wcm90b2NvbCAmJlxuICAgICAgdXJsT2JqZWN0LnBvcnQgPT09IGNvbmZpZ1VybC5wb3J0XG4gICAgKVxuICB9KVxuICBjb25zdCBzY21PcmdDb25maWcgPSBmaWx0ZXJlZFNjbUNvbmZpZ3MuZmluZCgoc2NtKSA9PiBzY20ub3JnSWQgJiYgc2NtLnRva2VuKVxuICBpZiAoc2NtT3JnQ29uZmlnICYmIGluY2x1ZGVPcmdUb2tlbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHNjbU9yZ0NvbmZpZy5pZCxcbiAgICAgIGFjY2Vzc1Rva2VuOiBzY21PcmdDb25maWcudG9rZW4gfHwgdW5kZWZpbmVkLFxuICAgICAgc2NtTGliVHlwZTogZ2V0U2NtTGliVHlwZUZyb21TY21UeXBlKHNjbU9yZ0NvbmZpZy5zY21UeXBlKSxcbiAgICAgIHNjbU9yZzogc2NtT3JnQ29uZmlnLnNjbU9yZyB8fCB1bmRlZmluZWQsXG4gICAgfVxuICB9XG4gIGNvbnN0IHNjbVVzZXJDb25maWcgPSBmaWx0ZXJlZFNjbUNvbmZpZ3MuZmluZChcbiAgICAoc2NtKSA9PiBzY20udXNlcklkICYmIHNjbS50b2tlblxuICApXG4gIGlmIChzY21Vc2VyQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBzY21Vc2VyQ29uZmlnLmlkLFxuICAgICAgYWNjZXNzVG9rZW46IHNjbVVzZXJDb25maWcudG9rZW4gfHwgdW5kZWZpbmVkLFxuICAgICAgc2NtTGliVHlwZTogZ2V0U2NtTGliVHlwZUZyb21TY21UeXBlKHNjbVVzZXJDb25maWcuc2NtVHlwZSksXG4gICAgICBzY21Pcmc6IHNjbVVzZXJDb25maWcuc2NtT3JnIHx8IHVuZGVmaW5lZCxcbiAgICB9XG4gIH1cbiAgY29uc3QgdHlwZSA9IGdldENsb3VkU2NtTGliVHlwZUZyb21VcmwodXJsKVxuICBpZiAodHlwZSkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgYWNjZXNzVG9rZW46IHVuZGVmaW5lZCxcbiAgICAgIHNjbUxpYlR5cGU6IHR5cGUsXG4gICAgICBzY21Pcmc6IHVuZGVmaW5lZCxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBpZDogdW5kZWZpbmVkLFxuICAgIGFjY2Vzc1Rva2VuOiB1bmRlZmluZWQsXG4gICAgc2NtTGliVHlwZTogdW5kZWZpbmVkLFxuICAgIHNjbU9yZzogdW5kZWZpbmVkLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzY21DYW5SZWFjaFJlcG8oe1xuICByZXBvVXJsLFxuICBzY21UeXBlLFxuICBhY2Nlc3NUb2tlbixcbiAgc2NtT3JnLFxufToge1xuICByZXBvVXJsOiBzdHJpbmdcbiAgc2NtVHlwZTogU2NtVHlwZVxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHNjbU9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG59KSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgU0NNTGliLmluaXQoe1xuICAgICAgdXJsOiByZXBvVXJsLFxuICAgICAgYWNjZXNzVG9rZW4sXG4gICAgICBzY21UeXBlOiBnZXRTY21MaWJUeXBlRnJvbVNjbVR5cGUoc2NtVHlwZSksXG4gICAgICBzY21PcmcsXG4gICAgfSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUmVmZXJlbmNlVHlwZSB7XG4gIEJSQU5DSCA9ICdCUkFOQ0gnLFxuICBDT01NSVQgPSAnQ09NTUlUJyxcbiAgVEFHID0gJ1RBRycsXG59XG5cbmV4cG9ydCBlbnVtIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMge1xuICBNRVJHRUQgPSAnTUVSR0VEJyxcbiAgT1BFTiA9ICdPUEVOJyxcbiAgQ0xPU0VEID0gJ0NMT1NFRCcsXG4gIERSQUZUID0gJ0RSQUZUJyxcbn1cblxuZXhwb3J0IGVudW0gU2NtTGliU2NtVHlwZSB7XG4gIEdJVEhVQiA9ICdHSVRIVUInLFxuICBHSVRMQUIgPSAnR0lUTEFCJyxcbiAgQURPID0gJ0FETycsXG59XG5cbmV4cG9ydCB0eXBlIFNjbVJlcG9JbmZvID0ge1xuICByZXBvTmFtZTogc3RyaW5nXG4gIHJlcG9Vcmw6IHN0cmluZ1xuICByZXBvT3duZXI6IHN0cmluZ1xuICByZXBvTGFuZ3VhZ2VzOiBzdHJpbmdbXVxuICByZXBvSXNQdWJsaWM6IGJvb2xlYW5cbiAgcmVwb1VwZGF0ZWRBdDogc3RyaW5nXG59XG5cbnR5cGUgUG9zdFBSUmV2aWV3Q29tbWVudFBhcmFtcyA9IHtcbiAgcHJOdW1iZXI6IG51bWJlclxuICBib2R5OiBzdHJpbmdcbn1cbnR5cGUgU0NNR2V0UHJSZXZpZXdDb21tZW50c1BhcmFtcyA9IHtcbiAgcHJOdW1iZXI6IG51bWJlclxufVxudHlwZSBTQ01HZXRQclJldmlld0NvbW1lbnRzUmVzcG9uc2UgPSBQcm9taXNlPEdldEdlbmVyYWxQckNvbW1lbnRSZXNwb25zZT5cbnR5cGUgU0NNUG9zdEdlbmVyYWxQckNvbW1lbnRzUmVzcG9uc2UgPSBQcm9taXNlPFBvc3RHZW5lcmFsUHJDb21tZW50UmVzcG9uc2U+XG50eXBlIFNDTURlbGV0ZUdlbmVyYWxQckNvbW1lbnRQYXJhbXMgPSB7XG4gIGNvbW1lbnRJZDogbnVtYmVyXG59XG5cbnR5cGUgU0NNRGVsZXRlR2VuZXJhbFByUmV2aWV3UmVzcG9uc2UgPSBQcm9taXNlPERlbGV0ZUdlbmVyYWxQckNvbW1lbnRSZXNwb25zZT5cblxuZXhwb3J0IGNsYXNzIEludmFsaWRSZXBvVXJsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG06IHN0cmluZykge1xuICAgIHN1cGVyKG0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRBY2Nlc3NUb2tlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkVXJsUGF0dGVybkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWRTaGFFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobTogc3RyaW5nKSB7XG4gICAgc3VwZXIobSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVmTm90Rm91bmRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobTogc3RyaW5nKSB7XG4gICAgc3VwZXIobSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVwb05vVG9rZW5BY2Nlc3NFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobTogc3RyaW5nKSB7XG4gICAgc3VwZXIobSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmViYXNlRmFpbGVkRXJyb3IgZXh0ZW5kcyBFcnJvciB7fVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU0NNTGliIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHVybD86IHN0cmluZ1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgYWNjZXNzVG9rZW4/OiBzdHJpbmdcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjbU9yZz86IHN0cmluZ1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHNjbU9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICkge1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlblxuICAgIHRoaXMudXJsID0gdXJsXG4gICAgdGhpcy5zY21PcmcgPSBzY21PcmdcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRVcmxXaXRoQ3JlZGVudGlhbHMoKSB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsIGZvciBnZXRVcmxXaXRoQ3JlZGVudGlhbHMoKScpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIGNvbnN0IHRyaW1tZWRVcmwgPSB0aGlzLnVybC50cmltKCkucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgcmV0dXJuIHRyaW1tZWRVcmxcbiAgICB9XG5cbiAgICBjb25zdCBzY21MaWJUeXBlID0gdGhpcy5nZXRTY21MaWJUeXBlKClcbiAgICBpZiAoc2NtTGliVHlwZSA9PT0gU2NtTGliU2NtVHlwZS5BRE8pIHtcbiAgICAgIHJldHVybiBgaHR0cHM6Ly8ke3RoaXMuYWNjZXNzVG9rZW59QCR7dHJpbW1lZFVybFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJyl9YFxuICAgIH1cblxuICAgIGNvbnN0IGlzX2h0dHAgPSB0cmltbWVkVXJsLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnaHR0cDovLycpXG4gICAgY29uc3QgaXNfaHR0cHMgPSB0cmltbWVkVXJsLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKVxuICAgIGNvbnN0IHVzZXJuYW1lID0gYXdhaXQgdGhpcy5fZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKClcbiAgICBpZiAoaXNfaHR0cCkge1xuICAgICAgcmV0dXJuIGBodHRwOi8vJHt1c2VybmFtZX06JHt0aGlzLmFjY2Vzc1Rva2VufUAke3RyaW1tZWRVcmxcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJyl9YFxuICAgIH0gZWxzZSBpZiAoaXNfaHR0cHMpIHtcbiAgICAgIHJldHVybiBgaHR0cHM6Ly8ke3VzZXJuYW1lfToke3RoaXMuYWNjZXNzVG9rZW59QCR7dHJpbW1lZFVybFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBpbnZhbGlkIHNjbSB1cmwgJHt0cmltbWVkVXJsfWApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc2NtIHVybCAke3RyaW1tZWRVcmx9YClcbiAgICB9XG4gIH1cblxuICBhYnN0cmFjdCBnZXRTY21MaWJUeXBlKCk6IFNjbUxpYlNjbVR5cGVcblxuICBhYnN0cmFjdCBnZXRBdXRoSGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG5cbiAgYWJzdHJhY3QgZ2V0RG93bmxvYWRVcmwoc2hhOiBzdHJpbmcpOiBzdHJpbmdcblxuICBhYnN0cmFjdCBfZ2V0VXNlcm5hbWVGb3JBdXRoVXJsKCk6IFByb21pc2U8c3RyaW5nPlxuXG4gIGFic3RyYWN0IGdldElzUmVtb3RlQnJhbmNoKF9icmFuY2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj5cblxuICBhYnN0cmFjdCB2YWxpZGF0ZVBhcmFtcygpOiBQcm9taXNlPHZvaWQ+XG5cbiAgYWJzdHJhY3QgZ2V0UmVwb0xpc3Qoc2NtT3JnOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBQcm9taXNlPFNjbVJlcG9JbmZvW10+XG5cbiAgYWJzdHJhY3QgZ2V0QnJhbmNoTGlzdCgpOiBQcm9taXNlPHN0cmluZ1tdPlxuXG4gIGFic3RyYWN0IGdldFVzZXJIYXNBY2Nlc3NUb1JlcG8oKTogUHJvbWlzZTxib29sZWFuPlxuXG4gIGFic3RyYWN0IGdldFVzZXJuYW1lKCk6IFByb21pc2U8c3RyaW5nPlxuXG4gIGFic3RyYWN0IGZvcmtSZXBvKHJlcG9Vcmw6IHN0cmluZyk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB8IG51bGwgfT5cblxuICBhYnN0cmFjdCBjcmVhdGVPclVwZGF0ZVJlcG9zaXRvcnlTZWNyZXQoXG4gICAgcGFyYW1zOiB7IHZhbHVlOiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9LFxuICAgIF9va3Rva2l0PzogT2N0b2tpdFxuICApOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfCBudWxsIH0+XG5cbiAgYWJzdHJhY3QgY3JlYXRlUHVsbFJlcXVlc3RXaXRoTmV3RmlsZShcbiAgICBzb3VyY2VSZXBvVXJsOiBzdHJpbmcsXG4gICAgZmlsZXNQYXRoczogc3RyaW5nW10sXG4gICAgdXNlclJlcG9Vcmw6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHsgcHVsbF9yZXF1ZXN0X3VybDogc3RyaW5nIH0+XG5cbiAgYWJzdHJhY3QgZ2V0U3VibWl0UmVxdWVzdFN0YXR1cyhcbiAgICBfc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPlxuXG4gIGFic3RyYWN0IGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz5cblxuICBhYnN0cmFjdCBnZXRSZXBvQmxhbWVSYW5nZXMoXG4gICAgcmVmOiBzdHJpbmcsXG4gICAgcGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8XG4gICAge1xuICAgICAgc3RhcnRpbmdMaW5lOiBudW1iZXJcbiAgICAgIGVuZGluZ0xpbmU6IG51bWJlclxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgICBsb2dpbjogc3RyaW5nXG4gICAgICBlbWFpbDogc3RyaW5nXG4gICAgfVtdXG4gID5cblxuICBhYnN0cmFjdCBnZXRSZWZlcmVuY2VEYXRhKHJlZjogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgdHlwZTogUmVmZXJlbmNlVHlwZVxuICAgIHNoYTogc3RyaW5nXG4gICAgZGF0ZTogRGF0ZSB8IHVuZGVmaW5lZFxuICB9PlxuICBhYnN0cmFjdCBnZXRQckNvbW1lbnQoY29tbWVudElkOiBudW1iZXIpOiBQcm9taXNlPEdldFByQ29tbWVudFJlc3BvbnNlPlxuICBhYnN0cmFjdCBnZXRQclVybChwck51bWJlcjogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+XG5cbiAgYWJzdHJhY3QgdXBkYXRlUHJDb21tZW50KFxuICAgIHBhcmFtczogUGljazxVcGRhdGVDb21tZW50UGFyYW1zLCAnYm9keScgfCAnY29tbWVudF9pZCc+LFxuICAgIF9va3Rva2l0PzogT2N0b2tpdFxuICApOiBQcm9taXNlPFVwZGF0ZUNvbW1lbnRSZXNwb25zZT5cblxuICBhYnN0cmFjdCBnZXRSZXBvRGVmYXVsdEJyYW5jaCgpOiBQcm9taXNlPHN0cmluZz5cblxuICBwdWJsaWMgZ2V0QWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbiB8fCAnJ1xuICB9XG5cbiAgcHVibGljIGdldFVybCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnVybFxuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsLnNwbGl0KCcvJykuYXQoLTEpIHx8ICcnXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldElzVmFsaWRCcmFuY2hOYW1lKFxuICAgIGJyYW5jaE5hbWU6IHN0cmluZ1xuICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gaXNWYWxpZEJyYW5jaE5hbWUoYnJhbmNoTmFtZSlcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgaW5pdCh7XG4gICAgdXJsLFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHNjbVR5cGUsXG4gICAgc2NtT3JnLFxuICB9OiB7XG4gICAgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICAgc2NtVHlwZTogU2NtTGliU2NtVHlwZSB8IHVuZGVmaW5lZFxuICAgIHNjbU9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gIH0pOiBQcm9taXNlPFNDTUxpYj4ge1xuICAgIGxldCB0cmltbWVkVXJsID0gdW5kZWZpbmVkXG4gICAgaWYgKHVybCkge1xuICAgICAgdHJpbW1lZFVybCA9IHVybC50cmltKCkucmVwbGFjZSgvXFwvJC8sICcnKS5yZXBsYWNlKC8uZ2l0JC9pLCAnJylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChTY21MaWJTY21UeXBlLkdJVEhVQiA9PT0gc2NtVHlwZSkge1xuICAgICAgICBjb25zdCBzY20gPSBuZXcgR2l0aHViU0NNTGliKHRyaW1tZWRVcmwsIGFjY2Vzc1Rva2VuLCBzY21PcmcpXG4gICAgICAgIGF3YWl0IHNjbS52YWxpZGF0ZVBhcmFtcygpXG4gICAgICAgIHJldHVybiBzY21cbiAgICAgIH1cbiAgICAgIGlmIChTY21MaWJTY21UeXBlLkdJVExBQiA9PT0gc2NtVHlwZSkge1xuICAgICAgICBjb25zdCBzY20gPSBuZXcgR2l0bGFiU0NNTGliKHRyaW1tZWRVcmwsIGFjY2Vzc1Rva2VuLCBzY21PcmcpXG4gICAgICAgIGF3YWl0IHNjbS52YWxpZGF0ZVBhcmFtcygpXG4gICAgICAgIHJldHVybiBzY21cbiAgICAgIH1cbiAgICAgIGlmIChTY21MaWJTY21UeXBlLkFETyA9PT0gc2NtVHlwZSkge1xuICAgICAgICBjb25zdCBzY20gPSBuZXcgQWRvU0NNTGliKHRyaW1tZWRVcmwsIGFjY2Vzc1Rva2VuLCBzY21PcmcpXG4gICAgICAgIGF3YWl0IHNjbS52YWxpZGF0ZVBhcmFtcygpXG4gICAgICAgIHJldHVybiBzY21cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEludmFsaWRSZXBvVXJsRXJyb3IgJiYgdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXBvTm9Ub2tlbkFjY2Vzc0Vycm9yKCdubyBhY2Nlc3MgdG8gcmVwbycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTdHViU0NNTGliKHRyaW1tZWRVcmwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuICB9XG4gIGFic3RyYWN0IHBvc3RHZW5lcmFsUHJDb21tZW50KFxuICAgIHBhcmFtczogUG9zdFBSUmV2aWV3Q29tbWVudFBhcmFtcyxcbiAgICBhdXRoPzogeyBhdXRoVG9rZW46IHN0cmluZyB9XG4gICk6IFNDTVBvc3RHZW5lcmFsUHJDb21tZW50c1Jlc3BvbnNlXG4gIGFic3RyYWN0IGdldEdlbmVyYWxQckNvbW1lbnRzKFxuICAgIHBhcmFtczogU0NNR2V0UHJSZXZpZXdDb21tZW50c1BhcmFtcyxcbiAgICBhdXRoPzogeyBhdXRoVG9rZW46IHN0cmluZyB9XG4gICk6IFNDTUdldFByUmV2aWV3Q29tbWVudHNSZXNwb25zZVxuICBhYnN0cmFjdCBkZWxldGVHZW5lcmFsUHJDb21tZW50KFxuICAgIHBhcmFtczogU0NNRGVsZXRlR2VuZXJhbFByQ29tbWVudFBhcmFtcyxcbiAgICBhdXRoPzogeyBhdXRoVG9rZW46IHN0cmluZyB9XG4gICk6IFNDTURlbGV0ZUdlbmVyYWxQclJldmlld1Jlc3BvbnNlXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVBY2Nlc3NUb2tlbkFuZFVybCgpOiBhc3NlcnRzIHRoaXMgaXMgdGhpcyAmIHtcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gICAgdXJsOiBzdHJpbmdcbiAgfSB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEFjY2Vzc1Rva2VuRXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgfVxuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUmVwb1VybEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWRvU0NNTGliIGV4dGVuZHMgU0NNTGliIHtcbiAgdXBkYXRlUHJDb21tZW50KFxuICAgIF9wYXJhbXM6IFBpY2s8VXBkYXRlQ29tbWVudFBhcmFtcywgJ2JvZHknIHwgJ2NvbW1lbnRfaWQnPixcbiAgICBfb2t0b2tpdD86IE9jdG9raXRcbiAgKTogUHJvbWlzZTxVcGRhdGVDb21tZW50UmVzcG9uc2U+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VwZGF0ZVByQ29tbWVudCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuICBnZXRQckNvbW1lbnQoX2NvbW1lbnRJZDogbnVtYmVyKTogUHJvbWlzZTxHZXRQckNvbW1lbnRSZXNwb25zZT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UHJDb21tZW50IG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG4gIGFzeW5jIGZvcmtSZXBvKCk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB8IG51bGwgfT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignZm9ya1JlcG8gbm90IHN1cHBvcnRlZCB5ZXQnKVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlT3JVcGRhdGVSZXBvc2l0b3J5U2VjcmV0KCk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB8IG51bGwgfT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignY3JlYXRlT3JVcGRhdGVSZXBvc2l0b3J5U2VjcmV0IG5vdCBzdXBwb3J0ZWQgeWV0JylcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVB1bGxSZXF1ZXN0V2l0aE5ld0ZpbGUoXG4gICAgX3NvdXJjZVJlcG9Vcmw6IHN0cmluZyxcbiAgICBfZmlsZXNQYXRoczogc3RyaW5nW10sXG4gICAgX3VzZXJSZXBvVXJsOiBzdHJpbmcsXG4gICAgX3RpdGxlOiBzdHJpbmcsXG4gICAgX2JvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHsgcHVsbF9yZXF1ZXN0X3VybDogc3RyaW5nIH0+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZVB1bGxSZXF1ZXN0V2l0aE5ld0ZpbGUgbm90IHN1cHBvcnRlZCB5ZXQnKVxuICB9XG4gIGFzeW5jIGNyZWF0ZVN1Ym1pdFJlcXVlc3QoXG4gICAgdGFyZ2V0QnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHNvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhcbiAgICAgIGF3YWl0IGNyZWF0ZUFkb1B1bGxSZXF1ZXN0KHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHRhcmdldEJyYW5jaE5hbWUsXG4gICAgICAgIHNvdXJjZUJyYW5jaE5hbWUsXG4gICAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZVBhcmFtcygpIHtcbiAgICByZXR1cm4gYWRvVmFsaWRhdGVQYXJhbXMoe1xuICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRSZXBvTGlzdChzY21Pcmc6IHN0cmluZyB8IHVuZGVmaW5lZCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEFkb1JlcG9MaXN0KHtcbiAgICAgIG9yZ05hbWU6IHNjbU9yZyxcbiAgICAgIHRva2VuT3JnOiB0aGlzLnNjbU9yZyxcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hMaXN0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBnZXRBZG9CcmFuY2hMaXN0KHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgfSlcbiAgfVxuXG4gIGdldFNjbUxpYlR5cGUoKTogU2NtTGliU2NtVHlwZSB7XG4gICAgcmV0dXJuIFNjbUxpYlNjbVR5cGUuQURPXG4gIH1cblxuICBnZXRBdXRoSGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgaWYgKGdldEFkb1Rva2VuVHlwZSh0aGlzLmFjY2Vzc1Rva2VuKSA9PT0gQWRvVG9rZW5UeXBlRW51bS5PQVVUSCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0aGlzLmFjY2Vzc1Rva2VufWAsXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbjogYEJhc2ljICR7QnVmZmVyLmZyb20oJzonICsgdGhpcy5hY2Nlc3NUb2tlbikudG9TdHJpbmcoXG4gICAgICAgICAgICAnYmFzZTY0J1xuICAgICAgICAgICl9YCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIGdldERvd25sb2FkVXJsKHNoYTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0QWRvRG93bmxvYWRVcmwoeyByZXBvVXJsOiB0aGlzLnVybCwgYnJhbmNoOiBzaGEgfSlcbiAgfVxuXG4gIGFzeW5jIF9nZXRVc2VybmFtZUZvckF1dGhVcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ19nZXRVc2VybmFtZUZvckF1dGhVcmwoKSBpcyBub3QgcmVsZXZhbnQgZm9yIEFETycpXG4gIH1cblxuICBhc3luYyBnZXRJc1JlbW90ZUJyYW5jaChicmFuY2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEFkb0lzUmVtb3RlQnJhbmNoKHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgICBicmFuY2gsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJIYXNBY2Nlc3NUb1JlcG8oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0QWRvSXNVc2VyQ29sbGFib3JhdG9yKHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJuYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRVc2VybmFtZSgpIGlzIG5vdCByZWxldmFudCBmb3IgQURPJylcbiAgfVxuXG4gIGFzeW5jIGdldFN1Ym1pdFJlcXVlc3RTdGF0dXMoXG4gICAgc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IGdldEFkb1B1bGxSZXF1ZXN0U3RhdHVzKHtcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgICBwck51bWJlcjogTnVtYmVyKHNjbVN1Ym1pdFJlcXVlc3RJZCksXG4gICAgfSlcbiAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICBjYXNlIEFkb1B1bGxSZXF1ZXN0U3RhdHVzRW51bS5jb21wbGV0ZWQ6XG4gICAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLk1FUkdFRFxuICAgICAgY2FzZSBBZG9QdWxsUmVxdWVzdFN0YXR1c0VudW0uYWN0aXZlOlxuICAgICAgICByZXR1cm4gU2NtU3VibWl0UmVxdWVzdFN0YXR1cy5PUEVOXG4gICAgICBjYXNlIEFkb1B1bGxSZXF1ZXN0U3RhdHVzRW51bS5hYmFuZG9uZWQ6XG4gICAgICAgIHJldHVybiBTY21TdWJtaXRSZXF1ZXN0U3RhdHVzLkNMT1NFRFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHN0YXRlICR7c3RhdGV9YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRSZXBvQmxhbWVSYW5nZXMoXG4gICAgX3JlZjogc3RyaW5nLFxuICAgIF9wYXRoOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxcbiAgICB7XG4gICAgICBzdGFydGluZ0xpbmU6IG51bWJlclxuICAgICAgZW5kaW5nTGluZTogbnVtYmVyXG4gICAgICBuYW1lOiBzdHJpbmdcbiAgICAgIGxvZ2luOiBzdHJpbmdcbiAgICAgIGVtYWlsOiBzdHJpbmdcbiAgICB9W11cbiAgPiB7XG4gICAgcmV0dXJuIGF3YWl0IGdldEFkb0JsYW1lUmFuZ2VzKClcbiAgfVxuXG4gIGFzeW5jIGdldFJlZmVyZW5jZURhdGEocmVmOiBzdHJpbmcpOiBQcm9taXNlPHtcbiAgICB0eXBlOiBSZWZlcmVuY2VUeXBlXG4gICAgc2hhOiBzdHJpbmdcbiAgICBkYXRlOiBEYXRlIHwgdW5kZWZpbmVkXG4gIH0+IHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZ2V0QWRvUmVmZXJlbmNlRGF0YSh7XG4gICAgICByZWYsXG4gICAgICByZXBvVXJsOiB0aGlzLnVybCxcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgdG9rZW5Pcmc6IHRoaXMuc2NtT3JnLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRSZXBvRGVmYXVsdEJyYW5jaCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBnZXRBZG9SZXBvRGVmYXVsdEJyYW5jaCh7XG4gICAgICByZXBvVXJsOiB0aGlzLnVybCxcbiAgICAgIHRva2VuT3JnOiB0aGlzLnNjbU9yZyxcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIH0pXG4gIH1cbiAgZ2V0UHJVcmwocHJOdW1iZXI6IG51bWJlcik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgdGhpcy5fdmFsaWRhdGVBY2Nlc3NUb2tlbkFuZFVybCgpXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShnZXRBZG9QclVybCh7IHByTnVtYmVyLCB1cmw6IHRoaXMudXJsIH0pKVxuICB9XG4gIHBvc3RHZW5lcmFsUHJDb21tZW50KCk6IFNDTVBvc3RHZW5lcmFsUHJDb21tZW50c1Jlc3BvbnNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuICBnZXRHZW5lcmFsUHJDb21tZW50cygpOiBTQ01HZXRQclJldmlld0NvbW1lbnRzUmVzcG9uc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG4gIGRlbGV0ZUdlbmVyYWxQckNvbW1lbnQoKTogU0NNRGVsZXRlR2VuZXJhbFByUmV2aWV3UmVzcG9uc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHaXRsYWJTQ01MaWIgZXh0ZW5kcyBTQ01MaWIge1xuICBhc3luYyBjcmVhdGVTdWJtaXRSZXF1ZXN0KFxuICAgIHRhcmdldEJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICBzb3VyY2VCcmFuY2hOYW1lOiBzdHJpbmcsXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgICBib2R5OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcoXG4gICAgICBhd2FpdCBjcmVhdGVNZXJnZVJlcXVlc3Qoe1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgYm9keSxcbiAgICAgICAgdGFyZ2V0QnJhbmNoTmFtZSxcbiAgICAgICAgc291cmNlQnJhbmNoTmFtZSxcbiAgICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZVBhcmFtcygpIHtcbiAgICByZXR1cm4gZ2l0bGFiVmFsaWRhdGVQYXJhbXMoe1xuICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIH0pXG4gIH1cbiAgYXN5bmMgZm9ya1JlcG8oKTogUHJvbWlzZTx7IHVybDogc3RyaW5nIHwgbnVsbCB9PiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0ZWQgeWV0JylcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZU9yVXBkYXRlUmVwb3NpdG9yeVNlY3JldCgpOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfCBudWxsIH0+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignbm90IHN1cHBvcnRlZCB5ZXQnKVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlUHVsbFJlcXVlc3RXaXRoTmV3RmlsZShcbiAgICBfc291cmNlUmVwb1VybDogc3RyaW5nLFxuICAgIF9maWxlc1BhdGhzOiBzdHJpbmdbXSxcbiAgICBfdXNlclJlcG9Vcmw6IHN0cmluZyxcbiAgICBfdGl0bGU6IHN0cmluZyxcbiAgICBfYm9keTogc3RyaW5nXG4gICk6IFByb21pc2U8eyBwdWxsX3JlcXVlc3RfdXJsOiBzdHJpbmcgfT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9MaXN0KF9zY21Pcmc6IHN0cmluZyB8IHVuZGVmaW5lZCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGxhYlJlcG9MaXN0KHRoaXMudXJsLCB0aGlzLmFjY2Vzc1Rva2VuKVxuICB9XG5cbiAgYXN5bmMgZ2V0QnJhbmNoTGlzdCgpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0R2l0bGFiQnJhbmNoTGlzdCh7XG4gICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgIH0pXG4gIH1cblxuICBnZXRTY21MaWJUeXBlKCk6IFNjbUxpYlNjbVR5cGUge1xuICAgIHJldHVybiBTY21MaWJTY21UeXBlLkdJVExBQlxuICB9XG5cbiAgZ2V0QXV0aEhlYWRlcnMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgaWYgKHRoaXM/LmFjY2Vzc1Rva2VuPy5zdGFydHNXaXRoKCdnbHBhdC0nKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ1ByaXZhdGUtVG9rZW4nOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBhdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dGhpcy5hY2Nlc3NUb2tlbn1gIH1cbiAgICB9XG4gIH1cblxuICBnZXREb3dubG9hZFVybChzaGE6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdXJsU3BsaXQ6IHN0cmluZ1tdID0gdGhpcy51cmw/LnNwbGl0KCcvJykgfHwgW11cbiAgICBjb25zdCByZXBvTmFtZSA9IHVybFNwbGl0W3VybFNwbGl0Py5sZW5ndGggLSAxXVxuICAgIHJldHVybiBgJHt0aGlzLnVybH0vLS9hcmNoaXZlLyR7c2hhfS8ke3JlcG9OYW1lfS0ke3NoYX0uemlwYFxuICB9XG5cbiAgYXN5bmMgX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICh0aGlzPy5hY2Nlc3NUb2tlbj8uc3RhcnRzV2l0aCgnZ2xwYXQtJykpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFVzZXJuYW1lKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdvYXV0aDInXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0SXNSZW1vdGVCcmFuY2goYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBnZXRHaXRsYWJJc1JlbW90ZUJyYW5jaCh7XG4gICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgICAgYnJhbmNoLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRVc2VySGFzQWNjZXNzVG9SZXBvKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3QgdXNlcm5hbWUgPSBhd2FpdCB0aGlzLmdldFVzZXJuYW1lKClcbiAgICByZXR1cm4gZ2V0R2l0bGFiSXNVc2VyQ29sbGFib3JhdG9yKHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICByZXBvVXJsOiB0aGlzLnVybCxcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZ2V0VXNlcm5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgfVxuICAgIHJldHVybiBnZXRHaXRsYWJVc2VybmFtZSh0aGlzLnVybCwgdGhpcy5hY2Nlc3NUb2tlbilcbiAgfVxuXG4gIGFzeW5jIGdldFN1Ym1pdFJlcXVlc3RTdGF0dXMoXG4gICAgc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IGdldEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1cyh7XG4gICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIHJlcG9Vcmw6IHRoaXMudXJsLFxuICAgICAgbXJOdW1iZXI6IE51bWJlcihzY21TdWJtaXRSZXF1ZXN0SWQpLFxuICAgIH0pXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSBHaXRsYWJNZXJnZVJlcXVlc3RTdGF0dXNFbnVtLm1lcmdlZDpcbiAgICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuTUVSR0VEXG4gICAgICBjYXNlIEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1c0VudW0ub3BlbmVkOlxuICAgICAgICByZXR1cm4gU2NtU3VibWl0UmVxdWVzdFN0YXR1cy5PUEVOXG4gICAgICBjYXNlIEdpdGxhYk1lcmdlUmVxdWVzdFN0YXR1c0VudW0uY2xvc2VkOlxuICAgICAgICByZXR1cm4gU2NtU3VibWl0UmVxdWVzdFN0YXR1cy5DTE9TRURcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBzdGF0ZSAke3N0YXRlfWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0JsYW1lUmFuZ2VzKFxuICAgIHJlZjogc3RyaW5nLFxuICAgIHBhdGg6IHN0cmluZ1xuICApOiBQcm9taXNlPFxuICAgIHtcbiAgICAgIHN0YXJ0aW5nTGluZTogbnVtYmVyXG4gICAgICBlbmRpbmdMaW5lOiBudW1iZXJcbiAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgbG9naW46IHN0cmluZ1xuICAgICAgZW1haWw6IHN0cmluZ1xuICAgIH1bXVxuICA+IHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZ2V0R2l0bGFiQmxhbWVSYW5nZXMoXG4gICAgICB7IHJlZiwgcGF0aCwgZ2l0bGFiVXJsOiB0aGlzLnVybCB9LFxuICAgICAge1xuICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICBnaXRsYWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVmZXJlbmNlRGF0YShyZWY6IHN0cmluZyk6IFByb21pc2U8e1xuICAgIHR5cGU6IFJlZmVyZW5jZVR5cGVcbiAgICBzaGE6IHN0cmluZ1xuICAgIGRhdGU6IERhdGUgfCB1bmRlZmluZWRcbiAgfT4ge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBnZXRHaXRsYWJSZWZlcmVuY2VEYXRhKFxuICAgICAgeyByZWYsIGdpdGxhYlVybDogdGhpcy51cmwgfSxcbiAgICAgIHtcbiAgICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgICAgZ2l0bGFiQXV0aFRva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9EZWZhdWx0QnJhbmNoKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGdldEdpdGxhYlJlcG9EZWZhdWx0QnJhbmNoKHRoaXMudXJsLCB7XG4gICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgZ2l0bGFiQXV0aFRva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIH0pXG4gIH1cbiAgZ2V0UHJDb21tZW50KF9jb21tZW50SWQ6IG51bWJlcik6IFByb21pc2U8R2V0UHJDb21tZW50UmVzcG9uc2U+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFByQ29tbWVudCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuICB1cGRhdGVQckNvbW1lbnQoXG4gICAgX3BhcmFtczogUGljazxVcGRhdGVDb21tZW50UGFyYW1zLCAnYm9keScgfCAnY29tbWVudF9pZCc+LFxuICAgIF9va3Rva2l0PzogT2N0b2tpdFxuICApOiBQcm9taXNlPFVwZGF0ZUNvbW1lbnRSZXNwb25zZT4ge1xuICAgIHRocm93IG5ldyBFcnJvcigndXBkYXRlUHJDb21tZW50IG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG4gIGFzeW5jIGdldFByVXJsKHByTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlQWNjZXNzVG9rZW5BbmRVcmwoKVxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdldEdpdGxhYk1lcmdlUmVxdWVzdCh7XG4gICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgcHJOdW1iZXI6IHByTnVtYmVyLFxuICAgICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgfSlcbiAgICByZXR1cm4gcmVzLndlYl91cmxcbiAgfVxuICBwb3N0R2VuZXJhbFByQ29tbWVudCgpOiBTQ01Qb3N0R2VuZXJhbFByQ29tbWVudHNSZXNwb25zZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpXG4gIH1cbiAgZ2V0R2VuZXJhbFByQ29tbWVudHMoKTogU0NNR2V0UHJSZXZpZXdDb21tZW50c1Jlc3BvbnNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuICBkZWxldGVHZW5lcmFsUHJDb21tZW50KCk6IFNDTURlbGV0ZUdlbmVyYWxQclJldmlld1Jlc3BvbnNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2l0aHViU0NNTGliIGV4dGVuZHMgU0NNTGliIHtcbiAgcHVibGljIHJlYWRvbmx5IG9rdG9raXQ6IE9jdG9raXRcbiAgLy8gd2UgZG9uJ3QgYWx3YXlzIG5lZWQgYSB1cmwsIHdoYXQncyBpbXBvcnRhbnQgaXMgdGhhdCB3ZSBoYXZlIGFuIGFjY2VzcyB0b2tlblxuICBjb25zdHJ1Y3RvcihcbiAgICB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHNjbU9yZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICkge1xuICAgIHN1cGVyKHVybCwgYWNjZXNzVG9rZW4sIHNjbU9yZylcbiAgICB0aGlzLm9rdG9raXQgPSBuZXcgT2N0b2tpdCh7IGF1dGg6IGFjY2Vzc1Rva2VuIH0pXG4gIH1cbiAgYXN5bmMgY3JlYXRlU3VibWl0UmVxdWVzdChcbiAgICB0YXJnZXRCcmFuY2hOYW1lOiBzdHJpbmcsXG4gICAgc291cmNlQnJhbmNoTmFtZTogc3RyaW5nLFxuICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgYm9keTogc3RyaW5nXG4gICk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKFxuICAgICAgYXdhaXQgY3JlYXRlUHVsbFJlcXVlc3Qoe1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgYm9keSxcbiAgICAgICAgdGFyZ2V0QnJhbmNoTmFtZSxcbiAgICAgICAgc291cmNlQnJhbmNoTmFtZSxcbiAgICAgICAgcmVwb1VybDogdGhpcy51cmwsXG4gICAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmb3JrUmVwbyhyZXBvVXJsOiBzdHJpbmcpOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfCBudWxsIH0+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbicpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcmtSZXBvKHtcbiAgICAgIHJlcG9Vcmw6IHJlcG9VcmwsXG4gICAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlT3JVcGRhdGVSZXBvc2l0b3J5U2VjcmV0KFxuICAgIHBhcmFtczogeyB2YWx1ZTogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfSxcbiAgICBfb2t0b2tpdD86IE9jdG9raXRcbiAgKSB7XG4gICAgaWYgKCghX29rdG9raXQgJiYgIXRoaXMuYWNjZXNzVG9rZW4pIHx8ICF0aGlzLnVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZGVsZXRlIGNvbW1lbnQgd2l0aG91dCBhY2Nlc3MgdG9rZW4gb3IgdXJsJylcbiAgICB9XG4gICAgY29uc3Qgb2t0b2tpdCA9IF9va3Rva2l0IHx8IHRoaXMub2t0b2tpdFxuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHRoaXMudXJsKVxuICAgIGNvbnN0IHsgZGF0YTogcmVwb3NpdG9yeVB1YmxpY0tleVJlc3BvbnNlIH0gPSBhd2FpdCBnZXRBUmVwb3NpdG9yeVB1YmxpY0tleShcbiAgICAgIG9rdG9raXQsXG4gICAgICB7XG4gICAgICAgIG93bmVyLFxuICAgICAgICByZXBvLFxuICAgICAgfVxuICAgIClcbiAgICBjb25zdCB7IGtleV9pZCwga2V5IH0gPSByZXBvc2l0b3J5UHVibGljS2V5UmVzcG9uc2VcblxuICAgIGNvbnN0IGVuY3J5cHRlZFZhbHVlID0gYXdhaXQgZW5jcnlwdFNlY3JldChwYXJhbXMudmFsdWUsIGtleSlcblxuICAgIHJldHVybiBjcmVhdGVPclVwZGF0ZVJlcG9zaXRvcnlTZWNyZXQob2t0b2tpdCwge1xuICAgICAgZW5jcnlwdGVkX3ZhbHVlOiBlbmNyeXB0ZWRWYWx1ZSxcbiAgICAgIHNlY3JldF9uYW1lOiBwYXJhbXMubmFtZSxcbiAgICAgIGtleV9pZCxcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlUHVsbFJlcXVlc3RXaXRoTmV3RmlsZShcbiAgICBzb3VyY2VSZXBvVXJsOiBzdHJpbmcsXG4gICAgZmlsZXNQYXRoczogc3RyaW5nW10sXG4gICAgdXNlclJlcG9Vcmw6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGJvZHk6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCB7IHB1bGxfcmVxdWVzdF91cmwgfSA9IGF3YWl0IGNyZWF0ZVByKFxuICAgICAge1xuICAgICAgICBzb3VyY2VSZXBvVXJsLFxuICAgICAgICBmaWxlc1BhdGhzLFxuICAgICAgICB1c2VyUmVwb1VybCxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGJvZHksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBnaXRodWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiB7IHB1bGxfcmVxdWVzdF91cmw6IHB1bGxfcmVxdWVzdF91cmwgfVxuICB9XG5cbiAgYXN5bmMgdmFsaWRhdGVQYXJhbXMoKSB7XG4gICAgcmV0dXJuIGdpdGh1YlZhbGlkYXRlUGFyYW1zKHRoaXMudXJsLCB0aGlzLmFjY2Vzc1Rva2VuKVxuICB9XG4gIGFzeW5jIHBvc3RQckNvbW1lbnQoXG4gICAgcGFyYW1zOiBQaWNrPFxuICAgICAgUG9zdENvbW1lbnRQYXJhbXMsXG4gICAgICAnYm9keScgfCAnY29tbWl0X2lkJyB8ICdwdWxsX251bWJlcicgfCAncGF0aCcgfCAnbGluZSdcbiAgICA+LFxuICAgIF9va3Rva2l0PzogT2N0b2tpdFxuICApIHtcbiAgICBpZiAoKCFfb2t0b2tpdCAmJiAhdGhpcy5hY2Nlc3NUb2tlbikgfHwgIXRoaXMudXJsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBwb3N0IG9uIFBSIHdpdGhvdXQgYWNjZXNzIHRva2VuIG9yIHVybCcpXG4gICAgfVxuICAgIGNvbnN0IG9rdG9raXQgPSBfb2t0b2tpdCB8fCB0aGlzLm9rdG9raXRcbiAgICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyh0aGlzLnVybClcblxuICAgIHJldHVybiBwb3N0UHJDb21tZW50KG9rdG9raXQsIHtcbiAgICAgIC4uLnBhcmFtcyxcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICB9KVxuICB9XG4gIGFzeW5jIHVwZGF0ZVByQ29tbWVudChcbiAgICBwYXJhbXM6IFBpY2s8VXBkYXRlQ29tbWVudFBhcmFtcywgJ2JvZHknIHwgJ2NvbW1lbnRfaWQnPixcbiAgICBfb2t0b2tpdD86IE9jdG9raXRcbiAgKTogUHJvbWlzZTxVcGRhdGVDb21tZW50UmVzcG9uc2U+IHtcbiAgICBpZiAoKCFfb2t0b2tpdCAmJiAhdGhpcy5hY2Nlc3NUb2tlbikgfHwgIXRoaXMudXJsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCB1cGRhdGUgb24gUFIgd2l0aG91dCBhY2Nlc3MgdG9rZW4gb3IgdXJsJylcbiAgICB9XG4gICAgY29uc3Qgb2t0b2tpdCA9IF9va3Rva2l0IHx8IHRoaXMub2t0b2tpdFxuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHRoaXMudXJsKVxuXG4gICAgcmV0dXJuIHVwZGF0ZVByQ29tbWVudChva3Rva2l0LCB7XG4gICAgICAuLi5wYXJhbXMsXG4gICAgICBvd25lcixcbiAgICAgIHJlcG8sXG4gICAgfSlcbiAgfVxuICBhc3luYyBkZWxldGVDb21tZW50KFxuICAgIHBhcmFtczogUGljazxEZWxldGVDb21tZW50UGFyYW1zLCAnY29tbWVudF9pZCc+LFxuICAgIF9va3Rva2l0PzogT2N0b2tpdFxuICApIHtcbiAgICBpZiAoKCFfb2t0b2tpdCAmJiAhdGhpcy5hY2Nlc3NUb2tlbikgfHwgIXRoaXMudXJsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBkZWxldGUgY29tbWVudCB3aXRob3V0IGFjY2VzcyB0b2tlbiBvciB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBva3Rva2l0ID0gX29rdG9raXQgfHwgdGhpcy5va3Rva2l0XG4gICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRodWJPd25lckFuZFJlcG8odGhpcy51cmwpXG4gICAgcmV0dXJuIGRlbGV0ZUNvbW1lbnQob2t0b2tpdCwge1xuICAgICAgLi4ucGFyYW1zLFxuICAgICAgb3duZXIsXG4gICAgICByZXBvLFxuICAgIH0pXG4gIH1cbiAgYXN5bmMgZ2V0UHJDb21tZW50cyhcbiAgICBwYXJhbXM6IE9taXQ8R2V0UHJDb21tZW50c1BhcmFtcywgJ293bmVyJyB8ICdyZXBvJz4sXG4gICAgX29rdG9raXQ/OiBPY3Rva2l0XG4gICkge1xuICAgIGlmICgoIV9va3Rva2l0ICYmICF0aGlzLmFjY2Vzc1Rva2VuKSB8fCAhdGhpcy51cmwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBQciBDb21tZW50cyB3aXRob3V0IGFjY2VzcyB0b2tlbiBvciB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBva3Rva2l0ID0gX29rdG9raXQgfHwgdGhpcy5va3Rva2l0XG4gICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRodWJPd25lckFuZFJlcG8odGhpcy51cmwpXG4gICAgcmV0dXJuIGdldFByQ29tbWVudHMob2t0b2tpdCwge1xuICAgICAgcGVyX3BhZ2U6IDEwMCxcbiAgICAgIC4uLnBhcmFtcyxcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICB9KVxuICB9XG4gIGFzeW5jIGdldFByRGlmZihwYXJhbXM6IE9taXQ8R2V0UHJQYXJhbXMsICdvd25lcicgfCAncmVwbyc+KSB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IFByIENvbW1lbnRzIHdpdGhvdXQgYWNjZXNzIHRva2VuIG9yIHVybCcpXG4gICAgfVxuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHRoaXMudXJsKVxuICAgIGNvbnN0IHByUmVzID0gYXdhaXQgZ2V0UHJEaWZmKHRoaXMub2t0b2tpdCwge1xuICAgICAgLi4ucGFyYW1zLFxuICAgICAgb3duZXIsXG4gICAgICByZXBvLFxuICAgIH0pXG4gICAgLy8gbm90ZTogZm9yIHNvbWUgcmVhc29uIG9ja3Rva2l0IGRvZXMgbm90IGtub3cgdG8gcmV0dXJuIHJlc3BvbnNlIGFzIHN0cmluZ1xuICAgIC8vIGxvb2sgYXQgICdnZXRQckRpZmYnIGltcGxlbWVudGF0aW9uXG4gICAgcmV0dXJuIHouc3RyaW5nKCkucGFyc2UocHJSZXMuZGF0YSlcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9MaXN0KF9zY21Pcmc6IHN0cmluZyB8IHVuZGVmaW5lZCk6IFByb21pc2U8U2NtUmVwb0luZm9bXT4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGh1YlJlcG9MaXN0KHRoaXMuYWNjZXNzVG9rZW4pXG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hMaXN0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4gfHwgIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBnZXRHaXRodWJCcmFuY2hMaXN0KHRoaXMuYWNjZXNzVG9rZW4sIHRoaXMudXJsKVxuICB9XG5cbiAgZ2V0U2NtTGliVHlwZSgpOiBTY21MaWJTY21UeXBlIHtcbiAgICByZXR1cm4gU2NtTGliU2NtVHlwZS5HSVRIVUJcbiAgfVxuXG4gIGdldEF1dGhIZWFkZXJzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyBhdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dGhpcy5hY2Nlc3NUb2tlbn1gIH1cbiAgICB9XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICBnZXREb3dubG9hZFVybChzaGE6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMudXJsfS96aXBiYWxsLyR7c2hhfWBcbiAgfVxuXG4gIGFzeW5jIF9nZXRVc2VybmFtZUZvckF1dGhVcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRVc2VybmFtZSgpXG4gIH1cblxuICBhc3luYyBnZXRJc1JlbW90ZUJyYW5jaChicmFuY2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGdldEdpdGh1YklzUmVtb3RlQnJhbmNoKHRoaXMuYWNjZXNzVG9rZW4sIHRoaXMudXJsLCBicmFuY2gpXG4gIH1cblxuICBhc3luYyBnZXRVc2VySGFzQWNjZXNzVG9SZXBvKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbiB8fCAhdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4gb3Igbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3QgdXNlcm5hbWUgPSBhd2FpdCB0aGlzLmdldFVzZXJuYW1lKClcbiAgICByZXR1cm4gZ2V0R2l0aHViSXNVc2VyQ29sbGFib3JhdG9yKHVzZXJuYW1lLCB0aGlzLmFjY2Vzc1Rva2VuLCB0aGlzLnVybClcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJuYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhY2Nlc3MgdG9rZW4nKVxuICAgIH1cbiAgICByZXR1cm4gZ2V0R2l0aHViVXNlcm5hbWUodGhpcy5hY2Nlc3NUb2tlbilcbiAgfVxuXG4gIGFzeW5jIGdldFN1Ym1pdFJlcXVlc3RTdGF0dXMoXG4gICAgc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPiB7XG4gICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuIHx8ICF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gYWNjZXNzIHRva2VuIG9yIG5vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjY2VzcyB0b2tlbiBvciBubyB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IGdldEdpdGh1YlB1bGxSZXF1ZXN0U3RhdHVzKFxuICAgICAgdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIHRoaXMudXJsLFxuICAgICAgTnVtYmVyKHNjbVN1Ym1pdFJlcXVlc3RJZClcbiAgICApXG4gICAgaWYgKHN0YXRlID09PSAnbWVyZ2VkJykge1xuICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuTUVSR0VEXG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICByZXR1cm4gU2NtU3VibWl0UmVxdWVzdFN0YXR1cy5PUEVOXG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PT0gJ2RyYWZ0Jykge1xuICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuRFJBRlRcbiAgICB9XG4gICAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgcmV0dXJuIFNjbVN1Ym1pdFJlcXVlc3RTdGF0dXMuQ0xPU0VEXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBzdGF0ZSAke3N0YXRlfWApXG4gIH1cblxuICBhc3luYyBnZXRSZXBvQmxhbWVSYW5nZXMoXG4gICAgcmVmOiBzdHJpbmcsXG4gICAgcGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8XG4gICAge1xuICAgICAgc3RhcnRpbmdMaW5lOiBudW1iZXJcbiAgICAgIGVuZGluZ0xpbmU6IG51bWJlclxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgICBsb2dpbjogc3RyaW5nXG4gICAgICBlbWFpbDogc3RyaW5nXG4gICAgfVtdXG4gID4ge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBnZXRHaXRodWJCbGFtZVJhbmdlcyhcbiAgICAgIHsgcmVmLCBwYXRoLCBnaXRIdWJVcmw6IHRoaXMudXJsIH0sXG4gICAgICB7XG4gICAgICAgIGdpdGh1YkF1dGhUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBhc3luYyBnZXRSZWZlcmVuY2VEYXRhKHJlZjogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgdHlwZTogUmVmZXJlbmNlVHlwZVxuICAgIHNoYTogc3RyaW5nXG4gICAgZGF0ZTogRGF0ZSB8IHVuZGVmaW5lZFxuICB9PiB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGdldEdpdGh1YlJlZmVyZW5jZURhdGEoXG4gICAgICB7IHJlZiwgZ2l0SHViVXJsOiB0aGlzLnVybCB9LFxuICAgICAge1xuICAgICAgICBnaXRodWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgICB9XG4gICAgKVxuICB9XG4gIGFzeW5jIGdldFByQ29tbWVudChjb21tZW50SWQ6IG51bWJlcik6IFByb21pc2U8R2V0UHJDb21tZW50UmVzcG9uc2U+IHtcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cblxuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHRoaXMudXJsKVxuICAgIHJldHVybiBhd2FpdCBnZXRQckNvbW1lbnQodGhpcy5va3Rva2l0LCB7XG4gICAgICByZXBvLFxuICAgICAgb3duZXIsXG4gICAgICBjb21tZW50X2lkOiBjb21tZW50SWQsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9EZWZhdWx0QnJhbmNoKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGdldEdpdGh1YlJlcG9EZWZhdWx0QnJhbmNoKHRoaXMudXJsLCB7XG4gICAgICBnaXRodWJBdXRoVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgfSlcbiAgfVxuICBhc3luYyBnZXRQclVybChwck51bWJlcjogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBpZiAoIXRoaXMudXJsIHx8ICF0aGlzLm9rdG9raXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHVybCcpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHVybCcpXG4gICAgfVxuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHRoaXMudXJsKVxuICAgIGNvbnN0IGdldFByUmVzID0gYXdhaXQgZ2V0UHIodGhpcy5va3Rva2l0LCB7XG4gICAgICBvd25lcixcbiAgICAgIHJlcG8sXG4gICAgICBwdWxsX251bWJlcjogcHJOdW1iZXIsXG4gICAgfSlcbiAgICByZXR1cm4gZ2V0UHJSZXMuZGF0YS5odG1sX3VybFxuICB9XG4gIGFzeW5jIHBvc3RHZW5lcmFsUHJDb21tZW50KFxuICAgIHBhcmFtczogUG9zdFBSUmV2aWV3Q29tbWVudFBhcmFtcyxcbiAgICBhdXRoPzogeyBhdXRoVG9rZW46IHN0cmluZyB9XG4gICk6IFNDTVBvc3RHZW5lcmFsUHJDb21tZW50c1Jlc3BvbnNlIHtcbiAgICBjb25zdCB7IHByTnVtYmVyLCBib2R5IH0gPSBwYXJhbXNcbiAgICBpZiAoIXRoaXMudXJsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdubyB1cmwnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB1cmwnKVxuICAgIH1cbiAgICBjb25zdCBva3RvS2l0ID0gYXV0aCA/IG5ldyBPY3Rva2l0KHsgYXV0aDogYXV0aC5hdXRoVG9rZW4gfSkgOiB0aGlzLm9rdG9raXRcbiAgICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyh0aGlzLnVybClcbiAgICByZXR1cm4gYXdhaXQgcG9zdEdlbmVyYWxQckNvbW1lbnQob2t0b0tpdCwge1xuICAgICAgaXNzdWVfbnVtYmVyOiBwck51bWJlcixcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIGJvZHksXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldEdlbmVyYWxQckNvbW1lbnRzKFxuICAgIHBhcmFtczogU0NNR2V0UHJSZXZpZXdDb21tZW50c1BhcmFtcyxcbiAgICBhdXRoPzogeyBhdXRoVG9rZW46IHN0cmluZyB9XG4gICk6IFNDTUdldFByUmV2aWV3Q29tbWVudHNSZXNwb25zZSB7XG4gICAgY29uc3QgeyBwck51bWJlciB9ID0gcGFyYW1zXG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3Qgb2t0b0tpdCA9IGF1dGggPyBuZXcgT2N0b2tpdCh7IGF1dGg6IGF1dGguYXV0aFRva2VuIH0pIDogdGhpcy5va3Rva2l0XG4gICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRodWJPd25lckFuZFJlcG8odGhpcy51cmwpXG4gICAgcmV0dXJuIGF3YWl0IGdldEdlbmVyYWxQckNvbW1lbnRzKG9rdG9LaXQsIHtcbiAgICAgIGlzc3VlX251bWJlcjogcHJOdW1iZXIsXG4gICAgICBvd25lcixcbiAgICAgIHJlcG8sXG4gICAgfSlcbiAgfVxuICBhc3luYyBkZWxldGVHZW5lcmFsUHJDb21tZW50KFxuICAgIHsgY29tbWVudElkIH06IFNDTURlbGV0ZUdlbmVyYWxQckNvbW1lbnRQYXJhbXMsXG4gICAgYXV0aD86IHsgYXV0aFRva2VuOiBzdHJpbmcgfVxuICApOiBTQ01EZWxldGVHZW5lcmFsUHJSZXZpZXdSZXNwb25zZSB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgY29uc29sZS5lcnJvcignbm8gdXJsJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdXJsJylcbiAgICB9XG4gICAgY29uc3Qgb2t0b0tpdCA9IGF1dGggPyBuZXcgT2N0b2tpdCh7IGF1dGg6IGF1dGguYXV0aFRva2VuIH0pIDogdGhpcy5va3Rva2l0XG4gICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRodWJPd25lckFuZFJlcG8odGhpcy51cmwpXG4gICAgcmV0dXJuIGRlbGV0ZUdlbmVyYWxQckNvbW1lbnQob2t0b0tpdCwge1xuICAgICAgb3duZXIsXG4gICAgICByZXBvLFxuICAgICAgY29tbWVudF9pZDogY29tbWVudElkLFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0dWJTQ01MaWIgZXh0ZW5kcyBTQ01MaWIge1xuICBhc3luYyBjcmVhdGVTdWJtaXRSZXF1ZXN0KFxuICAgIF90YXJnZXRCcmFuY2hOYW1lOiBzdHJpbmcsXG4gICAgX3NvdXJjZUJyYW5jaE5hbWU6IHN0cmluZyxcbiAgICBfdGl0bGU6IHN0cmluZyxcbiAgICBfYm9keTogc3RyaW5nXG4gICk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc29sZS5lcnJvcignY3JlYXRlU3VibWl0UmVxdWVzdCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjcmVhdGVTdWJtaXRSZXF1ZXN0KCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldFNjbUxpYlR5cGUoKTogU2NtTGliU2NtVHlwZSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0U2NtTGliVHlwZSgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRTY21MaWJUeXBlKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldEF1dGhIZWFkZXJzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldEF1dGhIZWFkZXJzKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldEF1dGhIZWFkZXJzKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldERvd25sb2FkVXJsKF9zaGE6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0RG93bmxvYWRVcmwoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0RG93bmxvYWRVcmwoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ19nZXRVc2VybmFtZUZvckF1dGhVcmwoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignX2dldFVzZXJuYW1lRm9yQXV0aFVybCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyBnZXRJc1JlbW90ZUJyYW5jaChfYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRJc1JlbW90ZUJyYW5jaCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRJc1JlbW90ZUJyYW5jaCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZVBhcmFtcygpIHtcbiAgICBjb25zb2xlLmVycm9yKCd2YWxpZGF0ZVBhcmFtcygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCd2YWxpZGF0ZVBhcmFtcygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICBhc3luYyBmb3JrUmVwbygpOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfCBudWxsIH0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdmb3JrUmVwbygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdmb3JrUmVwbygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cbiAgYXN5bmMgY3JlYXRlT3JVcGRhdGVSZXBvc2l0b3J5U2VjcmV0KCk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB8IG51bGwgfT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2ZvcmtSZXBvKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvcmtSZXBvKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVB1bGxSZXF1ZXN0V2l0aE5ld0ZpbGUoXG4gICAgX3NvdXJjZVJlcG9Vcmw6IHN0cmluZyxcbiAgICBfZmlsZXNQYXRoczogc3RyaW5nW10sXG4gICAgX3VzZXJSZXBvVXJsOiBzdHJpbmcsXG4gICAgX3RpdGxlOiBzdHJpbmcsXG4gICAgX2JvZHk6IHN0cmluZ1xuICApOiBQcm9taXNlPHsgcHVsbF9yZXF1ZXN0X3VybDogc3RyaW5nIH0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdjcmVhdGVQdWxsUmVxdWVzdFdpdGhOZXdGaWxlKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZVB1bGxSZXF1ZXN0V2l0aE5ld0ZpbGUoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0xpc3QoX3NjbU9yZzogc3RyaW5nIHwgdW5kZWZpbmVkKTogUHJvbWlzZTxTY21SZXBvSW5mb1tdPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UmVwb0xpc3QoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UmVwb0xpc3QoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0QnJhbmNoTGlzdCgpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0QnJhbmNoTGlzdCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRCcmFuY2hMaXN0KCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJuYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0VXNlcm5hbWUoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0VXNlcm5hbWUoKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgYXN5bmMgZ2V0U3VibWl0UmVxdWVzdFN0YXR1cyhcbiAgICBfc2NtU3VibWl0UmVxdWVzdElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxTY21TdWJtaXRSZXF1ZXN0U3RhdHVzPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0U3VibWl0UmVxdWVzdFN0YXR1cygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRTdWJtaXRSZXF1ZXN0U3RhdHVzKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFVzZXJIYXNBY2Nlc3NUb1JlcG8oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0VXNlckhhc0FjY2Vzc1RvUmVwbygpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRVc2VySGFzQWNjZXNzVG9SZXBvKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9CbGFtZVJhbmdlcyhcbiAgICBfcmVmOiBzdHJpbmcsXG4gICAgX3BhdGg6IHN0cmluZ1xuICApOiBQcm9taXNlPFxuICAgIHtcbiAgICAgIHN0YXJ0aW5nTGluZTogbnVtYmVyXG4gICAgICBlbmRpbmdMaW5lOiBudW1iZXJcbiAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgbG9naW46IHN0cmluZ1xuICAgICAgZW1haWw6IHN0cmluZ1xuICAgIH1bXVxuICA+IHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRSZXBvQmxhbWVSYW5nZXMoKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UmVwb0JsYW1lUmFuZ2VzKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFJlZmVyZW5jZURhdGEoX3JlZjogc3RyaW5nKTogUHJvbWlzZTx7XG4gICAgdHlwZTogUmVmZXJlbmNlVHlwZVxuICAgIHNoYTogc3RyaW5nXG4gICAgZGF0ZTogRGF0ZSB8IHVuZGVmaW5lZFxuICB9PiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UmVmZXJlbmNlRGF0YSgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRSZWZlcmVuY2VEYXRhKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9EZWZhdWx0QnJhbmNoKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UmVwb0RlZmF1bHRCcmFuY2goKSBub3QgaW1wbGVtZW50ZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UmVwb0RlZmF1bHRCcmFuY2goKSBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG4gIGFzeW5jIGdldFByQ29tbWVudChfY29tbWVudElkOiBudW1iZXIpOiBQcm9taXNlPEdldFByQ29tbWVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UHJDb21tZW50KCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFByQ29tbWVudCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cbiAgYXN5bmMgdXBkYXRlUHJDb21tZW50KCk6IFByb21pc2U8VXBkYXRlQ29tbWVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5lcnJvcigndXBkYXRlUHJDb21tZW50KCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VwZGF0ZVByQ29tbWVudCgpIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cbiAgYXN5bmMgZ2V0UHJVcmwoX3ByTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldFByKCkgbm90IGltcGxlbWVudGVkJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFByKCkgbm90IGltcGxlbWVudGVkJylcbiAgfVxuICBwb3N0R2VuZXJhbFByQ29tbWVudCgpOiBTQ01Qb3N0R2VuZXJhbFByQ29tbWVudHNSZXNwb25zZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpXG4gIH1cbiAgZ2V0R2VuZXJhbFByQ29tbWVudHMoKTogU0NNR2V0UHJSZXZpZXdDb21tZW50c1Jlc3BvbnNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuICBkZWxldGVHZW5lcmFsUHJDb21tZW50KCk6IFNDTURlbGV0ZUdlbmVyYWxQclJldmlld1Jlc3BvbnNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxufVxuIl19