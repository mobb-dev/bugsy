// this file is based from 'binary-install' https://www.npmjs.com/package/binary-install
import AdmZip from 'adm-zip'
import axios from 'axios'
import { existsSync, mkdirSync } from 'fs'
import { arch as _arch, type as _type } from 'os'
import { join } from 'path'
import tar from 'tar'

/**
 * Options for showing a installParams.
 * @typedef {Object} InstallParams
 * @property {string} installParams.binaryName
 * @property {string} installParams.url
 */

/**
 * @param {string} url
 * @returns {string}
 */
function getArchiveType(url) {
  if (url.endsWith('.zip')) {
    return 'zip'
  }
  if (url.endsWith('.tar.gz')) {
    return 'tar'
  }
  throw Error(`Unknown archive type for ${url}`)
}

/**
 * @param {InstallParams} opts
 * @returns {Promise<void>}
 */

export async function install({ binaryName, url }) {
  const installDirectory = join(process.cwd(), 'node_modules', '.bin')
  const binaryPath = join(installDirectory, binaryName)
  if (existsSync(binaryPath)) {
    console.log(`${binaryName} is already installed, skipping installation.`)
    return
  }
  const archiveType = getArchiveType(url)
  mkdirSync(installDirectory, { recursive: true })
  console.log(`Downloading release from ${url}`)
  archiveType === 'zip'
    ? await installZip({ binaryName, url, installDirectory })
    : await installTar({ binaryName, url, installDirectory })

  console.log(`${binaryName} has been installed!`)
}

/**
 * @typedef {object} InstallDirectory
 * @property {string} installDirectory
 *  @typedef {InstallParams & InstallDirectory} ArchiveInstallParams
 **/

/**
 * @param {ArchiveInstallParams} opts
 * @returns {Promise<void>}
 */
async function installTar({ binaryName, url, installDirectory }) {
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
}

/**
 * @param {ArchiveInstallParams} opts
 * @returns {Promise<void>}
 */
async function installZip({ binaryName, url, installDirectory }) {
  const body = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  var zip = new AdmZip(body.data)
  zip.extractEntryTo(binaryName, installDirectory)
}
