import fs from 'node:fs'
import path from 'node:path'

import { getDirName } from '@mobb/bugsy/utils'
import semver from 'semver'

function getPackageJson() {
  let manifestPath = path.join(getDirName(), '../package.json')

  if (!fs.existsSync(manifestPath)) {
    // In the dev environment the folder structure is a bit different.
    manifestPath = path.join(getDirName(), '../../package.json')
  }

  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
}

const packageJson = getPackageJson()
if (!semver.satisfies(process.version, packageJson.engines.node)) {
  console.error(
    `\n⚠️ ${packageJson.name} requires node version ${packageJson.engines.node}, but running ${process.version}.`
  )
  process.exit(1)
}

export { packageJson }
