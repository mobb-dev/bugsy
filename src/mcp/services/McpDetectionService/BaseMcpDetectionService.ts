import * as fs from 'fs'
import fetch from 'node-fetch'
import * as path from 'path'

import { MCP_DEFAULT_REST_API_URL } from '../../core/configs'
import { logDebug, logInfo, logWarn } from '../../Logger'
import { detectOS, OSType } from './McpDetectionServiceUtils'
import type {
  MCPConfig,
  MCPServerConfig,
  WorkspaceInfo,
  WorkspaceResult,
} from './types'

export abstract class BaseMcpDetectionService {
  protected organizationId: string
  protected userEmail: string
  protected userName: string
  protected osType: OSType
  // private intervalId: NodeJS.Timeout | null = null
  private REST_API_URL: string = MCP_DEFAULT_REST_API_URL
  protected abstract getWorkspaceStoragePath(): string
  protected abstract getMcpConfigPath(workspacePath: string): string
  protected abstract getGlobalMcpConfigPath(): string | null
  protected abstract shouldMergeGlobalConfig(): boolean
  public abstract detect(): WorkspaceResult[]
  protected abstract getIdeName(): string

  public constructor({
    userEmail,
    userName,
    organizationId,
  }: {
    userEmail: string
    userName: string
    organizationId: string
  }) {
    this.userEmail = userEmail
    this.userName = userName
    this.organizationId = organizationId
    this.osType = detectOS()
    if (process.env['API_URL']) {
      const url = new URL(process.env['API_URL'])
      const domain = `${url.protocol}//${url.host}`
      this.REST_API_URL = `${domain}/api/rest/mcp/track`
    }
  }

  protected validateConfig(config: MCPConfig | null): boolean {
    if (!config) {
      return false
    }

    const hasMcpServers = Boolean(
      config.mcpServers && Object.keys(config.mcpServers).length > 0
    )
    const hasServers = Boolean(
      config.servers && Object.keys(config.servers).length > 0
    )

    return hasMcpServers || hasServers
  }

  protected cleanConfig(config: MCPConfig): MCPConfig {
    const cleanedConfig: {
      mcpServers?: Record<string, MCPServerConfig>
      servers?: Record<string, MCPServerConfig>
    } = {}

    if (config.mcpServers && Object.keys(config.mcpServers).length > 0) {
      cleanedConfig.mcpServers = config.mcpServers
    }
    if (config.servers && Object.keys(config.servers).length > 0) {
      cleanedConfig.servers = config.servers
    }

    return cleanedConfig as MCPConfig
  }

  protected removeFileProtocol(uri: string): string {
    return uri.startsWith('file://') ? uri.substring(7) : uri
  }

  protected safeDecodeURIComponent(encodedUri: string): string {
    try {
      return decodeURIComponent(encodedUri)
    } catch {
      return encodedUri
    }
  }

  protected normalizePath(filePath: string): string {
    const unixStyleWindowsPathMatch = /^\/([a-zA-Z]):\//.exec(filePath)

    if (unixStyleWindowsPathMatch?.[1]) {
      const driveLetter = unixStyleWindowsPathMatch[1].toUpperCase()
      const pathAfterDrive = filePath.substring(3)
      return `${driveLetter}:\\${pathAfterDrive.replace(/\//g, '\\')}`
    }

    return filePath
  }

  protected getWorkspacePath(workspaceInfo: WorkspaceInfo): string | null {
    let extractedWorkspacePath: string | null = null

    if (workspaceInfo.folder) {
      const folderUri = this.removeFileProtocol(workspaceInfo.folder)
      extractedWorkspacePath = this.safeDecodeURIComponent(folderUri)
    } else if (workspaceInfo.workspace?.uri) {
      const workspaceUri = this.removeFileProtocol(workspaceInfo.workspace.uri)
      extractedWorkspacePath = this.safeDecodeURIComponent(workspaceUri)
    }

    if (!extractedWorkspacePath) {
      return null
    }

    return this.normalizePath(extractedWorkspacePath)
  }

  protected readJSONFile<T>(filePath: string): T | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const parsedContent = JSON.parse(fileContent) as unknown

