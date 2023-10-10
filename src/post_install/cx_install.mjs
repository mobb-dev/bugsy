import { arch as _arch, type as _type } from 'os'

import { install } from './binary.mjs'
import { cxOperatingSystemSupportMessage } from './constants.mjs'

const supportedPlatforms = [
  {
    type: 'Windows_NT',
    architecture: 'x64',
    target: 'windows_x64.zip',
  },
  {
    type: 'Linux',
    architecture: 'x64',
    target: 'linux_x64.tar.gz',
  },
  {
    type: 'Linux',
    architecture: 'arm',
    target: 'linux_arm6.tar.gz',
  },
  {
    type: 'Linux',
    architecture: 'arm64',
    target: 'linux_arm64.tar.gz',
  },
  {
    type: 'Darwin',
    architecture: 'arm64',
    target: 'darwin_x64.tar.gz',
  },
]

function installBinary() {
  const supportedPlatform = getPlatformMetadata()
  if (!supportedPlatform) {
    console.warn(cxOperatingSystemSupportMessage)
    console.warn(
      'The rest of Bugsy features and scanners will be available for use'
    )
    return
  }
  const { target } = supportedPlatform

  const url = `https://github.com/Checkmarx/ast-cli/releases/download/2.0.55/ast-cli_${target}`
  const binaryName = 'cx'

  install({ binaryName, url })
}

export function getPlatformMetadata() {
  const type = _type()
  const architecture = _arch()

  for (const supportedPlatform of supportedPlatforms) {
    if (
      type === supportedPlatform.type &&
      architecture === supportedPlatform.architecture
    ) {
      return supportedPlatform
    }
  }

  return null
}

installBinary()
