import yargs from 'yargs/yargs';
import chalk from 'chalk';
import path from 'path';

import { SCANNERS } from './constants.mjs';
import { CliError } from './utils.mjs';

const supportExtensions = ['.json', '.xml', '.fpr', '.sarif'];

const refOption = {
    describe: chalk.bold('reference of the repository (branch, tag, commit)'),
    type: 'string',
};

const srcPathOption = {
    alias: 'src-path',
    describe: chalk.bold('Path to the repository folder with the source code'),
    type: 'string',
};

const commitHash = {
    alias: 'commit-hash',
    describe: chalk.bold('Hash of the commit'),
    type: 'string',
};

const repoOption = {
    alias: 'repo',
    demandOption: true,
    describe: chalk.bold('Github repository URL'),
};

const yesOption = {
    alias: 'yes',
    describe: chalk.bold('Skip prompts and use default values'),
};

const apiKeyOption = {
    describe: chalk.bold('Mobb authentication api-key'),
    type: 'string',
};
const ciOption = {
    describe: chalk.bold(
        'Run in CI mode, prompts and browser will not be opened'
    ),
    type: 'boolean',
    default: false,
};

export const parseArgs = (args) => {
    const yargsInstance = yargs(args);
    return yargsInstance
        .updateStrings({
            'Commands:': chalk.yellow.underline.bold('Commands:'),
            'Options:': chalk.yellow.underline.bold('Options:'),
            'Examples:': chalk.yellow.underline.bold('Examples:'),
            'Show help': chalk.bold('Show help'),
        })
        .usage(
            `${chalk.bold(
                '\n Bugsy - Trusted, Automatic Vulnerability Fixer 🕵️‍♂️\n\n'
            )} ${chalk.yellow.underline.bold('Usage:')} \n  $0 ${chalk.green(
                '<command>'
            )} ${chalk.dim('[options]')}
            `
        )
        .version(false)
        .command({
            //
            command: 'scan',
            describe: chalk.bold(
                'Scan your code for vulnerabilities, get automated fixes right away.'
            ),
            builder: (yargs) => {
                return yargs.options({
                    r: repoOption,
                    ref: refOption,
                    s: {
                        alias: 'scanner',
                        choices: Object.values(SCANNERS).map((scanner) =>
                            scanner.toLowerCase()
                        ),
                        describe: chalk.bold('Select the scanner to use'),
                    },
                    y: yesOption,
                    ['api-key']: apiKeyOption,
                });
            },
        })
        .command({
            command: 'analyze',
            describe: chalk.bold(
                'Provide a vulnerability report and relevant code repository, get automated fixes right away.'
            ),
            builder: (yargs) => {
                return yargs
                    .options({
                        f: {
                            alias: 'scan-file',
                            demandOption: true,
                            describe: chalk.bold(
                                'Select the vulnerability report to analyze (Checkmarx, Snyk, Fortify, CodeQL)'
                            ),
                        },
                        r: {
                            ...repoOption,
                            demandOption: false,
                        },
                        p: srcPathOption,
                        ref: refOption,
                        ch: commitHash,
                        y: yesOption,
                        ['api-key']: apiKeyOption,
                        ci: ciOption,
                    })
                    .check((argv) => {
                        if (!argv.srcPath && !argv.repo) {
                            throw new CliError(
                                'You must supply either --src-path or --repo'
                            );
                        }

                        if (argv.ci && !argv.apiKey) {
                            throw new CliError(
                                '--ci flag requires --api-key to be provided as well'
                            );
                        }
                        if (
                            !supportExtensions.includes(
                                path.extname(argv.f).toLowerCase()
                            )
                        ) {
                            throw new CliError(
                                `\n${chalk.bold(
                                    argv.f
                                )} is not a supported file extension. Supported extensions are: ${chalk.bold(
                                    supportExtensions.join(', ')
                                )}\n`
                            );
                        }

                        return true;
                    });
            },
        })
        .example('$0 scan -r https://github.com/WebGoat/WebGoat')
        .command({
            command: '*',
            handler() {
                yargsInstance.showHelp();
            },
        })
        .strictOptions()
        .help('h')
        .alias('h', 'help')
        .epilog(chalk.bgBlue('Made with ❤️  by Mobb'))
        .showHelpOnFail(true)
        .wrap(Math.min(120, yargsInstance.terminalWidth()))
        .parse();
};
