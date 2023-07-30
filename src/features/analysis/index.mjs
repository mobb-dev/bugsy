import chalk from 'chalk';
import Configstore from 'configstore';
import Debug from 'debug';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';
import semver from 'semver';
import { callbackServer } from './callback-server.mjs';
import tmp from 'tmp';

import { WEB_APP_URL } from '../../constants.mjs';
import { canReachRepo, downloadRepo, getDefaultBranch } from './github.mjs';
import { GQLClient } from './gql.mjs';
import { githubIntegrationPrompt, mobbAnalysisPrompt } from './prompts.mjs';
import { getSnykReport } from './snyk.mjs';
import { uploadFile } from './upload-file.mjs';
import { keypress, Spinner, CliError } from '../../utils.mjs';
import { pack } from './pack.mjs';
import { getGitInfo } from './git.mjs';

const webLoginUrl = `${WEB_APP_URL}/cli-login`;
const githubSubmitUrl = `${WEB_APP_URL}/gh-callback`;
const githubAuthUrl = `${WEB_APP_URL}/github-auth`;

const MOBB_LOGIN_REQUIRED_MSG = `🔓 Login to Mobb is Required, you will be redirected to our login page, once the authorization is complete return to this prompt, ${chalk.bgBlue(
    'press any key to continue'
)};`;
const tmpObj = tmp.dirSync({
    unsafeCleanup: true,
});

const debug = Debug('mobbdev:index');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')
);

if (!semver.satisfies(process.version, packageJson.engines.node)) {
    throw new CliError(
        `${packageJson.name} requires node version ${packageJson.engines.node}, but running ${process.version}.`
    );
}

const config = new Configstore(packageJson.name, { token: '' });
debug('config %o', config);

export async function runAnalysis(
    { repo, scanner, scanFile, apiKey, ci, commitHash, srcPath, ref },
    options
) {
    try {
        await _scan(
            {
                dirname: tmpObj.name,
                repo,
                scanner,
                scanFile,
                ref,
                apiKey,
                ci,
                srcPath,
                commitHash,
            },
            options
        );
    } finally {
        tmpObj.removeCallback();
    }
}

