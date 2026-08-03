import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream } from 'node:stream/web'

import chalk from 'chalk'
import Debug from 'debug'
import { createSpinner } from 'nanospinner'
import open from 'open'

import { CliError, keypress, packageJson } from '../../../utils'
import { createFork, createSpawn } from '../../../utils/child_process'
import { fetchWithProxy } from '../../../utils/proxy'
import { isStandaloneBinary } from '../../../utils/standalone_binary'
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

const SNYK_ARTICLE_URL =
  'https://docs.snyk.io/scan-using-snyk/snyk-code/configure-snyk-code#enable-snyk-code'

// Same version as our `snyk` npm dependency (exact pin in package.json).
// The download URL below requires an exact version, not a semver range.
const SNYK_VERSION: string = packageJson.dependencies.snyk
const SNYK_DOWNLOAD_BASE =
  process.env['MOBB_SNYK_DOWNLOAD_BASE'] || 'https://downloads.snyk.io/cli'

// Snyk's published standalone-binary asset names, keyed by platform-arch.
// Mirrors what Snyk publishes, not our own build matrix — the darwin entries
// stay valid for a locally built mac binary even though the release matrix in
// scripts/build_binary.sh doesn't ship one.
const SNYK_BINARY_ASSETS: Record<string, string> = {
  'darwin-x64': 'snyk-macos',
  'darwin-arm64': 'snyk-macos-arm64',
  'linux-x64': 'snyk-linux',
  'linux-arm64': 'snyk-linux-arm64',
  'win32-x64': 'snyk-win.exe',
}

async function downloadSnykBinary(asset: string, dest: string): Promise<void> {
  if (!/^\d+\.\d+\.\d+$/.test(SNYK_VERSION)) {
    throw new CliError(
      `Cannot build the Snyk CLI download URL: expected an exact version in the "snyk" dependency of package.json, got "${SNYK_VERSION}".`
    )
  }
  const url = `${SNYK_DOWNLOAD_BASE}/v${SNYK_VERSION}/${asset}`
  const tmpPath = `${dest}.download.${process.pid}`
  const spinner = createSpinner(
    `⬇️  Downloading Snyk CLI v${SNYK_VERSION}`
  ).start()
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    // fetchWithProxy routes through the CLI's proxy layer (HTTPS_PROXY /
    // NO_PROXY handling) like every other network call.
    const timeout = () => AbortSignal.timeout(10 * 60 * 1000)
    const [binRes, shaRes] = await Promise.all([
      fetchWithProxy(url, { signal: timeout() }),
      fetchWithProxy(`${url}.sha256`, { signal: timeout() }),
    ])
    if (!binRes.ok || !shaRes.ok || !binRes.body) {
      throw new CliError(
        `Snyk CLI download failed with HTTP ${binRes.ok ? shaRes.status : binRes.status}: ${url}\n` +
          'If downloads.snyk.io is unreachable from this network, point MOBB_SNYK_DOWNLOAD_BASE at a mirror.'
      )
    }
    // Streamed to disk (the asset is ~170MB) while hashing the same bytes, so
    // the download never sits in memory.
    const hash = crypto.createHash('sha256')
    await pipeline(
      Readable.fromWeb(binRes.body as ReadableStream<Uint8Array>),
      async function* (source) {
        for await (const chunk of source) {
          hash.update(chunk as Buffer)
          yield chunk
        }
      },
      fs.createWriteStream(tmpPath, { mode: 0o755 })
    )
    const expected = (await shaRes.text()).trim().split(/\s+/)[0]
    const actual = hash.digest('hex')
    if (actual !== expected) {
      throw new CliError(
        `Snyk CLI download checksum mismatch (expected ${expected}, got ${actual}) — refusing to install it. Please try again.`
      )
    }
    fs.renameSync(tmpPath, dest)
    spinner.success({ text: `⬇️  Snyk CLI v${SNYK_VERSION} installed` })
  } catch (e) {
    fs.rmSync(tmpPath, { force: true })
    spinner.error({ text: '⬇️  Snyk CLI download failed' })
    throw e
  }
}

