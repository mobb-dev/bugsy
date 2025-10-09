import { logDebug, logWarn } from '../Logger'
import { BaseTool, ToolDefinition } from '../tools/base/BaseTool'

export class ToolRegistry {
  private tools = new Map<string, BaseTool>()

  public registerTool(tool: BaseTool): void {
    if (this.tools.has(tool.name)) {
      logWarn(`Tool ${tool.name} is already registered, overwriting`, {
        toolName: tool.name,
      })
    }

    this.tools.set(tool.name, tool)
    logDebug(`Tool registered: ${tool.name}`, {
      toolName: tool.name,
      description: tool.description,
    })
  }

  public getTool(name: string): BaseTool | undefined {
    return this.tools.get(name)
  }

  public getToolDefinition(name: string): ToolDefinition | undefined {
    return this.tools.get(name)?.getDefinition()
  }

  public getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.getDefinition())
  }

  public getToolNames(): string[] {
    return Array.from(this.tools.keys())
  }

  public hasTool(name: string): boolean {
    return this.tools.has(name)
  }

  public getToolCount(): number {
    return this.tools.size
  }
}
