import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
import Debug from 'debug'
import { globby } from 'globby'
import { isBinary } from 'istextorbinary'

const debug = Debug('mobbdev:pack')

const MAX_FILE_SIZE = 1024 * 1024 * 5

function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some(function (suffix) {
    return str.endsWith(suffix)
  })
}

export async function pack(srcDirPath: string, vulnFiles: string[]) {
  debug('pack folder %s', srcDirPath)
  const filepaths = await globby('**', {
    gitignore: true,
    onlyFiles: true,
    cwd: srcDirPath,
    followSymbolicLinks: false,
  })
  debug('files found %d', filepaths.length)

  const zip = new AdmZip()

  debug('compressing files')
  for (const filepath of filepaths) {
    const absFilepath = path.join(srcDirPath, filepath.toString())

    // the server returns relative paths in unix style
    if (
      !endsWithAny(
        absFilepath.toString().replaceAll(path.win32.sep, path.posix.sep),
        vulnFiles
      )
    ) {
      debug('ignoring %s because it is not a vulnerability file', filepath)
      continue
    }

    if (fs.lstatSync(absFilepath).size > MAX_FILE_SIZE) {
      debug('ignoring %s because the size is > 5MB', filepath)
      continue
    }

    const data = fs.readFileSync(absFilepath)

    if (isBinary(null, data)) {
      debug('ignoring %s because is seems to be a binary file', filepath)
      continue
    }

    zip.addFile(filepath.toString(), data)
  }

  debug('get zip file buffer')
  return zip.toBuffer()
}
