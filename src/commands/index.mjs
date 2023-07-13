import { z } from 'zod';
import fs from 'node:fs';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { choseScanner } from '../features/analysis/prompts.mjs';
import { SCANNERS, mobbAscii } from '../constants.mjs';
import { runAnalysis } from '../features/analysis/index.mjs';
import { sleep } from '../utils.mjs';
import path from 'path';

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

function printRepoUrlErrorMessage({ error, repoUrl, command }) {
    const errorMessage = error.issues[error.issues.length - 1].message;
    console.error(`\nError: ${chalk.bold(repoUrl)} is ${errorMessage}`);
    console.error(
        `Example: \n\tmobbdev ${command} -r ${chalk.bold(
            'https://github.com/WebGoat/WebGoat'
        )}`
    );
}

export async function analyze(
    { repo, scanFile, branch, apiKey, ci },
    { skipPrompts = false } = {}
) {
    const { success, error } = UrlZ.safeParse(repo);
    if (!success) {
        printRepoUrlErrorMessage({
            error,
            repoUrl: repo,
            command: 'analyze',
        });
        process.exit(1);
    }
    if (ci && !apiKey) {
        console.error(
            '\nError: --ci flag requires --api-key to be provided as well'
        );
        process.exit(1);
    }
    if (!fs.existsSync(scanFile)) {
        console.error(`\nCan't access ${chalk.bold(scanFile)}`);
        process.exit(1);
    }
    if (path.extname(scanFile) !== '.json') {
        console.error(`\n${chalk.bold(scanFile)} is not a json file`);
        process.exit(1);
    }
    !ci && (await showWelcomeMessage(skipPrompts));
    await runAnalysis({ repo, scanFile, branch, apiKey, ci }, { skipPrompts });
}

export async function scan(
    { repo, scanner, branch, apiKey, ci },
    { skipPrompts = false } = {}
) {
    const { success, error } = UrlZ.safeParse(repo);
    if (ci && !apiKey) {
        console.error(
            '\nError: --ci flag requires --api-key to be provided as well'
        );
        process.exit(1);
    }

    if (!success) {
        printRepoUrlErrorMessage({ error, repoUrl: repo, command: 'scan' });
        process.exit(1);
    }
    !ci && (await showWelcomeMessage(skipPrompts));
    scanner ??= scanner || (await choseScanner());
    if (scanner !== SCANNERS.Snyk) {
        console.error(
            'Vulnerability scanning via Bugsy is available only with Snyk at the moment. Additional scanners will follow soon.'
        );
        process.exit(1);
    }
    await runAnalysis({ repo, scanner, branch, apiKey }, { skipPrompts });
}
async function showWelcomeMessage(skipPrompts = false) {
    console.log(mobbAscii);
    const welcome = chalkAnimation.rainbow('\n\t\t\tWelcome to Bugsy\n');
    skipPrompts ? await sleep(100) : await sleep(2000);
    welcome.stop();
}
