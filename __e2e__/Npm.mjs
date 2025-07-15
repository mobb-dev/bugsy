import * as fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { env } from 'node:process'

import { REGISTRY_PORT } from './Registry.mjs'
import TerminalEmulator from './TerminalEmulator.mjs'
import { CLI_DIR_PATH, run } from './utils.mjs'

/**
 * Wrapper class for all npm related CLI calls.
 */
export class Npm {
  #tmpDir
  #npmRunParams
  #packageVersion

  /**
   * Configure npm to run from local registry and publish fresh mobbdev (Bugsy)
   * build to it.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.#tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm'))

    this.#npmRunParams = {
      cwd: this.#tmpDir,
      env: {
        HOME: this.#tmpDir,
        PATH: `${this.#tmpDir}/bin:${path.join(CLI_DIR_PATH, '__e2e__/node_modules/.bin')}:${env.PATH}`,
        DOTENV_ME: env.DOTENV_ME,
      },
    }

    // Create mock 'open' command to prevent actual browser opening in tests
    const binDir = path.join(this.#tmpDir, 'bin')
    await fs.mkdir(binDir)
    await fs.writeFile(path.join(binDir, 'open'), '#!/bin/sh\necho "open"')
    await fs.chmod(path.join(binDir, 'open'), 0o777)

    // Configure npm for local registry
    const registryUrl = `http://localhost:${REGISTRY_PORT}`
    const registryHost = `localhost:${REGISTRY_PORT}`

    // Create .npmrc file directly for better CI compatibility
    const npmrcContent = [
      `registry=${registryUrl}`,
      `//${registryHost}/:_authToken=fake-token`,
      `//${registryHost}/:always-auth=true`,
      `//registry.npmjs.org/:_authToken=\${NODE_AUTH_TOKEN}`,
    ].join('\n')

    await fs.writeFile(path.join(this.#tmpDir, '.npmrc'), npmrcContent)

    // Also set via npm config as fallback
    await Promise.all([
      run(`npm config set registry ${registryUrl}`, this.#npmRunParams),
      run(
        `npm config set //${registryHost}/:_authToken fake-token`,
        this.#npmRunParams
      ),
    ])

    // Get version and publish
    const packageJson = JSON.parse(
      await fs.readFile(path.join(CLI_DIR_PATH, 'package.json'), 'utf8')
    )
    this.#packageVersion = packageJson.version

    await run(`npm publish --registry ${registryUrl} --ignore-scripts`, {
      ...this.#npmRunParams,
      cwd: CLI_DIR_PATH,
    })
  }

  /**
   * Create a new TerminalEmulator for npx command.
   *
   * @param {Array[string]} args - List of arguments for `npx -y` command.
   * @param {Object} env - Additional environment variables for the npx command.
   * @param {string} cwd - Working directory.
   * @returns {TerminalEmulator} - Instance of the TerminalEmulator.
   */
  async npx(args, env = {}, cwd = this.#tmpDir) {
    const fakeGlobalDir = `${this.#tmpDir}/fake-global`
    await fs.mkdir(fakeGlobalDir, { recursive: true })

    const registryUrl = `http://localhost:${REGISTRY_PORT}`
    const options = {
      ...this.#npmRunParams,
      cwd,
      env: {
        ...this.#npmRunParams.env,
        ...env,
        PATH: [
          `${this.#tmpDir}/bin`,
          ...(env.PATH?.split(':') ||
            process.env.PATH?.split(':') || [
              '/usr/local/bin',
              '/usr/bin',
              '/bin',
            ]),
        ]
          .filter(Boolean)
          .join(':'),
        npm_config_registry: registryUrl,
        npm_config_prefix: fakeGlobalDir,
        npm_config_prefer_online: 'true',
      },
    }

    const npxArgs = [
      '-y',
      '--registry',
      registryUrl,
      '--package',
      `mobbdev@latest`,
      ...args,
    ]

    return new TerminalEmulator('npx', npxArgs, options)
  }

  /**
   * Remove all temporary data.
   *
   * @returns {Promise<void>}
   */
  async destroy() {
    await run(['rm', '-rf', this.#tmpDir])
  }

  /**
   * Cleanup config store. We use this to delete all Bugsy settings between runs.
   *
   * @returns {Promise<void>}
   */
  async cleanConfigstore() {
    await run(['rm', '-rf', path.join(this.#tmpDir, '.config')])
  }
}

export const npm = new Npm()
