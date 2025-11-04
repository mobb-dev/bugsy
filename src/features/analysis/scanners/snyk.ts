import { createRequire } from 'node:module'

import chalk from 'chalk'
import Debug from 'debug'
import { createSpinner } from 'nanospinner'
import open from 'open'

import { keypress } from '../../../utils'
import { createFork } from '../../../utils/child_process'
import { snykArticlePrompt } from '../prompts'

const debug = Debug('mobbdev:snyk')
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
const SNYK_PATH = costumeRequire.resolve('snyk/bin/snyk')

const SNYK_ARTICLE_URL =
  'https://docs.snyk.io/scan-using-snyk/snyk-code/configure-snyk-code#enable-snyk-code'

debug('snyk executable path %s', SNYK_PATH)

async function forkSnyk(args: string[], { display }: { display: boolean }) {
  debug('fork snyk with args %o %s', args, display)
  return createFork({ args, processPath: SNYK_PATH, name: 'snyk' }, { display })
}

export async function getSnykReport(
  reportPath: string,
  repoRoot: string,
  { skipPrompts = false }
) {
  debug('get snyk report start %s %s', reportPath, repoRoot)

  const config = await forkSnyk(['config'], { display: false })
  const { message: configMessage } = config
  if (!configMessage.includes('api: ')) {
    const snykLoginSpinner = createSpinner().start()
    if (!skipPrompts) {
      snykLoginSpinner.update({
        text: '🔓 Login to Snyk is required, press any key to continue',
      })
      await keypress()
    }
    snykLoginSpinner.update({
      text: '🔓 Waiting for Snyk login to complete',
    })

    debug('no token in the config %s', config)
    await forkSnyk(['auth'], { display: true })
    snykLoginSpinner.success({ text: '🔓 Login to Snyk Successful' })
  }
  const snykSpinner = createSpinner('🔍 Scanning your repo with Snyk ').start()
  const { message: scanOutput } = await forkSnyk(
    ['code', 'test', `--sarif-file-output=${reportPath}`, repoRoot],
    { display: true }
  )

  if (scanOutput.includes('Snyk Code is not supported for org')) {
    debug('snyk code is not enabled %s', scanOutput)
    snykSpinner.error({ text: '🔍 Snyk configuration needed' })
    const answer = await snykArticlePrompt()
    debug('answer %s', answer)

    if (answer) {
      debug('opening the browser')
      await open(SNYK_ARTICLE_URL)
    }
    console.log(
      chalk.bgBlue(
        '\nPlease enable Snyk Code in your Snyk account and try again.'
      )
    )
    throw Error('snyk is not enbabled')
  }

  snykSpinner.success({ text: '🔍 Snyk code scan completed' })
  return true
}
