import fs from 'node:fs'
import path from 'node:path'

import semver from 'semver'

import { getModuleRootDir } from './dirname'

function getPackageJson() {
  return JSON.parse(
    fs.readFileSync(path.join(getModuleRootDir(), 'package.json'), 'utf8')
  )
}

const packageJson = getPackageJson()
if (!semver.satisfies(process.version, packageJson.engines.node)) {
  console.error(
    `\n⚠️ ${packageJson.name} requires node version ${packageJson.engines.node}, but running ${process.version}.`
  )
  process.exit(1)
}

export { packageJson }
