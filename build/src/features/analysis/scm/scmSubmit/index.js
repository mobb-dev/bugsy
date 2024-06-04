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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFixesToDifferentBranch = exports.submitFixesToSameBranch = exports.isValidBranchName = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const os_1 = __importDefault(require("os"));
const parse_diff_1 = __importDefault(require("parse-diff"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = require("simple-git");
const tmp_1 = __importDefault(require("tmp"));
const zod_1 = require("zod");
const scm_1 = require("../scm");
const types_1 = require("./types");
__exportStar(require("./types"), exports);
const APP_DIR_PREFIX = 'mobb';
const MOBB_COMMIT_PREFIX = 'mobb fix commit:';
const EnvVariablesZod = zod_1.z.object({
    BROKERED_HOSTS: zod_1.z
        .string()
        .toLowerCase()
        .transform((x) => x
        .split(',')
        .map((url) => url.trim(), [])
        .filter(Boolean))
        .default(''),
});
const { BROKERED_HOSTS } = EnvVariablesZod.parse(process.env);
const isValidBranchName = async (branchName) => {
    const git = (0, simple_git_1.simpleGit)();
    try {
        const res = await git.raw(['check-ref-format', '--branch', branchName]);
        if (res) {
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
};
exports.isValidBranchName = isValidBranchName;
const pushBranch = async (git, branchName, fixArray, response) => {
    try {
        await git.push('origin', branchName, ['--set-upstream']);
    }
    catch (e) {
        response.error = {
            type: 'PushBranchError',
            info: {
                message: 'Failed to push branch',
                pushBranchName: branchName,
            },
        };
        for (const submitBranch of response.submitBranches) {
            try {
                git.push(['origin', '--delete', submitBranch.branchName]);
            }
            catch (e) {
                //ignore
            }
        }
        return false;
    }
    response.submitBranches.push({
        branchName,
        fixes: fixArray,
    });
    return true;
};
const abortRebase = async (git) => {
    try {
        await git.rebase(['--abort']);
    }
    catch (e) {
        //ignore
    }
    await git.reset(['--hard', 'HEAD']);
};
const rebaseFix = async (params) => {
    const { git, branchName, baseCommitHash, commitMessage } = params;
    try {
        await git.rebase(['--onto', branchName, baseCommitHash, 'HEAD']);
        const message = zod_1.z.string().parse((await git.log(['-1'])).latest?.message);
        const [commitMessageHeader] = message.split('\n');
        //sometimes the rebase fails but the git command doesn't throw an error
        //so we need to check that the fix was actually rebased
        if (!commitMessageHeader?.includes(commitMessage)) {
            throw new scm_1.RebaseFailedError('rebase failed');
        }
    }
    catch (e) {
        throw new scm_1.RebaseFailedError(`rebasing ${baseCommitHash} with message ${commitMessage} failed `);
    }
};
const getCommitMessage = (fixId) => `${MOBB_COMMIT_PREFIX} ${fixId}`;
const fetchInitialCommit = async (params) => {
    const { git, reference, depth = 1, response } = params;
    try {
        await git.fetch([
            '--depth',
            `${depth}`,
            '--filter=blob:none',
            'origin',
            reference,
        ]);
    }
    catch (e) {
        response.error = {
            type: 'InitialRepoAccessError',
            info: {
                message: 'Failed to fetch commit from origin',
            },
        };
        return false;
    }
    return true;
};
//This function receives a message and applies the fixes to the repo.
//The message is receives includes fixes diff, the commit hash to apply the fixes to
//and the branch name to push the fixes to.
//It first fetches the commit from the origin and creates a new branch from it.
//Then it applies the fixes to the branch and pushes it to the origin.
//If there are multiple fixes with conflicting changes, it will create a
//new branch (ending with "-x" where x is the branch index) for each conflict it encounters.
//Each time a branch is pushed to the origin, the function adds the branch name and the
//fixes ids to the response message.
//If an error occurs, the function will add the error to the response message and
//delete the branch that failed to push from origin.
const FixesZ = zod_1.z
    .array(zod_1.z.object({ fixId: zod_1.z.string(), diff: zod_1.z.string() }))
    .nonempty();
async function initGit(params) {
    const { repoUrl, dirName, changedFiles } = params;
    const git = (0, simple_git_1.simpleGit)(dirName).outputHandler((bin, stdout, stderr) => {
        const errChunks = [];
        const outChunks = [];
        let isStdoutClosed = false;
        let isStderrClosed = false;
        stderr.on('data', (data) => errChunks.push(data.toString('utf8')));
        stdout.on('data', (data) => outChunks.push(data.toString('utf8')));
        function logData() {
            if (!isStderrClosed || !isStdoutClosed) {
                return;
            }
            const logObj = {
                bin,
                err: errChunks.join(''),
                out: outChunks.join(''),
            };
            console.log(JSON.stringify(logObj));
        }
        stderr.on('close', () => {
            isStderrClosed = true;
            logData();
        });
        stdout.on('close', () => {
            isStdoutClosed = true;
            logData();
        });
    });
    await git.init();
    await git.addConfig('user.email', 'git@mobb.ai');
    await git.addConfig('user.name', 'Mobb autofixer');
    let repoUrlParsed = null;
    // this block is used for unit tests only. URL starts from local directory
    try {
        repoUrlParsed = repoUrl ? new URL(repoUrl) : null;
    }
    catch (err) {
        console.log(`this block is used for unit tests only. URL ${repoUrl} starts from local directory`);
    }
    if (repoUrlParsed &&
        BROKERED_HOSTS.includes(`${repoUrlParsed.protocol?.toLowerCase()}//${repoUrlParsed.host?.toLowerCase()}`)) {
        await git.addConfig('http.sslVerify', 'false');
        await git.addConfig('http.proxy', process.env['GIT_PROXY_HOST'] || 'http://tinyproxy:8888');
        await git.addConfig('https.proxy', process.env['GIT_PROXY_HOST'] || 'http://tinyproxy:8888');
    }
    await git.addRemote('origin', repoUrl);
    await git.raw(['sparse-checkout', 'init', '--no-cone']);
    await git.raw(['sparse-checkout', 'set', '']);
    for (const file of changedFiles) {
        await git.raw(['sparse-checkout', 'add', file]);
    }
    return git;
}
function getListOfFilesFromDiffs(diffs) {
    const files = [];
    for (const diff of diffs) {
        const parsedDiff = (0, parse_diff_1.default)(diff);
        for (const file of parsedDiff) {
            if (file.from) {
                files.push(file.from);
            }
        }
    }
    return files;
}
const COMMIT_TO_SAME_BRNACH_FETCH_DEPTH = 10;
async function submitFixesToSameBranch(msg) {
    const { commitDescription, commitMessage } = msg;
    const response = {
        githubCommentId: msg.githubCommentId,
        submitBranches: [],
        submitFixRequestId: '',
        type: types_1.submitToScmMessageType.commitToSameBranch,
    };
    const tmpDir = tmp_1.default.dirSync({
        unsafeCleanup: true,
    });
    try {
        response.submitFixRequestId = msg.submitFixRequestId;
        const fixesParseRes = FixesZ.safeParse(msg.fixes);
        if (!fixesParseRes.success) {
            return response;
        }
        const fixes = fixesParseRes.data;
        const changedFiles = getListOfFilesFromDiffs(fixes.map((fix) => fix.diff));
        const dirName = tmpDir.name;
        const { branch: branchName, commitHash } = msg;
        const git = await initGit({ dirName, repoUrl: msg.repoUrl, changedFiles });
        if (!(await fetchInitialCommit({
            git,
            reference: branchName,
            response,
            depth: COMMIT_TO_SAME_BRNACH_FETCH_DEPTH,
        }))) {
            return response;
        }
        await git.checkout([commitHash]);
        await git.checkout(['-b', branchName, 'HEAD']);
        const [fix] = fixes;
        const fixTmpDir = await tmp_1.default.dirSync({ unsafeCleanup: true });
        try {
            await promises_1.default.writeFile(path_1.default.join(fixTmpDir.name, 'mobb.patch'), fix.diff);
            await git.applyPatch(path_1.default.join(fixTmpDir.name, 'mobb.patch'));
        }
        finally {
            fixTmpDir.removeCallback();
        }
        await git.add('.');
        await git.commit(`${commitMessage}-${fix.fixId}${commitDescription ? `\n\n${commitDescription}` : ''}`);
        await rebaseFix({
            git,
            branchName: `origin/${branchName}`,
            commitMessage,
            baseCommitHash: 'HEAD~1',
        });
        await git.branch(['-f', branchName, 'HEAD']);
        await git.checkout([branchName]);
        if (!(await pushBranch(git, branchName, [{ fixId: fix.fixId }], response))) {
            console.log('pushBranch failed');
            return response;
        }
        return response;
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error(`error submitting fixes: ${errorMessage}`);
        return {
            ...response,
            error: {
                type: 'PushBranchError',
                info: {
                    message: errorMessage,
                },
            },
        };
    }
    finally {
        tmpDir.removeCallback();
    }
}
exports.submitFixesToSameBranch = submitFixesToSameBranch;
const submitFixesToDifferentBranch = async (msg) => {
    const response = {
        submitBranches: [],
        submitFixRequestId: '',
        type: types_1.submitToScmMessageType.submitFixesForDifferentBranch,
    };
    const { commitHash } = msg;
    //create a new temp dir for the repo
    const tmpDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), APP_DIR_PREFIX));
    try {
        response.submitFixRequestId = msg.submitFixRequestId;
        let submitBranch = msg.submitBranch;
        const changedFiles = getListOfFilesFromDiffs(msg.fixes.map((fix) => fix.diff));
        const git = await initGit({
            dirName: tmpDir,
            repoUrl: msg.repoUrl,
            changedFiles,
        });
        if (!(await fetchInitialCommit({ git, reference: commitHash, response }))) {
            return response;
        }
        await git.checkout([commitHash]);
        await git.checkout(['-b', submitBranch, 'HEAD']);
        //create a new branch from the commit to apply the fixes on
        let branchIndex = 0;
        let fixArray = [];
        for (const fix of msg.fixes) {
            //for each fix, create a temp dir with the patch file and apply the patch on the input commit (hash)
            await git.checkout([msg.commitHash]);
            const fixTmpDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), `${APP_DIR_PREFIX}-fix-${fix.fixId}`));
            try {
                await promises_1.default.writeFile(path_1.default.join(fixTmpDir, 'mobb.patch'), fix.diff);
                await git.applyPatch(path_1.default.join(fixTmpDir, 'mobb.patch'));
            }
            finally {
                await promises_1.default.rm(fixTmpDir, { recursive: true });
            }
            //commit each fix on its own branch
            await git.add('.');
            const commitMessage = getCommitMessage(fix.fixId);
            await git.commit(commitMessage);
            await git.checkout(['-b', `mobb-fix-${fix.fixId}`, 'HEAD']);
            try {
                //rebase the fix branch on the branch we created from the input commit (the PR branch saved in branchName)
                await rebaseFix({
                    git,
                    branchName: submitBranch,
                    commitMessage,
                    baseCommitHash: msg.commitHash,
                });
                //if the rebase succeeded, push the fix id into the fix array that goes into the response
                fixArray.push({ fixId: fix.fixId });
                //move the PR branch to the new fix commit that was rebased on the PR branch
                await git.branch(['-f', submitBranch, 'HEAD']);
            }
            catch (e) {
                //sometimes rebase fails and leaves the repo in a bad state and sometimes it doesn't
                await abortRebase(git);
                //check if we encountered a first conflict as the current PR branch name matches the input branch name exactly
                if (msg.submitBranch === submitBranch) {
                    //move the current PR branch name to have a "-1" suffix
                    submitBranch = `${submitBranch}-1`;
                    await git.checkout([msg.submitBranch]);
                    await git.checkout(['-b', submitBranch, 'HEAD']);
                }
                //checkout the current PR branch
                await git.checkout([submitBranch]);
                //push the branch to the origin and add the branch name and the fixes ids to the response
                if (!(await pushBranch(git, submitBranch, fixArray, response))) {
                    return response;
                }
                fixArray = [];
                branchIndex++;
                //start a new branch for the next fixes in the input
                //create a new branch with the same name as the PR branch but with a "-x" suffix where x is the branch index
                submitBranch = `${msg.submitBranch}-${branchIndex + 1}`;
                await git.checkout([`mobb-fix-${fix.fixId}`]);
                await git.checkout(['-b', submitBranch, 'HEAD']);
                fixArray.push({ fixId: fix.fixId });
            }
            //checkout the current PR branch
            await git.checkout([submitBranch]);
            await git.reset(['--hard', 'HEAD']);
        }
        //push the branch to the origin and add the branch name and the fixes ids to the response
        if (!(await pushBranch(git, submitBranch, fixArray, response))) {
            return response;
        }
        fixArray = [];
        return response;
    }
    finally {
        await promises_1.default.rm(tmpDir, { recursive: true });
    }
};
exports.submitFixesToDifferentBranch = submitFixesToDifferentBranch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL3NjbVN1Ym1pdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdFQUFpQztBQUVqQyw0Q0FBbUI7QUFDbkIsNERBQWtDO0FBQ2xDLGdEQUF1QjtBQUN2QiwyQ0FBaUQ7QUFDakQsOENBQXFCO0FBQ3JCLDZCQUF1QjtBQUV2QixnQ0FBMEM7QUFDMUMsbUNBTWdCO0FBRWhCLDBDQUF1QjtBQUV2QixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUE7QUFDN0IsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUU3QyxNQUFNLGVBQWUsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQy9CLGNBQWMsRUFBRSxPQUFDO1NBQ2QsTUFBTSxFQUFFO1NBQ1IsV0FBVyxFQUFFO1NBQ2IsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDZixDQUFDO1NBQ0UsS0FBSyxDQUFDLEdBQUcsQ0FBQztTQUNWLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztTQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQ25CO1NBQ0EsT0FBTyxDQUFDLEVBQUUsQ0FBQztDQUNmLENBQUMsQ0FBQTtBQUVGLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUV0RCxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDNUQsTUFBTSxHQUFHLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDdkIsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtC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QUF5RjtRQUN6RixJQUFJLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO1lBQzlELE9BQU8sUUFBUSxDQUFBO1NBQ2hCO1FBQ0QsUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNiLE9BQU8sUUFBUSxDQUFBO0tBQ2hCO1lBQVM7UUFDUixNQUFNLGtCQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3pDO0FBQ0gsQ0FBQyxDQUFBO0FBakdZLFFBQUEsNEJBQTRCLGdDQWlHeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnbm9kZTpmcy9wcm9taXNlcydcblxuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHBhcnNlRGlmZiBmcm9tICdwYXJzZS1kaWZmJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFNpbXBsZUdpdCwgc2ltcGxlR2l0IH0gZnJvbSAnc2ltcGxlLWdpdCdcbmltcG9ydCB0bXAgZnJvbSAndG1wJ1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcblxuaW1wb3J0IHsgUmViYXNlRmFpbGVkRXJyb3IgfSBmcm9tICcuLi9zY20nXG5pbXBvcnQge1xuICBDb21taXRUb1NhbWVCcmFuY2hQYXJhbXMsXG4gIEZpeFJlc3BvbnNlQXJyYXksXG4gIFN1Ym1pdEZpeGVzUmVzcG9uc2VNZXNzYWdlLFxuICBTdWJtaXRGaXhlc1RvRGlmZmVyZW50QnJhbmNoUGFyYW1zLFxuICBzdWJtaXRUb1NjbU1lc3NhZ2VUeXBlLFxufSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBBUFBfRElSX1BSRUZJWCA9ICdtb2JiJ1xuY29uc3QgTU9CQl9DT01NSVRfUFJFRklYID0gJ21vYmIgZml4IGNvbW1pdDonXG5cbmNvbnN0IEVudlZhcmlhYmxlc1pvZCA9IHoub2JqZWN0KHtcbiAgQlJPS0VSRURfSE9TVFM6IHpcbiAgICAuc3RyaW5nKClcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmFuc2Zvcm0oKHgpID0+XG4gICAgICB4XG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoKHVybCkgPT4gdXJsLnRyaW0oKSwgW10pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICApXG4gICAgLmRlZmF1bHQoJycpLFxufSlcblxuY29uc3QgeyBCUk9LRVJFRF9IT1NUUyB9ID0gRW52VmFyaWFibGVzWm9kLnBhcnNlKHByb2Nlc3MuZW52KVxuXG5leHBvcnQgY29uc3QgaXNWYWxpZEJyYW5jaE5hbWUgPSBhc3luYyAoYnJhbmNoTmFtZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGdpdCA9IHNpbXBsZUdpdCgpXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZ2l0LnJhdyhbJ2NoZWNrLXJlZi1mb3JtYXQnLCAnLS1icmFuY2gnLCBicmFuY2hOYW1lXSlcbiAgICBpZiAocmVzKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IHB1c2hCcmFuY2ggPSBhc3luYyAoXG4gIGdpdDogU2ltcGxlR2l0LFxuICBicmFuY2hOYW1lOiBzdHJpbmcsXG4gIGZpeEFycmF5OiBGaXhSZXNwb25zZUFycmF5LFxuICByZXNwb25zZTogU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2VcbikgPT4ge1xuICB0cnkge1xuICAgIGF3YWl0IGdpdC5wdXNoKCdvcmlnaW4nLCBicmFuY2hOYW1lLCBbJy0tc2V0LXVwc3RyZWFtJ10pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXNwb25zZS5lcnJvciA9IHtcbiAgICAgIHR5cGU6ICdQdXNoQnJhbmNoRXJyb3InLFxuICAgICAgaW5mbzoge1xuICAgICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHB1c2ggYnJhbmNoJyxcbiAgICAgICAgcHVzaEJyYW5jaE5hbWU6IGJyYW5jaE5hbWUsXG4gICAgICB9LFxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHN1Ym1pdEJyYW5jaCBvZiByZXNwb25zZS5zdWJtaXRCcmFuY2hlcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZ2l0LnB1c2goWydvcmlnaW4nLCAnLS1kZWxldGUnLCBzdWJtaXRCcmFuY2guYnJhbmNoTmFtZV0pXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vaWdub3JlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJlc3BvbnNlLnN1Ym1pdEJyYW5jaGVzLnB1c2goe1xuICAgIGJyYW5jaE5hbWUsXG4gICAgZml4ZXM6IGZpeEFycmF5LFxuICB9KVxuICByZXR1cm4gdHJ1ZVxufVxuXG5jb25zdCBhYm9ydFJlYmFzZSA9IGFzeW5jIChnaXQ6IFNpbXBsZUdpdCkgPT4ge1xuICB0cnkge1xuICAgIGF3YWl0IGdpdC5yZWJhc2UoWyctLWFib3J0J10pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvL2lnbm9yZVxuICB9XG4gIGF3YWl0IGdpdC5yZXNldChbJy0taGFyZCcsICdIRUFEJ10pXG59XG5cbmNvbnN0IHJlYmFzZUZpeCA9IGFzeW5jIChwYXJhbXM6IHtcbiAgZ2l0OiBTaW1wbGVHaXRcbiAgYnJhbmNoTmFtZTogc3RyaW5nXG4gIGJhc2VDb21taXRIYXNoOiBzdHJpbmdcbiAgY29tbWl0TWVzc2FnZTogc3RyaW5nXG59KSA9PiB7XG4gIGNvbnN0IHsgZ2l0LCBicmFuY2hOYW1lLCBiYXNlQ29tbWl0SGFzaCwgY29tbWl0TWVzc2FnZSB9ID0gcGFyYW1zXG4gIHRyeSB7XG4gICAgYXdhaXQgZ2l0LnJlYmFzZShbJy0tb250bycsIGJyYW5jaE5hbWUsIGJhc2VDb21taXRIYXNoLCAnSEVBRCddKVxuICAgIGNvbnN0IG1lc3NhZ2UgPSB6LnN0cmluZygpLnBhcnNlKChhd2FpdCBnaXQubG9nKFsnLTEnXSkpLmxhdGVzdD8ubWVzc2FnZSlcbiAgICBjb25zdCBbY29tbWl0TWVzc2FnZUhlYWRlcl0gPSBtZXNzYWdlLnNwbGl0KCdcXG4nKVxuICAgIC8vc29tZXRpbWVzIHRoZSByZWJhc2UgZmFpbHMgYnV0IHRoZSBnaXQgY29tbWFuZCBkb2Vzbid0IHRocm93IGFuIGVycm9yXG4gICAgLy9zbyB3ZSBuZWVkIHRvIGNoZWNrIHRoYXQgdGhlIGZpeCB3YXMgYWN0dWFsbHkgcmViYXNlZFxuICAgIGlmICghY29tbWl0TWVzc2FnZUhlYWRlcj8uaW5jbHVkZXMoY29tbWl0TWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBSZWJhc2VGYWlsZWRFcnJvcigncmViYXNlIGZhaWxlZCcpXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IFJlYmFzZUZhaWxlZEVycm9yKFxuICAgICAgYHJlYmFzaW5nICR7YmFzZUNvbW1pdEhhc2h9IHdpdGggbWVzc2FnZSAke2NvbW1pdE1lc3NhZ2V9IGZhaWxlZCBgXG4gICAgKVxuICB9XG59XG5cbmNvbnN0IGdldENvbW1pdE1lc3NhZ2UgPSAoZml4SWQ6IHN0cmluZykgPT4gYCR7TU9CQl9DT01NSVRfUFJFRklYfSAke2ZpeElkfWBcblxuY29uc3QgZmV0Y2hJbml0aWFsQ29tbWl0ID0gYXN5bmMgKHBhcmFtczoge1xuICBnaXQ6IFNpbXBsZUdpdFxuICByZWZlcmVuY2U6IHN0cmluZ1xuICByZXNwb25zZTogU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2VcbiAgZGVwdGg/OiBudW1iZXJcbn0pID0+IHtcbiAgY29uc3QgeyBnaXQsIHJlZmVyZW5jZSwgZGVwdGggPSAxLCByZXNwb25zZSB9ID0gcGFyYW1zXG4gIHRyeSB7XG4gICAgYXdhaXQgZ2l0LmZldGNoKFtcbiAgICAgICctLWRlcHRoJyxcbiAgICAgIGAke2RlcHRofWAsXG4gICAgICAnLS1maWx0ZXI9YmxvYjpub25lJyxcbiAgICAgICdvcmlnaW4nLFxuICAgICAgcmVmZXJlbmNlLFxuICAgIF0pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXNwb25zZS5lcnJvciA9IHtcbiAgICAgIHR5cGU6ICdJbml0aWFsUmVwb0FjY2Vzc0Vycm9yJyxcbiAgICAgIGluZm86IHtcbiAgICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBmZXRjaCBjb21taXQgZnJvbSBvcmlnaW4nLFxuICAgICAgfSxcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuLy9UaGlzIGZ1bmN0aW9uIHJlY2VpdmVzIGEgbWVzc2FnZSBhbmQgYXBwbGllcyB0aGUgZml4ZXMgdG8gdGhlIHJlcG8uXG4vL1RoZSBtZXNzYWdlIGlzIHJlY2VpdmVzIGluY2x1ZGVzIGZpeGVzIGRpZmYsIHRoZSBjb21taXQgaGFzaCB0byBhcHBseSB0aGUgZml4ZXMgdG9cbi8vYW5kIHRoZSBicmFuY2ggbmFtZSB0byBwdXNoIHRoZSBmaXhlcyB0by5cblxuLy9JdCBmaXJzdCBmZXRjaGVzIHRoZSBjb21taXQgZnJvbSB0aGUgb3JpZ2luIGFuZCBjcmVhdGVzIGEgbmV3IGJyYW5jaCBmcm9tIGl0LlxuLy9UaGVuIGl0IGFwcGxpZXMgdGhlIGZpeGVzIHRvIHRoZSBicmFuY2ggYW5kIHB1c2hlcyBpdCB0byB0aGUgb3JpZ2luLlxuLy9JZiB0aGVyZSBhcmUgbXVsdGlwbGUgZml4ZXMgd2l0aCBjb25mbGljdGluZyBjaGFuZ2VzLCBpdCB3aWxsIGNyZWF0ZSBhXG4vL25ldyBicmFuY2ggKGVuZGluZyB3aXRoIFwiLXhcIiB3aGVyZSB4IGlzIHRoZSBicmFuY2ggaW5kZXgpIGZvciBlYWNoIGNvbmZsaWN0IGl0IGVuY291bnRlcnMuXG5cbi8vRWFjaCB0aW1lIGEgYnJhbmNoIGlzIHB1c2hlZCB0byB0aGUgb3JpZ2luLCB0aGUgZnVuY3Rpb24gYWRkcyB0aGUgYnJhbmNoIG5hbWUgYW5kIHRoZVxuLy9maXhlcyBpZHMgdG8gdGhlIHJlc3BvbnNlIG1lc3NhZ2UuXG5cbi8vSWYgYW4gZXJyb3Igb2NjdXJzLCB0aGUgZnVuY3Rpb24gd2lsbCBhZGQgdGhlIGVycm9yIHRvIHRoZSByZXNwb25zZSBtZXNzYWdlIGFuZFxuLy9kZWxldGUgdGhlIGJyYW5jaCB0aGF0IGZhaWxlZCB0byBwdXNoIGZyb20gb3JpZ2luLlxuXG5jb25zdCBGaXhlc1ogPSB6XG4gIC5hcnJheSh6Lm9iamVjdCh7IGZpeElkOiB6LnN0cmluZygpLCBkaWZmOiB6LnN0cmluZygpIH0pKVxuICAubm9uZW1wdHkoKVxuXG5hc3luYyBmdW5jdGlvbiBpbml0R2l0KHBhcmFtczoge1xuICBkaXJOYW1lOiBzdHJpbmdcbiAgcmVwb1VybDogc3RyaW5nXG4gIGNoYW5nZWRGaWxlczogc3RyaW5nW11cbn0pIHtcbiAgY29uc3QgeyByZXBvVXJsLCBkaXJOYW1lLCBjaGFuZ2VkRmlsZXMgfSA9IHBhcmFtc1xuICBjb25zdCBnaXQgPSBzaW1wbGVHaXQoZGlyTmFtZSkub3V0cHV0SGFuZGxlcigoYmluLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgIGNvbnN0IGVyckNodW5rczogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IG91dENodW5rczogc3RyaW5nW10gPSBbXVxuICAgIGxldCBpc1N0ZG91dENsb3NlZCA9IGZhbHNlXG4gICAgbGV0IGlzU3RkZXJyQ2xvc2VkID0gZmFsc2VcbiAgICBzdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4gZXJyQ2h1bmtzLnB1c2goZGF0YS50b1N0cmluZygndXRmOCcpKSlcbiAgICBzdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4gb3V0Q2h1bmtzLnB1c2goZGF0YS50b1N0cmluZygndXRmOCcpKSlcblxuICAgIGZ1bmN0aW9uIGxvZ0RhdGEoKSB7XG4gICAgICBpZiAoIWlzU3RkZXJyQ2xvc2VkIHx8ICFpc1N0ZG91dENsb3NlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGxvZ09iaiA9IHtcbiAgICAgICAgYmluLFxuICAgICAgICBlcnI6IGVyckNodW5rcy5qb2luKCcnKSxcbiAgICAgICAgb3V0OiBvdXRDaHVua3Muam9pbignJyksXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShsb2dPYmopKVxuICAgIH1cblxuICAgIHN0ZGVyci5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICBpc1N0ZGVyckNsb3NlZCA9IHRydWVcbiAgICAgIGxvZ0RhdGEoKVxuICAgIH0pXG4gICAgc3Rkb3V0Lm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIGlzU3Rkb3V0Q2xvc2VkID0gdHJ1ZVxuICAgICAgbG9nRGF0YSgpXG4gICAgfSlcbiAgfSlcbiAgYXdhaXQgZ2l0LmluaXQoKVxuICBhd2FpdCBnaXQuYWRkQ29uZmlnKCd1c2VyLmVtYWlsJywgJ2dpdEBtb2JiLmFpJylcbiAgYXdhaXQgZ2l0LmFkZENvbmZpZygndXNlci5uYW1lJywgJ01vYmIgYXV0b2ZpeGVyJylcblxuICBsZXQgcmVwb1VybFBhcnNlZCA9IG51bGxcbiAgLy8gdGhpcyBibG9jayBpcyB1c2VkIGZvciB1bml0IHRlc3RzIG9ubHkuIFVSTCBzdGFydHMgZnJvbSBsb2NhbCBkaXJlY3RvcnlcbiAgdHJ5IHtcbiAgICByZXBvVXJsUGFyc2VkID0gcmVwb1VybCA/IG5ldyBVUkwocmVwb1VybCkgOiBudWxsXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYHRoaXMgYmxvY2sgaXMgdXNlZCBmb3IgdW5pdCB0ZXN0cyBvbmx5LiBVUkwgJHtyZXBvVXJsfSBzdGFydHMgZnJvbSBsb2NhbCBkaXJlY3RvcnlgXG4gICAgKVxuICB9XG5cbiAgaWYgKFxuICAgIHJlcG9VcmxQYXJzZWQgJiZcbiAgICBCUk9LRVJFRF9IT1NUUy5pbmNsdWRlcyhcbiAgICAgIGAke3JlcG9VcmxQYXJzZWQucHJvdG9jb2w/LnRvTG93ZXJDYXNlKCl9Ly8ke3JlcG9VcmxQYXJzZWQuaG9zdD8udG9Mb3dlckNhc2UoKX1gXG4gICAgKVxuICApIHtcbiAgICBhd2FpdCBnaXQuYWRkQ29uZmlnKCdodHRwLnNzbFZlcmlmeScsICdmYWxzZScpXG5cbiAgICBhd2FpdCBnaXQuYWRkQ29uZmlnKFxuICAgICAgJ2h0dHAucHJveHknLFxuICAgICAgcHJvY2Vzcy5lbnZbJ0dJVF9QUk9YWV9IT1NUJ10gfHwgJ2h0dHA6Ly90aW55cHJveHk6ODg4OCdcbiAgICApXG4gICAgYXdhaXQgZ2l0LmFkZENvbmZpZyhcbiAgICAgICdodHRwcy5wcm94eScsXG4gICAgICBwcm9jZXNzLmVudlsnR0lUX1BST1hZX0hPU1QnXSB8fCAnaHR0cDovL3Rpbnlwcm94eTo4ODg4J1xuICAgIClcbiAgfVxuICBhd2FpdCBnaXQuYWRkUmVtb3RlKCdvcmlnaW4nLCByZXBvVXJsKVxuXG4gIGF3YWl0IGdpdC5yYXcoWydzcGFyc2UtY2hlY2tvdXQnLCAnaW5pdCcsICctLW5vLWNvbmUnXSlcbiAgYXdhaXQgZ2l0LnJhdyhbJ3NwYXJzZS1jaGVja291dCcsICdzZXQnLCAnJ10pXG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGNoYW5nZWRGaWxlcykge1xuICAgIGF3YWl0IGdpdC5yYXcoWydzcGFyc2UtY2hlY2tvdXQnLCAnYWRkJywgZmlsZV0pXG4gIH1cblxuICByZXR1cm4gZ2l0XG59XG5cbmZ1bmN0aW9uIGdldExpc3RPZkZpbGVzRnJvbURpZmZzKGRpZmZzOiBzdHJpbmdbXSkge1xuICBjb25zdCBmaWxlcyA9IFtdXG4gIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgIGNvbnN0IHBhcnNlZERpZmYgPSBwYXJzZURpZmYoZGlmZilcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcGFyc2VkRGlmZikge1xuICAgICAgaWYgKGZpbGUuZnJvbSkge1xuICAgICAgICBmaWxlcy5wdXNoKGZpbGUuZnJvbSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpbGVzXG59XG5cbmNvbnN0IENPTU1JVF9UT19TQU1FX0JSTkFDSF9GRVRDSF9ERVBUSCA9IDEwXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRGaXhlc1RvU2FtZUJyYW5jaChcbiAgbXNnOiBPbWl0PENvbW1pdFRvU2FtZUJyYW5jaFBhcmFtcywgJ3R5cGUnPlxuKTogUHJvbWlzZTxTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZT4ge1xuICBjb25zdCB7IGNvbW1pdERlc2NyaXB0aW9uLCBjb21taXRNZXNzYWdlIH0gPSBtc2dcbiAgY29uc3QgcmVzcG9uc2U6IFN1Ym1pdEZpeGVzUmVzcG9uc2VNZXNzYWdlID0ge1xuICAgIGdpdGh1YkNvbW1lbnRJZDogbXNnLmdpdGh1YkNvbW1lbnRJZCxcbiAgICBzdWJtaXRCcmFuY2hlczogW10sXG4gICAgc3VibWl0Rml4UmVxdWVzdElkOiAnJyxcbiAgICB0eXBlOiBzdWJtaXRUb1NjbU1lc3NhZ2VUeXBlLmNvbW1pdFRvU2FtZUJyYW5jaCxcbiAgfVxuXG4gIGNvbnN0IHRtcERpciA9IHRtcC5kaXJTeW5jKHtcbiAgICB1bnNhZmVDbGVhbnVwOiB0cnVlLFxuICB9KVxuICB0cnkge1xuICAgIHJlc3BvbnNlLnN1Ym1pdEZpeFJlcXVlc3RJZCA9IG1zZy5zdWJtaXRGaXhSZXF1ZXN0SWRcbiAgICBjb25zdCBmaXhlc1BhcnNlUmVzID0gRml4ZXNaLnNhZmVQYXJzZShtc2cuZml4ZXMpXG4gICAgaWYgKCFmaXhlc1BhcnNlUmVzLnN1Y2Nlc3MpIHtcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cblxuICAgIGNvbnN0IGZpeGVzID0gZml4ZXNQYXJzZVJlcy5kYXRhXG4gICAgY29uc3QgY2hhbmdlZEZpbGVzID0gZ2V0TGlzdE9mRmlsZXNGcm9tRGlmZnMoZml4ZXMubWFwKChmaXgpID0+IGZpeC5kaWZmKSlcbiAgICBjb25zdCBkaXJOYW1lID0gdG1wRGlyLm5hbWVcbiAgICBjb25zdCB7IGJyYW5jaDogYnJhbmNoTmFtZSwgY29tbWl0SGFzaCB9ID0gbXNnXG4gICAgY29uc3QgZ2l0ID0gYXdhaXQgaW5pdEdpdCh7IGRpck5hbWUsIHJlcG9Vcmw6IG1zZy5yZXBvVXJsLCBjaGFuZ2VkRmlsZXMgfSlcbiAgICBpZiAoXG4gICAgICAhKGF3YWl0IGZldGNoSW5pdGlhbENvbW1pdCh7XG4gICAgICAgIGdpdCxcbiAgICAgICAgcmVmZXJlbmNlOiBicmFuY2hOYW1lLFxuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgZGVwdGg6IENPTU1JVF9UT19TQU1FX0JSTkFDSF9GRVRDSF9ERVBUSCxcbiAgICAgIH0pKVxuICAgICkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuICAgIGF3YWl0IGdpdC5jaGVja291dChbY29tbWl0SGFzaF0pXG4gICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFsnLWInLCBicmFuY2hOYW1lLCAnSEVBRCddKVxuXG4gICAgY29uc3QgW2ZpeF0gPSBmaXhlc1xuICAgIGNvbnN0IGZpeFRtcERpciA9IGF3YWl0IHRtcC5kaXJTeW5jKHsgdW5zYWZlQ2xlYW51cDogdHJ1ZSB9KVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKGZpeFRtcERpci5uYW1lLCAnbW9iYi5wYXRjaCcpLCBmaXguZGlmZilcbiAgICAgIGF3YWl0IGdpdC5hcHBseVBhdGNoKHBhdGguam9pbihmaXhUbXBEaXIubmFtZSwgJ21vYmIucGF0Y2gnKSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZml4VG1wRGlyLnJlbW92ZUNhbGxiYWNrKClcbiAgICB9XG5cbiAgICBhd2FpdCBnaXQuYWRkKCcuJylcbiAgICBhd2FpdCBnaXQuY29tbWl0KFxuICAgICAgYCR7Y29tbWl0TWVzc2FnZX0tJHtmaXguZml4SWR9JHtcbiAgICAgICAgY29tbWl0RGVzY3JpcHRpb24gPyBgXFxuXFxuJHtjb21taXREZXNjcmlwdGlvbn1gIDogJydcbiAgICAgIH1gXG4gICAgKVxuXG4gICAgYXdhaXQgcmViYXNlRml4KHtcbiAgICAgIGdpdCxcbiAgICAgIGJyYW5jaE5hbWU6IGBvcmlnaW4vJHticmFuY2hOYW1lfWAsXG4gICAgICBjb21taXRNZXNzYWdlLFxuICAgICAgYmFzZUNvbW1pdEhhc2g6ICdIRUFEfjEnLFxuICAgIH0pXG4gICAgYXdhaXQgZ2l0LmJyYW5jaChbJy1mJywgYnJhbmNoTmFtZSwgJ0hFQUQnXSlcbiAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW2JyYW5jaE5hbWVdKVxuICAgIGlmIChcbiAgICAgICEoYXdhaXQgcHVzaEJyYW5jaChnaXQsIGJyYW5jaE5hbWUsIFt7IGZpeElkOiBmaXguZml4SWQgfV0sIHJlc3BvbnNlKSlcbiAgICApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwdXNoQnJhbmNoIGZhaWxlZCcpXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcidcbiAgICBjb25zb2xlLmVycm9yKGBlcnJvciBzdWJtaXR0aW5nIGZpeGVzOiAke2Vycm9yTWVzc2FnZX1gKVxuICAgIHJldHVybiB7XG4gICAgICAuLi5yZXNwb25zZSxcbiAgICAgIGVycm9yOiB7XG4gICAgICAgIHR5cGU6ICdQdXNoQnJhbmNoRXJyb3InLFxuICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgdG1wRGlyLnJlbW92ZUNhbGxiYWNrKClcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3VibWl0Rml4ZXNUb0RpZmZlcmVudEJyYW5jaCA9IGFzeW5jIChcbiAgbXNnOiBPbWl0PFN1Ym1pdEZpeGVzVG9EaWZmZXJlbnRCcmFuY2hQYXJhbXMsICd0eXBlJz5cbikgPT4ge1xuICBjb25zdCByZXNwb25zZTogU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2UgPSB7XG4gICAgc3VibWl0QnJhbmNoZXM6IFtdLFxuICAgIHN1Ym1pdEZpeFJlcXVlc3RJZDogJycsXG4gICAgdHlwZTogc3VibWl0VG9TY21NZXNzYWdlVHlwZS5zdWJtaXRGaXhlc0ZvckRpZmZlcmVudEJyYW5jaCxcbiAgfVxuICBjb25zdCB7IGNvbW1pdEhhc2ggfSA9IG1zZ1xuICAvL2NyZWF0ZSBhIG5ldyB0ZW1wIGRpciBmb3IgdGhlIHJlcG9cbiAgY29uc3QgdG1wRGlyID0gYXdhaXQgZnMubWtkdGVtcChwYXRoLmpvaW4ob3MudG1wZGlyKCksIEFQUF9ESVJfUFJFRklYKSlcbiAgdHJ5IHtcbiAgICByZXNwb25zZS5zdWJtaXRGaXhSZXF1ZXN0SWQgPSBtc2cuc3VibWl0Rml4UmVxdWVzdElkXG4gICAgbGV0IHN1Ym1pdEJyYW5jaCA9IG1zZy5zdWJtaXRCcmFuY2hcbiAgICBjb25zdCBjaGFuZ2VkRmlsZXMgPSBnZXRMaXN0T2ZGaWxlc0Zyb21EaWZmcyhcbiAgICAgIG1zZy5maXhlcy5tYXAoKGZpeCkgPT4gZml4LmRpZmYpXG4gICAgKVxuICAgIGNvbnN0IGdpdCA9IGF3YWl0IGluaXRHaXQoe1xuICAgICAgZGlyTmFtZTogdG1wRGlyLFxuICAgICAgcmVwb1VybDogbXNnLnJlcG9VcmwsXG4gICAgICBjaGFuZ2VkRmlsZXMsXG4gICAgfSlcbiAgICBpZiAoIShhd2FpdCBmZXRjaEluaXRpYWxDb21taXQoeyBnaXQsIHJlZmVyZW5jZTogY29tbWl0SGFzaCwgcmVzcG9uc2UgfSkpKSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG4gICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFtjb21taXRIYXNoXSlcbiAgICBhd2FpdCBnaXQuY2hlY2tvdXQoWyctYicsIHN1Ym1pdEJyYW5jaCwgJ0hFQUQnXSlcbiAgICAvL2NyZWF0ZSBhIG5ldyBicmFuY2ggZnJvbSB0aGUgY29tbWl0IHRvIGFwcGx5IHRoZSBmaXhlcyBvblxuICAgIGxldCBicmFuY2hJbmRleCA9IDBcbiAgICBsZXQgZml4QXJyYXk6IEZpeFJlc3BvbnNlQXJyYXkgPSBbXVxuICAgIGZvciAoY29uc3QgZml4IG9mIG1zZy5maXhlcykge1xuICAgICAgLy9mb3IgZWFjaCBmaXgsIGNyZWF0ZSBhIHRlbXAgZGlyIHdpdGggdGhlIHBhdGNoIGZpbGUgYW5kIGFwcGx5IHRoZSBwYXRjaCBvbiB0aGUgaW5wdXQgY29tbWl0IChoYXNoKVxuICAgICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFttc2cuY29tbWl0SGFzaF0pXG4gICAgICBjb25zdCBmaXhUbXBEaXIgPSBhd2FpdCBmcy5ta2R0ZW1wKFxuICAgICAgICBwYXRoLmpvaW4ob3MudG1wZGlyKCksIGAke0FQUF9ESVJfUFJFRklYfS1maXgtJHtmaXguZml4SWR9YClcbiAgICAgIClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZzLndyaXRlRmlsZShwYXRoLmpvaW4oZml4VG1wRGlyLCAnbW9iYi5wYXRjaCcpLCBmaXguZGlmZilcbiAgICAgICAgYXdhaXQgZ2l0LmFwcGx5UGF0Y2gocGF0aC5qb2luKGZpeFRtcERpciwgJ21vYmIucGF0Y2gnKSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGF3YWl0IGZzLnJtKGZpeFRtcERpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgICAgIH1cbiAgICAgIC8vY29tbWl0IGVhY2ggZml4IG9uIGl0cyBvd24gYnJhbmNoXG4gICAgICBhd2FpdCBnaXQuYWRkKCcuJylcbiAgICAgIGNvbnN0IGNvbW1pdE1lc3NhZ2UgPSBnZXRDb21taXRNZXNzYWdlKGZpeC5maXhJZClcbiAgICAgIGF3YWl0IGdpdC5jb21taXQoY29tbWl0TWVzc2FnZSlcbiAgICAgIGF3YWl0IGdpdC5jaGVja291dChbJy1iJywgYG1vYmItZml4LSR7Zml4LmZpeElkfWAsICdIRUFEJ10pXG4gICAgICB0cnkge1xuICAgICAgICAvL3JlYmFzZSB0aGUgZml4IGJyYW5jaCBvbiB0aGUgYnJhbmNoIHdlIGNyZWF0ZWQgZnJvbSB0aGUgaW5wdXQgY29tbWl0ICh0aGUgUFIgYnJhbmNoIHNhdmVkIGluIGJyYW5jaE5hbWUpXG4gICAgICAgIGF3YWl0IHJlYmFzZUZpeCh7XG4gICAgICAgICAgZ2l0LFxuICAgICAgICAgIGJyYW5jaE5hbWU6IHN1Ym1pdEJyYW5jaCxcbiAgICAgICAgICBjb21taXRNZXNzYWdlLFxuICAgICAgICAgIGJhc2VDb21taXRIYXNoOiBtc2cuY29tbWl0SGFzaCxcbiAgICAgICAgfSlcbiAgICAgICAgLy9pZiB0aGUgcmViYXNlIHN1Y2NlZWRlZCwgcHVzaCB0aGUgZml4IGlkIGludG8gdGhlIGZpeCBhcnJheSB0aGF0IGdvZXMgaW50byB0aGUgcmVzcG9uc2VcbiAgICAgICAgZml4QXJyYXkucHVzaCh7IGZpeElkOiBmaXguZml4SWQgfSlcbiAgICAgICAgLy9tb3ZlIHRoZSBQUiBicmFuY2ggdG8gdGhlIG5ldyBmaXggY29tbWl0IHRoYXQgd2FzIHJlYmFzZWQgb24gdGhlIFBSIGJyYW5jaFxuICAgICAgICBhd2FpdCBnaXQuYnJhbmNoKFsnLWYnLCBzdWJtaXRCcmFuY2gsICdIRUFEJ10pXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vc29tZXRpbWVzIHJlYmFzZSBmYWlscyBhbmQgbGVhdmVzIHRoZSByZXBvIGluIGEgYmFkIHN0YXRlIGFuZCBzb21ldGltZXMgaXQgZG9lc24ndFxuICAgICAgICBhd2FpdCBhYm9ydFJlYmFzZShnaXQpXG4gICAgICAgIC8vY2hlY2sgaWYgd2UgZW5jb3VudGVyZWQgYSBmaXJzdCBjb25mbGljdCBhcyB0aGUgY3VycmVudCBQUiBicmFuY2ggbmFtZSBtYXRjaGVzIHRoZSBpbnB1dCBicmFuY2ggbmFtZSBleGFjdGx5XG4gICAgICAgIGlmIChtc2cuc3VibWl0QnJhbmNoID09PSBzdWJtaXRCcmFuY2gpIHtcbiAgICAgICAgICAvL21vdmUgdGhlIGN1cnJlbnQgUFIgYnJhbmNoIG5hbWUgdG8gaGF2ZSBhIFwiLTFcIiBzdWZmaXhcbiAgICAgICAgICBzdWJtaXRCcmFuY2ggPSBgJHtzdWJtaXRCcmFuY2h9LTFgXG4gICAgICAgICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFttc2cuc3VibWl0QnJhbmNoXSlcbiAgICAgICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoWyctYicsIHN1Ym1pdEJyYW5jaCwgJ0hFQUQnXSlcbiAgICAgICAgfVxuICAgICAgICAvL2NoZWNrb3V0IHRoZSBjdXJyZW50IFBSIGJyYW5jaFxuICAgICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW3N1Ym1pdEJyYW5jaF0pXG4gICAgICAgIC8vcHVzaCB0aGUgYnJhbmNoIHRvIHRoZSBvcmlnaW4gYW5kIGFkZCB0aGUgYnJhbmNoIG5hbWUgYW5kIHRoZSBmaXhlcyBpZHMgdG8gdGhlIHJlc3BvbnNlXG4gICAgICAgIGlmICghKGF3YWl0IHB1c2hCcmFuY2goZ2l0LCBzdWJtaXRCcmFuY2gsIGZpeEFycmF5LCByZXNwb25zZSkpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgIH1cbiAgICAgICAgZml4QXJyYXkgPSBbXVxuICAgICAgICBicmFuY2hJbmRleCsrXG4gICAgICAgIC8vc3RhcnQgYSBuZXcgYnJhbmNoIGZvciB0aGUgbmV4dCBmaXhlcyBpbiB0aGUgaW5wdXRcbiAgICAgICAgLy9jcmVhdGUgYSBuZXcgYnJhbmNoIHdpdGggdGhlIHNhbWUgbmFtZSBhcyB0aGUgUFIgYnJhbmNoIGJ1dCB3aXRoIGEgXCIteFwiIHN1ZmZpeCB3aGVyZSB4IGlzIHRoZSBicmFuY2ggaW5kZXhcbiAgICAgICAgc3VibWl0QnJhbmNoID0gYCR7bXNnLnN1Ym1pdEJyYW5jaH0tJHticmFuY2hJbmRleCArIDF9YFxuICAgICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW2Btb2JiLWZpeC0ke2ZpeC5maXhJZH1gXSlcbiAgICAgICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFsnLWInLCBzdWJtaXRCcmFuY2gsICdIRUFEJ10pXG4gICAgICAgIGZpeEFycmF5LnB1c2goeyBmaXhJZDogZml4LmZpeElkIH0pXG4gICAgICB9XG4gICAgICAvL2NoZWNrb3V0IHRoZSBjdXJyZW50IFBSIGJyYW5jaFxuICAgICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFtzdWJtaXRCcmFuY2hdKVxuICAgICAgYXdhaXQgZ2l0LnJlc2V0KFsnLS1oYXJkJywgJ0hFQUQnXSlcbiAgICB9XG4gICAgLy9wdXNoIHRoZSBicmFuY2ggdG8gdGhlIG9yaWdpbiBhbmQgYWRkIHRoZSBicmFuY2ggbmFtZSBhbmQgdGhlIGZpeGVzIGlkcyB0byB0aGUgcmVzcG9uc2VcbiAgICBpZiAoIShhd2FpdCBwdXNoQnJhbmNoKGdpdCwgc3VibWl0QnJhbmNoLCBmaXhBcnJheSwgcmVzcG9uc2UpKSkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuICAgIGZpeEFycmF5ID0gW11cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBmcy5ybSh0bXBEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gIH1cbn1cbiJdfQ==