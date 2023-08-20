import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
import Debug from 'debug'
import { globby } from 'globby'

const debug = Debug('mobbdev:pack')

export async function pack(srcDirPath: string) {
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
    zip.addFile(
      filepath.toString(),
      fs.readFileSync(path.join(srcDirPath, filepath.toString()))
    )
  }

  debug('get zip file buffer')
  return zip.toBuffer()
}
