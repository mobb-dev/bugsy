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

    await fs.mkdir(path.join(this.#tmpDir, 'bin'))
    // Mock `open` command to prevent browser opening during the tests.
    await fs.writeFile(
      path.join(this.#tmpDir, 'bin', 'open'),
      '#!/bin/sh\necho "open"'
    )
    await fs.chmod(path.join(this.#tmpDir, 'bin', 'open'), 0o777)

    await run(
      `npm config set registry http://localhost:${REGISTRY_PORT}`,
      this.#npmRunParams
    )
    await run(
      `npm config set //localhost:${REGISTRY_PORT}/:_authToken=fake`,
      this.#npmRunParams
    )
    await run(
      `npm publish --registry http://localhost:${REGISTRY_PORT}`,
      Object.assign({}, this.#npmRunParams, {
        cwd: CLI_DIR_PATH,
      })
    )
  }

  /**
   * Create a new TerminalEmulator for npx command.
   *
   * @param {Array[string]} args - List of arguments for `npx -y` command.
   * @param {Object} env - Additional environment variables for the npx command.
   * @param {string} cwd - Working directory.
   * @returns {TerminalEmulator} - Instance of the TerminalEmulator.
   */
  npx(args, env = {}, cwd = this.#tmpDir) {
    const options = Object.assign({}, this.#npmRunParams, {
      cwd,
    })

    options.env = Object.assign({}, options.env, env)
    return new TerminalEmulator('npx', ['-y', ...args], options)
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
