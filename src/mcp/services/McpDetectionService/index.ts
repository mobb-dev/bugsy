import { logInfo, logWarn } from '../../Logger'
import { BaseMcpDetectionService } from './BaseMcpDetectionService'
import { CursorMcpDetectionService } from './CursorMcpDetectionService'
import type { IDE, WorkspaceResult } from './types'
import { VscodeMcpDetectionService } from './VscodeMcpDetectionService'

export function createMcpDetectionService({
  ide,
  userEmail,
  userName,
  organizationId,
}: {
  ide: IDE
  userEmail: string
  userName: string
  organizationId: string
}): BaseMcpDetectionService {
  switch (ide) {
    case 'cursor':
      return new CursorMcpDetectionService({
        userEmail,
        userName,
        organizationId,
      })
    case 'vscode':
      return new VscodeMcpDetectionService({
        userEmail,
        userName,
        organizationId,
      })
    default:
      throw new Error(`Unsupported IDE: ${ide}`)
  }
}

export function detectMCPServersForIDE({
  ideName,
  userEmail,
  userName,
  organizationId,
}: {
  ideName: IDE
  userEmail: string
  userName: string
  organizationId: string
}): WorkspaceResult[] {
  logInfo(
    `Detecting MCP servers for IDE: ${ideName} organization ${organizationId}`
  )

  try {
    const detectionService = createMcpDetectionService({
      ide: ideName,
      userEmail,
      userName,
      organizationId,
    })

    return detectionService.detect()
  } catch (error) {
    logWarn(`Unknown IDE: ${ideName}`)
    return []
  }
}

export type {
  IDE,
  MCPConfig,
  MCPServerConfig,
  WorkspaceInfo,
  WorkspaceResult,
} from './types'
