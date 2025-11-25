import * as fs from 'fs'
import * as os from 'os'

export type OSType = 'macos' | 'linux' | 'windows' | 'wsl'

export function detectOS(): OSType {
  const platform = os.platform()

  if (platform === 'darwin') {
    return 'macos'
  }

  if (platform === 'win32') {
    return 'windows'
  }

  if (platform === 'linux') {
    const isWSL =
      fs.existsSync('/proc/version') &&
      fs
        .readFileSync('/proc/version', 'utf-8')
        .toLowerCase()
        .includes('microsoft')

    return isWSL ? 'wsl' : 'linux'
  }

  throw new Error(`Unsupported platform: ${platform}`)
}
