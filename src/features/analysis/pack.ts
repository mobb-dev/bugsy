import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
import Debug from 'debug'
import { globby } from 'globby'
import { isBinary } from 'istextorbinary'
import { simpleGit } from 'simple-git'
import { parseStringPromise } from 'xml2js'
import { z } from 'zod'

const debug = Debug('mobbdev:pack')

const MAX_FILE_SIZE = 1024 * 1024 * 5
const FPR_SOURCE_CODE_FILE_MAPPING_SCHEMA = z.object({
  properties: z.object({
    entry: z.array(
      z.object({
        _: z.string(),
        $: z.object({
          key: z.string(),
        }),
      })
    ),
  }),
})

function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some(function (suffix) {
    return str.endsWith(suffix)
  })
}

// For now, we only support package.json and pom.xml files.
function _get_manifest_files_suffixes() {
  return ['package.json', 'pom.xml']
}

export async function pack(
  srcDirPath: string,
  vulnFiles: string[],
  isIncludeAllFiles: boolean = false
) {
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

    if (!isIncludeAllFiles) {
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

export async function repackFpr(fprPath: string) {
  debug('repack fpr file %s', fprPath)

  const zipIn = new AdmZip(fprPath)
  const zipOut = new AdmZip()
  const mappingXML = zipIn.readAsText('src-archive/index.xml', 'utf-8')
  const filesMapping = FPR_SOURCE_CODE_FILE_MAPPING_SCHEMA.parse(
    await parseStringPromise(mappingXML)
  )

  for (const fileMapping of filesMapping.properties.entry) {
    const zipPath = fileMapping._
    const realPath = fileMapping.$.key
    const buf = zipIn.readFile(zipPath)

    if (buf) {
      zipOut.addFile(realPath, buf)
    }
  }

  debug('get repacked zip file buffer')
  return zipOut.toBuffer()
}
