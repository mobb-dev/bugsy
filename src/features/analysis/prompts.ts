import { SCANNERS } from '@mobb/bugsy/constants'
import { keypress } from '@mobb/bugsy/utils'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'

type ScannersType = typeof SCANNERS
type ScannerValue = ScannersType[keyof ScannersType]
type ScannerChoice = {
  name: string
  value: ScannerValue
}

const scannerChoices: ScannerChoice[] = [
  { name: 'Snyk', value: SCANNERS.Snyk },
  { name: 'Checkmarx', value: SCANNERS.Checkmarx },
  { name: 'Codeql', value: SCANNERS.Codeql },
  { name: 'Fortify', value: SCANNERS.Fortify },
  { name: 'Sonarqube', value: SCANNERS.Sonarqube },
  { name: 'Semgrep', value: SCANNERS.Semgrep },
]

export async function choseScanner(): Promise<ScannerValue> {
  const { scanner } = await inquirer.prompt({
    name: 'scanner',
    message: 'Choose a scanner you wish to use to scan your code',
    type: 'list',
    choices: scannerChoices,
  })
  return scanner
}

export async function tryCheckmarxConfiguarationAgain() {
  console.log(
    '🔓 Oops, seems like checkmarx does not accept the current configuration'
  )
  const { confirmCheckmarxRetryConfigrations } = await inquirer.prompt({
    name: 'confirmCheckmarxRetryConfigrations',
    type: 'confirm',
    message: 'Would like to try to configure them again? ',
    default: true,
  })
  return confirmCheckmarxRetryConfigrations
}

export async function startCheckmarxConfigationPrompt() {
  const checkmarxConfigreSpinner = createSpinner(
    '🔓 Checkmarx needs to be configured before we start, press any key to continue'
  ).start()
  await keypress()
  checkmarxConfigreSpinner.success()
}

export async function snykLoginPrompt() {
  const spinner = createSpinner(
    '🔓 Login to Snyk is required, press any key to continue'
  ).start()
  await keypress()
  return spinner.success()
}

export async function scmIntegrationPrompt(scmName: string) {
  const answers = await inquirer.prompt({
    name: 'scmConfirm',
    type: 'confirm',
    message: `It seems we don't have access to the repo, do you want to grant access to your ${scmName} account?`,
    default: true,
  })
  return answers.scmConfirm
}
export async function mobbAnalysisPrompt() {
  const spinner = createSpinner().start()
  spinner.update({ text: 'Hit any key to view available fixes' })
  await keypress()
  return spinner.success()
}

export async function snykArticlePrompt() {
  const { snykArticleConfirm } = await inquirer.prompt({
    name: 'snykArticleConfirm',
    type: 'confirm',
    message: "Do you want to be taken to the relevant Snyk's online article?",
    default: true,
  })
  return snykArticleConfirm
}
