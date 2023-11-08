import { createRequire } from 'node:module'

import { keypress } from '@mobb/bugsy/utils'
import { createFork } from '@mobb/bugsy/utils/child_process'
import chalk from 'chalk'
import Debug from 'debug'
import { createSpinner } from 'nanospinner'
import open from 'open'

import { snykArticlePrompt } from '../prompts'

const debug = Debug('mobbdev:snyk')
const require = createRequire(import.meta.url)
const SNYK_PATH = require.resolve('snyk/bin/snyk')

const SNYK_ARTICLE_URL =
  'https://docs.snyk.io/scan-application-code/snyk-code/getting-started-with-snyk-code/activating-snyk-code-using-the-web-ui/step-1-enabling-the-snyk-code-option'

debug('snyk executable path %s', SNYK_PATH)

async function forkSnyk(args: string[], { display }: { display: boolean }) {
  debug('fork snyk with args %o %s', args, display)
  return createFork(
    { args, processPath: SNYK_PATH, name: 'checkmarx' },
    { display }
  )
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

  if (
    scanOutput.includes(
      'Snyk Code is not supported for org: enable in Settings > Snyk Code'
    )
  ) {
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
