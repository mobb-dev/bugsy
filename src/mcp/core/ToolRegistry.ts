import { logDebug, logWarn } from '../Logger'

export type ToolDefinition = {
  name: string
  display_name?: string
  description: string
  inputSchema: unknown
}

export type Tool = {
  name: string
  definition: ToolDefinition
  execute: (args: unknown) => Promise<unknown>
}

export class ToolRegistry {
  private tools = new Map<string, Tool>()

  public registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      logWarn(`Tool ${tool.name} is already registered, overwriting`, {
        toolName: tool.name,
      })
    }

    this.tools.set(tool.name, tool)
    logDebug(`Tool registered: ${tool.name}`, {
      toolName: tool.name,
      description: tool.definition.description,
    })
  }

  public getTool(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  public getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition)
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
