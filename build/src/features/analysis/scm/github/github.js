"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPr = exports.getGithubBlameRanges = exports.queryGithubGraphql = exports.parseGithubOwnerAndRepo = exports.getGithubReferenceData = exports.getGithubRepoDefaultBranch = exports.forkRepo = exports.createPullRequest = exports.getGithubBranchList = exports.getGithubRepoList = exports.getGithubIsRemoteBranch = exports.getGithubPullRequestStatus = exports.getGithubIsUserCollaborator = exports.getGithubUsername = exports.githubValidateParams = exports.getUserInfo = void 0;
const request_error_1 = require("@octokit/request-error");
const octokit_1 = require("octokit");
const zod_1 = require("zod");
const scm_1 = require("../scm");
const urlParser_1 = require("../urlParser");
function removeTrailingSlash(str) {
    return str.trim().replace(/\/+$/, '');
}
const EnvVariablesZod = zod_1.z.object({
    GITHUB_API_TOKEN: zod_1.z.string().optional(),
});
const { GITHUB_API_TOKEN } = EnvVariablesZod.parse(process.env);
const GetBlameDocument = `
      query GetBlame(
        $owner: String!
        $repo: String!
        $ref: String!
        $path: String!
      ) {
        repository(name: $repo, owner: $owner) {
          # branch name
          object(expression: $ref) {
            # cast Target to a Commit
            ... on Commit {
              # full repo-relative path to blame file
              blame(path: $path) {
                ranges {
                  commit {
                    author {
                      user {
                        name
                        login
                      }
                    }
                    authoredDate
                  }
                  startingLine
                  endingLine
                  age
                }
              }
            }
            
          }
        }
      }
    `;
