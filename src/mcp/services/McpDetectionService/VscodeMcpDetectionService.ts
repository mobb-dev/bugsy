import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { BaseMcpDetectionService } from './BaseMcpDetectionService'
import type { WorkspaceResult } from './types'

export class VscodeMcpDetectionService extends BaseMcpDetectionService {
  public constructor({
    userEmail,
    userName,
    organizationId,
  }: {
    userEmail: string
    userName: string
    organizationId: string
  }) {
    super({ userEmail, userName, organizationId })
  }

  protected getWorkspaceStoragePath(): string {
    const detectedOSType = this.osType
    const homeDirectory = os.homedir()

    switch (detectedOSType) {
      case 'macos':
        return path.join(
          homeDirectory,
          'Library',
          'Application Support',
          'Code',
          'User',
          'workspaceStorage'
        )

      case 'linux': {
        const vscodeServerStoragePath = path.join(
          homeDirectory,
          '.vscode-server',
          'data',
          'User',
          'workspaceStorage'
        )
        if (fs.existsSync(vscodeServerStoragePath)) {
          return vscodeServerStoragePath
        }

        const xdgConfigHomeDirectory = process.env['XDG_CONFIG_HOME']
        if (xdgConfigHomeDirectory) {
          return path.join(
            xdgConfigHomeDirectory,
            'Code',
            'User',
            'workspaceStorage'
          )
        }
        return path.join(
          homeDirectory,
          '.config',
          'Code',
          'User',
          'workspaceStorage'
        )
      }

      case 'windows': {
        const windowsAppDataPath = process.env['APPDATA']
        if (windowsAppDataPath) {
          return path.join(
            windowsAppDataPath,
            'Code',
            'User',
            'workspaceStorage'
          )
        }
        return path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'Code',
          'User',
          'workspaceStorage'
        )
      }

      case 'wsl': {
        const wslAppDataPath = process.env['APPDATA']
        if (wslAppDataPath) {
          const unixStyleAppDataPath = wslAppDataPath.replace(/\\/g, '/')
          return path.join(
            unixStyleAppDataPath,
            'Code',
            'User',
            'workspaceStorage'
          )
        }

        const windowsUserDirectoryPath = `/mnt/c/Users/${process.env['USER'] || process.env['USERNAME']}`
        if (fs.existsSync(windowsUserDirectoryPath)) {
          return path.join(
            windowsUserDirectoryPath,
            'AppData',
            'Roaming',
            'Code',
            'User',
            'workspaceStorage'
          )
        }

        const wslVscodeServerStoragePath = path.join(
          homeDirectory,
          '.vscode-server',
          'data',
          'User',
          'workspaceStorage'
        )
        if (fs.existsSync(wslVscodeServerStoragePath)) {
          return wslVscodeServerStoragePath
        }

        const wslXdgConfigHomeDirectory = process.env['XDG_CONFIG_HOME']
        if (wslXdgConfigHomeDirectory) {
          return path.join(
            wslXdgConfigHomeDirectory,
            'Code',
            'User',
            'workspaceStorage'
          )
        }
        return path.join(
          homeDirectory,
          '.config',
          'Code',
          'User',
          'workspaceStorage'
        )
      }

      default:
        throw new Error(`Unsupported operating system: ${detectedOSType}`)
    }
  }

  protected getMcpConfigPath(workspacePath: string): string {
    return path.join(workspacePath, '.vscode', 'mcp.json')
  }

  protected getGlobalMcpConfigPath(): string | null {
    const detectedOSType = this.osType
    const homeDirectory = os.homedir()

    switch (detectedOSType) {
      case 'macos':
        return path.join(
          homeDirectory,
          'Library',
          'Application Support',
          'Code',
          'User',
          'mcp.json'
        )

      case 'linux': {
        const xdgConfigHomeDirectory = process.env['XDG_CONFIG_HOME']
        if (xdgConfigHomeDirectory) {
          return path.join(xdgConfigHomeDirectory, 'Code', 'User', 'mcp.json')
        }
        return path.join(homeDirectory, '.config', 'Code', 'User', 'mcp.json')
      }

      case 'windows': {
        const windowsAppDataPath = process.env['APPDATA']
        if (windowsAppDataPath) {
          return path.join(windowsAppDataPath, 'Code', 'User', 'mcp.json')
        }
        return path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'Code',
          'User',
          'mcp.json'
        )
      }

      case 'wsl': {
        const wslAppDataPath = process.env['APPDATA']
        if (wslAppDataPath) {
          const unixStyleAppDataPath = wslAppDataPath.replace(/\\/g, '/')
          return path.join(unixStyleAppDataPath, 'Code', 'User', 'mcp.json')
        }

        const windowsUserDirectoryPath = `/mnt/c/Users/${process.env['USER'] || process.env['USERNAME']}`
        if (fs.existsSync(windowsUserDirectoryPath)) {
          return path.join(
            windowsUserDirectoryPath,
            'AppData',
            'Roaming',
            'Code',
            'User',
            'mcp.json'
          )
        }

        const wslXdgConfigHomeDirectory = process.env['XDG_CONFIG_HOME']
        if (wslXdgConfigHomeDirectory) {
          return path.join(
            wslXdgConfigHomeDirectory,
            'Code',
            'User',
            'mcp.json'
          )
        }
        return path.join(homeDirectory, '.config', 'Code', 'User', 'mcp.json')
      }

      default:
        throw new Error(`Unsupported operating system: ${detectedOSType}`)
    }
  }

  protected shouldMergeGlobalConfig(): boolean {
    return true
  }

  protected getIdeName(): string {
    return 'VSCode'
  }

  public detect(): WorkspaceResult[] {
    const workspaceResults = this.findWorkspaces()

    const res = workspaceResults.map((workspaceResult) => {
      if (
        !workspaceResult.mcpConfig &&
        workspaceResult.workspacePath.startsWith('/') &&
        /^\/[a-zA-Z]:/.test(workspaceResult.workspacePath)
      ) {
        const normalizedWindowsPath = workspaceResult.workspacePath
          .replace(/^\/([a-zA-Z]):/, '$1:')
          .replace(/\//g, path.sep)
        const alternativeConfigPath = this.getMcpConfigPath(
          normalizedWindowsPath
        )
        const alternativeConfig = this.readMcpConfig(alternativeConfigPath)

        if (alternativeConfig && this.validateConfig(alternativeConfig)) {
          return {
            ...workspaceResult,
            mcpConfig: this.cleanConfig(alternativeConfig),
          }
        }
      }
      return workspaceResult
    })

    // Collect all MCPs from all workspace results
    const mcps: {
      ideName: string
      mcpName: string
      isRunning: boolean
      ideVersion: string
      mcpConfiguration: string
    }[] = []

    res.forEach((workspaceResult) => {
      const mcpConfig = workspaceResult.mcpConfig
      if (mcpConfig) {
        const servers = mcpConfig.mcpServers || mcpConfig.servers
        if (servers) {
          Object.entries(servers).forEach(([mcpName, serverConfig]) => {
            mcps.push({
              ideName: 'Vscode',
              mcpName,
              isRunning: false,
              ideVersion: 'Unknown',
              mcpConfiguration: JSON.stringify(serverConfig),
            })
          })
        }
      }
    })

    this.trackMcpInfo({
      status: 'ACTIVE',
      mcps: JSON.stringify(mcps),
    })

    return res
  }
}
