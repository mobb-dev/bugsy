import { z } from 'zod'

import { logDebug, logInfo } from '../../Logger'
import { getMcpGQLClient } from '../../services/McpGQLClient'

export type ToolResponse = {
  content: {
    type: string
    text: string
  }[]
}

export type ToolDefinition = {
  name: string
  display_name?: string
  description: string
  inputSchema: unknown
}
export abstract class BaseTool {
  public abstract readonly name: string
  public abstract readonly displayName?: string
  public abstract readonly description: string
  protected abstract readonly inputValidationSchema: z.ZodSchema
  protected abstract readonly inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required: string[]
  }

  public getDefinition(): ToolDefinition {
    return {
      name: this.name,
      display_name: this.displayName,
      description: this.description,
      inputSchema: this.inputSchema,
    }
  }

  public async execute(args: unknown): Promise<ToolResponse> {
    logInfo(`Executing tool: ${this.name}`, { args })

    logInfo(`Authenticating tool: ${this.name}`, { args })
    const mcpGqlClient = await getMcpGQLClient()
    const userInfo = await mcpGqlClient.getUserInfo()
    logDebug('Authenticated', { userInfo })

    // Validate input arguments - let validation errors bubble up as MCP errors
    const validatedArgs = this.validateInput(args)
    logDebug(`Tool ${this.name} input validation successful`, {
      validatedArgs,
    })

    // Execute the tool logic
    const result = await this.executeInternal(validatedArgs)
    logInfo(`Tool ${this.name} executed successfully`)

    return result
  }

  protected validateInput(args: unknown): unknown {
    try {
      return this.inputValidationSchema.parse(args)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors.map((e) => {
          const fieldPath = e.path.length > 0 ? e.path.join('.') : 'root'
          const message =
            e.message === 'Required'
              ? `Missing required parameter '${fieldPath}'`
              : `Invalid value for '${fieldPath}': ${e.message}`
          return message
        })

        const errorMessage = `Invalid arguments: ${errorDetails.join(', ')}`
        throw new Error(errorMessage)
      }
      throw error
    }
  }

  protected abstract executeInternal(
    validatedArgs: unknown
  ): Promise<ToolResponse>

  protected createSuccessResponse(text: string): ToolResponse {
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    }
  }
}
