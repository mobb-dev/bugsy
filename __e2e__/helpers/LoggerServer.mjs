import http from 'node:http'
import util from 'node:util'

/**
 * Lightweight HTTP log server used during E2E tests.
 * It listens for POST requests on /log (defaults to port 4444)
 * and pretty-prints the JSON payload according to the required format.
 */
export class LoggerServer {
  /**
   * @param {object} [options]
   * @param {number} [options.port=4444] - Port to listen on.
   */
  constructor({ port = 4444 } = {}) {
    this.port = port
    /** @type {import('node:http').Server|null} */
    this.server = null
    /** @type {Array<{time:string,level:string,version:string|undefined,message:string,data:Record<string,unknown>}>} */
    this.buffer = []
  }

  /**
   * Start the HTTP server.
   * @returns {Promise<void>}
   */
  async start() {
    if (this.server) return // already running

    this.server = http.createServer((req, res) => {
      if (req.method !== 'POST' || req.url !== '/log') {
        res.writeHead(404)
        res.end()
        return
      }

      const chunks = []
      req.on('data', (c) => chunks.push(c))
      req.on('end', () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
          const time = body.timestamp || new Date().toISOString()
          const level = (body.level || 'info').toUpperCase()
          const version = body.version
          const message = body.message || ''
          const data = body.data || {}

          // Store the log entry in internal buffer for later dump
          this.buffer.push({ time, level, version, message, data })

          res.writeHead(204)
          res.end()
        } catch {
          res.writeHead(400)
          res.end()
        }
      })
    })

    await new Promise((resolve, reject) => {
      this.server.on('error', (error) => {
        reject(
          new Error(
            `Failed to start logger server on port ${this.port}: ${error.message}`
          )
        )
      })
      this.server.listen(this.port, resolve)
    })
    this.server.unref()
    // eslint-disable-next-line no-console
    console.log(`Logger server listening on port ${this.port}`)
  }

  /**
   * Stop the HTTP server.
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.server) return
    await new Promise((resolve, reject) =>
      this.server.close((err) => (err ? reject(err) : resolve()))
    )
    this.server = null
  }

  /**
   * Dump all buffered log messages to the console in the order they were received.
   * Does NOT clear the buffer – caller can clear manually if desired.
   */
  dump() {
    console.log('*************** MCP Logs start ***************')
    for (const entry of this.buffer) {
      // eslint-disable-next-line no-console
      console.log(
        `[${entry.time}] [${entry.level}]${entry.version ? ` [${entry.version}]` : ''} ${entry.message}`
      )

      if (entry.data && Object.keys(entry.data).length > 0) {
        // eslint-disable-next-line no-console
        console.log(util.inspect(entry.data, { colors: true, depth: null }))
      }
    }
    console.log('*************** MCP Logs end ***************')
  }

  /**
   * Clear all stored log entries.
   */
  reset() {
    this.buffer = []
  }
}
