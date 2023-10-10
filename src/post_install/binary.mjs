// this file is based from 'binary-install' https://www.npmjs.com/package/binary-install
import axios from 'axios'
import { existsSync, mkdirSync } from 'fs'
import { arch as _arch, type as _type } from 'os'
import { join } from 'path'
import tar from 'tar'

const __dirname = process.env['PWD']

/**
 * @param {Object} installParams
 * @param {string} installParams.binaryName
 * @param {string} installParams.url
 * @returns {Promise<void>}
 */
export async function install({ binaryName, url }) {
  if (!__dirname) {
    throw Error('pwd is undefiled')
  }
  const installDirectory = join(__dirname, 'node_modules', '.bin')
  const binaryPath = join(installDirectory, binaryName)
  if (existsSync(binaryPath)) {
    console.log(`${binaryName} is already installed, skipping installation.`)
    return
  }
  mkdirSync(installDirectory, { recursive: true })
  console.log(`Downloading release from ${url}`)
  const binaryStream = await axios({ url, responseType: 'stream' })
  await new Promise((resolve, reject) => {
    const sink = binaryStream.data.pipe(
      tar.x({
        filter(path) {
          return path.startsWith(binaryName)
        },
        C: installDirectory,
      })
    )
    sink.on('finish', () => resolve(null))
    sink.on('error', (/** @type {Error} */ err) => reject(err))
  })
  console.log(`${binaryName} has been installed!`)
}
