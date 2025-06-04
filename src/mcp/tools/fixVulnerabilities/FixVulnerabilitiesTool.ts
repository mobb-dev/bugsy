import { FileUtils } from '../../../features/analysis/scm/FileUtils'
import { GitService } from '../../../features/analysis/scm/git/GitService'
import { log, logDebug, logInfo } from '../../Logger'
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
    const gitService = new GitService(args.path, log)
    const gitValidation = await gitService.validateRepository()
    let files: string[] = []
    if (!gitValidation.isValid) {
      logDebug(
        'Git repository validation failed, using all files in the repository',
        {
          path: args.path,
        }
      )
      files = FileUtils.getLastChangedFiles(args.path)
      logDebug('Found files in the repository', {
        files,
        fileCount: files.length,
      })
    } else {
      const gitResult = await gitService.getChangedFiles()
      files = gitResult.files
      if (files.length === 0) {
        const recentResult = await gitService.getRecentlyChangedFiles()
        files = recentResult.files
        logDebug(
          'No changes found, using recently changed files from git history',
          {
            files,
            fileCount: files.length,
            commitsChecked: recentResult.commitCount,
          }
        )
      } else {
        logDebug('Found changed files in the git repository', {
          files,
          fileCount: files.length,
        })
      }
    }

    // Get changed files (validation already done)

    // Check if there are files to process
    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No changed files found in the repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
          },
        ],
      }
    }

    try {
      // Process vulnerabilities
      const vulnerabilityFixService = new VulnerabilityFixService()
      const fixResult = await vulnerabilityFixService.processVulnerabilities(
        files,
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
        fileCount: files.length,
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
