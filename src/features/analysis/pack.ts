import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
import Debug from 'debug'
import { globby } from 'globby'
import { isBinary } from 'istextorbinary'
import { simpleGit } from 'simple-git'

const debug = Debug('mobbdev:pack')

const MAX_FILE_SIZE = 1024 * 1024 * 5

function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some(function (suffix) {
    return str.endsWith(suffix)
  })
}

//For now we only support package.json files
function _get_manifest_files_suffixes() {
  return ['package.json']
}

export async function pack(srcDirPath: string, vulnFiles: string[]) {
  debug('pack folder %s', srcDirPath)
  let git = undefined
  try {
    git = simpleGit({
      baseDir: srcDirPath,
      maxConcurrentProcesses: 1,
      trimmed: true,
    })
    await git.status()
  } catch (e) {
    debug('failed to run git %o', e)
    git = undefined
    if (e instanceof Error) {
      if (e.message.includes(' spawn ')) {
        debug('git cli not installed')
      } else if (e.message.includes('not a git repository')) {
        debug('folder is not a git repo')
      } else {
        throw e
      }
    } else {
      throw e
    }
  }
  const filepaths = await globby('**', {
    gitignore: true,
    onlyFiles: true,
    cwd: srcDirPath,
    followSymbolicLinks: false,
    dot: true,
  })
  debug('files found %d', filepaths.length)

  const zip = new AdmZip()

  debug('compressing files')
  for (const filepath of filepaths) {
    const absFilepath = path.join(srcDirPath, filepath.toString())

    //make sure we send manifest files of the code the Mobb server for analysis
    vulnFiles = vulnFiles.concat(_get_manifest_files_suffixes())

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

    const data = git
      ? await git.showBuffer([`HEAD:./${filepath}`])
      : fs.readFileSync(absFilepath)

    if (isBinary(null, data)) {
      debug('ignoring %s because is seems to be a binary file', filepath)
      continue
    }

    zip.addFile(filepath.toString(), data)
  }

  debug('get zip file buffer')
  return zip.toBuffer()
}
