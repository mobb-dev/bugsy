import { logWarn } from '@mobb/bugsy/mcp/Logger'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

type MCPServerConfig = {
  command?: string
  url?: string
  args?: string[]
  [key: string]: unknown
}

type MCPConfig = {
  mcpServers?: {
    [name: string]: MCPServerConfig
  }
  servers?: {
    [name: string]: MCPServerConfig
  }
  projects?: {
    [projectPath: string]: {
      mcpServers?: {
        [name: string]: MCPServerConfig
      }
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

const IDEs = ['cursor', 'windsurf', 'webstorm', 'vscode', 'claude']

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

const getClaudeWorkspacePaths = (): string[] => {
  const home = os.homedir()
  const claudeIdePath = path.join(home, '.claude', 'ide')
  const workspacePaths: string[] = []

  if (!fs.existsSync(claudeIdePath)) {
    return workspacePaths
  }

  try {
    const lockFiles = fs
      .readdirSync(claudeIdePath)
      .filter((file) => file.endsWith('.lock'))

    for (const lockFile of lockFiles) {
      const lockFilePath = path.join(claudeIdePath, lockFile)
      try {
        const lockContent = JSON.parse(fs.readFileSync(lockFilePath, 'utf8'))
        if (
          lockContent.workspaceFolders &&
          Array.isArray(lockContent.workspaceFolders)
        ) {
          workspacePaths.push(...lockContent.workspaceFolders)
        }
      } catch (error) {
        logWarn(
          `[UsageService] Failed to read Claude lock file: ${lockFilePath}`
        )
      }
    }
  } catch (error) {
    logWarn(
      `[UsageService] Failed to read Claude IDE directory: ${claudeIdePath}`
    )
  }

  return workspacePaths
}

const getMCPConfigPaths = (hostName: string): string[] => {
  const home = os.homedir()
  const currentDir =
    process.env['WORKSPACE_FOLDER_PATHS'] || process.env['PWD'] || process.cwd()

  switch (hostName.toLowerCase()) {
    case 'cursor':
      return [
        path.join(currentDir, '.cursor', 'mcp.json'), // local first
        path.join(home, '.cursor', 'mcp.json'),
      ]
    case 'windsurf':
      return [
        path.join(currentDir, '.codeium', 'mcp_config.json'), // local first
        path.join(home, '.codeium', 'windsurf', 'mcp_config.json'),
      ]
    case 'webstorm':
      return []
    case 'visualstudiocode':
    case 'vscode':
      return [
        path.join(currentDir, '.vscode', 'mcp.json'), // local first
        process.platform === 'win32'
          ? path.join(home, 'AppData', 'Roaming', 'Code', 'User', 'mcp.json')
          : path.join(
              home,
              'Library',
              'Application Support',
              'Code',
              'User',
              'mcp.json'
            ),
      ]
    case 'claude': {
      const claudePaths = [
        path.join(currentDir, '.claude.json'), // local first
        path.join(home, '.claude.json'),
      ]

      const workspacePaths = getClaudeWorkspacePaths()
      for (const workspacePath of workspacePaths) {
        claudePaths.push(path.join(workspacePath, '.mcp.json'))
      }

      return claudePaths
    }
    default:
      throw new Error(`Unknown hostName: ${hostName}`)
  }
}

const readConfigFile = (filePath: string): MCPConfig | null => {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    logWarn(`[UsageService] Failed to read MCP config: ${filePath}`)
    return null
  }
}

const mergeConfigIntoResult = (
  config: MCPConfig,
  mergedConfig: MCPConfig
): void => {
  // Handle Claude's special project structure
  if (config?.projects) {
    const allMcpServers: { [name: string]: MCPServerConfig } = {}
    for (const projectPath in config.projects) {
      const project = config.projects[projectPath]
      if (project?.mcpServers) {
        Object.assign(allMcpServers, project.mcpServers)
      }
    }
    mergedConfig.mcpServers = { ...mergedConfig.mcpServers, ...allMcpServers }
  }

  // Handle regular mcpServers and servers
  if (config?.mcpServers) {
    mergedConfig.mcpServers = {
      ...mergedConfig.mcpServers,
      ...config.mcpServers,
    }
  }
  if (config?.servers) {
    mergedConfig.servers = { ...mergedConfig.servers, ...config.servers }
  }
}

const readMCPConfig = (hostName: string): MCPConfig | null => {
  const configPaths = getMCPConfigPaths(hostName)

  // Read all configs and merge them (later paths override earlier ones)
  const mergedConfig: MCPConfig = {}

  for (const configPath of configPaths) {
    const config = readConfigFile(configPath)
    if (config) {
      mergeConfigIntoResult(config, mergedConfig)
    }
  }

  return Object.keys(mergedConfig).length > 0 ? mergedConfig : null
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

const checkUrlAccessibility = (url: string): boolean => {
  try {
    // Use curl to check if the URL is accessible
    // For SSE endpoints, we need to handle timeout as success since the server is responding
    execSync(`curl -s --connect-timeout 5 --max-time 3 "${url}"`, {
      encoding: 'utf8',
      stdio: 'ignore',
    })
    return true
  } catch (error) {
    // Check if it's a timeout error (exit code 28) which means the server responded
    if (error && typeof error === 'object' && 'status' in error) {
      const exitCode = (error as { status: number }).status
      // Exit code 28 is timeout, which for SSE means the server is responding
      if (exitCode === 28) {
        return true
      }
    }
    return false
  }
}

const knownHosts: Record<string, string> = {
  webstorm: 'WebStorm',
  cursor: 'Cursor',
  windsurf: 'Windsurf',
  code: 'Vscode',
  claude: 'Claude',
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
  Claude: {
    darwin: [
      'claude --version',
      "grep -A1 CFBundleVersion \"/Applications/Claude.app/Contents/Info.plist\" | grep '<string>' | sed -E 's/.*<string>(.*)<\\/string>.*/\\1/'",
    ],
    win32: [
      'claude --version',
      `(Get-Item "$env:LOCALAPPDATA\\Programs\\Claude\\Claude.exe").VersionInfo.ProductVersion`,
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

export const getCurrentProcessIDE = (): string => {
  const currentPid = process.pid
  let currentPidToCheck = currentPid

  // Walk up the process tree to find the IDE
  while (currentPidToCheck && currentPidToCheck !== 0) {
    const proc = getProcessInfo(currentPidToCheck)
    if (!proc) break

    const cmdProc = proc.cmd.toLowerCase()
    const found = Object.keys(knownHosts).find((key) => cmdProc.includes(key))

    if (found) {
      return knownHosts[found] || 'Unknown'
    }

    currentPidToCheck = parseInt(proc.ppid, 10)
  }

  return 'Unknown'
}

export const getHostInfo = (
  additionalMcpList: string[]
): {
  mcps: MCPServerInfo[]
  user: typeof gitInfo
} => {
  const runningProcesses = getRunningProcesses().toLowerCase()
  const results: MCPServerInfo[] = []
  const allConfigs: Record<string, MCPConfig> = {}

  // Collect all IDE-specific config paths to avoid duplicates
  const ideConfigPaths = new Set<string>()
  for (const ide of IDEs) {
    const configPaths = getMCPConfigPaths(ide)
    configPaths.forEach((path) => ideConfigPaths.add(path))
  }

  // Filter additionalMcpList to only include paths not already handled by IDEs
  const uniqueAdditionalPaths = additionalMcpList.filter(
    (path) => !ideConfigPaths.has(path)
  )

  // load all configs once
  for (const ide of IDEs) {
    const cfg = readMCPConfig(ide)
    if (cfg) allConfigs[ide] = cfg
  }

  // Process only unique additional MCP configs (paths not handled by IDEs)
  for (const additionalPath of uniqueAdditionalPaths) {
    const config = readConfigFile(additionalPath)
    if (!config) continue
    const mergedConfig: MCPConfig = {}

    mergeConfigIntoResult(config, mergedConfig)

    if (Object.keys(mergedConfig).length > 0) {
      allConfigs['system'] = mergedConfig
    }
  }

  // gather all servers from configs
  const servers: {
    ide: string
    name: string
    command: string
    isRunning: boolean
    url?: string
  }[] = []
  for (const [ide, cfg] of Object.entries(allConfigs)) {
    for (const [name, server] of Object.entries(
      cfg.mcpServers || cfg.servers || {}
    )) {
      // Only process command-based servers, skip URL-based servers
      if (server.command || server.url) {
        servers.push({
          ide,
          name,
          command: `${server.command} ${server.args ? server.args?.join(' ') : ''}`,
          isRunning: false,
          ...(server.url && { url: server.url }),
        })
      }
    }
  }

  const runningLines = runningProcesses.split('\n')

  for (const line of runningLines) {
    if (line.includes('mcp')) {
      const cmdLower = line.toLowerCase()

      // First, detect the IDE from the process tree
      let ideName: string = 'Unknown'

      // Try to get PID from the process line
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

      // Now find the server that matches both the command AND the IDE
      const existingServer = servers.find(
        (s) =>
          s.command &&
          cmdLower.includes(s.command.toLowerCase()) &&
          s.ide.toLowerCase() === ideName.toLowerCase()
      )

      if (existingServer) {
        existingServer.isRunning = true
      } else {
        // If no exact match found, add as unknown server with detected IDE
        servers.push({
          ide: ideName.toLowerCase(),
          name: 'unknown',
          command: line.trim(),
          isRunning: true,
        })
      }
    }
  }

  // Check URL-based servers for accessibility
  for (const server of servers) {
    if (server.url && !server.isRunning) {
      const isUrlAccessible = checkUrlAccessibility(server.url)
      if (isUrlAccessible) {
        server.isRunning = true
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