function getOktoKit(options) {
    const token = options?.githubAuthToken ?? GITHUB_API_TOKEN ?? '';
    return new octokit_1.Octokit({ auth: token });
}
function getUserInfo({ accessToken, }) {
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    return oktoKit.request('GET /user');
}
exports.getUserInfo = getUserInfo;
async function githubValidateParams(url, accessToken) {
    try {
        const oktoKit = getOktoKit({ githubAuthToken: accessToken });
        if (accessToken) {
            await oktoKit.rest.users.getAuthenticated();
        }
        if (url) {
            const { owner, repo } = parseGithubOwnerAndRepo(url);
            await oktoKit.rest.repos.get({ repo, owner });
        }
    }
    catch (e) {
        const error = e;
        const code = error.status ||
            error.statusCode ||
            error.response?.status ||
            error.response?.statusCode ||
            error.response?.code;
        if (code === 401 || code === 403) {
            throw new scm_1.InvalidAccessTokenError(`invalid github access token`);
        }
        if (code === 404) {
            throw new scm_1.InvalidRepoUrlError(`invalid github repo Url ${url}`);
        }
        throw e;
    }
}
exports.githubValidateParams = githubValidateParams;
async function getGithubUsername(accessToken) {
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    const res = await oktoKit.rest.users.getAuthenticated();
    return res.data.login;
}
exports.getGithubUsername = getGithubUsername;
async function getGithubIsUserCollaborator(username, accessToken, repoUrl) {
    try {
        const { owner, repo } = parseGithubOwnerAndRepo(repoUrl);
        const oktoKit = getOktoKit({ githubAuthToken: accessToken });
        const res = await oktoKit.rest.repos.checkCollaborator({
            owner,
            repo,
            username,
        });
        if (res.status === 204) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}
exports.getGithubIsUserCollaborator = getGithubIsUserCollaborator;
async function getGithubPullRequestStatus(accessToken, repoUrl, prNumber) {
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl);
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    const res = await oktoKit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
    });
    if (res.data.merged) {
        return 'merged';
    }
    if (res.data.draft) {
        return 'draft';
    }
    return res.data.state;
}
exports.getGithubPullRequestStatus = getGithubPullRequestStatus;
async function getGithubIsRemoteBranch(accessToken, repoUrl, branch) {
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl);
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    try {
        const res = await oktoKit.rest.repos.getBranch({
            owner,
            repo,
            branch,
        });
        return branch === res.data.name;
    }
    catch (e) {
        return false;
    }
}
exports.getGithubIsRemoteBranch = getGithubIsRemoteBranch;
async function getGithubRepoList(accessToken) {
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    try {
        const githubRepos = await getRepos(oktoKit);
        return githubRepos.map((repo) => {
            const repoLanguages = [];
            if (repo.language) {
                repoLanguages.push(repo.language);
            }
            return {
                repoName: repo.name,
                repoUrl: repo.html_url,
                repoOwner: repo.owner.login,
                repoLanguages,
                repoIsPublic: !repo.private,
                repoUpdatedAt: repo.updated_at,
            };
        });
    }
    catch (e) {
        if (e instanceof request_error_1.RequestError && e.status === 401) {
            return [];
        }
        if (e instanceof request_error_1.RequestError && e.status === 404) {
            return [];
        }
        throw e;
    }
}
exports.getGithubRepoList = getGithubRepoList;
async function getGithubBranchList(accessToken, repoUrl) {
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl);
    const oktoKit = getOktoKit({ githubAuthToken: accessToken });
    const res = await oktoKit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 1000,
        page: 1,
    });
    return res.data.map((branch) => branch.name);
}
exports.getGithubBranchList = getGithubBranchList;
async function createPullRequest(options) {
    const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl);
    const oktoKit = getOktoKit({ githubAuthToken: options.accessToken });
    const res = await oktoKit.rest.pulls.create({
        owner,
        repo,
        title: options.title,
        body: options.body,
        head: options.sourceBranchName,
        base: options.targetBranchName,
        draft: false,
        maintainer_can_modify: true,
    });
    return res.data.number;
}
exports.createPullRequest = createPullRequest;
async function forkRepo(options) {
    const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl);
    const oktoKit = getOktoKit({ githubAuthToken: options.accessToken });
    const res = await oktoKit.rest.repos.createFork({
        owner,
        repo,
        default_branch_only: false,
    });
    return { url: res.data.html_url ? String(res.data.html_url) : null };
}
exports.forkRepo = forkRepo;
async function getRepos(oktoKit) {
    // For now limit is 100(maximum supported by github) if we will need more we need to implement pagination + search
    const res = await oktoKit.request('GET /user/repos?sort=updated', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            per_page: 100,
        },
    });
    return res.data;
}
async function getGithubRepoDefaultBranch(repoUrl, options) {
    const oktoKit = getOktoKit(options);
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl);
    return (await oktoKit.rest.repos.get({ repo, owner })).data.default_branch;
}
exports.getGithubRepoDefaultBranch = getGithubRepoDefaultBranch;
async function getGithubReferenceData({ ref, gitHubUrl }, options) {
    const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl);
    let res;
    try {
        const oktoKit = getOktoKit(options);
        res = await Promise.any([
            getBranch({ owner, repo, branch: ref }, oktoKit).then((result) => ({
                date: result.data.commit.commit.committer?.date
                    ? new Date(result.data.commit.commit.committer?.date)
                    : undefined,
                type: scm_1.ReferenceType.BRANCH,
                sha: result.data.commit.sha,
            })),
            getCommit({ commitSha: ref, repo, owner }, oktoKit).then((commit) => ({
                date: new Date(commit.data.committer.date),
                type: scm_1.ReferenceType.COMMIT,
                sha: commit.data.sha,
            })),
            getTagDate({ owner, repo, tag: ref }, oktoKit).then((data) => ({
                date: new Date(data.date),
                type: scm_1.ReferenceType.TAG,
                sha: data.sha,
            })),
        ]);
        return res;
    }
    catch (e) {
        // did not find any branch/tag/commit
        if (e instanceof AggregateError) {
            throw new scm_1.RefNotFoundError(`ref: ${ref} does not exist`);
        }
        throw e;
    }
}
exports.getGithubReferenceData = getGithubReferenceData;
async function getBranch({ branch, owner, repo }, oktoKit) {
    return oktoKit.rest.repos.getBranch({
        branch: branch,
        owner,
        repo,
    });
}
async function getTagDate({ tag, owner, repo }, oktoKit) {
    const refResponse = await oktoKit.rest.git.getRef({
        ref: `tags/${tag}`,
        owner,
        repo,
    });
    const tagSha = refResponse.data.object.sha;
    if (refResponse.data.object.type === 'commit') {
        const res = await oktoKit.rest.git.getCommit({
            commit_sha: tagSha,
            owner,
            repo,
        });
        return {
            date: res.data.committer.date,
            sha: res.data.sha,
        };
    }
    const res = await oktoKit.rest.git.getTag({
        tag_sha: tagSha,
        owner,
        repo,
    });
    return {
        date: res.data.tagger.date,
        sha: res.data.sha,
    };
}
async function getCommit({ commitSha, owner, repo, }, oktoKit) {
    return oktoKit.rest.git.getCommit({
        repo,
        owner,
        commit_sha: commitSha,
    });
}
function parseGithubOwnerAndRepo(gitHubUrl) {
    gitHubUrl = removeTrailingSlash(gitHubUrl);
    const parsingResult = (0, urlParser_1.parseScmURL)(gitHubUrl, scm_1.ScmType.GitHub);
    if (!parsingResult || parsingResult.hostname !== 'github.com') {
        throw new scm_1.InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`);
    }
    const { organization, repoName } = parsingResult;
    if (!organization || !repoName) {
        throw new scm_1.InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`);
    }
    return { owner: organization, repo: repoName };
}
exports.parseGithubOwnerAndRepo = parseGithubOwnerAndRepo;
async function queryGithubGraphql(query, variables, options) {
    const token = options?.githubAuthToken ?? GITHUB_API_TOKEN ?? '';
    const parameters = variables ?? {};
    const authorizationHeader = {
        headers: {
            authorization: `bearer ${token}`,
        },
    };
    try {
        const oktoKit = getOktoKit(options);
        const res = await oktoKit.graphql(query, {
            ...parameters,
            ...authorizationHeader,
        });
        return res;
    }
    catch (e) {
        if (e instanceof request_error_1.RequestError) {
            return null;
        }
        throw e;
    }
}
exports.queryGithubGraphql = queryGithubGraphql;
async function getGithubBlameRanges({ ref, gitHubUrl, path }, options) {
    const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl);
    const variables = {
        owner,
        repo,
        path,
        ref,
    };
    const res = await queryGithubGraphql(GetBlameDocument, variables, options);
    if (!res?.repository?.object?.blame?.ranges) {
        return [];
    }
    return res.repository.object.blame.ranges.map((range) => ({
        startingLine: range.startingLine,
        endingLine: range.endingLine,
        email: range.commit.author.user?.email || '',
        name: range.commit.author.user?.name || '',
        login: range.commit.author.user?.login || '',
    }));
}
exports.getGithubBlameRanges = getGithubBlameRanges;
async function createPr({ sourceRepoUrl, filesPaths, userRepoUrl, title, body, }, options) {
    const oktoKit = getOktoKit(options);
    const { owner: sourceOwner, repo: sourceRepo } = parseGithubOwnerAndRepo(sourceRepoUrl);
    const { owner, repo } = parseGithubOwnerAndRepo(userRepoUrl);
    const [sourceFilePath, secondFilePath] = filesPaths;
    const sourceFileContentResponse = await oktoKit.rest.repos.getContent({
        owner: sourceOwner,
        repo: sourceRepo,
        path: '/' + sourceFilePath,
    });
    const { data: repository } = await oktoKit.rest.repos.get({ owner, repo });
    const defaultBranch = repository.default_branch;
    // Create a new branch
    const newBranchName = `mobb/workflow-${Date.now()}`;
    await oktoKit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: await oktoKit.rest.git
            .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
            .then((response) => response.data.object.sha),
    });
    const decodedContent = Buffer.from(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sourceFileContentResponse.data.content, 'base64').toString('utf-8');
    const tree = [
        {
            path: sourceFilePath,
            mode: '100644',
            type: 'blob',
            content: decodedContent,
        },
    ];
    if (secondFilePath) {
        const secondFileContentResponse = await oktoKit.rest.repos.getContent({
            owner: sourceOwner,
            repo: sourceRepo,
            path: '/' + secondFilePath,
        });
        const secondDecodedContent = Buffer.from(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        secondFileContentResponse.data.content, 'base64').toString('utf-8');
        tree.push({
            path: secondFilePath,
            mode: '100644',
            type: 'blob',
            content: secondDecodedContent,
        });
    }
    // Create a new commit with the file from the source repository
    const createTreeResponse = await oktoKit.rest.git.createTree({
        owner,
        repo,
        base_tree: await oktoKit.rest.git
            .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
            .then((response) => response.data.object.sha),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tree,
    });
    const createCommitResponse = await oktoKit.rest.git.createCommit({
        owner,
        repo,
        message: 'Add new yaml file',
        tree: createTreeResponse.data.sha,
        parents: [
            await oktoKit.rest.git
                .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
                .then((response) => response.data.object.sha),
        ],
    });
    // Update the branch reference to point to the new commit
    await oktoKit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${newBranchName}`,
        sha: createCommitResponse.data.sha,
    });
    // Create the Pull Request
    const createPRResponse = await oktoKit.rest.pulls.create({
        owner,
        repo,
        title,
        head: newBranchName,
        head_repo: sourceRepo,
        body,
        base: defaultBranch,
    });
    return {
        pull_request_url: createPRResponse.data.html_url,
    };
}
exports.createPr = createPr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9naXRodWIvZ2l0aHViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUFxRDtBQUVyRCxxQ0FBaUM7QUFDakMsNkJBQXVCO0FBRXZCLGdDQU9lO0FBQ2YsNENBQTBDO0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsR0FBVztJQUN0QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQy9CLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDeEMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFLL0QsTUFBTSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWtDcEIsQ0FBQTtBQXlCTCxTQUFTLFVBQVUsQ0FBQyxPQUF3QjtJQUMxQyxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsZUFBZSxJQUFJLGdCQUFnQixJQUFJLEVBQUUsQ0FBQTtJQUNoRSxPQUFPLElBQUksaUJBQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ3JDLENBQUM7QUFFRCxTQUFnQixXQUFXLENBQUMsRUFDMUIsV0FBVyxHQUdaO0lBQ0MsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7SUFDNUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3JDLENBQUM7QUFQ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QUFDLElBQUksQ0FBQyxRQUFRO0tBQ2pELENBQUE7QUFDSCxDQUFDO0FBOUhELDRCQThIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3RFcnJvciB9IGZyb20gJ0BvY3Rva2l0L3JlcXVlc3QtZXJyb3InXG5pbXBvcnQgdHlwZSB7IEVuZHBvaW50cyB9IGZyb20gJ0BvY3Rva2l0L3R5cGVzJ1xuaW1wb3J0IHsgT2N0b2tpdCB9IGZyb20gJ29jdG9raXQnXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJ1xuXG5pbXBvcnQge1xuICBJbnZhbGlkQWNjZXNzVG9rZW5FcnJvcixcbiAgSW52YWxpZFJlcG9VcmxFcnJvcixcbiAgSW52YWxpZFVybFBhdHRlcm5FcnJvcixcbiAgUmVmZXJlbmNlVHlwZSxcbiAgUmVmTm90Rm91bmRFcnJvcixcbiAgU2NtVHlwZSxcbn0gZnJvbSAnLi4vc2NtJ1xuaW1wb3J0IHsgcGFyc2VTY21VUkwgfSBmcm9tICcuLi91cmxQYXJzZXInXG5cbmZ1bmN0aW9uIHJlbW92ZVRyYWlsaW5nU2xhc2goc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHN0ci50cmltKCkucmVwbGFjZSgvXFwvKyQvLCAnJylcbn1cblxuY29uc3QgRW52VmFyaWFibGVzWm9kID0gei5vYmplY3Qoe1xuICBHSVRIVUJfQVBJX1RPS0VOOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KVxuXG5jb25zdCB7IEdJVEhVQl9BUElfVE9LRU4gfSA9IEVudlZhcmlhYmxlc1pvZC5wYXJzZShwcm9jZXNzLmVudilcblxudHlwZSBBcGlBdXRoT3B0aW9ucyA9IHtcbiAgZ2l0aHViQXV0aFRva2VuPzogc3RyaW5nIHwgbnVsbFxufVxuY29uc3QgR2V0QmxhbWVEb2N1bWVudCA9IGBcbiAgICAgIHF1ZXJ5IEdldEJsYW1lKFxuICAgICAgICAkb3duZXI6IFN0cmluZyFcbiAgICAgICAgJHJlcG86IFN0cmluZyFcbiAgICAgICAgJHJlZjogU3RyaW5nIVxuICAgICAgICAkcGF0aDogU3RyaW5nIVxuICAgICAgKSB7XG4gICAgICAgIHJlcG9zaXRvcnkobmFtZTogJHJlcG8sIG93bmVyOiAkb3duZXIpIHtcbiAgICAgICAgICAjIGJyYW5jaCBuYW1lXG4gICAgICAgICAgb2JqZWN0KGV4cHJlc3Npb246ICRyZWYpIHtcbiAgICAgICAgICAgICMgY2FzdCBUYXJnZXQgdG8gYSBDb21taXRcbiAgICAgICAgICAgIC4uLiBvbiBDb21taXQge1xuICAgICAgICAgICAgICAjIGZ1bGwgcmVwby1yZWxhdGl2ZSBwYXRoIHRvIGJsYW1lIGZpbGVcbiAgICAgICAgICAgICAgYmxhbWUocGF0aDogJHBhdGgpIHtcbiAgICAgICAgICAgICAgICByYW5nZXMge1xuICAgICAgICAgICAgICAgICAgY29tbWl0IHtcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICAgICAgICAgICAgICB1c2VyIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcmVkRGF0ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgc3RhcnRpbmdMaW5lXG4gICAgICAgICAgICAgICAgICBlbmRpbmdMaW5lXG4gICAgICAgICAgICAgICAgICBhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGBcblxuZXhwb3J0IHR5cGUgR2l0aHViQmxhbWVSZXNwb25zZSA9IHtcbiAgcmVwb3NpdG9yeToge1xuICAgIG9iamVjdDoge1xuICAgICAgYmxhbWU6IHtcbiAgICAgICAgcmFuZ2VzOiBBcnJheTx7XG4gICAgICAgICAgYWdlOiBudW1iZXJcbiAgICAgICAgICBlbmRpbmdMaW5lOiBudW1iZXJcbiAgICAgICAgICBzdGFydGluZ0xpbmU6IG51bWJlclxuICAgICAgICAgIGNvbW1pdDoge1xuICAgICAgICAgICAgYXV0aG9yOiB7XG4gICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICBlbWFpbDogc3RyaW5nXG4gICAgICAgICAgICAgICAgbmFtZTogc3RyaW5nXG4gICAgICAgICAgICAgICAgbG9naW46IHN0cmluZ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9PlxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRPa3RvS2l0KG9wdGlvbnM/OiBBcGlBdXRoT3B0aW9ucykge1xuICBjb25zdCB0b2tlbiA9IG9wdGlvbnM/LmdpdGh1YkF1dGhUb2tlbiA/PyBHSVRIVUJfQVBJX1RPS0VOID8/ICcnXG4gIHJldHVybiBuZXcgT2N0b2tpdCh7IGF1dGg6IHRva2VuIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VySW5mbyh7XG4gIGFjY2Vzc1Rva2VuLFxufToge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG59KTogUHJvbWlzZTxFbmRwb2ludHNbJ0dFVCAvdXNlciddWydyZXNwb25zZSddPiB7XG4gIGNvbnN0IG9rdG9LaXQgPSBnZXRPa3RvS2l0KHsgZ2l0aHViQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICByZXR1cm4gb2t0b0tpdC5yZXF1ZXN0KCdHRVQgL3VzZXInKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2l0aHViVmFsaWRhdGVQYXJhbXMoXG4gIHVybDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkXG4pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdCh7IGdpdGh1YkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgICBpZiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgIGF3YWl0IG9rdG9LaXQucmVzdC51c2Vycy5nZXRBdXRoZW50aWNhdGVkKClcbiAgICB9XG4gICAgaWYgKHVybCkge1xuICAgICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRodWJPd25lckFuZFJlcG8odXJsKVxuICAgICAgYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmdldCh7IHJlcG8sIG93bmVyIH0pXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgZXJyb3IgPSBlIGFzIHtcbiAgICAgIGNvZGU/OiBzdHJpbmdcbiAgICAgIHN0YXR1cz86IG51bWJlclxuICAgICAgc3RhdHVzQ29kZT86IG51bWJlclxuICAgICAgcmVzcG9uc2U/OiB7IHN0YXR1cz86IG51bWJlcjsgc3RhdHVzQ29kZT86IG51bWJlcjsgY29kZT86IHN0cmluZyB9XG4gICAgfVxuICAgIGNvbnN0IGNvZGUgPVxuICAgICAgZXJyb3Iuc3RhdHVzIHx8XG4gICAgICBlcnJvci5zdGF0dXNDb2RlIHx8XG4gICAgICBlcnJvci5yZXNwb25zZT8uc3RhdHVzIHx8XG4gICAgICBlcnJvci5yZXNwb25zZT8uc3RhdHVzQ29kZSB8fFxuICAgICAgZXJyb3IucmVzcG9uc2U/LmNvZGVcbiAgICBpZiAoY29kZSA9PT0gNDAxIHx8IGNvZGUgPT09IDQwMykge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRBY2Nlc3NUb2tlbkVycm9yKGBpbnZhbGlkIGdpdGh1YiBhY2Nlc3MgdG9rZW5gKVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gNDA0KSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFJlcG9VcmxFcnJvcihgaW52YWxpZCBnaXRodWIgcmVwbyBVcmwgJHt1cmx9YClcbiAgICB9XG4gICAgdGhyb3cgZVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRodWJVc2VybmFtZShhY2Nlc3NUb2tlbjogc3RyaW5nKSB7XG4gIGNvbnN0IG9rdG9LaXQgPSBnZXRPa3RvS2l0KHsgZ2l0aHViQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICBjb25zdCByZXMgPSBhd2FpdCBva3RvS2l0LnJlc3QudXNlcnMuZ2V0QXV0aGVudGljYXRlZCgpXG4gIHJldHVybiByZXMuZGF0YS5sb2dpblxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0aHViSXNVc2VyQ29sbGFib3JhdG9yKFxuICB1c2VybmFtZTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nLFxuICByZXBvVXJsOiBzdHJpbmdcbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKHJlcG9VcmwpXG4gICAgY29uc3Qgb2t0b0tpdCA9IGdldE9rdG9LaXQoeyBnaXRodWJBdXRoVG9rZW46IGFjY2Vzc1Rva2VuIH0pXG4gICAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmNoZWNrQ29sbGFib3JhdG9yKHtcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIHVzZXJuYW1lLFxuICAgIH0pXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwNCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdpdGh1YlB1bGxSZXF1ZXN0U3RhdHVzKFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nLFxuICByZXBvVXJsOiBzdHJpbmcsXG4gIHByTnVtYmVyOiBudW1iZXJcbikge1xuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdCh7IGdpdGh1YkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LnB1bGxzLmdldCh7XG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBwdWxsX251bWJlcjogcHJOdW1iZXIsXG4gIH0pXG4gIGlmIChyZXMuZGF0YS5tZXJnZWQpIHtcbiAgICByZXR1cm4gJ21lcmdlZCdcbiAgfVxuICBpZiAocmVzLmRhdGEuZHJhZnQpIHtcbiAgICByZXR1cm4gJ2RyYWZ0J1xuICB9XG4gIHJldHVybiByZXMuZGF0YS5zdGF0ZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0aHViSXNSZW1vdGVCcmFuY2goXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmcsXG4gIHJlcG9Vcmw6IHN0cmluZyxcbiAgYnJhbmNoOiBzdHJpbmdcbikge1xuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdCh7IGdpdGh1YkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBva3RvS2l0LnJlc3QucmVwb3MuZ2V0QnJhbmNoKHtcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIGJyYW5jaCxcbiAgICB9KVxuICAgIHJldHVybiBicmFuY2ggPT09IHJlcy5kYXRhLm5hbWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRodWJSZXBvTGlzdChhY2Nlc3NUb2tlbjogc3RyaW5nKSB7XG4gIGNvbnN0IG9rdG9LaXQgPSBnZXRPa3RvS2l0KHsgZ2l0aHViQXV0aFRva2VuOiBhY2Nlc3NUb2tlbiB9KVxuICB0cnkge1xuICAgIGNvbnN0IGdpdGh1YlJlcG9zID0gYXdhaXQgZ2V0UmVwb3Mob2t0b0tpdClcbiAgICByZXR1cm4gZ2l0aHViUmVwb3MubWFwKFxuICAgICAgKHJlcG86IHtcbiAgICAgICAgbGFuZ3VhZ2U6IHN0cmluZ1xuICAgICAgICBuYW1lOiBzdHJpbmdcbiAgICAgICAgaHRtbF91cmw6IHN0cmluZ1xuICAgICAgICBvd25lcjogeyBsb2dpbjogc3RyaW5nIH1cbiAgICAgICAgcHJpdmF0ZTogYm9vbGVhblxuICAgICAgICB1cGRhdGVkX2F0OiBzdHJpbmdcbiAgICAgIH0pID0+IHtcbiAgICAgICAgY29uc3QgcmVwb0xhbmd1YWdlcyA9IFtdXG4gICAgICAgIGlmIChyZXBvLmxhbmd1YWdlKSB7XG4gICAgICAgICAgcmVwb0xhbmd1YWdlcy5wdXNoKHJlcG8ubGFuZ3VhZ2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXBvTmFtZTogcmVwby5uYW1lLFxuICAgICAgICAgIHJlcG9Vcmw6IHJlcG8uaHRtbF91cmwsXG4gICAgICAgICAgcmVwb093bmVyOiByZXBvLm93bmVyLmxvZ2luLFxuICAgICAgICAgIHJlcG9MYW5ndWFnZXMsXG4gICAgICAgICAgcmVwb0lzUHVibGljOiAhcmVwby5wcml2YXRlLFxuICAgICAgICAgIHJlcG9VcGRhdGVkQXQ6IHJlcG8udXBkYXRlZF9hdCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgUmVxdWVzdEVycm9yICYmIGUuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBpZiAoZSBpbnN0YW5jZW9mIFJlcXVlc3RFcnJvciAmJiBlLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgdGhyb3cgZVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHaXRodWJCcmFuY2hMaXN0KFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nLFxuICByZXBvVXJsOiBzdHJpbmdcbikge1xuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdCh7IGdpdGh1YkF1dGhUb2tlbjogYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmxpc3RCcmFuY2hlcyh7XG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBwZXJfcGFnZTogMTAwMCxcbiAgICBwYWdlOiAxLFxuICB9KVxuICByZXR1cm4gcmVzLmRhdGEubWFwKChicmFuY2gpID0+IGJyYW5jaC5uYW1lKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHVsbFJlcXVlc3Qob3B0aW9uczoge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4gIHRhcmdldEJyYW5jaE5hbWU6IHN0cmluZ1xuICBzb3VyY2VCcmFuY2hOYW1lOiBzdHJpbmdcbiAgdGl0bGU6IHN0cmluZ1xuICBib2R5OiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG59KSB7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKG9wdGlvbnMucmVwb1VybClcbiAgY29uc3Qgb2t0b0tpdCA9IGdldE9rdG9LaXQoeyBnaXRodWJBdXRoVG9rZW46IG9wdGlvbnMuYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LnB1bGxzLmNyZWF0ZSh7XG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICB0aXRsZTogb3B0aW9ucy50aXRsZSxcbiAgICBib2R5OiBvcHRpb25zLmJvZHksXG4gICAgaGVhZDogb3B0aW9ucy5zb3VyY2VCcmFuY2hOYW1lLFxuICAgIGJhc2U6IG9wdGlvbnMudGFyZ2V0QnJhbmNoTmFtZSxcbiAgICBkcmFmdDogZmFsc2UsXG4gICAgbWFpbnRhaW5lcl9jYW5fbW9kaWZ5OiB0cnVlLFxuICB9KVxuICByZXR1cm4gcmVzLmRhdGEubnVtYmVyXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3JrUmVwbyhvcHRpb25zOiB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG59KTogUHJvbWlzZTx7IHVybDogc3RyaW5nIHwgbnVsbCB9PiB7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG8gfSA9IHBhcnNlR2l0aHViT3duZXJBbmRSZXBvKG9wdGlvbnMucmVwb1VybClcbiAgY29uc3Qgb2t0b0tpdCA9IGdldE9rdG9LaXQoeyBnaXRodWJBdXRoVG9rZW46IG9wdGlvbnMuYWNjZXNzVG9rZW4gfSlcbiAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmNyZWF0ZUZvcmsoe1xuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgZGVmYXVsdF9icmFuY2hfb25seTogZmFsc2UsXG4gIH0pXG4gIHJldHVybiB7IHVybDogcmVzLmRhdGEuaHRtbF91cmwgPyBTdHJpbmcocmVzLmRhdGEuaHRtbF91cmwpIDogbnVsbCB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJlcG9zKG9rdG9LaXQ6IE9jdG9raXQpIHtcbiAgLy8gRm9yIG5vdyBsaW1pdCBpcyAxMDAobWF4aW11bSBzdXBwb3J0ZWQgYnkgZ2l0aHViKSBpZiB3ZSB3aWxsIG5lZWQgbW9yZSB3ZSBuZWVkIHRvIGltcGxlbWVudCBwYWdpbmF0aW9uICsgc2VhcmNoXG4gIGNvbnN0IHJlcyA9IGF3YWl0IG9rdG9LaXQucmVxdWVzdCgnR0VUIC91c2VyL3JlcG9zP3NvcnQ9dXBkYXRlZCcsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnWC1HaXRIdWItQXBpLVZlcnNpb24nOiAnMjAyMi0xMS0yOCcsXG4gICAgICBwZXJfcGFnZTogMTAwLFxuICAgIH0sXG4gIH0pXG4gIHJldHVybiByZXMuZGF0YVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0aHViUmVwb0RlZmF1bHRCcmFuY2goXG4gIHJlcG9Vcmw6IHN0cmluZyxcbiAgb3B0aW9ucz86IEFwaUF1dGhPcHRpb25zXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdChvcHRpb25zKVxuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhyZXBvVXJsKVxuICByZXR1cm4gKGF3YWl0IG9rdG9LaXQucmVzdC5yZXBvcy5nZXQoeyByZXBvLCBvd25lciB9KSkuZGF0YS5kZWZhdWx0X2JyYW5jaFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0aHViUmVmZXJlbmNlRGF0YShcbiAgeyByZWYsIGdpdEh1YlVybCB9OiB7IHJlZjogc3RyaW5nOyBnaXRIdWJVcmw6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhnaXRIdWJVcmwpXG4gIGxldCByZXNcbiAgdHJ5IHtcbiAgICBjb25zdCBva3RvS2l0ID0gZ2V0T2t0b0tpdChvcHRpb25zKVxuICAgIHJlcyA9IGF3YWl0IFByb21pc2UuYW55KFtcbiAgICAgIGdldEJyYW5jaCh7IG93bmVyLCByZXBvLCBicmFuY2g6IHJlZiB9LCBva3RvS2l0KS50aGVuKChyZXN1bHQpID0+ICh7XG4gICAgICAgIGRhdGU6IHJlc3VsdC5kYXRhLmNvbW1pdC5jb21taXQuY29tbWl0dGVyPy5kYXRlXG4gICAgICAgICAgPyBuZXcgRGF0ZShyZXN1bHQuZGF0YS5jb21taXQuY29tbWl0LmNvbW1pdHRlcj8uZGF0ZSlcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5CUkFOQ0gsXG4gICAgICAgIHNoYTogcmVzdWx0LmRhdGEuY29tbWl0LnNoYSxcbiAgICAgIH0pKSxcbiAgICAgIGdldENvbW1pdCh7IGNvbW1pdFNoYTogcmVmLCByZXBvLCBvd25lciB9LCBva3RvS2l0KS50aGVuKChjb21taXQpID0+ICh7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKGNvbW1pdC5kYXRhLmNvbW1pdHRlci5kYXRlKSxcbiAgICAgICAgdHlwZTogUmVmZXJlbmNlVHlwZS5DT01NSVQsXG4gICAgICAgIHNoYTogY29tbWl0LmRhdGEuc2hhLFxuICAgICAgfSkpLFxuICAgICAgZ2V0VGFnRGF0ZSh7IG93bmVyLCByZXBvLCB0YWc6IHJlZiB9LCBva3RvS2l0KS50aGVuKChkYXRhKSA9PiAoe1xuICAgICAgICBkYXRlOiBuZXcgRGF0ZShkYXRhLmRhdGUpLFxuICAgICAgICB0eXBlOiBSZWZlcmVuY2VUeXBlLlRBRyxcbiAgICAgICAgc2hhOiBkYXRhLnNoYSxcbiAgICAgIH0pKSxcbiAgICBdKVxuICAgIHJldHVybiByZXNcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGRpZCBub3QgZmluZCBhbnkgYnJhbmNoL3RhZy9jb21taXRcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZUVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgUmVmTm90Rm91bmRFcnJvcihgcmVmOiAke3JlZn0gZG9lcyBub3QgZXhpc3RgKVxuICAgIH1cbiAgICB0aHJvdyBlXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QnJhbmNoKFxuICB7IGJyYW5jaCwgb3duZXIsIHJlcG8gfTogeyBicmFuY2g6IHN0cmluZzsgb3duZXI6IHN0cmluZzsgcmVwbzogc3RyaW5nIH0sXG4gIG9rdG9LaXQ6IE9jdG9raXRcbikge1xuICByZXR1cm4gb2t0b0tpdC5yZXN0LnJlcG9zLmdldEJyYW5jaCh7XG4gICAgYnJhbmNoOiBicmFuY2gsXG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VGFnRGF0ZShcbiAgeyB0YWcsIG93bmVyLCByZXBvIH06IHsgdGFnOiBzdHJpbmc7IG93bmVyOiBzdHJpbmc7IHJlcG86IHN0cmluZyB9LFxuICBva3RvS2l0OiBPY3Rva2l0XG4pIHtcbiAgY29uc3QgcmVmUmVzcG9uc2UgPSBhd2FpdCBva3RvS2l0LnJlc3QuZ2l0LmdldFJlZih7XG4gICAgcmVmOiBgdGFncy8ke3RhZ31gLFxuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gIH0pXG4gIGNvbnN0IHRhZ1NoYSA9IHJlZlJlc3BvbnNlLmRhdGEub2JqZWN0LnNoYVxuICBpZiAocmVmUmVzcG9uc2UuZGF0YS5vYmplY3QudHlwZSA9PT0gJ2NvbW1pdCcpIHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBva3RvS2l0LnJlc3QuZ2l0LmdldENvbW1pdCh7XG4gICAgICBjb21taXRfc2hhOiB0YWdTaGEsXG4gICAgICBvd25lcixcbiAgICAgIHJlcG8sXG4gICAgfSlcbiAgICByZXR1cm4ge1xuICAgICAgZGF0ZTogcmVzLmRhdGEuY29tbWl0dGVyLmRhdGUsXG4gICAgICBzaGE6IHJlcy5kYXRhLnNoYSxcbiAgICB9XG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgb2t0b0tpdC5yZXN0LmdpdC5nZXRUYWcoe1xuICAgIHRhZ19zaGE6IHRhZ1NoYSxcbiAgICBvd25lcixcbiAgICByZXBvLFxuICB9KVxuICByZXR1cm4ge1xuICAgIGRhdGU6IHJlcy5kYXRhLnRhZ2dlci5kYXRlLFxuICAgIHNoYTogcmVzLmRhdGEuc2hhLFxuICB9XG59XG5hc3luYyBmdW5jdGlvbiBnZXRDb21taXQoXG4gIHtcbiAgICBjb21taXRTaGEsXG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgfTogeyBjb21taXRTaGE6IHN0cmluZzsgb3duZXI6IHN0cmluZzsgcmVwbzogc3RyaW5nIH0sXG4gIG9rdG9LaXQ6IE9jdG9raXRcbikge1xuICByZXR1cm4gb2t0b0tpdC5yZXN0LmdpdC5nZXRDb21taXQoe1xuICAgIHJlcG8sXG4gICAgb3duZXIsXG4gICAgY29tbWl0X3NoYTogY29tbWl0U2hhLFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHaXRodWJPd25lckFuZFJlcG8oZ2l0SHViVXJsOiBzdHJpbmcpOiB7XG4gIG93bmVyOiBzdHJpbmdcbiAgcmVwbzogc3RyaW5nXG59IHtcbiAgZ2l0SHViVXJsID0gcmVtb3ZlVHJhaWxpbmdTbGFzaChnaXRIdWJVcmwpXG4gIGNvbnN0IHBhcnNpbmdSZXN1bHQgPSBwYXJzZVNjbVVSTChnaXRIdWJVcmwsIFNjbVR5cGUuR2l0SHViKVxuICBpZiAoIXBhcnNpbmdSZXN1bHQgfHwgcGFyc2luZ1Jlc3VsdC5ob3N0bmFtZSAhPT0gJ2dpdGh1Yi5jb20nKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRVcmxQYXR0ZXJuRXJyb3IoYGludmFsaWQgZ2l0aHViIHJlcG8gVXJsICR7Z2l0SHViVXJsfWApXG4gIH1cbiAgY29uc3QgeyBvcmdhbml6YXRpb24sIHJlcG9OYW1lIH0gPSBwYXJzaW5nUmVzdWx0XG5cbiAgaWYgKCFvcmdhbml6YXRpb24gfHwgIXJlcG9OYW1lKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRVcmxQYXR0ZXJuRXJyb3IoYGludmFsaWQgZ2l0aHViIHJlcG8gVXJsICR7Z2l0SHViVXJsfWApXG4gIH1cblxuICByZXR1cm4geyBvd25lcjogb3JnYW5pemF0aW9uLCByZXBvOiByZXBvTmFtZSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBxdWVyeUdpdGh1YkdyYXBocWw8VD4oXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHZhcmlhYmxlcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB0b2tlbiA9IG9wdGlvbnM/LmdpdGh1YkF1dGhUb2tlbiA/PyBHSVRIVUJfQVBJX1RPS0VOID8/ICcnXG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB2YXJpYWJsZXMgPz8ge31cbiAgY29uc3QgYXV0aG9yaXphdGlvbkhlYWRlciA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBhdXRob3JpemF0aW9uOiBgYmVhcmVyICR7dG9rZW59YCxcbiAgICB9LFxuICB9XG4gIHRyeSB7XG4gICAgY29uc3Qgb2t0b0tpdCA9IGdldE9rdG9LaXQob3B0aW9ucylcbiAgICBjb25zdCByZXMgPSBhd2FpdCBva3RvS2l0LmdyYXBocWw8VD4ocXVlcnksIHtcbiAgICAgIC4uLnBhcmFtZXRlcnMsXG4gICAgICAuLi5hdXRob3JpemF0aW9uSGVhZGVyLFxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBSZXF1ZXN0RXJyb3IpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIHRocm93IGVcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R2l0aHViQmxhbWVSYW5nZXMoXG4gIHsgcmVmLCBnaXRIdWJVcmwsIHBhdGggfTogeyByZWY6IHN0cmluZzsgZ2l0SHViVXJsOiBzdHJpbmc7IHBhdGg6IHN0cmluZyB9LFxuICBvcHRpb25zPzogQXBpQXV0aE9wdGlvbnNcbikge1xuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhnaXRIdWJVcmwpXG5cbiAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgcGF0aCxcbiAgICByZWYsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgcXVlcnlHaXRodWJHcmFwaHFsPEdpdGh1YkJsYW1lUmVzcG9uc2U+KFxuICAgIEdldEJsYW1lRG9jdW1lbnQsXG4gICAgdmFyaWFibGVzLFxuICAgIG9wdGlvbnNcbiAgKVxuXG4gIGlmICghcmVzPy5yZXBvc2l0b3J5Py5vYmplY3Q/LmJsYW1lPy5yYW5nZXMpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIHJldHVybiByZXMucmVwb3NpdG9yeS5vYmplY3QuYmxhbWUucmFuZ2VzLm1hcCgocmFuZ2UpID0+ICh7XG4gICAgc3RhcnRpbmdMaW5lOiByYW5nZS5zdGFydGluZ0xpbmUsXG4gICAgZW5kaW5nTGluZTogcmFuZ2UuZW5kaW5nTGluZSxcbiAgICBlbWFpbDogcmFuZ2UuY29tbWl0LmF1dGhvci51c2VyPy5lbWFpbCB8fCAnJyxcbiAgICBuYW1lOiByYW5nZS5jb21taXQuYXV0aG9yLnVzZXI/Lm5hbWUgfHwgJycsXG4gICAgbG9naW46IHJhbmdlLmNvbW1pdC5hdXRob3IudXNlcj8ubG9naW4gfHwgJycsXG4gIH0pKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHIoXG4gIHtcbiAgICBzb3VyY2VSZXBvVXJsLFxuICAgIGZpbGVzUGF0aHMsXG4gICAgdXNlclJlcG9VcmwsXG4gICAgdGl0bGUsXG4gICAgYm9keSxcbiAgfToge1xuICAgIHNvdXJjZVJlcG9Vcmw6IHN0cmluZ1xuICAgIGZpbGVzUGF0aHM6IHN0cmluZ1tdXG4gICAgdXNlclJlcG9Vcmw6IHN0cmluZ1xuICAgIHRpdGxlOiBzdHJpbmdcbiAgICBib2R5OiBzdHJpbmdcbiAgfSxcbiAgb3B0aW9ucz86IEFwaUF1dGhPcHRpb25zXG4pIHtcbiAgY29uc3Qgb2t0b0tpdCA9IGdldE9rdG9LaXQob3B0aW9ucylcblxuICBjb25zdCB7IG93bmVyOiBzb3VyY2VPd25lciwgcmVwbzogc291cmNlUmVwbyB9ID1cbiAgICBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyhzb3VyY2VSZXBvVXJsKVxuICBjb25zdCB7IG93bmVyLCByZXBvIH0gPSBwYXJzZUdpdGh1Yk93bmVyQW5kUmVwbyh1c2VyUmVwb1VybClcblxuICBjb25zdCBbc291cmNlRmlsZVBhdGgsIHNlY29uZEZpbGVQYXRoXSA9IGZpbGVzUGF0aHNcblxuICBjb25zdCBzb3VyY2VGaWxlQ29udGVudFJlc3BvbnNlID0gYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmdldENvbnRlbnQoe1xuICAgIG93bmVyOiBzb3VyY2VPd25lcixcbiAgICByZXBvOiBzb3VyY2VSZXBvLFxuICAgIHBhdGg6ICcvJyArIHNvdXJjZUZpbGVQYXRoLFxuICB9KVxuXG4gIGNvbnN0IHsgZGF0YTogcmVwb3NpdG9yeSB9ID0gYXdhaXQgb2t0b0tpdC5yZXN0LnJlcG9zLmdldCh7IG93bmVyLCByZXBvIH0pXG4gIGNvbnN0IGRlZmF1bHRCcmFuY2ggPSByZXBvc2l0b3J5LmRlZmF1bHRfYnJhbmNoXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IGJyYW5jaFxuICBjb25zdCBuZXdCcmFuY2hOYW1lID0gYG1vYmIvd29ya2Zsb3ctJHtEYXRlLm5vdygpfWBcbiAgYXdhaXQgb2t0b0tpdC5yZXN0LmdpdC5jcmVhdGVSZWYoe1xuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgcmVmOiBgcmVmcy9oZWFkcy8ke25ld0JyYW5jaE5hbWV9YCxcbiAgICBzaGE6IGF3YWl0IG9rdG9LaXQucmVzdC5naXRcbiAgICAgIC5nZXRSZWYoeyBvd25lciwgcmVwbywgcmVmOiBgaGVhZHMvJHtkZWZhdWx0QnJhbmNofWAgfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuZGF0YS5vYmplY3Quc2hhKSxcbiAgfSlcbiAgY29uc3QgZGVjb2RlZENvbnRlbnQgPSBCdWZmZXIuZnJvbShcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNvdXJjZUZpbGVDb250ZW50UmVzcG9uc2UuZGF0YS5jb250ZW50LFxuICAgICdiYXNlNjQnXG4gICkudG9TdHJpbmcoJ3V0Zi04JylcblxuICBjb25zdCB0cmVlID0gW1xuICAgIHtcbiAgICAgIHBhdGg6IHNvdXJjZUZpbGVQYXRoLFxuICAgICAgbW9kZTogJzEwMDY0NCcsXG4gICAgICB0eXBlOiAnYmxvYicsXG4gICAgICBjb250ZW50OiBkZWNvZGVkQ29udGVudCxcbiAgICB9LFxuICBdXG5cbiAgaWYgKHNlY29uZEZpbGVQYXRoKSB7XG4gICAgY29uc3Qgc2Vjb25kRmlsZUNvbnRlbnRSZXNwb25zZSA9IGF3YWl0IG9rdG9LaXQucmVzdC5yZXBvcy5nZXRDb250ZW50KHtcbiAgICAgIG93bmVyOiBzb3VyY2VPd25lcixcbiAgICAgIHJlcG86IHNvdXJjZVJlcG8sXG4gICAgICBwYXRoOiAnLycgKyBzZWNvbmRGaWxlUGF0aCxcbiAgICB9KVxuICAgIGNvbnN0IHNlY29uZERlY29kZWRDb250ZW50ID0gQnVmZmVyLmZyb20oXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBzZWNvbmRGaWxlQ29udGVudFJlc3BvbnNlLmRhdGEuY29udGVudCxcbiAgICAgICdiYXNlNjQnXG4gICAgKS50b1N0cmluZygndXRmLTgnKVxuXG4gICAgdHJlZS5wdXNoKHtcbiAgICAgIHBhdGg6IHNlY29uZEZpbGVQYXRoLFxuICAgICAgbW9kZTogJzEwMDY0NCcsXG4gICAgICB0eXBlOiAnYmxvYicsXG4gICAgICBjb250ZW50OiBzZWNvbmREZWNvZGVkQ29udGVudCxcbiAgICB9KVxuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbmV3IGNvbW1pdCB3aXRoIHRoZSBmaWxlIGZyb20gdGhlIHNvdXJjZSByZXBvc2l0b3J5XG4gIGNvbnN0IGNyZWF0ZVRyZWVSZXNwb25zZSA9IGF3YWl0IG9rdG9LaXQucmVzdC5naXQuY3JlYXRlVHJlZSh7XG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBiYXNlX3RyZWU6IGF3YWl0IG9rdG9LaXQucmVzdC5naXRcbiAgICAgIC5nZXRSZWYoeyBvd25lciwgcmVwbywgcmVmOiBgaGVhZHMvJHtkZWZhdWx0QnJhbmNofWAgfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuZGF0YS5vYmplY3Quc2hhKSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRyZWUsXG4gIH0pXG5cbiAgY29uc3QgY3JlYXRlQ29tbWl0UmVzcG9uc2UgPSBhd2FpdCBva3RvS2l0LnJlc3QuZ2l0LmNyZWF0ZUNvbW1pdCh7XG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBtZXNzYWdlOiAnQWRkIG5ldyB5YW1sIGZpbGUnLFxuICAgIHRyZWU6IGNyZWF0ZVRyZWVSZXNwb25zZS5kYXRhLnNoYSxcbiAgICBwYXJlbnRzOiBbXG4gICAgICBhd2FpdCBva3RvS2l0LnJlc3QuZ2l0XG4gICAgICAgIC5nZXRSZWYoeyBvd25lciwgcmVwbywgcmVmOiBgaGVhZHMvJHtkZWZhdWx0QnJhbmNofWAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5kYXRhLm9iamVjdC5zaGEpLFxuICAgIF0sXG4gIH0pXG5cbiAgLy8gVXBkYXRlIHRoZSBicmFuY2ggcmVmZXJlbmNlIHRvIHBvaW50IHRvIHRoZSBuZXcgY29tbWl0XG4gIGF3YWl0IG9rdG9LaXQucmVzdC5naXQudXBkYXRlUmVmKHtcbiAgICBvd25lcixcbiAgICByZXBvLFxuICAgIHJlZjogYGhlYWRzLyR7bmV3QnJhbmNoTmFtZX1gLFxuICAgIHNoYTogY3JlYXRlQ29tbWl0UmVzcG9uc2UuZGF0YS5zaGEsXG4gIH0pXG5cbiAgLy8gQ3JlYXRlIHRoZSBQdWxsIFJlcXVlc3RcbiAgY29uc3QgY3JlYXRlUFJSZXNwb25zZSA9IGF3YWl0IG9rdG9LaXQucmVzdC5wdWxscy5jcmVhdGUoe1xuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgdGl0bGUsXG4gICAgaGVhZDogbmV3QnJhbmNoTmFtZSxcbiAgICBoZWFkX3JlcG86IHNvdXJjZVJlcG8sXG4gICAgYm9keSxcbiAgICBiYXNlOiBkZWZhdWx0QnJhbmNoLFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgcHVsbF9yZXF1ZXN0X3VybDogY3JlYXRlUFJSZXNwb25zZS5kYXRhLmh0bWxfdXJsLFxuICB9XG59XG4iXX0=