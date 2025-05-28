import { z } from 'zod'

import { logDebug, logError, logInfo } from '../../Logger'

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
  protected abstract readonly inputSchema: z.ZodSchema

  public getDefinition(): ToolDefinition {
    return {
      name: this.name,
      display_name: this.displayName,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to the local git repository',
          },
        },
        required: ['path'],
      },
    }
  }

  public async execute(args: unknown): Promise<ToolResponse> {
    logInfo(`Executing tool: ${this.name}`, { args })

    // Validate input arguments - let validation errors bubble up as MCP errors
    const validatedArgs = this.validateInput(args)
    logDebug(`Tool ${this.name} input validation successful`, {
      validatedArgs,
    })

    // Allow tools to perform additional validation that should bubble up as MCP errors
    await this.validateAdditional(validatedArgs)

    try {
      // Execute the tool logic
      const result = await this.executeInternal(validatedArgs)
      logInfo(`Tool ${this.name} executed successfully`)

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logError(`Tool ${this.name} execution failed: ${errorMessage}`, {
        error,
        args,
      })

      // Return error as tool response content
      return this.createErrorResponse(errorMessage)
    }
  }

  protected validateInput(args: unknown): unknown {
    try {
      return this.inputSchema.parse(args)
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

  /**
   * Additional validation that should bubble up as MCP errors
   * Override this method in subclasses to add custom validation
   */
  protected async validateAdditional(_validatedArgs: unknown): Promise<void> {
    // Default implementation does nothing
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

  protected createErrorResponse(error: string): ToolResponse {
    return {
      content: [
        {
          type: 'text',
          text: error,
        },
      ],
    }
  }
}
