import { z } from 'zod'

import { logInfo } from '../../Logger'
import { McpGQLClient } from '../../services/McpGQLClient'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import { MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES } from '../toolNames'
import { CheckForNewAvailableFixesService } from './CheckForNewAvailableFixesService'

export class CheckForNewAvailableFixesTool extends BaseTool {
  name = MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES
  displayName = 'Check for New Available Fixes'
  // A detailed description to guide the LLM on when and how to invoke this tool.
  description = `Continuesly monitors your code and scans for new security vulnerabilities.

When to invoke:
• ALWAYS call this tool ONCE at the very end of every reasoning / code-generation session (after all code edits, linting, tests, etc.).
• Invoke when the user explicitly asks to "check for new fixes", "look for fresh patches", or similar.
• The repository must exist locally and be a valid Git repo with an 'origin' remote configured.

How to invoke:
• Required argument:
  – path (string): absolute path to the repository root.

Behaviour:
• If no new fixes are available, it returns a concise message indicating so.
• If fixes are found, it returns a human-readable summary including total count and severity breakdown.

Example payload:
{
  "path": "/home/user/my-project"
}`

  inputSchema = {
    type: 'object' as const,
    properties: {
      path: {
        type: 'string',
        description:
          'Full local path to the cloned git repository to check for new available fixes',
      },
    },
    required: ['path'],
  }

  inputValidationSchema = z.object({
    path: z
      .string()
      .describe(
        'Full local path to the cloned git repository to check for new available fixes'
      ),
  })

  private newFixesService: CheckForNewAvailableFixesService

  constructor() {
    super()
    this.newFixesService = new CheckForNewAvailableFixesService()
  }

  triggerScan(args: { path: string; gqlClient: McpGQLClient }) {
    this.newFixesService.triggerScan(args)
  }

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    // Validate the path for security and existence
    const pathValidationResult = await validatePath(args.path)

    if (!pathValidationResult.isValid) {
      throw new Error(
        `Invalid path: potential security risk detected in path: ${pathValidationResult.error}`
      )
    }
    const path = pathValidationResult.path

    // Use the service to determine if new fixes are available (placeholder logic)
    const resultText = await this.newFixesService.getFreshFixes({
      path,
    })

    logInfo('CheckForNewAvailableFixesTool execution completed', {
      resultText,
    })

    return this.createSuccessResponse(resultText)
  }
}
