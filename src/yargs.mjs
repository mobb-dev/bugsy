import yargs from 'yargs/yargs';
import chalk from 'chalk';

import { SCANNERS } from './constants.mjs';

const branchOption = {
    alias: 'branch',
    describe: chalk.bold('Branch of the repository'),
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
                    b: branchOption,
                    s: {
                        alias: 'scanner',
                        choices: Object.values(SCANNERS),
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
                return yargs.options({
                    f: {
                        alias: 'scan-file',
                        demandOption: true,
                        describe: chalk.bold(
                            'Select the vulnerability report to analyze'
                        ),
                    },
                    r: repoOption,
                    b: branchOption,
                    y: yesOption,
                    ['api-key']: apiKeyOption,
                    ci: ciOption,
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
