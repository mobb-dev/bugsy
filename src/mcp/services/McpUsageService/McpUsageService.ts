import {
  MCP_DEFAULT_REST_API_URL,
  MCP_PERIODIC_TRACK_INTERVAL,
} from '@mobb/bugsy/mcp/core/configs'
import { packageJson } from '@mobb/bugsy/utils'
import fetch from 'node-fetch'
import os from 'os'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'

import { logDebug, logError, logInfo } from '../../Logger'
import { configStore } from '../ConfigStoreService'
import { getHostInfo } from './host'

export type McpUsageData = {
  mcpHostId: string
  organizationId: string
  mcpVersion: string
  mcpOsName: string
  mcps: string
  userName: string
  userEmail: string
  status: 'ACTIVE' | 'INACTIVE' | 'FAILED'
  date: string
}

export type McpUsageConfig = McpUsageData

class McpUsageService {
  private readonly configKey = 'mcpUsage'
  private intervalId: NodeJS.Timeout | null = null
  private REST_API_URL: string = MCP_DEFAULT_REST_API_URL

  public constructor() {
    this.startPeriodicTracking()
    if (process.env['API_URL']) {
      const url = new URL(process.env['API_URL'])
      const domain = `${url.protocol}//${url.host}`
      this.REST_API_URL = `${domain}/api/rest/mcp/track`
    }
  }

  private startPeriodicTracking(): void {
    if (!this.hasOrganizationId()) {
      logDebug(
        `[UsageService] Not starting periodic tracking - organization ID not available`
      )
      return
    }

    logDebug(`[UsageService] Starting periodic tracking for mcps`, {})

    this.intervalId = setInterval(async () => {
      logDebug(`[UsageService] Triggering periodic usage service`, {
        MCP_PERIODIC_TRACK_INTERVAL,
      })
      await mcpUsageService.trackServerStart()
    }, 10000)
  }

  private generateHostId(): string {
    const stored = configStore.get(this.configKey) as McpUsageData | undefined
    if (stored?.mcpHostId) return stored.mcpHostId

    const interfaces = os.networkInterfaces()
    const macs: string[] = []

    for (const iface of Object.values(interfaces)) {
      if (!iface) continue
      for (const net of iface) {
        if (net.mac && net.mac !== '00:00:00:00:00:00') macs.push(net.mac)
      }
    }

    const macString = macs.length
      ? macs.sort().join(',')
      : `${os.hostname()}-${uuidv4()}`
    const hostId = uuidv5(macString, uuidv5.DNS)
    logDebug('[UsageService] Generated new host ID', { hostId })
    return hostId
  }

  private getOrganizationId(): string {
    const organizationId = configStore.get('GOV-ORG-ID') || ''
    if (organizationId) {
      logDebug('[UsageService] Using stored organization ID', {
        organizationId: organizationId,
      })
      return organizationId
    }

    return ''
  }

  public hasOrganizationId(): boolean {
    const organizationId = configStore.get('GOV-ORG-ID') || ''
    return !!organizationId
  }

  private createUsageData(
    mcpHostId: string,
    organizationId: string,
    status: 'ACTIVE' | 'INACTIVE' | 'FAILED'
  ): McpUsageData {
    const { user, mcps } = getHostInfo()
    return {
      mcpHostId,
      organizationId,
      mcpVersion: packageJson.version,
      mcpOsName: os.platform(),
      mcps: JSON.stringify(mcps),
      status,
      userName: user.name,
      userEmail: user.email,
      date: String(new Date().toISOString().split('T')[0]), // it's used to make sure we track the mcp usage daily
    }
  }

  private async trackUsage(status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    try {
      const hostId = this.generateHostId()
      const organizationId = this.getOrganizationId()

      if (!organizationId) {
        logError(
          '[UsageService] Cannot track MCP usage - organization ID not available'
        )
        return
      }

      const usageData = this.createUsageData(hostId, organizationId, status)
      const stored = configStore.get(this.configKey) as McpUsageData | undefined

      // Check if we need to update usage (different from stored)
      const hasChanges =
        !stored ||
        Object.keys(usageData).some(
          (key) =>
            usageData[key as keyof McpUsageData] !==
            stored[key as keyof McpUsageData]
        )

      if (!hasChanges) {
        logDebug(
          `[UsageService] Skipping ${status} usage tracking - no changes`
        )
        return
      }
      logDebug('[UsageService] Before', { usageData })

      try {
        const res = await fetch(this.REST_API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: JSON.stringify({
            organizationId: organizationId,
            mcps: usageData.mcps,
            status,
            osName: usageData.mcpOsName,
            userFullName: usageData.userName,
            userEmail: usageData.userEmail,
          }),
        })
        const authResult = await res.json()
        logDebug('[UsageService] Success usage data', { authResult })
      } catch (err) {
        logDebug('[UsageService] Error usage data', { err })
      }

      logDebug('[UsageService] Saving usage data', { usageData })
      configStore.set(this.configKey, usageData)
      logInfo(
        `[UsageService] MCP server ${status === 'ACTIVE' ? 'start' : 'stop'} tracked successfully`
      )
    } catch (error) {
      configStore.set(this.configKey, { status: 'FAILED' })
      logError(
        `[UsageService] Failed to track MCP server ${status === 'ACTIVE' ? 'start' : 'stop'}`,
        { error }
      )
    }
  }

  async trackServerStart(): Promise<void> {
    await this.trackUsage('ACTIVE')
  }

  async trackServerStop(): Promise<void> {
    await this.trackUsage('INACTIVE')
  }

  public reset(): void {
    if (!this.intervalId) {
      return
    }
    clearInterval(this.intervalId)
    this.intervalId = null
  }
}

export const mcpUsageService = new McpUsageService()
