import { createRequire } from 'node:module'

import chalk from 'chalk'
import Debug from 'debug'
import { existsSync } from 'fs'
import { createSpinner } from 'nanospinner'
import { type } from 'os'
import path from 'path'

import {
  startCheckmarxConfigationPrompt,
  tryCheckmarxConfiguarationAgain,
} from '../../../features/analysis/prompts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - module resolution for .mjs file
import { cxOperatingSystemSupportMessage } from '../../../post_install/constants.mjs'
import { CliError } from '../../../utils'
import { createSpawn } from '../../../utils/child_process'

const debug = Debug('mobbdev:checkmarx')
// Handle both ESM and CommonJS environments
let moduleUrl: string
if (typeof __filename !== 'undefined') {
  // CommonJS environment
  moduleUrl = __filename
} else {
  // ESM environment - use Function constructor to avoid parser seeing import.meta
  try {
    // eslint-disable-next-line no-new-func
    const getImportMetaUrl = new Function('return import.meta.url')
    moduleUrl = getImportMetaUrl()
  } catch {
    // If that fails, try using error stack to get current file URL
    const err = new Error()
    const stack = err.stack || ''
    const match = stack.match(/file:\/\/[^\s)]+/)
    if (match) {
      moduleUrl = match[0]
    } else {
      throw new Error('Unable to determine module URL in this environment')
    }
  }
}
const costumeRequire = createRequire(moduleUrl)
const getCheckmarxPath = () => {
  const os = type()
  const cxFileName = os === 'Windows_NT' ? 'cx.exe' : 'cx'
  try {
    return costumeRequire.resolve(`.bin/${cxFileName}`)
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
