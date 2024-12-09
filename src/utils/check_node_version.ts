import fs from 'node:fs'
import path from 'node:path'

import { getDirName } from '@mobb/bugsy/utils'
import semver from 'semver'

const packageJson = JSON.parse(
  fs.readFileSync(path.join(getDirName(), '../package.json'), 'utf8')
)
if (!semver.satisfies(process.version, packageJson.engines.node)) {
  console.error(
    `\n⚠️ ${packageJson.name} requires node version ${packageJson.engines.node}, but running ${process.version}.`
  )
  process.exit(1)
}

export { packageJson }
