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
      auth: {
        htpasswd: {
          file: './htpasswd',
          max_users: 1000,
          algorithm: 'bcrypt',
        },
      },
      security: {
        api: {
          legacy: true,
        },
        web: {
          enable: false,
        },
      },
      self_path: this.#tmpDir,
      logs: { type: 'stdout', format: 'pretty', level: 'error' },
    })

    await new Promise((resolve, reject) => {
      this.#server.listen(this.#port, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Stop local npm registry and delete all temporary data.
   *
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.#server) {
      this.#server.close()
      this.#server.closeAllConnections()
    }
    if (this.#tmpDir) {
      await run(['rm', '-rf', this.#tmpDir])
    }
  }
}

export const registry = new Registry()
