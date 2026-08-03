import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { runServer } from 'verdaccio'

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
      // Platform binary tarballs are ~40MB compressed; default is 10mb.
      max_body_size: '200mb',
      uplinks: {
        npmjs: {
          url: 'https://registry.npmjs.org/',
        },
      },
      packages: {
        // JS CLI package (mobbdev) + scoped binary distribution (@mobb.ai/*)
        'mobbdev*': {
          access: '$all',
          publish: '$all',
        },
        '@mobb.ai/*': {
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
      await rm(this.#tmpDir, { recursive: true, force: true })
    }
  }
}

export const registry = new Registry()
