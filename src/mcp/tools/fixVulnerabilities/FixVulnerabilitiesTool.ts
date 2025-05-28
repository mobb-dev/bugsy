import { logInfo } from '../../Logger'
import { GitService } from '../../services/GitService'
import { PathValidation } from '../../services/PathValidation'
import { VulnerabilityFixService } from './VulnerabilityFixService'

export class FixVulnerabilitiesTool {
  name = 'fix_vulnerabilities'
  display_name = 'fix_vulnerabilities'
  description =
    'Scans the current code changes and returns fixes for potential vulnerabilities'

  inputSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The path to the local git repository',
      },
    },
    required: ['path'],
  } as const

  async execute(args: { path: string }) {
    logInfo('Executing tool: fix_vulnerabilities', { path: args.path })

    if (!args.path) {
      throw new Error("Invalid arguments: Missing required parameter 'path'")
    }

    // Validate the path for security and existence
    const pathValidation = new PathValidation()
    const pathValidationResult = await pathValidation.validatePath(args.path)

    if (!pathValidationResult.isValid) {
      throw new Error(
        `Invalid path: potential security risk detected in path: ${pathValidationResult.error}`
      )
    }

    // Validate git repository - let validation errors bubble up as MCP errors
    const gitService = new GitService(args.path)
    const gitValidation = await gitService.validateRepository()
    if (!gitValidation.isValid) {
      throw new Error(gitValidation.error || 'Git repository validation failed')
    }

    // Get changed files (validation already done)
    const gitResult = await gitService.getChangedFiles()

    // Check if there are files to process
    if (gitResult.files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No changed files found in the git repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
          },
        ],
      }
    }

    try {
      // Process vulnerabilities
      const vulnerabilityFixService = new VulnerabilityFixService()
      const fixResult = await vulnerabilityFixService.processVulnerabilities(
        gitResult.files,
        args.path
      )

      const result = {
        content: [
          {
            type: 'text',
            text: fixResult,
          },
        ],
      }

      logInfo('Tool execution completed successfully', {
        resultLength: fixResult.length,
        fileCount: gitResult.files.length,
        result: result,
      })

      return result
    } catch (error) {
      // Return error as text content for processing errors (not validation errors)
      const errorResult = {
        content: [
          {
            type: 'text',
            text: (error as Error).message,
          },
        ],
      }

      logInfo('Tool execution failed', {
        error: (error as Error).message,
        result: errorResult,
      })

      return errorResult
    }
  }
}
