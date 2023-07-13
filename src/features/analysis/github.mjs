import fs from 'node:fs';
import chalk from 'chalk';
import stream from 'node:stream';
import path from 'node:path';
import { promisify } from 'node:util';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import Debug from 'debug';
import { Spinner } from '../../utils.mjs';
import { GITHUB_CLIENT_ID, WEB_APP_URL } from '../../constants.mjs';
const pipeline = promisify(stream.pipeline);
const debug = Debug('mobbdev:github');

const githubTokenUrl = `${WEB_APP_URL}/gh-callback`;

export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${githubTokenUrl}`;

async function getRepo(slug, { token } = {}) {
    try {
        return fetch(`https://api.github.com/repos/${slug}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                ...(token && { Authorization: `bearer ${token}` }),
            },
        });
    } catch (e) {
        debug(`error fetching the repo ${slug}`, e);
        throw e;
    }
}

function extractSlug(repoUrl) {
    debug('get default branch %s', repoUrl);
    let slug = repoUrl.replace(/https?:\/\/github\.com\//i, '');

    if (slug.endsWith('/')) {
        slug = slug.substring(0, slug.length - 1);
    }

    if (slug.endsWith('.git')) {
        slug = slug.substring(0, slug.length - '.git'.length);
    }
    debug('slug %s', slug);
    return slug;
}

export async function canReachRepo(repoUrl, { token } = {}) {
    const slug = extractSlug(repoUrl);
    const response = await getRepo(slug, { token });
    return response.ok;
}

export async function getDefaultBranch(repoUrl, { token } = {}) {
    const slug = extractSlug(repoUrl);
    const response = await getRepo(slug, { token });
    if (!response.ok) {
        debug('GH request failed %s %s', response.body, response.status);
        throw new Error(
            `Can't get default branch, make sure you have access to : ${repoUrl}.`
        );
    }

    const repoInfo = await response.json();
    debug('GH request ok %o', repoInfo);

    return repoInfo.default_branch;
}

export async function downloadRepo(
    { repoUrl, reference, dirname, ci },
    { token } = {}
) {
    const { createSpinner } = Spinner({ ci });
    const repoSpinner = createSpinner('💾 Downloading Repo').start();
    debug('download repo %s %s %s', repoUrl, reference, dirname);
    const zipFilePath = path.join(dirname, 'repo.zip');
    const response = await fetch(`${repoUrl}/zipball/${reference}`, {
        method: 'GET',
        headers: {
            ...(token && { Authorization: `bearer ${token}` }),
        },
    });
    if (!response.ok) {
        debug(
            'GH zipball request failed %s %s',
            response.body,
            response.status
        );
        repoSpinner.error({ text: '💾 Repo download failed' });
        throw new Error(
            `Can't access the the branch ${chalk.bold(
                reference
            )} on ${chalk.bold(repoUrl)} make sure it exits.`
        );
    }

    const fileWriterStream = fs.createWriteStream(zipFilePath);

    await pipeline(response.body, fileWriterStream);
    await extract(zipFilePath, { dir: dirname });

    const repoRoot = fs
        .readdirSync(dirname, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)[0];
    debug('repo root %s', repoRoot);
    repoSpinner.success({ text: '💾 Repo downloaded successfully' });
    return path.join(dirname, repoRoot);
}
