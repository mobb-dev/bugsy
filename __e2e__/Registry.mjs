import { mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { runServer } from 'verdaccio'

import { run } from './utils.mjs'

export const REGISTRY_PORT = 4873

/**
 * Wrapper class for local npm (Verdaccio) registry.
 */
export class Registry {
  #port
  #server = null
  #tmpDir

  constructor(port = REGISTRY_PORT) {
    this.#port = port
  }

  /**
   * Start local npm registry in a temporary folder.
   *
   * @returns {Promise<void>}
   */
  async start() {
    this.#tmpDir = await mkdtemp(path.join(os.tmpdir(), 'registry'))
    this.#server = await runServer({
      storage: this.#tmpDir,
      uplinks: {
        npmjs: {
          url: 'https://registry.npmjs.org/',
        },
      },
      packages: {
        mobbdev: {
          access: '$all',
          publish: '$all',
        },
        '**': {
          access: '$all',
          proxy: 'npmjs',
        },
      },
      self_path: this.#tmpDir,
      logs: { type: 'stdout', format: 'pretty', level: 'error' },
    })

    await new Promise((resolve) => {
      this.#server.listen(this.#port, resolve)
    })
  }

  /**
   * Stop local npm registry and delete all temporary data.
   *
   * @returns {Promise<void>}
   */
  async stop() {
    this.#server.close()
    this.#server.closeAllConnections()
    await run(['rm', '-rf', this.#tmpDir])
  }
}

export const registry = new Registry()