      return parsedContent as T
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logWarn(`Error reading ${filePath}: ${errorMessage}`)
      return null
    }
  }

  protected readMcpConfig(configFilePath: string): MCPConfig | null {
    return this.readJSONFile<MCPConfig>(configFilePath)
  }

  protected findWorkspaces(): WorkspaceResult[] {
    const workspaceStoragePath = this.getWorkspaceStoragePath()
    const workspaceResults: WorkspaceResult[] = []

    const globalConfigFilePath = this.getGlobalMcpConfigPath()
    let globalConfig: MCPConfig | null = null
    if (globalConfigFilePath && fs.existsSync(globalConfigFilePath)) {
      globalConfig = this.readMcpConfig(globalConfigFilePath)
    }

    if (!fs.existsSync(workspaceStoragePath)) {
      logInfo(
        `${this.getIdeName()} workspace storage directory not found at: ${workspaceStoragePath}`
      )

      if (this.validateConfig(globalConfig)) {
        workspaceResults.push({
          workspacePath: globalConfigFilePath!,
          storageId: 'global',
          mcpConfig: this.cleanConfig(globalConfig!),
        })
      }
      return workspaceResults
    }

    try {
      const storageEntries = fs.readdirSync(workspaceStoragePath, {
        withFileTypes: true,
      })

      for (const storageEntry of storageEntries) {
        if (!storageEntry.isDirectory()) {
          continue
        }

        const workspaceDirectoryPath = path.join(
          workspaceStoragePath,
          storageEntry.name
        )
        const workspaceJsonFilePath = path.join(
          workspaceDirectoryPath,
          'workspace.json'
        )

        if (!fs.existsSync(workspaceJsonFilePath)) {
          continue
        }

        const workspaceInfo = this.readJSONFile<WorkspaceInfo>(
          workspaceJsonFilePath
        )
        if (!workspaceInfo) {
          continue
        }

        const extractedWorkspacePath = this.getWorkspacePath(workspaceInfo)
        if (!extractedWorkspacePath) {
          continue
        }

        const resolvedConfig = this.resolveConfigForWorkspace(
          extractedWorkspacePath,
          globalConfig
        )

        workspaceResults.push({
          workspacePath: extractedWorkspacePath,
          storageId: storageEntry.name,
          mcpConfig: resolvedConfig,
        })
      }
    } catch (error) {
      logWarn(`Error reading ${this.getIdeName()} workspaces: ${error}`)
    }

    if (this.shouldMergeGlobalConfig() && this.validateConfig(globalConfig)) {
      const existingWorkspacePaths = new Set(
        workspaceResults.map((result) => result.workspacePath)
      )
      if (!existingWorkspacePaths.has(globalConfigFilePath!)) {
        workspaceResults.push({
          workspacePath: globalConfigFilePath!,
          storageId: 'global',
          mcpConfig: this.cleanConfig(globalConfig!),
        })
      }
    }

    return workspaceResults
  }

  protected resolveConfigForWorkspace(
    workspacePath: string,
    globalConfig: MCPConfig | null
  ): MCPConfig | null {
    const localConfigFilePath = this.getMcpConfigPath(workspacePath)
    const localConfig = this.readMcpConfig(localConfigFilePath)

    if (!this.shouldMergeGlobalConfig()) {
      if (this.validateConfig(localConfig)) {
        return this.cleanConfig(localConfig!)
      }
      return null
    }

    const mergedConfig: {
      mcpServers?: Record<string, MCPServerConfig>
      servers?: Record<string, MCPServerConfig>
    } = {}

    if (globalConfig) {
      if (
        globalConfig.mcpServers &&
        Object.keys(globalConfig.mcpServers).length > 0
      ) {
        mergedConfig.mcpServers = { ...globalConfig.mcpServers }
      }
      if (
        globalConfig.servers &&
        Object.keys(globalConfig.servers).length > 0
      ) {
        mergedConfig.servers = { ...globalConfig.servers }
      }
    }

    if (localConfig) {
      if (
        localConfig.mcpServers &&
        Object.keys(localConfig.mcpServers).length > 0
      ) {
        mergedConfig.mcpServers = {
          ...mergedConfig.mcpServers,
          ...localConfig.mcpServers,
        }
      }
      if (localConfig.servers && Object.keys(localConfig.servers).length > 0) {
        mergedConfig.servers = {
          ...mergedConfig.servers,
          ...localConfig.servers,
        }
      }
    }

    if (
      mergedConfig.mcpServers &&
      Object.keys(mergedConfig.mcpServers).length === 0
    ) {
      delete mergedConfig.mcpServers
    }
    if (
      mergedConfig.servers &&
      Object.keys(mergedConfig.servers).length === 0
    ) {
      delete mergedConfig.servers
    }

    if (Object.keys(mergedConfig).length > 0) {
      return mergedConfig as MCPConfig
    }

    if (this.validateConfig(localConfig)) {
      return this.cleanConfig(localConfig!)
    }

    if (this.validateConfig(globalConfig)) {
      return this.cleanConfig(globalConfig!)
    }

    return null
  }

  protected async trackMcpInfo({
    status,
    mcps,
  }: {
    status: 'ACTIVE' | 'INACTIVE'
    mcps: string
  }) {
    try {
      const res = await fetch(this.REST_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: this.organizationId,
          mcps,
          status,
          osName: this.osType,
          userFullName: this.userName,
          userEmail: this.userEmail,
        }),
      })
      const authResult = await res.json()
      logDebug('[UsageService] Success usage data', { authResult })
    } catch (err) {
      logDebug('[UsageService] Error usage data', { err })
    }
  }
}