// In the npm distribution, snyk is a regular dependency and we fork its JS
// entry. In the standalone binary there is no node_modules, so we download
// Snyk's own standalone binary (pinned version, checksum-verified) instead.
async function getSnykExecutable(): Promise<{
  processPath: string
  isNodeScript: boolean
}> {
  try {
    return {
      processPath: costumeRequire.resolve('snyk/bin/snyk'),
      isNodeScript: true,
    }
  } catch (e) {
    // Only the standalone SEA binary legitimately lacks node_modules; in the
    // npm distribution a missing snyk module is a broken install and must fail
    // loudly, not trigger a surprise download.
    if (!isStandaloneBinary()) {
      throw e
    }
    debug('running as standalone binary, using standalone snyk binary')
  }
  const asset = SNYK_BINARY_ASSETS[`${process.platform}-${process.arch}`]
  if (!asset) {
    throw new CliError(
      `Snyk scan is not supported on this platform (${process.platform}-${process.arch}) when running the standalone mobbdev binary. Use the npm package instead: npx mobbdev@latest`
    )
  }
  const dest = path.join(
    os.homedir(),
    '.mobb',
    'tools',
    'snyk',
    `v${SNYK_VERSION}`,
    asset
  )
  if (!fs.existsSync(dest)) {
    await downloadSnykBinary(asset, dest)
  }
  return { processPath: dest, isNodeScript: false }
}

async function forkSnyk(args: string[], { display }: { display: boolean }) {
  debug('fork snyk with args %o %s', args, display)
  const { processPath, isNodeScript } = await getSnykExecutable()
  const create = isNodeScript ? createFork : createSpawn
  return create({ args, processPath, name: 'snyk' }, { display })
}

export async function getSnykReport(
  reportPath: string,
  repoRoot: string,
  { skipPrompts = false }
) {
  debug('get snyk report start %s %s', reportPath, repoRoot)

  const config = await forkSnyk(['config'], { display: false })
  const { message: configMessage } = config
  // A stored credential is either a legacy api token (`api:`) or an OAuth
  // login from `snyk auth` (`INTERNAL_OAUTH_TOKEN_STORAGE`). Either lets the
  // scan authenticate, so we only need to auth when neither is present.
  const hasStoredCredential =
    configMessage.includes('api: ') ||
    configMessage.includes('INTERNAL_OAUTH_TOKEN_STORAGE')
  if (!hasStoredCredential) {
    // `snyk config` reflects stored credentials only, not the SNYK_TOKEN env
    // var (which Snyk still honors for the scan itself).
    const hasSnykToken = !!process.env['SNYK_TOKEN']
    if (skipPrompts) {
      // CI/non-interactive: the browser-based `snyk auth` cannot work here.
      // Rely on SNYK_TOKEN; fail loudly if it's absent rather than opening a
      // browser that times out and masquerades as a successful login.
      if (!hasSnykToken) {
        throw new CliError(
          'Snyk authentication is required. In CI / non-interactive mode, set the SNYK_TOKEN environment variable (Snyk API token). Interactive `snyk auth` (browser) is not available with --ci.'
        )
      }
      debug('skipPrompts: using SNYK_TOKEN for snyk authentication')
    } else {
      const snykLoginSpinner = createSpinner().start()
      snykLoginSpinner.update({
        text: '🔓 Login to Snyk is required, press any key to continue',
      })
      await keypress()
      snykLoginSpinner.update({
        text: '🔓 Waiting for Snyk login to complete',
      })

      debug('no token in the config %s', config)
      await forkSnyk(['auth'], { display: true })
      snykLoginSpinner.success({ text: '🔓 Login to Snyk Successful' })
    }
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
