import cp from 'node:child_process'
import { createRequire } from 'node:module'

import { keypress } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import Debug from 'debug'
import { createSpinner } from 'nanospinner'
import open from 'open'
import * as process from 'process'
import supportsColor from 'supports-color'

import { snykArticlePrompt } from './prompts'

const { stdout } = supportsColor

const debug = Debug('mobbdev:snyk')
const require = createRequire(import.meta.url)
const SNYK_PATH = require.resolve('snyk/bin/snyk')

const SNYK_ARTICLE_URL =
  'https://docs.snyk.io/scan-application-code/snyk-code/getting-started-with-snyk-code/activating-snyk-code-using-the-web-ui/step-1-enabling-the-snyk-code-option'

debug('snyk executable path %s', SNYK_PATH)

async function forkSnyk(
  args: readonly string[],
  { display }: { display: boolean }
): Promise<string> {
  debug('fork snyk with args %o %s', args, display)

  return new Promise((resolve, reject) => {
    const child = cp.fork(SNYK_PATH, args, {
      stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
      env: { FORCE_COLOR: stdout ? '1' : '0' },
    })

    let out = ''
    const onData = (chunk: Buffer) => {
      debug('chunk received from snyk std %s', chunk)
      out += chunk
    }
    if (!child || !child?.stdout || !child?.stderr) {
      debug('unable to fork snyk')
      reject(new Error('unable to fork snyk'))
    }

    child.stdout?.on('data', onData)
    child.stderr?.on('data', onData)

    if (display) {
      child.stdout?.pipe(process.stdout)
      child.stderr?.pipe(process.stderr)
    }

    child.on('exit', () => {
      debug('snyk exit')
      resolve(out)
    })
    child.on('error', (err) => {
      debug('snyk error %o', err)
      reject(err)
    })
  })
}

export async function getSnykReport(
  reportPath: string,
  repoRoot: string,
  { skipPrompts = false }
) {
  debug('get snyk report start %s %s', reportPath, repoRoot)

  const config = await forkSnyk(['config'], { display: false })
  if (!config.includes('api: ')) {
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
  const out = await forkSnyk(
    ['code', 'test', `--sarif-file-output=${reportPath}`, repoRoot],
    { display: true }
  )

  if (
    out.includes(
      'Snyk Code is not supported for org: enable in Settings > Snyk Code'
    )
  ) {
    debug('snyk code is not enabled %s', out)
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
    return false
  }

  snykSpinner.success({ text: '🔍 Snyk code scan completed' })
  return true
}
