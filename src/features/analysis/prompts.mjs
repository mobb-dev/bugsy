import inquirer from 'inquirer';
import { keypress } from '../../utils.mjs';
import { SCANNERS } from '../../constants.mjs';
import { createSpinner } from 'nanospinner';

export async function choseScanner() {
    const { scanner } = await inquirer.prompt({
        name: 'scanner',
        message: 'Choose a scanner you wish to use to scan your code',
        type: 'list',
        choices: [
            { name: 'Snyk', value: SCANNERS.Snyk },
            { name: 'Checkmarx', value: SCANNERS.Checkmarx },
            { name: 'Codeql', value: SCANNERS.Codeql },
            { name: 'Fortify', value: SCANNERS.Fortify },
        ],
    });
    return scanner;
}

export async function snykLoginPrompt() {
    const spinner = createSpinner(
        '🔓 Login to Snyk is required, press any key to continue'
    ).start();
    await keypress();
    return spinner.success();
}

export async function githubIntegrationPrompt() {
    const answers = await inquirer.prompt({
        name: 'githubConfirm',
        type: 'confirm',
        message:
            "It seems we don't have access to the repo, do you want to grant access to your github account",
        default: true,
    });
    return answers.githubConfirm;
}
export async function mobbAnalysisPrompt() {
    const spinner = createSpinner().start();
    spinner.update({ text: 'Hit any key to view available fixes' });
    await keypress();
    return spinner.success();
}

export async function snykArticlePrompt() {
    const { snykArticleConfirm } = await inquirer.prompt({
        name: 'snykArticleConfirm',
        type: 'confirm',
        message:
            "Do you want to be taken to the relevant Snyk's online article?",
        default: true,
    });
    return snykArticleConfirm;
}
