import cp from 'node:child_process';
import { createRequire } from 'node:module';
import { stdout } from 'colors/lib/system/supports-colors.js';
import open from 'open';
import * as process from 'process';
import Debug from 'debug';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { snykArticlePrompt } from './prompts.mjs';
import { keypress } from '../../utils.mjs';

const debug = Debug('mobbdev:snyk');
const require = createRequire(import.meta.url);
const SNYK_PATH = require.resolve('snyk/bin/snyk');

const SNYK_ARTICLE_URL =
    'https://docs.snyk.io/scan-application-code/snyk-code/getting-started-with-snyk-code/activating-snyk-code-using-the-web-ui/step-1-enabling-the-snyk-code-option';

debug('snyk executable path %s', SNYK_PATH);

async function forkSnyk(args, display) {
    debug('fork snyk with args %o %s', args, display);

    return new Promise((resolve, reject) => {
        const child = cp.fork(SNYK_PATH, args, {
            stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
            env: { FORCE_COLOR: stdout.level },
        });
        let out = '';
        const onData = (chunk) => {
            debug('chunk received from snyk std %s', chunk);
            out += chunk;
        };

        child.stdout.on('data', onData);
        child.stderr.on('data', onData);

        if (display) {
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }

        child.on('exit', () => {
            debug('snyk exit');
            resolve(out);
        });
        child.on('error', (err) => {
            debug('snyk error %o', err);
            reject(err);
        });
    });
}

export async function getSnykReport(
    reportPath,
    repoRoot,
    { skipPrompts = false }
) {
    debug('get snyk report start %s %s', reportPath, repoRoot);

    const config = await forkSnyk(['config'], false);
    if (!config.includes('api: ')) {
        const snykLoginSpinner = createSpinner().start();
        if (!skipPrompts) {
            snykLoginSpinner.update({
                text: '🔓 Login to Snyk is required, press any key to continue',
            });
            await keypress();
        }
        snykLoginSpinner.update({
            text: '🔓 Waiting for Snyk login to complete',
        });

        debug('no token in the config %s', config);
        await forkSnyk(['auth'], true);
        snykLoginSpinner.success({ text: '🔓 Login to Snyk Successful' });
    }
    const snykSpinner = createSpinner(
        '🔍 Scanning your repo with Snyk '
    ).start();
    const out = await forkSnyk(
        ['code', 'test', `--sarif-file-output=${reportPath}`, repoRoot],
        true
    );

    if (
        out.includes(
            'Snyk Code is not supported for org: enable in Settings > Snyk Code'
        )
    ) {
        debug('snyk code is not enabled %s', out);
        snykSpinner.error({ text: '🔍 Snyk configuration needed' });
        const answer = await snykArticlePrompt();
        debug('answer %s', answer);

        if (answer) {
            debug('opening the browser');
            await open(SNYK_ARTICLE_URL);
        }
        console.log(
            chalk.bgBlue(
                '\nPlease enable Snyk Code in your Snyk account and try again.'
            )
        );
        return false;
    }

    snykSpinner.success({ text: '🔍 Snyk code scan completed' });
    return true;
}
