import { z } from 'zod';
import fs from 'node:fs';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { choseScanner } from '../features/analysis/prompts.mjs';
import { SCANNERS, mobbAscii } from '../constants.mjs';
import { runAnalysis } from '../features/analysis/index.mjs';
import { sleep, CliError } from '../utils.mjs';

const GITHUB_REPO_URL_PATTERN = new RegExp(
    'https://github.com/[\\w-]+/[\\w-]+'
);

const UrlZ = z
    .string({
        invalid_type_error: 'is not a valid github URL',
    })
    .regex(GITHUB_REPO_URL_PATTERN, {
        message: 'is not a valid github URL',
    });

function throwRepoUrlErrorMessage({ error, repoUrl, command }) {
    const errorMessage = error.issues[error.issues.length - 1].message;
    const formattedErrorMessage = `\nError: ${chalk.bold(
        repoUrl
    )} is ${errorMessage}
Example: \n\tmobbdev ${command} -r ${chalk.bold(
        'https://github.com/WebGoat/WebGoat'
    )}`;
    throw new CliError(formattedErrorMessage);
}

export async function analyze(
    { repo, scanFile, ref, apiKey, ci, commitHash, srcPath },
    { skipPrompts = false } = {}
) {
    const { success, error } = UrlZ.safeParse(repo);

    if (!success && !srcPath) {
        throwRepoUrlErrorMessage({
            error,
            repoUrl: repo,
            command: 'analyze',
        });
    }

    if (!fs.existsSync(scanFile)) {
        throw new CliError(`\nCan't access ${chalk.bold(scanFile)}`);
    }

    !ci && (await showWelcomeMessage(skipPrompts));

    await runAnalysis(
        {
            repo,
            scanFile,
            ref,
            apiKey,
            ci,
            commitHash,
            srcPath,
        },
        { skipPrompts }
    );
}

export async function scan(
    { repo, scanner, branch, apiKey, ci },
    { skipPrompts = false } = {}
) {
    const { success, error } = UrlZ.safeParse(repo);
    if (ci && !apiKey) {
        throw new CliError(
            '\nError: --ci flag requires --api-key to be provided as well'
        );
    }

    if (!success) {
        throwRepoUrlErrorMessage({ error, repoUrl: repo, command: 'scan' });
    }
    !ci && (await showWelcomeMessage(skipPrompts));
    scanner ??= scanner || (await choseScanner());
    if (scanner !== SCANNERS.Snyk) {
        throw new CliError(
            'Vulnerability scanning via Bugsy is available only with Snyk at the moment. Additional scanners will follow soon.'
        );
    }
    await runAnalysis({ repo, scanner, branch, apiKey }, { skipPrompts });
}
async function showWelcomeMessage(skipPrompts = false) {
    console.log(mobbAscii);
    const welcome = chalkAnimation.rainbow('\n\t\t\tWelcome to Bugsy\n');
    skipPrompts ? await sleep(100) : await sleep(2000);
    welcome.stop();
}
