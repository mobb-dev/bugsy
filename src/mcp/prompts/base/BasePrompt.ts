import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { logDebug } from '../../Logger'
import { PromptArgument, PromptDefinition } from '../../types'

export abstract class BasePrompt {
  public abstract readonly name: string
  public abstract readonly description: string
  public abstract readonly arguments?: PromptArgument[]
  protected abstract readonly argumentsValidationSchema?: z.ZodSchema

  public getDefinition(): PromptDefinition {
    return {
      name: this.name,
      description: this.description,
      arguments: this.arguments,
    }
  }

  public async getPrompt(args?: unknown): Promise<GetPromptResult> {
    // Validate arguments if schema exists
    let validatedArgs: unknown = args
    if (this.argumentsValidationSchema) {
      validatedArgs = this.validateArguments(args)
      logDebug(`Prompt ${this.name} arguments validation successful`, {
        validatedArgs,
      })
    }

    // Generate the prompt messages
    const result = await this.generatePrompt(validatedArgs)
    logDebug(`Prompt ${this.name} generated successfully`)

    return result
  }

  protected validateArguments(args: unknown): unknown {
    if (!this.argumentsValidationSchema) {
      return args
    }

    try {
      // Treat undefined as empty object for validation
      const argsToValidate = args === undefined ? {} : args
      return this.argumentsValidationSchema.parse(argsToValidate)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors.map((e) => {
          const fieldPath = e.path.length > 0 ? e.path.join('.') : 'root'
          const message =
            e.message === 'Required'
              ? `Missing required argument '${fieldPath}'`
              : `Invalid value for '${fieldPath}': ${e.message}`
          return message
        })

        const errorMessage = `Invalid arguments: ${errorDetails.join(', ')}`
        throw new Error(errorMessage)
      }
      throw error
    }
  }

  protected abstract generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult>

  protected createUserMessage(text: string): GetPromptResult {
    return {
      description: this.description,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text' as const,
            text,
          },
        },
      ],
    }
  }
}
