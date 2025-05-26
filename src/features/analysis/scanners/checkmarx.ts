import { createRequire } from 'node:module'

import {
  startCheckmarxConfigationPrompt,
  tryCheckmarxConfiguarationAgain,
} from '@mobb/bugsy/features/analysis/prompts'
import { cxOperatingSystemSupportMessage } from '@mobb/bugsy/post_install/constants.mjs'
import { CliError } from '@mobb/bugsy/utils'
import { createSpawn } from '@mobb/bugsy/utils/child_process'
import chalk from 'chalk'
import Debug from 'debug'
import { existsSync } from 'fs'
import { createSpinner } from 'nanospinner'
import { type } from 'os'
import path from 'path'

const debug = Debug('mobbdev:checkmarx')
const require = createRequire(import.meta.url)
const getCheckmarxPath = () => {
  const os = type()
  const cxFileName = os === 'Windows_NT' ? 'cx.exe' : 'cx'
  try {
    return require.resolve(`.bin/${cxFileName}`)
  } catch (e) {
    throw new CliError(cxOperatingSystemSupportMessage)
  }
}

type CheckmarxArgs = {
  repoPath: string
  branch: string
  fileName: string
  filePath: string
  projectName: string
}
const getCheckmarxCommandArgs = ({
  repoPath,
  branch,
  fileName,
  filePath,
  projectName,
}: CheckmarxArgs) => [
  '--project-name',
  projectName,
  '-s',
  repoPath,
  '--branch',
  branch,
  '--scan-types',
  'sast',
  '--output-path',
  filePath,
  '--output-name',
  fileName,
  '--report-format',
  'json',
]

const VALIDATE_COMMAND = ['auth', 'validate']
const CONFIGURE_COMMAND = ['configure']
const SCAN_COMMAND = ['scan', 'create']

const CHECKMARX_SUCCESS_CODE = 0

export function validateCheckmarxInstallation() {
  existsSync(getCheckmarxPath())
}

async function forkCheckmarx(
  args: string[],
  { display }: { display: boolean }
) {
  debug('fork checkmarx with args %o %s', args.join(' '), display)
  return createSpawn(
    { args, processPath: getCheckmarxPath(), name: 'checkmarx' },
    { display }
  )
}

type GetCheckmarxReportArgs = {
  reportPath: string
  repositoryRoot: string
  branch: string
  projectName: string
}
export async function getCheckmarxReport(
  { reportPath, repositoryRoot, branch, projectName }: GetCheckmarxReportArgs,
  { skipPrompts = false }
) {
  debug('get checkmarx report start %s %s', reportPath, repositoryRoot)
  const { code: loginCode } = await forkCheckmarx(VALIDATE_COMMAND, {
    display: false,
  })
  if (loginCode !== CHECKMARX_SUCCESS_CODE) {
    if (skipPrompts) {
      await throwCheckmarxConfigError()
    }
    await startCheckmarxConfigationPrompt()
    await validateCheckamxCredentials()
  }
  const extension = path.extname(reportPath)
  const filePath = path.dirname(reportPath)
  const fileName = path.basename(reportPath, extension)

  const checkmarxCommandArgs = getCheckmarxCommandArgs({
    repoPath: repositoryRoot,
    branch,
    filePath,
    fileName,
    projectName,
  })
  console.log('⠋ 🔍 Initiating Checkmarx Scan ')
  const { code: scanCode } = await forkCheckmarx(
    [...SCAN_COMMAND, ...checkmarxCommandArgs],
    {
      display: true,
    }
  )

  if (scanCode !== CHECKMARX_SUCCESS_CODE) {
    createSpinner('🔍 Something went wrong with the checkmarx scan')
      .start()
      .error()
    throw new CliError()
  }
  await createSpinner('🔍 Checkmarx Scan completed').start().success()
  return true
}
async function throwCheckmarxConfigError() {
  await createSpinner('🔓 Checkmarx is not configued correctly').start().error()

  throw new CliError(
    `Checkmarx is not configued correctly\n you can configure it by using the ${chalk.bold(
      'cx configure'
    )} command`
  )
}

async function validateCheckamxCredentials() {
  console.log(`
        Here's a suggestion for checkmarx configuation: 
          ${chalk.bold('AST Base URI:')} https://ast.checkmarx.net
          ${chalk.bold('AST Base Auth URI (IAM):')} https://iam.checkmarx.net
  `)
  await forkCheckmarx(CONFIGURE_COMMAND, { display: true })
  const { code: loginCode } = await forkCheckmarx(VALIDATE_COMMAND, {
    display: false,
  })
  if (loginCode !== CHECKMARX_SUCCESS_CODE) {
    const tryAgain = await tryCheckmarxConfiguarationAgain()
    if (!tryAgain) {
      await throwCheckmarxConfigError()
    }
    await validateCheckamxCredentials()
    return
  }
  await createSpinner('🔓 Checkmarx configured successfully!').start().success()
}