export async function _scan(
    { dirname, repo, scanFile, branch, apiKey, ci, srcPath, commitHash, ref },
    { skipPrompts = false } = {}
) {
    debug('start %s %s', dirname, repo);
    const { createSpinner } = Spinner({ ci });
    skipPrompts = skipPrompts || ci;
    let token = config.get('token');
    debug('token %s', token);
    apiKey ?? debug('token %s', apiKey);
    let gqlClient = new GQLClient(apiKey ? { apiKey } : { token });
    await handleMobbLogin();
    const { projectId, organizationId } = await gqlClient.getOrgAndProjectId();
    const uploadData = await gqlClient.uploadS3BucketInfo();
    let reportPath = scanFile;

    if (srcPath) {
        return await uploadExistingRepo();
    }

    const userInfo = await gqlClient.getUserInfo();
    let { githubToken } = userInfo;
    const isRepoAvailable = await canReachRepo(repo, {
        token: userInfo.githubToken,
    });
    if (!isRepoAvailable) {
        if (ci) {
            throw new Error(
                `Cannot access repo ${repo} with the provided token, please visit ${githubAuthUrl} to refresh your Github token`
            );
        }
        const { token } = await handleGithubIntegration();
        githubToken = token;
    }

    const reference =
        ref ?? (await getDefaultBranch(repo, { token: githubToken }));
    debug('org id %s', organizationId);
    debug('project id %s', projectId);
    debug('default branch %s', reference);

    const repositoryRoot = await downloadRepo(
        {
            repoUrl: repo,
            reference,
            dirname,
            ci,
        },
        { token: githubToken }
    );

    if (!reportPath) {
        reportPath = await getReportFromSnyk();
    }

    await uploadFile(
        reportPath,
        uploadData.url,
        uploadData.uploadKey,
        uploadData.uploadFields
    );
    const mobbSpinner = createSpinner('🕵️‍♂️ Initiating Mobb analysis').start();
    try {
        await gqlClient.submitVulnerabilityReport(
            uploadData.fixReportId,
            repo,
            reference,
            projectId
        );
    } catch (e) {
        mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' });
        throw e;
    }

    mobbSpinner.success({
        text: '🕵️‍♂️ Generating fixes...',
    });

    await askToOpenAnalysis();
    async function getReportFromSnyk() {
        const reportPath = path.join(dirname, 'report.json');

        if (
            !(await getSnykReport(reportPath, repositoryRoot, { skipPrompts }))
        ) {
            debug('snyk code is not enabled');
            return;
        }
        return reportPath;
    }
    async function askToOpenAnalysis() {
        const reportUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${uploadData.fixReportId}`;
        !ci && console.log('You can access the report at: \n');
        console.log(reportUrl);
        !skipPrompts && (await mobbAnalysisPrompt());

        !ci && open(reportUrl);
        !ci &&
            console.log(
                chalk.bgBlue(
                    '\n\n  My work here is done for now, see you soon! 🕵️‍♂️  '
                )
            );
    }

    async function handleMobbLogin() {
        if (
            (token && (await gqlClient.verifyToken())) ||
            (apiKey && (await gqlClient.verifyToken()))
        ) {
            createSpinner().start().success({
                text: '🔓 Logged in to Mobb successfully',
            });

            return;
        }
        if (apiKey && !(await gqlClient.verifyToken())) {
            createSpinner().start().error({
                text: '🔓 Logged in to Mobb failed - check your api-key',
            });
            throw new CliError();
        }
        const mobbLoginSpinner = createSpinner().start();
        if (!skipPrompts) {
            mobbLoginSpinner.update({ text: MOBB_LOGIN_REQUIRED_MSG });
            await keypress();
        }

        mobbLoginSpinner.update({
            text: '🔓 Waiting for Mobb login...',
        });

        const loginResponse = await callbackServer(
            webLoginUrl,
            `${webLoginUrl}?done=true`
        );
        token = loginResponse.token;

        gqlClient = new GQLClient({ token });

        if (!(await gqlClient.verifyToken())) {
            mobbLoginSpinner.error({
                text: 'Something went wrong, API token is invalid.',
            });
            throw new CliError();
        }
        debug('set token %s', token);
        config.set('token', token);
        mobbLoginSpinner.success({ text: '🔓 Login to Mobb successful!' });
    }
    async function handleGithubIntegration() {
        const addGithubIntegration = skipPrompts
            ? true
            : await githubIntegrationPrompt();

        const githubSpinner = createSpinner(
            '🔗 Waiting for github integration...'
        ).start();
        if (!addGithubIntegration) {
            githubSpinner.error();
            throw Error('Could not reach github repo');
        }
        const result = await callbackServer(
            githubAuthUrl,
            `${githubSubmitUrl}?done=true`
        );
        githubSpinner.success({ text: '🔗 Github integration successful!' });
        return result;
    }
    async function uploadExistingRepo() {
        const gitInfo = await getGitInfo(srcPath);
        const zipBuffer = await pack(srcPath);

        await uploadFile(
            reportPath,
            uploadData.url,
            uploadData.uploadKey,
            uploadData.uploadFields
        );
        await uploadFile(
            zipBuffer,
            uploadData.repoUrl,
            uploadData.repoUploadKey,
            uploadData.repoUploadFields
        );

        const mobbSpinner = createSpinner(
            '🕵️‍♂️ Initiating Mobb analysis'
        ).start();

        try {
            await gqlClient.submitVulnerabilityReport(
                uploadData.fixReportId,
                repo || gitInfo.repoUrl,
                branch || gitInfo.reference,
                projectId,
                commitHash || gitInfo.hash
            );
        } catch (e) {
            mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' });
            throw e;
        }

        mobbSpinner.success({
            text: '🕵️‍♂️ Generating fixes...',
        });
        await askToOpenAnalysis();
    }
}
