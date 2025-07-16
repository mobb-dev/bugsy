import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'dotenv'

/**
 * Environment variables for SAST providers integrations.
 *
 * @type {Object}
 */
export const SAST_PROVIDERS_ENV = parse(
  readFileSync(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../consumers/analyzer/analyzer/report_generator/.env'
    ),
    'utf8'
  )
)

/**
 * Absolute path to the CLI folder.
 *
 * @type {string}
 */
export const CLI_DIR_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)

/**
 * Absolute path to the folder with scripts.
 *
 * @type {string}
 */
export const SCRIPTS_DIR_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../scripts'
)

/**
 * Absolute path to the Checkmarx SVJP report.
 *
 * @type {string}
 */
export const SVJP_CX_REPORT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../__tests__/files/svjp/checkmarx.json'
)

/**
 * CLI env variables overwrite to make it connect to local server instead of
 * the production one.
 *
 * @type {Object}
 */
export const CLI_LOCAL_ENV_OVERWRITE = {
  API_URL: 'http://localhost:8080/v1/graphql',
  WEB_APP_URL: 'http://localhost:5173',
}

/**
 * A helper function to wrap child_process.spawn to a Promise.
 *
 * @param {Array[string] | string} args - Command string or array of arguments
 *  including the command itself.
 * @param {Object} opts - Custom spawn arguments.
 * @returns {Promise<string>} - The command output.
 */
export async function run(args, opts = {}) {
  if (typeof args === 'string') {
    args = args.split(' ')
  }
  const [cmd, ...params] = args

  const child = spawn(cmd, params, opts)

  let data = ''

  for await (const chunk of child.stdout) {
    data += chunk
  }
  for await (const chunk of child.stderr) {
    data += chunk
  }

  const exitCode = await new Promise((resolve) => child.on('close', resolve))

  if (exitCode) {
    throw new Error(`Failed to run subprocess ${exitCode}: ${data}`)
  }

  return data
}

/**
 * Checkmarx CLI uses different mechanism to figure out config location. We
 * need to find the real user's home folder and delete original Checkmarx CLI
 * config file from it.
 *
 * @returns {Promise<void>}
 */
export async function cleanupCheckmarxCliConfig() {
  const configPath = path.join(os.homedir(), '.checkmarx/checkmarxcli.yaml')

  try {
    await unlink(configPath)
  } catch (_) {
    // We remove file if it exists. No need to handle errors here.
  }
}
