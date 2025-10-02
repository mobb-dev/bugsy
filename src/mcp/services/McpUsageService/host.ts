import { logWarn } from '@mobb/bugsy/mcp/Logger'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

type MCPConfig = {
  mcpServers?: { [name: string]: { command: string; args?: string[] } }
  servers?: {
    [name: string]: {
      command: string
      args?: string[]
      type?: string
      version?: string
    }
  }
}

type MCPServerInfo = {
  mcpName: string
  mcpConfiguration: string
  ideName: string
  ideVersion: string
  isRunning: boolean
}

const IDEs = ['cursor', 'windsurf', 'webstorm', 'vscode']

const runCommand = (cmd: string): string => {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const gitInfo = {
  name: runCommand('git config user.name'),
  email: runCommand('git config user.email'),
}

const getMCPConfigPath = (hostName: string): string => {
  const home = os.homedir()
  switch (hostName.toLowerCase()) {
    case 'cursor':
      return path.join(home, '.cursor', 'mcp.json')
    case 'windsurf':
      return path.join(home, '.codeium', 'windsurf', 'mcp_config.json')
    case 'webstorm':
      return ''
    case 'visualstudiocode':
    case 'vscode':
      return process.platform === 'win32'
        ? path.join(home, 'AppData', 'Roaming', 'Code', 'User', 'mcp.json')
        : path.join(
            home,
            'Library',
            'Application Support',
            'Code',
            'User',
            'mcp.json'
          )
    default:
      throw new Error(`Unknown hostName: ${hostName}`)
  }
}

const readMCPConfig = (hostName: string): MCPConfig | null => {
  const filePath = getMCPConfigPath(hostName)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const getRunningProcesses = (): string => {
  try {
    return os.platform() === 'win32'
      ? execSync('tasklist', { encoding: 'utf8' })
      : execSync('ps aux', { encoding: 'utf8' })
  } catch {
    return ''
  }
}

const knownHosts: Record<string, string> = {
  webstorm: 'WebStorm',
  cursor: 'Cursor',
  windsurf: 'Windsurf',
  code: 'Vscode',
}

const versionCommands: Record<string, Partial<Record<string, string[]>>> = {
  WebStorm: {
    darwin: [
      "grep -m1 '\"version\"' /Applications/WebStorm.app/Contents/Resources/product-info.json | cut -d'\"' -f4",
    ],
    win32: [],
  },
  Cursor: {
    darwin: [
      "grep -A1 CFBundleVersion /Applications/Cursor.app/Contents/Info.plist | grep '<string>' | sed -E 's/.*<string>(.*)<\\/string>.*/\\1/'",
      'cursor --version',
    ],
    win32: [
      '(Get-Item "$env:LOCALAPPDATA\\Programs\\cursor\\Cursor.exe").VersionInfo.ProductVersion',
    ],
  },
  Windsurf: {
    darwin: [
      "grep -A1 CFBundleVersion /Applications/Windsurf.app/Contents/Info.plist | grep '<string>' | sed -E 's/.*<string>(.*)<\\/string>.*/\\1/'",
      'windsurf --version',
    ],
    win32: [
      `(Get-Item "$env:LOCALAPPDATA\\Programs\\Windsurf\\Windsurf.exe").VersionInfo.ProductVersion`,
    ],
  },
  Vscode: {
    darwin: [
      "grep -A1 CFBundleVersion \"/Applications/Visual Studio Code.app/Contents/Info.plist\" | grep '<string>' | sed -E 's/.*<string>(.*)<\\/string>.*/\\1/'",
      process.env['TERM_PROGRAM_VERSION'] || 'Unknown',
    ],
    win32: [
      `(Get-Item "$env:LOCALAPPDATA\\Programs\\Microsoft VS Code\\Code.exe").VersionInfo.ProductVersion`,
    ],
  },
}

type ProcessInfo = {
  pid: string
  ppid: string
  cmd: string
}

const getProcessInfo = (pid: number): ProcessInfo | null => {
  const platform = os.platform()

  try {
    if (platform === 'linux' || platform === 'darwin') {
      const output = execSync(`ps -o pid=,ppid=,comm= -p ${pid}`, {
        stdio: ['pipe', 'pipe', 'ignore'],
      })
        .toString()
        .trim()

      if (!output) return null
      const [pidStr, ppid, ...cmd] = output.trim().split(/\s+/)
      return { pid: pidStr ?? '', ppid: ppid ?? '', cmd: cmd.join(' ') }
    } else if (platform === 'win32') {
      const output = execSync(
        `powershell -Command "Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}' | Select-Object ProcessId,ParentProcessId,Name | Format-Table -HideTableHeaders"`,
        { stdio: ['pipe', 'pipe', 'ignore'] }
      )
        .toString()
        .trim()

      if (!output) return null
      const parts = output.split(/\s+/)
      const pidStr = parts[0]
      const ppid = parts[1]
      const cmd = parts.slice(2).join(' ')
      return { pid: pidStr ?? '', ppid: ppid ?? '', cmd }
    } else {
      logWarn(`[UsageService] Unsupported platform: ${platform}`)
      return null
    }
  } catch {
    return null
  }
}

export const getHostInfo = (): {
  mcps: MCPServerInfo[]
  user: typeof gitInfo
} => {
  const runningProcesses = getRunningProcesses().toLowerCase()
  const results: MCPServerInfo[] = []
  const allConfigs: Record<string, MCPConfig> = {}

  // load all configs once
  for (const ide of IDEs) {
    const cfg = readMCPConfig(ide)
    if (cfg) allConfigs[ide] = cfg
  }

  // gather all servers from configs
  const servers: {
    ide: string
    name: string
    command: string
    isRunning: boolean
  }[] = []
  for (const [ide, cfg] of Object.entries(allConfigs)) {
    for (const [name, server] of Object.entries(
      cfg.mcpServers || cfg.servers || {}
    )) {
      // if (server.command)
      servers.push({
        ide,
        name,
        command: server.command || '',
        isRunning: false,
      })
    }
  }

  const runningLines = runningProcesses.split('\n')

  for (const line of runningLines) {
    if (line.includes('mcp')) {
      const cmdLower = line.toLowerCase()
      const existingServer = servers.find(
        (s) => s.command && cmdLower.includes(s.command.toLowerCase())
      )
      if (existingServer) {
        existingServer.isRunning = true
      } else {
        // fallback IDE detection
        let ideName: string = 'Unknown'

        // first try knownHosts detection from command line
        const foundHostKey = Object.keys(knownHosts).find((key) =>
          cmdLower.includes(key)
        )
        if (foundHostKey) {
          ideName = knownHosts[foundHostKey] || 'Unknown'
        } else {
          // fallback: walk process tree using getProcessInfo
          const pidMatch = line.trim().split(/\s+/)[1] // ps aux: PID is usually 2nd column
          const pid = parseInt(String(pidMatch), 10)
          if (!isNaN(pid)) {
            let currentPid = pid
            while (currentPid && currentPid !== 0) {
              const proc = getProcessInfo(currentPid)
              if (!proc) break

              const cmdProc = proc.cmd.toLowerCase()
              const found = Object.keys(knownHosts).find((key) =>
                cmdProc.includes(key)
              )
              if (found) {
                ideName = knownHosts[found] || 'Unknown'
                break
              }
              currentPid = parseInt(proc.ppid, 10)
            }
          }
        }

        servers.push({
          ide: ideName.toLowerCase(),
          name: 'unknown',
          command: line.trim(),
          isRunning: true,
        })
      }
    }
  }

  for (const { ide, name, command, isRunning } of servers) {
    const config = allConfigs[ide] || null
    const ideName = ide.charAt(0).toUpperCase() + ide.slice(1) || 'Unknown'
    let ideVersion = 'Unknown'

    const platform = os.platform()
    const cmds =
      versionCommands[ideName as keyof typeof versionCommands]?.[platform] ?? []

    for (const cmd of cmds) {
      try {
        const versionOutput =
          cmd.includes('grep') ||
          cmd.includes('--version') ||
          cmd.includes('sed')
            ? (execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] })
                .toString()
                .split('\n')[0] ?? '')
            : cmd
        if (versionOutput && versionOutput !== 'Unknown') {
          ideVersion = versionOutput
          break
        }
      } catch {
        continue
      }
    }

    let mcpConfigObj = {}
    if (config) {
      const allServers = config.mcpServers || config.servers || {}
      if (name in allServers && allServers[name]) {
        mcpConfigObj = allServers[name]
      }
    }

    results.push({
      mcpName: name || command,
      mcpConfiguration: JSON.stringify(mcpConfigObj),
      ideName: ideName || 'Unknown',
      ideVersion: ideVersion || 'Unknown',
      isRunning,
    })
  }

  return { mcps: results, user: gitInfo }
}
